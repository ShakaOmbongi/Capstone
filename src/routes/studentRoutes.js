'use strict';
const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const progressUpdateService = require('../services/ProgressUpdateService');
const tutoringSessionService = require('../services/TutoringSessionService');
const tutoringSessionController = require('../controllers/tutoringSessionController'); // path

const router = express.Router();

// Redirect to student dashboard
router.get('/', authenticateJWT, (req, res) => {
  res.redirect('/student/studentdashboard');
});

// Get student profile data (JSON)
router.get("/profile/data", authenticateJWT, studentController.getProfile);

// Update student profile (JSON)
router.put("/updateProfile", authenticateJWT, studentController.updateProfile);

// Change student password
router.put("/changePassword", authenticateJWT, studentController.changePassword);

// Get student's login streak
router.get('/login-streak', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await progressUpdateService.getCurrentStreak(userId);
    res.status(200).json({ message: 'Login streak fetched successfully', streak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student's tutoring session  (for calendar)
router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ studentId });
    // Map sessions to calendar event format
    const events = sessions.map(session => ({
      title: session.subject,
      start: session.sessionDate
    }));
    res.status(200).json({ message: 'sessions fetched successfully', events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static HTML pages
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentProfile.html'));
});
router.get('/findSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentFindSession.html'));
});
router.get('/tutoringSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentTutoringSessions.html'));
});
router.get('/chat', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentChatrooms.html'));
});
router.get('/About', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentAbout.html'));
});

// Student creates a tutoring session
router.post('/sessions/create', authenticateJWT, tutoringSessionController.createSession);

// Student fetches all tutoring sessions
router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ studentId });
    res.status(200).json({
      status: 'success',
      message: 'Sessions fetched successfully',
      sessions
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

module.exports = router;
