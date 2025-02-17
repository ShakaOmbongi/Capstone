'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('progress_updates', {
      id: { // Primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: { // References users table
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      updateDate: { // Date of update
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      loginStreak: { // Login streak count
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      details: { // Optional details
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: { // Creation timestamp
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: { // Update timestamp
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('progress_updates');
  }
};
