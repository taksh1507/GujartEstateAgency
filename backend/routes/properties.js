const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const { optionalAuth } = require('../middleware/auth');
const propertyService = require('../services/propertyService');

const router = express.Router();

/**
 * @route GET /api/properties
 * @desc Get all properties (public)
 * @access Public
 */
router.get('/', 
  optionalAuth,
  async (req, res) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        type, 
        propertyType, 
        minPrice, 
        maxPrice, 
        beds, 
        location 
      } = req.query;

      // Get properties from Firebase
      const result = await propertyService.getProperties({
        page: parseInt(page),
        limit: parseInt(limit),
        status: 'active' // Only show active properties to public
      });

      let filteredProperties = result.properties;

      // Apply client-side filters (since Firestore has limited query capabilities)
      if (type && type !== 'all') {
        filteredProperties = filteredProperties.filter(p => 
          p.type?.toLowerCase() === type.toLowerCase()
        );
      }

      if (propertyType && propertyType !== 'all') {
        filteredProperties = filteredProperties.filter(p => 
          p.propertyType === propertyType
        );
      }

      if (minPrice) {
        filteredProperties = filteredProperties.filter(p => 
          p.price >= parseInt(minPrice)
        );
      }

      if (maxPrice) {
        filteredProperties = filteredProperties.filter(p => 
          p.price <= parseInt(maxPrice)
        );
      }

      if (beds && beds !== 'all') {
        if (beds === '4+') {
          filteredProperties = filteredProperties.filter(p => p.beds >= 4);
        } else {
          filteredProperties = filteredProperties.filter(p => 
            p.beds === parseInt(beds)
          );
        }
      }

      if (location && location !== 'all') {
        filteredProperties = filteredProperties.filter(p => 
          p.location?.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Recalculate pagination for filtered results
      const totalFiltered = filteredProperties.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedProperties = filteredProperties.slice(startIndex, endIndex);

      res.json({
        success: true,
        data: {
          properties: paginatedProperties,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalFiltered / limit),
            totalProperties: totalFiltered,
            hasNext: endIndex < totalFiltered,
            hasPrev: startIndex > 0
          }
        }
      });

    } catch (error) {
      console.error('❌ Get properties error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch properties',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/properties/search
 * @desc Search properties
 * @access Public
 */
router.get('/search',
  validateRequest(schemas.searchProperties, 'query'),
  async (req, res) => {
    try {
      const { search, ...filters } = req.query;

      // Use Firebase search functionality
      const properties = await propertyService.searchProperties(search, {
        ...filters,
        status: 'active' // Only show active properties to public
      });

      res.json({
        success: true,
        data: {
          properties: properties,
          searchTerm: search,
          totalResults: properties.length
        }
      });

    } catch (error) {
      console.error('❌ Search properties error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Search failed',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/properties/featured
 * @desc Get featured properties
 * @access Public
 */
router.get('/featured', async (req, res) => {
  try {
    // Get active properties from Firebase
    const result = await propertyService.getProperties({
      page: 1,
      limit: 6,
      status: 'active',
      sortBy: 'newest'
    });

    res.json({
      success: true,
      data: {
        properties: result.properties,
        total: result.properties.length
      }
    });

  } catch (error) {
    console.error('❌ Get featured properties error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured properties',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/properties/by-city/:city
 * @desc Get properties by city
 * @access Public
 */
router.get('/by-city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const { limit = 10 } = req.query;

    const properties = await propertyService.getPropertiesByCity(city, {
      limit: parseInt(limit),
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        properties,
        city,
        total: properties.length
      }
    });

  } catch (error) {
    console.error('❌ Get properties by city error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties by city',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/properties/by-price-range/:range
 * @desc Get properties by price range
 * @access Public
 */
router.get('/by-price-range/:range', async (req, res) => {
  try {
    const { range } = req.params;
    const { limit = 10 } = req.query;

    const properties = await propertyService.getPropertiesByPriceRange(range, {
      limit: parseInt(limit),
      status: 'active'
    });

    res.json({
      success: true,
      data: {
        properties,
        priceRange: range,
        total: properties.length
      }
    });

  } catch (error) {
    console.error('❌ Get properties by price range error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch properties by price range',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * @route GET /api/properties/:id
 * @desc Get single property by ID
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await propertyService.getPropertyById(id);
    
    // Only show active properties to public (unless admin)
    if (property.status !== 'active' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }

    res.json({
      success: true,
      data: {
        property
      }
    });

  } catch (error) {
    console.error('❌ Get property error:', error);
    
    if (error.message === 'Property not found') {
      return res.status(404).json({
        success: false,
        error: 'Property not found'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch property',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;