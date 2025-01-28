const express = require('express');
const signUpController = require('../../controllers/signUpController');

const router = express.Router();

router.post('/students', signUpController.registerStudent);
router.post('/tutors', signUpController.registerTutor);

module.exports = router;
