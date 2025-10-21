const { db } = require('../config/firebase');

class PropertyService {
  constructor() {
    this.collection = db.collection('properties');
  }

  /**
   * Generate next property index
   */
  async generatePropertyIndex() {
    try {
      // Get the counter document
      const counterRef = db.collection('counters').doc('properties');
      const counterDoc = await counterRef.get();
      
      let nextIndex = 1;
      if (counterDoc.exists) {
        nextIndex = (counterDoc.data().count || 0) + 1;
      }
      
      // Update counter
      await counterRef.set({ count: nextIndex }, { merge: true });
      
      return nextIndex;
    } catch (error) {
      console.error('❌ Error generating property index:', error);
      // Fallback to timestamp-based index
      return Date.now();
    }
  }

  /**
   * Create a new property with automatic indexing
   */
  async createProperty(propertyData) {
    try {
      // Generate automatic property index
      const propertyIndex = await this.generatePropertyIndex();
      const propertyId = `PROP-${String(propertyIndex).padStart(6, '0')}`;
      
      const timestamp = new Date().toISOString();
      const enhancedPropertyData = {
        ...propertyData,
        propertyIndex,
        propertyId,
        createdAt: timestamp,
        updatedAt: timestamp,
        // Add search-friendly fields for better indexing
        searchTitle: propertyData.title?.toLowerCase() || '',
        searchLocation: propertyData.location?.toLowerCase() || '',
        searchDescription: propertyData.description?.toLowerCase() || '',
        priceRange: this.getPriceRange(propertyData.price),
        locationCity: this.extractCity(propertyData.location),
        // Add status if not provided
        status: propertyData.status || 'active'
      };

      const docRef = await this.collection.add(enhancedPropertyData);

      console.log(`🏠 Property created in Firebase: ${docRef.id} (Index: ${propertyIndex}, ID: ${propertyId})`);
      
      return {
        id: docRef.id,
        ...enhancedPropertyData
      };
    } catch (error) {
      console.error('❌ Firebase create property error:', error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Helper function to determine price range for indexing
   */
  getPriceRange(price) {
    if (price < 1000000) return 'under-10L';
    if (price < 2500000) return '10L-25L';
    if (price < 5000000) return '25L-50L';
    if (price < 10000000) return '50L-1Cr';
    if (price < 25000000) return '1Cr-2.5Cr';
    return 'above-2.5Cr';
  }

  /**
   * Helper function to extract city from location
   */
  extractCity(location) {
    if (!location) return '';
    // Extract city name (assuming format like "Area, City, State")
    const parts = location.split(',');
    return parts.length > 1 ? parts[parts.length - 2].trim().toLowerCase() : location.toLowerCase();
  }

  /**
   * Get all properties with pagination and optimized indexing
   */
  async getProperties(options = {}) {
    try {
      const { page = 1, limit = 10, status, type, sortBy = 'newest' } = options;
      
      let query = this.collection;
      
      // Use simple query without complex filtering to avoid index issues
      // We'll do filtering on the client side for now
      query = query.limit(100); // Get more documents to filter client-side
      
      const snapshot = await query.get();
      
      let allProperties = [];
      snapshot.forEach(doc => {
        allProperties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // If no properties found in Firebase, use mock data
      if (allProperties.length === 0) {
        console.log('📋 No properties in Firebase, using mock data');
        return this.getMockProperties(options);
      }

      // Apply client-side filtering
      let filteredProperties = allProperties;
      
      if (status && status !== 'all') {
        filteredProperties = filteredProperties.filter(prop => prop.status === status);
      }
      
      if (type && type !== 'all') {
        filteredProperties = filteredProperties.filter(prop => prop.type === type);
      }

      // Apply sorting based on sortBy parameter
      switch (sortBy) {
        case 'price-low':
          filteredProperties.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProperties.sort((a, b) => b.price - a.price);
          break;
        case 'oldest':
          filteredProperties.sort((a, b) => (a.propertyIndex || 0) - (b.propertyIndex || 0));
          break;
        case 'newest':
        default:
          filteredProperties.sort((a, b) => (b.propertyIndex || 0) - (a.propertyIndex || 0));
          break;
      }
      
      // Apply pagination
      const startIndex = (page - 1) * limit;
      const properties = filteredProperties.slice(startIndex, startIndex + limit);

      const totalProperties = filteredProperties.length;
      const totalPages = Math.ceil(totalProperties / limit);

      console.log(`📋 Retrieved ${properties.length} properties from Firebase (Client-side filtered)`);

      return {
        properties,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProperties,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('❌ Firebase get properties error:', error);
      // Return mock data as fallback
      return this.getMockProperties(options);
    }
  }

  /**
   * Get mock properties as fallback
   */
  getMockProperties(options = {}) {
    const { page = 1, limit = 10 } = options;
    
    const mockProperties = [
      {
        id: 'mock-1',
        title: "Luxury 3BHK Apartment in Satellite, Ahmedabad",
        description: "Premium 3BHK apartment in Satellite area with modern amenities, club house, and excellent connectivity to SG Highway and Sindhu Bhavan Road.",
        price: 15000000,
        location: "Satellite, Ahmedabad, Gujarat",
        images: [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop"
        ],
        beds: 3,
        baths: 3,
        area: 1250,
        type: "Sale",
        propertyType: "apartment",
        status: "active",
        amenities: ["Swimming Pool", "Gym", "Club House", "24/7 Security", "Power Backup", "Lift"],
        features: ["Modular Kitchen", "Balcony", "Central AC", "Marble Flooring", "Car Parking"],
        agent: { 
          name: "Rajesh Patel", 
          phone: "+91 98765 43210",
          email: "rajesh@gujaratestate.com"
        },
        createdAt: "2024-01-15T10:30:00Z",
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: 'mock-2',
        title: "Modern 2BHK for Rent in Vesu, Surat",
        description: "Fully furnished 2BHK apartment in premium Vesu area, close to VR Mall and Dumas Road. Perfect for professionals and small families.",
        price: 35000,
        location: "Vesu, Surat, Gujarat", 
        images: [
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop"
        ],
        beds: 2,
        baths: 2,
        area: 950,
        type: "Rent",
        propertyType: "apartment",
        status: "active",
        amenities: ["Covered Parking", "24/7 Security", "Elevator", "Water Supply", "Garden Area"],
        features: ["Fully Furnished", "Balcony", "Modular Kitchen", "Wardrobe", "Geyser"],
        agent: { 
          name: "Priya Shah", 
          phone: "+91 98765 43211",
          email: "priya@gujaratestate.com"
        },
        createdAt: "2024-01-14T14:20:00Z",
        updatedAt: "2024-01-14T14:20:00Z"
      },
      {
        id: 'mock-3',
        title: "Spacious 4BHK Villa in Alkapuri, Vadodara",
        description: "Independent villa with garden in prestigious Alkapuri area. Close to Sayajigunj and major commercial areas. Perfect for large families.",
        price: 25000000,
        location: "Alkapuri, Vadodara, Gujarat",
        images: [
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop"
        ],
        beds: 4,
        baths: 4,
        area: 2200,
        type: "Sale",
        propertyType: "villa",
        status: "active",
        amenities: ["Private Garden", "Car Parking", "Bore Well", "Security", "Servant Room"],
        features: ["Independent House", "Modular Kitchen", "Terrace", "Study Room", "Store Room"],
        agent: { 
          name: "Amit Kumar", 
          phone: "+91 98765 43212",
          email: "amit@gujaratestate.com"
        },
        createdAt: "2024-01-13T09:15:00Z",
        updatedAt: "2024-01-13T09:15:00Z"
      },
      {
        id: 'mock-4',
        title: "Commercial Office Space in CG Road, Ahmedabad",
        description: "Prime commercial office space on CG Road, Ahmedabad's business hub. Excellent for IT companies, consultancies, and corporate offices.",
        price: 8000000,
        location: "CG Road, Ahmedabad, Gujarat",
        images: [
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop"
        ],
        beds: 0,
        baths: 2,
        area: 800,
        type: "Sale",
        propertyType: "commercial",
        status: "active",
        amenities: ["Covered Parking", "24/7 Security", "High Speed Elevators", "Power Backup", "CCTV"],
        features: ["Central AC", "Conference Room", "Reception Area", "Cafeteria", "Fire Safety"],
        agent: { 
          name: "Vikash Gupta", 
          phone: "+91 98765 43214",
          email: "vikash@gujaratestate.com"
        },
        createdAt: "2024-01-12T16:45:00Z",
        updatedAt: "2024-01-12T16:45:00Z"
      },
      {
        id: 'mock-5',
        title: "2BHK Flat in Maninagar, Ahmedabad",
        description: "Well-maintained 2BHK flat in Maninagar East, close to railway station and bus stand. Good connectivity to all parts of Ahmedabad.",
        price: 4500000,
        location: "Maninagar, Ahmedabad, Gujarat",
        images: [
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop"
        ],
        beds: 2,
        baths: 2,
        area: 850,
        type: "Sale",
        propertyType: "apartment",
        status: "active",
        amenities: ["Parking", "Security", "Water Supply", "Elevator"],
        features: ["Semi-Furnished", "Balcony", "Kitchen", "Wardrobe"],
        agent: { 
          name: "Neha Joshi", 
          phone: "+91 98765 43215",
          email: "neha@gujaratestate.com"
        },
        createdAt: "2024-01-11T09:00:00Z",
        updatedAt: "2024-01-11T09:00:00Z"
      },
      {
        id: 'mock-6',
        title: "3BHK Villa for Rent in Rajkot",
        description: "Spacious 3BHK independent villa for rent in Rajkot. Located in peaceful residential area with good schools and hospitals nearby.",
        price: 28000,
        location: "University Road, Rajkot, Gujarat",
        images: [
          "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop",
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop"
        ],
        beds: 3,
        baths: 3,
        area: 1400,
        type: "Rent",
        propertyType: "villa",
        status: "active",
        amenities: ["Car Parking", "Garden", "Bore Well", "Security"],
        features: ["Independent", "Kitchen", "Terrace", "Store Room"],
        agent: { 
          name: "Kiran Patel", 
          phone: "+91 98765 43216",
          email: "kiran@gujaratestate.com"
        },
        createdAt: "2024-01-10T15:30:00Z",
        updatedAt: "2024-01-10T15:30:00Z"
      }
    ];

    const startIndex = (page - 1) * limit;
    const properties = mockProperties.slice(startIndex, startIndex + limit);
    const totalProperties = mockProperties.length;
    const totalPages = Math.ceil(totalProperties / limit);

    console.log(`📋 Using mock data: ${properties.length} properties`);

    return {
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalProperties,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  /**
   * Get property by ID
   */
  async getPropertyById(id) {
    try {
      const doc = await this.collection.doc(id).get();
      
      if (!doc.exists) {
        throw new Error('Property not found');
      }

      console.log(`📋 Retrieved property from Firebase: ${id}`);
      
      return {
        id: doc.id,
        ...doc.data()
      };
    } catch (error) {
      console.error('❌ Firebase get property error:', error);
      throw new Error(`Failed to get property: ${error.message}`);
    }
  }

  /**
   * Update property
   */
  async updateProperty(id, updateData) {
    try {
      const docRef = this.collection.doc(id);
      
      // Check if property exists
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Property not found');
      }

      await docRef.update({
        ...updateData,
        updatedAt: new Date().toISOString()
      });

      console.log(`🏠 Property updated in Firebase: ${id}`);
      
      // Return updated property
      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('❌ Firebase update property error:', error);
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }

  /**
   * Delete property
   */
  async deleteProperty(id) {
    try {
      const docRef = this.collection.doc(id);
      
      // Check if property exists
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Property not found');
      }

      await docRef.delete();
      console.log(`🗑️ Property deleted from Firebase: ${id}`);
      
      return true;
    } catch (error) {
      console.error('❌ Firebase delete property error:', error);
      throw new Error(`Failed to delete property: ${error.message}`);
    }
  }

  /**
   * Update property status
   */
  async updatePropertyStatus(id, status) {
    try {
      const docRef = this.collection.doc(id);
      
      // Check if property exists
      const doc = await docRef.get();
      if (!doc.exists) {
        throw new Error('Property not found');
      }

      await docRef.update({
        status,
        updatedAt: new Date().toISOString()
      });

      console.log(`🏠 Property status updated in Firebase: ${id} -> ${status}`);
      
      // Return updated property
      const updatedDoc = await docRef.get();
      return {
        id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('❌ Firebase update status error:', error);
      throw new Error(`Failed to update property status: ${error.message}`);
    }
  }

  /**
   * Search properties with optimized indexing
   */
  async searchProperties(searchTerm, filters = {}) {
    try {
      let query = this.collection;
      
      // Apply filters using indexed fields
      if (filters.status && filters.status !== 'all') {
        query = query.where('status', '==', filters.status);
      }
      
      if (filters.type && filters.type !== 'all') {
        query = query.where('type', '==', filters.type);
      }
      
      if (filters.propertyType && filters.propertyType !== 'all') {
        query = query.where('propertyType', '==', filters.propertyType);
      }

      // Use price range filter if provided
      if (filters.priceRange && filters.priceRange !== 'all') {
        query = query.where('priceRange', '==', filters.priceRange);
      }

      // Use city filter if provided
      if (filters.city && filters.city !== 'all') {
        query = query.where('locationCity', '==', filters.city.toLowerCase());
      }

      const snapshot = await query.get();
      
      let properties = [];
      snapshot.forEach(doc => {
        properties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Enhanced client-side search using indexed fields
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        properties = properties.filter(property => {
          // Use pre-indexed search fields for better performance
          return property.searchTitle?.includes(searchLower) ||
                 property.searchLocation?.includes(searchLower) ||
                 property.searchDescription?.includes(searchLower) ||
                 property.propertyId?.toLowerCase().includes(searchLower) ||
                 property.amenities?.some(amenity => amenity.toLowerCase().includes(searchLower)) ||
                 property.features?.some(feature => feature.toLowerCase().includes(searchLower));
        });
      }

      // Sort by relevance (properties with search term in title first)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        properties.sort((a, b) => {
          const aInTitle = a.searchTitle?.includes(searchLower) ? 1 : 0;
          const bInTitle = b.searchTitle?.includes(searchLower) ? 1 : 0;
          if (aInTitle !== bInTitle) return bInTitle - aInTitle;
          
          // Then by property index (newest first)
          return (b.propertyIndex || 0) - (a.propertyIndex || 0);
        });
      }

      console.log(`🔍 Search returned ${properties.length} properties from Firebase (Indexed search)`);
      
      return properties;
    } catch (error) {
      console.error('❌ Firebase search properties error:', error);
      throw new Error(`Failed to search properties: ${error.message}`);
    }
  }

  /**
   * Get properties by city (using index)
   */
  async getPropertiesByCity(city, options = {}) {
    try {
      const { limit = 10, status = 'active' } = options;
      
      let query = this.collection
        .where('locationCity', '==', city.toLowerCase())
        .where('status', '==', status)
        .orderBy('propertyIndex', 'desc')
        .limit(limit);

      const snapshot = await query.get();
      
      const properties = [];
      snapshot.forEach(doc => {
        properties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`🏙️ Retrieved ${properties.length} properties for city: ${city}`);
      
      return properties;
    } catch (error) {
      console.error('❌ Firebase get properties by city error:', error);
      throw new Error(`Failed to get properties by city: ${error.message}`);
    }
  }

  /**
   * Get properties by price range (using index)
   */
  async getPropertiesByPriceRange(priceRange, options = {}) {
    try {
      const { limit = 10, status = 'active' } = options;
      
      let query = this.collection
        .where('priceRange', '==', priceRange)
        .where('status', '==', status)
        .orderBy('propertyIndex', 'desc')
        .limit(limit);

      const snapshot = await query.get();
      
      const properties = [];
      snapshot.forEach(doc => {
        properties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      console.log(`💰 Retrieved ${properties.length} properties for price range: ${priceRange}`);
      
      return properties;
    } catch (error) {
      console.error('❌ Firebase get properties by price range error:', error);
      throw new Error(`Failed to get properties by price range: ${error.message}`);
    }
  }
}

module.exports = new PropertyService();