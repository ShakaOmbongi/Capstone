require('dotenv').config();
const express = require('express');
const http = require('http'); // Required for Socket.io
const { Server } = require('socket.io'); // Import Socket.io
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware for parsing JSON & handling cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (CSS, JS, Images)
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

// Mount routes
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

// ========================== SOCKET.IO CHAT HANDLING ==========================
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle receiving messages from clients
    socket.on("chatMessage", (data) => {
        console.log("Message received:", data);
       
        // Broadcast the message to all connected clients
        io.emit("chatMessage", data);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// Start the server with Socket.io support
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});