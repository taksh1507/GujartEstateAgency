// Google Drive API service for image storage
class GoogleDriveService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY;
    this.folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
    this.baseUrl = 'https://www.googleapis.com/drive/v3';
    this.uploadUrl = 'https://www.googleapis.com/upload/drive/v3';
  }

  // Initialize Google Drive API
  async initializeGapi() {
    return new Promise((resolve) => {
      if (window.gapi) {
        window.gapi.load('auth2', resolve);
      } else {
        // Load Google API script if not already loaded
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
          window.gapi.load('auth2', resolve);
        };
        document.head.appendChild(script);
      }
    });
  }

  // Upload image to Google Drive
  async uploadImage(file, propertyId, imageIndex = 0) {
    try {
      const fileName = `property_${propertyId}_${imageIndex}_${Date.now()}.${file.name.split('.').pop()}`;
      
      // Create form data for multipart upload
      const metadata = {
        name: fileName,
        parents: [this.folderId],
        description: `Property image for property ID: ${propertyId}`
      };

      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], {type: 'application/json'}));
      formData.append('file', file);

      // Get access token (you'll need to implement OAuth2 flow)
      const accessToken = await this.getAccessToken();

      const response = await fetch(`${this.uploadUrl}/files?uploadType=multipart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Make the file publicly viewable
      await this.makeFilePublic(result.id, accessToken);
      
      // Return the public URL
      return this.getPublicUrl(result.id);
    } catch (error) {
      console.error('Error uploading to Google Drive:', error);
      throw error;
    }
  }

  // Make file publicly viewable
  async makeFilePublic(fileId, accessToken) {
    const response = await fetch(`${this.baseUrl}/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });

    if (!response.ok) {
      console.warn('Failed to make file public:', response.statusText);
    }
  }

  // Get public URL for the image
  getPublicUrl(fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Get access token (simplified - in production, implement proper OAuth2)
  async getAccessToken() {
    // This is a simplified version. In production, you should implement proper OAuth2 flow
    // For now, we'll use a service account or stored token
    const token = localStorage.getItem('googleDriveToken');
    if (!token) {
      throw new Error('No Google Drive access token found. Please authenticate.');
    }
    return token;
  }

  // Upload multiple images
  async uploadMultipleImages(files, propertyId) {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, propertyId, index)
    );
    
    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  // Delete image from Google Drive
  async deleteImage(fileId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await fetch(`${this.baseUrl}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting from Google Drive:', error);
      throw error;
    }
  }

  // Extract file ID from Google Drive URL
  extractFileId(url) {
    const match = url.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }
}

// Alternative: Simple base64 upload with backend handling Google Drive
class SimpleImageUploadService {
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
  }

  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Upload image via backend (backend handles Google Drive)
  async uploadImage(file, propertyId, imageIndex = 0) {
    try {
      const base64 = await this.fileToBase64(file);
      
      const response = await fetch(`${this.apiBaseUrl}/admin/properties/upload-image-base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          image: base64,
          propertyId,
          imageIndex,
          fileName: file.name,
          fileType: file.type
        })
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.url; // Google Drive public URL returned by backend
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  // Upload multiple images
  async uploadMultipleImages(files, propertyId) {
    const uploadPromises = files.map((file, index) => 
      this.uploadImage(file, propertyId, index)
    );
    
    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      throw error;
    }
  }

  // Delete image (backend handles Google Drive deletion)
  async deleteImage(imageUrl) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/admin/properties/delete-image`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ imageUrl })
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.statusText}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
}

// Export both services
export const googleDriveService = new GoogleDriveService();
export const simpleImageUploadService = new SimpleImageUploadService();

// Default export - use simple service for easier backend integration
export default simpleImageUploadService;