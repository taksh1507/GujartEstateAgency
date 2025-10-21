import { Heart, MapPin, Bed, Bath, Square, Phone, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSavedProperties } from '../context/SavedPropertiesContext';
import InquiryModal from './InquiryModal';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, autoPlay = false }) => {
  const { isAuthenticated } = useAuth();
  const { isPropertySaved, toggleSavedProperty } = useSavedProperties();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const navigate = useNavigate();

  const isFavorite = isPropertySaved(property.id);

  const {
    id,
    title,
    price,
    location,
    image,
    images = [], // Google Drive images array
    beds,
    baths,
    area,
    type,
    status,
    isSold = false,
    agent = {
      name: "Gujarat Estate Agent",
      phone: "+91 98765 43210"
    }
  } = property;

  // Get all available images
  const allImages = images && images.length > 0 ? images : (image ? [image] : []);
  const hasMultipleImages = allImages.length > 1;
  const currentImage = allImages[currentImageIndex] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop';

  // Image navigation functions
  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const goToImage = (index, e) => {
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Touch/swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && hasMultipleImages) {
      nextImage(e);
    }
    if (isRightSwipe && hasMultipleImages) {
      prevImage(e);
    }
  };

  // Auto-play functionality (optional)
  useEffect(() => {
    if (autoPlay && hasMultipleImages && !isHovered) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, hasMultipleImages, isHovered, allImages.length]);

  // Handle save/unsave property
  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please sign in to save properties');
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const result = await toggleSavedProperty(id);
      if (result.success) {
        if (result.action === 'added') {
          toast.success('Property saved successfully!');
        } else {
          toast.success('Property removed from saved list');
        }
      }
    } catch (error) {
      console.error('Save toggle error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSaving(false);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card overflow-hidden group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with Navigation */}
      <div 
        className="relative overflow-hidden group/image"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.img
          key={currentImageIndex} // Force re-render for smooth transition
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={currentImage}
          alt={`${title} - Image ${currentImageIndex + 1}`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop';
          }}
        />
        
        {/* Navigation Arrows - Only show if multiple images */}
        {hasMultipleImages && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full opacity-0 group-hover/image:opacity-100 transition-opacity duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
        
        {/* Image Indicators */}
        {hasMultipleImages && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => goToImage(index, e)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}
        
        {/* Image Count Badge */}
        {hasMultipleImages && (
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {currentImageIndex + 1}/{allImages.length}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {(isSold || status === 'sold') && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              SOLD
            </span>
          )}
          {status === 'pending' && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              PENDING
            </span>
          )}
          <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
            {type}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleSaveToggle}
          disabled={isSaving}
          className={`absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors duration-200 ${
            isSaving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          title={isAuthenticated ? (isFavorite ? 'Remove from saved' : 'Save property') : 'Sign in to save properties'}
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            } ${isSaving ? 'animate-pulse' : ''}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-primary">{formatPrice(price)}</h3>
          {type === 'Rent' && <span className="text-sm text-gray-500">/month</span>}
        </div>

        {/* Property ID */}
        {property.propertyId && (
          <div className="mb-2">
            <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {property.propertyId}
            </span>
          </div>
        )}

        {/* Title */}
        <h4 className="font-semibold text-gray-800 mb-2 line-clamp-2">{title}</h4>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>

        {/* Property Details */}
        <div className="flex justify-between items-center mb-4 text-gray-600">
          <div className="flex items-center">
            <Bed className="h-4 w-4 mr-1" />
            <span className="text-sm">{beds} Beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-4 w-4 mr-1" />
            <span className="text-sm">{baths} Baths</span>
          </div>
          <div className="flex items-center">
            <Square className="h-4 w-4 mr-1" />
            <span className="text-sm">{area} sq ft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => setShowInquiryModal(true)}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Inquire Now
          </button>
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center bg-secondary text-white p-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
            title="Call Agent"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>

        {/* Inquiry Modal */}
        <InquiryModal
          isOpen={showInquiryModal}
          onClose={() => setShowInquiryModal(false)}
          property={property}
        />

        {/* Agent Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Listed by {agent.name}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;