// backend/controllers/adminController.js
const Admin = require('../../models/Admin');
const User = require('../../models/User');
const StudyProgress = require('../../models/Studyprogress');
const HealthProgress = require('../../models/HealthProgress');
const HabitTracker = require('../../models/HabitTracker');
const jwt = require('jsonwebtoken');

// ==================== Auth Controllers ====================

// backend/controllers/adminController.js - Make sure this is correct

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('📧 Admin login attempt:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      console.log('❌ Admin not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Admin found:', admin.name);

    if (!admin.isActive) {
      console.log('❌ Admin account is disabled');
      return res.status(403).json({ message: 'Account is disabled' });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Password matched');

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    console.log('✅ Admin login successful, returning token');

    res.json({
      token,
      admin: adminResponse,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ Admin login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json(admin);
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (profileImage) admin.profileImage = profileImage;

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      admin: adminResponse,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== User Management ====================

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const studyData = await StudyProgress.findOne({ userId: user._id });
    const healthData = await HealthProgress.findOne({ userId: user._id });
    const habitData = await HabitTracker.findOne({ userId: user._id });

    res.json({
      user,
      progress: {
        study: studyData || null,
        health: healthData || null,
        habits: habitData || null
      }
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, role, grade, school, isActive } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (grade) user.grade = grade;
    if (school) user.school = school;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    await StudyProgress.findOneAndDelete({ userId: req.params.id });
    await HealthProgress.findOneAndDelete({ userId: req.params.id });
    await HabitTracker.findOneAndDelete({ userId: req.params.id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== Admin Management ====================

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const admin = new Admin({
      name,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || {
        manageUsers: true,
        manageContent: true,
        viewAnalytics: true,
        manageAdmins: false,
        manageSystem: false
      }
    });

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      admin: adminResponse,
      message: 'Admin created successfully'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password').sort({ createdAt: -1 });
    res.json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, phone, role, permissions, isActive } = req.body;
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (name) admin.name = name;
    if (phone) admin.phone = phone;
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      admin: adminResponse,
      message: 'Admin updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role === 'super_admin') {
      const superAdmins = await Admin.countDocuments({ role: 'super_admin' });
      if (superAdmins <= 1) {
        return res.status(400).json({ message: 'Cannot delete the last super admin' });
      }
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== Dashboard Stats ====================

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await Admin.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalStudySessions = await StudyProgress.aggregate([
      { $group: { _id: null, total: { $sum: '$sessionsCompleted' } } }
    ]);

    const stats = {
      totalUsers,
      totalAdmins,
      activeUsers,
      totalStudySessions: totalStudySessions[0]?.total || 0,
      usersGrowth: await getUserGrowth(),
      roleDistribution: await getRoleDistribution(),
      recentUsers: await User.find().select('-password').sort({ createdAt: -1 }).limit(5)
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ==================== Helper Functions ====================

const getUserGrowth = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const growth = await User.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return growth;
};

const getRoleDistribution = async () => {
  const distribution = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  return distribution;
};

// ==================== Temporary Route for Creating First Admin ====================

const createFirstAdmin = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');

    const existingAdmin = await Admin.findOne({ email: 'admin@trackwise.com' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      name: 'Super Admin',
      email: 'admin@trackwise.com',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
      permissions: {
        manageUsers: true,
        manageContent: true,
        viewAnalytics: true,
        manageAdmins: true,
        manageSystem: true
      }
    });

    await admin.save();

    const adminResponse = admin.toObject();
    delete adminResponse.password;

    res.json({
      message: 'Admin created successfully!',
      admin: adminResponse,
      credentials: {
        email: 'admin@trackwise.com',
        password: 'admin123'
      }
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};

// Export all functions
module.exports = {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  createAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  getDashboardStats,
  createFirstAdmin // Add this for creating first admin
};