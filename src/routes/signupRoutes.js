const express = require('express');
const signUpController = require('../controllers/signUpController');//import

const router = express.Router();

// Student signup endpoint.
router.post('/students', signUpController.registerStudent);

// Tutor signup endpoint.
router.post('/tutors', signUpController.registerTutor);

module.exports = router;
