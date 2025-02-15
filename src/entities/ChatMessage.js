// src/entities/ChatMessage.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db');

class ChatMessage extends Model {
  static associate(models) {
    // Each chat message belongs to a sender (User)
    ChatMessage.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
    // Each chat message belongs to a receiver (User)
    ChatMessage.belongsTo(models.User, { foreignKey: 'receiverId', as: 'receiver' });
  }
}

ChatMessage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ChatMessage',
    tableName: 'chat_messages',
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = ChatMessage;
