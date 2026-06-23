require('dns').setDefaultResultOrder('ipv4first');
require('dotenv').config();
const express = require('express');

const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB connection
let isDbConnected = false;
if (MONGO_URI) {
  console.log('Connecting to MongoDB...');
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connection established successfully.');
    isDbConnected = true;
    
    // Seed default admin and content if database is empty
    require('./seed')();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
    console.log('Server will run in Demo Mode using in-memory state.');
  });
} else {
  console.log('No MONGO_URI provided in environment. Server will run in Demo Mode with in-memory state.');
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: isDbConnected ? 'connected' : 'running in-memory (demo mode)',
    timestamp: new Date()
  });
});

// Use API Routes
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
