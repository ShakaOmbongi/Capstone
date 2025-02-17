const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db'); //import

class LearningStyleQuestion extends Model {
  static associate(models) {
    // One to many
    LearningStyleQuestion.hasMany(models.LearningStyleResponse, { foreignKey: 'questionId', as: 'responses' });
  }
}

LearningStyleQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'LearningStyleQuestion',
    tableName: 'learning_style_questions',
    timestamps: true,
  }
);

module.exports = LearningStyleQuestion;
