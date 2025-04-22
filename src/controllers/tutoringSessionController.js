'use strict';

const tutoringSessionService = require('../services/TutoringSessionService');

const tutoringSessionController = {
  //  Create a new session with logged-in user as both tutor and student
  async createSession(req, res) {
    try {
      const { subject, sessionDate, description } = req.body;
      const userId = req.user.id; // The logged-in user
      const newSession = await tutoringSessionService.createSession({
        tutorId: userId,
        studentId: userId,
        subject,
        sessionDate,
        description,
      });

      res.status(201).json({
        status: 'success',
        message: 'Session created successfully',
        data: newSession,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Join a session (for calendar only — not ownership)
  async joinSession(req, res) {
    try {
      const sessionId = req.params.id;
      const studentId = req.user.id;

      const result = await tutoringSessionService.joinSession(sessionId, studentId);

      res.status(200).json({
        status: 'success',
        message: 'Successfully joined the session',
        data: result,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  //  Get one session by ID
  async getSessionById(req, res) {
    try {
      const session = await tutoringSessionService.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ status: 'error', message: 'Session not found' });
      }
      res.status(200).json({
        status: 'success',
        message: 'Session fetched',
        data: session,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  //  Get all upcoming sessions
  async getSessions(req, res) {
    try {
      const sessions = await tutoringSessionService.getAllSessions();
      res.status(200).json({
        status: 'success',
        message: 'Sessions fetched',
        data: sessions,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  //  Update only if the user owns the session (as tutor or student)
  async updateSession(req, res) {
    try {
      const sessionId = req.params.id;
      const userId = req.user.id;
      const { subject, sessionDate, description } = req.body;
  
      const session = await tutoringSessionService.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({
          status: 'error',
          message: 'Session not found'
        });
      }
  
      // Only allow the creator (tutorId or studentId) to update
      const isOwner = userId === session.tutorId || userId === session.studentId;
      if (!isOwner) {
        return res.status(403).json({
          status: 'error',
          message: 'Unauthorized to update this session'
        });
      }
  
      const updatedSession = await tutoringSessionService.updateSession(
        sessionId,
        userId,
        { subject, sessionDate, description }
      );
  
      res.status(200).json({
        status: 'success',
        message: 'Session updated successfully',
        data: updatedSession
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  //  Delete only if the user owns the session
  async deleteSession(req, res) {
    try {
      const sessionId = req.params.id;
      const userId = req.user.id;

      const session = await tutoringSessionService.getSessionById(sessionId);
      if (!session) {
        return res.status(404).json({ status: 'error', message: 'Session not found' });
      }

      const isOwner = userId === session.tutorId || userId === session.studentId;
      if (!isOwner) {
        return res.status(403).json({ status: 'error', message: 'Unauthorized to delete this session' });
      }

      const deleted = await tutoringSessionService.deleteSession(sessionId);
      res.status(200).json({
        status: 'success',
        message: 'Session deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  //  Mark a session as accepted
  async acceptSession(req, res) {
    try {
      const sessionId = req.params.id;
      const updatedSession = await tutoringSessionService.acceptSession(sessionId);

      if (!updatedSession) {
        return res.status(404).json({ status: 'error', message: 'Session not found' });
      }

      res.status(200).json({
        status: 'success',
        message: 'Session accepted',
        data: updatedSession,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // Mark a session as rejected
  async rejectSession(req, res) {
    try {
      const sessionId = req.params.id;
      const updatedSession = await tutoringSessionService.rejectSession(sessionId);

      if (!updatedSession) {
        return res.status(404).json({ status: 'error', message: 'Session not found' });
      }

      res.status(200).json({
        status: 'success',
        message: 'Session rejected',
        data: updatedSession,
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },
};

module.exports = tutoringSessionController;
