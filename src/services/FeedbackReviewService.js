'use strict';

const feedbackReviewRepository = require('../repositories/FeedbackReviewRepository');

class FeedbackReviewService {
  // Create a new review (ensuring rating is between 1 and 5)
  async createReview(reviewData) {
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }
    return await feedbackReviewRepository.createReview(reviewData);
  }

  // Get a review by its ID
  async getReviewById(reviewId) {
    return await feedbackReviewRepository.getReviewById(reviewId);
  }

  // Get all reviews (optional filtering)
  async getAllReviews(filter = {}) {
    return await feedbackReviewRepository.getAllReviews(filter);
  }

  // Update a review by its ID
  async updateReview(reviewId, updates) {
    return await feedbackReviewRepository.updateReview(reviewId, updates);
  }

  // Delete a review by its ID
  async deleteReview(reviewId) {
    return await feedbackReviewRepository.deleteReview(reviewId);
  }
}

module.exports = new FeedbackReviewService();
