import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  MessageSquare,
  MapPin,
  Mail,
  Edit3,
  Save,
  X,
  Camera,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedProperties } from '../context/SavedPropertiesContext';
import { authService } from '../services/authService';
import PropertyCard from '../components/PropertyCard';
import InquiryConversation from '../components/InquiryConversation';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser, updateProfile: updateAuthProfile, isDataFromCache } = useAuth();
  const { getSavedCount } = useSavedProperties();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('saved');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real user data from authentication
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: {
      avatar: '',
      bio: '',
      location: '',
      preferences: {
        notifications: true,
        newsletter: true,
        emailAlerts: true
      }
    },
    verified: false,
    createdAt: '',
    lastLogin: '',
    totalSaved: 0,
    totalInquiries: 0
  });

  // Real saved properties data
  const [savedProperties, setSavedProperties] = useState([]);
  const [isLoadingSavedProperties, setIsLoadingSavedProperties] = useState(false);

  // Real inquiries data
  const [inquiries, setInquiries] = useState([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(false);

  // Password change form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (authUser) {
        // First, set user data from auth context (cached data) for immediate display
        const cachedUserData = {
          ...authUser,
          profile: authUser.profile || {
            avatar: '',
            bio: '',
            location: '',
            preferences: {
              notifications: true,
              newsletter: true,
              emailAlerts: true
            }
          },
          totalSaved: 0,
          totalInquiries: 0
        };

        setUser(cachedUserData);
        setIsLoadingProfile(false); // Show cached data immediately

        // Then try to fetch fresh data from server in background
        try {
          setIsRefreshing(true);

          // Get profile data
          const profileResponse = await authService.getProfile();
          if (profileResponse.success) {
            const freshUserData = profileResponse.data.user;

            // Get real statistics
            const statsResponse = await authService.getStatistics();
            const stats = statsResponse.success ? statsResponse.data : { totalSaved: getSavedCount(), totalInquiries: inquiries.length };

            setUser({
              ...freshUserData,
              totalSaved: stats.totalSaved,
              totalInquiries: stats.totalInquiries
            });

            console.log('✅ Profile data and statistics refreshed from server');
          }

          // Load saved properties and inquiries
          loadSavedProperties();
          loadInquiries();

        } catch (error) {
          console.warn('⚠️ Failed to refresh profile data, using cached data:', error);
          // Continue using cached data - don't show error to user unless it's critical
        } finally {
          setIsRefreshing(false);
        }
      } else {
        setIsLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [authUser]);





  const tabs = [
    { id: 'saved', label: 'Saved Properties', icon: Heart, count: savedProperties.length },
    { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare, count: inquiries.length }
  ];

  // Handle profile update
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profile: {
          avatar: user.profile.avatar,
          bio: user.profile.bio,
          location: user.profile.location,
          preferences: user.profile.preferences
        }
      };

      const response = await authService.updateProfile(updateData);

      if (response.success) {
        // Update auth context
        updateAuthProfile(response.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(response.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword,
        passwordData.confirmPassword
      );

      if (response.success) {
        toast.success('Password changed successfully!');
        setIsChangingPassword(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload (placeholder for now)
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // For now, create a local URL - in production, upload to cloud storage
      const avatarUrl = URL.createObjectURL(file);
      setUser({
        ...user,
        profile: {
          ...user.profile,
          avatar: avatarUrl
        }
      });
      toast.info('Avatar updated! Remember to save your changes.');
    }
  };

  // Load saved properties
  const loadSavedProperties = async () => {
    setIsLoadingSavedProperties(true);
    try {
      const response = await authService.getSavedProperties();
      if (response.success) {
        setSavedProperties(response.data.savedProperties);
      }
    } catch (error) {
      console.error('Failed to load saved properties:', error);
    } finally {
      setIsLoadingSavedProperties(false);
    }
  };

  // Load inquiries
  const loadInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const response = await authService.getMyInquiries();
      if (response.success) {
        setInquiries(response.data.inquiries);
      }
    } catch (error) {
      console.error('Failed to load inquiries:', error);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  // Manual refresh profile data
  const handleRefreshProfile = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      // Refresh profile data
      const profileResponse = await authService.getProfile();
      if (profileResponse.success) {
        const freshUserData = profileResponse.data.user;

        // Refresh statistics
        const statsResponse = await authService.getStatistics();
        const stats = statsResponse.success ? statsResponse.data : { totalSaved: getSavedCount(), totalInquiries: inquiries.length };

        setUser({
          ...freshUserData,
          totalSaved: stats.totalSaved,
          totalInquiries: stats.totalInquiries
        });

        // Refresh saved properties and inquiries
        await loadSavedProperties();
        await loadInquiries();

        toast.success('Profile data refreshed!');
      } else {
        toast.error('Failed to refresh profile data');
      }
    } catch (error) {
      console.error('Manual refresh error:', error);
      toast.error('Failed to refresh profile data');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <section className="bg-white shadow-sm relative">
        {/* Background refresh indicator */}
        {isRefreshing && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 overflow-hidden">
            <div className="h-full bg-primary animate-pulse"></div>
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff&size=96`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-1" />
                  {user.email}
                  {user.verified && <span className="ml-2 text-green-600 text-sm">✓ Verified</span>}
                </p>
                {user.profile?.location && (
                  <p className="text-gray-600 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.profile.location}
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                  {isDataFromCache() && !isRefreshing && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      Cached
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-auto">
              <button
                onClick={handleRefreshProfile}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Lock className="h-4 w-4" />
                Change Password
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.totalSaved}</div>
              <div className="text-sm text-gray-600">Saved Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.totalInquiries}</div>
              <div className="text-sm text-gray-600">Inquiries Made</div>
            </div>
          </div>

          {/* Bio Section */}
          {user.profile?.bio && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600">{user.profile.bio}</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {tabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5" />
                          <span>{tab.label}</span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-600'
                          }`}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
              {activeTab === 'saved' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Saved Properties</h2>
                  {isLoadingSavedProperties ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading saved properties...</p>
                    </div>
                  ) : savedProperties.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {savedProperties.map((savedItem) => (
                        <div key={savedItem.id} className="relative">
                          <PropertyCard property={savedItem.property} />
                          <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
                            Saved {new Date(savedItem.savedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Saved Properties</h3>
                      <p className="text-gray-600">Start browsing and save properties you're interested in.</p>
                    </div>
                  )}
                </motion.div>
              )}



              {activeTab === 'inquiries' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">My Inquiries</h2>
                  {isLoadingInquiries ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading inquiries...</p>
                    </div>
                  ) : inquiries.length > 0 ? (
                    <div className="space-y-6">
                      {inquiries.map((inquiry) => (
                        <InquiryConversation 
                          key={inquiry.id} 
                          inquiry={inquiry} 
                          onReply={loadInquiries}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Inquiries Yet</h3>
                      <p className="text-gray-600">Your property inquiries and communications will appear here.</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Avatar Upload */}
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={user.profile?.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=3b82f6&color=fff&size=96`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                    />
                    <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Click camera icon to change avatar</p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={user.firstName}
                      onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user.lastName}
                      onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={user.phone || ''}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={user.profile?.location || ''}
                    onChange={(e) => setUser({
                      ...user,
                      profile: {
                        ...user.profile,
                        location: e.target.value
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={user.profile?.bio || ''}
                    onChange={(e) => setUser({
                      ...user,
                      profile: {
                        ...user.profile,
                        bio: e.target.value
                      }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Tell us about yourself..."
                    maxLength={500}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(user.profile?.bio || '').length}/500 characters
                  </p>
                </div>

                {/* Preferences */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Preferences</label>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.profile?.preferences?.notifications || false}
                        onChange={(e) => setUser({
                          ...user,
                          profile: {
                            ...user.profile,
                            preferences: {
                              ...user.profile?.preferences,
                              notifications: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Push notifications</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.profile?.preferences?.newsletter || false}
                        onChange={(e) => setUser({
                          ...user,
                          profile: {
                            ...user.profile,
                            preferences: {
                              ...user.profile?.preferences,
                              newsletter: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Newsletter subscription</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.profile?.preferences?.emailAlerts || false}
                        onChange={(e) => setUser({
                          ...user,
                          profile: {
                            ...user.profile,
                            preferences: {
                              ...user.profile?.preferences,
                              emailAlerts: e.target.checked
                            }
                          }
                        })}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-gray-700">Email alerts for new properties</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangingPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Change Password</h3>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? 'Changing...' : 'Change Password'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;