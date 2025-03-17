const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');//import

const router = express.Router();

// Protected Student Dashboard Route
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});

// Protected Student Profile Route
router.get('/studentprofile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentprofile.html'));
});

// Protected Student Schedule Route
router.get('/studentschedule', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentschedule.html'));
});

// Protected Student Match Profiles Route
router.get('/studentmatches', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentmatches.html'));
});

module.exports = router;
