const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class LearningStyleResult extends Model {
  static associate(models) {
    // Each result belongs to a user
    LearningStyleResult.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

LearningStyleResult.init(
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
    // Stores the computed learning style 
    learningStyle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    //  A numeric score
    score: {
      type: DataTypes.FLOAT,
      allowNull: true,
    }
  },
  {
    sequelize,
    modelName: 'LearningStyleResult',
    tableName: 'learning_style_results',
    timestamps: true,
  }
);

module.exports = LearningStyleResult;
