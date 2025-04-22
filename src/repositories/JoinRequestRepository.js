'use strict';

const { JoinRequest, User, UserProfile, TutoringSession } = require('../entities');
const { Op } = require('sequelize');

class JoinRequestRepository {
  // Create a new join request
  async createRequest(studentId, sessionId) {
    return await JoinRequest.create({ studentId, sessionId, status: 'pending' });
  }

  // Get join requests for sessions created by the logged-in user (as tutor or student)
  async getRequestsBySessionCreator(userId, tutorOnly = false) {
    const whereClause = tutorOnly
      ? { tutorId: userId }
      : {
          [Op.or]: [
            { tutorId: userId },
            { studentId: userId } // in case student created the session
          ]
        };

    const sessions = await TutoringSession.findAll({
      where: whereClause,
      attributes: ['id']
    });

    const sessionIds = sessions.map(session => session.id);
    if (!sessionIds.length) return [];

    return await JoinRequest.findAll({
      where: {
        sessionId: { [Op.in]: sessionIds }
      },
      include: [
        {
          model: User,
          as: 'requestingStudent', // new alias used in JoinRequest.associate
          attributes: ['id', 'username', 'email', 'profilePic'],
          include: [{
            model: UserProfile,
            as: 'profile',
            attributes: ['bio', 'subjects', 'availability', 'learningstyle']
          }]
        },
        {
          model: TutoringSession,
          as: 'requestedSession', // new alias used in JoinRequest.associate
          attributes: ['id', 'subject', 'sessionDate', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  // Update status of a join request (accept or reject)
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
