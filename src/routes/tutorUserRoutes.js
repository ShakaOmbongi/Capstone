'use strict';

const express = require('express');
const path = require('path');
const multer = require('multer');
const { authenticateJWT } = require('../middleware/authMiddleware');
const tutorController = require('../controllers/tutorController');
const tutoringSessionService = require('../services/TutoringSessionService');
const tutoringSessionController = require('../controllers/tutoringSessionController');
const joinRequestController = require('../controllers/joinRequestController');  


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });



// Default route → redirect to dashboard
router.get('/', authenticateJWT, (req, res) => {
  res.redirect('/tutoruser/tutordashboard');
});

// Dashboard Page
router.get('/tutordashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
});

// Profile Page
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutorprofile.html'));
});

// Create a Session Page
router.get('/tutoringSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorTutoringSessions.html'));
});

// Find Sessions Page
router.get('/findSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorFindSession.html'));
});

// Chatroom Page
router.get('/chat', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorChatrooms.html'));
});

router.get('/reviews', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorReviews.html'));
});

router.get('/report', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/TutorReport.html'));
});

router.get('/tutorschedule', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutorschedule.html'));
});

router.get('/faq', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutoringfaq.html'));
});

// Get Profile Data (JSON)
router.get('/profile/data', authenticateJWT, tutorController.getProfile);

// Update Profile (image + bio, availability, etc.)
router.put(
  '/updateProfile',
  authenticateJWT,
  upload.single('profileImage'),
  tutorController.updateProfile
);

// Change Password
router.put('/changePassword', authenticateJWT, tutorController.changePassword);


// Fetch Sessions for Calendar
router.get('/sessions', authenticateJWT, joinRequestController.getStudentSessions);


// Create New Session
router.post('/sessions/create', authenticateJWT, tutoringSessionController.createSession);
router.get(
  '/profile/by-id',
  authenticateJWT,
  tutorController.getProfileById
);

// Fetch All Sessions Created by Tutor
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
