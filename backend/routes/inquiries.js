const express = require('express');
const { validateRequest, schemas } = require('../middleware/validation');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Mock inquiries storage (replace with database in production)
let mockInquiries = [
  {
    id: 1,
    propertyId: 1,
    propertyTitle: "Luxury 3BHK Apartment in Ahmedabad",
    name: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 98765 43210",
    message: "I am interested in viewing this property. When can I schedule a visit?",
    inquiryType: "viewing",
    status: "new",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    propertyId: 2,
    propertyTitle: "Modern 2BHK for Rent in Surat",
    name: "Neha Patel",
    email: "neha@example.com",
    phone: "+91 98765 43211",
    message: "Need more details about the pricing and lease terms. Is the property available immediately?",
    inquiryType: "rent",
    status: "responded",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T16:45:00Z"
  }
];

/**
 * @route POST /api/inquiries
 * @desc Submit property inquiry
 * @access Public
 */
router.post('/',
  validateRequest(schemas.createInquiry),
  async (req, res) => {
    try {
      const { propertyId, name, email, phone, message, inquiryType } = req.body;

      console.log(`📧 New inquiry received for property ${propertyId} from ${email}`);

      // Create new inquiry
      const newInquiry = {
        id: Date.now(),
        propertyId: parseInt(propertyId),
        propertyTitle: `Property ${propertyId}`, // In real app, fetch from database
        name,
        email,
        phone,
        message,
        inquiryType: inquiryType || 'information',
        status: 'new',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to mock storage
      mockInquiries.push(newInquiry);

      console.log(`✅ Inquiry created successfully: ID ${newInquiry.id}`);

      // In a real application, you might want to:
      // 1. Send email notification to admin
      // 2. Send confirmation email to user
      // 3. Create notification in admin dashboard

      res.status(201).json({
        success: true,
        data: {
          inquiry: newInquiry
        },
        message: 'Inquiry submitted successfully. We will contact you soon!'
      });

    } catch (error) {
      console.error('❌ Create inquiry error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to submit inquiry',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/inquiries
 * @desc Get user's inquiries (if authenticated) or all inquiries (if admin)
 * @access Private
 */
router.get('/',
  optionalAuth,
  async (req, res) => {
    try {
      let filteredInquiries = [...mockInquiries];

      // If user is authenticated but not admin, only show their inquiries
      if (req.user && req.user.role !== 'admin') {
        filteredInquiries = filteredInquiries.filter(inquiry => 
          inquiry.email === req.user.email
        );
      }

      // If not authenticated, return empty array
      if (!req.user) {
        filteredInquiries = [];
      }

      res.json({
        success: true,
        data: {
          inquiries: filteredInquiries,
          total: filteredInquiries.length
        }
      });

    } catch (error) {
      console.error('❌ Get inquiries error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch inquiries',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/inquiries/:id
 * @desc Get single inquiry by ID
 * @access Private
 */
router.get('/:id',
  optionalAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const inquiry = mockInquiries.find(inq => inq.id === parseInt(id));
      
      if (!inquiry) {
        return res.status(404).json({
          success: false,
          error: 'Inquiry not found'
        });
      }

      // Check if user can access this inquiry
      if (req.user && req.user.role !== 'admin' && inquiry.email !== req.user.email) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }

      res.json({
        success: true,
        data: {
          inquiry
        }
      });

    } catch (error) {
      console.error('❌ Get inquiry error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch inquiry',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

/**
 * @route GET /api/inquiries/property/:propertyId
 * @desc Get inquiries for a specific property
 * @access Public (limited info) / Private (full info)
 */
router.get('/property/:propertyId',
  optionalAuth,
  async (req, res) => {
    try {
      const { propertyId } = req.params;
      
      let propertyInquiries = mockInquiries.filter(
        inquiry => inquiry.propertyId === parseInt(propertyId)
      );

      // If not admin, only return count and basic info
      if (!req.user || req.user.role !== 'admin') {
        return res.json({
          success: true,
          data: {
            totalInquiries: propertyInquiries.length,
            recentInquiries: propertyInquiries.slice(0, 3).map(inquiry => ({
              id: inquiry.id,
              inquiryType: inquiry.inquiryType,
              status: inquiry.status,
              createdAt: inquiry.createdAt
            }))
          }
        });
      }

      // Admin gets full details
      res.json({
        success: true,
        data: {
          inquiries: propertyInquiries,
          total: propertyInquiries.length
        }
      });

    } catch (error) {
      console.error('❌ Get property inquiries error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Failed to fetch property inquiries',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
      });
    }
  }
);

module.exports = router;