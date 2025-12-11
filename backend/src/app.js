const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

// Import routes
const authRoutes = require("./modules/auth/auth.routes");
const patientRoutes = require("./modules/patient/patient.routes");
const doctorRoutes = require("./modules/doctor/doctor.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const prescriptionRoutes = require("./modules/prescription/prescription.routes");
const pharmacyRoutes = require("./modules/pharmacy/pharmacy.routes");
const orderRoutes = require("./modules/orders/order.routes");
const chatRoutes = require("./modules/chat/chat.routes");
const notificationRoutes = require("./modules/notifications/notification.routes");

// Import middlewares
const { errorHandler } = require("./middlewares/error.middleware");

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:4200",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/pharmacy", pharmacyRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler - must come after all routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app;
