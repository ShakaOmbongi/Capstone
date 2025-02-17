const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class LearningStyleResponse extends Model {
  static associate(models) {
    // Each response belongs to a question
    LearningStyleResponse.belongsTo(models.LearningStyleQuestion, { foreignKey: 'questionId', as: 'question' });
    // And to the user who answered
    LearningStyleResponse.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

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
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'LearningStyleResponse',
    tableName: 'learning_style_responses',
    timestamps: true,
  }
);

module.exports = LearningStyleResponse;
