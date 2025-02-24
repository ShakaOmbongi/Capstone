const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');//import

const router = express.Router();

// Protected Tutor Dashboard Route
router.get('/tutordashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
});

// Protected Tutor Profile Route
router.get('/tutorprofile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutorprofile.html'));
});

// Protected Tutor Schedule Route
router.get('/tutorschedule', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutorschedule.html'));
});


module.exports = router;
