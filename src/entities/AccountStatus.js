const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db'); // Import the Sequelize connection

class AccountStatus extends Model {}

// Initialize the AccountStatus model
AccountStatus.init(
  {
    // Primary key: auto-incrementing ID
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // The account status 
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // description of the account status
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass the connection instance
    modelName: 'AccountStatus', // Model name
    tableName: 'account_statuses', // Table name in the database
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = AccountStatus;
