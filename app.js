'use strict';
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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

const tutorUserRoutes = require('./src/routes/tutorUserRoutes');
app.use('/tutoruser', tutorUserRoutes);

// Admin routes
const adminAuthRoutes = require('./src/routes/adminRoutesAuth');
app.use('/admin/auth', adminAuthRoutes);

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);

// Mount other routes
app.use('/', landingRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/student', studentRoutes);
app.use('/student/test', studentTestRoutes);
app.use('/tutor', tutorRoutes);
app.use('/', logoutRoutes);
app.use('/sessions', sessionRoutes);
app.use('/chat-messages', chatMessageRoutes);

// Catch-all handler for 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
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
