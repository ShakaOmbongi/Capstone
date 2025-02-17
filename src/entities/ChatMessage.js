
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../db'); //import

class ChatMessage extends Model {
  static associate(models) {
    // Each chat message belongs to a sender 
    ChatMessage.belongsTo(models.User, { foreignKey: 'senderId', as: 'sender' });
    // Each chat message belongs to a receiver 
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
    timestamps: true, 
  }
);

module.exports = ChatMessage;
