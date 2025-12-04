import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import connectDB from './config/db.js';
import configurePassport from './config/passport.js';
import { configureSocket } from './config/socket.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Create HTTP server for Socket.io
const httpServer = createServer(app);

// Configure Socket.io
const io = configureSocket(httpServer);

// Make io accessible to routes via app.locals
app.locals.io = io;

// Configure Passport strategies
configurePassport();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Passport
app.use(passport.initialize());

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Sports PWA Task Manager API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Sports PWA Task Manager API',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Centralized error handling middleware - must be last
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start HTTP server (with Socket.io)
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🎯 API URL: http://localhost:${PORT}`);
      console.log(`🔌 WebSocket server ready`);
      console.log(`⚽ Sports PWA Task Manager API is ready!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
