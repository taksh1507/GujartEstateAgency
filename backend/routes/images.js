const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { authenticateAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gujarat-estate', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit' }, // Resize large images
      { quality: 'auto' } // Optimize quality
    ]
  },
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

/**
 * @route POST /api/images/upload
 * @desc Upload image to Cloudinary
 * @access Private (Admin only)
 */
router.post('/upload', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }

    console.log(`📤 Image uploaded to Cloudinary: ${req.file.filename}`);

    res.json({
      success: true,
      data: {
        url: req.file.path, // Cloudinary URL
        public_id: req.file.filename, // Cloudinary public_id
        secure_url: req.file.path.replace('http://', 'https://'), // Ensure HTTPS
        width: req.file.width || null,
        height: req.file.height || null,
        format: req.file.format || null,
        resource_type: req.file.resource_type || 'image',
        bytes: req.file.bytes || null
      },
      message: 'Image uploaded successfully to Cloudinary'
    });

  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      message: error.message
    });
  }
});

/**
 * @route POST /api/images/upload-base64
 * @desc Upload base64 image to Cloudinary
 * @access Private (Admin only)
 */
router.post('/upload-base64', authenticateAdmin, async (req, res) => {
  try {
    const { image, fileName } = req.body;

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'No image data provided'
      });
    }

    console.log(`📤 Uploading base64 image to Cloudinary: ${fileName || 'unnamed'}`);

    // Upload base64 image directly to Cloudinary
    const result = await cloudinary.uploader.upload(image, {
      folder: 'gujarat-estate',
      public_id: fileName ? fileName.split('.')[0] : undefined, // Use filename without extension
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' }
      ]
    });

    console.log(`✅ Base64 image uploaded to Cloudinary: ${result.public_id}`);

    res.json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes
      },
      message: 'Image uploaded successfully to Cloudinary'
    });

  } catch (error) {
    console.error('❌ Cloudinary base64 upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      message: error.message
    });
  }
});

/**
 * @route DELETE /api/images/delete/:publicId
 * @desc Delete image from Cloudinary
 * @access Private (Admin only)
 */
router.delete('/delete/:publicId', authenticateAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        error: 'Public ID is required'
      });
    }

    console.log(`🗑️ Deleting image from Cloudinary: ${publicId}`);

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      console.log(`✅ Image deleted from Cloudinary: ${publicId}`);
      res.json({
        success: true,
        message: 'Image deleted successfully from Cloudinary'
      });
    } else {
      throw new Error(`Failed to delete image: ${result.result}`);
    }

  } catch (error) {
    console.error('❌ Cloudinary delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete image',
      message: error.message
    });
  }
});

/**
 * @route GET /api/images/info/:publicId
 * @desc Get image information from Cloudinary
 * @access Private (Admin only)
 */
router.get('/info/:publicId', authenticateAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    console.log(`📋 Getting image info from Cloudinary: ${publicId}`);

    // Get image details from Cloudinary
    const result = await cloudinary.api.resource(publicId);

    res.json({
      success: true,
      data: {
        public_id: result.public_id,
        url: result.url,
        secure_url: result.secure_url,
        width: result.width,
        height: result.height,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        created_at: result.created_at,
        folder: result.folder
      }
    });

  } catch (error) {
    console.error('❌ Cloudinary info error:', error);
    res.status(404).json({
      success: false,
      error: 'Image not found',
      message: error.message
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'Maximum file size is 10MB'
      });
    }
  }

  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: 'Only image files are allowed'
    });
  }

  next(error);
});

module.exports = router;