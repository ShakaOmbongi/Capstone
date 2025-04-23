'use strict';

const feedbackRepository = require('../repositories/feedbackRepository');

class FeedbackService {
    async getSessionsForReviews(userId) {
        return await feedbackRepository.findEligibleSessionsForStudent(userId);
      }
      

  async createReview(data) {
    return await feedbackRepository.createFeedback(data);
  }

  async getTutorReviews(tutorId) {
    return await feedbackRepository.getFeedbackForTutor(tutorId);
  }
}

module.exports = new FeedbackService();
