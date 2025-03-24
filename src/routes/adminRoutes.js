'use strict';

const express = require('express');
const router = express.Router();
const path = require('path'); // Import the path module
const adminController = require('../controllers/adminController');
const adminAuthController = require('../controllers/adminAuthController'); // Import the admin auth controller.
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');

// Public Admin Login Route
router.post('/login', adminAuthController.login);

// Protected Admin API Routes: Only accessible if the user is authenticated and has the 'admin' role.
router.get('/users', authenticateJWT, authorizeRole(['admin']), adminController.getAllUsers);
router.get('/flagged-users', authenticateJWT, authorizeRole(['admin']), adminController.getFlaggedUsers);
router.get('/metrics', authenticateJWT, authorizeRole(['admin']), adminController.getMetrics);

// Serve the Admin Dashboard page
router.get('/admin-dashboard', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-dashboard.html'));
});

// Serve the Admin Users (User Management) page
router.get('/admin-users', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/adminUsers.html'));
});

// Serve the Admin Feedback page
router.get('/admin-feedback', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-feedback.html'));
});

// Serve the Admin Analytics page
router.get('/admin-analytics', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-analytics.html'));
});

// Serve the Admin Flagged Users page
router.get('/admin-flagged-users', authenticateJWT, authorizeRole(['admin']), (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-flagged-users.html'));
});

module.exports = router;
