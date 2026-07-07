// backend/models/HealthProgress.js
const mongoose = require('mongoose');

const HealthProgressSchema = new mongoose.Schema({
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
  lastWorkoutDate: {
    type: Date,
    default: null
  },
  // Health metrics
  points: {
    type: Number,
    default: 0
  },
  badges: [{
    name: String,
    earnedAt: Date,
    icon: String
  }],
  challengesCompleted: {
    type: Number,
    default: 0
  },
  consistency: {
    type: Number,
    default: 0
  },
  // Workout logs
  dailyData: [{
    date: {
      type: Date,
      default: Date.now
    },
    workouts: [{
      type: {
        type: String,
        enum: ['fitness', 'calisthenics', 'yoga', 'cardio'],
        default: 'fitness'
      },
      name: String,
      duration: Number,
      exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        weight: Number
      }],
      completed: {
        type: Boolean,
        default: false
      },
      calories: Number
    }],
    waterIntake: {
      type: Number,
      default: 0
    },
    sleepHours: {
      type: Number,
      default: 0
    },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'bad', 'terrible'],
      default: 'good'
    },
    notes: String
  }],
  // Activities
  activities: [{
    type: {
      type: String,
      enum: ['workout', 'yoga', 'meditation', 'nutrition'],
      default: 'workout'
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    duration: Number
  }],
  // Goals
  goals: [{
    type: {
      type: String,
      enum: ['workout', 'weight', 'water', 'sleep'],
      default: 'workout'
    },
    target: Number,
    current: {
      type: Number,
      default: 0
    },
    targetDate: Date,
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

module.exports = mongoose.model('HealthProgress', HealthProgressSchema);