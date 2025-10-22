const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { authenticateAdmin, generateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const propertyService = require('../services/propertyService');
const { db } = require('../config/firebase');

const router = express.Router();

// Set default NODE_ENV if not defined
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Validation schemas
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Get admin credentials from environment variables
const getAdminCredentials = () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error('Missing required environment variables: ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME');
  }

  return {
    id: 'admin-001',
    email,
    password,
    name,
    role: 'admin'
  };
};

/**
 * @route POST /api/admin/login
 * @desc Admin login
 * @access Public
 */
router.post('/login',
  validateRequest(loginSchema),
  async (req, res) => {
    try {
      const { email, password: rawPassword } = req.body;
      const password = rawPassword.trim();

      console.log(`🔍 Admin login attempt: ${email}`);

      const admin = getAdminCredentials();

      if (email !== admin.email || password !== admin.password) {
        console.log(`❌ Invalid credentials for: ${email}`);
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      const token = generateToken({
        id: admin.id,
        email: admin.email,
        role: admin.role,
        name: admin.name
      });

      console.log(`✅ Admin login successful: ${email}`);

      res.json({
        success: true,
        data: {
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
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
 * @route POST /api/admin/logout
 * @desc Admin logout
 * @access Private
 */
router.post('/logout', authenticateAdmin, (req, res) => {
  // TODO: Implement token invalidation (e.g., add to blacklist in Redis or Firestore)
  console.log(`✅ Admin logout: ${req.user.email}`);
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * @route GET /api/admin/profile
 * @desc Get admin profile
 * @access Private
 */
router.get('/profile', authenticateAdmin, (req, res) => {
  const admin = getAdminCredentials();
  res.json({
    success: true,
    data: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    }
  });
});

/**
 * @route PUT /api/admin/profile
 * @desc Update admin profile
 * @access Private
 */
router.put('/profile',
  authenticateAdmin,
  validateRequest(Joi.object({
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required()
  })),
  async (req, res) => {
    try {
      const { name, email } = req.body;
      console.log(`🔄 Admin profile update request: ${email}`);

      // Note: Password updates should be done via .env file
      res.status(400).json({
        success: false,
        error: 'Profile update not allowed',
        message: 'Admin profile updates must be done via environment variables'
      });

    } catch (error) {
      console.error('❌ Admin profile update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route POST /api/admin/properties/upload-image-base64
 * @desc Upload property image to Cloudinary (base64)
 * @access Private (Admin only)
 */
router.post('/properties/upload-image-base64',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { image, fileName } = req.body;

      if (!image) {
        return res.status(400).json({
          success: false,
          error: 'No image data provided'
        });
      }

      console.log(`📤 Processing property image upload: ${fileName || 'unnamed'}`);

      const cloudinary = require('../config/cloudinary');
      const result = await cloudinary.uploader.upload(image, {
        folder: 'gujarat-estate/properties',
        public_id: fileName ? `property_${Date.now()}_${fileName.split('.')[0]}` : `property_${Date.now()}`,
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' }
        ]
      });

      console.log(`✅ Property image uploaded to Cloudinary: ${result.public_id}`);

      res.json({
        success: true,
        data: {
          url: result.secure_url,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes
        },
        message: 'Property image uploaded successfully to Cloudinary'
      });

    } catch (error) {
      console.error('❌ Property image upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload property image',
        message: error.message
      });
    }
  }
);

// Property management schemas
const propertySchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().positive().required(),
  location: Joi.string().required(),
  beds: Joi.number().integer().min(0).required(),
  baths: Joi.number().integer().min(0).required(),
  area: Joi.number().positive().required(),
  type: Joi.string().valid('Sale', 'Rent').required(),
  propertyType: Joi.string().valid('apartment', 'house', 'villa', 'commercial', 'plot').required(),
  amenities: Joi.array().items(Joi.string()).default([]),
  features: Joi.array().items(Joi.string()).default([]),
  images: Joi.array().items(Joi.string()).default([]),
  agent: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required()
  }).required(),
  status: Joi.string().valid('active', 'inactive', 'sold', 'rented').optional()
});

/**
 * @route GET /api/admin/properties
 * @desc Get all properties for admin
 * @access Private (Admin only)
 */
router.get('/properties',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { page = 1, limit = 10, status, type } = req.query;

      const result = await propertyService.getProperties({
        page: parseInt(page),
        limit: parseInt(limit),
        status,
        type
      });

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('❌ Get admin properties error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch properties',
        message: error.message
      });
    }
  }
);

/**
 * @route POST /api/admin/properties
 * @desc Create new property
 * @access Private (Admin only)
 */
router.post('/properties',
  authenticateAdmin,
  validateRequest(propertySchema),
  async (req, res) => {
    try {
      console.log('🏠 Property creation request received:', req.body);

      const propertyData = {
        ...req.body,
        status: req.body.status || 'active'
      };

      const newProperty = await propertyService.createProperty(propertyData);

      res.status(201).json({
        success: true,
        data: { property: newProperty },
        message: 'Property created successfully'
      });
    } catch (error) {
      console.error('❌ Create property error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create property',
        message: error.message
      });
    }
  }
);

