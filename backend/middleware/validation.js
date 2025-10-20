const Joi = require('joi');

/**
 * Validate request middleware
 */
const validateRequest = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        message: errorMessage,
        details: error.details
      });
    }
    
    next();
  };
};

/**
 * Common validation schemas
 */
const schemas = {
  // Property schemas
  createProperty: Joi.object({
    title: Joi.string().min(3).max(200).required(),
    description: Joi.string().min(10).max(2000).required(),
    price: Joi.number().positive().required(),
    location: Joi.string().min(3).max(200).required(),
    type: Joi.string().valid('Sale', 'Rent').required(),
    propertyType: Joi.string().valid('apartment', 'villa', 'house', 'commercial', 'plot').required(),
    bedrooms: Joi.number().integer().min(0).max(20).required(),
    bathrooms: Joi.number().integer().min(0).max(20).required(),
    area: Joi.number().positive().required(),
    amenities: Joi.array().items(Joi.string()).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    status: Joi.string().valid('active', 'pending', 'sold', 'inactive').default('active')
  }),

  updateProperty: Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    description: Joi.string().min(10).max(2000).optional(),
    price: Joi.number().positive().optional(),
    location: Joi.string().min(3).max(200).optional(),
    type: Joi.string().valid('Sale', 'Rent').optional(),
    propertyType: Joi.string().valid('apartment', 'villa', 'house', 'commercial', 'plot').optional(),
    bedrooms: Joi.number().integer().min(0).max(20).optional(),
    bathrooms: Joi.number().integer().min(0).max(20).optional(),
    area: Joi.number().positive().optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    features: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string().uri()).optional(),
    status: Joi.string().valid('active', 'pending', 'sold', 'inactive').optional()
  }),

  // User schemas
  registerUser: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: Joi.string().min(6).max(100).required()
  }),

  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Inquiry schemas
  createInquiry: Joi.object({
    propertyId: Joi.string().required(),
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    message: Joi.string().min(10).max(1000).required(),
    inquiryType: Joi.string().valid('viewing', 'purchase', 'rent', 'information').default('information')
  }),

  // Search schemas
  searchProperties: Joi.object({
    search: Joi.string().min(1).max(100).optional(),
    type: Joi.string().valid('Sale', 'Rent', 'all').optional(),
    propertyType: Joi.string().valid('apartment', 'villa', 'house', 'commercial', 'plot', 'all').optional(),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    beds: Joi.alternatives().try(
      Joi.number().integer().min(0).max(20),
      Joi.string().valid('all', '4+')
    ).optional(),
    location: Joi.string().max(100).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

module.exports = {
  validateRequest,
  schemas
};