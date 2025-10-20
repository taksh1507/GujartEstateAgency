import { motion } from 'framer-motion';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import PropertyCard from '../components/PropertyCard';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Home = () => {
  // Sample data - replace with actual data
  const featuredProperties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment in Kandivali West",
      price: 8500000,
      location: "Kandivali West, Mumbai",
      image: "/api/placeholder/400/250",
      beds: 3,
      baths: 2,
      area: 1200,
      type: "Sale"
    },
    {
      id: 2,
      title: "Modern 2BHK Flat for Rent",
      price: 35000,
      location: "Kandivali East, Mumbai",
      image: "/api/placeholder/400/250",
      beds: 2,
      baths: 1,
      area: 850,
      type: "Rent"
    },
    {
      id: 3,
      title: "Spacious 4BHK Villa with Garden",
      price: 15000000,
      location: "Borivali West, Mumbai",
      image: "/api/placeholder/400/250",
      beds: 4,
      baths: 3,
      area: 2000,
      type: "Sale"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Rajesh Patel",
      rating: 5,
      comment: "Gujarat Estate Agency helped me find my dream home. Excellent service and professional approach!",
      location: "Kandivali West"
    },
    {
      id: 2,
      name: "Priya Sharma",
      rating: 5,
      comment: "Very trustworthy and reliable. They guided us through the entire buying process smoothly.",
      location: "Borivali East"
    },
    {
      id: 3,
      name: "Amit Kumar",
      rating: 5,
      comment: "Found the perfect rental property within my budget. Highly recommended!",
      location: "Kandivali East"
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
              <span className="text-secondary block">Kandivali & Mumbai</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Gujarat Estate Agency - Your trusted partner for buying, selling, and renting properties in Mumbai's prime locations.
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
                    <select className="input-field pl-10 text-gray-800">
                      <option>Kandivali West</option>
                      <option>Kandivali East</option>
                      <option>Borivali West</option>
                      <option>Borivali East</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                  <select className="input-field text-gray-800">
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <select className="input-field text-gray-800">
                    <option>Any Budget</option>
                    <option>Under 50L</option>
                    <option>50L - 1Cr</option>
                    <option>Above 1Cr</option>
                  </select>
                </div>
                <button className="btn-secondary flex items-center justify-center">
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
            <button className="btn-primary inline-flex items-center">
              View All Properties
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
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