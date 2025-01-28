const express = require('express');
const path = require('path');
const { authenticateJWT } = require('../middleware/authMiddleware'); // Optional if you use JWT validation

const router = express.Router();

router.get('/studentdashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/studentdashboard.html'));
});

module.exports = router;
