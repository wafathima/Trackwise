// backend/controllers/profileController.js
const User = require('../models/User');

// Try to import models, but handle if they don't exist
let StudyProgress, HealthProgress, HabitTracker, StudentProfile;

try {
  StudyProgress = require('../models/Studyprogress');
} catch (e) {
  console.log('⚠️ StudyProgress model not found, using fallback');
}

try {
  HealthProgress = require('../models/HealthProgress');
} catch (e) {
  console.log('⚠️ HealthProgress model not found, using fallback');
}

try {
  HabitTracker = require('../models/HabitTracker');
} catch (e) {
  console.log('⚠️ HabitTracker model not found, using fallback');
}

try {
  StudentProfile = require('../models/StudentProfile');
} catch (e) {
  console.log('⚠️ StudentProfile model not found, using fallback');
}

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone, location, bio, role, grade, school } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (bio) user.bio = bio;
    if (role) user.role = role;
    if (grade) user.grade = grade;
    if (school) user.school = school;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

// @desc    Upload profile image
// @route   POST /api/profile/upload-image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/profiles/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { profileImage: imageUrl } },
      { new: true }
    ).select('-password');

    res.json({ 
      imageUrl, 
      user,
      message: 'Profile image uploaded successfully' 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ message: 'Error uploading image', error: error.message });
  }
};

// @desc    Get user stats
// @route   GET /api/profile/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    let studyData = null, healthData = null, habitData = null;
    
    // Safely fetch data from each model if they exist
    if (StudyProgress) {
      try {
        studyData = await StudyProgress.findOne({ userId: req.user.id });
      } catch (e) {
        console.log('Error fetching study data:', e.message);
      }
    }
    
    if (HealthProgress) {
      try {
        healthData = await HealthProgress.findOne({ userId: req.user.id });
      } catch (e) {
        console.log('Error fetching health data:', e.message);
      }
    }
    
    if (HabitTracker) {
      try {
        habitData = await HabitTracker.findOne({ userId: req.user.id });
      } catch (e) {
        console.log('Error fetching habit data:', e.message);
      }
    }

    // Calculate stats with safe fallbacks
    const stats = {
      studyStreak: studyData?.streak || 0,
      workoutStreak: healthData?.streak || 0,
      habitStreak: habitData?.streak || 0,
      totalHours: studyData?.totalHours || 0,
      completedTasks: habitData?.completedTasks || 0,
      achievementPoints: calculateTotalPoints(studyData, healthData, habitData),
      rank: calculateRank(studyData, healthData, habitData),
      level: calculateLevel(studyData, healthData, habitData),
      badges: calculateTotalBadges(studyData, healthData, habitData),
      consistency: calculateConsistency(studyData, healthData, habitData)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Return default stats instead of error
    res.json({
      studyStreak: 0,
      workoutStreak: 0,
      habitStreak: 0,
      totalHours: 0,
      completedTasks: 0,
      achievementPoints: 0,
      rank: 'Bronze',
      level: 'Beginner',
      badges: 0,
      consistency: 0
    });
  }
};

