const express = require('express');
const router = express.Router();
const feedbackReviewController = require('../controllers/feedbackReviewController');

// Admin views all feedback
router.get('/', feedbackReviewController.getAllReviews);

// Admin deletes a review
router.delete('/:id', feedbackReviewController.deleteReview);

module.exports = router;
