const User = require('../models/User');

// @desc    Create initial admin user (Bootstrap endpoint)
// @route   POST /api/setup/create-admin
// @access  Public (but only works when no admin exists)
exports.createInitialAdmin = async (req, res, next) => {
  try {
    // Check if any admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists. Please login with existing credentials or contact system administrator.'
      });
    }

    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, phone, and password'
      });
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      phone,
      password,
      role: 'admin',
      status: 'active',
      permissions: {
        canDiscount: true,
        canRefund: true,
        canViewReports: true,
        maxDiscountPercent: 50
      }
    });

    res.status(201).json({
      success: true,
      message: 'Admin user created successfully! You can now login.',
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if setup is required
// @route   GET /api/setup/status
// @access  Public
exports.checkSetupStatus = async (req, res, next) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    
    res.status(200).json({
      success: true,
      setupRequired: !adminExists,
      message: adminExists 
        ? 'Admin user exists. Please login.' 
        : 'No admin user found. Please create initial admin user.'
    });
  } catch (error) {
    next(error);
  }
};
