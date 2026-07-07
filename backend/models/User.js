// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId;
    }
  },
  role: {
    type: String,
    enum: ['Student', 'Parent', 'Mentor', 'Teacher', 'student', 'parent', 'mentor', 'teacher'],
    default: 'Student'
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  location: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  grade: {
    type: String,
    trim: true,
    default: ''
  },
  school: {
    type: String,
    trim: true,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  classGroup: {
    type: String,
    default: null
  },
  googleId: {
    type: String,
    sparse: true,
    index: true
  },
  avatar: {
    type: String,
    default: ''
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
}, { timestamps: true });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);