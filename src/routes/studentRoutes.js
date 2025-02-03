const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');//import

const router = express.Router();

// Protected Student Dashboard Route
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});

module.exports = router;
