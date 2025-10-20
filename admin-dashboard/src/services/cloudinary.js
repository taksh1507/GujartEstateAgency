import api from './api';

class CloudinaryService {
  /**
   * Upload image file to Cloudinary
   * @param {File} file - Image file to upload
   * @param {string} folder - Optional folder name
   * @returns {Promise} Upload result
   */
  async uploadImage(file, folder = 'properties') {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      if (folder) {
        formData.append('folder', folder);
      }

      const response = await api.post('/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  }

  /**
   * Upload base64 image to Cloudinary
   * @param {string} base64Data - Base64 image data
   * @param {string} fileName - Original file name
   * @returns {Promise} Upload result
   */
  async uploadBase64Image(base64Data, fileName) {
    try {
      const response = await api.post('/images/upload-base64', {
        image: base64Data,
        fileName: fileName
      });

      return response.data;
    } catch (error) {
      console.error('Cloudinary base64 upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  }

  /**
   * Upload image via admin property endpoint
   * @param {File} file - Image file to upload
   * @returns {Promise} Upload result
   */
  async uploadPropertyImage(file) {
    try {
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      const response = await api.post('/admin/properties/upload-image-base64', {
        image: base64Data,
        fileName: file.name
      });

      return response.data;
    } catch (error) {
      console.error('Property image upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload property image');
    }
  }

  /**
   * Delete image from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise} Delete result
   */
  async deleteImage(publicId) {
    try {
      const response = await api.delete(`/images/delete/${publicId}`);
      return response.data;
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete image');
    }
  }

  /**
   * Get image information from Cloudinary
   * @param {string} publicId - Cloudinary public ID
   * @returns {Promise} Image info
   */
  async getImageInfo(publicId) {
    try {
      const response = await api.get(`/images/info/${publicId}`);
      return response.data;
    } catch (error) {
      console.error('Cloudinary info error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get image info');
    }
  }

  /**
   * Convert file to base64
   * @param {File} file - File to convert
   * @returns {Promise<string>} Base64 string
   */
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Extract public ID from Cloudinary URL
   * @param {string} url - Cloudinary URL
   * @returns {string} Public ID
   */
  extractPublicId(url) {
    if (!url) return null;
    
    // Extract public ID from Cloudinary URL
    // Example: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
    const matches = url.match(/\/v\d+\/(.+)\./);
    if (matches && matches[1]) {
      return matches[1];
    }
    
    // Fallback: try to extract from different URL formats
    const pathParts = url.split('/');
    const fileName = pathParts[pathParts.length - 1];
    return fileName.split('.')[0];
  }

  /**
   * Generate transformation URL
   * @param {string} url - Original Cloudinary URL
   * @param {Object} transformations - Transformation options
   * @returns {string} Transformed URL
   */
  getTransformedUrl(url, transformations = {}) {
    if (!url || !url.includes('cloudinary.com')) {
      return url;
    }

    const { width, height, crop = 'fill', quality = 'auto' } = transformations;
    
    let transformString = '';
    if (width) transformString += `w_${width},`;
    if (height) transformString += `h_${height},`;
    if (crop) transformString += `c_${crop},`;
    if (quality) transformString += `q_${quality}`;
    
    // Remove trailing comma
    transformString = transformString.replace(/,$/, '');
    
    if (transformString) {
      // Insert transformation into URL
      return url.replace('/upload/', `/upload/${transformString}/`);
    }
    
    return url;
  }
}

export default new CloudinaryService();