'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class Match extends Model {}

Match.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id'
    },
    tutorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'tutor_id'
    },
    matchScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'match_score'
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'Match',
    tableName: 'matches',
    timestamps: true,
    underscored: true,  // This will map createdAt -> created_at and updatedAt -> updated_at
  }
);

module.exports = Match;
