const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class ProgressUpdate extends Model {
  static associate(models) {
    // Each progress update belongs to a user
    ProgressUpdate.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
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
    // The date this update is for 
    updateDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    // The login streak count
    loginStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // Additional details or notes 
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
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
