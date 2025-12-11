const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   GET /api/prescriptions
 * @desc    Get prescriptions
 * @access  Private
 */
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Prescription routes - Coming soon",
  });
});

module.exports = router;
