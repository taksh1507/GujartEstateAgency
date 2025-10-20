const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class GoogleDriveService {
  constructor() {
    try {
      // Load service account credentials
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-drive-credentials.json';
      
      if (!fs.existsSync(credentialsPath)) {
        throw new Error(`Google Drive credentials file not found at: ${credentialsPath}`);
      }

      const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
      
      // Initialize Google Auth
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
          'https://www.googleapis.com/auth/drive.file',
          'https://www.googleapis.com/auth/drive'
        ]
      });
      
      // Initialize Drive API
      this.drive = google.drive({ version: 'v3', auth: this.auth });
      
      // Get folder ID from environment
      this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      
      if (!this.folderId) {
        throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is required');
      }

      console.log('✅ Google Drive Service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Google Drive Service:', error.message);
      throw error;
    }
  }

  /**
   * Upload image to Google Drive
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
      const uniqueFileName = propertyId 
        ? `property_${propertyId}_${timestamp}_${fileName}`
        : `image_${timestamp}_${fileName}`;

      console.log(`📤 Uploading image: ${uniqueFileName}`);

      // Convert buffer to stream for Google Drive API
      const { Readable } = require('stream');
      const bufferStream = new Readable();
      bufferStream.push(optimizedBuffer);
      bufferStream.push(null);

      // Upload file to Google Drive
      const response = await this.drive.files.create({
        requestBody: {
          name: uniqueFileName,
          parents: [this.folderId],
          description: `Property image uploaded at ${new Date().toISOString()}`
        },
        media: {
          mimeType,
          body: bufferStream
        }
      });

      const fileId = response.data.id;
      console.log(`✅ Image uploaded successfully. File ID: ${fileId}`);

      // Make file publicly viewable
      await this.makeFilePublic(fileId);

      // Return public URL
      const publicUrl = this.getPublicUrl(fileId);
      console.log(`🔗 Public URL generated: ${publicUrl}`);

      return publicUrl;
    } catch (error) {
      console.error('❌ Google Drive upload error:', error);
      throw new Error(`Failed to upload image to Google Drive: ${error.message}`);
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
   * Make file publicly viewable
   * @param {string} fileId - Google Drive file ID
   */
  async makeFilePublic(fileId) {
    try {
      await this.drive.permissions.create({
        fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone'
        }
      });
      console.log(`🔓 File ${fileId} made publicly viewable`);
    } catch (error) {
      console.error('❌ Failed to make file public:', error);
      // Don't throw error, as upload was successful
    }
  }

  /**
   * Get public URL for Google Drive file
   * @param {string} fileId - Google Drive file ID
   * @returns {string} - Public URL
   */
  getPublicUrl(fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  /**
   * Delete image from Google Drive
   * @param {string} fileId - Google Drive file ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteImage(fileId) {
    try {
      await this.drive.files.delete({ fileId });
      console.log(`🗑️ File ${fileId} deleted successfully`);
      return true;
    } catch (error) {
      console.error('❌ Google Drive delete error:', error);
      throw new Error(`Failed to delete image from Google Drive: ${error.message}`);
    }
  }

  /**
   * Extract file ID from Google Drive URL
   * @param {string} url - Google Drive URL
   * @returns {string|null} - File ID or null
   */
  extractFileId(url) {
    const patterns = [
      /[?&]id=([^&]+)/,
      /\/file\/d\/([^\/]+)/,
      /\/uc\?.*id=([^&]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get file info from Google Drive
   * @param {string} fileId - Google Drive file ID
   * @returns {Promise<Object>} - File information
   */
  async getFileInfo(fileId) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id,name,size,mimeType,createdTime,modifiedTime'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get file info:', error);
      throw new Error(`Failed to get file info: ${error.message}`);
    }
  }

  /**
   * List files in the property images folder
   * @param {number} limit - Maximum number of files to return
   * @returns {Promise<Array>} - List of files
   */
  async listFiles(limit = 100) {
    try {
      const response = await this.drive.files.list({
        q: `'${this.folderId}' in parents and trashed=false`,
        fields: 'files(id,name,size,mimeType,createdTime)',
        orderBy: 'createdTime desc',
        pageSize: limit
      });
      return response.data.files;
    } catch (error) {
      console.error('❌ Failed to list files:', error);
      throw new Error(`Failed to list files: ${error.message}`);
    }
  }

  /**
   * Get storage usage information
   * @returns {Promise<Object>} - Storage usage info
   */
  async getStorageInfo() {
    try {
      const response = await this.drive.about.get({
        fields: 'storageQuota'
      });
      return response.data.storageQuota;
    } catch (error) {
      console.error('❌ Failed to get storage info:', error);
      throw new Error(`Failed to get storage info: ${error.message}`);
    }
  }
}

module.exports = GoogleDriveService;