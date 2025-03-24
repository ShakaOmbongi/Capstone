'use strict';

const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/adminAuthController');

// Public Admin Login Route
router.post('/login', adminAuthController.login);

module.exports = router;
