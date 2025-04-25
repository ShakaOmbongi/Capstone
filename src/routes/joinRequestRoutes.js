// src/routes/joinRequestRoutes.js
'use strict';

const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const joinRequestController = require('../controllers/joinRequestController');

// Student requests to join a session
router.post('/sessions/request/:sessionId', authenticateJWT, joinRequestController.create);

// Creator views join requests for their sessions
router.get('/requests', authenticateJWT, joinRequestController.getMyRequests);

// Creator accepts a join request
router.put('/requests/accept/:requestId', authenticateJWT, joinRequestController.accept);

// Creator rejects a join request
router.put('/requests/reject/:requestId', authenticateJWT, joinRequestController.reject);

router.post(
    '/custom',
    authenticateJWT,
    joinRequestController.createCustomRequest
  );

module.exports = router;
