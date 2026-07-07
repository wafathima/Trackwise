// backend/routes/healthRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  getHealthProgress,
  logWorkout,
  logWaterIntake,
  logSleep,
  getHealthStats
} = require('../controllers/healthController');

// All routes require authentication
router.use(auth);

// Get health progress
router.get('/progress', getHealthProgress);

// Get health stats
router.get('/stats', getHealthStats);

// Log workout
router.post('/log-workout', logWorkout);

// Log water intake
router.post('/log-water', logWaterIntake);

// Log sleep
router.post('/log-sleep', logSleep);

module.exports = router;