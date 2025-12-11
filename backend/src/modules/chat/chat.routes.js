const express = require("express");
const router = express.Router();
const { authenticate } = require("../../middlewares/auth.middleware");

/**
 * @route   GET /api/chat
 * @desc    Get chat messages
 * @access  Private
 */
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Chat routes - Coming soon",
  });
});

module.exports = router;
