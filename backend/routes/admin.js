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



// Mock admin user (same as in auth.js)
const mockAdmin = {
  id: 1,
  email: 'admin@gujaratestate.com',
  password: '$2a$10$UTQWwQ7HaF9/9.d99mE6Wu2Sp7nw4yH9xy/ZM.37Qzck/mRSX7mzy', // password: 'admin123'
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
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
      const password = rawPassword.trim(); // Remove any leading/trailing whitespace

      console.log(`� Admino login attempt: ${email}`);
      console.log(`🔍 Raw password: "${rawPassword}"`);
      console.log(`🔍 Trimmed password: "${password}"`);
      console.log(`🔍 Password length: ${password.length}`);

      // Check if admin exists
      if (email !== mockAdmin.email) {
        console.log(`❌ Email mismatch`);
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
      role: mockAdmin.role,
      avatar: mockAdmin.avatar
    }
  });
});

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







module.exports = router;