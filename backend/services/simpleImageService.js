const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Simple Image Service - Local storage with public URLs
 * This is a fallback when Google Drive service account has quota issues
 */
class SimpleImageService {
  constructor() {
    // Create uploads directory if it doesn't exist
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.publicDir = path.join(__dirname, '../public/images');
    
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.publicDir)) {
      fs.mkdirSync(this.publicDir, { recursive: true });
    }
    
    console.log('✅ Simple Image Service initialized');
  }

  /**
   * Upload image to local storage
   * @param {Buffer} buffer - Image buffer
   * @param {string} fileName - File name
   * @param {string} mimeType - MIME type
   * @param {string} propertyId - Property ID for organization
   * @returns {Promise<string>} - Public URL of uploaded image
   */
  async uploadImage(buffer, fileName, mimeType, propertyId = null) {
    try {
      // Optimize image using Sharp
      const optimizedBuffer = await this.optimizeImage(buffer, mimeType);
      
      // Generate unique filename
      const timestamp = Date.now();
      const fileExtension = this.getFileExtension(mimeType);
      const uniqueFileName = propertyId 
        ? `property_${propertyId}_${timestamp}_${this.sanitizeFileName(fileName)}`
        : `image_${timestamp}_${this.sanitizeFileName(fileName)}`;

      console.log(`📤 Saving image locally: ${uniqueFileName}`);

      // Save to public directory
      const filePath = path.join(this.publicDir, uniqueFileName);
      fs.writeFileSync(filePath, optimizedBuffer);

      // Return public URL (served by Express static middleware)
      const publicUrl = `${process.env.BACKEND_URL || 'http://localhost:8000'}/images/${uniqueFileName}`;
      
      console.log(`✅ Image saved successfully: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      console.error('❌ Local image upload error:', error);
      throw new Error(`Failed to upload image locally: ${error.message}`);
    }
  }

  /**
   * Optimize image for web
   * @param {Buffer} buffer - Original image buffer
   * @param {string} mimeType - MIME type
   * @returns {Promise<Buffer>} - Optimized image buffer
   */
  async optimizeImage(buffer, mimeType) {
    try {
      let sharpInstance = sharp(buffer);
      
      // Get image metadata
      const metadata = await sharpInstance.metadata();
      
      // Resize if too large (max 1920px width)
      if (metadata.width > 1920) {
        sharpInstance = sharpInstance.resize(1920, null, {
          withoutEnlargement: true
        });
      }

      // Convert to appropriate format and compress
      if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
        return await sharpInstance
          .jpeg({ quality: 85, progressive: true })
          .toBuffer();
      } else if (mimeType === 'image/png') {
        return await sharpInstance
          .png({ compressionLevel: 8 })
          .toBuffer();
      } else if (mimeType === 'image/webp') {
        return await sharpInstance
          .webp({ quality: 85 })
          .toBuffer();
      }

      // Default: convert to JPEG
      return await sharpInstance
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
    } catch (error) {
      console.error('Image optimization error:', error);
      // Return original buffer if optimization fails
      return buffer;
    }
  }

  /**
   * Delete image from local storage
   * @param {string} imageUrl - Image URL
   * @returns {Promise<boolean>} - Success status
   */
  async deleteImage(imageUrl) {
    try {
      // Extract filename from URL
      const fileName = path.basename(imageUrl);
      const filePath = path.join(this.publicDir, fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Image deleted: ${fileName}`);
        return true;
      } else {
        console.log(`⚠️ Image not found: ${fileName}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Delete image error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Get file extension from MIME type
   * @param {string} mimeType - MIME type
   * @returns {string} - File extension
   */
  getFileExtension(mimeType) {
    const extensions = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/webp': '.webp'
    };
    return extensions[mimeType] || '.jpg';
  }

  /**
   * Sanitize filename for safe storage
   * @param {string} fileName - Original filename
   * @returns {string} - Sanitized filename
   */
  sanitizeFileName(fileName) {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .toLowerCase();
  }

  /**
   * List uploaded images
   * @param {number} limit - Maximum number of files to return
   * @returns {Promise<Array>} - List of image files
   */
  async listImages(limit = 100) {
    try {
      const files = fs.readdirSync(this.publicDir)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
        .map(file => {
          const filePath = path.join(this.publicDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            createdTime: stats.birthtime.toISOString(),
            url: `${process.env.BACKEND_URL || 'http://localhost:8000'}/images/${file}`
          };
        })
        .sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime))
        .slice(0, limit);

      return files;
    } catch (error) {
      console.error('❌ List images error:', error);
      return [];
    }
  }

  /**
   * Get storage info
   * @returns {Promise<Object>} - Storage usage info
   */
  async getStorageInfo() {
    try {
      const files = await this.listImages();
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      
      return {
        totalFiles: files.length,
        totalSize: totalSize,
        totalSizeFormatted: this.formatBytes(totalSize),
        storageType: 'Local Storage'
      };
    } catch (error) {
      console.error('❌ Get storage info error:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        totalSizeFormatted: '0 B',
        storageType: 'Local Storage'
      };
    }
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes
   * @returns {string} - Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

module.exports = SimpleImageService;