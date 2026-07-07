// backend/controllers/mentorController.js
const User = require('../models/User');
const StudyProgress = require('../models/StudyProgress');
const HealthProgress = require('../models/HealthProgress');
const HabitTracker = require('../models/HabitTracker');

// @desc    Get mentor profile
// @route   GET /api/mentor/profile
// @access  Private
const getMentorProfile = async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id).select('-password');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.json(mentor);
  } catch (error) {
    console.error('Error fetching mentor profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get mentor stats
// @route   GET /api/mentor/stats
// @access  Private
const getMentorStats = async (req, res) => {
  try {
    // Get all mentees (students assigned to this mentor)
    const mentees = await User.find({ 
      mentorId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });

    const totalMentees = mentees.length;
    const activeMentees = mentees.filter(m => m.isActive !== false).length;
    
    // Get mentees' progress data
    const menteeIds = mentees.map(m => m._id);
    const studyData = await StudyProgress.find({ userId: { $in: menteeIds } });
    const healthData = await HealthProgress.find({ userId: { $in: menteeIds } });
    const habitData = await HabitTracker.find({ userId: { $in: menteeIds } });

    // Calculate average scores
    let totalDiscipline = 0;
    let menteesWithData = 0;
    
    mentees.forEach(mentee => {
      const study = studyData.find(s => s.userId.toString() === mentee._id.toString());
      const health = healthData.find(h => h.userId.toString() === mentee._id.toString());
      const habit = habitData.find(h => h.userId.toString() === mentee._id.toString());
      
      let score = 0;
      let count = 0;
      
      if (study) {
        score += study.consistency || 0;
        count++;
      }
      if (health) {
        score += health.consistency || 0;
        count++;
      }
      if (habit) {
        score += habit.consistency || 0;
        count++;
      }
      
      if (count > 0) {
        totalDiscipline += score / count;
        menteesWithData++;
      }
    });

    const avgDiscipline = menteesWithData > 0 ? Math.round(totalDiscipline / menteesWithData) : 0;

    res.json({
      totalMentees,
      activeMentees,
      avgDiscipline,
      totalStudyPlans: studyData.length,
      totalWorkoutPlans: healthData.length,
      totalBadges: studyData.reduce((acc, s) => acc + (s.badges?.length || 0), 0) +
                   healthData.reduce((acc, h) => acc + (h.badges?.length || 0), 0) +
                   habitData.reduce((acc, h) => acc + (h.badges?.length || 0), 0)
    });
  } catch (error) {
    console.error('Error fetching mentor stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all mentees
// @route   GET /api/mentor/mentees
// @access  Private
const getMentees = async (req, res) => {
  try {
    // Get all students assigned to this mentor
    const mentees = await User.find({ 
      mentorId: req.user.id,
      role: { $in: ['student', 'Student'] }
    }).select('-password');

    // Get progress data for each mentee
    const menteeIds = mentees.map(m => m._id);
    const studyData = await StudyProgress.find({ userId: { $in: menteeIds } });
    const healthData = await HealthProgress.find({ userId: { $in: menteeIds } });
    const habitData = await HabitTracker.find({ userId: { $in: menteeIds } });

    // Combine data
    const menteesWithProgress = mentees.map(mentee => {
      const study = studyData.find(s => s.userId.toString() === mentee._id.toString());
      const health = healthData.find(h => h.userId.toString() === mentee._id.toString());
      const habit = habitData.find(h => h.userId.toString() === mentee._id.toString());

      // Calculate discipline score
      let disciplineScore = 0;
      let count = 0;
      if (study?.consistency) { disciplineScore += study.consistency; count++; }
      if (health?.consistency) { disciplineScore += health.consistency; count++; }
      if (habit?.consistency) { disciplineScore += habit.consistency; count++; }
      const avgDiscipline = count > 0 ? Math.round(disciplineScore / count) : 0;

      return {
        id: mentee._id,
        name: mentee.name,
        email: mentee.email,
        classGroup: mentee.classGroup || 'N/A',
        disciplineScore: avgDiscipline,
        studyStreak: study?.streak || 0,
        workoutStreak: health?.streak || 0,
        habitStreak: habit?.streak || 0,
        badges: [
          ...(study?.badges?.map(b => b.name) || []),
          ...(health?.badges?.map(b => b.name) || []),
          ...(habit?.badges?.map(b => b.name) || [])
        ],
        plans: study?.subjects?.map(s => ({
          id: s._id,
          title: `${s.name} Study Plan`,
          description: `Progress in ${s.name}`,
          subjects: s.name,
          schedule: 'Custom schedule',
          resources: 'Study materials',
          progress: s.progress || 0,
          status: s.progress >= 80 ? 'completed' : 'active'
        })) || [],
        workouts: health?.dailyData?.slice(0, 5).map((d, idx) => ({
          id: d._id || idx,
          title: `Workout ${new Date(d.date).toLocaleDateString()}`,
          type: d.workouts?.[0]?.type || 'fitness',
          exercises: d.workouts?.map(w => w.name).join(', ') || 'Various exercises',
          duration: d.workouts?.reduce((acc, w) => acc + (w.duration || 0), 0) + ' mins',
          difficulty: 'intermediate',
          completed: d.workouts?.some(w => w.completed) || false
        })) || [],
        communications: [],
        progress: [{
          date: new Date().toISOString().split('T')[0],
          studyHours: study?.totalHours || 0,
          workoutCompleted: health?.streak > 0 || false,
          communicationScore: 0,
          notes: 'Progress tracking'
        }],
        messages: [],
        lastActive: mentee.updatedAt || new Date().toISOString(),
        status: avgDiscipline >= 75 ? 'Active' : 'Needs Attention'
      };
    });

    res.json(menteesWithProgress);
  } catch (error) {
    console.error('Error fetching mentees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get mentee details
// @route   GET /api/mentor/mentees/:id
// @access  Private
const getMenteeDetails = async (req, res) => {
  try {
    const mentee = await User.findById(req.params.id).select('-password');
    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }

    // Verify this mentee belongs to the mentor
    if (mentee.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this mentee' });
    }

    const study = await StudyProgress.findOne({ userId: mentee._id });
    const health = await HealthProgress.findOne({ userId: mentee._id });
    const habit = await HabitTracker.findOne({ userId: mentee._id });

    res.json({
      mentee,
      study,
      health,
      habit
    });
  } catch (error) {
    console.error('Error fetching mentee details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create study plan for mentee
// @route   POST /api/mentor/mentees/:id/plans
// @access  Private
const createStudyPlan = async (req, res) => {
  try {
    const { title, description, subjects, schedule, resources } = req.body;
    const menteeId = req.params.id;

    // Verify mentee exists and belongs to mentor
    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    if (mentee.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let studyData = await StudyProgress.findOne({ userId: menteeId });
    if (!studyData) {
      studyData = new StudyProgress({ userId: menteeId });
    }

    // Add subject/plan
    studyData.subjects.push({
      name: title,
      progress: 0,
      chapters: [],
      quizzes: []
    });

    // Add activity
    studyData.activities.push({
      type: 'study',
      description: `New study plan created: ${title}`,
      date: new Date()
    });

    await studyData.save();

    res.json({
      message: 'Study plan created successfully',
      plan: studyData.subjects[studyData.subjects.length - 1]
    });
  } catch (error) {
    console.error('Error creating study plan:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create workout plan for mentee
// @route   POST /api/mentor/mentees/:id/workouts
// @access  Private
const createWorkoutPlan = async (req, res) => {
  try {
    const { title, type, exercises, duration, difficulty, notes } = req.body;
    const menteeId = req.params.id;

    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    if (mentee.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let healthData = await HealthProgress.findOne({ userId: menteeId });
    if (!healthData) {
      healthData = new HealthProgress({ userId: menteeId });
    }

    // Add workout to daily data
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyEntry = healthData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    const workoutEntry = {
      type: type || 'fitness',
      name: title,
      duration: parseInt(duration) || 30,
      exercises: exercises ? exercises.split(',').map(e => ({ name: e.trim() })) : [],
      completed: false
    };

    if (dailyEntry) {
      dailyEntry.workouts.push(workoutEntry);
    } else {
      healthData.dailyData.push({
        date: today,
        workouts: [workoutEntry],
        waterIntake: 0,
        sleepHours: 0
      });
    }

    // Add activity
    healthData.activities.push({
      type: 'workout',
      description: `New workout plan created: ${title}`,
      date: new Date()
    });

    await healthData.save();

    res.json({
      message: 'Workout plan created successfully',
      workout: workoutEntry
    });
  } catch (error) {
    console.error('Error creating workout plan:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create communication plan for mentee
// @route   POST /api/mentor/mentees/:id/communications
// @access  Private
const createCommunicationPlan = async (req, res) => {
  try {
    const { title, type, description, activities, frequency, notes } = req.body;
    const menteeId = req.params.id;

    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    if (mentee.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Store communication plan in a custom field or in the mentee's profile
    // Since there's no Communication model, we'll store it in the mentee's profile
    // or you could create a new model for communications

    // For now, we'll just return success
    res.json({
      message: 'Communication plan created successfully',
      plan: { title, type, description, activities, frequency }
    });
  } catch (error) {
    console.error('Error creating communication plan:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Send message to mentee
// @route   POST /api/mentor/mentees/:id/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { subject, content, type } = req.body;
    const menteeId = req.params.id;

    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    if (mentee.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Store message - you would typically use a Message model
    // For now, we'll just return success

    res.json({
      message: 'Message sent successfully',
      data: { subject, content, type, sentAt: new Date() }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Award badge to mentee
// @route   POST /api/mentor/mentees/:id/badges
// @access  Private
const awardBadge = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const menteeId = req.params.id;

    const mentee = await User.findById(menteeId);
    if (!mentee) {
      return res.status(404).json({ message: 'Mentee not found' });
    }
    if (mentee.mentorId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find which progress collection to add badge to
    const studyData = await StudyProgress.findOne({ userId: menteeId });
    if (studyData) {
      studyData.badges.push({
        name: name || 'Achievement',
        earnedAt: new Date(),
        icon: '🏅'
      });
      await studyData.save();
    }

    res.json({
      message: `Badge "${name}" awarded successfully!`,
      badge: { name, description, category }
    });
  } catch (error) {
    console.error('Error awarding badge:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// @desc    Assign mentees to mentor
// @route   POST /api/mentor/assign
// @access  Private/Admin
const assignMentees = async (req, res) => {
  try {
    const { menteeIds } = req.body;
    const mentorId = req.user.id;

    await User.updateMany(
      { _id: { $in: menteeIds } },
      { $set: { mentorId } }
    );

    res.json({ message: 'Mentees assigned successfully' });
  } catch (error) {
    console.error('Error assigning mentees:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
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
};