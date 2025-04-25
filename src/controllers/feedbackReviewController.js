'use strict';

const feedbackReviewService = require('../services/FeedbackReviewService');

const feedbackReviewController = {
  // Create a new review
  async createReview(req, res) {
    try {
      // Set the reviewerId from the authenticated user (assuming JWT middleware populates req.user)
      req.body.reviewerId = req.user.id;

      // Create the review (this will also validate rating, comment, and reviewedUserId)
      const newReview = await feedbackReviewService.createReview(req.body);

      res.status(201).json({
        status: 'success',
        message: 'Review created successfully',
        data: newReview,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get a review by its ID
  async getReviewById(req, res) {
    try {
      const review = await feedbackReviewService.getReviewById(req.params.id);
      if (!review) {
        return res.status(404).json({ status: 'error', message: 'Review not found' });
      }
      res.status(200).json({
        status: 'success',
        message: 'Review fetched successfully',
        data: review,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get all reviews (with optional filtering via query parameters)
  async getAllReviews(req, res) {
    try {
      const reviews = await feedbackReviewService.getAllReviews();
      res.status(200).json({
        status: 'success',
        message: 'Reviews fetched successfully',
        feedback: reviews
      });
    } catch (error) {
      console.error("Error fetching all feedback reviews:", error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Update a review by its ID
  async updateReview(req, res) {
    try {
      const reviewId = req.params.id;
      const review = await feedbackReviewService.getReviewById(reviewId);
  
      if (!review) {
        return res.status(404).json({ status: 'error', message: 'Review not found' });
      }
  
      // Check ownership
      if (review.reviewerId !== req.user.id) {
        return res.status(403).json({ status: 'error', message: 'Not authorized to edit this review' });
      }
  
      const updatedReview = await feedbackReviewService.updateReview(reviewId, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Review updated successfully',
        data: updatedReview
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
  ,

  // Delete a review by its ID
  async deleteReview(req, res) {
    try {
      const reviewId = req.params.id;
      const deleted = await feedbackReviewService.deleteReview(reviewId);
      if (!deleted) {
        return res.status(404).json({ status: 'error', message: 'Review not found' });
      }
      res.status(200).json({
        status: 'success',
        message: 'Review deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Get reviews based on the type (given or received)
  async getReviews(req, res) {
    const { type } = req.query; // 'given' or 'received'
    const userId = req.user.id;

    try {
      let reviews;
      if (type === 'given') {
        reviews = await feedbackReviewService.getReviewsByReviewerId(userId);
      } else if (type === 'received') {
        reviews = await feedbackReviewService.getReviewsByReviewedUserId(userId);
      } else {
        return res.status(400).json({ status: 'error', message: 'Invalid review type' });
      }
      res.status(200).json({ feedbacks: reviews });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
  async getReviewsGiven(req, res) {
    try {
      const reviewerId = req.user.id;
      const reviews = await feedbackReviewService.getReviewsByReviewerId(reviewerId);
      return res.status(200).json({ feedbacks: reviews });
    } catch (error) {
      console.error('Error in getReviewsGiven:', error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Get reviews received by the current user
  async getReviewsReceived(req, res) {
    try {
      const reviewedUserId = req.user.id;
      const reviews = await feedbackReviewService.getReviewsByReviewedUserId(reviewedUserId);
      return res.status(200).json({ feedbacks: reviews });
    } catch (error) {
      console.error('Error in getReviewsReceived:', error);
      return res.status(500).json({ message: error.message });
    }
  },

  // Get eligible reviews for a student (sessions eligible for feedback)
  async getEligibleReviews(req, res) {
    try {
      const userId = req.user.id;
      const eligibleSessions = await feedbackReviewService.getEligibleSessionsForReview(userId);
      res.status(200).json({ sessions: eligibleSessions });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

};

module.exports = feedbackReviewController;
