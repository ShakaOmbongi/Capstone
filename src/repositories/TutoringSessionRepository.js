'use strict';

const TutoringSession = require('../entities/TutoringSession');

class TutoringSessionRepository {
  // Create session
  async createSession(sessionData) {
    return await TutoringSession.create(sessionData);
  }

  // Get session by ID with tutor and student associations
  async getSessionById(sessionId) {
    return await TutoringSession.findByPk(sessionId, {
      include: [
        { association: 'tutor' },
        { association: 'student' }
      ]
    });
  }

  // Get all sessions optional filter
  async getAllSessions(filter = {}) {
    return await TutoringSession.findAll({
      where: filter,
      include: [
        { association: 'tutor' },
        { association: 'student' }
      ]
    });
  }

  // Update session by ID
  async updateSession(sessionId, updates) {
    return await TutoringSession.update(updates, { where: { id: sessionId } });
  }

  // Delete session by ID
  async deleteSession(sessionId) {
    return await TutoringSession.destroy({ where: { id: sessionId } });
  }
}

module.exports = new TutoringSessionRepository();
