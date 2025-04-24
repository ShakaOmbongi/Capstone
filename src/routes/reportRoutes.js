// src/routes/reportRoutes.js
'use strict';

const express= require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');

// POST /report-user
router.post(
  '/report-user',
  authenticateJWT,
  reportController.createReport
);

module.exports = router;
