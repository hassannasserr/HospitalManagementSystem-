const express = require('express');
const { body } = require('express-validator');
const { loginDoctor } = require('../controllers/doctorAuthController');

const router = express.Router();

router.post(
  '/doctor/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6 characters'),
  ],
  loginDoctor
);

module.exports = router;
