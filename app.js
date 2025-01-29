require('dotenv').config(); // Load environment variables
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// Import Routes
const landingRoutes = require('./src/routes/landingRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const tutorRoutes = require('./src/routes/tutorRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'src', 'views')));

// Use Routes
app.use('/', landingRoutes);        // Landing page routes
app.use('/student', studentRoutes); // Student-specific routes
app.use('/tutor', tutorRoutes);     // Tutor-specific routes

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
