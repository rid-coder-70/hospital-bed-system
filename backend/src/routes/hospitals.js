const express = require('express');
const db      = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, minBeds, hasIcu, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT
        id, name, address, lat, lng,
        total_beds, available_beds,
        icu_beds, available_icu_beds,
        contact_phone, contact_email,
        specialties, is_active, last_updated
      FROM hospitals
      WHERE is_active = TRUE
    `;
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR address ILIKE $${params.length})`;
    }
    if (minBeds) {
      params.push(parseInt(minBeds));
      query += ` AND available_beds >= $${params.length}`;
    }
    if (hasIcu === 'true') {
      query += ` AND available_icu_beds > 0`;
    }

    query += ' ORDER BY available_beds DESC';
    
    params.push(parseInt(limit), parseInt(offset));
    query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await db.query(query, params);

    res.json({
      data: rows.map(row => ({
        id               : row.id,
        name             : row.name,
        address          : row.address,
        location         : { lat: row.lat, lng: row.lng },
        totalBeds        : row.total_beds,
        availableBeds    : row.available_beds,
        icuBeds          : row.icu_beds,
        availableIcuBeds : row.available_icu_beds,
        contact          : { phone: row.contact_phone, email: row.contact_email },
        specialties      : row.specialties || [],
        isActive         : row.is_active,
        lastUpdated      : row.last_updated,
      })),
    });
  } catch (err) {
    console.error('GET /hospitals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT h.*,
        (SELECT json_agg(row_to_json(e) ORDER BY e.timestamp DESC)
         FROM (SELECT id, prev_available, new_available, prev_icu_available, new_icu_available, timestamp
               FROM bed_update_events
               WHERE hospital_id = h.id
               ORDER BY timestamp DESC LIMIT 10) e
        ) AS recent_events
       FROM hospitals h
       WHERE h.id = $1`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    const row = rows[0];
    res.json({
      data: {
        id               : row.id,
        name             : row.name,
        address          : row.address,
        location         : { lat: row.lat, lng: row.lng },
        totalBeds        : row.total_beds,
        availableBeds    : row.available_beds,
        icuBeds          : row.icu_beds,
        availableIcuBeds : row.available_icu_beds,
        contact          : { phone: row.contact_phone, email: row.contact_email },
        specialties      : row.specialties || [],
        isActive         : row.is_active,
        lastUpdated      : row.last_updated,
        recentEvents     : row.recent_events || [],
      },
    });
  } catch (err) {
    console.error('GET /hospitals/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authMiddleware, requireRole('admin', 'hospital_admin'), async (req, res) => {
  try {
    const {
      name, address, location,
      totalBeds, availableBeds,
      icuBeds, availableIcuBeds,
      contact, specialties,
    } = req.body;

    if (!name || !location?.lat || !location?.lng || totalBeds == null) {
      return res.status(400).json({ error: 'name, location, and totalBeds are required' });
    }

    const { rows } = await db.query(
      `INSERT INTO hospitals
        (name, address, lat, lng, total_beds, available_beds, icu_beds, available_icu_beds, contact_phone, contact_email, specialties)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [
        name,
        address || null,
        location.lat,
        location.lng,
        totalBeds,
        availableBeds ?? totalBeds,
        icuBeds ?? 0,
        availableIcuBeds ?? icuBeds ?? 0,
        contact?.phone || null,
        contact?.email || null,
        specialties || null,
      ]
    );

    res.status(201).json({ data: rows[0] });
  } catch (err) {
    console.error('POST /hospitals error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authMiddleware, requireRole('admin', 'hospital_admin'), async (req, res) => {
  try {
    const {
      name, address, contact, specialties, isActive,
    } = req.body;

    const { rows } = await db.query(
      `UPDATE hospitals SET
        name          = COALESCE($1, name),
        address       = COALESCE($2, address),
        contact_phone = COALESCE($3, contact_phone),
        contact_email = COALESCE($4, contact_email),
        specialties   = COALESCE($5, specialties),
        is_active     = COALESCE($6, is_active)
       WHERE id = $7
       RETURNING *`,
      [name, address, contact?.phone, contact?.email, specialties, isActive, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    console.error('PUT /hospitals/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.delete('/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  try {
    const { rowCount } = await db.query(
      'UPDATE hospitals SET is_active = FALSE WHERE id = $1',
      [req.params.id]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ data: { message: 'Hospital deactivated' } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
