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

// Import resource functions from teacherController
const {
  getStudyResources,
  getResourceById,
  downloadResource,
  viewResource
} = require('../controllers/teacherController');

// All routes require authentication
router.use(auth);

// Study progress
router.get('/progress', getStudyProgress);
router.get('/stats', getStudyStats);
router.post('/log-session', logStudySession);
router.put('/subject', updateSubjectProgress);

// Quiz routes
router.get('/quizzes', getQuizzes);
router.get('/quizzes/:quizId', getQuizById);
router.post('/quizzes/:quizId/start', startQuiz);
router.post('/quizzes/:quizId/answer', submitAnswer);
router.get('/quizzes/:quizId/results', getQuizResults);

// Resource routes - these will serve resources to students
router.get('/resources', getStudyResources);
router.get('/resources/:id', getResourceById);
router.get('/resources/:id/download', downloadResource);
router.get('/resources/:id/view', viewResource);

module.exports = router;