'use strict';

const { TutoringSession, JoinRequest, Feedback, User } = require('../entities');
const { Op } = require('sequelize');

class ReviewService {
  // Fetch sessions eligible for review by the student
  async getEligibleSessionsForReview(userId) {
    const sessions = await TutoringSession.findAll({
      include: [
        {
          model: JoinRequest,
          as: 'joinRequests',
          where: { studentId: userId, status: 'accepted' },
          required: true
        },
        {
          model: Feedback,
          as: 'feedbacks',
          required: false, // Left outer join (may not exist)
          where: { reviewerId: userId }
        },
        {
          model: User,
          as: 'tutor', // Assuming tutor is the creator
          attributes: ['id', 'username']
        }
      ],
      where: {
        sessionDate: { [Op.lt]: new Date() } // Session is in the past
      }
    });

    // Filter out sessions that already have feedback by this user
    return sessions.filter(session => session.feedbacks.length === 0);
  }

  // Save feedback from a student
  async leaveFeedback({ reviewerId, revieweeId, sessionId, rating, comment }) {
    return await Feedback.create({
      reviewerId,
      revieweeId,
      sessionId,
      rating,
      comment
    });
  }
}

module.exports = new ReviewService();
