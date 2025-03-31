'use strict';
require('dotenv').config();
const express = require('express');
<<<<<<< HEAD
const helmet = require('helmet');
=======
const http = require('http');
const { Server } = require('socket.io'); // Ensure this is also imported if using Socket.io
>>>>>>> origin/Frontend-to-Backend
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');


const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware (Helmet helps secure HTTP headers)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    },
  })
);

// Middleware for parsing JSON payloads and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Import authentication middleware
const { authenticateJWT } = require('./src/middleware/authMiddleware');

// Import route files
const landingRoutes = require('./src/routes/landingRoutes');
const signupRoutes = require('./src/routes/signupRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const tutorRoutes = require('./src/routes/tutorRoutes');
const logoutRoutes = require('./src/routes/logoutRoutes');
const sessionRoutes = require('./src/routes/tutoringSessionRoutes');
const chatMessageRoutes = require('./src/routes/chatMessageRoutes');
const studentTestRoutes = require('./src/routes/studentTestRoutes');
<<<<<<< HEAD
const learningStyleRoutes = require('./src/routes/learningStyleRoutes');
=======
>>>>>>> origin/Frontend-to-Backend

// Mount routes
app.use('/', landingRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
<<<<<<< HEAD
app.use('/learning-style', learningStyleRoutes);
=======
>>>>>>> origin/Frontend-to-Backend

// Apply authentication middleware on routes that require a valid token
app.use('/student', authenticateJWT, studentRoutes);
app.use('/student/test', authenticateJWT, studentTestRoutes);
app.use('/tutor', authenticateJWT, tutorRoutes);
app.use('/', logoutRoutes);
app.use('/sessions', authenticateJWT, sessionRoutes);
app.use('/chat-messages', authenticateJWT, chatMessageRoutes);

// Catch-all handler for 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: 'Not Found'
  });
});

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});