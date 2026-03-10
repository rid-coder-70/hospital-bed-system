const express = require('express');
const db      = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/request', async (req, res) => {
  try {
    const {
      patientLocation, requiredIcu, priority,
      patientName, patientPhone, notes,
    } = req.body;

    if (!patientLocation?.lat || !patientLocation?.lng) {
      return res.status(400).json({ error: 'patientLocation with lat/lng is required' });
    }

    // Find nearest hospitals using Haversine-approximation (pure SQL)
    const { rows: hospitals } = await db.query(`
      SELECT
        id, name, address, lat, lng,
        available_beds, available_icu_beds,
        -- Haversine distance approximation in km
        (6371 * acos(
          cos(radians($1)) * cos(radians(lat)) *
          cos(radians(lng) - radians($2)) +
          sin(radians($1)) * sin(radians(lat))
        )) AS distance_km
      FROM hospitals
      WHERE is_active = TRUE
        AND available_beds > 0
        ${requiredIcu ? 'AND available_icu_beds > 0' : ''}
      ORDER BY distance_km ASC
      LIMIT 5
    `, [patientLocation.lat, patientLocation.lng]);

    // Create the request record
    const { rows } = await db.query(
      `INSERT INTO ambulance_requests
         (patient_lat, patient_lng, patient_name, patient_phone, required_icu, priority, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        patientLocation.lat,
        patientLocation.lng,
        patientName || null,
        patientPhone || null,
        !!requiredIcu,
        priority || 'medium',
        notes || null,
      ]
    );

    const requestId = rows[0].id;

    // Emit real-time event to dispatchers
    req.io.emit('newAmbulanceRequest', {
      requestId,
      patientLocation,
      priority: priority || 'medium',
      requiredIcu: !!requiredIcu,
      suggestedHospitals: hospitals,
    });

    res.status(201).json({
      data: {
        requestId,
        suggestedHospitals: hospitals.map(h => ({
          id               : h.id,
          name             : h.name,
          address          : h.address,
          distanceKm       : parseFloat(h.distance_km.toFixed(2)),
          estimatedTimeMin : Math.round((h.distance_km / 40) * 60), // ~40 km/h avg
          availableBeds    : h.available_beds,
          availableIcuBeds : h.available_icu_beds,
        })),
      },
    });
  } catch (err) {
    console.error('POST /ambulance/request error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/ambulance/nearest ────────────────────────────────
// Find nearest available ambulance for a given lat/lng
router.get('/nearest', async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ error: 'lat and lng query parameters are required' });
    }

    const { rows } = await db.query(`
      SELECT
        id, vehicle_number, driver_name, driver_phone,
        current_lat, current_lng, status,
        (6371 * acos(
          cos(radians($1)) * cos(radians(current_lat)) *
          cos(radians(current_lng) - radians($2)) +
          sin(radians($1)) * sin(radians(current_lat))
        )) AS distance_km
      FROM ambulances
      WHERE status = 'available'
        AND current_lat IS NOT NULL
        AND current_lng IS NOT NULL
      ORDER BY distance_km ASC
      LIMIT 1
    `, [parseFloat(lat), parseFloat(lng)]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No available ambulances found' });
    }

    const amb = rows[0];
    res.json({
      data: {
        ambulanceId    : amb.id,
        vehicleNumber  : amb.vehicle_number,
        driverName     : amb.driver_name,
        driverPhone    : amb.driver_phone,
        status         : amb.status,
        distanceKm     : parseFloat(amb.distance_km.toFixed(2)),
        etaMinutes     : Math.round((amb.distance_km / 40) * 60),
        location       : { lat: amb.current_lat, lng: amb.current_lng },
      },
    });
  } catch (err) {
    console.error('GET /ambulance/nearest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/ambulance/requests ───────────────────────────────
// List ambulance requests (admin/dispatcher)
router.get('/requests', authMiddleware, requireRole('admin', 'dispatcher'), async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT r.*, h.name AS hospital_name, a.vehicle_number
      FROM ambulance_requests r
      LEFT JOIN hospitals h  ON h.id = r.assigned_hospital
      LEFT JOIN ambulances a ON a.id = r.assigned_ambulance
    `;
    const params = [];
    if (status) {
      params.push(status);
      query += ` WHERE r.status = $${params.length}`;
    }
    params.push(parseInt(limit), parseInt(offset));
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await db.query(query, params);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── PUT /api/ambulance/requests/:id ──────────────────────────
// Update ambulance request status (assign ambulance/hospital)
router.put('/requests/:id', authMiddleware, requireRole('admin', 'dispatcher'), async (req, res) => {
  try {
    const { status, assignedAmbulance, assignedHospital } = req.body;

    const { rows } = await db.query(
      `UPDATE ambulance_requests
       SET status             = COALESCE($1, status),
           assigned_ambulance = COALESCE($2, assigned_ambulance),
           assigned_hospital  = COALESCE($3, assigned_hospital),
           updated_at         = NOW()
       WHERE id = $4
       RETURNING *`,
      [status, assignedAmbulance, assignedHospital, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Request not found' });

    // If ambulance assigned, update its status to busy
    if (assignedAmbulance) {
      await db.query(
        "UPDATE ambulances SET status = 'busy' WHERE id = $1",
        [assignedAmbulance]
      );
    }

    req.io.emit('ambulanceUpdate', { requestId: req.params.id, ...rows[0] });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── GET /api/ambulance/fleet ──────────────────────────────────
// List all ambulances
router.get('/fleet', authMiddleware, requireRole('admin', 'dispatcher'), async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT a.*, h.name AS base_hospital_name
       FROM ambulances a
       LEFT JOIN hospitals h ON h.id = a.hospital_id
       ORDER BY a.vehicle_number`
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
