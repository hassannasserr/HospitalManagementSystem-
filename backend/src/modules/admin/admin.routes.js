const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   GET /api/admin
 * @desc    Admin routes
 * @access  Private
 */
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin routes - Coming soon",
  });
});

module.exports = router;
