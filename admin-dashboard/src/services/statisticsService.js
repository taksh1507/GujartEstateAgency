import { propertiesAPI } from './api';

class StatisticsService {
  // Calculate real statistics from properties data
  async getDashboardStats() {
    try {
      // Fetch all properties to calculate statistics
      const propertiesResponse = await propertiesAPI.getAll({ limit: 1000 });
      
      if (!propertiesResponse.success) {
        throw new Error('Failed to fetch properties data');
      }

      const properties = propertiesResponse.data.properties || [];
      
      // Calculate basic stats
      const totalProperties = properties.length;
      const activeProperties = properties.filter(p => p.status === 'active').length;
      const soldProperties = properties.filter(p => p.status === 'sold').length;
      const pendingProperties = properties.filter(p => p.status === 'pending').length;
      
      // Calculate revenue from sold properties
      const monthlyRevenue = properties
        .filter(p => p.status === 'sold' && this.isCurrentMonth(p.updatedAt || p.createdAt))
        .reduce((total, property) => total + (property.price || 0), 0);
      
      // Calculate total portfolio value
      const totalValue = properties.reduce((total, property) => total + (property.price || 0), 0);
      
      // Get recent properties (last 10)
      const recentProperties = properties
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(property => ({
          id: property.id,
          title: property.title,
          price: property.price,
          status: property.status,
          location: property.location,
          createdAt: property.createdAt,
          image: property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop',
          beds: property.beds,
          baths: property.baths,
          area: property.area
        }));

      // Calculate growth percentages
      const lastMonthProperties = properties.filter(p => this.isLastMonth(p.createdAt));
      const currentMonthProperties = properties.filter(p => this.isCurrentMonth(p.createdAt));
      
      const propertyGrowth = this.calculateGrowthPercentage(
        lastMonthProperties.length,
        currentMonthProperties.length
      );

      const lastMonthActive = properties.filter(p => 
        p.status === 'active' && this.isLastMonth(p.createdAt)
      ).length;
      const currentMonthActive = properties.filter(p => 
        p.status === 'active' && this.isCurrentMonth(p.createdAt)
      ).length;
      
      const activeGrowth = this.calculateGrowthPercentage(lastMonthActive, currentMonthActive);

      // Calculate average property price
      const averagePrice = totalProperties > 0 ? totalValue / totalProperties : 0;
      
      // Property type distribution
      const propertyTypes = this.getPropertyTypeDistribution(properties);
      
      // Location distribution
      const locationStats = this.getLocationDistribution(properties);
      
      // Price range distribution
      const priceRanges = this.getPriceRangeDistribution(properties);

      return {
        totalProperties,
        activeProperties,
        soldProperties,
        pendingProperties,
        monthlyRevenue,
        totalValue,
        averagePrice,
        propertyGrowth,
        activeGrowth,
        recentProperties,
        propertyTypes,
        locationStats,
        priceRanges,
        // Mock data for users and inquiries (you can replace with real API calls)
        totalUsers: this.generateRealisticUserCount(totalProperties),
        totalInquiries: this.generateRealisticInquiryCount(activeProperties),
        recentInquiries: this.generateMockInquiries(recentProperties)
      };
    } catch (error) {
      console.error('Failed to fetch dashboard statistics:', error);
      throw error;
    }
  }

  // Helper methods
  isCurrentMonth(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  isLastMonth(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
  }

  calculateGrowthPercentage(oldValue, newValue) {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return Math.round(((newValue - oldValue) / oldValue) * 100);
  }

  getPropertyTypeDistribution(properties) {
    const distribution = {};
    properties.forEach(property => {
      const type = property.propertyType || property.type || 'Unknown';
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  }

  getLocationDistribution(properties) {
    const distribution = {};
    properties.forEach(property => {
      const location = property.location || 'Unknown';
      distribution[location] = (distribution[location] || 0) + 1;
    });
    
    // Return top 5 locations
    return Object.entries(distribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
  }

  getPriceRangeDistribution(properties) {
    const ranges = {
      'Under ₹50L': 0,
      '₹50L - ₹1Cr': 0,
      '₹1Cr - ₹2Cr': 0,
      '₹2Cr - ₹5Cr': 0,
      'Above ₹5Cr': 0
    };

    properties.forEach(property => {
      const price = property.price || 0;
      if (price < 5000000) ranges['Under ₹50L']++;
      else if (price < 10000000) ranges['₹50L - ₹1Cr']++;
      else if (price < 20000000) ranges['₹1Cr - ₹2Cr']++;
      else if (price < 50000000) ranges['₹2Cr - ₹5Cr']++;
      else ranges['Above ₹5Cr']++;
    });

    return ranges;
  }

  generateRealisticUserCount(totalProperties) {
    // Estimate users based on properties (roughly 3-5 users per property)
    return Math.floor(totalProperties * (3 + Math.random() * 2));
  }

  generateRealisticInquiryCount(activeProperties) {
    // Estimate inquiries based on active properties (roughly 1-3 inquiries per active property)
    return Math.floor(activeProperties * (1 + Math.random() * 2));
  }

  generateMockInquiries(recentProperties) {
    const inquiryTemplates = [
      'Interested in viewing this property',
      'Need more details about pricing',
      'Is this property still available?',
      'Can we schedule a site visit?',
      'What are the nearby amenities?',
      'Is the price negotiable?',
      'Looking for similar properties in the area'
    ];

    const names = [
      'Amit Kumar', 'Priya Shah', 'Rajesh Patel', 'Neha Gupta', 'Vikram Singh',
      'Kavya Sharma', 'Arjun Mehta', 'Riya Joshi', 'Karan Agarwal', 'Pooja Desai'
    ];

    return recentProperties.slice(0, 3).map((property, index) => ({
      id: index + 1,
      propertyTitle: property.title,
      userName: names[Math.floor(Math.random() * names.length)],
      message: inquiryTemplates[Math.floor(Math.random() * inquiryTemplates.length)],
      status: Math.random() > 0.5 ? 'new' : 'responded',
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  // Get monthly statistics for charts
  async getMonthlyStats() {
    try {
      const propertiesResponse = await propertiesAPI.getAll({ limit: 1000 });
      
      if (!propertiesResponse.success) {
        throw new Error('Failed to fetch properties data');
      }

      const properties = propertiesResponse.data.properties || [];
      
      // Group properties by month for the last 12 months
      const monthlyData = {};
      const now = new Date();
      
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
        monthlyData[monthKey] = {
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          properties: 0,
          revenue: 0,
          inquiries: 0
        };
      }

      // Populate with actual data
      properties.forEach(property => {
        const createdDate = new Date(property.createdAt);
        const monthKey = createdDate.toISOString().slice(0, 7);
        
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].properties++;
          if (property.status === 'sold') {
            monthlyData[monthKey].revenue += property.price || 0;
          }
          // Estimate inquiries (1-2 per property)
          monthlyData[monthKey].inquiries += Math.floor(1 + Math.random());
        }
      });

      return Object.values(monthlyData);
    } catch (error) {
      console.error('Failed to fetch monthly statistics:', error);
      throw error;
    }
  }
}

export default new StatisticsService();