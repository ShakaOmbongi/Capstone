// src/controllers/reviewController.js
const reviewService = require('../services/reviewService');

const reviewController = {
  async getEligibleSessions(req, res) {
    try {
      const userId = req.user.id;
      const sessions = await reviewService.getEligibleSessions(userId);
      res.status(200).json({ status: 'success', data: sessions });
    } catch (error) {
      console.error('Error fetching eligible sessions:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = reviewController;
