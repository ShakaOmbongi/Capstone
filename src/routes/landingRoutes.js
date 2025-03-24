// routes/landing.js
const express = require('express');
const path = require('path');

const router = express.Router();

// Welcome page.
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/welcome.html'));
});

// Student pages.
router.get('/studentsignup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/studentsignup.html'));
});
router.get('/studentlogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/studentlogin.html'));
});

// Tutor pages.
router.get('/tutorsignup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/tutorsignup.html'));
});
router.get('/tutorlogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/tutorlogin.html'));
});

// Admin login page.
router.get('/admin-dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/adminUI/admin-dashboard.html'));
});

// Additional static pages.
router.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/about.html'));
});
router.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/contact.html'));
});

module.exports = router;
