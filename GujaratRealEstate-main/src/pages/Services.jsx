import { motion } from 'framer-motion';
import { 
  Home, 
  Building2, 
  Key, 
  TrendingUp, 
  FileText, 
  Users, 
  Calculator, 
  Shield,
  CheckCircle,
  ArrowRight,
  Phone,
  Star
} from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      icon: Home,
      title: "Property Sales",
      description: "Expert guidance for buying and selling residential and commercial properties in Mumbai",
      features: [
        "Market analysis and property valuation",
        "Professional photography and listing",
        "Negotiation and deal closure",
        "Legal documentation support",
        "Post-sale assistance"
      ],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop"
    },
    {
      icon: Key,
      title: "Property Rentals",
      description: "Comprehensive rental services for tenants and landlords with complete management support",
      features: [
        "Tenant screening and verification",
        "Lease agreement preparation",
        "Rent collection and management", 
        "Property maintenance coordination",
        "Dispute resolution support"
      ],
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&h=300&fit=crop"
    },
    {
      icon: TrendingUp,
      title: "Investment Consulting",
      description: "Strategic investment advice to help you build a profitable real estate portfolio",
      features: [
        "ROI analysis and projections",
        "Market trend analysis",
        "Investment strategy planning",
        "Risk assessment and mitigation",
        "Portfolio diversification advice"
      ],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    }
  ];

  const additionalServices = [
    {
      icon: FileText,
      title: "Legal Documentation",
      description: "Complete legal support for property transactions with experienced lawyers"
    },
    {
      icon: Calculator,
      title: "Property Valuation", 
      description: "Accurate market valuations using latest market data and expert analysis"
    },
    {
      icon: Building2,
      title: "Property Management",
      description: "Full-service property management for landlords and property investors"
    },
    {
      icon: Users,
      title: "Relocation Services",
      description: "End-to-end relocation assistance for individuals and corporate clients"
    },
    {
      icon: Shield,
      title: "Insurance & Finance",
      description: "Home loan assistance and property insurance solutions"
    },
    {
      icon: Star,
      title: "Premium Concierge",
      description: "Personalized service for high-value property transactions"
    }
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description: "We understand your requirements, budget, and preferences through detailed consultation"
    },
    {
      step: "02", 
      title: "Property Search",
      description: "Our experts curate a list of properties that match your specific criteria"
    },
    {
      step: "03",
      title: "Site Visits", 
      description: "Guided property visits with detailed information and area insights"
    },
    {
      step: "04",
      title: "Negotiation",
      description: "Professional negotiation to get you the best deal possible"
    },
    {
      step: "05",
      title: "Documentation",
      description: "Complete legal documentation and paperwork handling"
    },
    {
      step: "06",
      title: "Handover",
      description: "Smooth property handover with post-transaction support"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      service: "Property Purchase",
      rating: 5,
      comment: "Excellent service for buying my first home. The team guided me through every step.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
    },
    {
      name: "Priya Sharma", 
      service: "Rental Management",
      rating: 5,
      comment: "Professional rental management services. They handle everything perfectly.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b672?w=100&h=100&fit=crop"
    },
    {
      name: "Amit Patel",
      service: "Investment Consulting", 
      rating: 4,
      comment: "Great investment advice that helped me build a profitable property portfolio.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop')"
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive real estate solutions tailored to meet all your property needs in Mumbai
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Core Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our primary services designed to handle all aspects of your real estate journey
            </p>
          </motion.div>

          <div className="space-y-16">
            {mainServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                    <div className="flex items-center mb-6">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{service.title}</h3>
                    </div>
                    
                    <p className="text-gray-600 text-lg mb-6">{service.description}</p>
                    
                    <ul className="space-y-3 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-secondary mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="btn-primary">
                      Learn More
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-80 object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Additional Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Extended services to provide complete real estate solutions under one roof
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Process</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A streamlined 6-step process ensuring smooth and hassle-free property transactions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Client Testimonials</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              What our clients say about our services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-secondary fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.comment}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.service}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Our Services?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Contact us today to discuss your real estate needs. Our experts are ready to help you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+91-9876543210" className="btn-secondary text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5 inline" />
                Call: +91 98765 43210
              </a>
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-lg">
                Get Free Consultation
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;