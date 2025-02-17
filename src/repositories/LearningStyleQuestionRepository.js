'use strict';

const LearningStyleQuestion = require('../entities/LearningStyleQuestion');

class LearningStyleQuestionRepository {
  // Create a new question record
  async createQuestion(data) {
    return await LearningStyleQuestion.create(data);
  }

  // Retrieve a question by its primary key ID
  async getQuestionById(id) {
    return await LearningStyleQuestion.findByPk(id);
  }

  // Retrieve all questions, optionally with filters
  async getAllQuestions(filter = {}) {
    return await LearningStyleQuestion.findAll({ where: filter });
  }

  // Update a question by its ID
  async updateQuestion(id, updates) {
    return await LearningStyleQuestion.update(updates, { where: { id } });
  }

  // Delete a question by its ID
  async deleteQuestion(id) {
    return await LearningStyleQuestion.destroy({ where: { id } });
  }
}

module.exports = new LearningStyleQuestionRepository();
