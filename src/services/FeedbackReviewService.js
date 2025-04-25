'use strict';

const feedbackReviewRepository = require('../repositories/FeedbackReviewRepository');
const feedbackRepository = require('../repositories/feedbackRepository');  //  eligible sessions

class FeedbackReviewService {
  // Create a new review (validates rating, comment, and reviewed user)
  async createReview(reviewData) {
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      throw new Error('Rating must be between 1 and 5.');
    }
    if (!reviewData.comment || reviewData.comment.trim().length === 0) {
      throw new Error('Comment is required.');
    }
    if (!reviewData.revieweeId) {
      throw new Error('Reviewed user ID is required.');
    }
    return await feedbackReviewRepository.createReview(reviewData);
  }

  // Get reviews GIVEN by the current user (reviewerId)
  async getReviewsByReviewerId(reviewerId) {
    return await feedbackReviewRepository.getReviewsByReviewerId(reviewerId);
  }

  // Get reviews RECEIVED by the current user (revieweeId)
  async getReviewsByReviewedUserId(revieweeId) {
    return await feedbackReviewRepository.getReviewsByReviewedUserId(revieweeId);
  }

  // Get sessions the user is ELIGIBLE to review (pending feedback)
  async getEligibleSessionsForReview(userId) {
    return await feedbackRepository.findEligibleSessionsForStudent(userId);  
  }

  // Get a specific review by ID
  async getReviewById(reviewId) {
    return await feedbackReviewRepository.getReviewById(reviewId);
  }

  // Get all reviews (optional filtering)
  async getAllReviews(filter = {}) {
    return await feedbackReviewRepository.getAllReviews(filter);
  }

  // Update a review by its ID
  async updateReview(reviewId, updates) {
    if (updates.rating && (updates.rating < 1 || updates.rating > 5)) {
      throw new Error('Rating must be between 1 and 5.');
    }
    return await feedbackReviewRepository.updateReview(reviewId, updates);
  }
  

  // Delete a review by its ID
  async deleteReview(reviewId) {
    return await feedbackReviewRepository.deleteReview(reviewId);
  }
}

module.exports = new FeedbackReviewService();
