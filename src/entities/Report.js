// src/entities/Report.js
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Import the DB connection

class Report extends Model {
  static associate(models) {
    // The user who filed the report
    Report.belongsTo(models.User, { foreignKey: 'reporterId', as: 'reporter' });
    // The user being reported
    Report.belongsTo(models.User, { foreignKey: 'reportedId', as: 'reported' });
  }
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reporterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reporterid', // matches DB column
    },
    reportedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'reportedid', // matches DB column
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Report',
    tableName: 'reports',
    timestamps: true, // uses createdAt and updatedAt
  }
);

module.exports = Report;