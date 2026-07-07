// backend/controllers/habitController.js
const HabitTracker = require('../models/HabitTracker');

// Get habit progress
const getHabitProgress = async (req, res) => {
  try {
    let habitData = await HabitTracker.findOne({ userId: req.user.id });
    
    if (!habitData) {
      habitData = new HabitTracker({
        userId: req.user.id,
        streak: 0,
        completedTasks: 0,
        points: 0,
        badges: [],
        consistency: 0,
        dailyData: [],
        habits: [],
        activities: []
      });
      await habitData.save();
    }
    
    res.json(habitData);
  } catch (error) {
    console.error('Error fetching habit progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new habit
const createHabit = async (req, res) => {
  try {
    const { name, category, description, target, reminder } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Habit name is required' });
    }

    let habitData = await HabitTracker.findOne({ userId: req.user.id });
    
    if (!habitData) {
      habitData = new HabitTracker({ userId: req.user.id });
    }

    const newHabit = {
      name,
      category: category || 'morning',
      description: description || '',
      target: target || 'daily',
      reminder: reminder || '',
      isActive: true,
      createdAt: new Date()
    };

    habitData.habits.push(newHabit);
    await habitData.save();

    res.json({
      message: 'Habit created successfully',
      habit: newHabit,
      habitData
    });
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log habit completion
const logHabit = async (req, res) => {
  try {
    const { habitId, notes } = req.body;
    
    let habitData = await HabitTracker.findOne({ userId: req.user.id });
    
    if (!habitData) {
      return res.status(404).json({ message: 'Habit data not found' });
    }

    const habit = habitData.habits.id(habitId);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update streak
    const lastHabitDate = habitData.lastHabitDate ? new Date(habitData.lastHabitDate) : null;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastHabitDate || lastHabitDate < yesterday) {
      habitData.streak = 0;
    } else if (lastHabitDate >= today) {
      // Already logged today
      return res.status(400).json({ message: 'Habit already logged for today' });
    } else {
      habitData.streak += 1;
    }

    habitData.lastHabitDate = new Date();

    // Add to daily data
    const dailyEntry = habitData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    const habitLog = {
      habitId: habit._id,
      name: habit.name,
      category: habit.category,
      completed: true,
      completedAt: new Date(),
      notes: notes || ''
    };

    if (dailyEntry) {
      // Check if habit already logged today
      const existingLog = dailyEntry.habits.find(h => h.habitId.toString() === habitId);
      if (existingLog) {
        return res.status(400).json({ message: 'Habit already logged for today' });
      }
      dailyEntry.habits.push(habitLog);
      dailyEntry.totalCompleted += 1;
    } else {
      habitData.dailyData.push({
        date: today,
        habits: [habitLog],
        totalCompleted: 1,
        totalHabits: habitData.habits.filter(h => h.isActive).length
      });
    }

    // Update metrics
    habitData.completedTasks += 1;
    const pointsEarned = 10;
    habitData.points += pointsEarned;

    // Update consistency
    const last30Days = habitData.dailyData.slice(-30);
    const habitDays = last30Days.filter(d => d.totalCompleted > 0).length;
    habitData.consistency = Math.round((habitDays / 30) * 100);

    // Add activity
    habitData.activities.push({
      description: `Completed habit: ${habit.name}`,
      date: new Date(),
      completed: true
    });

    // Check for badges
    await checkHabitBadges(habitData);

    await habitData.save();

    res.json({
      message: 'Habit logged successfully',
      habitData,
      pointsEarned
    });
  } catch (error) {
    console.error('Error logging habit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get today's habits
const getTodayHabits = async (req, res) => {
  try {
    const habitData = await HabitTracker.findOne({ userId: req.user.id });
    
    if (!habitData) {
      return res.json({ habits: [], completed: [] });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyEntry = habitData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    const activeHabits = habitData.habits.filter(h => h.isActive);
    const completedHabitIds = dailyEntry?.habits.map(h => h.habitId.toString()) || [];

    const habitsWithStatus = activeHabits.map(habit => ({
      ...habit.toObject(),
      completed: completedHabitIds.includes(habit._id.toString())
    }));

    res.json({
      habits: habitsWithStatus,
      totalCompleted: dailyEntry?.totalCompleted || 0,
      totalHabits: activeHabits.length,
      streak: habitData.streak || 0
    });
  } catch (error) {
    console.error('Error fetching today\'s habits:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get habit stats
const getHabitStats = async (req, res) => {
  try {
    const habitData = await HabitTracker.findOne({ userId: req.user.id });
    
    if (!habitData) {
      return res.json({
        streak: 0,
        completedTasks: 0,
        points: 0,
        consistency: 0,
        badges: [],
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        activeHabits: 0
      });
    }

    // Get weekly data
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyData = habitData.dailyData
      .filter(d => new Date(d.date) >= weekStart)
      .map(d => d.totalCompleted || 0);
    
    while (weeklyData.length < 7) {
      weeklyData.push(0);
    }

    res.json({
      streak: habitData.streak || 0,
      completedTasks: habitData.completedTasks || 0,
      points: habitData.points || 0,
      consistency: habitData.consistency || 0,
      badges: habitData.badges || [],
      weeklyData: weeklyData.slice(0, 7),
      activeHabits: habitData.habits.filter(h => h.isActive).length
    });
  } catch (error) {
    console.error('Error fetching habit stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to check and award badges
const checkHabitBadges = async (habitData) => {
  const badges = habitData.badges || [];
  const existingBadgeNames = badges.map(b => b.name);

  const badgeChecks = [
    { name: 'First Habit', condition: habitData.completedTasks >= 1, icon: '✅' },
    { name: 'Habit Streak 7 Days', condition: habitData.streak >= 7, icon: '🔥' },
    { name: 'Habit Streak 30 Days', condition: habitData.streak >= 30, icon: '⭐' },
    { name: 'Habit Builder', condition: habitData.completedTasks >= 50, icon: '🏗️' },
    { name: 'Habit Master', condition: habitData.completedTasks >= 200, icon: '🏆' },
    { name: 'Consistency King', condition: habitData.consistency >= 90, icon: '👑' }
  ];

  for (const check of badgeChecks) {
    if (check.condition && !existingBadgeNames.includes(check.name)) {
      badges.push({
        name: check.name,
        earnedAt: new Date(),
        icon: check.icon
      });
    }
  }

  habitData.badges = badges;
};

module.exports = {
  getHabitProgress,
  createHabit,
  logHabit,
  getTodayHabits,
  getHabitStats
};