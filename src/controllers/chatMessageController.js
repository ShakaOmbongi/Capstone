'use strict';

const chatMessageService = require('../services/chatMessageService');

const chatMessageController = {
  async createMessage(req, res) {
    try {
      const { content, receiverId, conversationId } = req.body;
      const senderId = req.user.id;
      const newMessage = await chatMessageService.createMessage({ senderId, receiverId, conversationId, content });
      res.status(201).json({ status: 'success', message: 'Message created', data: newMessage });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getMessages(req, res) {
    try {
      const messages = await chatMessageService.getAllMessages(req.query);
      res.status(200).json({ status: 'success', message: 'Messages fetched', data: messages });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async getMessageById(req, res) {
    try {
      const message = await chatMessageService.getMessageById(req.params.id);
      if (!message) return res.status(404).json({ status: 'error', message: 'Message not found' });
      res.status(200).json({ status: 'success', message: 'Message fetched', data: message });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async updateMessage(req, res) {
    try {
      const updates = req.body;
      const updated = await chatMessageService.updateMessage(req.params.id, updates);
      if (!updated) return res.status(404).json({ status: 'error', message: 'Message not found or not updated' });
      res.status(200).json({ status: 'success', message: 'Message updated', data: updated });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  async deleteMessage(req, res) {
    try {
      const deleted = await chatMessageService.deleteMessage(req.params.id);
      if (!deleted) return res.status(404).json({ status: 'error', message: 'Message not found or not deleted' });
      res.status(200).json({ status: 'success', message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};

module.exports = chatMessageController;
