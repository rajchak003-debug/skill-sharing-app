import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
  },
});

// Socket.io Real-Time Chat Rooms
io.on('connection', (socket) => {
  socket.on('join_booking_room', (bookingId) => {
    socket.join(bookingId);
  });

  socket.on('send_booking_message', (data) => {
    // Broadcast message to everyone in the booking room except sender
    socket.to(data.bookingId).emit('receive_booking_message', data.message);
  });
});

// Middleware
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Skill Sharing API is running...' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: 'error',
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;