// @desc    Get user achievements
// @route   GET /api/profile/achievements
// @access  Private
const getAchievements = async (req, res) => {
  try {
    let studyData = null, healthData = null, habitData = null;
    
    if (StudyProgress) {
      try {
        studyData = await StudyProgress.findOne({ userId: req.user.id });
      } catch (e) {
        console.log('Error fetching study data for achievements:', e.message);
      }
    }
    
    if (HealthProgress) {
      try {
        healthData = await HealthProgress.findOne({ userId: req.user.id });
      } catch (e) {
        console.log('Error fetching health data for achievements:', e.message);
      }
    }
    
    if (HabitTracker) {
      try {
        habitData = await HabitTracker.findOne({ userId: req.user.id });
      } catch (e) {
        console.log('Error fetching habit data for achievements:', e.message);
      }
    }

    const colors = {
      brass: '#B8892B',
      slate: '#4A6C8C',
      moss: '#3F6B52',
      redink: '#A63D40'
    };

    const achievements = [
      {
        icon: 'Trophy',
        title: 'Study Master',
        desc: 'Completed 100 study sessions',
        earned: (studyData?.sessionsCompleted || 0) >= 100,
        color: colors.brass
      },
      {
        icon: 'Medal',
        title: 'Fitness Champion',
        desc: '30-day workout streak',
        earned: (healthData?.streak || 0) >= 30,
        color: colors.slate
      },
      {
        icon: 'Star',
        title: 'Habit Builder',
        desc: 'Maintained 5 habits for 30 days',
        earned: (habitData?.completedTasks || 0) >= 150,
        color: colors.moss
      },
      {
        icon: 'Target',
        title: 'Goal Setter',
        desc: 'Achieved 50 weekly goals',
        earned: (studyData?.weeklyGoalsCompleted || 0) >= 50,
        color: colors.redink
      },
      {
        icon: 'Flame',
        title: 'Streak Warrior',
        desc: '100-day streak on any activity',
        earned: (studyData?.streak || 0) >= 100 || 
                (healthData?.streak || 0) >= 100 || 
                (habitData?.streak || 0) >= 100,
        color: colors.brass
      },
      {
        icon: 'Heart',
        title: 'Wellness Guru',
        desc: 'Completed all wellness challenges',
        earned: (healthData?.challengesCompleted || 0) >= 10,
        color: colors.slate
      }
    ];

    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    // Return default achievements
    res.json([
      { icon: 'Trophy', title: 'Study Master', desc: 'Completed 100 study sessions', earned: false, color: '#B8892B' },
      { icon: 'Medal', title: 'Fitness Champion', desc: '30-day workout streak', earned: false, color: '#4A6C8C' },
      { icon: 'Star', title: 'Habit Builder', desc: 'Maintained 5 habits for 30 days', earned: false, color: '#3F6B52' },
      { icon: 'Target', title: 'Goal Setter', desc: 'Achieved 50 weekly goals', earned: false, color: '#A63D40' },
      { icon: 'Flame', title: 'Streak Warrior', desc: '100-day streak on any activity', earned: false, color: '#B8892B' },
      { icon: 'Heart', title: 'Wellness Guru', desc: 'Completed all wellness challenges', earned: false, color: '#4A6C8C' }
    ]);
  }
};

