import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('userData');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Registration failed'
      };
    }
  },

  // Verify email with OTP
  verifyEmail: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-email', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Verification failed'
      };
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to resend verification'
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Login failed'
      };
    }
  },

  // Forgot password
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send reset code'
      };
    }
  },

  // Verify reset OTP
  verifyResetOTP: async (email, otp) => {
    try {
      const response = await api.post('/auth/verify-reset-otp', { email, otp });
      return response.data;
    } catch (error) {
      console.error('Verify reset OTP error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to verify reset code'
      };
    }
  },

  // Reset password
  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        resetToken,
        newPassword,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to reset password'
      };
    }
  },

  // Verify token validity
  verifyToken: async (token) => {
    try {
      const response = await api.get('/auth/verify-token', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get profile'
      };
    }
  },

  // Update user profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to update profile'
      };
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword, confirmPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword,
        confirmPassword
      });
      return response.data;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to change password'
      };
    }
  },

  // Google OAuth login
  googleLogin: async (googleToken) => {
    try {
      const response = await api.post('/auth/google-login', { token: googleToken });
      return response.data;
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Google login failed'
      };
    }
  },

  // Facebook OAuth login
  facebookLogin: async (facebookToken) => {
    try {
      const response = await api.post('/auth/facebook-login', { token: facebookToken });
      return response.data;
    } catch (error) {
      console.error('Facebook login error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Facebook login failed'
      };
    }
  },

  // Get user statistics
  getStatistics: async () => {
    try {
      const response = await api.get('/auth/statistics');
      return response.data;
    } catch (error) {
      console.error('Get statistics error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get statistics'
      };
    }
  },

  // Save property
  saveProperty: async (propertyId) => {
    try {
      const response = await api.post('/auth/save-property', { propertyId });
      return response.data;
    } catch (error) {
      console.error('Save property error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to save property'
      };
    }
  },

  // Unsave property
  unsaveProperty: async (propertyId) => {
    try {
      const response = await api.delete(`/auth/unsave-property/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Unsave property error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to unsave property'
      };
    }
  },

  // Get saved properties
  getSavedProperties: async () => {
    try {
      const response = await api.get('/auth/saved-properties');
      return response.data;
    } catch (error) {
      console.error('Get saved properties error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get saved properties'
      };
    }
  },

  // Check if property is saved
  isPropertySaved: async (propertyId) => {
    try {
      const response = await api.get(`/auth/is-property-saved/${propertyId}`);
      return response.data;
    } catch (error) {
      console.error('Check property saved error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to check if property is saved'
      };
    }
  },

  // Create inquiry
  createInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/auth/create-inquiry', inquiryData);
      return response.data;
    } catch (error) {
      console.error('Create inquiry error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to create inquiry'
      };
    }
  },

  // Get user's inquiries
  getMyInquiries: async () => {
    try {
      const response = await api.get('/auth/my-inquiries');
      return response.data;
    } catch (error) {
      console.error('Get my inquiries error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to get inquiries'
      };
    }
  },

  // Reply to inquiry
  replyToInquiry: async (inquiryId, message) => {
    try {
      const response = await api.post(`/auth/reply-to-inquiry/${inquiryId}`, { message });
      return response.data;
    } catch (error) {
      console.error('Reply to inquiry error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to send reply'
      };
    }
  },

  // Clean up invalid saved properties
  cleanupSavedProperties: async () => {
    try {
      const response = await api.post('/auth/cleanup-saved-properties');
      return response.data;
    } catch (error) {
      console.error('Cleanup saved properties error:', error);
      return {
        success: false,
        error: error.response?.data?.error || error.message || 'Failed to cleanup saved properties'
      };
    }
  },

  // Logout (client-side cleanup)
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    console.log('✅ User logged out');
  }
};

export default authService;