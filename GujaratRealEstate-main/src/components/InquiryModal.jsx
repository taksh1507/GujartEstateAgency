import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send, Phone, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const InquiryModal = ({ isOpen, onClose, property }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    inquiryType: 'general',
    contactPreference: 'both'
  });

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'viewing', label: 'Schedule Viewing' },
    { value: 'pricing', label: 'Price Negotiation' },
    { value: 'availability', label: 'Check Availability' }
  ];

  const contactPreferences = [
    { value: 'email', label: 'Email Only', icon: Mail },
    { value: 'phone', label: 'Phone Only', icon: Phone },
    { value: 'both', label: 'Email & Phone', icon: MessageCircle }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to make an inquiry');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter your message');
      return;
    }

    setIsLoading(true);
    try {
      const inquiryData = {
        propertyId: property.id,
        message: formData.message.trim(),
        inquiryType: formData.inquiryType,
        contactPreference: formData.contactPreference
      };

      const response = await authService.createInquiry(inquiryData);
      
      if (response.success) {
        toast.success('Inquiry submitted successfully! We will get back to you soon.');
        setFormData({
          message: '',
          inquiryType: 'general',
          contactPreference: 'both'
        });
        onClose();
      } else {
        toast.error(response.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      console.error('Submit inquiry error:', error);
      toast.error('Failed to submit inquiry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  if (!isOpen || !property) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold text-gray-800">Make an Inquiry</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Property Info */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex gap-4">
              <img
                src={property.image || property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=100&h=80&fit=crop'}
                alt={property.title}
                className="w-20 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 line-clamp-2">{property.title}</h3>
                <p className="text-primary font-bold">{formatPrice(property.price)}</p>
                <p className="text-sm text-gray-600">{property.location}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  Please sign in to make an inquiry. This helps us respond to you directly.
                </p>
              </div>
            )}

            {/* Inquiry Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type of Inquiry
              </label>
              <div className="grid grid-cols-2 gap-3">
                {inquiryTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.inquiryType === type.value
                        ? 'border-primary bg-blue-50 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="inquiryType"
                      value={type.value}
                      checked={formData.inquiryType === type.value}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                placeholder="Tell us about your requirements, preferred viewing time, or any questions you have..."
                required
                minLength={10}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.message.length}/1000 characters
              </p>
            </div>

            {/* Contact Preference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you like us to contact you?
              </label>
              <div className="space-y-2">
                {contactPreferences.map((pref) => {
                  const IconComponent = pref.icon;
                  return (
                    <label
                      key={pref.value}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.contactPreference === pref.value
                          ? 'border-primary bg-blue-50 text-primary'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactPreference"
                        value={pref.value}
                        checked={formData.contactPreference === pref.value}
                        onChange={(e) => setFormData({ ...formData, contactPreference: e.target.value })}
                        className="sr-only"
                      />
                      <IconComponent className="h-4 w-4 mr-3" />
                      <span className="text-sm font-medium">{pref.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* User Info Display */}
            {isAuthenticated && user && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  {user.phone && <p><strong>Phone:</strong> {user.phone}</p>}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !isAuthenticated}
                className="flex-1 bg-primary text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isLoading ? 'Sending...' : 'Send Inquiry'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default InquiryModal;