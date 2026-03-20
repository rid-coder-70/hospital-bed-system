const express = require('express');
const axios   = require('axios');
const db      = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

router.get('/availability', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        SUM(total_beds)          AS "totalBeds",
        SUM(available_beds)      AS "availableBeds",
        SUM(icu_beds)            AS "totalIcuBeds",
        SUM(available_icu_beds)  AS "availableIcuBeds",
        MAX(last_updated)        AS "lastUpdated",
        COUNT(*)                 AS "totalHospitals",
        COUNT(*) FILTER (WHERE available_beds > 0) AS "hospitalsWithBeds"
      FROM hospitals
      WHERE is_active = TRUE
    `);

    res.json({ data: rows[0] });
  } catch (err) {
    console.error('GET /beds/availability error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.put('/update', authMiddleware, requireRole('admin', 'hospital_admin'), async (req, res) => {
  const client = await db.connect();
  try {
    const { hospitalId, availableBeds, availableIcuBeds, wardDetails, updatedAt } = req.body;

    if (!hospitalId) {
      return res.status(400).json({ error: 'hospitalId is required' });
    }


    if (req.user.role === 'hospital_admin' && req.user.hospitalId !== hospitalId) {
      return res.status(403).json({ error: 'You can only update your own hospital\'s inventory' });
    }

    await client.query('BEGIN');

    const current = await client.query(
      'SELECT available_beds, available_icu_beds, total_beds, icu_beds FROM hospitals WHERE id = $1 FOR UPDATE',
      [hospitalId]
    );
    if (current.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Hospital not found' });
    }

    const prev = current.rows[0];
    const newAvail    = availableBeds    ?? prev.available_beds;
    const newIcuAvail = availableIcuBeds ?? prev.available_icu_beds;

    if (newAvail < 0 || newAvail > prev.total_beds) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `availableBeds must be between 0 and ${prev.total_beds}` });
    }
    if (newIcuAvail < 0 || newIcuAvail > prev.icu_beds) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: `availableIcuBeds must be between 0 and ${prev.icu_beds}` });
    }

    const updated = await client.query(
      `UPDATE hospitals
       SET available_beds = $1, available_icu_beds = $2, ward_details = $3, last_updated = $4
       WHERE id = $5
       RETURNING id, name, available_beds, available_icu_beds, total_beds, icu_beds, ward_details, last_updated`,
      [newAvail, newIcuAvail, JSON.stringify(wardDetails || []), updatedAt || new Date().toISOString(), hospitalId]
    );

    await client.query(
      `INSERT INTO bed_update_events
         (hospital_id, prev_available, new_available, prev_icu_available, new_icu_available, updated_by)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [hospitalId, prev.available_beds, newAvail, prev.available_icu_beds, newIcuAvail, req.user.id]
    );

    await client.query('COMMIT');

    const payload = updated.rows[0];

    req.io.emit('bedUpdate', {
      hospitalId      : payload.id,
      hospitalName    : payload.name,
      availableBeds   : payload.available_beds,
      availableIcuBeds: payload.available_icu_beds,
      totalBeds       : payload.total_beds,
      icuBeds         : payload.icu_beds,
      wardDetails     : payload.ward_details,
      lastUpdated     : payload.last_updated,
    });

    res.json({
      data: {
        hospitalId       : payload.id,
        availableBeds    : payload.available_beds,
        availableIcuBeds : payload.available_icu_beds,
        wardDetails      : payload.ward_details,
        updatedAt        : payload.last_updated,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PUT /beds/update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.get('/history/:hospitalId', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const { rows } = await db.query(
      `SELECT id, hospital_id, prev_available, new_available,
              prev_icu_available, new_icu_available, timestamp
       FROM bed_update_events
       WHERE hospital_id = $1
       ORDER BY timestamp DESC
       LIMIT $2`,
      [req.params.hospitalId, parseInt(limit)]
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/route', async (req, res) => {
  try {
    const { patientLocation, requiredIcu, priority } = req.body;

    if (!patientLocation?.lat || !patientLocation?.lng) {
      return res.status(400).json({ error: 'patientLocation with lat/lng is required' });
    }

    const { rows: hospitals } = await db.query(`
      SELECT id, name, lat, lng, available_beds, available_icu_beds, total_beds, icu_beds
      FROM hospitals WHERE is_active = TRUE
    `);

    const aiResponse = await axios.post(`${AI_SERVICE_URL}/route`, {
      patient_location: patientLocation,
      required_icu    : requiredIcu || false,
      priority        : priority || 'medium',
      hospitals       : hospitals.map(h => ({
        id               : h.id,
        name             : h.name,
        lat              : h.lat,
        lng              : h.lng,
        available_beds   : h.available_beds,
        available_icu_beds: h.available_icu_beds,
        total_beds       : h.total_beds,
        icu_beds         : h.icu_beds,
      })),
    }, { timeout: 10000 });

    res.json({ data: aiResponse.data });
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
      return res.status(503).json({ error: 'AI routing service unavailable' });
    }
    console.error('POST /beds/route error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
