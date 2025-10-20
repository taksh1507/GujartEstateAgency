const express = require('express');
const { authenticateUser, optionalAuth } = require('../middleware/auth');

const router = express.Router();

/**
 * @route GET /api/users/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile',
  authenticateUser,
  async (req, res) => {
    try {
      // In a real application, fetch user from database
      const user = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name || 'User',
        role: req.user.role,
        avatar: req.user.avatar || null,
        createdAt: req.user.createdAt || new Date().toISOString()
      };

      res.json({
        success: true,
        data: {
          user
        }
      });

    } catch (error) {
      console.error('❌ Get user profile error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user profile',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route PUT /api/users/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile',
  authenticateUser,
  async (req, res) => {
    try {
      const { name, phone, avatar } = req.body;

      // In a real application, update user in database
      const updatedUser = {
        id: req.user.id,
        email: req.user.email,
        name: name || req.user.name,
        phone: phone || req.user.phone,
        avatar: avatar || req.user.avatar,
        role: req.user.role,
        updatedAt: new Date().toISOString()
      };

      console.log(`✅ User profile updated: ${req.user.email}`);

      res.json({
        success: true,
        data: {
          user: updatedUser
        },
        message: 'Profile updated successfully'
      });

    } catch (error) {
      console.error('❌ Update user profile error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;