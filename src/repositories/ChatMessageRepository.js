'use strict';

const ChatMessage = require('../entities/ChatMessage');

// Repository for chat messages
class ChatMessageRepository {
  // Create a new message
  async createMessage(messageData) {
    return await ChatMessage.create(messageData);
  }

  // Get a message by ID (with sender details)
  async getMessageById(messageId) {
    return await ChatMessage.findByPk(messageId, {
      include: [{ association: 'sender' }]
    });
  }

  // Get all messages (optional filter)
  async getAllMessages(filter = {}) {
    return await ChatMessage.findAll({
      where: filter,
      include: [{ association: 'sender' }]
    });
  }

  // Update a message by ID
  async updateMessage(messageId, updates) {
    return await ChatMessage.update(updates, { where: { id: messageId } });
  }

  // Delete a message by ID
  async deleteMessage(messageId) {
    return await ChatMessage.destroy({ where: { id: messageId } });
  }
}

module.exports = new ChatMessageRepository();
