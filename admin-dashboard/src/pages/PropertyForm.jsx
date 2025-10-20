import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload, X, Save, ArrowLeft, Cloud, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { propertiesAPI } from '../services/api';
import cloudinaryService from '../services/cloudinary';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [scrollContainer, setScrollContainer] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '',
      location: '',
      type: 'Apartment',
      status: 'active',
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      amenities: '',
      features: ''
    }
  });

  useEffect(() => {
    if (isEdit) {
      fetchProperty();
    }
  }, [id, isEdit]);

  const fetchProperty = async () => {
    try {
      setIsLoading(true);
      // Fetch actual property data from Firebase via API
      const response = await propertiesAPI.getById(id);

      if (response.success) {
        const property = response.data.property;

        // Set form values with actual data
        setValue('title', property.title || '');
        setValue('description', property.description || '');
        setValue('price', property.price || '');
        setValue('location', property.location || '');
        setValue('type', property.propertyType || 'Apartment');
        setValue('status', property.status || 'active');
        setValue('bedrooms', property.beds || 1);
        setValue('bathrooms', property.baths || 1);
        setValue('area', property.area || '');
        setValue('amenities', property.amenities ? property.amenities.join(', ') : '');
        setValue('features', property.features ? property.features.join(', ') : '');

        // Set images if available
        if (property.images && property.images.length > 0) {
          setImages(property.images.map(url => ({
            url,
            uploaded: true,
            public_id: cloudinaryService.extractPublicId(url)
          })));
        }

        console.log('✅ Property data loaded for editing:', property.title);
      } else {
        throw new Error(response.message || 'Failed to fetch property');
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
      toast.error('Failed to load property data');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Check if any images are still uploading
      const stillUploading = images.some(img => img.uploading);
      if (stillUploading) {
        toast.error('Please wait for all images to finish uploading before submitting');
        setIsLoading(false);
        return;
      }

      // Get uploaded image URLs
      const uploadedImages = images
        .filter(img => img.uploaded && img.url)
        .map(img => img.url);

      const propertyData = {
        title: data.title,
        description: data.description,
        price: parseFloat(data.price),
        location: data.location,
        beds: parseInt(data.bedrooms),
        baths: parseInt(data.bathrooms),
        area: parseFloat(data.area),
        type: data.type === 'Apartment' ? 'Sale' : 'Sale', // Default to Sale, can be enhanced
        propertyType: data.type.toLowerCase(),
        amenities: data.amenities ? data.amenities.split(',').map(a => a.trim()).filter(a => a) : [],
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [],
        images: uploadedImages,
        agent: {
          name: "Admin User",
          phone: "+91 98765 43210",
          email: "admin@gujaratestate.com"
        }
      };

      let response;
      if (isEdit) {
        response = await propertiesAPI.update(id, propertyData);
        toast.success('Property updated successfully');
      } else {
        response = await propertiesAPI.create(propertyData);
        toast.success('Property created successfully');
      }

      if (!response.success) {
        throw new Error(response.message || 'Failed to save property');
      }

      navigate('/properties');
    } catch (error) {
      console.error('Failed to save property:', error);
      toast.error('Failed to save property');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    setUploadingImages(true);

    try {
      // Show preview immediately
      const previews = [];
      for (const file of files) {
        const reader = new FileReader();
        const preview = await new Promise((resolve) => {
          reader.onload = (event) => resolve({
            url: event.target.result,
            file: file,
            uploaded: false,
            uploading: true,
            public_id: null
          });
          reader.readAsDataURL(file);
        });
        previews.push(preview);
      }

      setImages(prev => [...prev, ...previews]);

      // Upload to Cloudinary
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const previewIndex = images.length + i;

        try {
          console.log(`📤 Uploading ${file.name} to Cloudinary...`);

          // Upload to Cloudinary
          const result = await cloudinaryService.uploadPropertyImage(file);

          if (result.success) {
            // Update the image with Cloudinary URL
            setImages(prev => prev.map((img, index) =>
              index === previewIndex
                ? {
                  ...img,
                  url: result.data.secure_url,
                  uploaded: true,
                  uploading: false,
                  public_id: result.data.public_id
                }
                : img
            ));

            toast.success(`${file.name} uploaded successfully!`);
          } else {
            throw new Error(result.message || 'Upload failed');
          }
        } catch (error) {
          console.error('Upload failed for file:', file.name, error);

          setImages(prev => prev.map((img, index) =>
            index === previewIndex
              ? { ...img, uploaded: false, uploading: false, error: true }
              : img
          ));

          toast.error(`Failed to upload ${file.name}: ${error.message}`);
        }
      }
    } catch (error) {
      console.error('Image upload process failed:', error);
      toast.error('Failed to process images');
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = async (index) => {
    const imageToRemove = images[index];

    // If it's uploaded to Cloudinary, delete it
    if (imageToRemove.uploaded && imageToRemove.public_id) {
      try {
        await cloudinaryService.deleteImage(imageToRemove.public_id);
        toast.success('Image deleted from Cloudinary');
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
        toast.error('Failed to delete from Cloudinary, but removed from form');
      }
    }

    setImages(images.filter((_, i) => i !== index));
  };

  const scrollImages = (direction) => {
    if (scrollContainer) {
      const scrollAmount = 100; // Scroll by 100px
      const newScrollLeft = scrollContainer.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainer.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/properties')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    {...register('title', { required: 'Title is required' })}
                    className="input-field"
                    placeholder="Enter property title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={4}
                    className="input-field"
                    placeholder="Enter property description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    {...register('price', { required: 'Price is required', min: 1 })}
                    className="input-field"
                    placeholder="Enter price"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    {...register('location', { required: 'Location is required' })}
                    className="input-field"
                    placeholder="Enter location"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select {...register('type')} className="input-field">
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="House">House</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Plot">Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select {...register('status')} className="input-field">
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="sold">Sold</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    {...register('bedrooms', { min: 0 })}
                    className="input-field"
                    placeholder="Number of bedrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    {...register('bathrooms', { min: 0 })}
                    className="input-field"
                    placeholder="Number of bathrooms"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    {...register('area', { required: 'Area is required', min: 1 })}
                    className="input-field"
                    placeholder="Total area"
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area.message}</p>
                  )}
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities
                  </label>
                  <input
                    type="text"
                    {...register('amenities')}
                    className="input-field"
                    placeholder="e.g., Swimming Pool, Gym, Garden (comma separated)"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Features
                  </label>
                  <input
                    type="text"
                    {...register('features')}
                    className="input-field"
                    placeholder="e.g., Modern Kitchen, Balcony, Security System (comma separated)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Images</h3>

              <div className="space-y-4">
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${uploadingImages
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                  }`}>
                  {uploadingImages ? (
                    <div className="space-y-2">
                      <Cloud className="mx-auto h-12 w-12 text-blue-500 animate-pulse" />
                      <div className="text-blue-600 font-medium">Uploading to Cloudinary...</div>
                      <div className="text-sm text-blue-500">Please wait while images are being uploaded</div>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="images" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            Upload Images to Cloudinary
                          </span>
                          <span className="mt-1 block text-sm text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </span>
                          <span className="mt-1 block text-xs text-blue-600">
                            Images will be stored securely on Cloudinary
                          </span>
                        </label>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploadingImages}
                          className="hidden"
                        />
                      </div>
                    </>
                  )}
                </div>

                {images.length > 0 && (
                  <div className="space-y-3">
                    {/* Image Counter */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{images.length} image{images.length !== 1 ? 's' : ''} uploaded</span>
                      <span className="text-xs text-blue-600">
                        {images.filter(img => img.uploaded).length} on Cloudinary
                      </span>
                    </div>

                    {/* Scrollable Image Gallery */}
                    <div className="relative">
                      {/* Scroll Navigation Buttons */}
                      {images.length > 3 && (
                        <>
                          <button
                            type="button"
                            onClick={() => scrollImages('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white shadow-md rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <ChevronLeft className="h-4 w-4 text-gray-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => scrollImages('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1 bg-white shadow-md rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4 text-gray-600" />
                          </button>
                        </>
                      )}

                      <div
                        ref={setScrollContainer}
                        className="flex gap-3 overflow-x-auto pb-2 image-gallery-scroll smooth-scroll px-6"
                      >
                        {images.map((image, index) => (
                          <div key={index} className="relative flex-shrink-0 w-24 h-24">
                            <img
                              src={typeof image === 'string' ? image : image.url}
                              alt={`Property ${index + 1}`}
                              onClick={() => setSelectedImageIndex(index)}
                              className={`w-full h-full object-cover rounded-lg border-2 transition-all cursor-pointer hover:scale-105 ${image.uploading
                                  ? 'opacity-50 border-blue-300'
                                  : image.uploaded
                                    ? 'border-green-300 hover:border-green-400'
                                    : image.error
                                      ? 'border-red-300'
                                      : 'border-gray-200'
                                }`}
                            />

                            {/* Upload Status Overlay */}
                            {image.uploading && (
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                                <div className="text-white text-center">
                                  <Cloud className="h-4 w-4 mx-auto mb-1 animate-pulse" />
                                  <span className="text-xs">Uploading...</span>
                                </div>
                              </div>
                            )}

                            {/* Success Indicator */}
                            {image.uploaded && (
                              <div className="absolute top-1 left-1 p-1 bg-green-500 text-white rounded-full shadow-sm">
                                <CheckCircle className="h-2.5 w-2.5" />
                              </div>
                            )}

                            {/* Error Indicator */}
                            {image.error && (
                              <div className="absolute inset-0 flex items-center justify-center bg-red-500 bg-opacity-75 rounded-lg">
                                <span className="text-white text-xs font-medium">Failed</span>
                              </div>
                            )}

                            {/* Image Number Badge */}
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black bg-opacity-60 text-white text-xs rounded">
                              {index + 1}
                            </div>

                            {/* Cloudinary Badge */}
                            {image.uploaded && image.public_id && (
                              <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-blue-500 text-white text-xs rounded">
                                ☁
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              disabled={image.uploading}
                              className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Scroll Hint */}
                      {images.length > 3 && (
                        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none flex items-center justify-end pr-1">
                          <div className="text-gray-400 text-xs">→</div>
                        </div>
                      )}
                    </div>

                    {/* Grid View Toggle for Many Images */}
                    {images.length > 6 && (
                      <div className="pt-2 border-t border-gray-200">
                        <details className="group">
                          <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-700 font-medium">
                            View all {images.length} images in grid
                          </summary>
                          <div className="mt-3 grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                            {images.map((image, index) => (
                              <div key={`grid-${index}`} className="relative">
                                <img
                                  src={typeof image === 'string' ? image : image.url}
                                  alt={`Property ${index + 1}`}
                                  className="w-full h-16 object-cover rounded border"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs text-center py-1 rounded-b">
                                  {index + 1}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  disabled={image.uploading}
                                  className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-50"
                                >
                                  <X className="h-2.5 w-2.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="card p-6">
              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={isLoading || uploadingImages || images.some(img => img.uploading)}
                  className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : uploadingImages || images.some(img => img.uploading) ? (
                    <>
                      <Cloud className="h-4 w-4 animate-pulse" />
                      Uploading Images...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEdit ? 'Update Property' : 'Create Property'}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/properties')}
                  className="w-full btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Image Preview Modal */}
      {selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <img
              src={typeof images[selectedImageIndex] === 'string'
                ? images[selectedImageIndex]
                : images[selectedImageIndex].url}
              alt={`Property ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex > 0 ? selectedImageIndex - 1 : images.length - 1
                  )}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(
                    selectedImageIndex < images.length - 1 ? selectedImageIndex + 1 : 0
                  )}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black bg-opacity-50 text-white rounded-full text-sm">
              {selectedImageIndex + 1} of {images.length}
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black bg-opacity-50 text-white rounded text-sm">
              {images[selectedImageIndex].uploaded && images[selectedImageIndex].public_id && (
                <span className="flex items-center gap-1">
                  <Cloud className="h-3 w-3" />
                  Cloudinary
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyForm;