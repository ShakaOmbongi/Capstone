'use strict';

const joinRequestRepository = require('../repositories/joinRequestRepository');

class JoinRequestService {
  async createJoinRequest(studentId, sessionId) {
    return await joinRequestRepository.createRequest(studentId, sessionId);
  }

  async getRequestsForUserSessions(userId) {
    return await joinRequestRepository.getRequestsBySessionCreator(userId);
  }

  async acceptRequest(requestId) {
    return await joinRequestRepository.updateRequestStatus(requestId, 'accepted');
  }

  async rejectRequest(requestId) {
    return await joinRequestRepository.updateRequestStatus(requestId, 'rejected');
  }
}

module.exports = new JoinRequestService();