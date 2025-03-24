'use strict';
const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');
const tutorController = require('../controllers/tutorController'); // Ensure this exists and is adapted for tutors
const tutoringSessionService = require('../services/TutoringSessionService');
const tutoringSessionController = require('../controllers/tutoringSessionController'); // Likely reused from student version

const router = express.Router();

// Redirect to tutor dashboard
router.get('/tutordashboard', authenticateJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
  });
  

// Get tutor profile data (JSON)
router.get("/profile/data", authenticateJWT, tutorController.getProfile);

// Update tutor profile (JSON)
router.put("/updateProfile", authenticateJWT, tutorController.updateProfile);

// Change tutor password
router.put("/changePassword", authenticateJWT, tutorController.changePassword);

// Get tutor's tutoring sessions (for calendar) - filtering by tutorId
router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const tutorId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ tutorId });
    // Map sessions to calendar event format
    const events = sessions.map(session => ({
      title: session.subject,
      start: session.sessionDate
    }));
    res.status(200).json({ message: 'Sessions fetched successfully', events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static tutor HTML pages (protected)
router.get('/tutordashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
});
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorProfile.html'));
});
router.get('/findSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorFindSession.html'));
});
router.get('/tutoringSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorTutoringSessions.html'));
});
router.get('/chat', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorChatrooms.html'));
});

// Tutor creates a tutoring session
router.post('/sessions/create', authenticateJWT, tutoringSessionController.createSession);

// Tutor fetches all tutoring sessions (full list view)
router.get('/all-sessions', authenticateJWT, async (req, res) => {
  try {
    const tutorId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ tutorId });
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
