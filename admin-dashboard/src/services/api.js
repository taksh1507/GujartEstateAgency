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

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await api.put('/admin/profile', data);
    return response.data;
  },

  // Password Reset with OTP
  forgotPassword: async (email) => {
    const response = await api.post('/admin/forgot-password', { email });
    return response.data;
  },

  verifyOTP: async (email, otp) => {
    const response = await api.post('/admin/verify-otp', { email, otp });
    return response.data;
  },

  resetPassword: async (resetToken, newPassword, confirmPassword) => {
    const response = await api.post('/admin/reset-password', {
      resetToken,
      newPassword,
      confirmPassword
    });
    return response.data;
  },

  getOTPStatus: async (email) => {
    const response = await api.get(`/admin/otp-status/${email}`);
    return response.data;
  }
};

// Properties API
export const propertiesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/properties', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/admin/properties/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/admin/properties', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/admin/properties/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/properties/${id}`);
    return response.data;
  },
  
  uploadImages: async (id, formData) => {
    const response = await api.post(`/admin/properties/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },


  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/properties/${id}/status`, { status });
    return response.data;
  }
};

// Users API
export const usersAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/users/${id}/status`, { status });
    return response.data;
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/analytics/dashboard');
    return response.data;
  },
  
  getPropertyStats: async (period = '30d') => {
    const response = await api.get(`/admin/analytics/properties?period=${period}`);
    return response.data;
  },
  
  getUserStats: async (period = '30d') => {
    const response = await api.get(`/admin/analytics/users?period=${period}`);
    return response.data;
  },
  
  getRevenueStats: async (period = '30d') => {
    const response = await api.get(`/admin/analytics/revenue?period=${period}`);
    return response.data;
  }
};

// Inquiries API
export const inquiriesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/admin/inquiries', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/admin/inquiries/${id}`);
    return response.data;
  },
  
  updateStatus: async (id, status) => {
    const response = await api.patch(`/admin/inquiries/${id}/status`, { status });
    return response.data;
  },
  
  addNote: async (id, note) => {
    const response = await api.post(`/admin/inquiries/${id}/notes`, { note });
    return response.data;
  }
};

// Settings API
export const settingsAPI = {
  getAll: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },
  
  update: async (data) => {
    const response = await api.put('/admin/settings', data);
    return response.data;
  }
};

export default api;