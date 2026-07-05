// // models/User.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({

//   name: {
//      type: String, 
//      required: true, 
//      trim: true 
//     },

//   email: { 
//     type: String, 
//     required: true, 
//     unique: true, 
//     lowercase: true, 
//     trim: true 
//   },

//   password: { 
//     type: String, 
//     // required: true 
//     required: function() {
//     return !this.googleId; 
//   }
//   },

//   role: { 
//     type: String, 
//     enum: ['Student', 'Parent', 'Mentor', 'Teacher'], 
//     default: 'Student' 
//   },

//   classGroup: { 
//     type: String, 
//     default: null 
//   },
//   phone: {
//     type: String,
//     trim: true
//   },
//   location: {
//     type: String,
//     trim: true
//   },
//   bio: {
//     type: String,
//     trim: true
//   },
//    school: {
//     type: String,
//     trim: true
//   },
//   googleId: { 
//     type: String, 
//     sparse: true,
//     index: true
//   }, 

//   avatar: { 
//     type: String 
//   },

//   resetPasswordToken: { 
//     type: String 
//   },
  
//   resetPasswordExpires: { 
//     type: Date 
//   }
// }, { timestamps: true });

// // ✅ Correct modern Async approach
// UserSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
  
//   const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Compare password method
// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);

// backend/models/User.js
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const UserSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: function() {
//       return !this.googleId;
//     }
//   },
//   role: {
//     type: String,
//     enum: ['Student', 'Parent', 'Mentor', 'Teacher', 'student', 'parent', 'mentor', 'teacher'],
//     default: 'Student'
//   },
//   classGroup: {
//     type: String,
//     default: null
//   },
//   phone: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   location: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   bio: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   grade: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   school: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   profileImage: {
//     type: String,
//     default: ''
//   },
//   googleId: {
//     type: String,
//     sparse: true,
//     index: true
//   },
//   avatar: {
//     type: String,
//     default: ''
//   },
//   resetPasswordToken: {
//     type: String
//   },
//   resetPasswordExpires: {
//     type: Date
//   }
// }, { timestamps: true });

// // Hash password before saving
// UserSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;
//   const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_ROUNDS) || 10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Compare password method
// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model('User', UserSchema);


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
  }
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