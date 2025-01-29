const express = require('express');
const path = require('path');

const router = express.Router();

// Welcome page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/welcome.html'));
});

// Student login page
router.get('/studentlogin', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/studentlogin.html'));
});

// Student signup page
router.get('/studentsignup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landingUI/studentsignup.html'));
});

module.exports = router;
