const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const { db } = require('../config/firebase');
const emailService = require('../services/emailService');
const otpService = require('../services/otpService');

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).optional().allow('')
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role || 'user',
      verified: user.verified || false
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('📝 Registration request body:', req.body);
    }

    // Validate input
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ Validation error:', error.details[0].message);
      }
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { firstName, lastName, email, password, phone } = value;
    // confirmPassword is validated but not stored

    // Check if user already exists
    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('email', '==', email).get();

    if (!existingUser.empty) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP for email verification
    const otp = otpService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user document
    const userData = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone: phone || null,
      role: 'user',
      verified: false,
      emailVerificationOtp: otp,
      emailVerificationExpiry: otpExpiry.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      profile: {
        avatar: null,
        preferences: {
          notifications: true,
          newsletter: true
        }
      }
    };

    const userDoc = await usersRef.add(userData);
    console.log(`👤 User registered: ${email} (ID: ${userDoc.id})`);

    // Send verification email
    try {
      await emailService.sendEmailVerificationOTP(email, otp, firstName);
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 Verification email sent to: ${email}`);
      }
    } catch (emailError) {
      console.error('❌ Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      data: {
        userId: userDoc.id,
        email,
        verified: false
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email with OTP
 * @access Public
 */
router.post('/verify-email', async (req, res) => {
  try {
    // Validate input
    const { error, value } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { email, otp } = value;

    // Find user
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();

    if (userQuery.empty) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check if already verified
    if (userData.verified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      });
    }

    // Verify OTP
    if (userData.emailVerificationOtp !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid verification code'
      });
    }

    // Check if OTP expired
    if (new Date() > new Date(userData.emailVerificationExpiry)) {
      return res.status(400).json({
        success: false,
        error: 'Verification code expired'
      });
    }

    // Update user as verified
    await userDoc.ref.update({
      verified: true,
      emailVerificationOtp: null,
      emailVerificationExpiry: null,
      updatedAt: new Date().toISOString()
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Email verified for user: ${email}`);
    }

    res.json({
      success: true,
      message: 'Email verified successfully. You can now sign in with your credentials.',
      data: {
        email: userData.email,
        verified: true
      }
    });

  } catch (error) {
    console.error('❌ Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Email verification failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend email verification OTP
 * @access Public
 */
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }

    // Find user
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();

    if (userQuery.empty) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check if already verified
    if (userData.verified) {
      return res.status(400).json({
        success: false,
        error: 'Email already verified'
      });
    }

    // Generate new OTP
    const otp = otpService.generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new OTP
    await userDoc.ref.update({
      emailVerificationOtp: otp,
      emailVerificationExpiry: otpExpiry.toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Send verification email
    try {
      await emailService.sendEmailVerificationOTP(email, otp, userData.firstName);
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 Verification email resent to: ${email}`);
      }
    } catch (emailError) {
      console.error('❌ Failed to resend verification email:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send verification email'
      });
    }

    res.json({
      success: true,
      message: 'Verification code sent to your email'
    });

  } catch (error) {
    console.error('❌ Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend verification code',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { email, password } = value;

    // Find user
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();

    if (userQuery.empty) {
      return res.status(404).json({
        success: false,
        error: 'No account found with this email address. Please sign up first.',
        errorType: 'ACCOUNT_NOT_FOUND'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userData.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please try again.',
        errorType: 'INVALID_PASSWORD'
      });
    }

    // Update last login
    await userDoc.ref.update({
      lastLogin: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`👤 User login: ${email}`);
    }

    // Generate JWT token
    const token = generateToken({
      id: userDoc.id,
      email: userData.email,
      role: userData.role,
      verified: userData.verified
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userDoc.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          verified: userData.verified,
          role: userData.role,
          phone: userData.phone,
          profile: userData.profile
        }
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Send password reset OTP
 * @access Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    // Validate input
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { email } = value;

    // Find user
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();

    if (userQuery.empty) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset code.'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Generate OTP and reset token
    const otp = otpService.generateOTP();
    const resetToken = otpService.generateResetToken();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Store OTP and reset token
    await userDoc.ref.update({
      passwordResetOtp: otp,
      passwordResetToken: resetToken,
      passwordResetExpiry: otpExpiry.toISOString(),
      resetTokenExpiry: tokenExpiry.toISOString(),
      updatedAt: new Date().toISOString()
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 Password reset requested for: ${email}`);
    }

    // Send OTP email
    try {
      await emailService.sendPasswordResetOTP(email, otp, userData.firstName);
      if (process.env.NODE_ENV === 'development') {
        console.log(`📧 Password reset OTP sent to: ${email}`);
      }
    } catch (emailError) {
      console.error('❌ Failed to send password reset email:', emailError);
      // Continue without revealing email sending failure
    }

    res.json({
      success: true,
      message: 'Password reset code sent to your email'
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process password reset request',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/verify-reset-otp
 * @desc Verify password reset OTP
 * @access Public
 */
router.post('/verify-reset-otp', async (req, res) => {
  try {
    // Validate input
    const { error, value } = verifyOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { email, otp } = value;

    // Find user
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('email', '==', email).get();

    if (userQuery.empty) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Verify OTP
    if (userData.passwordResetOtp !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid reset code'
      });
    }

    // Check if OTP expired
    if (new Date() > new Date(userData.passwordResetExpiry)) {
      return res.status(400).json({
        success: false,
        error: 'Reset code expired'
      });
    }

    console.log(`✅ Password reset OTP verified for: ${email}`);

    res.json({
      success: true,
      message: 'Reset code verified successfully',
      data: {
        resetToken: userData.passwordResetToken
      }
    });

  } catch (error) {
    console.error('❌ Verify reset OTP error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify reset code',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/verify-token
 * @desc Verify JWT token validity
 * @access Private
 */
router.get('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const usersRef = db.collection('users');
    const userDoc = await usersRef.doc(decoded.id).get();

    if (!userDoc.exists) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        userId: decoded.id,
        email: decoded.email,
        verified: decoded.verified
      }
    });

  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

/**
 * @route GET /api/auth/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user data
    const usersRef = db.collection('users');
    const userDoc = await usersRef.doc(decoded.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = userDoc.data();

    res.json({
      success: true,
      data: {
        user: {
          id: userDoc.id,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phone: userData.phone,
          verified: userData.verified,
          role: userData.role,
          profile: userData.profile,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password with token
 * @access Public
 */
router.post('/reset-password', async (req, res) => {
  try {
    // Validate input
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { resetToken, newPassword } = value;

    // Find user by reset token
    const usersRef = db.collection('users');
    const userQuery = await usersRef.where('passwordResetToken', '==', resetToken).get();

    if (userQuery.empty) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }

    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Check if token expired
    if (new Date() > new Date(userData.resetTokenExpiry)) {
      return res.status(400).json({
        success: false,
        error: 'Reset token expired'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and clear reset tokens
    await userDoc.ref.update({
      password: hashedPassword,
      passwordResetOtp: null,
      passwordResetToken: null,
      passwordResetExpiry: null,
      resetTokenExpiry: null,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Password reset completed for: ${userData.email}`);

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(userData.email, userData.firstName);
    } catch (emailError) {
      console.error('❌ Failed to send password change confirmation:', emailError);
    }

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset password',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validation schema for profile update
    const updateProfileSchema = Joi.object({
      firstName: Joi.string().min(2).max(50).optional(),
      lastName: Joi.string().min(2).max(50).optional(),
      phone: Joi.string().pattern(/^[+]?[0-9]{10,15}$/).optional().allow(''),
      profile: Joi.object({
        avatar: Joi.string().uri().optional().allow(''),
        bio: Joi.string().max(500).optional().allow(''),
        location: Joi.string().max(100).optional().allow(''),
        preferences: Joi.object({
          notifications: Joi.boolean().optional(),
          newsletter: Joi.boolean().optional(),
          emailAlerts: Joi.boolean().optional()
        }).optional()
      }).optional()
    });

    // Validate input
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    // Get user document
    const usersRef = db.collection('users');
    const userDoc = await usersRef.doc(decoded.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const currentData = userDoc.data();

    // Prepare update data
    const updateData = {
      ...value,
      updatedAt: new Date().toISOString()
    };

    // Merge profile data if provided
    if (value.profile) {
      updateData.profile = {
        ...currentData.profile,
        ...value.profile
      };
      
      // Merge preferences if provided
      if (value.profile.preferences) {
        updateData.profile.preferences = {
          ...currentData.profile?.preferences,
          ...value.profile.preferences
        };
      }
    }

    // Update user document
    await userDoc.ref.update(updateData);

    // Get updated user data
    const updatedDoc = await userDoc.ref.get();
    const updatedData = updatedDoc.data();

    console.log(`✅ Profile updated for user: ${updatedData.email}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedDoc.id,
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          email: updatedData.email,
          phone: updatedData.phone,
          verified: updatedData.verified,
          role: updatedData.role,
          profile: updatedData.profile,
          createdAt: updatedData.createdAt,
          lastLogin: updatedData.lastLogin
        }
      }
    });

  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validation schema for password change
    const changePasswordSchema = Joi.object({
      currentPassword: Joi.string().required(),
      newPassword: Joi.string().min(6).required(),
      confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match'
      })
    });

    // Validate input
    const { error, value } = changePasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { currentPassword, newPassword } = value;

    // Get user document
    const usersRef = db.collection('users');
    const userDoc = await usersRef.doc(decoded.id).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = userDoc.data();

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, userData.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await userDoc.ref.update({
      password: hashedPassword,
      updatedAt: new Date().toISOString()
    });

    console.log(`✅ Password changed for user: ${userData.email}`);

    // Send confirmation email
    try {
      await emailService.sendPasswordChangeConfirmation(userData.email, userData.firstName);
    } catch (emailError) {
      console.error('❌ Failed to send password change confirmation:', emailError);
    }

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('❌ Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/statistics
 * @desc Get user statistics (saved properties, inquiries)
 * @access Private
 */
router.get('/statistics', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get saved properties count (only valid ones) and clean up invalid ones
    const savedPropertiesRef = db.collection('savedProperties');
    const savedPropertiesQuery = await savedPropertiesRef.where('userId', '==', decoded.id).get();
    
    let totalSaved = 0;
    const invalidDocs = [];
    
    for (const doc of savedPropertiesQuery.docs) {
      const savedData = doc.data();
      // Only count valid saved properties
      if (savedData.propertyId && typeof savedData.propertyId === 'string' && savedData.propertyId.trim() !== '') {
        totalSaved++;
      } else {
        // Mark invalid docs for cleanup
        invalidDocs.push(doc);
      }
    }
    
    // Clean up invalid saved properties if any found
    if (invalidDocs.length > 0) {
      console.log(`🧹 Cleaning up ${invalidDocs.length} invalid saved properties for user ${decoded.id}`);
      const batch = db.batch();
      invalidDocs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
    }

    // Get inquiries count
    const inquiriesRef = db.collection('inquiries');
    const inquiriesQuery = await inquiriesRef.where('userId', '==', decoded.id).get();
    const totalInquiries = inquiriesQuery.size;

    console.log(`📊 Statistics for user ${decoded.id}: ${totalSaved} saved, ${totalInquiries} inquiries`);

    res.json({
      success: true,
      data: {
        totalSaved,
        totalInquiries
      }
    });

  } catch (error) {
    console.error('❌ Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get statistics',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/save-property
 * @desc Save a property for user
 * @access Private
 */
router.post('/save-property', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { propertyId } = req.body;

    if (!propertyId || typeof propertyId !== 'string' || propertyId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Valid Property ID is required'
      });
    }

    // Trim the propertyId to ensure no whitespace issues
    const cleanPropertyId = propertyId.trim();

    // Check if already saved
    const savedPropertiesRef = db.collection('savedProperties');
    const existingQuery = await savedPropertiesRef
      .where('userId', '==', decoded.id)
      .where('propertyId', '==', cleanPropertyId)
      .get();

    if (!existingQuery.empty) {
      return res.status(400).json({
        success: false,
        error: 'Property already saved'
      });
    }

    // Verify that the property exists before saving
    const propertiesRef = db.collection('properties');
    const propertyDoc = await propertiesRef.doc(cleanPropertyId).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    // Save property
    const savedPropertyData = {
      userId: decoded.id,
      propertyId: cleanPropertyId,
      savedAt: new Date().toISOString()
    };

    await savedPropertiesRef.add(savedPropertyData);

    console.log(`💾 Property ${cleanPropertyId} saved by user ${decoded.id}`);

    res.json({
      success: true,
      message: 'Property saved successfully'
    });

  } catch (error) {
    console.error('❌ Save property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save property',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route DELETE /api/auth/unsave-property/:propertyId
 * @desc Remove a saved property
 * @access Private
 */
router.delete('/unsave-property/:propertyId', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { propertyId } = req.params;

    if (!propertyId || propertyId.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Valid Property ID is required'
      });
    }

    const cleanPropertyId = propertyId.trim();

    // Find and delete saved property
    const savedPropertiesRef = db.collection('savedProperties');
    const query = await savedPropertiesRef
      .where('userId', '==', decoded.id)
      .where('propertyId', '==', cleanPropertyId)
      .get();

    if (query.empty) {
      return res.status(404).json({
        success: false,
        error: 'Saved property not found'
      });
    }

    // Delete the saved property record
    await query.docs[0].ref.delete();

    console.log(`🗑️ Property ${cleanPropertyId} unsaved by user ${decoded.id}`);

    res.json({
      success: true,
      message: 'Property removed from saved list'
    });

  } catch (error) {
    console.error('❌ Unsave property error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to unsave property',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/saved-properties
 * @desc Get user's saved properties
 * @access Private
 */
router.get('/saved-properties', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get saved properties (without orderBy to avoid composite index requirement)
    const savedPropertiesRef = db.collection('savedProperties');
    const savedQuery = await savedPropertiesRef
      .where('userId', '==', decoded.id)
      .get();

    const savedProperties = [];
    for (const doc of savedQuery.docs) {
      const savedData = doc.data();
      
      // Skip if propertyId is missing, empty, or not a string
      if (!savedData.propertyId || typeof savedData.propertyId !== 'string' || savedData.propertyId.trim() === '') {
        console.warn(`⚠️ Skipping saved property with invalid propertyId: ${doc.id}`, savedData.propertyId);
        continue;
      }
      
      try {
        // Get property details
        const propertiesRef = db.collection('properties');
        const propertyDoc = await propertiesRef.doc(savedData.propertyId).get();
        
        if (propertyDoc.exists) {
          savedProperties.push({
            id: doc.id,
            propertyId: savedData.propertyId,
            savedAt: savedData.savedAt,
            property: {
              id: propertyDoc.id,
              ...propertyDoc.data()
            }
          });
        } else {
          console.warn(`⚠️ Property not found for saved property: ${savedData.propertyId}`);
        }
      } catch (propertyError) {
        console.error(`❌ Error fetching property ${savedData.propertyId}:`, propertyError);
      }
    }

    // Sort by savedAt in JavaScript (client-side sorting)
    savedProperties.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));

    res.json({
      success: true,
      data: {
        savedProperties
      }
    });

  } catch (error) {
    console.error('❌ Get saved properties error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get saved properties',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/is-property-saved/:propertyId
 * @desc Check if a property is saved by user
 * @access Private
 */
router.get('/is-property-saved/:propertyId', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { propertyId } = req.params;

    // Check if property is saved
    const savedPropertiesRef = db.collection('savedProperties');
    const query = await savedPropertiesRef
      .where('userId', '==', decoded.id)
      .where('propertyId', '==', propertyId)
      .get();

    const isSaved = !query.empty;

    res.json({
      success: true,
      data: {
        isSaved
      }
    });

  } catch (error) {
    console.error('❌ Check property saved error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check if property is saved',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/create-inquiry
 * @desc Create a new inquiry
 * @access Private
 */
router.post('/create-inquiry', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validation schema for inquiry
    const inquirySchema = Joi.object({
      propertyId: Joi.string().required(),
      message: Joi.string().min(10).max(1000).required(),
      inquiryType: Joi.string().valid('general', 'viewing', 'pricing', 'availability').default('general'),
      contactPreference: Joi.string().valid('email', 'phone', 'both').default('both')
    });

    // Validate input
    const { error, value } = inquirySchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details[0].message
      });
    }

    const { propertyId, message, inquiryType, contactPreference } = value;

    // Get user data
    const usersRef = db.collection('users');
    const userDoc = await usersRef.doc(decoded.id).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const userData = userDoc.data();

    // Get property data
    const propertiesRef = db.collection('properties');
    const propertyDoc = await propertiesRef.doc(propertyId).get();
    
    if (!propertyDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    const propertyData = propertyDoc.data();

    // Create inquiry with conversation structure
    const inquiryData = {
      userId: decoded.id,
      propertyId,
      userEmail: userData.email,
      userName: `${userData.firstName} ${userData.lastName}`,
      userPhone: userData.phone || null,
      propertyTitle: propertyData.title,
      propertyLocation: propertyData.location,
      propertyPrice: propertyData.price,
      inquiryType,
      contactPreference,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Conversation thread structure
      messages: [
        {
          id: 1,
          sender: 'user',
          senderName: `${userData.firstName} ${userData.lastName}`,
          message: message,
          timestamp: new Date().toISOString(),
          isRead: false
        }
      ],
      messageCount: 1,
      lastMessageAt: new Date().toISOString(),
      lastMessageBy: 'user'
    };

    const inquiriesRef = db.collection('inquiries');
    const inquiryDoc = await inquiriesRef.add(inquiryData);

    console.log(`📧 New inquiry created: ${inquiryDoc.id} for property ${propertyId}`);

    res.json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: {
        inquiryId: inquiryDoc.id,
        status: 'pending'
      }
    });

  } catch (error) {
    console.error('❌ Create inquiry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create inquiry',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/auth/my-inquiries
 * @desc Get user's inquiries
 * @access Private
 */
router.get('/my-inquiries', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user's inquiries
    const inquiriesRef = db.collection('inquiries');
    const inquiriesQuery = await inquiriesRef
      .where('userId', '==', decoded.id)
      .get();

    const inquiries = [];
    inquiriesQuery.docs.forEach(doc => {
      inquiries.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Sort by creation date (newest first)
    inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: {
        inquiries
      }
    });

  } catch (error) {
    console.error('❌ Get user inquiries error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get inquiries',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/reply-to-inquiry/:inquiryId
 * @desc Reply to an inquiry (user response to admin)
 * @access Private
 */
router.post('/reply-to-inquiry/:inquiryId', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { inquiryId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Get inquiry
    const inquiriesRef = db.collection('inquiries');
    const inquiryDoc = await inquiriesRef.doc(inquiryId).get();

    if (!inquiryDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Inquiry not found'
      });
    }

    const inquiryData = inquiryDoc.data();

    // Verify user owns this inquiry
    if (inquiryData.userId !== decoded.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Get user data for sender name
    const usersRef = db.collection('users');
    const userDoc = await usersRef.doc(decoded.id).get();
    const userData = userDoc.data();

    // Add new message to conversation
    const currentMessages = inquiryData.messages || [];
    const newMessageId = currentMessages.length + 1;
    
    const newMessage = {
      id: newMessageId,
      sender: 'user',
      senderName: `${userData.firstName} ${userData.lastName}`,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = [...currentMessages, newMessage];

    // Update inquiry
    await inquiryDoc.ref.update({
      messages: updatedMessages,
      messageCount: updatedMessages.length,
      lastMessageAt: new Date().toISOString(),
      lastMessageBy: 'user',
      status: 'user-replied',
      updatedAt: new Date().toISOString()
    });

    console.log(`💬 User replied to inquiry ${inquiryId}`);

    res.json({
      success: true,
      message: 'Reply sent successfully',
      data: {
        inquiryId,
        messageId: newMessageId
      }
    });

  } catch (error) {
    console.error('❌ Reply to inquiry error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send reply',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/cleanup-saved-properties
 * @desc Clean up invalid saved properties
 * @access Private
 */
router.post('/cleanup-saved-properties', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get all saved properties for this user
    const savedPropertiesRef = db.collection('savedProperties');
    const savedQuery = await savedPropertiesRef
      .where('userId', '==', decoded.id)
      .get();

    let cleanedCount = 0;
    const batch = db.batch();

    for (const doc of savedQuery.docs) {
      const savedData = doc.data();
      
      // Check if propertyId is invalid
      if (!savedData.propertyId || typeof savedData.propertyId !== 'string' || savedData.propertyId.trim() === '') {
        console.log(`🧹 Cleaning up invalid saved property: ${doc.id}`);
        batch.delete(doc.ref);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      await batch.commit();
      console.log(`✅ Cleaned up ${cleanedCount} invalid saved properties for user ${decoded.id}`);
    }

    res.json({
      success: true,
      message: `Cleaned up ${cleanedCount} invalid saved properties`,
      data: { cleanedCount }
    });

  } catch (error) {
    console.error('❌ Cleanup saved properties error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup saved properties',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;