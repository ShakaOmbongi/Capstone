const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class TutoringSession extends Model {
  static associate(models) {
    TutoringSession.belongsTo(models.User, { foreignKey: 'tutorId', as: 'tutor' });
    TutoringSession.belongsTo(models.User, { foreignKey: 'studentId', as: 'student' });

  
    TutoringSession.hasMany(models.FeedbackReview, {
      foreignKey: 'sessionId',
      as: 'reviews'
    });
  }
}

TutoringSession.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tutorId: { type: DataTypes.INTEGER, allowNull: false },
  studentId: { type: DataTypes.INTEGER, allowNull: false },
  subject: { type: DataTypes.STRING, allowNull: false },
  sessionDate: { type: DataTypes.DATE, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
}, {
  sequelize,
  modelName: 'TutoringSession',
  tableName: 'tutoring_sessions',
  timestamps: true,
});

module.exports = TutoringSession;
