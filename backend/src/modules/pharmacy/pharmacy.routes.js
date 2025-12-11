const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   GET /api/pharmacy
 * @desc    Get pharmacy items
 * @access  Public
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Pharmacy routes - Coming soon",
  });
});

module.exports = router;