// @desc    Get recent activities
// @route   GET /api/profile/activities
// @access  Private
const getRecentActivities = async (req, res) => {
  try {
    let allActivities = [];
    
    // Safely fetch study activities
    if (StudyProgress) {
      try {
        const studyData = await StudyProgress.findOne({ userId: req.user.id });
        if (studyData?.activities) {
          studyData.activities.forEach(activity => {
            allActivities.push({
              icon: 'BookOpen',
              action: activity.description || 'Study activity',
              time: formatTimeAgo(activity.date),
              color: '#3F6B52',
              date: activity.date
            });
          });
        }
      } catch (e) {
        console.log('Error fetching study activities:', e.message);
      }
    }

    // Safely fetch health activities
    if (HealthProgress) {
      try {
        const healthData = await HealthProgress.findOne({ userId: req.user.id });
        if (healthData?.activities) {
          healthData.activities.forEach(activity => {
            allActivities.push({
              icon: 'Dumbbell',
              action: activity.description || 'Health activity',
              time: formatTimeAgo(activity.date),
              color: '#4A6C8C',
              date: activity.date
            });
          });
        }
      } catch (e) {
        console.log('Error fetching health activities:', e.message);
      }
    }

    // Safely fetch habit activities
    if (HabitTracker) {
      try {
        const habitData = await HabitTracker.findOne({ userId: req.user.id });
        if (habitData?.activities) {
          habitData.activities.forEach(activity => {
            allActivities.push({
              icon: 'ClipboardCheck',
              action: activity.description || 'Habit activity',
              time: formatTimeAgo(activity.date),
              color: '#B8892B',
              date: activity.date
            });
          });
        }
      } catch (e) {
        console.log('Error fetching habit activities:', e.message);
      }
    }

    // Sort by date and limit to 10
    allActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
    allActivities = allActivities.slice(0, 10);

    // If no activities, return a default message
    if (allActivities.length === 0) {
      allActivities = [
        { icon: 'BookOpen', action: 'No recent activities', time: '', color: '#3F6B52' }
      ];
    }

    res.json(allActivities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.json([
      { icon: 'BookOpen', action: 'No recent activities', time: '', color: '#3F6B52' }
    ]);
  }
};

// @desc    Get weekly progress
// @route   GET /api/profile/weekly-progress
// @access  Private
const getWeeklyProgress = async (req, res) => {
  try {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    let weeklyStudy = [0, 0, 0, 0, 0, 0, 0];
    let weeklyWorkout = [0, 0, 0, 0, 0, 0, 0];
    let weeklyHabits = [0, 0, 0, 0, 0, 0, 0];

    // Safely fetch study data
    if (StudyProgress) {
      try {
        const studyData = await StudyProgress.findOne({ userId: req.user.id });
        if (studyData?.dailyData) {
          weeklyStudy = getWeeklyData(studyData.dailyData, weekStart, 'study');
        }
      } catch (e) {
        console.log('Error fetching study weekly data:', e.message);
      }
    }

    // Safely fetch health data
    if (HealthProgress) {
      try {
        const healthData = await HealthProgress.findOne({ userId: req.user.id });
        if (healthData?.dailyData) {
          weeklyWorkout = getWeeklyData(healthData.dailyData, weekStart, 'workout');
        }
      } catch (e) {
        console.log('Error fetching health weekly data:', e.message);
      }
    }

    // Safely fetch habit data
    if (HabitTracker) {
      try {
        const habitData = await HabitTracker.findOne({ userId: req.user.id });
        if (habitData?.dailyData) {
          weeklyHabits = getWeeklyData(habitData.dailyData, weekStart, 'habits');
        }
      } catch (e) {
        console.log('Error fetching habit weekly data:', e.message);
      }
    }

    res.json({
      study: weeklyStudy,
      workout: weeklyWorkout,
      habits: weeklyHabits
    });
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    res.json({
      study: [0, 0, 0, 0, 0, 0, 0],
      workout: [0, 0, 0, 0, 0, 0, 0],
      habits: [0, 0, 0, 0, 0, 0, 0]
    });
  }
};

// @desc    Delete account
// @route   DELETE /api/profile/delete-account
// @access  Private
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.findByIdAndDelete(userId);
    
    // Safely delete from other collections if models exist
    if (StudyProgress) {
      try {
        await StudyProgress.findOneAndDelete({ userId });
      } catch (e) {
        console.log('Error deleting study data:', e.message);
      }
    }
    
    if (HealthProgress) {
      try {
        await HealthProgress.findOneAndDelete({ userId });
      } catch (e) {
        console.log('Error deleting health data:', e.message);
      }
    }
    
    if (HabitTracker) {
      try {
        await HabitTracker.findOneAndDelete({ userId });
      } catch (e) {
        console.log('Error deleting habit data:', e.message);
      }
    }
    
    if (StudentProfile) {
      try {
        await StudentProfile.findOneAndDelete({ userId });
      } catch (e) {
        console.log('Error deleting student profile:', e.message);
      }
    }

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};

