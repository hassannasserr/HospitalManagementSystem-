// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const doctorAuth = require('./routes/doctorAuth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', doctorAuth);

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  app.listen(process.env.PORT || 3000, () => console.log('Server running'));
};

start().catch(err => {
  console.error('Failed to start', err);
});
