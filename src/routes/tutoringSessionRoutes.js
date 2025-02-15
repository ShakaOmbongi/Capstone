'use strict';

const express = require('express');
const tutoringSessionController = require('../controllers/tutoringSessionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, tutoringSessionController.createSession);

router.get('/', authenticateJWT, tutoringSessionController.getSessions);

router.get('/:id', authenticateJWT, tutoringSessionController.getSessionById);

router.put('/:id', authenticateJWT, tutoringSessionController.updateSession);

router.delete('/:id', authenticateJWT, tutoringSessionController.deleteSession);

module.exports = router;
