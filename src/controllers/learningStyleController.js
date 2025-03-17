'use strict';

const learningStyleService = require('../services/learningStyleService');

const learningStyleController = {
  // GET /learning-style/questions
  async getQuestions(req, res) {
    try {
      const questions = await learningStyleService.fetchQuestions();
      return res.status(200).json({
        status: 'success',
        message: 'Learning style questions fetched',
        data: questions
      });
    } catch (error) {
      console.error('Error fetching questions:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // POST /learning-style/responses
  // Body: { responses: [ {questionId, answer}, ... ] }
  async submitResponses(req, res) {
    try {
      const { responses } = req.body;
      if (!Array.isArray(responses) || responses.length === 0) {
        return res.status(400).json({ status: 'error', message: 'No responses provided' });
      }

      const userId = req.user.id; // from authMiddleware
      await learningStyleService.saveUserResponses(userId, responses);

      return res.status(201).json({
        status: 'success',
        message: 'Responses saved successfully'
      });
    } catch (error) {
      console.error('Error submitting responses:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  },

  // GET /learning-style/match
  async generateMatch(req, res) {
    try {
      const userId = req.user.id;
      const { matchUser, score, explanation } = await learningStyleService.generateMatch(userId);

      if (!matchUser) {
        return res.status(200).json({
          status: 'success',
          message: 'No suitable match found'
        });
      }

      return res.status(200).json({
        status: 'success',
        message: 'Match found',
        data: {
          matchedUser: matchUser,
          score,
          explanation
        }
      });
    } catch (error) {
      console.error('Error generating match:', error);
      return res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = learningStyleController;
