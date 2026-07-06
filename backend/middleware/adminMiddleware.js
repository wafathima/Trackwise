// backend/middleware/adminMiddleware.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authAdmin = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.admin = await Admin.findById(decoded.id).select('-password');
      
      if (!req.admin) {
        return res.status(401).json({ message: 'Admin not found' });
      }

      if (!req.admin.isActive) {
        return res.status(403).json({ message: 'Admin account is disabled' });
      }
      
      next();
    } catch (error) {
      console.error('Admin auth error:', error);
      return res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based authorization
const authorizeAdmin = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ 
        message: `Role (${req.admin.role}) is not allowed to access this resource` 
      });
    }
    next();
  };
};

module.exports = { authAdmin, authorizeAdmin };