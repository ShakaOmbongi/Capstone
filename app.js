require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware for parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (images, CSS, JS)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'assets/css')));
app.use('/images', express.static(path.join(__dirname, 'assets/images')));
app.use('/js', express.static(path.join(__dirname, 'assets/js')));
app.use('/views', express.static(path.join(__dirname, 'src/views')));

// Import routes from `src/routes/`
const landingRoutes = require('./src/routes/landingRoutes');
const signupRoutes  = require('./src/routes/signupRoutes');
const loginRoutes   = require('./src/routes/loginRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const tutorRoutes   = require('./src/routes/tutorRoutes');
const logoutRoutes  = require('./src/routes/logoutRoutes');
const sessionRoutes = require('./src/routes/tutoringSessionRoutes'); 
const chatMessageRoutes = require('./src/routes/chatMessageRoutes');

//  Mount routes
app.use('/', landingRoutes);       
app.use('/signup', signupRoutes);   
app.use('/login', loginRoutes);     
app.use('/student', studentRoutes);  
app.use('/tutor', tutorRoutes);      
app.use('/', logoutRoutes);         
app.use('/sessions', sessionRoutes); 
app.use('/chat-messages', chatMessageRoutes);

// Catch-all for 404 errors
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
