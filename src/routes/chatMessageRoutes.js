'use strict';

const express = require('express');
const chatMessageController = require('../controllers/chatMessageController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Create chat message
router.post('/', authenticateJWT, chatMessageController.createMessage);

// Get all messages
router.get('/', authenticateJWT, chatMessageController.getMessages);

// Get message by ID
router.get('/:id', authenticateJWT, chatMessageController.getMessageById);

// Update message by ID
router.put('/:id', authenticateJWT, chatMessageController.updateMessage);

// Delete message by ID
router.delete('/:id', authenticateJWT, chatMessageController.deleteMessage);

module.exports = router;
