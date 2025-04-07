// src/entities/JoinRequest.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class JoinRequest extends Model {}

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
    userId: {
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
