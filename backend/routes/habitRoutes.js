// backend/routes/habitRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  getHabitProgress,
  createHabit,
  logHabit,
  getTodayHabits,
  getHabitStats
} = require('../controllers/habitController');

// All routes require authentication
router.use(auth);

// Get habit progress
router.get('/progress', getHabitProgress);

// Get habit stats
router.get('/stats', getHabitStats);

// Get today's habits
router.get('/today', getTodayHabits);

// Create a new habit
router.post('/create', createHabit);

// Log a habit
router.post('/log', logHabit);

module.exports = router;