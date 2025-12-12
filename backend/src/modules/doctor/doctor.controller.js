const { validationResult } = require('express-validator');
const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: 'Invalid payload', details: errors.array() });

  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email: email.toLowerCase() });
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, doctor.passwordHash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (doctor.status !== 'Approved') {
      return res.status(403).json({ error: 'Pending Approval' });
    }

    const payload = { id: doctor._id, role: 'doctor', email: doctor.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '2h',
    });

    return res.json({ token, redirectTo: '/doctor/dashboard' });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
