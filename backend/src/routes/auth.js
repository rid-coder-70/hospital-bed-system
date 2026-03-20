const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
const z        = require('zod');
const rateLimit = require('express-rate-limit');

const router = express.Router();
const SALT_ROUNDS = 10;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: 'Too many requests. Please try again in 15 minutes.' }
});


const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['user', 'hospital_admin']).optional(),
  hospitalId: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});


router.post('/signup', authLimiter, async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }
    let { name, email, password, role, hospitalId } = parsed.data;
    const userRole = role || 'user';
    const userStatus = userRole === 'hospital_admin' ? 'pending' : 'approved';

    if (hospitalId === "") hospitalId = null;


    if (hospitalId) {
      const hosp = await db.query('SELECT id, name FROM hospitals WHERE id = $1 AND is_active = TRUE', [hospitalId]);
      if (hosp.rows.length === 0) {
        return res.status(400).json({ error: 'Selected hospital not found or is inactive' });
      }
    }

    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const { rows } = await db.query(
      `INSERT INTO users (name, email, password_hash, role, hospital_id, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, role, hospital_id, status, created_at`,
      [name, email, passwordHash, userRole, hospitalId || null, userStatus]
    );

    const user = rows[0];

    if (userStatus === 'pending') {
      return res.status(201).json({
        data: { pending: true, message: 'Your hospital admin account request has been submitted. Please wait for system administrator approval.' }
      });
    }
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, hospitalId: user.hospital_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({ data: { user, token } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/login', authLimiter, async (req, res) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.errors[0].message });
    }
    const { email, password } = parsed.data;

    const { rows } = await db.query(
      `SELECT u.*, h.name AS hospital_name
       FROM users u
       LEFT JOIN hospitals h ON h.id = u.hospital_id
       WHERE u.email = $1`,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending approval by the system administrator. Please check back later.' });
    }
    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account application was rejected. Please contact the system administrator.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, hospitalId: user.hospital_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...safeUser } = user;
    res.json({ data: { user: safeUser, token } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/me', require('../middleware/auth').authMiddleware, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT u.id, u.name, u.email, u.role, u.hospital_id, u.created_at, h.name AS hospital_name
       FROM users u
       LEFT JOIN hospitals h ON h.id = u.hospital_id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
