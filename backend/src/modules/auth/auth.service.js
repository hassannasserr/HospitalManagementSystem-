const Patient = require("../patient/patient.model");
const { generateAuthTokens } = require("../../config/jwt");

/**
 * Register a new patient
 * @param {Object} userData - User registration data
 * @returns {Object} Created user and tokens
 */
const registerPatient = async (userData) => {
  try {
    const { fullname, email, password, gender, dateOfBirth } = userData;

    // Check if user already exists
    const existingUser = await Patient.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Validate date of birth (at least 18 years old)
    const dob = new Date(dateOfBirth);
    const age = Math.floor(
      (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    if (age < 18) {
      throw new Error("You must be at least 18 years old to register");
    }

    // Validate password strength
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error(
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character"
      );
    }

    // Create new patient
    const patient = new Patient({
      fullname: fullname.trim(),
      email: email.toLowerCase().trim(),
      password,
      gender,
      dateOfBirth: dob,
    });

    await patient.save();

    // Generate tokens
    const tokens = generateAuthTokens(patient);

    // Return user without password
    const userResponse = patient.getPublicProfile();

    return {
      user: userResponse,
      ...tokens,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Login a patient
 * @param {String} email - User email
 * @param {String} password - User password
 * @returns {Object} User and tokens
 */
const loginPatient = async (email, password) => {
  try {
    // Find user by email and include password field
    const patient = await Patient.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!patient) {
      throw new Error("Invalid email or password");
    }

    // Check if account is active
    if (!patient.isActive) {
      throw new Error("Account is deactivated. Please contact support");
    }

    // Verify password
    const isPasswordValid = await patient.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update last login
    patient.lastLogin = new Date();
    await patient.save();

    // Generate tokens
    const tokens = generateAuthTokens(patient);

    // Return user without password
    const userResponse = patient.getPublicProfile();

    return {
      user: userResponse,
      ...tokens,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile by ID
 * @param {String} userId - User ID
 * @returns {Object} User profile
 */
const getUserProfile = async (userId) => {
  try {
    const patient = await Patient.findById(userId);
    if (!patient) {
      throw new Error("User not found");
    }
    return patient.getPublicProfile();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  registerPatient,
  loginPatient,
  getUserProfile,
};
