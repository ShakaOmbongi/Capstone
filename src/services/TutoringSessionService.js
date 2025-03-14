'use strict';

const tutoringSessionRepository = require('../repositories/TutoringSessionRepository');

class TutoringSessionService {
  // Create a new session
  async createSession(sessionData) {
    // Optionally add validations here
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

  // Update a session by ID
  async updateSession(sessionId, updates) {
    return await tutoringSessionRepository.updateSession(sessionId, updates);
  }

  // Delete a session by ID
  async deleteSession(sessionId) {
    return await tutoringSessionRepository.deleteSession(sessionId);
  }
  
  // Join a session by assigning the student to the session
  async joinSession(sessionId, studentId) {
    return await tutoringSessionRepository.joinSession(sessionId, studentId);
  }
}

module.exports = new TutoringSessionService();
