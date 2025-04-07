'use strict';

const { JoinRequest, User, UserProfile, TutoringSession } = require('../entities');
const { Op } = require('sequelize');

class JoinRequestRepository {
  async createRequest(studentId, sessionId) {
    return await JoinRequest.create({ studentId, sessionId, status: 'pending' });
  }

  async getRequestsBySessionCreator(userId) {
    const sessions = await TutoringSession.findAll({
      where: {
        [Op.or]: [
          { tutorId: userId },
          { studentId: userId }
        ]
      }
    });
  
    const sessionIds = sessions.map(s => s.id);
  
    return await JoinRequest.findAll({
      where: {
        sessionId: {
          [Op.in]: sessionIds
        }
      },
      include: [
        {
          model: User,
          as: 'student',
          include: [{ model: UserProfile, as: 'profile' }]
        },
        {
          model: TutoringSession,
          as: 'session'
        }
      ]
    });
  }
  
  async updateRequestStatus(requestId, status) {
    return await JoinRequest.update({ status }, { where: { id: requestId } });
  }
}

module.exports = new JoinRequestRepository();