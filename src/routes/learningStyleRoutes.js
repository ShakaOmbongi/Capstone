'use strict';
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const learningStyleController = require('../controllers/learningStyleController');

// GET quiz form
router.get('/quiz', authenticateJWT, learningStyleController.getQuizForm);

// POST quiz answers -> store in DB, run AI matching
router.post('/quiz', authenticateJWT, learningStyleController.submitQuizForm);

// Check if the quiz has been taken
router.get('/taken', authenticateJWT, learningStyleController.checkQuizStatus);

module.exports = router;
