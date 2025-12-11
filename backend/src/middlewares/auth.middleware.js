const { verifyToken } = require("../config/jwt");
const Patient = require("../modules/patient/patient.model");

/**
 * Middleware to authenticate user using JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Check if user still exists
      const user = await Patient.findById(decoded.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Account is deactivated",
        });
      }

      // Attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/**
 * Middleware to check if user has required role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