// @desc    Reset data
// @route   POST /api/profile/reset-data
// @access  Private
const resetData = async (req, res) => {
  try {
    const userId = req.user.id;

    // Safely reset each collection if models exist
    if (StudyProgress) {
      try {
        await StudyProgress.findOneAndUpdate(
          { userId },
          { 
            $set: {
              streak: 0,
              totalHours: 0,
              sessionsCompleted: 0,
              weeklyGoalsCompleted: 0,
              points: 0,
              badges: [],
              consistency: 0,
              dailyData: [],
              activities: []
            }
          },
          { upsert: true }
        );
      } catch (e) {
        console.log('Error resetting study data:', e.message);
      }
    }

    if (HealthProgress) {
      try {
        await HealthProgress.findOneAndUpdate(
          { userId },
          {
            $set: {
              streak: 0,
              points: 0,
              badges: [],
              challengesCompleted: 0,
              consistency: 0,
              dailyData: [],
              activities: []
            }
          },
          { upsert: true }
        );
      } catch (e) {
        console.log('Error resetting health data:', e.message);
      }
    }

    if (HabitTracker) {
      try {
        await HabitTracker.findOneAndUpdate(
          { userId },
          {
            $set: {
              streak: 0,
              completedTasks: 0,
              points: 0,
              badges: [],
              consistency: 0,
              dailyData: [],
              activities: []
            }
          },
          { upsert: true }
        );
      } catch (e) {
        console.log('Error resetting habit data:', e.message);
      }
    }

    res.json({ message: 'Data reset successfully' });
  } catch (error) {
    console.error('Error resetting data:', error);
    res.status(500).json({ message: 'Error resetting data', error: error.message });
  }
};

// ==================== Helper Functions ====================

const calculateTotalPoints = (studyData, healthData, habitData) => {
  let points = 0;
  if (studyData?.points) points += studyData.points;
  if (healthData?.points) points += healthData.points;
  if (habitData?.points) points += habitData.points;
  return points;
};

const calculateRank = (studyData, healthData, habitData) => {
  const totalPoints = calculateTotalPoints(studyData, healthData, habitData);
  if (totalPoints >= 5000) return 'Diamond';
  if (totalPoints >= 3000) return 'Platinum';
  if (totalPoints >= 2000) return 'Gold';
  if (totalPoints >= 1000) return 'Silver';
  return 'Bronze';
};

const calculateLevel = (studyData, healthData, habitData) => {
  const totalPoints = calculateTotalPoints(studyData, healthData, habitData);
  if (totalPoints >= 4000) return 'Master';
  if (totalPoints >= 2500) return 'Advanced';
  if (totalPoints >= 1500) return 'Intermediate';
  if (totalPoints >= 500) return 'Beginner';
  return 'Novice';
};

const calculateTotalBadges = (studyData, healthData, habitData) => {
  let count = 0;
  if (studyData?.badges) count += studyData.badges.length;
  if (healthData?.badges) count += healthData.badges.length;
  if (habitData?.badges) count += habitData.badges.length;
  return count;
};

const calculateConsistency = (studyData, healthData, habitData) => {
  const scores = [];
  if (studyData?.consistency) scores.push(studyData.consistency);
  if (healthData?.consistency) scores.push(healthData.consistency);
  if (habitData?.consistency) scores.push(habitData.consistency);
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
};

const getWeeklyData = (dailyData, weekStart, type) => {
  const weeklyData = [0, 0, 0, 0, 0, 0, 0];
  
  if (!dailyData || dailyData.length === 0) {
    return weeklyData;
  }

  dailyData.forEach(day => {
    const dayDate = new Date(day.date);
    if (dayDate >= weekStart) {
      const dayIndex = dayDate.getDay();
      if (type === 'study') {
        weeklyData[dayIndex] = day.hours || 0;
      } else if (type === 'workout') {
        weeklyData[dayIndex] = day.completed ? 1 : 0;
      } else if (type === 'habits') {
        weeklyData[dayIndex] = day.completed || 0;
      }
    }
  });

  return weeklyData;
};

const formatTimeAgo = (date) => {
  if (!date) return 'Just now';
  const now = new Date();
  const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
};

module.exports = {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getUserStats,
  getAchievements,
  getRecentActivities,
  getWeeklyProgress,
  deleteAccount,
  resetData
};