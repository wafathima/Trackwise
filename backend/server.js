// backend/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const adminRoutes = require('./routes/admin/adminRoutes'); 
const studyRoutes = require('./routes/studyRoutes');
const healthRoutes = require('./routes/healthRoutes');
const habitRoutes = require('./routes/habitRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const parentRoutes = require('./routes/parentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');



const app = express();

// CORS Configuration - Allow frontend ports
app.use(cors({
  origin: ['http://localhost:2020', 'http://127.0.0.1:2020', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/profiles')) {
  fs.mkdirSync('uploads/profiles', { recursive: true });
}



// ✅ Routes - Order matters!
app.use('/api/admin', adminRoutes);  
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/teacher', teacherRoutes);






// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    port: process.env.PORT || 8080,
    timestamp: new Date().toISOString()
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

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ MongoDB Connected successfully.');
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`🧪 Test route: http://localhost:${PORT}/api/test`);
    console.log(`👤 Admin route: http://localhost:${PORT}/api/admin`);
    console.log(`🔐 Auth route: http://localhost:${PORT}/api/auth`);
  });
})
.catch((err) => {
  console.error('❌ Database connection error:', err.message);
  process.exit(1);
});