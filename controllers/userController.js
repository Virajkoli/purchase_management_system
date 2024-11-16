const User = require('../models/user'); // Add this if it's missing
const bcrypt = require('bcryptjs');


const createAdmin = async (req, res) => {
    const { name, email, role, password } = req.body;
  
    // Validate fields
    if (!name || !email || !role || !password) {
      return res.status(400).send('All fields are required');
    }
  
    // Validate role
    const validRoles = ['Superadmin', 'Admin', 'Teacher', 'HOD', 'Principal'];
    if (!validRoles.includes(role)) {
      return res.status(400).send('Invalid role');
    }
  
    // Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already in use');
    }
  
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    // Create the new admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role, // This is now validated as a string
      permissions: [], // You can add role-based permissions here
    });
  
    try {
      await newAdmin.save();
      res.status(201).send('Admin created successfully');
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
  
  module.exports = {
    createAdmin,
  };
  