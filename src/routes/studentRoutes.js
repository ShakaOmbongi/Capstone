'use strict';

const express = require('express');
const path = require('path');
const multer = require('multer'); //  moved to the top
const upload = multer({ storage: multer.memoryStorage() });

const { authenticateJWT } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const progressUpdateService = require('../services/ProgressUpdateService');
const tutoringSessionService = require('../services/TutoringSessionService');
const tutoringSessionController = require('../controllers/tutoringSessionController');
const feedbackController = require('../controllers/feedbackController');
const feedbackReviewController = require('../controllers/feedbackReviewController');

const router = express.Router();

// Redirect to student dashboard
router.get('/', authenticateJWT, (req, res) => {
  res.redirect('/student/studentdashboard');
});

// Get student profile data (JSON)
router.get('/profile/data', authenticateJWT, studentController.getProfile);

//  Update student profile with image upload
router.put('/updateProfile', authenticateJWT, upload.single('profileImage'), studentController.updateProfile);

// Change student password
router.put('/changePassword', authenticateJWT, studentController.changePassword);

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

// Get student's tutoring sessions (for calendar)
router.get('/sessions', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const sessions = await tutoringSessionService.getAllSessions({ studentId });
    const events = sessions.map(session => ({
      title: session.subject,
      start: session.sessionDate
    }));
    res.status(200).json({ message: 'Sessions fetched successfully', events });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// In student routes
router.get('/join/request/:id/details', authenticateJWT, studentController.getJoinRequestDetails);
router.get('/session-requests', authenticateJWT, studentController.getSessionRequests);


// Serve static HTML pages
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentProfile.html'));
});
router.get('/bookSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentBookSession.html'));
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
router.get('/settings', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/settings.html'));
});
router.get('/details', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/viewDetails.html'));
});
router.get('/About', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentAbout.html'));
});
router.get('/faq', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/faq.html'));
});

// Student creates a tutoring session
router.post('/sessions/create', authenticateJWT, tutoringSessionController.createSession);

// Student fetches all tutoring sessions (JSON)
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

// NEW: Endpoint to fetch the student's dynamic match data
router.get('/matches', authenticateJWT, studentController.getMatch);

// NEW: Endpoint to accept a pending match
router.post('/matches/accept', authenticateJWT, studentController.acceptMatch);

router.get('/review', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentReviews.html'));
});
router.get('/report', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentReport.html'));
});
// Session-based feedback (for sessions)
router.get('/reviews/eligible', authenticateJWT, feedbackController.getSessionsForReviews);
router.post('/reviews',         authenticateJWT, feedbackController.submitReview);

// **Add these two here** so they resolve under /student
router.get('/reviews/given',    authenticateJWT, feedbackReviewController.getReviewsGiven);
router.get('/reviews/received', authenticateJWT, feedbackReviewController.getReviewsReceived);

router.get(
  '/tutorProfile',        
  authenticateJWT,
  (req, res) => {
    res.sendFile(
      path.join(__dirname, '../views/studentUI/TutorProfile.html')
    );
  }
);

module.exports = router;
