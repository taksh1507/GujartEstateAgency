import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { propertyService } from '../services/propertyService';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch featured properties from API
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching featured properties from API...');
        const properties = await propertyService.getFeaturedProperties();
        console.log('Featured properties received:', properties);
        
        if (Array.isArray(properties) && properties.length > 0) {
          setFeaturedProperties(properties.slice(0, 6)); // Show max 6 featured properties
          console.log('✅ Featured properties loaded from API');
        } else {
          // Fallback to sample data if no properties from API
          console.log('⚠️ No featured properties from API, using sample data');
          setFeaturedProperties([
            {
              id: 'sample-1',
              title: "Luxury 3BHK Apartment in Kandivali West",
              price: 12500000,
              location: "Kandivali West, Mumbai",
              images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"],
              beds: 3,
              baths: 2,
              area: 1200,
              type: "Sale",
              propertyType: "apartment",
              status: "active",
              agent: { name: "Mumbai Estate Agent", phone: "+91 98765 43210" }
            },
            {
              id: 'sample-2',
              title: "Modern 2BHK for Rent in Kandivali East",
              price: 45000,
              location: "Kandivali East, Mumbai",
              images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop"],
              beds: 2,
              baths: 1,
              area: 850,
              type: "Rent",
              propertyType: "apartment",
              status: "active",
              agent: { name: "Mumbai Estate Agent", phone: "+91 98765 43210" }
            },
            {
              id: 'sample-3',
              title: "Spacious 4BHK Villa in Borivali West",
              price: 25000000,
              location: "Borivali West, Mumbai",
              images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop"],
              beds: 4,
              baths: 3,
              area: 2000,
              type: "Sale",
              propertyType: "villa",
              status: "active",
              agent: { name: "Mumbai Estate Agent", phone: "+91 98765 43210" }
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch featured properties:', error);
        // Use sample data as fallback
        setFeaturedProperties([
          {
            id: 'fallback-1',
            title: "Premium Properties Available",
            price: 8000000,
            location: "Kandivali, Mumbai",
            images: ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop"],
            beds: 3,
            baths: 2,
            area: 1000,
            type: "Sale",
            propertyType: "apartment",
            status: "active",
            agent: { name: "Mumbai Estate Agent", phone: "+91 98765 43210" }
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProperties();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Patel",
      rating: 5,
      comment: "Mumbai Estate Agency helped me find my dream home in Kandivali West. Excellent service and professional approach!",
      location: "Kandivali West, Mumbai"
    },
    {
      id: 2,
      name: "Priya Sharma",
      rating: 5,
      comment: "Very trustworthy and reliable. They guided us through the entire buying process in Borivali smoothly.",
      location: "Borivali West, Mumbai"
    },
    {
      id: 3,
      name: "Amit Kumar",
      rating: 5,
      comment: "Found the perfect rental apartment in Malad within my budget. Highly recommended!",
      location: "Malad West, Mumbai"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Dream Home in
              <span className="text-secondary block">Mumbai's Prime Locations</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Mumbai Estate Agency - Your trusted partner for buying, selling, and renting properties in Kandivali, Borivali, Malad, and Goregaon.
            </p>
            
            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-white p-4 rounded-lg shadow-lg max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <select 
                      id="location-select"
                      className="input-field pl-10 text-gray-800"
                    >
                      <option value="">All Locations</option>
                      <option value="kandivali-west">Kandivali West</option>
                      <option value="kandivali-east">Kandivali East</option>
                      <option value="borivali-west">Borivali West</option>
                      <option value="borivali-east">Borivali East</option>
                      <option value="malad-west">Malad West</option>
                      <option value="malad-east">Malad East</option>
                      <option value="goregaon-west">Goregaon West</option>
                      <option value="goregaon-east">Goregaon East</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select 
                    id="type-select"
                    className="input-field text-gray-800"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <select 
                    id="budget-select"
                    className="input-field text-gray-800"
                  >
                    <option value="">Any Budget</option>
                    <option value="0-2500000">Under 25L</option>
                    <option value="2500000-5000000">25L - 50L</option>
                    <option value="5000000-10000000">50L - 1Cr</option>
                    <option value="10000000-999999999">Above 1Cr</option>
                  </select>
                </div>
                <button 
                  onClick={() => {
                    const location = document.getElementById('location-select').value;
                    const type = document.getElementById('type-select').value;
                    const budget = document.getElementById('budget-select').value;
                    
                    // Navigate to properties page with search parameters
                    const params = new URLSearchParams();
                    if (location) params.set('location', location);
                    if (type) params.set('propertyType', type);
                    if (budget) {
                      const [min, max] = budget.split('-');
                      if (min) params.set('minPrice', min);
                      if (max) params.set('maxPrice', max);
                    }
                    
                    navigate(`/properties?${params.toString()}`);
                  }}
                  className="btn-secondary flex items-center justify-center"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our hand-picked selection of premium properties in Mumbai's most sought-after locations.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading featured properties...</p>
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 }
                }}
                className="pb-12"
              >
                {featuredProperties.map((property) => (
                  <SwiperSlide key={property.id}>
                    <PropertyCard property={property} />
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="text-center mt-8">
                <button 
                  onClick={() => navigate('/properties')}
                  className="btn-primary inline-flex items-center"
                >
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg p-8 shadow-sm max-w-md mx-auto">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Available</h3>
                <p className="text-gray-600 mb-4">
                  We're currently updating our property listings. Please check back soon!
                </p>
                <button 
                  onClick={() => navigate('/contact')}
                  className="btn-primary"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Gujarat Estate Agency?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              With over 10 years of experience in Mumbai's real estate market, we're your trusted partner.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Deep knowledge of Kandivali and Mumbai markets with insider insights on the best deals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Service</h3>
              <p className="text-gray-600">
                Hundreds of satisfied customers with 5-star reviews and transparent dealings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Support</h3>
              <p className="text-gray-600">
                From property search to legal documentation, we handle everything for you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="card p-6"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;