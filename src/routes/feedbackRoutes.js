'use strict';

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const feedbackController = require('../controllers/feedbackController');  // Session-based feedback
const feedbackReviewController = require('../controllers/feedbackReviewController');  // User-to-user reviews


// Tutor Routes (session-based)
router.get('/tutor/reviews', authenticateJWT, feedbackController.getTutorReviews);

// Admin Routes (user-to-user reviews)
router.get('/admin', authenticateJWT, feedbackReviewController.getAllReviews);
router.delete('/admin/:id', authenticateJWT, feedbackReviewController.deleteReview);
// Allow deleting *any* feedback by ID (e.g. by the student who owns it)
router.delete('/:id', authenticateJWT, feedbackReviewController.deleteReview);
router.put('/:id', authenticateJWT, feedbackReviewController.updateReview);


module.exports = router;
