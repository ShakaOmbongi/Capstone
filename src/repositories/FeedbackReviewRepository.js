'use strict';

const FeedbackReview = require('../entities/FeedbackReview');

class FeedbackReviewRepository {
  // Create a new feedback review
  async createReview(reviewData) {
    return await FeedbackReview.create(reviewData);
  }

  // Retrieve a review by its primary key, including associated session and user details
  async getReviewById(reviewId) {
    return await FeedbackReview.findByPk(reviewId, {
      include: [
        { association: 'session' },
        { association: 'reviewer' },
        { association: 'reviewee' }
      ]
    });
  }

  // Retrieve all feedback reviews, optionally filtered
  async getAllReviews(filter = {}) {
    return await FeedbackReview.findAll({
      where: filter,
      include: [
        { association: 'session' },
        { association: 'reviewer' },
        { association: 'reviewee' }
      ]
    });
  }

  // Update a review by its ID
  async updateReview(reviewId, updates) {
    await FeedbackReview.update(updates, { where: { id: reviewId } });
    return await FeedbackReview.findByPk(reviewId);  // Return updated review
  }
  

  // Delete a review by its ID
  async deleteReview(reviewId) {
    return await FeedbackReview.destroy({ where: { id: reviewId } });
  }

  //  Reviews GIVEN by the current user (reviewerId)
  async getReviewsByReviewerId(reviewerId) {
    return await FeedbackReview.findAll({
      where: { reviewerId },
      include: [
        { association: 'session' },
        { association: 'reviewee', attributes: ['id', 'username', 'email'] }
      ]
    });
  }

  //  Reviews RECEIVED by the current user (reviewerId)
  async getReviewsByReviewedUserId(revieweeId) {
    return await FeedbackReview.findAll({
      where: { revieweeId },      
      include: [
        { association: 'session' },
        { association: 'reviewer' }
      ]
    });
  }
}

module.exports = new FeedbackReviewRepository();
