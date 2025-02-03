const express = require('express');
const loginController = require('../controllers/loginController');//import

const router = express.Router();

// Student login endpoint.
router.post('/students', loginController.loginStudent);

// Tutor login endpoint.
router.post('/tutors', loginController.loginTutor);

module.exports = router;
