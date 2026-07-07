// backend/controllers/parentController.js
const User = require('../models/User');
const StudyProgress = require('../models/StudyProgress');
const HealthProgress = require('../models/HealthProgress');
const HabitTracker = require('../models/HabitTracker');

// @desc    Get parent profile
// @route   GET /api/parent/profile
// @access  Private
const getParentProfile = async (req, res) => {
  try {
    const parent = await User.findById(req.user.id).select('-password');
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }
    res.json(parent);
  } catch (error) {
    console.error('Error fetching parent profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get family stats
// @route   GET /api/parent/stats
// @access  Private
const getFamilyStats = async (req, res) => {
  try {
    // Get all children linked to this parent
    const children = await User.find({ 
      parentId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });

    const childIds = children.map(c => c._id);
    
    // Get progress data for all children
    const studyData = await StudyProgress.find({ userId: { $in: childIds } });
    const healthData = await HealthProgress.find({ userId: { $in: childIds } });
    const habitData = await HabitTracker.find({ userId: { $in: childIds } });

    // Calculate stats
    const totalChildren = children.length;
    const activeChildren = children.filter(c => c.isActive !== false).length;
    
    let totalDiscipline = 0;
    let totalAchievements = 0;
    let maxStreak = 0;

    children.forEach(child => {
      const study = studyData.find(s => s.userId.toString() === child._id.toString());
      const health = healthData.find(h => h.userId.toString() === child._id.toString());
      const habit = habitData.find(h => h.userId.toString() === child._id.toString());
      
      // Calculate discipline
      let score = 0;
      let count = 0;
      if (study?.consistency) { score += study.consistency; count++; }
      if (health?.consistency) { score += health.consistency; count++; }
      if (habit?.consistency) { score += habit.consistency; count++; }
      
      if (count > 0) {
        totalDiscipline += score / count;
      }

      // Count achievements
      if (study?.badges) totalAchievements += study.badges.length;
      if (health?.badges) totalAchievements += health.badges.length;
      if (habit?.badges) totalAchievements += habit.badges.length;

      // Max streak
      const childMaxStreak = Math.max(
        study?.streak || 0,
        health?.streak || 0,
        habit?.streak || 0
      );
      if (childMaxStreak > maxStreak) maxStreak = childMaxStreak;
    });

    const avgDiscipline = totalChildren > 0 ? Math.round(totalDiscipline / totalChildren) : 0;

    res.json({
      totalChildren,
      activeChildren,
      avgDiscipline,
      totalAchievements,
      maxStreak,
      children
    });
  } catch (error) {
    console.error('Error fetching family stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all children
// @route   GET /api/parent/children
// @access  Private
const getChildren = async (req, res) => {
  try {
    // Get all children linked to this parent
    const children = await User.find({ 
      parentId: req.user.id,
      role: { $in: ['student', 'Student'] }
    }).select('-password');

    const childIds = children.map(c => c._id);
    
    // Get progress data
    const studyData = await StudyProgress.find({ userId: { $in: childIds } });
    const healthData = await HealthProgress.find({ userId: { $in: childIds } });
    const habitData = await HabitTracker.find({ userId: { $in: childIds } });

    // Build child profiles with progress
    const childrenWithProgress = children.map(child => {
      const study = studyData.find(s => s.userId.toString() === child._id.toString());
      const health = healthData.find(h => h.userId.toString() === child._id.toString());
      const habit = habitData.find(h => h.userId.toString() === child._id.toString());

      // Calculate discipline score
      let disciplineScore = 0;
      let count = 0;
      if (study?.consistency) { disciplineScore += study.consistency; count++; }
      if (health?.consistency) { disciplineScore += health.consistency; count++; }
      if (habit?.consistency) { disciplineScore += habit.consistency; count++; }
      const avgDiscipline = count > 0 ? Math.round(disciplineScore / count) : 0;

      // Get badges
      const badges = [
        ...(study?.badges?.map(b => b.name) || []),
        ...(health?.badges?.map(b => b.name) || []),
        ...(habit?.badges?.map(b => b.name) || [])
      ];

      // Build subject data
      const subjects = study?.subjects?.map(s => ({
        name: s.name,
        score: s.progress || 0,
        progress: s.progress || 0
      })) || [];

      // Build daily habits
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayHabits = habit?.dailyData?.find(d => 
        new Date(d.date).toDateString() === today.toDateString()
      );

      const dailyHabits = habit?.habits?.map(h => ({
        name: h.name,
        completed: todayHabits?.habits?.some(th => th.habitId.toString() === h._id.toString()) || false,
        time: h.reminder || 'N/A',
        category: h.category || 'general'
      })) || [];

      // Weekly data
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      
      const weeklyStudyHours = study?.dailyData
        ?.filter(d => new Date(d.date) >= weekStart)
        ?.map(d => d.hours) || [];
      
      const weeklyWorkouts = health?.dailyData
        ?.filter(d => new Date(d.date) >= weekStart)
        ?.map(d => d.workouts?.some(w => w.completed) || false) || [];

      const weeklyHabits = habit?.dailyData
        ?.filter(d => new Date(d.date) >= weekStart)
        ?.map(d => d.totalCompleted || 0) || [];

      // Pad arrays to 7 days
      while (weeklyStudyHours.length < 7) weeklyStudyHours.push(0);
      while (weeklyWorkouts.length < 7) weeklyWorkouts.push(false);
      while (weeklyHabits.length < 7) weeklyHabits.push(0);

      return {
        id: child._id,
        name: child.name,
        class: child.classGroup || 'N/A',
        disciplineScore: avgDiscipline,
        waterIntake: `${health?.dailyData?.[0]?.waterIntake || 0}L / 2.5L`,
        sleep: `${health?.dailyData?.[0]?.sleepHours || 0} hrs`,
        studyStreak: study?.streak || 0,
        workoutStreak: health?.streak || 0,
        habitStreak: habit?.streak || 0,
        attendance: 95, // Calculate from actual data if available
        achievements: badges,
        weeklyStudyHours: weeklyStudyHours,
        weeklyWorkouts: weeklyWorkouts,
        weeklyHabits: weeklyHabits,
        dailyHabits: dailyHabits,
        subjects: subjects,
        notifications: [
          { id: 1, message: `${child.name} is making good progress!`, type: 'achievement', date: new Date().toLocaleDateString() }
        ]
      };
    });

    res.json(childrenWithProgress);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get child details
// @route   GET /api/parent/children/:id
// @access  Private
const getChildDetails = async (req, res) => {
  try {
    const child = await User.findById(req.params.id).select('-password');
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    // Verify this child belongs to the parent
    if (child.parentId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this child' });
    }

    const study = await StudyProgress.findOne({ userId: child._id });
    const health = await HealthProgress.findOne({ userId: child._id });
    const habit = await HabitTracker.findOne({ userId: child._id });

    res.json({
      child,
      study,
      health,
      habit
    });
  } catch (error) {
    console.error('Error fetching child details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get child progress
// @route   GET /api/parent/children/:id/progress
// @access  Private
const getChildProgress = async (req, res) => {
  try {
    const child = await User.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    if (child.parentId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const study = await StudyProgress.findOne({ userId: child._id });
    const health = await HealthProgress.findOne({ userId: child._id });
    const habit = await HabitTracker.findOne({ userId: child._id });

    // Calculate progress metrics
    const progress = {
      overall: 0,
      study: study?.consistency || 0,
      health: health?.consistency || 0,
      habits: habit?.consistency || 0,
      totalHours: study?.totalHours || 0,
      completedTasks: habit?.completedTasks || 0
    };

    // Calculate overall progress
    const scores = [];
    if (progress.study) scores.push(progress.study);
    if (progress.health) scores.push(progress.health);
    if (progress.habits) scores.push(progress.habits);
    progress.overall = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    res.json(progress);
  } catch (error) {
    console.error('Error fetching child progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Generate report
// @route   POST /api/parent/children/:id/report
// @access  Private
const generateReport = async (req, res) => {
  try {
    const { reportType, week } = req.body;
    const childId = req.params.id;

    const child = await User.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    if (child.parentId?.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const study = await StudyProgress.findOne({ userId: child._id });
    const health = await HealthProgress.findOne({ userId: child._id });
    const habit = await HabitTracker.findOne({ userId: child._id });

    // Build report based on type
    const report = {
      childName: child.name,
      generatedAt: new Date().toISOString(),
      reportType: reportType || 'summary',
      week: week || new Date().toISOString().split('T')[0],
      summary: {
        studyStreak: study?.streak || 0,
        workoutStreak: health?.streak || 0,
        habitStreak: habit?.streak || 0,
        totalHours: study?.totalHours || 0,
        points: study?.points || 0,
        badges: [
          ...(study?.badges || []),
          ...(health?.badges || []),
          ...(habit?.badges || [])
        ]
      }
    };

    res.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Link child to parent
// @route   POST /api/parent/link-child
// @access  Private
const linkChildToParent = async (req, res) => {
  try {
    const { childId } = req.body;
    const parentId = req.user.id;

    const child = await User.findById(childId);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }

    child.parentId = parentId;
    await child.save();

    res.json({ message: 'Child linked successfully' });
  } catch (error) {
    console.error('Error linking child:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get recent activities for all children
// @route   GET /api/parent/activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    // Get all children linked to this parent
    const children = await User.find({ 
      parentId: req.user.id,
      role: { $in: ['student', 'Student'] }
    });

    if (!children || children.length === 0) {
      return res.json([]);
    }

    const childIds = children.map(c => c._id);
    
    // Get recent activities from all progress models
    const [studyActivities, healthActivities, habitActivities] = await Promise.all([
      StudyProgress.find({ userId: { $in: childIds } })
        .select('userId activities')
        .sort({ 'activities.date': -1 })
        .limit(10),
      HealthProgress.find({ userId: { $in: childIds } })
        .select('userId activities')
        .sort({ 'activities.date': -1 })
        .limit(10),
      HabitTracker.find({ userId: { $in: childIds } })
        .select('userId activities')
        .sort({ 'activities.date': -1 })
        .limit(10)
    ]);

    // Combine and format activities
    const allActivities = [];
    
    // Process study activities
    studyActivities.forEach(study => {
      const child = children.find(c => c._id.toString() === study.userId.toString());
      if (study.activities && study.activities.length > 0) {
        study.activities.forEach(activity => {
          allActivities.push({
            child: child?.name || 'Unknown',
            action: `${activity.description || 'Study activity'}`,
            time: activity.date ? formatTimeAgo(activity.date) : 'Recently',
            type: 'study'
          });
        });
      }
    });

    // Process health activities
    healthActivities.forEach(health => {
      const child = children.find(c => c._id.toString() === health.userId.toString());
      if (health.activities && health.activities.length > 0) {
        health.activities.forEach(activity => {
          allActivities.push({
            child: child?.name || 'Unknown',
            action: `${activity.description || 'Workout activity'}`,
            time: activity.date ? formatTimeAgo(activity.date) : 'Recently',
            type: 'health'
          });
        });
      }
    });

    // Process habit activities
    habitActivities.forEach(habit => {
      const child = children.find(c => c._id.toString() === habit.userId.toString());
      if (habit.activities && habit.activities.length > 0) {
        habit.activities.forEach(activity => {
          allActivities.push({
            child: child?.name || 'Unknown',
            action: `${activity.description || 'Habit tracked'}`,
            time: activity.date ? formatTimeAgo(activity.date) : 'Recently',
            type: 'habit'
          });
        });
      }
    });

    // Sort by time (most recent first) and limit to 20
    allActivities.sort((a, b) => {
      // Simple sort - in production you'd use actual dates
      if (a.time === 'Just now') return -1;
      if (b.time === 'Just now') return 1;
      if (a.time === 'Recently') return -1;
      if (b.time === 'Recently') return 1;
      return 0;
    });

    res.json(allActivities.slice(0, 20));
    
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to format time ago
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
  return formatDate(date);
}

function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Make sure to export the new function
module.exports = {
  getParentProfile,
  getFamilyStats,
  getChildren,
  getChildDetails,
  getChildProgress,
  generateReport,
  linkChildToParent,
  getRecentActivities // Add this to exports
};
