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

  async joinSession(sessionId, studentId) {
    try {
      console.log(`Joining session: ${sessionId} with student: ${studentId}`);
      const session = await TutoringSession.findByPk(sessionId);
      if (!session) {
        console.error('Session not found');
        throw new Error('Session not found');
      }
      if (session.studentId) {
        console.error('Session already has a student assigned');
        throw new Error('Session already has a student assigned');
      }
      // Update the session with the student's ID
      session.studentId = studentId;
      await session.save();
      console.log('Session updated successfully');
      return session;
    } catch (err) {
      console.error("Error in joinSession:", err);
      throw err; // Rethrow to let the controller handle the error
    }
  }
}

module.exports = new TutoringSessionRepository();
