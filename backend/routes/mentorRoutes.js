// backend/routes/mentorRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  getMentorProfile,
  getMentorStats,
  getMentees,
  getMenteeDetails,
  createStudyPlan,
  createWorkoutPlan,
  createCommunicationPlan,
  sendMessage,
  awardBadge,
  assignMentees
} = require('../controllers/mentorController');

// All routes require authentication
router.use(auth);

// Mentor profile and stats
router.get('/profile', getMentorProfile);
router.get('/stats', getMentorStats);

// Mentee management
router.get('/mentees', getMentees);
router.get('/mentees/:id', getMenteeDetails);

// Create plans for mentee
router.post('/mentees/:id/plans', createStudyPlan);
router.post('/mentees/:id/workouts', createWorkoutPlan);
router.post('/mentees/:id/communications', createCommunicationPlan);

// Communication
router.post('/mentees/:id/messages', sendMessage);
router.post('/mentees/:id/badges', awardBadge);

router.post('/assign', auth, assignMentees);


module.exports = router;