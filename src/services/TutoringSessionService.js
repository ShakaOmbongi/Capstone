'use strict';

const tutoringSessionRepository = require('../repositories/TutoringSessionRepository');

class TutoringSessionService {
  // Create a new session; default status is 'pending'
  async createSession(sessionData) {
    if (!sessionData.status) {
      sessionData.status = 'pending';
    }
    return await tutoringSessionRepository.createSession(sessionData);
  }

  // Get a session by ID
  async getSessionById(sessionId) {
    return await tutoringSessionRepository.getSessionById(sessionId);
  }

  // Get all sessions with optional filter
  async getAllSessions(filter = {}) {
    return await tutoringSessionRepository.getAllSessions(filter);
  }

  // Update a session by ID, only if user is creator (tutor or student)
  async updateSession(sessionId, userId, updates) {
    const session = await tutoringSessionRepository.getSessionById(sessionId);
    if (!session) return null;

    const isCreator = session.studentId === userId || session.tutorId === userId;
    if (!isCreator) return null;

    return await tutoringSessionRepository.updateSession(sessionId, updates);
  }

  // Delete a session by ID, only if user is creator (tutor or student)
  async deleteSession(sessionId, userId) {
    const session = await tutoringSessionRepository.getSessionById(sessionId);
    if (!session) return null;

    const isCreator = session.studentId === userId || session.tutorId === userId;
    if (!isCreator) return null;

    return await tutoringSessionRepository.deleteSession(sessionId);
  }

  // Join a session (logic currently just allows joining for calendar purposes)
  async joinSession(sessionId, studentId) {
    return await tutoringSessionRepository.joinSession(sessionId, studentId);
  }

  // Accept a tutoring session (change status to 'accepted')
  async acceptSession(sessionId) {
    return await tutoringSessionRepository.updateSession(sessionId, { status: 'accepted' });
  }

  // Reject a tutoring session (change status to 'rejected')
  async rejectSession(sessionId) {
    return await tutoringSessionRepository.updateSession(sessionId, { status: 'rejected' });
  }
}

module.exports = new TutoringSessionService();
