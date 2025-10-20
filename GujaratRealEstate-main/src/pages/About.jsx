import { motion } from 'framer-motion';
import { Award, Users, Building2, MapPin, Clock, Shield, Star, CheckCircle } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Building2, number: "500+", label: "Properties Sold" },
    { icon: Users, number: "1000+", label: "Happy Clients" },
    { icon: Clock, number: "10+", label: "Years Experience" },
    { icon: Award, number: "50+", label: "Awards Won" }
  ];

  const timeline = [
    {
      year: "2014",
      title: "Company Founded",
      description: "Gujarat Estate Agency started with a vision to transform real estate in Mumbai"
    },
    {
      year: "2016", 
      title: "First 100 Sales",
      description: "Achieved our first milestone of 100 successful property transactions"
    },
    {
      year: "2018",
      title: "Digital Expansion", 
      description: "Launched online platform and expanded digital marketing presence"
    },
    {
      year: "2020",
      title: "Market Leader",
      description: "Became the leading real estate agency in Kandivali and surrounding areas"
    },
    {
      year: "2022",
      title: "Premium Services",
      description: "Introduced premium property management and investment consultation services"
    },
    {
      year: "2024",
      title: "Technology Innovation",
      description: "Launched AI-powered property matching and virtual tour services"
    }
  ];

  const team = [
    {
      name: "Rajesh Patel",
      role: "Founder & CEO",
      experience: "15+ years",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      description: "Expert in Mumbai real estate market with extensive network of developers and investors"
    },
    {
      name: "Priya Shah",
      role: "Sales Director", 
      experience: "12+ years",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b672?w=300&h=300&fit=crop",
      description: "Specialist in residential properties and client relationship management"
    },
    {
      name: "Amit Kumar",
      role: "Investment Advisor",
      experience: "10+ years", 
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      description: "Financial expert helping clients make smart property investment decisions"
    },
    {
      name: "Sneha Joshi",
      role: "Property Manager",
      experience: "8+ years",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop", 
      description: "Ensures smooth property transactions and handles legal documentation"
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency", 
      description: "We believe in honest dealings and transparent communication with all our clients"
    },
    {
      icon: Star,
      title: "Excellence in Service",
      description: "Committed to delivering exceptional service that exceeds client expectations"
    },
    {
      icon: Users,
      title: "Client-Centric Approach",
      description: "Every decision we make is focused on creating value for our clients"
    },
    {
      icon: CheckCircle,
      title: "Professional Integrity",
      description: "Maintaining highest standards of professionalism in all our dealings"
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
            backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop')"
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About Gujarat Estate Agency</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Your trusted real estate partner in Mumbai for over a decade, committed to helping you find your perfect property
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  Founded in 2014, Gujarat Estate Agency began with a simple mission: to revolutionize the real estate experience in Mumbai. Starting in Kandivali, we recognized the need for a more transparent, client-focused approach to property transactions.
                </p>
                <p>
                  Over the past decade, we have grown from a small local agency to one of Mumbai's most trusted real estate firms. Our deep understanding of the local market, combined with innovative technology and unwavering commitment to client satisfaction, has helped thousands of families find their dream homes.
                </p>
                <p>
                  Today, we continue to expand our services while maintaining the personal touch and integrity that has been the foundation of our success. Every property transaction is a new relationship, and we're honored to be part of our clients' most important life decisions.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
                alt="Gujarat Estate Agency Office"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Key milestones that shaped Gujarat Estate Agency into the trusted brand it is today
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary"></div>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className="flex-1 md:px-8">
                    <div className={`bg-white p-6 rounded-lg shadow-md ${
                      index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                    }`}>
                      <div className="text-2xl font-bold text-primary mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our experienced professionals are here to guide you through every step of your real estate journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md overflow-hidden group hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                  <div className="text-primary font-medium mb-1">{member.role}</div>
                  <div className="text-sm text-gray-500 mb-3">{member.experience}</div>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Gujarat Estate Agency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
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
              Ready to Work With Us?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Experience the Gujarat Estate Agency difference. Let us help you achieve your real estate goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-secondary text-lg px-8 py-4">
                View Properties
              </button>
              <button className="bg-white text-primary px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 text-lg">
                Contact Us Today
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;