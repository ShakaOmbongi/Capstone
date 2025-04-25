'use strict';

const feedbackService = require('../services/FeedbackService');

const feedbackController = {
  // Get sessions eligible for review (for students)
  async getSessionsForReviews(req, res) {
    try {
      const userId = req.user.id;
      const sessions = await feedbackService.getSessionsForReviews(userId);
      return res.status(200).json({ sessions });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Submit a review
  async submitReview(req, res) {
    try {
      const reviewerId = req.user.id;
      const { sessionId, revieweeId, rating, comment } = req.body;
      const review = await feedbackService.createReview({ reviewerId, sessionId, revieweeId, rating, comment });
      res.status(201).json({ status: 'success', message: 'Review submitted successfully', data: review });
    } catch (error) {
      console.error('Error submitting review:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get tutor reviews (for tutors to view feedback they've received)
  async getTutorReviews(req, res) {
    try {
      const tutorId = req.user.id;
      const reviews = await feedbackService.getTutorReviews(tutorId);
      res.status(200).json({ status: 'success', data: reviews });
    } catch (error) {
      console.error('Error fetching tutor reviews:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = feedbackController;
