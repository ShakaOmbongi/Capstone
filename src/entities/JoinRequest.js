'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class JoinRequest extends Model {
  static associate(models) {
    // who made it
    JoinRequest.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'requestingStudent'
    });
    // if session-based
    JoinRequest.belongsTo(models.TutoringSession, {
      foreignKey: 'sessionId',
      as: 'requestedSession'
    });
    // if custom
    JoinRequest.belongsTo(models.User, {
      foreignKey: 'tutorid',   // matches your lower-case column
      as: 'requestedTutor'
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

    studentId: {            // maps to DB column “studentId”
      type: DataTypes.INTEGER,
      allowNull: false
    },

    sessionId: {            // maps to DB column “sessionId”
      type: DataTypes.INTEGER,
      allowNull: true
    },

    tutorId: {              // JS attr “tutorId”
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'tutorid'       // …stored in lower-case “tutorid”
    },

    requestedDate: {        // JS attr “requestedDate”
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'requested_date' // …stored in snake_case “requested_date”
    },

    requestedTime: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'requested_time'
    },

    note: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'note'
    },

    status: {
      type: DataTypes.ENUM('pending','accepted','rejected'),
      allowNull: false,
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    modelName: 'JoinRequest',
    tableName: 'join_requests',
    timestamps: true,
    // underscored: true,   ← remove this
  }
);

module.exports = JoinRequest;
