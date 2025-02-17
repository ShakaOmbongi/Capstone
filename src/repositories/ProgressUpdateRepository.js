'use strict';

const ProgressUpdate = require('../entities/ProgressUpdate');

class ProgressUpdateRepository {
  // Create a new progress update record
  async createProgress(updateData) {
    return await ProgressUpdate.create(updateData);
  }

  // Find a progress update for a user on a specific date
  async getProgressByUserAndDate(userId, updateDate) {
    return await ProgressUpdate.findOne({ where: { userId, updateDate } });
  }

  // Get all progress updates for a user
  async getAllProgressForUser(userId) {
    return await ProgressUpdate.findAll({ where: { userId } });
  }

  // Update a progress update record
  async updateProgress(id, updates) {
    return await ProgressUpdate.update(updates, { where: { id } });
  }
}

module.exports = new ProgressUpdateRepository();
