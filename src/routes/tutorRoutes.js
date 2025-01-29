const express = require('express');
const path = require('path');

const router = express.Router();

// Tutor dashboard (protected)
router.get('/tutordashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/tutorUI/tutordashboard.html'));
});

module.exports = router;
