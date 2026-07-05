// // server.js
// require('dotenv').config();

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const authRoutes = require('./routes/authRoutes');

// const app = express();

// // Enhanced CORS Configuration
// app.use(cors({
//   origin: ['http://localhost:2020', 'http://127.0.0.1:2020', 'http://localhost'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Routes
// app.use('/api/auth', authRoutes);

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
//   res.status(500).json({ message: 'Something went wrong!' });
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// // Connect MongoDB and start server
// const PORT = process.env.PORT || 8080;

// console.log('🚀 Starting server...');
// console.log('📡 Port:', PORT);
// console.log('🗄️  MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB Connected successfully.');
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//       console.log(`📍 http://localhost:${PORT}`);
//       console.log(`📍 http://127.0.0.1:${PORT}`);
//       console.log(`🧪 Test route: http://localhost:${PORT}/api/test`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Database connection error:', err.message);
//     process.exit(1);
//   });

// server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Enhanced CORS Configuration
app.use(cors({
  origin: ['http://localhost:2020', 'http://127.0.0.1:2020', 'http://localhost', 'http://localhost:8080'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploaded profile images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/profiles')) {
  fs.mkdirSync('uploads/profiles', { recursive: true });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Test route to check if server is running
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    port: process.env.PORT || 8080,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl 
  });
});

// Connect MongoDB and start server
const PORT = process.env.PORT || 8080;

console.log('🚀 Starting server...');
console.log('📡 Port:', PORT);
console.log('🗄️  MongoDB URI:', process.env.MONGO_URI ? 'Set' : 'Not set');
console.log('📁 Uploads directory:', path.join(__dirname, 'uploads/profiles'));

// ✅ FIXED: Remove deprecated options
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB Connected successfully.');
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`📍 http://127.0.0.1:${PORT}`);
    console.log(`🧪 Test route: http://localhost:${PORT}/api/test`);
    console.log(`👤 Profile route: http://localhost:${PORT}/api/profile`);
    console.log(`🔐 Auth route: http://localhost:${PORT}/api/auth`);
  });
})
.catch((err) => {
  console.error('❌ Database connection error:', err.message);
  console.error('Please make sure MongoDB is running.');
  console.error('Try: mongod --dbpath /path/to/data');
  process.exit(1);
});