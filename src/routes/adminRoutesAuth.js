'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const adminAuthController = require('../controllers/adminAuthController');

// Serve the admin login HTML page
router.get('/adminlogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/LandingUI/adminlogin.html'));
});

// POST endpoint for admin login (changed from '/admin' to '/login')
router.post('/login', adminAuthController.login);

module.exports = router;
