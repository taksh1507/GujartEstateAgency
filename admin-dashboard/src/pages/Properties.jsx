import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  MapPin,
  Calendar,
  Building,
  ChevronLeft,
  ChevronRight,
  Grid,
  List,
  Image as ImageIcon
} from 'lucide-react';
import { propertiesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

// Image URL handling will be configured later

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    fetchProperties();
  }, [currentPage, searchTerm, filterStatus]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);

      // Fetch properties from backend API
      const response = await propertiesAPI.getAll({
        page: currentPage,
        limit: 10,
        status: filterStatus !== 'all' ? filterStatus : undefined
      });

      if (response.success) {
        setProperties(response.data.properties);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        throw new Error(response.message || 'Failed to fetch properties');
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      toast.error('Failed to load properties');

      // Fallback to empty array if API fails
      setProperties([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        const response = await propertiesAPI.delete(id);
        if (response.success) {
          setProperties(properties.filter(p => p.id !== id));
          toast.success('Property deleted successfully');
        } else {
          throw new Error(response.message || 'Failed to delete property');
        }
      } catch (error) {
        console.error('Failed to delete property:', error);
        toast.error('Failed to delete property');
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      console.log(`🔄 Updating property ${id} status to: ${newStatus}`);

      const response = await propertiesAPI.updateStatus(id, newStatus);

      if (response.success) {
        // Update the property in the local state
        setProperties(prevProperties =>
          prevProperties.map(property =>
            property.id === id
              ? { ...property, status: newStatus, updatedAt: new Date().toISOString() }
              : property
          )
        );

        toast.success(`Property status updated to ${newStatus}`);
        console.log(`✅ Property status updated successfully: ${id} -> ${newStatus}`);
      } else {
        throw new Error(response.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('❌ Failed to update property status:', error);
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  const handleSelectProperty = (propertyId) => {
    const newSelected = new Set(selectedProperties);
    if (newSelected.has(propertyId)) {
      newSelected.delete(propertyId);
    } else {
      newSelected.add(propertyId);
    }
    setSelectedProperties(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedProperties.size === filteredProperties.length) {
      setSelectedProperties(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedProperties(new Set(filteredProperties.map(p => p.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selectedProperties.size === 0) return;

    try {
      const propertyIds = Array.from(selectedProperties);
      console.log(`🔄 Bulk updating ${propertyIds.length} properties to status: ${newStatus}`);

      // Update all selected properties
      const updatePromises = propertyIds.map(id => propertiesAPI.updateStatus(id, newStatus));
      await Promise.all(updatePromises);

      // Update local state
      setProperties(prevProperties =>
        prevProperties.map(property =>
          selectedProperties.has(property.id)
            ? { ...property, status: newStatus, updatedAt: new Date().toISOString() }
            : property
        )
      );

      setSelectedProperties(new Set());
      setShowBulkActions(false);
      toast.success(`${propertyIds.length} properties updated to ${newStatus}`);

    } catch (error) {
      console.error('❌ Failed to bulk update property status:', error);
      toast.error('Failed to update properties');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || property.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const scrollImages = (direction, propertyId) => {
    const container = document.getElementById(`images-${propertyId}`);
    if (container) {
      const scrollAmount = 200;
      const newScrollLeft = container.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      container.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const openImageModal = (property, imageIndex = 0) => {
    setSelectedProperty(property);
    setSelectedImageIndex(imageIndex);
  };

  const closeImageModal = () => {
    setSelectedProperty(null);
    setSelectedImageIndex(null);
  };

  const navigateImage = (direction) => {
    if (!selectedProperty || !selectedProperty.images) return;

    const totalImages = selectedProperty.images.length;
    if (direction === 'next') {
      setSelectedImageIndex((prev) => (prev + 1) % totalImages);
    } else {
      setSelectedImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          {showBulkActions && (
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm text-blue-700 font-medium">
                {selectedProperties.size} selected
              </span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value);
                    e.target.value = '';
                  }
                }}
                className="text-sm border border-blue-300 rounded px-2 py-1 bg-white"
              >
                <option value="">Update Status</option>
                <option value="active">Set Active</option>
                <option value="pending">Set Pending</option>
                <option value="sold">Set Sold</option>
                <option value="inactive">Set Inactive</option>
              </select>
              <button
                onClick={() => {
                  setSelectedProperties(new Set());
                  setShowBulkActions(false);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <Link
          to="/properties/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search properties..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                ? 'bg-white text-primary-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Display */}
      <div className={viewMode === 'grid'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
      }>
        {filteredProperties.map((property) => (
          <div key={property.id} className={`card overflow-hidden relative ${viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
            } ${selectedProperties.has(property.id) ? 'ring-2 ring-primary-500' : ''}`}>
            {/* Selection Checkbox */}
            <div className="absolute top-3 left-3 z-10">
              <input
                type="checkbox"
                checked={selectedProperties.has(property.id)}
                onChange={() => handleSelectProperty(property.id)}
                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 bg-white shadow-sm"
              />
            </div>
            {/* Image Section with Scroll */}
            <div className={`relative ${viewMode === 'list' ? 'md:w-80 flex-shrink-0' : ''}`}>
              {property.images && property.images.length > 1 ? (
                <div className="relative">
                  {/* Image Gallery with Horizontal Scroll */}
                  <div
                    id={`images-${property.id}`}
                    className="flex overflow-x-auto image-gallery-scroll smooth-scroll"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {property.images.map((image, index) => (
                      <img
                        key={index}
                        src={image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'}
                        alt={`${property.title} - Image ${index + 1}`}
                        className={`flex-shrink-0 object-cover cursor-pointer hover:opacity-90 transition-opacity ${viewMode === 'list' ? 'w-80 h-48' : 'w-full h-48'
                          }`}
                        onClick={() => openImageModal(property, index)}
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
                        }}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <button
                    onClick={() => scrollImages('left', property.id)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollImages('right', property.id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded-full flex items-center gap-1">
                    <ImageIcon className="h-3 w-3" />
                    {property.images.length}
                  </div>
                </div>
              ) : (
                <img
                  src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'}
                  alt={property.title}
                  className={`object-cover cursor-pointer hover:opacity-90 transition-opacity ${viewMode === 'list' ? 'w-80 h-48' : 'w-full h-48'
                    }`}
                  onClick={() => openImageModal(property, 0)}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop';
                  }}
                />
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {property.propertyId && (
                      <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {property.propertyId}
                      </span>
                    )}
                    {property.propertyIndex && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{property.propertyIndex}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {property.title}
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {property.description}
              </p>

              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {property.location}
              </div>

              <div className="flex items-center text-sm text-gray-500 mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(property.createdAt).toLocaleDateString()}
              </div>

              <div className={`flex items-center justify-between mb-4 ${viewMode === 'list' ? 'flex-wrap gap-2' : ''
                }`}>
                <span className="text-2xl font-bold text-primary-600">
                  {formatCurrency(property.price)}
                </span>
                <div className="text-sm text-gray-500">
                  {property.area} sq ft
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>{property.beds || property.bedrooms} Beds</span>
                <span>{property.baths || property.bathrooms} Baths</span>
                <span>{property.propertyType || property.type}</span>
              </div>

              <div className="space-y-3">
                {/* Status Update Dropdown */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select
                    value={property.status}
                    onChange={(e) => handleStatusUpdate(property.id, e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Link
                    to={`/properties/edit/${property.id}`}
                    className="flex-1 btn-secondary text-center"
                  >
                    <Edit className="h-4 w-4 inline mr-1" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteProperty(property.id)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProperties.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by adding your first property.'
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <div className="mt-6">
              <Link
                to="/properties/new"
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedProperty && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-6xl max-h-full w-full">
            <img
              src={selectedProperty.images[selectedImageIndex]}
              alt={`${selectedProperty.title} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg mx-auto"
            />

            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              ✕
            </button>

            {/* Navigation Buttons */}
            {selectedProperty.images.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => navigateImage('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Info Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
              <div className="text-center">
                <div className="font-medium">{selectedProperty.title}</div>
                <div className="text-sm opacity-75">
                  Image {selectedImageIndex + 1} of {selectedProperty.images.length}
                </div>
              </div>
            </div>

            {/* Property Quick Info */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-lg">
              <div className="text-sm">
                <div className="font-medium">{formatCurrency(selectedProperty.price)}</div>
                <div className="opacity-75">{selectedProperty.location}</div>
              </div>
            </div>

            {/* Image Thumbnails */}
            {selectedProperty.images.length > 1 && (
              <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
                {selectedProperty.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-all ${index === selectedImageIndex
                      ? 'border-white scale-110'
                      : 'border-transparent opacity-60 hover:opacity-80'
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
        </div>
      )}
    </div>
  );
};

export default Properties;