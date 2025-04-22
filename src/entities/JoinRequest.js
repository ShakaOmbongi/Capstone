// src/entities/JoinRequest.js
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class JoinRequest extends Model {
  static associate(models) {
    // Each join request belongs to a student (user making the request)
    JoinRequest.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'requestingStudent'  // renamed alias (was 'student')
    });

    // Each join request is for a specific tutoring session
    JoinRequest.belongsTo(models.TutoringSession, {
      foreignKey: 'sessionId',
      as: 'requestedSession'   // renamed alias (was 'session')
    });
  }
}

JoinRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    sessionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    modelName: 'JoinRequest',
    tableName: 'join_requests',
    timestamps: true
  }
);

module.exports = JoinRequest;