/**
 * @route GET /api/admin/properties/:id
 * @desc Get single property by ID for admin
 * @access Private (Admin only)
 */
router.get('/properties/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      const property = await propertyService.getPropertyById(id);

      res.json({
        success: true,
        data: { property }
      });
    } catch (error) {
      console.error('❌ Get property error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch property'
      });
    }
  }
);

/**
 * @route PUT /api/admin/properties/:id
 * @desc Update property
 * @access Private (Admin only)
 */
router.put('/properties/:id',
  authenticateAdmin,
  validateRequest(propertySchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updatedProperty = await propertyService.updateProperty(id, req.body);

      res.json({
        success: true,
        data: { property: updatedProperty },
        message: 'Property updated successfully'
      });
    } catch (error) {
      console.error('❌ Update property error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update property'
      });
    }
  }
);

/**
 * @route DELETE /api/admin/properties/:id
 * @desc Delete property
 * @access Private (Admin only)
 */
router.delete('/properties/:id',
  authenticateAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;
      await propertyService.deleteProperty(id);

      res.json({
        success: true,
        message: 'Property deleted successfully'
      });
    } catch (error) {
      console.error('❌ Delete property error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete property'
      });
    }
  }
);

/**
 * @route PATCH /api/admin/properties/:id/status
 * @desc Update property status
 * @access Private (Admin only)
 */
router.patch('/properties/:id/status',
  authenticateAdmin,
  validateRequest(Joi.object({
    status: Joi.string().valid('active', 'inactive', 'sold', 'rented').required()
  })),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedProperty = await propertyService.updatePropertyStatus(id, status);

      res.json({
        success: true,
        data: { property: updatedProperty },
        message: 'Property status updated successfully'
      });
    } catch (error) {
      console.error('❌ Update property status error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update property status'
      });
    }
  }
);

/**
 * @route GET /api/admin/inquiries
 * @desc Get all inquiries for admin
 * @access Private (Admin only)
 */
