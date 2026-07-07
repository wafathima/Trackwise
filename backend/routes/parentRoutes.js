// backend/routes/parentRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const {
  getParentProfile,
  getFamilyStats,
  getChildren,
  getChildDetails,
  getChildProgress,
  generateReport,
  linkChildToParent,
  getRecentActivities // Add this
} = require('../controllers/parentController');

// All routes require authentication
router.use(auth);

// Parent profile and stats
router.get('/profile', getParentProfile);
router.get('/stats', getFamilyStats);

// Children management
router.get('/children', getChildren);
router.get('/children/:id', getChildDetails);
router.get('/children/:id/progress', getChildProgress);

// Reports
router.post('/children/:id/report', generateReport);

// Activities - ADD THIS
router.get('/activities', getRecentActivities); // Add this line

router.post('/link-child', auth, linkChildToParent);

module.exports = router;