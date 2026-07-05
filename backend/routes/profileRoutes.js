// backend/routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { auth } = require('../middleware/authMiddleware'); // <- Make sure this exports auth
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserStats,
  getAchievements,
  getRecentActivities,
  getWeeklyProgress,
  deleteAccount,
  resetData
} = require('../controllers/profileController');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profiles/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

// File filter for images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

// ==================== Profile Routes ====================

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, getProfile);

// @route   PUT /api/profile
// @desc    Update user profile
// @access  Private
router.put('/', auth, updateProfile);

// @route   POST /api/profile/upload-image
// @desc    Upload profile image
// @access  Private
router.post('/upload-image', auth, upload.single('profileImage'), uploadProfileImage);

// @route   GET /api/profile/stats
// @desc    Get user stats
// @access  Private
router.get('/stats', auth, getUserStats);

// @route   GET /api/profile/achievements
// @desc    Get user achievements
// @access  Private
router.get('/achievements', auth, getAchievements);

// @route   GET /api/profile/activities
// @desc    Get recent activities
// @access  Private
router.get('/activities', auth, getRecentActivities);

// @route   GET /api/profile/weekly-progress
// @desc    Get weekly progress
// @access  Private
router.get('/weekly-progress', auth, getWeeklyProgress);

// @route   DELETE /api/profile/delete-account
// @desc    Delete account
// @access  Private
router.delete('/delete-account', auth, deleteAccount);

// @route   POST /api/profile/reset-data
// @desc    Reset data
// @access  Private
router.post('/reset-data', auth, resetData);

module.exports = router;