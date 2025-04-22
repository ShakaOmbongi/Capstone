'use strict';

const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const tutoringSessionController = require('../controllers/tutoringSessionController');

const router = express.Router();

// Create a session (default pending)
router.post('/create', authenticateJWT, tutoringSessionController.createSession);
router.post('/', authenticateJWT, tutoringSessionController.createSession);

// Join a session
router.post('/request/:id', authenticateJWT, tutoringSessionController.joinSession);

// Get all sessions (optionally filtered)
router.get('/', authenticateJWT, tutoringSessionController.getSessions);

// Get a session by ID
router.get('/:id', authenticateJWT, tutoringSessionController.getSessionById);

// Update a session by ID
router.put('/:id', authenticateJWT, tutoringSessionController.updateSession);

// Delete a session by ID
router.delete('/:id', authenticateJWT, tutoringSessionController.deleteSession);

// Accept a session (change status to accepted)
router.put('/accept/:id', authenticateJWT, tutoringSessionController.acceptSession);

// Reject a session (change status to rejected)
router.put('/reject/:id', authenticateJWT, tutoringSessionController.rejectSession);

module.exports = router;
