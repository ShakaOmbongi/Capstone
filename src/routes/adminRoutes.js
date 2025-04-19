'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const adminController = require('../controllers/adminController');
const flaggedUserController = require('../controllers/flaggedUserController');
const tutoringSessionService  = require('../services/TutoringSessionService');  

const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

// Optional: redirect to admin dashboard when hitting the base admin route
router.get('/', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.redirect('/admin-dashboard');
});

// Protected Admin API Routes
router.get('/users', authenticateJWT, authorizeRole(['admin']), adminController.getAllUsers);
router.get('/metrics', authenticateJWT, authorizeRole(['admin']), adminController.getMetrics);

router.get('/flagged-users', authenticateJWT, authorizeRole(['admin']), flaggedUserController.getFlaggedUsers);
router.put('/flagged-users/:id', authenticateJWT, authorizeRole(['admin']), flaggedUserController.clearFlag);
router.patch('/flagged-users/suspend/:id', authenticateJWT, authorizeRole(['admin']), flaggedUserController.toggleSuspend);


// Serve static admin HTML pages (protected)
router.get('/admin-dashboard', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-dashboard.html'));
});
router.get('/admin-users', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/adminusers.html'));
});
router.get('/admin-feedback', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-feedback.html'));
});
router.get('/admin-analytics', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-analytics.html'));
});
router.get('/admin-flagged-users', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-flagged-users.html'));
});
router.get('/admin-session-management', authenticateJWT, authorizeRole(['admin']), (req, res) => {
    res.sendFile(path.join(__dirname, '../views/adminUI/adminSessionManagement.html'));
  });
  


// Admin Sessions: fetch all tutoring sessions (for admin view)
router.get('/sessions', authenticateJWT, authorizeRole(['admin']), async (req, res) => {
    try {
      // No filter for studentId—admin sees all sessions.
      const sessions = await tutoringSessionService.getAllSessions();
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
