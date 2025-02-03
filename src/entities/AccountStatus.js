const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');//import

class AccountStatus extends Model {}

AccountStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'AccountStatus',
    tableName: 'account_statuses', 
    timestamps: true,
  }
);

module.exports = AccountStatus;
