'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tutoring_sessions', {
      id: { // Primary key
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tutorId: { // Tutor foreign key
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      studentId: { // Student foreign key (if a session is created by a tutor and a student hasn't been assigned yet, 
                  // you might consider making this allowNull: true; adjust based on your use case)
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      subject: { // Session subject
        type: Sequelize.STRING,
        allowNull: false,
      },
      sessionDate: { // Session date/time
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: { // Optional description for the session
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: { // Session status
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending',
      },
      createdAt: { // Timestamp
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: { // Timestamp
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
