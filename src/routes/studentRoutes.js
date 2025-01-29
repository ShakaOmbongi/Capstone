const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Student dashboard (protected)
router.get('/studentdashboard', authenticateJWT, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentUI/studentdashboard.html'));
});

module.exports = router;
