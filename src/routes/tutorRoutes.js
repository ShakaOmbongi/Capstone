const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');//import

const router = express.Router();

// Protected Tutor Dashboard Route
router.get('/tutordashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
});

module.exports = router;
