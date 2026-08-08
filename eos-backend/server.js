require('./dns-config');
require('dotenv').config({ path: './.env' });

const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const db = require('./config/db');
const authRoutes = require('./routes/auth');
const healthRoutes = require('./routes/health');
const productRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

// Socket.io with CORS for frontend
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a private room using the user's ID
  socket.on('join-room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending a message
  socket.on('send-message', async (data) => {
    const { sender, receiver, content } = data;
    try {
      const Message = require('./models/Message');
      const message = new Message({ sender, receiver, content });
      await message.save();
      
      // Emit to the receiver's room
      io.to(receiver).emit('receive-message', message);
      // Confirm back to sender
      socket.emit('message-sent', message);
    } catch (err) {
      socket.emit('error', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server (only after DB connects)
const PORT = process.env.PORT || 5000;
db().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});