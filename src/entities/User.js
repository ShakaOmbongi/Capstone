// src/entities/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class User extends Model {
  static associate(models) {
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    User.hasOne(models.UserProfile, { foreignKey: 'userId', as: 'profile' });

    // Optional if you want reverse access
    User.hasMany(models.TutoringSession, { foreignKey: 'tutorId', as: 'createdSessions' });
    User.hasMany(models.TutoringSession, { foreignKey: 'studentId', as: 'joinedSessions' });
  }
}

User.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  profilePic: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
