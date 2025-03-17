'use strict';

const progressUpdateRepository = require('../repositories/ProgressUpdateRepository');

class ProgressUpdateService {
  // Record login: create a new progress record if none exists for today.
  async recordLogin(userId, currentDate) {
    // Check if today's record exists.
    let progress = await progressUpdateRepository.getProgressByUserAndDate(userId, currentDate);
    if (progress) {
      return progress;
    } else {
      // Calculate yesterday's date.
      const yesterdayDate = new Date(currentDate);
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      // Convert yesterday's date to a YYYY-MM-DD string.
      const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

      // Check if there's a login record for yesterday.
      const yesterdayProgress = await progressUpdateRepository.getProgressByUserAndDate(userId, yesterdayStr);
      // If yesterday exists, increment its streak; otherwise, start at 1.
      const streak = yesterdayProgress ? yesterdayProgress.loginStreak + 1 : 1;

      // Create a new progress record for today.
      progress = await progressUpdateRepository.createProgress({
        userId,
        updateDate: currentDate,
        loginStreak: streak,
      });
      return progress;
    }
  }

  // Get current login streak for the user based on the latest progress update record.
  async getCurrentStreak(userId) {
    const progressList = await progressUpdateRepository.getAllProgressForUser(userId);
    if (!progressList || progressList.length === 0) {
      return 0;
    }
    // Sort records by updateDate descending (newest first).
    progressList.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
    const latestRecord = progressList[0];
    return latestRecord.loginStreak;
  }
}

module.exports = new ProgressUpdateService();
