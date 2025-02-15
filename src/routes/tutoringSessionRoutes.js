const express = require('express');
const tutoringSessionController = require('../controllers/tutoringSessionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new session (protected route)
router.post('/', authenticateJWT, tutoringSessionController.createSession);

// Get all sessions (optionally, filter by tutor or student)
router.get('/', authenticateJWT, tutoringSessionController.getSessions);

// Get a specific session by ID
router.get('/:id', authenticateJWT, tutoringSessionController.getSessionById);

// Update a session by ID
router.put('/:id', authenticateJWT, tutoringSessionController.updateSession);

// Delete a session by ID
router.delete('/:id', authenticateJWT, tutoringSessionController.deleteSession);

module.exports = router;
