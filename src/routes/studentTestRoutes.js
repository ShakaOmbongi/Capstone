'use strict';

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const progressUpdateService = require('../services/ProgressUpdateService');
const tutoringSessionService = require('../services/TutoringSessionService');




// Get the current student's login streak
router.get('/login-streak', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    // Assume getCurrentStreak returns the current streak count
    const streak = await progressUpdateService.getCurrentStreak(userId);
    res.status(200).json({ message: 'Login streak fetched successfully', streak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get the current student's tutoring session bookings
router.get('/bookings', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ studentId });
    // Map sessions to FullCalendar event format
    const events = sessions.map(session => ({
      title: session.subject,
      start: session.sessionDate 
    }));
    res.status(200).json({ message: 'Bookings fetched successfully', events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
