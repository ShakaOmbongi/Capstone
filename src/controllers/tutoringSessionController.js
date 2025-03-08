'use strict';

const tutoringSessionService = require('../services/TutoringSessionService');

const tutoringSessionController = {
  async createSession(req, res) {
    try {
      const { subject, sessionDate, tutorId } = req.body;
      const studentId = req.user.id;
      const newSession = await tutoringSessionService.createSession({ tutorId, studentId, subject, sessionDate });
      res.status(201).json({ status: 'success', message: 'Session booked successfully', data: newSession });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getSessionById(req, res) {
    try {
      const session = await tutoringSessionService.getSessionById(req.params.id);
      if (!session) return res.status(404).json({ status: 'error', message: 'Session not found' });
      res.status(200).json({ status: 'success', message: 'Session fetched', data: session });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getSessions(req, res) {
    try {
      const sessions = await tutoringSessionService.getAllSessions();
      res.status(200).json({ status: 'success', message: 'Sessions fetched', data: sessions });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateSession(req, res) {
    try {
      const updated = await tutoringSessionService.updateSession(req.params.id, req.body);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Session not found or not updated' });
      res.status(200).json({ status: 'success', message: 'Session updated', data: updated });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async deleteSession(req, res) {
    try {
      const deleted = await tutoringSessionService.deleteSession(req.params.id);
      if (!deleted) return res.status(404).json({ status: 'error', message: 'Session not found or not deleted' });
      res.status(200).json({ status: 'success', message: 'Session deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = tutoringSessionController;
