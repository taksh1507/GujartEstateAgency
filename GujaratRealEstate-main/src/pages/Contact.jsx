import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  Send, 
  CheckCircle,
  Building2,
  Users,
  Calendar
} from 'lucide-react';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    console.log('Form submitted:', data);
    // Here you would typically send the data to your backend
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Office",
      details: [
        "Shop No. 15, Ground Floor",
        "Kandivali West, Mumbai - 400067",
        "Maharashtra, India"
      ],
      action: "Get Directions"
    },
    {
      icon: Phone,
      title: "Call Us", 
      details: [
        "Primary: +91 98765 43210",
        "Secondary: +91 98765 43211",
        "Landline: 022-2845-6789"
      ],
      action: "Call Now"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "General: info@gujaratestate.com", 
        "Sales: sales@gujaratestate.com",
        "Support: support@gujaratestate.com"
      ],
      action: "Send Email"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Saturday: 9:00 AM - 8:00 PM",
        "Sunday: 10:00 AM - 6:00 PM",
        "Public Holidays: By Appointment"
      ],
      action: "Book Meeting"
    }
  ];

  const quickActions = [
    {
      icon: Building2,
      title: "Property Inquiry",
      description: "Ask about specific properties or get market information"
    },
    {
      icon: Users,
      title: "Schedule Visit",
      description: "Book a property visit or office consultation"
    },
    {
      icon: Calendar,
      title: "Investment Consultation", 
      description: "Discuss investment opportunities and strategies"
    },
    {
      icon: MessageSquare,
      title: "General Support",
      description: "Get help with any real estate related questions"
    }
  ];

  const officeTeam = [
    { name: "Rajesh Patel", role: "Branch Manager", phone: "+91 98765 43210" },
    { name: "Priya Shah", role: "Sales Director", phone: "+91 98765 43211" },
    { name: "Amit Kumar", role: "Investment Advisor", phone: "+91 98765 43212" },
    { name: "Sneha Joshi", role: "Property Manager", phone: "+91 98765 43213" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920&h=1080&fit=crop')"
          }}
        ></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Get in touch with Gujarat Estate Agency. We're here to help you with all your real estate needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Get In Touch</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Multiple ways to reach us. Choose what's most convenient for you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow duration-300"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">{info.title}</h3>
                  <div className="space-y-2 mb-6">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 text-sm">{detail}</p>
                    ))}
                  </div>
                  <button className="text-primary font-medium hover:text-blue-700 transition-colors">
                    {info.action}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
              
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center"
                >
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800">Message sent successfully! We'll get back to you soon.</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register("firstName", { required: "First name is required" })}
                      className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register("lastName", { required: "Last name is required" })}
                      className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      {...register("phone", { required: "Phone number is required" })}
                      className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    {...register("subject", { required: "Subject is required" })}
                    className={`input-field ${errors.subject ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a subject</option>
                    <option value="property-inquiry">Property Inquiry</option>
                    <option value="schedule-visit">Schedule Visit</option>
                    <option value="investment-consultation">Investment Consultation</option>
                    <option value="property-valuation">Property Valuation</option>
                    <option value="rental-services">Rental Services</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    {...register("message", { required: "Message is required" })}
                    className={`input-field resize-none ${errors.message ? 'border-red-500' : ''}`}
                    placeholder="Tell us about your requirements..."
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <button type="submit" className="btn-primary w-full text-lg">
                  <Send className="mr-2 h-5 w-5" />
                  Send Message
                </button>
              </form>
            </motion.div>

            {/* Map & Office Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Visit Our Office</h3>
              
              {/* Map Placeholder */}
              <div className="bg-gray-200 h-64 rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">Kandivali West, Mumbai</p>
                </div>
              </div>

              {/* Office Team */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Our Team</h4>
                <div className="space-y-3">
                  {officeTeam.map((member, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.role}</div>
                      </div>
                      <a
                        href={`tel:${member.phone}`}
                        className="text-primary hover:text-blue-700 font-medium"
                      >
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Need immediate assistance? Choose from our quick action options.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-6 text-center hover:shadow-lg transition-all duration-300 cursor-pointer"
                >
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm">{action.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Need Immediate Assistance?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Our team is available to help you with urgent property matters.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+91-9876543210" className="btn-secondary text-lg px-8 py-4">
                <Phone className="mr-2 h-5 w-5 inline" />
                Call: +91 98765 43210
              </a>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-8 py-4 rounded-lg font-medium hover:bg-green-600 transition-colors duration-200 text-lg"
              >
                <MessageSquare className="mr-2 h-5 w-5 inline" />
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;