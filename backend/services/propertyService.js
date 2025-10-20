const { db } = require('../config/firebase');

class PropertyService {
  constructor() {
    this.collection = db.collection('properties');
  }

  /**
   * Create a new property
   */
  async createProperty(propertyData) {
    try {
      const docRef = await this.collection.add({
        ...propertyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      console.log(`🏠 Property created in Firebase: ${docRef.id}`);
      
      return {
        id: docRef.id,
        ...propertyData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Firebase create property error:', error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }

  /**
   * Get all properties with pagination
   */
  async getProperties(options = {}) {
    try {
      const { page = 1, limit = 10, status, type } = options;
      
      let query = this.collection.orderBy('createdAt', 'desc');
      
      // Apply filters
      if (status && status !== 'all') {
        query = query.where('status', '==', status);
      }
      
      if (type && type !== 'all') {
        query = query.where('type', '==', type);
      }
      
      // Apply pagination
      const offset = (page - 1) * limit;
      if (offset > 0) {
        const snapshot = await query.limit(offset).get();
        if (!snapshot.empty) {
          const lastDoc = snapshot.docs[snapshot.docs.length - 1];
          query = query.startAfter(lastDoc);
        }
      }
      
      const snapshot = await query.limit(limit).get();
      
      const properties = [];
      snapshot.forEach(doc => {
        properties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Get total count for pagination
      const totalSnapshot = await this.collection.get();
      const totalProperties = totalSnapshot.size;
      const totalPages = Math.ceil(totalProperties / limit);

      console.log(`📋 Retrieved ${properties.length} properties from Firebase`);

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
      throw new Error(`Failed to get properties: ${error.message}`);
    }
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
   * Search properties
   */
  async searchProperties(searchTerm, filters = {}) {
    try {
      let query = this.collection;
      
      // Apply filters
      if (filters.status && filters.status !== 'all') {
        query = query.where('status', '==', filters.status);
      }
      
      if (filters.type && filters.type !== 'all') {
        query = query.where('type', '==', filters.type);
      }
      
      if (filters.propertyType && filters.propertyType !== 'all') {
        query = query.where('propertyType', '==', filters.propertyType);
      }

      const snapshot = await query.get();
      
      let properties = [];
      snapshot.forEach(doc => {
        properties.push({
          id: doc.id,
          ...doc.data()
        });
      });

      // Client-side text search (Firestore doesn't support full-text search)
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        properties = properties.filter(property => 
          property.title?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower) ||
          property.location?.toLowerCase().includes(searchLower) ||
          property.amenities?.some(amenity => amenity.toLowerCase().includes(searchLower)) ||
          property.features?.some(feature => feature.toLowerCase().includes(searchLower))
        );
      }

      console.log(`🔍 Search returned ${properties.length} properties from Firebase`);
      
      return properties;
    } catch (error) {
      console.error('❌ Firebase search properties error:', error);
      throw new Error(`Failed to search properties: ${error.message}`);
    }
  }
}

module.exports = new PropertyService();