import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import Logo from '../components/Logo';
import AnimatedLoader from '../components/AnimatedLoader';
import PageTransition from '../components/PageTransition';
import { propertyService } from '../services/propertyService';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState([]);

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

  // Fetch approved reviews for testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/reviews/approved');
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          // Use real reviews, limit to 6 for display
          setTestimonials(data.data.slice(0, 6));
        } else {
          // Fallback testimonials if no reviews available
          setTestimonials([
            {
              id: 1,
              userName: "Rajesh Patel",
              rating: 5,
              comment: "Gujarat Estate Agency helped me find my dream home in Kandivali West. Excellent service and professional approach!",
              createdAt: new Date().toISOString()
            },
            {
              id: 2,
              userName: "Priya Sharma",
              rating: 5,
              comment: "Very trustworthy and reliable. They guided us through the entire buying process in Borivali smoothly.",
              createdAt: new Date().toISOString()
            },
            {
              id: 3,
              userName: "Amit Kumar",
              rating: 5,
              comment: "Found the perfect rental apartment in Malad West within my budget. Highly recommended!",
              createdAt: new Date().toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        // Use fallback testimonials
        setTestimonials([
          {
            id: 1,
            userName: "Rajesh Patel",
            rating: 5,
            comment: "Gujarat Estate Agency helped me find my dream home in Kandivali West. Excellent service and professional approach!",
            createdAt: new Date().toISOString()
          }
        ]);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <PageTransition className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-blue-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating geometric shapes */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: "easeInOut"
              }}
            >
              {i % 3 === 0 ? (
                <div className="w-16 h-16 border-2 border-white rounded-full" />
              ) : i % 3 === 1 ? (
                <div className="w-12 h-12 bg-white transform rotate-45" />
              ) : (
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-white" />
              )}
            </motion.div>
          ))}
          
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2))",
                "linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(59, 130, 246, 0.1))",
                "linear-gradient(225deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.2))",
                "linear-gradient(315deg, rgba(37, 99, 235, 0.2), rgba(59, 130, 246, 0.1))"
              ]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Company Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 100 }}
              className="flex justify-center mb-8 relative"
            >
              <div className="relative">
                <Logo 
                  className="scale-150" 
                  variant="white"
                  iconClassName="h-12 w-12"
                  textClassName="text-2xl"
                  showText={true}
                />
                
                {/* Glowing effect around logo */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.3)",
                      "0 0 40px rgba(255, 255, 255, 0.5)",
                      "0 0 20px rgba(255, 255, 255, 0.3)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Find Your Dream Home in
              </motion.span>
              <motion.span 
                className="text-secondary block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <motion.span
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="bg-gradient-to-r from-secondary via-yellow-300 to-secondary bg-clip-text text-transparent"
                  style={{ backgroundSize: "200% 100%" }}
                >
                  Mumbai's Prime Areas
                </motion.span>
              </motion.span>
            </motion.h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Gujarat Estate Agency - Your trusted partner for buying, selling, and renting properties in Kandivali, Borivali, Malad, and nearby Mumbai areas.
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
                      <option value="jogeshwari-west">Jogeshwari West</option>
                      <option value="jogeshwari-east">Jogeshwari East</option>
                      <option value="andheri-west">Andheri West</option>
                      <option value="andheri-east">Andheri East</option>
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



      {/* Latest Properties Grid */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our premium property listings in Mumbai's most sought-after locations. Click "View Details" for complete information and high-quality images.
            </p>
          </motion.div>

          {isLoading ? (
            <div className="text-center py-16">
              <AnimatedLoader message="Loading properties..." size="large" />
            </div>
          ) : featuredProperties.length > 0 ? (
            <>
              {/* Properties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {featuredProperties.slice(0, 6).map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                ))}
              </div>

              {/* View All Button */}
              <div className="text-center">
                <button 
                  onClick={() => navigate('/properties')}
                  className="btn-primary inline-flex items-center px-8 py-3 text-lg"
                >
                  View All Properties
                  <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Property Stats */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="relative"
            >
              <motion.div 
                className="text-4xl font-bold mb-2"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                500+
              </motion.div>
              <div className="text-blue-100">Properties Listed</div>
              <motion.div
                className="absolute inset-0 border-2 border-white/20 rounded-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative"
            >
              <motion.div 
                className="text-4xl font-bold mb-2"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                1000+
              </motion.div>
              <div className="text-blue-100">Happy Clients</div>
              <motion.div
                className="absolute inset-0 border-2 border-white/20 rounded-lg"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative"
            >
              <motion.div 
                className="text-4xl font-bold mb-2"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                10+
              </motion.div>
              <div className="text-blue-100">Years Experience</div>
              <motion.div
                className="absolute inset-0 border-2 border-white/20 rounded-lg"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="relative"
            >
              <motion.div 
                className="text-4xl font-bold mb-2"
                animate={{ 
                  textShadow: [
                    "0 0 10px rgba(255,255,255,0.5)",
                    "0 0 20px rgba(255,255,255,0.8)",
                    "0 0 10px rgba(255,255,255,0.5)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              >
                50+
              </motion.div>
              <div className="text-blue-100">Mumbai Areas</div>
              <motion.div
                className="absolute inset-0 border-2 border-white/20 rounded-lg"
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
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
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-center group"
            >
              <motion.div 
                className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <MapPin className="h-8 w-8 text-primary relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-gray-600">
                Deep knowledge of Kandivali, Borivali, Malad and nearby Mumbai markets with insider insights on the best deals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-center group"
            >
              <motion.div 
                className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Star className="h-8 w-8 text-secondary relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-secondary/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">Trusted Service</h3>
              <p className="text-gray-600">
                Hundreds of satisfied customers with 5-star reviews and transparent dealings.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-center group"
            >
              <motion.div 
                className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <ArrowRight className="h-8 w-8 text-primary relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 rounded-full"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Support</h3>
              <p className="text-gray-600">
                From property search to legal documentation, we handle everything for you.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Property Types We Offer
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From luxury apartments to commercial spaces, find the perfect property type for your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/properties?propertyType=apartment')}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apartments</h3>
              <p className="text-gray-600 text-sm">Modern apartments in prime Mumbai locations</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/properties?propertyType=villa')}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Villas</h3>
              <p className="text-gray-600 text-sm">Spacious villas with gardens and privacy</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/properties?propertyType=commercial')}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Commercial</h3>
              <p className="text-gray-600 text-sm">Office spaces and retail properties</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate('/properties?propertyType=plot')}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Plots</h3>
              <p className="text-gray-600 text-sm">Residential and commercial land plots</p>
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
                  <h4 className="font-semibold text-gray-800">{testimonial.userName || testimonial.name}</h4>
                  <p className="text-sm text-gray-500">
                    {testimonial.location || new Date(testimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Home;