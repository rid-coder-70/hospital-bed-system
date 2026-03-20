const express = require('express');
const db = require('../config/db');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { hospitalId, patientName, conditionDetails, etaMinutes } = req.body;
    if (!hospitalId || !etaMinutes) {
      return res.status(400).json({ error: 'hospitalId and etaMinutes are required' });
    }

    const { rows } = await db.query(
      `INSERT INTO dispatches (hospital_id, patient_name, condition_details, eta_minutes)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [hospitalId, patientName || 'Unknown', conditionDetails || 'Emergency', etaMinutes]
    );
    
    const newDispatch = rows[0];

    // Emit live alert to the hospital
    req.io.emit('incomingAmbulance', newDispatch);

    res.status(201).json({ data: newDispatch });
  } catch (err) {
    console.error('POST /dispatches error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:hospitalId', authMiddleware, requireRole('admin', 'hospital_admin'), async (req, res) => {
  try {
    if (req.user.role === 'hospital_admin' && req.user.hospitalId !== req.params.hospitalId) {
      return res.status(403).json({ error: 'Access denied to these dispatches' });
    }

    const { rows } = await db.query(
      `SELECT * FROM dispatches WHERE hospital_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [req.params.hospitalId]
    );
    
    res.json({ data: rows });
  } catch (err) {
    console.error('GET /dispatches error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id/reserve', authMiddleware, requireRole('admin', 'hospital_admin'), async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;

    await client.query('BEGIN');
    
    // Lock the dispatch to prevent double reservations
    const dispatchRes = await client.query('SELECT * FROM dispatches WHERE id = $1 FOR UPDATE', [id]);
    if (dispatchRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Dispatch not found' });
    }
    const dispatch = dispatchRes.rows[0];

    // Authorization check
    if (req.user.role === 'hospital_admin' && req.user.hospitalId !== dispatch.hospital_id) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Access denied' });
    }

    if (dispatch.status !== 'incoming') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Dispatch is already processed' });
    }

    // Attempt to lock and reserve a bed from the hospital
    const hospitalRes = await client.query('SELECT available_beds, id, name FROM hospitals WHERE id = $1 FOR UPDATE', [dispatch.hospital_id]);
    const hospital = hospitalRes.rows[0];

    if (hospital.available_beds <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'No beds left to reserve!' });
    }

    // Decrement the bed count mathematically
    const newAvail = hospital.available_beds - 1;
    
    await client.query(
      'UPDATE hospitals SET available_beds = $1 WHERE id = $2',
      [newAvail, dispatch.hospital_id]
    );

    // Update dispatch status to 'reserved'
    const updatedDispatch = await client.query(
      "UPDATE dispatches SET status = 'reserved' WHERE id = $1 RETURNING *",
      [id]
    );

    await client.query('COMMIT');

    // Announce to everyone that a bed was booked
    req.io.emit('bedUpdate', {
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      availableBeds: newAvail,
      // Pass these directly since we didn't query them, forcing frontend merge logic to kick in OR re-query them.
      // Better is just forcing the frontend to re-sync if missing elements. But let's just emit an explicit signal.
    });
    
    req.io.emit('dispatchUpdated', updatedDispatch.rows[0]);

    res.json({ data: updatedDispatch.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('PUT /dispatches/reserve error:', err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

router.put('/:id/status', authMiddleware, requireRole('admin', 'hospital_admin'), async (req, res) => {
  try {
     const { status } = req.body;
     const { id } = req.params;
     const { rows } = await db.query(
       "UPDATE dispatches SET status = $1 WHERE id = $2 RETURNING *",
       [status, id]
     );
     req.io.emit('dispatchUpdated', rows[0]);
     res.json({ data: rows[0] });
  } catch (err) {
     res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
