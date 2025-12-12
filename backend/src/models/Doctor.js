// models/Doctor.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {   // store plain before hashing
      type: String,
      required: true,
      select: false,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    }
  },
  { timestamps: true }
);

doctorSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.passwordHash = await bcrypt.hash(this.password, 10);
  this.password = undefined;
  next();
});

doctorSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

module.exports = mongoose.model('Doctor', doctorSchema);
