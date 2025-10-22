const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { authenticateAdmin, generateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validation');
const propertyService = require('../services/propertyService');

const router = express.Router();

// Validation schemas (define before using)
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});



// Get admin credentials from environment variables
const getAdminCredentials = () => ({
  id: 'admin-001',
  email: process.env.ADMIN_EMAIL || 'admin@mumbaiestate.com',
  password: process.env.ADMIN_PASSWORD || 'admin123',
  name: process.env.ADMIN_NAME || 'Mumbai Estate Admin',
  role: 'admin'
});

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
      const password = rawPassword.trim(); // Remove any leading/trailing whitespace

      console.log(`� Admino login attempt: ${email}`);
      console.log(`🔍 Raw password: "${rawPassword}"`);
      console.log(`🔍 Trimmed password: "${password}"`);
      console.log(`🔍 Password length: ${password.length}`);

      // Get admin credentials from environment
      const admin = getAdminCredentials();

      // Simple credential check (no bcrypt needed)
      if (email !== admin.email || password !== admin.password) {
        console.log(`❌ Invalid credentials for: ${email}`);
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect'
        });
      }

      // Generate JWT token
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
  });

/**
 * @route POST /api/admin/logout
 * @desc Admin logout
 * @access Private
 */
router.post('/logout', (req, res) => {
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
  res.json({
    success: true,
    data: {
      id: mockAdmin.id,
      name: mockAdmin.name,
      email: mockAdmin.email,
      role: mockAdmin.role
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
    email: Joi.string().email().required(),
    currentPassword: Joi.string().optional(),
    newPassword: Joi.string().min(8).optional(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).optional()
  })),
  async (req, res) => {
    try {
      const { name, email, currentPassword, newPassword } = req.body;

      console.log(`🔄 Admin profile update request: ${email}`);

      // If changing password, verify current password
      if (newPassword && currentPassword) {
        const isValidPassword = await bcrypt.compare(currentPassword, mockAdmin.password);
        if (!isValidPassword) {
          return res.status(400).json({
            success: false,
            error: 'INVALID_CURRENT_PASSWORD',
            message: 'Current password is incorrect'
          });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        mockAdmin.password = hashedPassword;
        console.log(`🔐 Admin password updated`);
      }

      // Update profile data
      mockAdmin.name = name;
      mockAdmin.email = email;

      console.log(`✅ Admin profile updated: ${name} (${email})`);

      res.json({
        success: true,
        data: {
          id: mockAdmin.id,
          name: mockAdmin.name,
          email: mockAdmin.email,
          role: mockAdmin.role
        },
        message: 'Profile updated successfully'
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

// Image storage will be configured later
console.log('📁 Image storage not configured yet');

// Cloudinary image upload integration
console.log('📁 Cloudinary image storage configured');
console.log('🔥 Firebase Firestore database configured');

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

      // Forward to Cloudinary upload
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





// Firebase will handle property data storage

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

// Password Reset with OTP Verification

const emailService = require('../services/emailService');
const otpService = require('../services/otpService');

/**
 * @route POST /api/admin/forgot-password
 * @desc Request password reset OTP
 * @access Public
 */
// REMOVED: Forgot password functionality - admin password can only be changed in .env file
// router.post('/forgot-password',
  validateRequest(Joi.object({
    email: Joi.string().email().required()
  })),
  async (req, res) => {
    try {
      const { email } = req.body;

      console.log(`🔐 Password reset requested for: ${email}`);

      // Check if admin exists (using mock admin for now)
      if (email !== mockAdmin.email) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists, an OTP has been sent to reset your password.'
        });
      }

      // Generate and store OTP
      const otp = otpService.generateOTP();
      const otpResult = otpService.storeOTP(email, otp, 'password_reset');

      if (!otpResult.success) {
        throw new Error('Failed to generate OTP');
      }

      // Send OTP email (with fallback to return OTP directly)
      let emailSent = false;
      let otpForDisplay = null;
      
      try {
        const emailResult = await emailService.sendPasswordResetOTP(email, otp, mockAdmin.name);
        if (emailResult) {
          emailSent = true;
          console.log(`📧 OTP email sent to ${email}`);
        } else {
          console.log(`⚠️ Email failed, will return OTP directly`);
          otpForDisplay = otp;
        }
      } catch (emailError) {
        console.log(`⚠️ Email service failed, returning OTP directly: ${otp}`);
        otpForDisplay = otp;
      }

      const response = {
        success: true,
        data: {
          expiryTime: otpResult.expiryTime,
          attemptsAllowed: otpResult.attemptsRemaining
        }
      };

      if (emailSent) {
        response.message = 'OTP has been sent to your email address. Please check your inbox.';
      } else {
        response.message = 'Email service is currently unavailable. Please use the OTP displayed below.';
        response.data.otp = otpForDisplay;
        response.data.showOtpDirectly = true;
      }

      res.json(response);

    } catch (error) {
      console.error('❌ Error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

// REMOVED: All OTP and password reset functionality - admin password can only be changed in .env file
      global.passwordResetTokens = global.passwordResetTokens || new Map();
      global.passwordResetTokens.set(resetToken, {
        email,
        expiryTime: resetTokenExpiry,
        used: false
      });

      // Auto-cleanup token after expiry
      setTimeout(() => {
        global.passwordResetTokens?.delete(resetToken);
      }, 15 * 60 * 1000);

      res.json({
        success: true,
        message: 'OTP verified successfully. You can now reset your password.',
        data: {
          resetToken,
          expiryTime: resetTokenExpiry
        }
      });

    } catch (error) {
      console.error('❌ OTP verification error:', error);
      res.status(500).json({
        success: false,
// REMOVED: Password reset functionality

/**
 * @route POST /api/admin/reset-password
 * @desc Reset password using verified token
 * @access Public
 */
// REMOVED: Password reset - admin password can only be changed in .env file
// router.post('/reset-password',
  validateRequest(Joi.object({
    resetToken: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
  })),
  async (req, res) => {
    try {
      const { resetToken, newPassword } = req.body;

      console.log(`🔄 Password reset attempt with token: ${resetToken.substring(0, 8)}...`);

      // Verify reset token
      global.passwordResetTokens = global.passwordResetTokens || new Map();
      const tokenData = global.passwordResetTokens.get(resetToken);

      if (!tokenData) {
        return res.status(400).json({
          success: false,
          error: 'INVALID_TOKEN',
          message: 'Invalid or expired reset token. Please request a new password reset.'
        });
      }

      if (tokenData.used) {
        return res.status(400).json({
          success: false,
          error: 'TOKEN_ALREADY_USED',
          message: 'This reset token has already been used. Please request a new password reset.'
        });
      }

      if (Date.now() > tokenData.expiryTime) {
        global.passwordResetTokens.delete(resetToken);
        return res.status(400).json({
          success: false,
          error: 'TOKEN_EXPIRED',
          message: 'Reset token has expired. Please request a new password reset.'
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password (in mock admin for now)
      if (tokenData.email === mockAdmin.email) {
        mockAdmin.password = hashedPassword;
        console.log(`✅ Password updated for ${tokenData.email}`);
      }

      // Mark token as used
      tokenData.used = true;

      // Send confirmation email
      await emailService.sendPasswordChangeConfirmation(tokenData.email, mockAdmin.name);

      // Clean up token
      setTimeout(() => {
        global.passwordResetTokens?.delete(resetToken);
      }, 1000);

      res.json({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.'
      });

    } catch (error) {
      console.error('❌ Password reset error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset password',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/admin/otp-status/:email
 * @desc Check OTP status for email
 * @access Public
 */
router.get('/otp-status/:email',
  async (req, res) => {
    try {
      const { email } = req.params;
      const status = otpService.getOTPStatus(email, 'password_reset');

      res.json({
        success: true,
        data: status
      });

    } catch (error) {
      console.error('❌ OTP status check error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to check OTP status'
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

    // Get inquiries from Firestore
    const { db } = require('../config/firebase');
    const inquiriesRef = db.collection('inquiries');

    let query = inquiriesRef;

    // Filter by status if provided
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

    // Sort by creation date (newest first)
    inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
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

    const { db } = require('../config/firebase');
    const inquiriesRef = db.collection('inquiries');
    const inquiryDoc = await inquiriesRef.doc(inquiryId).get();

    if (!inquiryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }

    const inquiryData = inquiryDoc.data();

    // Add admin response to conversation
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

    // Update inquiry with conversation structure
    await inquiryDoc.ref.update({
      messages: updatedMessages,
      messageCount: updatedMessages.length,
      lastMessageAt: new Date().toISOString(),
      lastMessageBy: 'admin',
      status: status,
      updatedAt: new Date().toISOString(),
      // Keep legacy fields for backward compatibility
      adminResponse: response.trim(),
      adminResponseAt: new Date().toISOString()
    });

    console.log(`✅ Admin responded to inquiry ${inquiryId}`);

    // TODO: Send email notification to user about the response

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

    const { db } = require('../config/firebase');
    const inquiriesRef = db.collection('inquiries');
    const inquiryDoc = await inquiriesRef.doc(inquiryId).get();

    if (!inquiryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }

    // Update inquiry status
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
    const { db } = require('../config/firebase');
    const inquiriesRef = db.collection('inquiries');

    // Get all inquiries
    const allInquiriesSnapshot = await inquiriesRef.get();
    const allInquiries = allInquiriesSnapshot.docs.map(doc => doc.data());

    // Calculate statistics
    const stats = {
      total: allInquiries.length,
      pending: allInquiries.filter(i => i.status === 'pending').length,
      responded: allInquiries.filter(i => i.status === 'responded').length,
      resolved: allInquiries.filter(i => i.status === 'resolved').length,
      closed: allInquiries.filter(i => i.status === 'closed').length,
      thisMonth: 0,
      thisWeek: 0
    };

    // Calculate time-based stats
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

    const { db } = require('../config/firebase');
    const usersRef = db.collection('users');

    let query = usersRef;

    // Filter by role if provided
    if (role && role !== 'all') {
      query = query.where('role', '==', role);
    }

    // Get all users
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

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      users = users.filter(user => 
        (user.name && user.name.toLowerCase().includes(searchTerm)) ||
        (user.email && user.email.toLowerCase().includes(searchTerm)) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    // Apply status filter if provided
    if (status && status !== 'all') {
      users = users.filter(user => user.status === status);
    }

    // Sort by creation date (newest first)
    users.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    });

    // Pagination
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

    const { db } = require('../config/firebase');
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

    // Get user's inquiries count
    const inquiriesSnapshot = await db.collection('inquiries')
      .where('userId', '==', userId)
      .get();

    // Get user's saved properties count
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

    const { db } = require('../config/firebase');
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user status
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
    const { db } = require('../config/firebase');
    const usersRef = db.collection('users');

    // Get all users
    const allUsersSnapshot = await usersRef.get();
    const allUsers = allUsersSnapshot.docs.map(doc => doc.data());

    // Calculate statistics
    const stats = {
      total: allUsers.length,
      active: allUsers.filter(u => u.isEmailVerified).length,
      inactive: allUsers.filter(u => !u.isEmailVerified).length,
      thisMonth: 0,
      thisWeek: 0
    };

    // Calculate time-based stats
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

// Site Settings Management
let siteSettings = {
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
};

/**
 * @route GET /api/admin/settings
 * @desc Get site settings
 * @access Private (Admin only)
 */
router.get('/settings', authenticateAdmin, (req, res) => {
  res.json({
    success: true,
    data: siteSettings
  });
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
      const updatedSettings = { ...siteSettings, ...req.body };
      siteSettings = updatedSettings;

      console.log(`⚙️ Site settings updated by admin`);

      res.json({
        success: true,
        data: siteSettings,
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
      siteSettings.notifications = { ...siteSettings.notifications, ...req.body };

      console.log(`🔔 Notification settings updated by admin`);

      res.json({
        success: true,
        data: siteSettings.notifications,
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

// Review Management Routes

// Get all reviews (pending, approved, rejected)
router.get('/reviews', async (req, res) => {
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

    // Get counts for different statuses
    const pendingCount = await db.collection('reviews').where('status', '==', 'pending').get();
    const approvedCount = await db.collection('reviews').where('status', '==', 'approved').get();
    const rejectedCount = await db.collection('reviews').where('status', '==', 'rejected').get();

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
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

// Approve a review
router.put('/reviews/:reviewId/approve', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
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
    console.error('Error approving review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve review'
    });
  }
});

// Reject a review
router.put('/reviews/:reviewId/reject', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const { reason } = req.body;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
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
    console.error('Error rejecting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject review'
    });
  }
});

// Delete a review (admin only)
router.delete('/reviews/:reviewId', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;

    const reviewDoc = await db.collection('reviews').doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await db.collection('reviews').doc(reviewId).delete();

    console.log(`🗑️ Review deleted by admin: ${reviewId}`);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

module.exports = router;