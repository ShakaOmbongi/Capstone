// src/controllers/joinRequestController.js
'use strict';

const joinRequestService       = require('../services/joinRequestService');
const tutoringSessionService  = require('../services/TutoringSessionService');
const { JoinRequest, User }    = require('../entities');

const joinRequestController = {
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
  },
  async getJoinRequestDetails(req, res) {
    try {
      const requestId = req.params.id;
  
      const request = await JoinRequest.findByPk(requestId, {
        include: [
          { 
            model: User, 
            as: 'requestingStudent',
            attributes: ['id', 'username', 'email', 'profilePic'],
            include: [{ model: require('../entities/UserProfile'), as: 'profile' }]
          },
          { 
            model: require('../entities/TutoringSession'), 
            as: 'requestedSession' 
          }
        ]
      });
  
      if (!request) {
        return res.status(404).json({ status: 'error', message: 'Join request not found' });
      }
  
      const student = request.requestingStudent;
      if (!student) {
        return res.status(404).json({ status: 'error', message: 'Student not found for this request' });
      }
  
      const profile = student.profile || {};
      const profilePicUrl = student.profilePic || '/assets/images/white.jpeg';
      const sessionSubject = request.requestedSession 
        ? request.requestedSession.subject 
        : 'Custom Request';
  
      // Debug logs for troubleshooting
      console.log('Join Request:', request);
      console.log('Student:', student);
      console.log('Profile:', profile);
  
      return res.status(200).json({
        status: 'success',
        data: {
          requestId: request.id,
          sessionSubject,
          student: {
            username: student.username,
            email: student.email,
            profilePic: profilePicUrl,
            bio: profile.bio || '',
            subjects: profile.subjects || '',
            availability: profile.availability || '',
            learningstyle: profile.learningstyle || ''
          }
        }
      });
  
    } catch (error) {
      console.error('Error fetching join request details:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
  
  
};

module.exports = joinRequestController;
