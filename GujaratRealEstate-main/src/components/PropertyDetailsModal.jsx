import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Phone, 
  MessageCircle, 
  Heart,
  Share2,
  Calendar,
  User,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedProperties } from '../context/SavedPropertiesContext';
import { propertyService } from '../services/propertyService';
import InquiryModal from './InquiryModal';
import LoadingLogo from './LoadingLogo';
import toast from 'react-hot-toast';

const PropertyDetailsModal = ({ isOpen, onClose, propertyId, initialProperty = null }) => {
  const { isAuthenticated } = useAuth();
  const { isPropertySaved, toggleSavedProperty } = useSavedProperties();
  
  const [property, setProperty] = useState(initialProperty);
  const [loading, setLoading] = useState(!initialProperty);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && propertyId && !initialProperty) {
      fetchProperty();
    } else if (initialProperty) {
      setProperty(initialProperty);
      setLoading(false);
    }
  }, [isOpen, propertyId, initialProperty]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertyService.getPropertyById(propertyId);
      setProperty(data);
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Property not found');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save properties');
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const result = await toggleSavedProperty(property.id);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: `${window.location.origin}/property/${property.id}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/property/${property.id}`);
      toast.success('Link copied to clipboard!');
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

  const nextImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  if (!isOpen) return null;

  const images = property?.images || [];
  const hasImages = images.length > 0;
  const isFavorite = property ? isPropertySaved(property.id) : false;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                <h2 className="text-xl font-semibold text-gray-800">Property Details</h2>
                <div className="flex items-center space-x-2">
                  {property && (
                    <>
                      <button
                        onClick={handleShare}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                        title="Share Property"
                      >
                        <Share2 className="h-5 w-5" />
                      </button>
                      
                      <button
                        onClick={handleSaveToggle}
                        disabled={isSaving}
                        className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
                          isSaving ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title={isAuthenticated ? (isFavorite ? 'Remove from saved' : 'Save property') : 'Sign in to save properties'}
                      >
                        <Heart
                          className={`h-5 w-5 transition-colors ${
                            isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
                          } ${isSaving ? 'animate-pulse' : ''}`}
                        />
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <LoadingLogo message="Loading property details..." />
                  </div>
                ) : error || !property ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Property Not Found</h3>
                      <p className="text-gray-600 mb-4">The property you're looking for doesn't exist or has been removed.</p>
                      <button onClick={onClose} className="btn-primary">
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                      {/* Image Gallery */}
                      {hasImages && (
                        <div className="mb-6">
                          <div className="relative">
                            <img
                              src={images[currentImageIndex]}
                              alt={`${property.title} - Image ${currentImageIndex + 1}`}
                              className="w-full h-80 object-cover rounded-lg cursor-pointer"
                              onClick={() => setShowImageModal(true)}
                            />
                            
                            {/* Expand Icon */}
                            <button
                              onClick={() => setShowImageModal(true)}
                              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                              title="View Full Screen"
                            >
                              <Maximize2 className="h-4 w-4" />
                            </button>
                            
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={prevImage}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={nextImage}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                                
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                  {currentImageIndex + 1} / {images.length}
                                </div>
                              </>
                            )}
                          </div>
                          
                          {/* Thumbnail Gallery */}
                          {images.length > 1 && (
                            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                              {images.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                                    index === currentImageIndex ? 'border-primary' : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                >
                                  <img
                                    src={image}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Property Info */}
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                {property.type}
                              </span>
                              {property.propertyId && (
                                <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {property.propertyId}
                                </span>
                              )}
                            </div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.title}</h1>
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{property.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{formatPrice(property.price)}</div>
                            {property.type === 'Rent' && <span className="text-gray-500">/month</span>}
                          </div>
                        </div>

                        {/* Property Features */}
                        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-200">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Bed className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="text-lg font-semibold">{property.beds}</div>
                            <div className="text-sm text-gray-600">Bedrooms</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Bath className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="text-lg font-semibold">{property.baths}</div>
                            <div className="text-sm text-gray-600">Bathrooms</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <Square className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="text-lg font-semibold">{property.area}</div>
                            <div className="text-sm text-gray-600">sq ft</div>
                          </div>
                        </div>

                        {/* Description */}
                        {property.description && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{property.description}</p>
                          </div>
                        )}

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {property.amenities.map((amenity, index) => (
                                <div key={index} className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                  <span className="text-gray-700 text-sm">{amenity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Features */}
                        {property.features && property.features.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3">Features</h3>
                            <div className="grid grid-cols-2 gap-2">
                              {property.features.map((feature, index) => (
                                <div key={index} className="flex items-center">
                                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                                  <span className="text-gray-700 text-sm">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      {/* Contact Card */}
                      <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
                        <div className="text-center mb-6">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-lg font-semibold">{property.agent?.name || 'Gujarat Estate Agent'}</h3>
                          <p className="text-gray-600 text-sm">Property Agent</p>
                        </div>

                        <div className="space-y-3">
                          <button
                            onClick={() => setShowInquiryModal(true)}
                            className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            Send Inquiry
                          </button>
                          
                          <a
                            href={`tel:${property.agent?.phone || '+91 98765 43210'}`}
                            className="w-full bg-secondary text-white py-3 px-4 rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center justify-center gap-2"
                          >
                            <Phone className="h-4 w-4" />
                            Call Now
                          </a>
                        </div>

                        {/* Property Stats */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-600 mb-2">
                            <Calendar className="h-4 w-4 mr-2" />
                            Listed on {new Date(property.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                          {property.updatedAt && property.updatedAt !== property.createdAt && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              Updated on {new Date(property.updatedAt).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Full Screen Image Modal */}
          {showImageModal && hasImages && (
            <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center">
              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              >
                <X className="h-8 w-8" />
              </button>
              
              <div className="relative max-w-5xl max-h-full">
                <img
                  src={images[currentImageIndex]}
                  alt={`${property.title} - Image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Inquiry Modal */}
          <InquiryModal
            isOpen={showInquiryModal}
            onClose={() => setShowInquiryModal(false)}
            property={property}
          />
        </div>
      )}
    </AnimatePresence>
  );
};

export default PropertyDetailsModal;