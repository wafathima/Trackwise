// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { authAdmin, authorizeAdmin } = require('../../middleware/adminMiddleware');
const {
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
  createFirstAdmin // Import the new function
} = require('../../controllers/admin/adminController');

// ==================== Auth Routes ====================
router.post('/login', adminLogin);
router.get('/profile', authAdmin, getAdminProfile);
router.put('/profile', authAdmin, updateAdminProfile);

// ==================== Temporary Route for First Admin ====================
// Remove this after creating the first admin
router.post('/create-first-admin', createFirstAdmin);

// ==================== Dashboard Routes ====================
router.get('/dashboard', authAdmin, getDashboardStats);

// ==================== User Management Routes ====================
router.get('/users', authAdmin, getAllUsers);
router.get('/users/:id', authAdmin, getUserDetails);
router.put('/users/:id', authAdmin, updateUser);
router.delete('/users/:id', authAdmin, deleteUser);

// ==================== Admin Management Routes ====================
router.post('/admins', authAdmin, authorizeAdmin('super_admin'), createAdmin);
router.get('/admins', authAdmin, authorizeAdmin('super_admin'), getAllAdmins);
router.put('/admins/:id', authAdmin, authorizeAdmin('super_admin'), updateAdmin);
router.delete('/admins/:id', authAdmin, authorizeAdmin('super_admin'), deleteAdmin);

module.exports = router;