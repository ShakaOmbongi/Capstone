'use strict';

module.exports = {
  // Run migration: create roles table
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: { // Primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: { // Unique role name
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      description: { // Optional description
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: { // Record creation time
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: { // Record update time
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  // Revert migration: drop roles table
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('roles');
  }
};
