'use strict';

const chatMessageRepository = require('../repositories/ChatMessageRepository');

// Service for chat messages
class ChatMessageService {
  // Create a new message
  async createMessage(messageData) {
    return await chatMessageRepository.createMessage(messageData);
  }

  // Get message by ID
  async getMessageById(messageId) {
    return await chatMessageRepository.getMessageById(messageId);
  }

  // Get all messages (with optional filter)
  async getAllMessages(filter = {}) {
    return await chatMessageRepository.getAllMessages(filter);
  }

  // Update message by ID
  async updateMessage(messageId, updates) {
    return await chatMessageRepository.updateMessage(messageId, updates);
  }

  // Delete message by ID
  async deleteMessage(messageId) {
    return await chatMessageRepository.deleteMessage(messageId);
  }
}

module.exports = new ChatMessageService();
