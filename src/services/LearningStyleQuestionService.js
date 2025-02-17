'use strict';

const questionRepository = require('../repositories/LearningStyleQuestionRepository');

class LearningStyleQuestionService {
  // Create a new question
  async createQuestion(data) {
    return await questionRepository.createQuestion(data);
  }

  // Get a question by ID
  async getQuestionById(id) {
    return await questionRepository.getQuestionById(id);
  }

  // Get all questions optional filter
  async getAllQuestions(filter = {}) {
    return await questionRepository.getAllQuestions(filter);
  }

  // Update a question by ID
  async updateQuestion(id, updates) {
    return await questionRepository.updateQuestion(id, updates);
  }

  // Delete a question by ID
  async deleteQuestion(id) {
    return await questionRepository.deleteQuestion(id);
  }
}

module.exports = new LearningStyleQuestionService();
