// src/repositories/JoinRequestRepository.js
'use strict';

const { JoinRequest, User, UserProfile, TutoringSession } = require('../entities');
const { Op } = require('sequelize');

class JoinRequestRepository {
  // Create a new join request
  async createRequest(studentId, sessionId) {
    return await JoinRequest.create({ studentId, sessionId, status: 'pending' });
  }

  // Get join requests for sessions created by the logged-in user (as tutor or student)
  async getRequestsBySessionCreator(userId, tutorOnly = false, studentOnly = false) {
    const whereClause = tutorOnly
      ? { tutorId: userId }
      : studentOnly
      ? { studentId: userId } 
      : {
          [Op.or]: [
            { tutorId: userId },
            { studentId: userId }
          ]
        };
  
    const sessions = await TutoringSession.findAll({
      where: whereClause,
      attributes: ['id']
    });
  
    const sessionIds = sessions.map(session => session.id);
    if (!sessionIds.length) return { pending: [], accepted: [] };
  
    const requests = await JoinRequest.findAll({
      where: {
        sessionId: { [Op.in]: sessionIds }
      },
      include: [
        {
          model: User,
          as: 'requestingStudent',
          attributes: ['id', 'username', 'email', 'profilePic'],
          include: [{
            model: UserProfile,
            as: 'profile',
            attributes: ['bio', 'subjects', 'availability', 'learningstyle']
          }]
        },
        {
          model: TutoringSession,
          as: 'requestedSession',
          attributes: ['id', 'subject', 'sessionDate', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  
    // Split requests into pending and accepted
    const pending = requests.filter(r => r.status === 'pending');
    const accepted = requests.filter(r => r.status === 'accepted');
  
    return { pending, accepted };
  }
  

  async updateRequestStatus(requestId, status) {
    const result = await JoinRequest.update(
      { status },
      { where: { id: requestId } }
    );
    console.log("Update result:", result); 
    return result;
  }
}

module.exports = new JoinRequestRepository();
