// backend/models/StudyProgress.js
const mongoose = require('mongoose');

const StudyProgressSchema = new mongoose.Schema({
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
  lastStudyDate: {
    type: Date,
    default: null
  },
  // Study metrics
  totalHours: {
    type: Number,
    default: 0
  },
  sessionsCompleted: {
    type: Number,
    default: 0
  },
  weeklyGoalsCompleted: {
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
  // Daily study logs
  dailyData: [{
    date: {
      type: Date,
      default: Date.now
    },
    hours: {
      type: Number,
      default: 0
    },
    subjects: [{
      name: String,
      hours: Number
    }],
    notes: String
  }],
  // Recent activities
  activities: [{
    type: {
      type: String,
      enum: ['study', 'quiz', 'practice', 'test'],
      default: 'study'
    },
    description: String,
    date: {
      type: Date,
      default: Date.now
    },
    duration: Number,
    score: Number
  }],
  // Subject-wise progress
  subjects: [{
    name: String,
    progress: {
      type: Number,
      default: 0
    },
    chapters: [{
      name: String,
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    quizzes: [{
      name: String,
      score: Number,
      attemptedAt: Date
    }]
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

module.exports = mongoose.model('StudyProgress', StudyProgressSchema);