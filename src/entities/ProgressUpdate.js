// src/entities/ProgressUpdate.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class ProgressUpdate extends Model {
  static associate(models) {
    // Each progress update belongs to a user
    ProgressUpdate.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    // Optionally, you could link to a tutoring session if needed:
    // ProgressUpdate.belongsTo(models.TutoringSession, { foreignKey: 'sessionId', as: 'session' });
  }
}

ProgressUpdate.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    progressData: {
      type: DataTypes.TEXT, // Or DataTypes.JSON if your DB supports it
      allowNull: false,
    },
    // You can store the date of the progress update here if needed
    updateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'ProgressUpdate',
    tableName: 'progress_updates',
    timestamps: true,
  }
);

module.exports = ProgressUpdate;
