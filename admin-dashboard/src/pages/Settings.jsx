import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Globe, Bell, User, Clock, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../services/api';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    },
    businessHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: ''
    },
    notifications: {
      newInquiries: true,
      newUsers: true,
      propertyStatusChanges: false,
      emailNotifications: true,
      smsNotifications: false
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      if (response.data.success) {
        setSiteSettings(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (profileData.newPassword && !profileData.currentPassword) {
      toast.error('Current password is required to set a new password');
      return;
    }

    try {
      setIsLoading(true);
      
      const updateData = {
        name: profileData.name,
        email: profileData.email
      };

      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
        updateData.confirmPassword = profileData.confirmPassword;
      }

      const response = await api.put('/admin/profile', updateData);
      
      if (response.data.success) {
        toast.success('Profile updated successfully');
        // Clear password fields
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        // Update auth context
        await updateProfile(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await api.put('/admin/settings', siteSettings);
      
      if (response.data.success) {
        toast.success('Site settings updated successfully');
        setSiteSettings(response.data.data);
      } else {
        throw new Error(response.data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Settings update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      const response = await api.put('/admin/settings/notifications', siteSettings.notifications);
      
      if (response.data.success) {
        toast.success('Notification preferences updated successfully');
        setSiteSettings(prev => ({
          ...prev,
          notifications: response.data.data
        }));
      } else {
        throw new Error(response.data.message || 'Failed to update notifications');
      }
    } catch (error) {
      console.error('Notifications update failed:', error);
      toast.error(error.response?.data?.message || 'Failed to update notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'site', name: 'Site Settings', icon: Globe },
    { id: 'social', name: 'Social Media', icon: Share2 },
    { id: 'business', name: 'Business Hours', icon: Clock },
    { id: 'notifications', name: 'Notifications', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
          
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Change Password</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={profileData.currentPassword}
                      onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                      className="input-field pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={profileData.newPassword}
                    onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={profileData.confirmPassword}
                    onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Site Settings */}
      {activeTab === 'site' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">General Site Settings</h3>
          
          <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="input-field"
                  placeholder="Gujarat Estate Agency"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={siteSettings.contactEmail}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                  className="input-field"
                  placeholder="info@gujaratestate.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={siteSettings.contactPhone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, contactPhone: e.target.value })}
                  className="input-field"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  className="input-field"
                  placeholder="Ahmedabad, Gujarat, India"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Site Description
                </label>
                <textarea
                  rows={3}
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                  className="input-field"
                  placeholder="Premium Real Estate Services in Gujarat"
                />
                <p className="text-xs text-gray-500 mt-1">This description will appear in search results and social media previews.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Social Media Settings */}
      {activeTab === 'social' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Social Media Links</h3>
          
          <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialMedia?.facebook || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialMedia: { ...siteSettings.socialMedia, facebook: e.target.value }
                  })}
                  className="input-field"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter Profile URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialMedia?.twitter || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialMedia: { ...siteSettings.socialMedia, twitter: e.target.value }
                  })}
                  className="input-field"
                  placeholder="https://twitter.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialMedia?.instagram || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialMedia: { ...siteSettings.socialMedia, instagram: e.target.value }
                  })}
                  className="input-field"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Company URL
                </label>
                <input
                  type="url"
                  value={siteSettings.socialMedia?.linkedin || ''}
                  onChange={(e) => setSiteSettings({ 
                    ...siteSettings, 
                    socialMedia: { ...siteSettings.socialMedia, linkedin: e.target.value }
                  })}
                  className="input-field"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                Save Social Media Links
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Business Hours */}
      {activeTab === 'business' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Business Hours</h3>
          
          <form onSubmit={handleSiteSettingsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(siteSettings.businessHours || {}).map(([day, hours]) => (
                <div key={day}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {day}
                  </label>
                  <input
                    type="text"
                    value={hours}
                    onChange={(e) => setSiteSettings({ 
                      ...siteSettings, 
                      businessHours: { ...siteSettings.businessHours, [day]: e.target.value }
                    })}
                    className="input-field"
                    placeholder="9:00 AM - 6:00 PM or Closed"
                  />
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Use formats like "9:00 AM - 6:00 PM", "10:00 - 18:00", or "Closed" for days when you're not open.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                Save Business Hours
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
          
          <form onSubmit={handleNotificationsSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Activity Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">New Property Inquiries</h5>
                      <p className="text-sm text-gray-500">Get notified when users submit property inquiries</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={siteSettings.notifications?.newInquiries || false}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        notifications: { ...siteSettings.notifications, newInquiries: e.target.checked }
                      })}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500" 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">New User Registrations</h5>
                      <p className="text-sm text-gray-500">Get notified when new users register on the platform</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={siteSettings.notifications?.newUsers || false}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        notifications: { ...siteSettings.notifications, newUsers: e.target.checked }
                      })}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500" 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Property Status Changes</h5>
                      <p className="text-sm text-gray-500">Get notified when property status changes (sold, rented, etc.)</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={siteSettings.notifications?.propertyStatusChanges || false}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        notifications: { ...siteSettings.notifications, propertyStatusChanges: e.target.checked }
                      })}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500" 
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">Email Notifications</h5>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={siteSettings.notifications?.emailNotifications || false}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        notifications: { ...siteSettings.notifications, emailNotifications: e.target.checked }
                      })}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500" 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">SMS Notifications</h5>
                      <p className="text-sm text-gray-500">Receive notifications via SMS (requires SMS service setup)</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={siteSettings.notifications?.smsNotifications || false}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        notifications: { ...siteSettings.notifications, smsNotifications: e.target.checked }
                      })}
                      className="h-4 w-4 text-primary-600 rounded focus:ring-primary-500" 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary flex items-center gap-2"
              >
                {isLoading ? <LoadingSpinner size="sm" /> : <Save className="h-4 w-4" />}
                Save Notification Preferences
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Settings;