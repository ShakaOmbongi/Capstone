'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tutoring_sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      // Foreign key for the tutor 
      tutorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Ensure that the users table exists and is created before this migration
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      // Foreign key for the student 
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      subject: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      
      sessionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // Status of the session with a default value of 'pending'
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      //  manage timestamps
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tutoring_sessions');
  }
};
