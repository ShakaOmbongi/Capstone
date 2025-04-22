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
    return await FeedbackReview.update(updates, { where: { id: reviewId } });
  }

  // Delete a review by its ID
  async deleteReview(reviewId) {
    return await FeedbackReview.destroy({ where: { id: reviewId } });
  }
}

module.exports = new FeedbackReviewRepository();
 