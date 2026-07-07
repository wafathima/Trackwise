// backend/controllers/healthController.js
const HealthProgress = require('../models/HealthProgress');

// Get health progress
const getHealthProgress = async (req, res) => {
  try {
    let healthData = await HealthProgress.findOne({ userId: req.user.id });
    
    if (!healthData) {
      healthData = new HealthProgress({
        userId: req.user.id,
        streak: 0,
        points: 0,
        badges: [],
        challengesCompleted: 0,
        consistency: 0,
        dailyData: [],
        activities: [],
        goals: []
      });
      await healthData.save();
    }
    
    res.json(healthData);
  } catch (error) {
    console.error('Error fetching health progress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log workout
const logWorkout = async (req, res) => {
  try {
    const { type, name, duration, exercises, calories } = req.body;
    
    if (!duration || duration <= 0) {
      return res.status(400).json({ message: 'Valid duration is required' });
    }

    let healthData = await HealthProgress.findOne({ userId: req.user.id });
    
    if (!healthData) {
      healthData = new HealthProgress({ userId: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Update streak
    const lastWorkoutDate = healthData.lastWorkoutDate ? new Date(healthData.lastWorkoutDate) : null;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastWorkoutDate || lastWorkoutDate < yesterday) {
      healthData.streak = 0;
    } else if (lastWorkoutDate >= today) {
      // Already worked out today
    } else {
      healthData.streak += 1;
    }

    healthData.lastWorkoutDate = new Date();

    // Add daily data
    const dailyEntry = healthData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    const workoutEntry = {
      type: type || 'fitness',
      name: name || 'Workout',
      duration,
      exercises: exercises || [],
      completed: true,
      calories: calories || 0
    };

    if (dailyEntry) {
      dailyEntry.workouts.push(workoutEntry);
    } else {
      healthData.dailyData.push({
        date: today,
        workouts: [workoutEntry],
        waterIntake: 0,
        sleepHours: 0,
        mood: 'good',
        notes: ''
      });
    }

    // Calculate points
    const pointsEarned = Math.round(duration * 2);
    healthData.points += pointsEarned;

    // Update consistency
    const last30Days = healthData.dailyData.slice(-30);
    const workoutDays = last30Days.filter(d => d.workouts.some(w => w.completed)).length;
    healthData.consistency = Math.round((workoutDays / 30) * 100);

    // Add activity
    healthData.activities.push({
      type: 'workout',
      description: `Completed ${name || type} workout for ${duration} minutes`,
      date: new Date(),
      duration
    });

    // Check for badges
    await checkHealthBadges(healthData);

    await healthData.save();

    res.json({
      message: 'Workout logged successfully',
      healthData,
      pointsEarned
    });
  } catch (error) {
    console.error('Error logging workout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log water intake
const logWaterIntake = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    let healthData = await HealthProgress.findOne({ userId: req.user.id });
    
    if (!healthData) {
      healthData = new HealthProgress({ userId: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyEntry = healthData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    if (dailyEntry) {
      dailyEntry.waterIntake = (dailyEntry.waterIntake || 0) + amount;
    } else {
      healthData.dailyData.push({
        date: today,
        workouts: [],
        waterIntake: amount,
        sleepHours: 0,
        mood: 'good',
        notes: ''
      });
    }

    await healthData.save();

    res.json({
      message: 'Water intake logged successfully',
      healthData
    });
  } catch (error) {
    console.error('Error logging water intake:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log sleep
const logSleep = async (req, res) => {
  try {
    const { hours } = req.body;
    
    if (!hours || hours <= 0) {
      return res.status(400).json({ message: 'Valid hours are required' });
    }

    let healthData = await HealthProgress.findOne({ userId: req.user.id });
    
    if (!healthData) {
      healthData = new HealthProgress({ userId: req.user.id });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyEntry = healthData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    if (dailyEntry) {
      dailyEntry.sleepHours = hours;
    } else {
      healthData.dailyData.push({
        date: today,
        workouts: [],
        waterIntake: 0,
        sleepHours: hours,
        mood: 'good',
        notes: ''
      });
    }

    await healthData.save();

    res.json({
      message: 'Sleep logged successfully',
      healthData
    });
  } catch (error) {
    console.error('Error logging sleep:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get health stats
const getHealthStats = async (req, res) => {
  try {
    const healthData = await HealthProgress.findOne({ userId: req.user.id });
    
    if (!healthData) {
      return res.json({
        streak: 0,
        points: 0,
        consistency: 0,
        badges: [],
        challengesCompleted: 0,
        weeklyData: [0, 0, 0, 0, 0, 0, 0],
        waterIntake: 0,
        sleepHours: 0
      });
    }

    // Get weekly workout data
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    
    const weeklyData = healthData.dailyData
      .filter(d => new Date(d.date) >= weekStart)
      .map(d => d.workouts.filter(w => w.completed).length);
    
    while (weeklyData.length < 7) {
      weeklyData.push(0);
    }

    // Get today's data
    const todayEntry = healthData.dailyData.find(d => 
      new Date(d.date).toDateString() === today.toDateString()
    );

    res.json({
      streak: healthData.streak || 0,
      points: healthData.points || 0,
      consistency: healthData.consistency || 0,
      badges: healthData.badges || [],
      challengesCompleted: healthData.challengesCompleted || 0,
      weeklyData: weeklyData.slice(0, 7),
      waterIntake: todayEntry?.waterIntake || 0,
      sleepHours: todayEntry?.sleepHours || 0
    });
  } catch (error) {
    console.error('Error fetching health stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper function to check and award badges
const checkHealthBadges = async (healthData) => {
  const badges = healthData.badges || [];
  const existingBadgeNames = badges.map(b => b.name);

  const badgeChecks = [
    { name: 'First Workout', condition: healthData.activities.filter(a => a.type === 'workout').length >= 1, icon: '💪' },
    { name: 'Workout Streak 7 Days', condition: healthData.streak >= 7, icon: '🔥' },
    { name: 'Workout Streak 30 Days', condition: healthData.streak >= 30, icon: '⭐' },
    { name: 'Fitness Enthusiast', condition: healthData.activities.filter(a => a.type === 'workout').length >= 30, icon: '🏋️' },
    { name: 'Fitness Master', condition: healthData.activities.filter(a => a.type === 'workout').length >= 100, icon: '🏆' },
    { name: 'Wellness Guru', condition: healthData.challengesCompleted >= 10, icon: '🧘' }
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

  healthData.badges = badges;
};

module.exports = {
  getHealthProgress,
  logWorkout,
  logWaterIntake,
  logSleep,
  getHealthStats
};