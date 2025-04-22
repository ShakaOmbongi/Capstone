const TutoringSession = require('../entities/TutoringSession');
const { User, UserProfile } = require('../entities');
const { Op } = require('sequelize');

class TutoringSessionRepository {
  async createSession(sessionData) {
    return await TutoringSession.create(sessionData);
  }

  async getSessionById(sessionId) {
    return await TutoringSession.findByPk(sessionId, {
      include: [
        {
          association: 'tutor',
          include: [{ model: UserProfile, as: 'profile' }]
        },
        {
          association: 'student',
          include: [{ model: UserProfile, as: 'profile' }]
        }
      ]
    });
  }

  async getAllSessions(filter = {}) {
    const now = new Date();
    return await TutoringSession.findAll({
      where: {
        ...filter,
        sessionDate: { [Op.gt]: now } // Exclude past sessions
      },
      include: [
        {
          association: 'tutor',
          include: [{ model: UserProfile, as: 'profile' }]
        },
        {
          association: 'student',
          include: [{ model: UserProfile, as: 'profile' }]
        }
      ]
    });
  }

  async updateSession(sessionId, updates) {
    await TutoringSession.update(updates, { where: { id: sessionId } });
    return await this.getSessionById(sessionId);
  }

  async deleteSession(sessionId) {
    return await TutoringSession.destroy({ where: { id: sessionId } });
  }

  async joinSession(sessionId, studentId) {
    const session = await TutoringSession.findByPk(sessionId);
    if (!session) throw new Error('Session not found');

    // Allow calendar joining without locking studentId
    return session;
  }
}

module.exports = new TutoringSessionRepository();
