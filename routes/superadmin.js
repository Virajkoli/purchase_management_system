// routes/superadmin.js
const express = require('express');
const router = express.Router();
const superadminController = require('../controllers/userController');

// Route to create a new admin
router.post('/create-admin', superadminController.createAdmin);

module.exports = router;
