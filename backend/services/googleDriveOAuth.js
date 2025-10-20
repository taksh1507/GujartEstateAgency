const { google } = require('googleapis');
const fs = require('fs');
const sharp = require('sharp');

/**
 * Google Drive Service using OAuth2 (works with personal Google accounts)
 * This solves the service account storage quota issue
 */
class GoogleDriveOAuthService {
    constructor() {
        try {
            // OAuth2 credentials (you'll need to create these)
            this.oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI || 'http://localhost:8000'
            );

            // Set refresh token (you'll get this from OAuth flow)
            if (process.env.GOOGLE_REFRESH_TOKEN) {
                this.oauth2Client.setCredentials({
                    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
                });
            }

            // Initialize Drive API
            this.drive = google.drive({ version: 'v3', auth: this.oauth2Client });

            // Get folder ID from environment
            this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

            if (!this.folderId) {
                throw new Error('GOOGLE_DRIVE_FOLDER_ID environment variable is required');
            }

            console.log('✅ Google Drive OAuth Service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Google Drive OAuth Service:', error.message);
            throw error;
        }
    }

    /**
     * Upload image to Google Drive using OAuth2
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

            console.log(`📤 Uploading to Google Drive (OAuth): ${uniqueFileName}`);

            // Convert buffer to stream
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
            console.log(`✅ Image uploaded to Google Drive. File ID: ${fileId}`);

            // Make file publicly viewable
            await this.makeFilePublic(fileId);

            // Return public URL
            const publicUrl = this.getPublicUrl(fileId);
            console.log(`🔗 Public URL generated: ${publicUrl}`);

            return publicUrl;
        } catch (error) {
            console.error('❌ Google Drive OAuth upload error:', error);
            throw new Error(`Failed to upload image to Google Drive: ${error.message}`);
        }
    }

    /**
     * Optimize image for web
     */
    async optimizeImage(buffer, mimeType) {
        try {
            let sharpInstance = sharp(buffer);

            const metadata = await sharpInstance.metadata();

            if (metadata.width > 1920) {
                sharpInstance = sharpInstance.resize(1920, null, {
                    withoutEnlargement: true
                });
            }

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

            return await sharpInstance
                .jpeg({ quality: 85, progressive: true })
                .toBuffer();
        } catch (error) {
            console.error('Image optimization error:', error);
            return buffer;
        }
    }

    /**
     * Make file publicly viewable
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
        }
    }

    /**
     * Get public URL for Google Drive file
     */
    getPublicUrl(fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }

    /**
     * Delete image from Google Drive
     */
    async deleteImage(imageUrl) {
        try {
            const fileId = this.extractFileId(imageUrl);
            if (!fileId) {
                throw new Error('Invalid Google Drive URL');
            }

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
     * Generate OAuth2 authorization URL
     */
    getAuthUrl() {
        const scopes = [
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive'
        ];

        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent'
        });
    }

    /**
     * Exchange authorization code for tokens
     */
    async getTokens(code) {
        try {
            const { tokens } = await this.oauth2Client.getToken(code);
            this.oauth2Client.setCredentials(tokens);
            return tokens;
        } catch (error) {
            console.error('❌ Failed to get tokens:', error);
            throw error;
        }
    }
}

module.exports = GoogleDriveOAuthService;