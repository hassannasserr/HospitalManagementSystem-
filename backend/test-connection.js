require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/hospital-management";

console.log("Testing MongoDB connection...");
console.log("MongoDB URI:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connection successful!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("\nMake sure MongoDB is running:");
    console.error("  - Windows: net start MongoDB");
    console.error("  - Or run: mongod");
    process.exit(1);
  });