router.get('/inquiries', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = db.collection('inquiries');

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const inquiriesSnapshot = await query.get();

    const inquiries = [];
    inquiriesSnapshot.docs.forEach(doc => {
      inquiries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedInquiries = inquiries.slice(startIndex, endIndex);

    console.log(`📋 Retrieved ${inquiries.length} inquiries for admin`);

    res.json({
      success: true,
      data: {
        inquiries: paginatedInquiries,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(inquiries.length / limit),
          totalInquiries: inquiries.length,
          hasNext: endIndex < inquiries.length,
          hasPrev: startIndex > 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Get inquiries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inquiries',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/admin/inquiries/:inquiryId/respond
 * @desc Respond to an inquiry
 * @access Private (Admin only)
 */
router.put('/inquiries/:inquiryId/respond', authenticateAdmin, async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { response, status = 'responded' } = req.body;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Response message is required'
      });
    }

    const inquiriesRef = db.collection('inquiries');
    const inquiryDoc = await inquiriesRef.doc(inquiryId).get();

    if (!inquiryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }

    const inquiryData = inquiryDoc.data();
    const currentMessages = inquiryData.messages || [];
    const newMessageId = currentMessages.length + 1;

    const adminMessage = {
      id: newMessageId,
      sender: 'admin',
      senderName: 'Admin Team',
      message: response.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...currentMessages, adminMessage];

    await inquiryDoc.ref.update({
      messages: updatedMessages,
      messageCount: updatedMessages.length,
      lastMessageAt: new Date().toISOString(),
      lastMessageBy: 'admin',
      status: status,
      updatedAt: new Date().toISOString(),
      adminResponse: response.trim(),
      adminResponseAt: new Date().toISOString()
    });

    console.log(`✅ Admin responded to inquiry ${inquiryId}`);

    res.json({
      success: true,
      message: 'Response sent successfully',
      data: {
        inquiryId,
        status
      }
    });

  } catch (error) {
    console.error('❌ Respond to inquiry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to respond to inquiry',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/admin/inquiries/:inquiryId/status
 * @desc Update inquiry status
 * @access Private (Admin only)
 */
router.put('/inquiries/:inquiryId/status', authenticateAdmin, async (req, res) => {
  try {
    const { inquiryId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'responded', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const inquiriesRef = db.collection('inquiries');
    const inquiryDoc = await inquiriesRef.doc(inquiryId).get();

    if (!inquiryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }

    await inquiryDoc.ref.update({
      status: status,
      updatedAt: new Date().toISOString()
    });

    console.log(`📝 Inquiry ${inquiryId} status updated to: ${status}`);

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: {
        inquiryId,
        status
      }
    });

  } catch (error) {
    console.error('❌ Update inquiry status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update inquiry status',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/admin/inquiries/stats
 * @desc Get inquiry statistics
 * @access Private (Admin only)
 */
router.get('/inquiries/stats', authenticateAdmin, async (req, res) => {
  try {
    const inquiriesRef = db.collection('inquiries');
    const allInquiriesSnapshot = await inquiriesRef.get();
    const allInquiries = allInquiriesSnapshot.docs.map(doc => doc.data());

    const stats = {
      total: allInquiries.length,
      pending: allInquiries.filter(i => i.status === 'pending').length,
      responded: allInquiries.filter(i => i.status === 'responded').length,
      resolved: allInquiries.filter(i => i.status === 'resolved').length,
      closed: allInquiries.filter(i => i.status === 'closed').length,
      thisMonth: 0,
      thisWeek: 0
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    allInquiries.forEach(inquiry => {
      const createdAt = new Date(inquiry.createdAt);
      if (createdAt >= startOfMonth) {
        stats.thisMonth++;
      }
      if (createdAt >= startOfWeek) {
        stats.thisWeek++;
      }
    });

    console.log(`📊 Inquiry stats: ${stats.total} total, ${stats.pending} pending`);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Get inquiry stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inquiry statistics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/admin/users
 * @desc Get all registered users
 * @access Private (Admin only)
 */
router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20, search } = req.query;

    let query = db.collection('users');

    if (role && role !== 'all') {
      query = query.where('role', '==', role);
    }

    const usersSnapshot = await query.get();

    let users = [];
    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: userData.role || 'user',
        status: userData.isEmailVerified ? 'active' : 'inactive',
        isEmailVerified: userData.isEmailVerified || false,
        profilePicture: userData.profilePicture || '',
        address: userData.address || {},
        preferences: userData.preferences || {},
        joinedAt: userData.createdAt || null,
        lastLoginAt: userData.lastLoginAt || null,
        createdAt: userData.createdAt || null,
        updatedAt: userData.updatedAt || null
      });
    });

    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      users = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(searchTerm)) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    if (status && status !== 'all') {
      users = users.filter(user => user.status === status);
    }

    users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedUsers = users.slice(startIndex, endIndex);

    console.log(`👥 Retrieved ${users.length} users for admin`);

    res.json({
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(users.length / limit),
          totalUsers: users.length,
          hasNext: endIndex < users.length,
          hasPrev: startIndex > 0
        }
      }
    });

  } catch (error) {
    console.error('❌ Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get users',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/admin/users/:userId
 * @desc Get single user details
 * @access Private (Admin only)
 */
router.get('/users/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = userDoc.data();
    const user = {
      id: userDoc.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'user',
      status: userData.isEmailVerified ? 'active' : 'inactive',
      isEmailVerified: userData.isEmailVerified,
      profilePicture: userData.profilePicture,
      address: userData.address,
      preferences: userData.preferences,
      joinedAt: userData.createdAt,
      lastLoginAt: userData.lastLoginAt,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    };

    const inquiriesSnapshot = await db.collection('inquiries')
      .where('userId', '==', userId)
      .get();

    const savedPropertiesSnapshot = await db.collection('savedProperties')
      .where('userId', '==', userId)
      .get();

    const userStats = {
      totalInquiries: inquiriesSnapshot.size,
      totalSavedProperties: savedPropertiesSnapshot.size
    };

    console.log(`👤 Retrieved user details for: ${user.email}`);

    res.json({
      success: true,
      data: {
        user,
        stats: userStats
      }
    });

  } catch (error) {
    console.error('❌ Get user details error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user details',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/admin/users/:userId/status
 * @desc Update user status (activate/deactivate)
 * @access Private (Admin only)
 */
router.put('/users/:userId/status', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Must be either "active" or "inactive"'
      });
    }

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isEmailVerified = status === 'active';
    await userDoc.ref.update({
      isEmailVerified,
      updatedAt: new Date().toISOString()
    });

    console.log(`📝 User ${userId} status updated to: ${status}`);

    res.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: {
        userId,
        status
      }
    });

  } catch (error) {
    console.error('❌ Update user status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user status',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/admin/users/stats
 * @desc Get user statistics
 * @access Private (Admin only)
 */
router.get('/users/stats', authenticateAdmin, async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const allUsersSnapshot = await usersRef.get();
    const allUsers = allUsersSnapshot.docs.map(doc => doc.data());

    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.isEmailVerified).length,
      inactive: allUsers.filter(u => !u.isEmailVerified).length,
      thisMonth: 0,
      thisWeek: 0
    };

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    allUsers.forEach(user => {
      const createdAt = new Date(user.createdAt);
      if (createdAt >= startOfMonth) {
        stats.thisMonth++;
      }
      if (createdAt >= startOfWeek) {
        stats.thisWeek++;
      }
    });

    console.log(`📊 User stats: ${stats.total} total, ${stats.active} active`);

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Get user stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user statistics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Site Settings Management (Persisted to Firestore)
const initializeSiteSettings = async () => {
  const settingsRef = db.collection('settings').doc('site');
  const settingsDoc = await settingsRef.get();
  if (!settingsDoc.exists) {
    await settingsRef.set({
      siteName: 'Gujarat Estate Agency',
      siteDescription: 'Premium Real Estate Services in Gujarat',
      contactEmail: 'info@gujaratestate.com',
      contactPhone: '+91 98765 43210',
      address: 'Ahmedabad, Gujarat, India',
      socialMedia: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      businessHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      },
      notifications: {
        newInquiries: true,
        newUsers: true,
        propertyStatusChanges: false,
        emailNotifications: true,
        smsNotifications: false
      }
    });
  }
  return settingsDoc.exists ? settingsDoc.data() : (await settingsRef.get()).data();
};

/**
 * @route GET /api/admin/settings
 * @desc Get site settings
 * @access Private (Admin only)
 */
router.get('/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await initializeSiteSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('❌ Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/admin/settings
 * @desc Update site settings
 * @access Private (Admin only)
 */
router.put('/settings',
  authenticateAdmin,
  validateRequest(Joi.object({
    siteName: Joi.string().min(2).max(100).required(),
    siteDescription: Joi.string().max(500).required(),
    contactEmail: Joi.string().email().required(),
    contactPhone: Joi.string().required(),
    address: Joi.string().required(),
    socialMedia: Joi.object({
      facebook: Joi.string().uri().allow('').optional(),
      twitter: Joi.string().uri().allow('').optional(),
      instagram: Joi.string().uri().allow('').optional(),
      linkedin: Joi.string().uri().allow('').optional()
    }).optional(),
    businessHours: Joi.object({
      monday: Joi.string().optional(),
      tuesday: Joi.string().optional(),
      wednesday: Joi.string().optional(),
      thursday: Joi.string().optional(),
      friday: Joi.string().optional(),
      saturday: Joi.string().optional(),
      sunday: Joi.string().optional()
    }).optional(),
    notifications: Joi.object({
      newInquiries: Joi.boolean().optional(),
      newUsers: Joi.boolean().optional(),
      propertyStatusChanges: Joi.boolean().optional(),
      emailNotifications: Joi.boolean().optional(),
      smsNotifications: Joi.boolean().optional()
    }).optional()
  })),
  async (req, res) => {
    try {
      const settingsRef = db.collection('settings').doc('site');
      await settingsRef.set(req.body, { merge: true });
      const updatedSettings = (await settingsRef.get()).data();

      console.log(`⚙️ Site settings updated by admin`);

      res.json({
        success: true,
        data: updatedSettings,
        message: 'Site settings updated successfully'
      });

    } catch (error) {
      console.error('❌ Site settings update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update site settings',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route PUT /api/admin/settings/notifications
 * @desc Update notification preferences
 * @access Private (Admin only)
 */
router.put('/settings/notifications',
  authenticateAdmin,
  validateRequest(Joi.object({
    newInquiries: Joi.boolean().required(),
    newUsers: Joi.boolean().required(),
    propertyStatusChanges: Joi.boolean().required(),
    emailNotifications: Joi.boolean().required(),
    smsNotifications: Joi.boolean().required()
  })),
  async (req, res) => {
    try {
      const settingsRef = db.collection('settings').doc('site');
      await settingsRef.update({ notifications: req.body });
      const updatedSettings = (await settingsRef.get()).data();

      console.log(`🔔 Notification settings updated by admin`);

      res.json({
        success: true,
        data: updatedSettings.notifications,
        message: 'Notification preferences updated successfully'
      });

    } catch (error) {
      console.error('❌ Notification settings update error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update notification settings',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/admin/reviews
 * @desc Get all reviews (pending, approved, rejected)
 * @access Private (Admin only)
 */
router.get('/reviews', authenticateAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = db.collection('reviews');

    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const reviewsSnapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .get();

    const reviews = [];
    reviewsSnapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });

    const pendingCount = await db.collection('reviews').where('status', '==', 'pending').get();
    const approvedCount = await db.collection('reviews').where('status', '==', 'approved').get();
    const rejectedCount = await db.collection('reviews').where('status', '==', 'rejected').get();

    console.log(`📋 Retrieved ${reviews.length} reviews for admin`);

    res.json({
      success: true,
      data: {
        reviews,
        counts: {
          pending: pendingCount.size,
          approved: approvedCount.size,
          rejected: rejectedCount.size,
          total: pendingCount.size + approvedCount.size + rejectedCount.size
        }
      }
    });

  } catch (error) {
    console.error('❌ Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/admin/reviews/:reviewId/approve
 * @desc Approve a review
 * @access Private (Admin only)
 */
router.put('/reviews/:reviewId/approve', authenticateAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    await db.collection('reviews').doc(reviewId).update({
      status: 'approved',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Review approved: ${reviewId}`);

    res.json({
      success: true,
      message: 'Review approved successfully'
    });

  } catch (error) {
    console.error('❌ Error approving review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve review',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/admin/reviews/:reviewId/reject
 * @desc Reject a review
 * @access Private (Admin only)
 */
router.put('/reviews/:reviewId/reject',
  authenticateAdmin,
  validateRequest(Joi.object({
    reason: Joi.string().max(500).optional()
  })),
  async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { reason } = req.body;

      const reviewDoc = await db.collection('reviews').doc(reviewId).get();
      if (!reviewDoc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Review not found'
        });
      }

      const updateData = {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (reason) {
        updateData.rejectionReason = reason;
      }

      await db.collection('reviews').doc(reviewId).update(updateData);

      console.log(`❌ Review rejected: ${reviewId}`);

      res.json({
        success: true,
        message: 'Review rejected successfully'
      });

    } catch (error) {
      console.error('❌ Error rejecting review:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject review',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route DELETE /api/admin/reviews/:reviewId
 * @desc Delete a review
 * @access Private (Admin only)
 */
router.delete('/reviews/:reviewId', authenticateAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    await db.collection('reviews').doc(reviewId).delete();

    console.log(`🗑️ Review deleted by admin: ${reviewId}`);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;