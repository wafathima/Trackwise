// backend/routes/studyRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  getStudyProgress,
  logStudySession,
  updateSubjectProgress,
  getStudyStats,
  getQuizzes,
  getQuizById,
  startQuiz,
  submitAnswer,
  getQuizResults
} = require('../controllers/studyController');

// All routes require authentication
router.use(auth);

// Get study progress
router.get('/progress', getStudyProgress);

// Get study stats
router.get('/stats', getStudyStats);

// Log study session
router.post('/log-session', logStudySession);

// Update subject progress
router.put('/subject', updateSubjectProgress);

// Quiz routes
router.get('/quizzes', getQuizzes);
router.get('/quizzes/:quizId', getQuizById);
router.post('/quizzes/:quizId/start', startQuiz);
router.post('/quizzes/:quizId/answer', submitAnswer);
router.get('/quizzes/:quizId/results', getQuizResults);

module.exports = router;