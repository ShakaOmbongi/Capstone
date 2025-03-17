require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { createClient } = require("@supabase/supabase-js");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app); // Create HTTP server

// ====================== SETUP SUPABASE ======================
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ====================== SETUP SOCKET.IO ======================
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware for parsing JSON & handling cookies
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

    // Join a chat room dynamically
    socket.on("joinRoom", async (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined room: ${conversationId}`);

        // Fetch previous messages from Supabase
        const { data: messages, error } = await supabase
            .from("chat_messages")
            .select("*")
            .eq("conversationId", conversationId)
            .order("createdAt", { ascending: true });

        if (!error) {
            socket.emit("previousMessages", messages);
        }
    });

    // Handle receiving messages from clients
    socket.on("chatMessage", async (data) => {
        const { conversationId, senderId, receiverId, message } = data;

        console.log(`Message received in room ${conversationId}:`, message);

        // Save message to Supabase
        const { error } = await supabase.from("chat_messages").insert([
            {
                conversationId,
                senderId,
                receiverId,
                message
            }
        ]);

        if (error) {
            console.error("Error saving message:", error.message);
            return;
        }

        // Broadcast the message to users in the same conversation
        io.to(conversationId).emit("chatMessage", data);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

// ========================== API ROUTE TO FETCH CHAT ROOMS ==========================
app.get("/api/chat-rooms", async (req, res) => {
    const { data: rooms, error } = await supabase
        .from("chat_rooms")
        .select("id, name, lastMessage");

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.json(rooms);
});

// ========================== FEEDBACK API ROUTES ==========================

// // GET: Fetch all feedback
// app.get("/api/feedback", async (req, res) => {
//   const { data, error } = await supabase
//       .from("feedback")
//       .select("id, user, comment");

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.json(data);
// });

// // DELETE: Remove feedback by ID
// app.delete("/api/feedback/:id", async (req, res) => {
//   const { id } = req.params;

//   const { error } = await supabase
//       .from("feedback")
//       .delete()
//       .eq("id", id);

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.status(200).json({ message: "Feedback deleted successfully." });
// });

// // ========================== USER API ROUTES ==========================

// // GET: Fetch all users
// app.get("/api/users", async (req, res) => {
//   const { data, error } = await supabase
//       .from("users")
//       .select("id, name, email, role");

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.json(data);
// });

// // DELETE: Remove user by ID
// app.delete("/api/users/:id", async (req, res) => {
//   const { id } = req.params;

//   const { error } = await supabase
//       .from("users")
//       .delete()
//       .eq("id", id);

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.status(200).json({ message: "User deleted successfully." });
// });

// // ========================== DASHBOARD STATS API ==========================

// // GET: Total users count
// app.get("/api/stats/total-users", async (req, res) => {
//   const { count, error } = await supabase
//       .from("users")
//       .select("*", { count: "exact", head: true });

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.json({ count });
// });

// // GET: Active tutoring sessions count
// app.get("/api/stats/active-sessions", async (req, res) => {
//   const { count, error } = await supabase
//       .from("tutoring_sessions")
//       .select("*", { count: "exact", head: true })
//       .eq("status", "active"); // Assuming you have an 'active' status

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.json({ count });
// });

// // GET: Pending feedback count
// app.get("/api/stats/pending-feedback", async (req, res) => {
//   const { count, error } = await supabase
//       .from("feedback")
//       .select("*", { count: "exact", head: true })
//       .eq("status", "pending"); // Assuming feedback has a "pending" status

//   if (error) {
//       return res.status(500).json({ error: error.message });
//   }

//   res.json({ count });
// });

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
