'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class LearningStyleResponse extends Model {}

LearningStyleResponse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'userId'
    },
    answer1: { type: DataTypes.TEXT, allowNull: false },
    answer2: { type: DataTypes.TEXT, allowNull: false },
    answer3: { type: DataTypes.TEXT, allowNull: false },
    answer4: { type: DataTypes.TEXT, allowNull: false },
    answer5: { type: DataTypes.TEXT, allowNull: false },
    answer6: { type: DataTypes.TEXT, allowNull: false },
    answer7: { type: DataTypes.TEXT, allowNull: false },
    answer8: { type: DataTypes.TEXT, allowNull: false },
    answer9: { type: DataTypes.TEXT, allowNull: false },
    answer10: { type: DataTypes.TEXT, allowNull: false },
    // role is stored as a numeric value (e.g., 7 for STUDENT, 8 for TUTOR)
    role: { type: DataTypes.INTEGER, allowNull: false }
  },
  {
    sequelize,
    modelName: 'LearningStyleResponse',
    tableName: 'learning_style_responses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true
  }
);

module.exports = LearningStyleResponse;
