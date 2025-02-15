// app.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON, URL encoded data, and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Import route files
const landingRoutes = require('./src/routes/landingRoutes');
const signupRoutes  = require('./src/routes/signupRoutes');
const loginRoutes   = require('./src/routes/loginRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const tutorRoutes   = require('./src/routes/tutorRoutes');
const logoutRoutes  = require('./src/routes/logoutRoutes');
const sessionRoutes = require('./src/routes/tutoringSessionRoutes'); 

// Mount routes
app.use('/', landingRoutes);       // Static pages (welcome, sign-up, login pages)
app.use('/signup', signupRoutes);    // POST endpoints for sign-up
app.use('/login', loginRoutes);      // POST endpoints for login
app.use('/student', studentRoutes);  // Protected student dashboard routes
app.use('/tutor', tutorRoutes);      // Protected tutor dashboard routes
app.use('/', logoutRoutes);          // Logout route (e.g., /logout)
app.use('/sessions', sessionRoutes); // Tutoring sessions API endpoints

// Catch-all for 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
