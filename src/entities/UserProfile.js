'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class UserProfile extends Model {
  static associate(models) {
    //  Each user profile belongs to a user
    UserProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  }
}

UserProfile.init(
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
    learningstyle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    availability: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subjects: {
      type: DataTypes.STRING, // or TEXT if you need more space
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'UserProfile',
    tableName: 'user_profiles',
    timestamps: true,
  }
);

module.exports = UserProfile;
