'use strict';
const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const progressUpdateService = require('../services/ProgressUpdateService');
const tutoringSessionService = require('../services/TutoringSessionService');

const router = express.Router();

// Default student route: redirect to the dashboard
router.get('/', authenticateJWT, (req, res) => {
  return res.redirect('/student/studentdashboard');
});

// API endpoint to get profile data (returns JSON)
router.get("/profile/data", authenticateJWT, studentController.getProfile);

// Endpoint to update student profile
router.put("/updateProfile", authenticateJWT, studentController.updateProfile);

// Endpoint to change password
router.put("/changePassword", authenticateJWT, studentController.changePassword);

// Fetch student's login streak
router.get('/login-streak', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await progressUpdateService.getCurrentStreak(userId);
    res.status(200).json({ message: 'Login streak fetched successfully', streak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch student's tutoring session bookings (for calendar events)
router.get('/bookings', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ studentId });
    // Convert sessions to FullCalendar event format
    const events = sessions.map(session => ({
      title: session.subject,
      start: session.sessionDate 
    }));
    res.status(200).json({ message: 'Bookings fetched successfully', events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve Student Dashboard (HTML page)
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});

// Serve Student Profile Page (HTML)
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentProfile.html'));
});

// Serve Student Find Sessions Page (HTML)
router.get('/findSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentFindSession.html'));
});

// Serve Student Create Tutoring Sessions Page (HTML)
router.get('/tutoringSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentTutoringSessions.html'));
});

// Serve Student Chatrooms Page (HTML)
router.get('/chat', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentChatrooms.html'));
});

module.exports = router;
