// API base configuration and helper functions

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Property API functions
export const propertyAPI = {
  // Get all properties with optional filters
  getProperties: (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiCall(`/properties${queryString ? `?${queryString}` : ''}`);
  },

  // Get property by ID
  getProperty: (id) => apiCall(`/properties/${id}`),

  // Create new property (admin)
  createProperty: (propertyData) => apiCall('/properties', {
    method: 'POST',
    body: JSON.stringify(propertyData),
  }),

  // Update property (admin)
  updateProperty: (id, propertyData) => apiCall(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(propertyData),
  }),

  // Delete property (admin)
  deleteProperty: (id) => apiCall(`/properties/${id}`, {
    method: 'DELETE',
  }),

  // Search properties
  searchProperties: (query) => apiCall(`/properties/search?q=${encodeURIComponent(query)}`),
};

// User API functions
export const userAPI = {
  // User registration
  register: (userData) => apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  // User login
  login: (credentials) => apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  // Get user profile
  getProfile: () => apiCall('/user/profile'),

  // Update user profile
  updateProfile: (profileData) => apiCall('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  // Get user's saved properties
  getSavedProperties: () => apiCall('/user/saved-properties'),

  // Save property
  saveProperty: (propertyId) => apiCall('/user/saved-properties', {
    method: 'POST',
    body: JSON.stringify({ propertyId }),
  }),

  // Remove saved property
  removeSavedProperty: (propertyId) => apiCall(`/user/saved-properties/${propertyId}`, {
    method: 'DELETE',
  }),
};

// Inquiry API functions
export const inquiryAPI = {
  // Send property inquiry
  sendInquiry: (inquiryData) => apiCall('/inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiryData),
  }),

  // Get user's inquiries
  getUserInquiries: () => apiCall('/inquiries/user'),

  // Get all inquiries (admin)
  getAllInquiries: () => apiCall('/inquiries/admin'),

  // Update inquiry status (admin)
  updateInquiryStatus: (id, status) => apiCall(`/inquiries/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
};

// Contact API functions
export const contactAPI = {
  // Send contact message
  sendMessage: (messageData) => apiCall('/contact', {
    method: 'POST',
    body: JSON.stringify(messageData),
  }),
};

// Analytics API functions (admin)
export const analyticsAPI = {
  // Get dashboard stats
  getDashboardStats: () => apiCall('/analytics/dashboard'),

  // Get property performance
  getPropertyPerformance: (propertyId) => apiCall(`/analytics/property/${propertyId}`),

  // Get sales analytics
  getSalesAnalytics: (period = '6months') => apiCall(`/analytics/sales?period=${period}`),
};

export default apiCall;