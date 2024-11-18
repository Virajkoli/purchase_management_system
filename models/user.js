// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// Reference Role schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['Superadmin', 'Admin', 'Teacher/Lab Assistant', 'HOD', 'Office Superintendent', 'Registrar', 'Principal'] },
  permissions: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('User', userSchema);
