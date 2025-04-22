'use strict';

const joinRequestService = require('../services/joinRequestService');

const joinRequestController = {
  // Create a new join request to join a session
  async create(req, res) {
    try {
      const studentId = req.user.id;
      const { sessionId } = req.params;
  
      const request = await joinRequestService.createJoinRequest(studentId, sessionId);
      res.status(201).json({ message: 'Join request sent!', data: request });
    } catch (error) {
      console.error('Create Join Request Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
  ,

  // Get join requests for sessions created by the logged-in user
  async getMyRequests(req, res) {
    try {
      const userId = req.user.id;
      const tutorOnly = req.query.tutorOnly === 'true'; // interpret query param

      const requests = await joinRequestService.getRequestsForUserSessions(userId, tutorOnly);
      res.status(200).json({ message: 'Requests retrieved', data: requests });
    } catch (error) {
      console.error('Error fetching join requests:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Accept a specific join request
  async accept(req, res) {
    try {
      const { requestId } = req.params;
      console.log("Accepting join request with ID:", requestId); 
      const updated = await joinRequestService.acceptRequest(requestId);
      res.status(200).json({ message: 'Request accepted', data: updated });
    } catch (error) {
      console.error('Accept Request Error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Reject a specific join request
  async reject(req, res) {
    try {
      const { requestId } = req.params;

      const updated = await joinRequestService.rejectRequest(requestId);
      res.status(200).json({ message: 'Request rejected', data: updated });
    } catch (error) {
      console.error('Reject Request Error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = joinRequestController;
