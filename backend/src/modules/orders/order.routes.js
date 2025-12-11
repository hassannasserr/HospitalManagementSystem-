const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   GET /api/orders
 * @desc    Get user orders
 * @access  Private
 */
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Order routes - Coming soon",
  });
});

module.exports = router;
