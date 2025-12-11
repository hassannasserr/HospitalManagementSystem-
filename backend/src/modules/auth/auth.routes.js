const express = require("express");
const router = express.Router();
const authController = require("./auth.controller");
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   POST /api/auth/register
 * @desc    Register a new patient
 * @access  Public
 */
router.post("/register", authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login patient
 * @access  Public
 */
router.post("/login", authController.login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authenticate, authController.getProfile);

module.exports = router;
