'use strict';

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const learningStyleController = require('../controllers/learningStyleController');

router.get('/quiz', authenticateJWT, learningStyleController.getQuizForm);
router.post('/quiz', authenticateJWT, learningStyleController.submitQuizForm);

router.get('/taken', authenticateJWT, learningStyleController.quizTaken);

module.exports = router;
