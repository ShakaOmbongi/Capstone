'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('learning_style_questions', {
      id: { // Primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      question: { // Question text
        type: Sequelize.TEXT,
        allowNull: false,
      },
      options: { // Optional answer options (JSON)
        type: Sequelize.JSON,
        allowNull: true,
      },
      category: { // Optional category
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: { // Record creation timestamp
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: { // Record update timestamp
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('learning_style_questions');
  }
};
