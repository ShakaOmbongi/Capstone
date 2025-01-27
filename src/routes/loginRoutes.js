const express = require('express');
const loginController = require('../controllers/loginController');

const router = express.Router();

router.post('/students', loginController.loginStudent);
router.post('/tutors', loginController.loginTutor);
router.post('/admins', loginController.loginAdmin);

module.exports = router;
