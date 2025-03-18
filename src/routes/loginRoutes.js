'use strict';
const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();
// Serve the student login HTML page
router.get('/students', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/landingUI/studentlogin.html'));
  });
  
  // POST endpoints for login
  router.post('/students', loginController.loginStudent);
  router.post('/tutors', loginController.loginTutor);
  
module.exports = router;
