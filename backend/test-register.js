require("dotenv").config();
const axios = require("axios");

const API_URL = "http://localhost:5000/api";

const testData = {
  fullname: "Test User",
  email: `test${Date.now()}@example.com`,
  password: "Test@123",
  gender: "Male",
  dateOfBirth: "1995-05-15",
};

console.log("Testing registration endpoint...");
console.log("Test data:", testData);

axios
  .post(`${API_URL}/auth/register`, testData)
  .then((response) => {
    console.log("\n✅ Registration successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
  })
  .catch((error) => {
    if (error.response) {
      console.log("\n❌ Registration failed!");
      console.log("Status:", error.response.status);
      console.log("Error:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log("\n❌ No response from server!");
      console.log("Make sure backend is running on http://localhost:5000");
    } else {
      console.log("\n❌ Error:", error.message);
    }
  });
