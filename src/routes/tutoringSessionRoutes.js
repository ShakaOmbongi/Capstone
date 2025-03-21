const express = require('express');
const { authenticateJWT } = require('../middleware/authMiddleware');
const tutoringSessionController = require('../controllers/tutoringSessionController'); // path

const router = express.Router();

// Join a session endpoint
router.post('/request/:id', authenticateJWT, tutoringSessionController.joinSession);

// Create a session with '/create'
router.post('/create', authenticateJWT, tutoringSessionController.createSession);

// Create a session
router.post('/', authenticateJWT, tutoringSessionController.createSession);

// Get all sessions
router.get('/', authenticateJWT, tutoringSessionController.getSessions);

// Get a session by ID
router.get('/:id', authenticateJWT, tutoringSessionController.getSessionById);

// Update a session by ID
router.put('/:id', authenticateJWT, tutoringSessionController.updateSession);

// Delete a session by ID
router.delete('/:id', authenticateJWT, tutoringSessionController.deleteSession);

module.exports = router;
