// src/routes/studentRoutes.js
const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Student dashboard page
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});

// Serve Student Profile page
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentProfile.html'));
});

// Serve Student Bookings page
router.get('/bookings', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentBookings.html'));
});

// Serve Student Chatrooms page
router.get('/chat', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentChatrooms.html'));
});

// Serve Tutoring Sessions page
router.get('/tutoring-sessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/TutoringSessions.html'));
});

module.exports = router;
