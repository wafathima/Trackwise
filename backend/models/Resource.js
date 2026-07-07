// backend/models/Resource.js
const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['textbook', 'notes', 'paper', 'revision', 'mcq', 'solutions', 'curriculum', 'material'],
    required: true
  },
  category: {
    type: String,
    enum: ['Full Textbook PDFs', 'Chapter Notes', 'Previous Year Question Papers', 
           'Quick Revision Notes', 'MCQ Practice Tests', 'Activities and Exercise Answers',
           'CBSE Curriculum', 'Study Material'],
    required: true
  },
  class: {
    type: String,
    enum: ['7th', '8th', '9th', '10th', '11th', '12th', 'all'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: String
  },
  fileName: {
    type: String
  },
  fileType: {
    type: String
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadedByName: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);