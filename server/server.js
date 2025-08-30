require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Poll = require('./models/Poll');

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/polls', require('./routes/polls'));

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions,
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-poll', (pollId) => {
    socket.join(pollId);
    console.log(`User ${socket.id} joined poll room: ${pollId}`);
  });

  socket.on('vote', async ({ pollId, optionId }) => {
    try {
      const poll = await Poll.findById(pollId);
      if (poll) {
        const option = poll.options.id(optionId);
        if (option) {
          option.votes += 1;
          await poll.save();
          // Broadcast the updated poll results to everyone in the poll's room
          io.to(pollId).emit('results-updated', poll);
        }
      }
    } catch (error) {
      console.error('Error processing vote:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));