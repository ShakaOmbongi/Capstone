'use strict';

const tutoringSessionService = require('../services/TutoringSessionService');

const tutoringSessionController = {
  async createSession(req, res) {
    try {
      // Include description (which is optional) from req.body
      const { subject, sessionDate, tutorId, description } = req.body;
      // Assume the creator is the current user (student) if not explicitly provided
      const studentId = req.user.id;
      const newSession = await tutoringSessionService.createSession({
        tutorId,
        studentId,
        subject,
        sessionDate,
        description,  // optional field
      });
      res.status(201).json({ 
        status: 'success', 
        message: 'Session booked successfully', 
        data: newSession 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async joinSession(req, res) {
    try {
      const sessionId = req.params.id;
      const studentId = req.user.id;
      // Business logic for joining a session (check existence, permissions, etc.)
      const result = await tutoringSessionService.joinSession(sessionId, studentId);
      res.status(200).json({ 
        status: 'success', 
        message: 'Successfully joined the session', 
        data: result 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getSessionById(req, res) {
    try {
      const session = await tutoringSessionService.getSessionById(req.params.id);
      if (!session) {
        return res.status(404).json({ status: 'error', message: 'Session not found' });
      }
      res.status(200).json({ 
        status: 'success', 
        message: 'Session fetched', 
        data: session 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getSessions(req, res) {
    try {
      const sessions = await tutoringSessionService.getAllSessions();
      res.status(200).json({ 
        status: 'success', 
        message: 'Sessions fetched', 
        data: sessions 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateSession(req, res) {
    try {
      const sessionId = req.params.id;
      const userId = req.user.id;
      // Extract the fields to update (subject, sessionDate, and optionally description)
      const { subject, sessionDate, description } = req.body;
      // Pass the current user's ID along with update data so that the service can verify ownership
      const updatedSession = await tutoringSessionService.updateSession(sessionId, userId, {
        subject,
        sessionDate,
        description,  // this field is optional
      });
      if (!updatedSession) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Session not found or you do not have permission to update it' 
        });
      }
      res.status(200).json({ 
        status: 'success', 
        message: 'Session updated successfully', 
        data: updatedSession 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async deleteSession(req, res) {
    try {
      const sessionId = req.params.id;
      const userId = req.user.id;
      // Pass userId so that the service can check if the user is allowed to delete the session
      const deleted = await tutoringSessionService.deleteSession(sessionId, userId);
      if (!deleted) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Session not found or you do not have permission to delete it' 
        });
      }
      res.status(200).json({ 
        status: 'success', 
        message: 'Session deleted successfully' 
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = tutoringSessionController;
