import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SlidersHorizontal, MapPin, Home as HomeIcon, Building, Car } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../services/propertyService';

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all', // all, sale, rent
    propertyType: 'all', // all, apartment, villa, office, shop
    minPrice: '',
    maxPrice: '',
    beds: 'all', // all, 1, 2, 3, 4+
    location: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        const properties = await propertyService.getAllProperties();
        setAllProperties(properties);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
        // Fallback to mock data
        setAllProperties(mockProperties);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Fallback mock properties data
  const mockProperties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment in Kandivali West",
      price: 15000000,
      location: "Kandivali West, Mumbai",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      beds: 3,
      baths: 3,
      area: 1250,
      type: "Sale",
      propertyType: "apartment",
      agent: { name: "Rajesh Patel", phone: "+91 98765 43210" }
    },
    {
      id: 2,
      title: "Modern 2BHK for Rent",
      price: 35000,
      location: "Kandivali East, Mumbai", 
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      beds: 2,
      baths: 2,
      area: 950,
      type: "Rent",
      propertyType: "apartment",
      agent: { name: "Priya Shah", phone: "+91 98765 43211" }
    },
    {
      id: 3,
      title: "Spacious 4BHK Villa with Garden",
      price: 25000000,
      location: "Borivali West, Mumbai",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop",
      beds: 4,
      baths: 4,
      area: 2200,
      type: "Sale",
      propertyType: "villa",
      agent: { name: "Amit Kumar", phone: "+91 98765 43212" }
    },
    {
      id: 4,
      title: "Cozy 1BHK Studio Apartment",
      price: 25000,
      location: "Malad West, Mumbai",
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop",
      beds: 1,
      baths: 1,
      area: 600,
      type: "Rent",
      propertyType: "apartment",
      agent: { name: "Sneha Joshi", phone: "+91 98765 43213" }
    },
    {
      id: 5,
      title: "Commercial Office Space",
      price: 8000000,
      location: "Andheri West, Mumbai",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
      beds: 0,
      baths: 2,
      area: 800,
      type: "Sale",
      propertyType: "office",
      agent: { name: "Vikash Gupta", phone: "+91 98765 43214" }
    },
    {
      id: 6,
      title: "Retail Shop in Prime Location",
      price: 45000,
      location: "Kandivali West, Mumbai",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop",
      beds: 0,
      baths: 1,
      area: 500,
      type: "Rent",
      propertyType: "shop",
      agent: { name: "Deepika Sharma", phone: "+91 98765 43215" }
    },
    {
      id: 7,
      title: "Furnished 3BHK with Parking",
      price: 40000,
      location: "Borivali East, Mumbai",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=250&fit=crop",
      beds: 3,
      baths: 2,
      area: 1100,
      type: "Rent",
      propertyType: "apartment",
      agent: { name: "Ramesh Patil", phone: "+91 98765 43216" }
    },
    {
      id: 8,
      title: "Independent Villa with Pool",
      price: 35000000,
      location: "Malad West, Mumbai",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
      beds: 5,
      baths: 5,
      area: 3000,
      type: "Sale",
      propertyType: "villa",
      isSold: true,
      agent: { name: "Sunita Mehta", phone: "+91 98765 43217" }
    }
  ];

  // Filter properties based on search and filters
  const filteredProperties = useMemo(() => {
    return allProperties.filter(property => {
      const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filters.type === 'all' || property.type.toLowerCase() === filters.type;
      
      const matchesPropertyType = filters.propertyType === 'all' || property.propertyType === filters.propertyType;
      
      const matchesBeds = filters.beds === 'all' || 
                         (filters.beds === '4+' ? property.beds >= 4 : property.beds.toString() === filters.beds);
      
      const matchesMinPrice = !filters.minPrice || property.price >= parseInt(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || property.price <= parseInt(filters.maxPrice);

      return matchesSearch && matchesType && matchesPropertyType && matchesBeds && matchesMinPrice && matchesMaxPrice;
    });
  }, [searchTerm, filters, allProperties]);

  const locations = ['All Locations', 'Kandivali West', 'Kandivali East', 'Borivali West', 'Borivali East', 'Malad West', 'Andheri West'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Properties</h1>
            <p className="text-xl text-blue-100">Find your perfect property in Mumbai</p>
          </motion.div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search properties by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <SlidersHorizontal className="h-5 w-5" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-6 bg-gray-50 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Property For */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property For</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Types</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => setFilters({...filters, propertyType: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <select
                    value={filters.beds}
                    onChange={(e) => setFilters({...filters, beds: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Any</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4+">4+ BHK</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters({
                    type: 'all',
                    propertyType: 'all',
                    minPrice: '',
                    maxPrice: '',
                    beds: 'all',
                    location: 'all'
                  })}
                  className="text-primary hover:text-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{filteredProperties.length}</span> properties
              {searchTerm && (
                <span> for "<span className="font-semibold">{searchTerm}</span>"</span>
              )}
            </p>
          </div>

          {/* Properties Grid */}
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg p-8 shadow-sm max-w-md mx-auto">
                <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or filters to find more properties.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({
                      type: 'all',
                      propertyType: 'all',
                      minPrice: '',
                      maxPrice: '',
                      beds: 'all',
                      location: 'all'
                    });
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Properties;