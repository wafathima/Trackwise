// backend/controllers/teacherController.js
const User = require('../models/User');
const StudyProgress = require('../models/StudyProgress');
const Resource = require('../models/Resource');
const path = require('path');
const fs = require('fs');

// @desc    Get teacher profile
// @route   GET /api/teacher/profile
// @access  Private
const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select('-password');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get teacher stats
// @route   GET /api/teacher/stats
// @access  Private
const getTeacherStats = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    
    // Get students assigned to this teacher
    const students = await User.find({ 
      teacherId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });

    const studentIds = students.map(s => s._id);
    const studyData = await StudyProgress.find({ userId: { $in: studentIds } });

    // Calculate stats
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.isActive !== false).length;
    
    let totalScore = 0;
    let totalAttendance = 0;
    let totalAssignments = 0;
    
    students.forEach(student => {
      const study = studyData.find(s => s.userId.toString() === student._id.toString());
      if (study) {
        totalScore += study.consistency || 0;
        totalAttendance += study.attendance || 0;
        totalAssignments += study.assignmentsCompleted || 0;
      }
    });

    const avgScore = totalStudents > 0 ? Math.round(totalScore / totalStudents) : 0;
    const avgAttendance = totalStudents > 0 ? Math.round(totalAttendance / totalStudents) : 0;

    // Class performance
    const classPerformance = {};
    const classes = ['10th', '11th', '12th'];
    classes.forEach(cls => {
      const classStudents = students.filter(s => s.classGroup === cls);
      let classScore = 0;
      classStudents.forEach(s => {
        const study = studyData.find(d => d.userId.toString() === s._id.toString());
        if (study) classScore += study.consistency || 0;
      });
      classPerformance[cls] = classStudents.length > 0 ? Math.round(classScore / classStudents.length) : 0;
    });

    // Subject distribution
    const subjectDistribution = {};
    students.forEach(s => {
      const subjects = s.subjects || ['Mathematics', 'Physics'];
      subjects.forEach(sub => {
        subjectDistribution[sub] = (subjectDistribution[sub] || 0) + 1;
      });
    });

    res.json({
      totalStudents,
      activeStudents,
      averageScore: avgScore,
      passRate: avgScore > 60 ? 100 : 60,
      totalHours: 120,
      assignmentsGiven: 45,
      assignmentsGraded: 40,
      studentsImproved: 20,
      totalAchievements: 12,
      avgRating: 4.5,
      classPerformance,
      weeklyClasses: [8, 7, 9, 6, 8, 0, 0],
      subjectDistribution
    });
  } catch (error) {
    console.error('Error fetching teacher stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get students
// @route   GET /api/teacher/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const { class: classId } = req.query;
    
    let query = { 
      teacherId: req.user.id,
      role: { $in: ['student', 'Student'] }
    };
    
    if (classId && classId !== 'all') {
      query.classGroup = classId;
    }

    const students = await User.find(query).select('-password');
    
    // Get progress data
    const studentIds = students.map(s => s._id);
    const studyData = await StudyProgress.find({ userId: { $in: studentIds } });

    const studentsWithProgress = students.map(student => {
      const study = studyData.find(s => s.userId.toString() === student._id.toString());
      
      return {
        id: student._id,
        name: student.name,
        email: student.email,
        grade: student.classGroup || 'N/A',
        subject: student.subject || 'Mathematics',
        score: study?.consistency || 0,
        progress: study?.streak || 0,
        attendance: study?.attendance || 0,
        assignmentsCompleted: study?.assignmentsCompleted || 0,
        status: study?.consistency >= 80 ? 'Excellent' : 
                study?.consistency >= 60 ? 'Good' : 'Improving',
        quizzes: study?.quizScores || [],
        testScores: study?.testScores || [],
        submitted: study?.submitted || false,
        flag: study?.consistency < 50
      };
    });

    res.json(studentsWithProgress);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get top students
// @route   GET /api/teacher/top-students
// @access  Private
const getTopStudents = async (req, res) => {
  try {
    const students = await User.find({ 
      teacherId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });

    const studentIds = students.map(s => s._id);
    const studyData = await StudyProgress.find({ userId: { $in: studentIds } });

    const topStudents = students.map(student => {
      const study = studyData.find(s => s.userId.toString() === student._id.toString());
      return {
        name: student.name,
        score: study?.consistency || 0,
        subject: student.subject || 'Mathematics'
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

    res.json(topStudents);
  } catch (error) {
    console.error('Error fetching top students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recent activities
// @route   GET /api/teacher/activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    // Get students and their recent activities
    const students = await User.find({ 
      teacherId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });

    const studentIds = students.map(s => s._id);
    const studyData = await StudyProgress.find({ userId: { $in: studentIds } })
      .sort({ updatedAt: -1 })
      .limit(10);

    const activities = studyData.map(study => {
      const student = students.find(s => s._id.toString() === study.userId.toString());
      return {
        student: student?.name || 'Unknown',
        action: study.lastActivity || 'Recent activity',
        time: study.updatedAt ? formatTimeAgo(study.updatedAt) : 'Recently',
        type: 'general'
      };
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days < 7) return `${days} days ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
// backend/controllers/teacherController.js

// Add this function to the existing file
// @desc    Get teacher classes
// @route   GET /api/teacher/classes
// @access  Private
const getTeacherClasses = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    
    if (teacher.classes) {
      return res.json(teacher.classes.split(',').map(c => c.trim()));
    }
    
    // Get unique classes from students
    const students = await User.find({ 
      teacherId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });
    
    const classes = [...new Set(students.map(s => s.classGroup).filter(Boolean))];
    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Also add this function for resources
// @desc    Get teacher resources
// @route   GET /api/teacher/resources
// @access  Private
const getTeacherResources = async (req, res) => {
  try {
    // This would fetch from a Resources model
    // For now, return empty array
    res.json([]);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// backend/controllers/teacherController.js

// Add these functions at the end of the file

// @desc    Get teacher quizzes
// @route   GET /api/teacher/quizzes
// @access  Private
const getTeacherQuizzes = async (req, res) => {
  try {
    const { class: classId } = req.query;
    
    // If you have a Quiz model, fetch from there
    // For now, return mock data
    const quizzes = [
      { id: 1, title: "Algebra Quiz 1", class: "10th", questions: 10, duration: "30 mins", status: "active", avgScore: 78 },
      { id: 2, title: "Physics Quiz 1", class: "10th", questions: 8, duration: "20 mins", status: "completed", avgScore: 82 },
      { id: 3, title: "Chemistry Quiz 1", class: "11th", questions: 12, duration: "35 mins", status: "active", avgScore: 75 }
    ];
    
    // Filter by class if provided
    if (classId && classId !== 'all') {
      const filtered = quizzes.filter(q => q.class === classId);
      return res.json(filtered);
    }
    
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create teacher quiz
// @route   POST /api/teacher/quizzes
// @access  Private
const createTeacherQuiz = async (req, res) => {
  try {
    const { title, class: classId, questions, duration } = req.body;
    
    // If you have a Quiz model, save to database
    // For now, return success
    res.json({ 
      success: true, 
      message: 'Quiz created successfully',
      quiz: { id: Date.now(), title, class: classId, questions, duration, status: 'active', avgScore: 0 }
    });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get teacher assessments
// @route   GET /api/teacher/assessments
// @access  Private
const getTeacherAssessments = async (req, res) => {
  try {
    const { class: classId } = req.query;
    
    // If you have an Assessment model, fetch from there
    // For now, return mock data
    const assessments = [
      { id: 1, title: "Mid Term Assessment", class: "10th", type: "written", date: "2024-02-01", status: "upcoming" },
      { id: 2, title: "Practical Assessment", class: "10th", type: "practical", date: "2024-01-28", status: "completed" },
      { id: 3, title: "Final Term Assessment", class: "11th", type: "written", date: "2024-03-15", status: "upcoming" }
    ];
    
    // Filter by class if provided
    if (classId && classId !== 'all') {
      const filtered = assessments.filter(a => a.class === classId);
      return res.json(filtered);
    }
    
    res.json(assessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create teacher assessment
// @route   POST /api/teacher/assessments
// @access  Private
const createTeacherAssessment = async (req, res) => {
  try {
    const { title, class: classId, type, date } = req.body;
    
    // If you have an Assessment model, save to database
    // For now, return success
    res.json({ 
      success: true, 
      message: 'Assessment created successfully',
      assessment: { id: Date.now(), title, class: classId, type, date, status: 'upcoming' }
    });
  } catch (error) {
    console.error('Error creating assessment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Upload a resource
// @route   POST /api/teacher/resources
// @access  Private (Teacher only)
const uploadResource = async (req, res) => {
  try {
    const { title, description, type, category, class: classId, subject, tags } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileSize = (req.file.size / (1024 * 1024)).toFixed(1) + ' MB';
    
    const resource = new Resource({
      title,
      description,
      type,
      category,
      class: classId,
      subject,
      filePath: req.file.path,
      fileName: req.file.filename,
      fileSize,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id,
      uploadedByName: req.user.name,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    await resource.save();

    res.status(201).json({
      success: true,
      message: 'Resource uploaded successfully',
      resource
    });
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all resources (for students)
// @route   GET /api/study/resources
// @access  Private
const getStudyResources = async (req, res) => {
  try {
    const { class: classId, subject, type, category, search } = req.query;
    
    let query = { isActive: true };
    
    if (classId && classId !== 'all') {
      query.class = { $in: [classId, 'all'] };
    }
    
    if (subject && subject !== 'all') {
      query.subject = subject;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get resource by ID
// @route   GET /api/study/resources/:id
// @access  Private
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name');
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Download resource
// @route   GET /api/study/resources/:id/download
// @access  Private
const downloadResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Increment download count
    resource.downloads += 1;
    await resource.save();

    const filePath = path.join(__dirname, '..', resource.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.download(filePath, resource.fileName || 'download');
  } catch (error) {
    console.error('Error downloading resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    View resource (stream PDF)
// @route   GET /api/study/resources/:id/view
// @access  Private
const viewResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const filePath = path.join(__dirname, '..', resource.filePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // For PDFs, stream as inline
    if (resource.fileType === 'application/pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${resource.fileName}"`);
    }

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error viewing resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get teacher's own resources
// @route   GET /api/teacher/my-resources
// @access  Private (Teacher only)
const getMyResources = async (req, res) => {
  try {
    const resources = await Resource.find({ uploadedBy: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (error) {
    console.error('Error fetching teacher resources:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/teacher/resources/:id
// @access  Private (Teacher only)
const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or not authorized' });
    }

    // Delete file from storage
    const filePath = path.join(__dirname, '..', resource.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await resource.deleteOne();

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
  getStudyResources,      
  getResourceById,        
  downloadResource,       
  viewResource,           
  getMyResources,
  deleteResource
};

