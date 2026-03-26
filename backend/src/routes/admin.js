const express = require('express');
const bcrypt  = require('bcryptjs');
const db      = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();


router.use(authMiddleware, requireRole('admin'));


router.get('/stats', async (_req, res) => {
  try {
    const [usersRes, hospitalsRes, bedsRes, requestsRes] = await Promise.all([
      db.query(`SELECT role, COUNT(*) AS count FROM users GROUP BY role`),
      db.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE is_active) AS active FROM hospitals`),
      db.query(`SELECT SUM(total_beds) AS total_beds, SUM(available_beds) AS available_beds,
                       SUM(icu_beds) AS total_icu, SUM(available_icu_beds) AS available_icu FROM hospitals WHERE is_active = TRUE`),
      db.query(`SELECT status, COUNT(*) AS count FROM ambulance_requests GROUP BY status`),
    ]);

    const userCounts = {};
    usersRes.rows.forEach(r => { userCounts[r.role] = parseInt(r.count); });

    res.json({
      data: {
        users: {
          total: Object.values(userCounts).reduce((a, b) => a + b, 0),
          byRole: userCounts,
        },
        hospitals: {
          total: parseInt(hospitalsRes.rows[0].total),
          active: parseInt(hospitalsRes.rows[0].active),
        },
        beds: bedsRes.rows[0],
        requests: requestsRes.rows,
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/users', async (req, res) => {
  try {
    const { role, limit = 50, offset = 0, search } = req.query;
    let query = `
      SELECT u.id, u.name, u.email, u.role, u.hospital_id, u.created_at, h.name AS hospital_name
      FROM users u
      LEFT JOIN hospitals h ON h.id = u.hospital_id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      params.push(role);
      query += ` AND u.role = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (u.name ILIKE $${params.length} OR u.email ILIKE $${params.length})`;
    }

    params.push(parseInt(limit), parseInt(offset));
    query += ` ORDER BY u.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const { rows } = await db.query(query, params);
    const countRes = await db.query(`SELECT COUNT(*) FROM users`);

    res.json({ data: rows, total: parseInt(countRes.rows[0].count) });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/users/:id', async (req, res) => {
  try {
    const { role, hospitalId } = req.body;
    const allowedRoles = ['user', 'admin', 'hospital_admin'];
    if (role && !allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const { rows } = await db.query(
      `UPDATE users SET
         role       = COALESCE($1, role),
         hospital_id = $2,
         updated_at = NOW()
       WHERE id = $3
       RETURNING id, name, email, role, hospital_id, updated_at`,
      [role, hospitalId || null, req.params.id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.delete('/users/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ data: { message: 'User deleted' } });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, hospitalId } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'name, email, password, and role are required' });
    }
    const allowedRoles = ['user', 'admin', 'hospital_admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role, hospital_id)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, name, email, role, hospital_id, created_at`,
      [name, email, hash, role, hospitalId || null]
    );

    res.status(201).json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.get('/hospitals', async (_req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT h.*, COUNT(u.id) AS admin_count
      FROM hospitals h
      LEFT JOIN users u ON u.hospital_id = h.id AND u.role = 'hospital_admin'
      GROUP BY h.id
      ORDER BY h.created_at DESC
    `);
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});



router.put('/hospitals/:id/toggle', async (req, res) => {
  try {
    const { rows } = await db.query(
      `UPDATE hospitals SET is_active = NOT is_active WHERE id = $1 RETURNING id, name, is_active`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Hospital not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/pending-admins', async (_req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.hospital_id, u.status, u.created_at,
              h.name AS hospital_name
       FROM users u
       LEFT JOIN hospitals h ON h.id = u.hospital_id
       WHERE u.role = 'hospital_admin' AND u.status = 'pending'
       ORDER BY u.created_at ASC`
    );
    res.json({ data: rows });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/approve-admin/:id', async (req, res) => {
  try {
    const { hospitalId } = req.body;
    if (!hospitalId) return res.status(400).json({ error: 'hospitalId is required for approval' });

    const hosp = await db.query('SELECT id, name FROM hospitals WHERE id = $1 AND is_active = TRUE', [hospitalId]);
    if (hosp.rows.length === 0) return res.status(404).json({ error: 'Hospital not found or inactive' });

    const { rows } = await db.query(
      `UPDATE users SET status = 'approved', hospital_id = $1, updated_at = NOW()
       WHERE id = $2 AND role = 'hospital_admin'
       RETURNING id, name, email, role, hospital_id, status`,
      [hospitalId, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Pending admin not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    console.error('Approve admin error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/reject-admin/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `UPDATE users SET status = 'rejected', updated_at = NOW()
       WHERE id = $1 AND role = 'hospital_admin'
       RETURNING id, name, email, status`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Pending admin not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
