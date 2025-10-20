import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Property Service for main website
export const propertyService = {
  // Get all properties for public display
  getAllProperties: async (params = {}) => {
    try {
      const response = await api.get('/properties', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      // Return mock data if API fails
      return getMockProperties();
    }
  },

  // Get single property by ID
  getPropertyById: async (id) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch property:', error);
      // Return mock property if API fails
      return getMockPropertyById(id);
    }
  },

  // Submit property inquiry
  submitInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/inquiries', inquiryData);
      return response.data;
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      throw error;
    }
  },

  // Search properties
  searchProperties: async (searchTerm, filters = {}) => {
    try {
      const params = {
        search: searchTerm,
        ...filters
      };
      const response = await api.get('/properties/search', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to search properties:', error);
      return getMockProperties().filter(property => 
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  },

  // Get featured properties
  getFeaturedProperties: async () => {
    try {
      const response = await api.get('/properties/featured');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
      return getMockProperties().slice(0, 6);
    }
  }
};

// Mock data with Google Drive image URLs (for development)
const getMockProperties = () => [
  {
    id: 1,
    title: "Luxury 3BHK Apartment in Ahmedabad",
    description: "Beautiful 3BHK apartment with modern amenities and stunning city views. Located in the heart of Ahmedabad with easy access to shopping centers, schools, and hospitals.",
    price: 15000000,
    location: "Ahmedabad, Gujarat",
    images: [
      "https://drive.google.com/uc?export=view&id=1example1", // Google Drive URLs
      "https://drive.google.com/uc?export=view&id=1example2",
      "https://drive.google.com/uc?export=view&id=1example3"
    ],
    beds: 3,
    baths: 3,
    area: 1250,
    type: "Sale",
    propertyType: "apartment",
    status: "active",
    amenities: ["Swimming Pool", "Gym", "Parking", "Security"],
    features: ["Modern Kitchen", "Balcony", "Air Conditioning"],
    agent: { 
      name: "Rajesh Patel", 
      phone: "+91 98765 43210",
      email: "rajesh@gujaratestate.com"
    },
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Modern 2BHK for Rent in Surat",
    description: "Fully furnished 2BHK apartment available for rent in prime location of Surat. Perfect for small families or working professionals.",
    price: 35000,
    location: "Surat, Gujarat", 
    images: [
      "https://drive.google.com/uc?export=view&id=2example1",
      "https://drive.google.com/uc?export=view&id=2example2"
    ],
    beds: 2,
    baths: 2,
    area: 950,
    type: "Rent",
    propertyType: "apartment",
    status: "active",
    amenities: ["Parking", "Security", "Elevator"],
    features: ["Furnished", "Balcony", "Modern Kitchen"],
    agent: { 
      name: "Priya Shah", 
      phone: "+91 98765 43211",
      email: "priya@gujaratestate.com"
    },
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T14:20:00Z"
  },
  {
    id: 3,
    title: "Spacious 4BHK Villa with Garden in Vadodara",
    description: "Independent villa with beautiful garden, perfect for large families. Located in peaceful residential area with all modern amenities.",
    price: 25000000,
    location: "Vadodara, Gujarat",
    images: [
      "https://drive.google.com/uc?export=view&id=3example1",
      "https://drive.google.com/uc?export=view&id=3example2",
      "https://drive.google.com/uc?export=view&id=3example3",
      "https://drive.google.com/uc?export=view&id=3example4"
    ],
    beds: 4,
    baths: 4,
    area: 2200,
    type: "Sale",
    propertyType: "villa",
    status: "active",
    amenities: ["Garden", "Parking", "Security", "Swimming Pool"],
    features: ["Independent", "Modern Kitchen", "Terrace", "Study Room"],
    agent: { 
      name: "Amit Kumar", 
      phone: "+91 98765 43212",
      email: "amit@gujaratestate.com"
    },
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T09:15:00Z"
  },
  {
    id: 4,
    title: "Commercial Office Space in Ahmedabad",
    description: "Prime commercial office space in business district of Ahmedabad. Ideal for IT companies, startups, and corporate offices.",
    price: 8000000,
    location: "Ahmedabad, Gujarat",
    images: [
      "https://drive.google.com/uc?export=view&id=4example1",
      "https://drive.google.com/uc?export=view&id=4example2"
    ],
    beds: 0,
    baths: 2,
    area: 800,
    type: "Sale",
    propertyType: "commercial",
    status: "active",
    amenities: ["Parking", "Security", "Elevator", "Power Backup"],
    features: ["Central AC", "Conference Room", "Reception Area"],
    agent: { 
      name: "Vikash Gupta", 
      phone: "+91 98765 43214",
      email: "vikash@gujaratestate.com"
    },
    createdAt: "2024-01-12T16:45:00Z",
    updatedAt: "2024-01-12T16:45:00Z"
  }
];

const getMockPropertyById = (id) => {
  const properties = getMockProperties();
  return properties.find(property => property.id === parseInt(id)) || properties[0];
};

export default propertyService;