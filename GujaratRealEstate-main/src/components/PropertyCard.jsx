import { Heart, MapPin, Bed, Bath, Square, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const PropertyCard = ({ property }) => {
  const [isFavorite, setIsFavorite] = useState(false);

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

  // Get the primary image (first Google Drive image or fallback)
  const primaryImage = images && images.length > 0 ? images[0] : image;

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
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={primaryImage || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop'}
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback if Google Drive image fails to load
            e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop';
          }}
        />
        
        {/* Image Count Badge */}
        {images && images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-xs">
            +{images.length - 1} more
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
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full transition-colors duration-200"
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
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
          <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
            View Details
          </button>
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center justify-center bg-secondary text-white p-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
          >
            <Phone className="h-4 w-4" />
          </a>
        </div>

        {/* Agent Info */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Listed by {agent.name}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;