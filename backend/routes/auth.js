const express = require('express');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const { validateRequest, schemas } = require('../middleware/validation');

const router = express.Router();

// Mock admin user (replace with database in production)
const mockAdmin = {
  id: 1,
  email: 'admin@gujaratestate.com',
  password: '$2a$10$UTQWwQ7HaF9/9.d99mE6Wu2Sp7nw4yH9xy/ZM.37Qzck/mRSX7mzy', // password: 'admin123'
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
};

/**
 * @route POST /api/auth/admin/login
 * @desc Admin login
 * @access Public
 */
router.post('/admin/login', 
  validateRequest(schemas.loginUser),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(`🔐 Admin login attempt: ${email}`);

      // Check if admin exists (mock check)
      if (email !== mockAdmin.email) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, mockAdmin.password);
      
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate JWT token
      const token = generateToken({
        id: mockAdmin.id,
        email: mockAdmin.email,
        role: mockAdmin.role
      });

      console.log(`✅ Admin login successful: ${email}`);

      res.json({
        success: true,
        data: {
          user: {
            id: mockAdmin.id,
            name: mockAdmin.name,
            email: mockAdmin.email,
            role: mockAdmin.role,
            avatar: mockAdmin.avatar
          },
          token
        },
        message: 'Login successful'
      });

    } catch (error) {
      console.error('❌ Admin login error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/auth/admin/logout
 * @desc Admin logout
 * @access Private
 */
router.post('/admin/logout', (req, res) => {
  // In a real application, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @route GET /api/auth/admin/profile
 * @desc Get admin profile
 * @access Private
 */
router.get('/admin/profile', (req, res) => {
  // This would typically require authentication middleware
  // For now, return mock admin data
  res.json({
    success: true,
    data: {
      id: mockAdmin.id,
      name: mockAdmin.name,
      email: mockAdmin.email,
      role: mockAdmin.role,
      avatar: mockAdmin.avatar
    }
  });
});

/**
 * @route POST /api/auth/user/register
 * @desc User registration
 * @access Public
 */
router.post('/user/register',
  validateRequest(schemas.registerUser),
  async (req, res) => {
    try {
      const { firstName, lastName, email, phone, password } = req.body;

      console.log(`📝 User registration attempt: ${email}`);

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mock user creation (replace with database in production)
      const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        phone,
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Generate JWT token
      const token = generateToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      });

      console.log(`✅ User registration successful: ${email}`);

      res.status(201).json({
        success: true,
        data: {
          user: newUser,
          token
        },
        message: 'Registration successful'
      });

    } catch (error) {
      console.error('❌ User registration error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Registration failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/auth/user/login
 * @desc User login
 * @access Public
 */
router.post('/user/login',
  validateRequest(schemas.loginUser),
  async (req, res) => {
    try {
      const { email, password } = req.body;

      console.log(`🔐 User login attempt: ${email}`);

      // Mock user login (replace with database lookup in production)
      // For demo purposes, accept any email/password combination
      const mockUser = {
        id: Date.now(),
        name: 'John Doe',
        email: email,
        role: 'user',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
      };

      // Generate JWT token
      const token = generateToken({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role
      });

      console.log(`✅ User login successful: ${email}`);

      res.json({
        success: true,
        data: {
          user: mockUser,
          token
        },
        message: 'Login successful'
      });

    } catch (error) {
      console.error('❌ User login error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Login failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;