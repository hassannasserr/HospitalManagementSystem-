const authService = require("./auth.service");

/**
 * Register a new patient
 * @route POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { fullname, email, password, gender, dateOfBirth } = req.body;

    // Validate required fields
    if (!fullname || !email || !password || !gender || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
        errors: {
          fullname: !fullname ? "Full name is required" : undefined,
          email: !email ? "Email is required" : undefined,
          password: !password ? "Password is required" : undefined,
          gender: !gender ? "Gender is required" : undefined,
          dateOfBirth: !dateOfBirth ? "Date of birth is required" : undefined,
        },
      });
    }

    // Call service to register patient
    const result = await authService.registerPatient({
      fullname,
      email,
      password,
      gender,
      dateOfBirth,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle specific errors
    if (error.message === "Email already registered") {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered. Please use a different email or try logging in.",
      });
    }

    if (error.message.includes("password")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message.includes("18 years")) {
      return res.status(400).json({
        success: false,
        message: "You must be at least 18 years old to register",
      });
    }

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check your input.",
        errors,
      });
    }

    // Handle duplicate key errors (MongoDB)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "This email is already registered. Please use a different email.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};

/**
 * Login a patient
 * @route POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Call service to login patient
    const result = await authService.loginPatient(email, password);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    console.error("Login error:", error.message);

    if (
      error.message === "Invalid email or password" ||
      error.message.includes("deactivated")
    ) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get current user profile
 * @route GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    const user = await authService.getUserProfile(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    if (error.message === "User not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
