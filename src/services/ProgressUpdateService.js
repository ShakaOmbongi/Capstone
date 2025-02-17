'use strict';

const progressUpdateRepository = require('../repositories/ProgressUpdateRepository');

class ProgressUpdateService {
  // Record login: create a new progress record if none exists for today
  async recordLogin(userId, currentDate) {
    // Check if today's record exists
    let progress = await progressUpdateRepository.getProgressByUserAndDate(userId, currentDate);
    
    if (progress) {
      // Return existing record
      return progress;
    } else {
      // Start with a streak of 1 (or calculate based on yesterday's record)
      const streak = 1;

      // Create a new progress record
      progress = await progressUpdateRepository.createProgress({
        userId,
        updateDate: currentDate,
        loginStreak: streak,
      });
      return progress;
    }
  }

}

module.exports = new ProgressUpdateService();
