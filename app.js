require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server

// ====================== SETUP SUPABASE ======================
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(" Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"]
  }
});

app.use(
helmet.contentSecurityPolicy({
  directives: {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      "'unsafe-eval'",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com" 
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
    "img-src": [
      "'self'",
      "data:",
      "https://mdnnxwpxypxgwhfkzgok.supabase.co"
    ]
  }
}))


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Import authentication middleware and routes
const { authenticateJWT } = require('./src/middleware/authMiddleware');
const landingRoutes = require('./src/routes/landingRoutes');
const signupRoutes = require('./src/routes/signupRoutes');
const loginRoutes = require('./src/routes/loginRoutes');
const studentRoutes = require('./src/routes/studentRoutes');
const tutorRoutes = require('./src/routes/tutorRoutes');
const logoutRoutes = require('./src/routes/logoutRoutes');
const sessionRoutes = require('./src/routes/tutoringSessionRoutes');
const chatMessageRoutes = require('./src/routes/chatMessageRoutes');
const studentTestRoutes = require('./src/routes/studentTestRoutes');
const learningStyleRoutes = require('./src/routes/learningStyleRoutes');

const tutorUserRoutes = require('./src/routes/tutorUserRoutes');
app.use('/tutoruser', tutorUserRoutes);

// Admin routes
const adminAuthRoutes = require('./src/routes/adminRoutesAuth');
app.use('/admin/auth', adminAuthRoutes);

const adminRoutes = require('./src/routes/adminRoutes');
app.use('/admin', adminRoutes);

const joinRequestRoutes = require('./src/routes/joinRequestRoutes');
app.use('/student/join', joinRequestRoutes);

const feedbackRoutes = require('./src/routes/feedbackRoutes');
app.use('/admin/feedback', feedbackRoutes);

// Use for tutors
app.use('/tutoruser/join', joinRequestRoutes);
// Mount other routes
app.use('/', landingRoutes);
app.use('/signup', signupRoutes);
app.use('/login', loginRoutes);
app.use('/learning-style', learningStyleRoutes);

// Apply authentication middleware on routes that require a valid token
app.use('/student', authenticateJWT, studentRoutes);
app.use('/student/test', authenticateJWT, studentTestRoutes);
app.use('/tutor', authenticateJWT, tutorRoutes);
app.use('/', logoutRoutes);
app.use('/sessions', authenticateJWT, sessionRoutes);
app.use('/chat-messages', authenticateJWT, chatMessageRoutes);
app.use('/uploads', express.static('uploads'));


// ========================== API ROUTES ==========================
//  Get Logged-in User
app.get("/api/get-user", (req, res) => {
  const username = req.cookies.username;
  if (username) {
      res.json({ username });
  } else {
      res.status(401).json({ error: "User not authenticated" });
  }
});

// Get Unique Chatrooms
app.get("/api/chat-rooms", async (req, res) => {
  const username = req.cookies.username;
  if (!username) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { data: rooms, error } = await supabase
      .from("chat_messages")
      .select("conversationId, message, createdAt, senderId, receiverid")
      .or(`senderId.eq.${username},receiverid.eq.${username}`)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    // Deduplicate by conversationId
    const seen = new Set();
    const uniqueRooms = [];

    for (let room of rooms) {
      if (!seen.has(room.conversationId)) {
        seen.add(room.conversationId);
        uniqueRooms.push(room);
      }
    }

    res.json(uniqueRooms);
  } catch (err) {
    console.error("Error fetching chatrooms:", err);
    res.status(500).json({ error: err.message });
  }
});

//  Get Messages for a Specific Chatroom
app.get("/api/chat-messages/:roomId", async (req, res) => {
  const { roomId } = req.params;

  try {
      const { data: messages, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversationId", roomId)
          .order("createdAt", { ascending: true });

      if (error) throw error;

      res.json(messages);
  } catch (err) {
      console.error(" Error fetching messages:", err);
      res.status(500).json({ error: err.message });
  }
});

// Get chatrooms where current user is involved
app.get("/api/user-chatrooms", async (req, res) => {
  const username = req.cookies.username;
  if (!username) return res.status(401).json({ error: "Not authenticated" });

  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("conversationId")
      .or(`senderId.eq.${username},receiverid.eq.${username}`)
      .order("createdAt", { ascending: false });

    if (error) throw error;

    // Remove duplicates
    const uniqueRooms = [...new Set(data.map(d => d.conversationId))];
    res.json(uniqueRooms);
  } catch (err) {
    console.error("❌ Error getting user chatrooms:", err.message);
    res.status(500).json({ error: err.message });
  }
});


// ========================== SOCKET.IO CHAT HANDLING ==========================
io.on("connection", (socket) => {
  console.log(" A user connected:", socket.id);

  //  User Joins a Chat Room
  socket.on("joinRoom", async ({ conversationId, username }) => {
      socket.join(conversationId);
      console.log(`🔹 ${username} joined room: ${conversationId}`);

      const { data: messages, error } = await supabase
          .from("chat_messages")
          .select("*")
          .eq("conversationId", conversationId)
          .order("createdAt", { ascending: true });

      if (!error) {
          socket.emit("previousMessages", messages);
      }
  });

  //  Handle Sending Messages
  socket.on("chatMessage", async (data) => {
      try {
          let { conversationId, senderId, receiverid, message } = data;

          if (!receiverid || receiverid.trim() === "") {
              console.error(" Error: receiverid is missing or empty.");
              return;
          }
              console.log(`📨 Message received in room ${conversationId} from ${senderId} to ${receiverid}: ${message}`);

              //  Save message to Supabase
              const { error } = await supabase.from("chat_messages").insert([
                  {
                      conversationId,
                      senderId,
                      receiverid,  //  Now stored as TEXT
                      message
                  }
              ]);

              if (error) {
                  console.error(" Error saving message:", error.message);
                  return;
              }

              //  Broadcast message to all users in the same chatroom
              io.to(conversationId).emit("chatMessage", data);
          } catch (err) {
              console.error(" Error processing chat message:", err.message);
          }
      });

  //  Handle Disconnection
  socket.on("disconnect", () => {
      console.log(" A user disconnected:", socket.id);
  });
});

// ========================== TEST SUPABASE CONNECTION ==========================
async function testSupabaseConnection() {
  const { data, error } = await supabase.from("chat_messages").select("*").limit(5);
  if (error) {
      console.error(" Supabase connection failed:", error.message);
  } else {
      console.log(" Supabase connection successful:", data);
  }
}
testSupabaseConnection();

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
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
