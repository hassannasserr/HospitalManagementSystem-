const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   GET /api/patients
 * @desc    Get all patients (admin only)
 * @access  Private
 */
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Patient routes - Coming soon",
  });
});

module.exports = router;
