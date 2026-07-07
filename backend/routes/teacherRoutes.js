//backend/routes/teacherRoutes.js
const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/resources');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'];
  if (allowedTypes.includes(file.mimetype) || file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word documents, and images are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});


const {
  getTeacherProfile,
  getTeacherStats,
  getStudents,
  getTopStudents,
  getRecentActivities,
  getTeacherClasses,
  getTeacherResources,
  getTeacherQuizzes,
  createTeacherQuiz,
  getTeacherAssessments,
  createTeacherAssessment,
  uploadResource,
  getMyResources,
  deleteResource
} = require('../controllers/teacherController');

// All routes require authentication
router.use(auth);

// Teacher profile
router.get('/profile', getTeacherProfile);
router.get('/stats', getTeacherStats);
router.get('/students', getStudents);
router.get('/top-students', getTopStudents);
router.get('/activities', getRecentActivities);
router.get('/classes', getTeacherClasses);
router.get('/resources', getTeacherResources);
router.get('/my-resources', getMyResources);

// Upload resource - with multer
router.post('/resources', upload.single('file'), uploadResource);

// Delete resource
router.delete('/resources/:id', deleteResource);

// Quiz routes
router.get('/quizzes', getTeacherQuizzes);
router.post('/quizzes', createTeacherQuiz);

// Assessment routes
router.get('/assessments', getTeacherAssessments);
router.post('/assessments', createTeacherAssessment);

module.exports = router;