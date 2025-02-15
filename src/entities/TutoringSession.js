// src/entities/TutoringSession.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class TutoringSession extends Model {
  static associate(models) {
    // Associate a session with a tutor (User)
    TutoringSession.belongsTo(models.User, { foreignKey: 'tutorId', as: 'tutor' });
    // Associate a session with a student (User)
    TutoringSession.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });
  }
}

TutoringSession.init(
  {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Foreign key for the tutor (a user who offers tutoring)
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Foreign key for the student (a user who requests tutoring)
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // The subject or topic of the session
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Date and time of the session
    sessionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // Status of the session (e.g., "pending", "confirmed", "completed", "cancelled")
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    }
  },
  {
    sequelize,
    modelName: 'TutoringSession',
    tableName: 'tutoring_sessions',
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = TutoringSession;
