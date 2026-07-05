// routes/authRoutes.js (or routes/auth.js)
const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  googleAuth, 
  forgotPassword, 
  resetPassword 
} = require('../controllers/authController');

// Ensure these paths precisely match your frontend api requests
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword); 
router.put('/reset-password/:token', resetPassword); 

module.exports = router;