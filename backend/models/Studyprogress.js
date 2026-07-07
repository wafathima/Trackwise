// backend/models/StudyProgress.js
const mongoose = require('mongoose');

const StudyProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  streak: {
    type: Number,
    default: 0
  },
  lastStudyDate: {
    type: Date,
    default: null
  },
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
  }]
}, { timestamps: true });

// Check if model already exists before creating
const StudyProgress = mongoose.models.StudyProgress || mongoose.model('StudyProgress', StudyProgressSchema);

module.exports = StudyProgress;