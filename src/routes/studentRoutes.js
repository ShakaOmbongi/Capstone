const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');

const router = express.Router();

router.get("/profile", authenticateJWT, studentController.getProfile);
router.put("/updateProfile", authenticateJWT, studentController.updateProfile);
router.put("/changePassword", authenticateJWT, studentController.changePassword);

// Serve Student Dashboard
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});

// Serve Student Profile
router.get('/profile', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentProfile.html'));
});

// Serve Student Find Sessions Page
router.get('/findSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentFindSession.html'));
});

// Serve Student Create Tutoring Session Page
router.get('/tutoringSessions', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentTutoringSessions.html'));
});

// Serve Student Chatrooms Page
router.get('/chat', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/StudentChatrooms.html'));
});

module.exports = router;
