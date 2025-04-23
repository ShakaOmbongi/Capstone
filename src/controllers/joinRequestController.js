'use strict';

const joinRequestService = require('../services/joinRequestService');
const tutoringSessionService = require('../services/TutoringSessionService');  // Add this import

const joinRequestController = {
  // Create a new join request to join a session
  async create(req, res) {
    try {
      const studentId = req.user.id;
      const { sessionId } = req.params;
  
      console.log("Received join request:", { studentId, sessionId });
  
      // Fetch the session details
      const session = await tutoringSessionService.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
  
      // Prevent the user from joining their own session
      if (session.studentId === studentId || session.tutorId === studentId) {
        return res.status(400).json({ error: 'Cannot request to join your own session' });
      }
  
      // Proceed with creating the join request
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
      const tutorOnly = req.query.tutorOnly === 'true';
      const studentOnly = req.query.studentOnly === 'true'; 
  
      const { pending, accepted } = await joinRequestService.getRequestsForUserSessions(userId, tutorOnly, studentOnly); // <- Added studentOnly here
      res.status(200).json({ message: 'Requests retrieved', data: { pending, accepted } });
    } catch (error) {
      console.error('Error fetching join requests:', error);
      res.status(500).json({ error: error.message });
    }
  }
  ,
  // Get sessions for calendar (created + accepted join requests)
async getStudentSessions(req, res) {
  try {
    const studentId = req.user.id;

    // Sessions created by the student
    const createdSessions = await require('../entities/TutoringSession').findAll({
      where: { studentId },
      attributes: ['id', 'subject', 'sessionDate', 'description']
    });

    // Sessions the student was accepted into via join requests
    const joinRequests = await require('../entities/JoinRequest').findAll({
      where: { studentId, status: 'accepted' },
      include: {
        model: require('../entities/TutoringSession'),
        as: 'requestedSession',
        attributes: ['id', 'subject', 'sessionDate', 'description']
      }
    });

    // Combine both sets into events
    const events = [
      ...createdSessions.map(session => ({
        id: session.id,
        title: session.subject,
        start: session.sessionDate,
        description: session.description
      })),
      ...joinRequests.map(req => ({
        id: req.requestedSession.id,
        title: req.requestedSession.subject,
        start: req.requestedSession.sessionDate,
        description: req.requestedSession.description
      }))
    ];

    res.status(200).json({ events });
  } catch (error) {
    console.error('Error fetching student sessions:', error);
    res.status(500).json({ error: 'Error fetching student sessions' });
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
