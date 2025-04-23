'use strict';

const { TutoringSession, JoinRequest, FeedbackReview, User } = require('../entities');
const { Op } = require('sequelize');

class FeedbackRepository {
  // Find eligible sessions for reviews (student perspective)
  async findEligibleSessionsForStudent(userId) {
    return await TutoringSession.findAll({
      include: [
        {
          model: JoinRequest,
          as: 'joinRequests',
          where: { studentId: userId, status: 'accepted' },
          required: true
        },
        {
          model: FeedbackReview,
          as: 'feedbacks',
          required: false
        },
        {
          model: User,
          as: 'tutor',  // Include tutor for the session!
          attributes: ['id', 'username', 'email']
        }
      ],
      where: {
        sessionDate: { [Op.lt]: new Date() }
      }
    });
  }
  

  // Submit a new feedback review
  async createFeedback(data) {
    return await FeedbackReview.create(data); 
  }

  // Fetch all feedback left for a specific tutor
  async getFeedbackForTutor(tutorId) {
    return await FeedbackReview.findAll({  
      where: { revieweeId: tutorId },
      include: [
        { model: TutoringSession, as: 'session' },
        { model: User, as: 'reviewer', attributes: ['id', 'username', 'email'] }
      ]
    });
  }
}

module.exports = new FeedbackRepository();
