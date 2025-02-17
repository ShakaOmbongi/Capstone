const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db'); //import

class FeedbackReview extends Model {
  static associate(models) {
    // The reviewer is the user who leaves the review
    FeedbackReview.belongsTo(models.User, { foreignKey: 'reviewerId', as: 'reviewer' });
    // The reviewee can be a tutor, student, or study group; here we assume it's a user
    FeedbackReview.belongsTo(models.User, { foreignKey: 'revieweeId', as: 'reviewee' });
  }
}

FeedbackReview.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reviewerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    revieweeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'FeedbackReview',
    tableName: 'feedback_reviews',
    timestamps: true,
  }
);

module.exports = FeedbackReview;
