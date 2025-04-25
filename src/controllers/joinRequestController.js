// src/controllers/joinRequestController.js
'use strict';

const joinRequestService       = require('../services/joinRequestService');
const tutoringSessionService  = require('../services/TutoringSessionService');
const { JoinRequest, User }    = require('../entities');

const joinRequestController = {
  // 1) Standard: Create a new join request for an existing session
  async create(req, res) {
    try {
      const studentId = req.user.id;
      const { sessionId } = req.params;

      // Fetch the session details
      const session = await tutoringSessionService.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      // Prevent self-join
      if (session.studentId === studentId || session.tutorId === studentId) {
        return res.status(400).json({ error: 'Cannot request to join your own session' });
      }

      // Delegate to service
      const request = await joinRequestService.createJoinRequest(studentId, sessionId);
      return res.status(201).json({ message: 'Join request sent!', data: request });

    } catch (error) {
      console.error('Create Join Request Error:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 2) Fetch pending/accepted requests for sessions you created (tutor view)
  async getMyRequests(req, res) {
    try {
      const tutorId   = req.user.id;
      const tutorOnly = req.query.tutorOnly === 'true';

      //  session-based requests
      const { pending, accepted } = await joinRequestService.getRequestsForUserSessions(
        tutorId, /* tutorOnly */ tutorOnly, /* studentOnly */ false
      );

      //  custom requests (no sessionId, directed at this tutor)
      const [customPending, customAccepted] = await Promise.all([
        JoinRequest.findAll({
          where: { tutorId, sessionId: null, status: 'pending' },
          include: [{ model: User, as: 'requestingStudent', attributes: ['username'] }]
        }),
        JoinRequest.findAll({
          where: { tutorId, sessionId: null, status: 'accepted' },
          include: [{ model: User, as: 'requestingStudent', attributes: ['username'] }]
        })
      ]);

      //  merge them in
      pending .push(...customPending);
      accepted.push(...customAccepted);

      return res.status(200).json({
        message: 'Requests retrieved',
        data: { pending, accepted }
      });
    } catch (error) {
      console.error('Error fetching join requests:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 3) Calendar: sessions you created + sessions you’ve been accepted into
  async getStudentSessions(req, res) {
    try {
      const studentId = req.user.id; 

      // Sessions YOU created
      const createdSessions = await require('../entities/TutoringSession').findAll({
        where: { studentId },
        attributes: ['id', 'subject', 'sessionDate', 'description']
      });

      // Sessions YOU were accepted into
      const joinRequests = await JoinRequest.findAll({
        where: { studentId, status: 'accepted' },
        include: {
          model: require('../entities/TutoringSession'),
          as: 'requestedSession',
          attributes: ['id', 'subject', 'sessionDate', 'description']
        }
      });

      const events = [
        ...createdSessions.map(s => ({
          id: s.id,
          title: s.subject,
          start: s.sessionDate,
          description: s.description
        })),
        ...joinRequests.map(r => ({
          id: r.requestedSession.id,
          title: r.requestedSession.subject,
          start: r.requestedSession.sessionDate,
          description: r.requestedSession.description
        }))
      ];

      return res.status(200).json({ events });
    } catch (error) {
      console.error('Error fetching student sessions:', error);
      return res.status(500).json({ error: 'Error fetching student sessions' });
    }
  },

  // 4) Accept a join request (tutor)
  async accept(req, res) {
    try {
      const { requestId } = req.params;
      const updated       = await joinRequestService.acceptRequest(requestId);
      return res.status(200).json({ message: 'Request accepted', data: updated });
    } catch (error) {
      console.error('Accept Request Error:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 5) Reject a join request (tutor)
  async reject(req, res) {
    try {
      const { requestId } = req.params;
      const updated       = await joinRequestService.rejectRequest(requestId);
      return res.status(200).json({ message: 'Request rejected', data: updated });
    } catch (error) {
      console.error('Reject Request Error:', error);
      return res.status(500).json({ error: error.message });
    }
  },

  // 6) Custom: Request a new, one-off session with a tutor (no existing session)
  async createCustomRequest(req, res, next) {
    try {
      const studentId = req.user.id;
      const { tutorId, date, time, note } = req.body;

      if (!tutorId || !date || !time) {
        return res.status(400).json({ message: 'tutorId, date & time are required' });
      }

      await JoinRequest.create({
        studentId,
        tutorId,
        requestedDate: date,
        requestedTime: time,
        note: note || null
      });

      return res.status(201).json({ message: 'Custom session request sent' });
    } catch (err) {
      console.error('Error creating custom join request:', err);
      return next(err);
    }
  }
};

module.exports = joinRequestController;
