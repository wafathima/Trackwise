// backend/models/HabitTracker.js
const mongoose = require('mongoose');

const HabitTrackerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Streak tracking
  streak: {
    type: Number,
    default: 0
  },
  lastHabitDate: {
    type: Date,
    default: null
  },
  // Habit metrics
  completedTasks: {
    type: Number,
    default: 0
  },
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: Date,
    icon: String
  }],
  consistency: {
    type: Number,
    default: 0
  },
  // Daily habits
  dailyData: [{
    date: {
      type: Date,
      default: Date.now
    },
    habits: [{
      habitId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Habit'
      },
      name: String,
      category: {
        type: String,
        enum: ['morning', 'study', 'fitness', 'health', 'evening'],
        default: 'morning'
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date,
      notes: String
    }],
    totalCompleted: {
      type: Number,
      default: 0
    },
    totalHabits: {
      type: Number,
      default: 0
    }
  }],
  // Custom habits
  habits: [{
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['morning', 'study', 'fitness', 'health', 'evening'],
      default: 'morning'
    },
    description: String,
    target: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily'
    },
    reminder: {
      type: String
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Activities
  activities: [{
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('HabitTracker', HabitTrackerSchema);