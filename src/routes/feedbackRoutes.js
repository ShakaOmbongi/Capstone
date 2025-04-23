'use strict';

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const feedbackController = require('../controllers/feedbackController'); // Student & Tutor
const feedbackReviewController = require('../controllers/feedbackReviewController'); // Admin

//  Student Routes 
router.get('/student/reviews/eligible', authenticateJWT, feedbackController.getSessionsForReviews);
router.post('/student/reviews', authenticateJWT, feedbackController.submitReview);

//  Tutor Routes 
router.get('/tutor/reviews', authenticateJWT, feedbackController.getTutorReviews);

//  Admin Routes 
router.get('/admin', authenticateJWT, feedbackReviewController.getAllReviews);
router.delete('/admin/:id', authenticateJWT, feedbackReviewController.deleteReview);

module.exports = router;
