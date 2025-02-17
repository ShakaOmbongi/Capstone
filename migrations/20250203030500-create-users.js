'use strict';

module.exports = {
  // Create the users table
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { // Primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: { // Unique username
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: { // Unique email
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: { // Hashed password
        type: Sequelize.STRING,
        allowNull: false,
      },
      roleId: { // Foreign key to roles table
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

  // Drop the users table
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
