'use strict';

const joinRequestRepository = require('../repositories/joinRequestRepository');

class JoinRequestService {
  // Create a new join request
  async createJoinRequest(studentId, sessionId) {
    console.log("Creating join request:", { studentId, sessionId });
    return await joinRequestRepository.createRequest(studentId, sessionId);
  }
  

  // Get join requests for sessions created by the user (tutor or student)
  async getRequestsForUserSessions(userId, tutorOnly = false) {
    return await joinRequestRepository.getRequestsBySessionCreator(userId, tutorOnly);
  }

  // Accept a request
  async acceptRequest(requestId) {
    return await joinRequestRepository.updateRequestStatus(requestId, 'accepted');
  }  

  // Reject a request
  async rejectRequest(requestId) {
    return await joinRequestRepository.updateRequestStatus(requestId, 'rejected');
  }
}

module.exports = new JoinRequestService();
