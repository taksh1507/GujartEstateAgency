// Price formatting utility functions

export const formatPrice = (price) => {
  if (!price || isNaN(price)) return '₹0';
  
  const numPrice = Number(price);
  
  if (numPrice >= 10000000) {
    return `₹${(numPrice / 10000000).toFixed(1)}Cr`;
  } else if (numPrice >= 100000) {
    return `₹${(numPrice / 100000).toFixed(1)}L`;
  } else if (numPrice >= 1000) {
    return `₹${(numPrice / 1000).toFixed(0)}K`;
  } else {
    return `₹${numPrice.toLocaleString('en-IN')}`;
  }
};

export const formatPriceDetailed = (price) => {
  if (!price || isNaN(price)) return '₹0';
  
  const numPrice = Number(price);
  return `₹${numPrice.toLocaleString('en-IN')}`;
};

export const formatPriceRange = (minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return 'Any Budget';
  if (!minPrice) return `Up to ${formatPrice(maxPrice)}`;
  if (!maxPrice) return `${formatPrice(minPrice)}+`;
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

// Area formatting
export const formatArea = (area) => {
  if (!area || isNaN(area)) return '0 sq ft';
  
  const numArea = Number(area);
  return `${numArea.toLocaleString('en-IN')} sq ft`;
};

// Date formatting
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Time ago formatting
export const timeAgo = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return formatDate(dateString);
};

// Phone number formatting
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if it's an Indian number
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const number = cleaned.substring(2);
    return `+91 ${number.substring(0, 5)} ${number.substring(5)}`;
  }
  
  return phone; // Return original if format is unclear
};

// Property status formatting
export const getStatusColor = (status) => {
  const statusColors = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800', 
    'sold': 'bg-gray-100 text-gray-800',
    'rented': 'bg-blue-100 text-blue-800',
    'inactive': 'bg-red-100 text-red-800'
  };
  
  return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

// Property type formatting
export const getPropertyTypeIcon = (type) => {
  const typeIcons = {
    'apartment': '🏢',
    'villa': '🏠',
    'office': '🏢',
    'shop': '🏪',
    'warehouse': '🏭',
    'land': '🌍'
  };
  
  return typeIcons[type?.toLowerCase()] || '🏠';
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

// Generate property URL slug
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export default {
  formatPrice,
  formatPriceDetailed,
  formatPriceRange,
  formatArea,
  formatDate,
  formatDateTime,
  timeAgo,
  formatPhone,
  getStatusColor,
  getPropertyTypeIcon,
  truncateText,
  generateSlug,
  isValidEmail,
  isValidPhone
};