'use strict';

const express = require('express');
const router = express.Router();
const learningStyleController = require('../controllers/learningStyleController');
const { authenticateJWT } = require('../middleware/authMiddleware');

/**
 * GET /learning-style/questions
 * Fetch all quiz questions from the DB
 */
router.get('/questions', authenticateJWT, learningStyleController.getQuestions);

/**
 * POST /learning-style/responses
 * Submit user answers to the quiz
 * Expects { "responses": [ { "questionId": ..., "answer": ... }, ... ] }
 */
router.post('/responses', authenticateJWT, learningStyleController.submitResponses);

/**
 * GET /learning-style/match
 * Run GPT-based matching logic
 * Returns best match for the logged-in user
 */
router.get('/match', authenticateJWT, learningStyleController.generateMatch);

module.exports = router;
