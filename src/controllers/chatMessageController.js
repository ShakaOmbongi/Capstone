'use strict';

const { ChatMessage } = require('../entities'); // path

module.exports = {
  // Create a new chat message
  async createMessage(req, res) {
    try {
      const { senderId, conversationId, message } = req.body;
      const newMessage = await ChatMessage.create({
        senderId,
        conversationId, 
        message,
      });
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Retrieve all chat messages 
  async getMessages(req, res) {
    try {
      const messages = await ChatMessage.findAll();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Retrieve a specific chat message by ID
  async getMessageById(req, res) {
    try {
      const { id } = req.params;
      const message = await ChatMessage.findByPk(id);
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update a chat message by ID 
  async updateMessage(req, res) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const [updated] = await ChatMessage.update({ message }, { where: { id } });
      if (updated) {
        const updatedMessage = await ChatMessage.findByPk(id);
        return res.status(200).json(updatedMessage);
      }
      throw new Error('Message not found');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a chat message by ID
  async deleteMessage(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ChatMessage.destroy({ where: { id } });
      if (deleted) {
        return res.status(200).json({ message: 'Message deleted successfully' });
      }
      throw new Error('Message not found');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
