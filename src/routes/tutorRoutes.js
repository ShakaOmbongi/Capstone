'use strict';
const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { User, TutoringSession } = require('../entities');

const router = express.Router();

// Tutor Dashboard: Serve the tutor dashboard HTML page
router.get('/tutordashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
});

module.exports = router;
