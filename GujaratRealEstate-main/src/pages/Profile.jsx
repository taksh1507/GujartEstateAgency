import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Heart, 
  Eye, 
  MessageSquare, 
  Settings, 
  Bell, 
  MapPin,
  Phone,
  Mail,
  Edit3,
  Save,
  X
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('saved');
  
  // Mock user data
  const [user, setUser] = useState({
    name: "Rajesh Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    location: "Kandivali West, Mumbai",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    memberSince: "January 2023",
    totalViews: 45,
    totalSaved: 8,
    totalInquiries: 12
  });

  // Mock saved properties
  const savedProperties = [
    {
      id: 1,
      title: "Luxury 3BHK Apartment in Kandivali West",
      price: 15000000,
      location: "Kandivali West, Mumbai",
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
      beds: 3,
      baths: 3,
      area: 1250,
      type: "Sale",
      savedDate: "2024-09-20"
    },
    {
      id: 2,
      title: "Modern 2BHK for Rent",
      price: 35000,
      location: "Kandivali East, Mumbai", 
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop",
      beds: 2,
      baths: 2,
      area: 950,
      type: "Rent",
      savedDate: "2024-09-18"
    }
  ];

  // Mock recently viewed
  const recentlyViewed = [
    {
      id: 3,
      title: "Spacious 4BHK Villa with Garden",
      price: 25000000,
      location: "Borivali West, Mumbai",
      image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&h=250&fit=crop",
      beds: 4,
      baths: 4,
      area: 2200,
      type: "Sale",
      viewedDate: "2024-09-25"
    }
  ];

  // Mock inquiries
  const inquiries = [
    {
      id: 1,
      propertyTitle: "Luxury 3BHK Apartment in Kandivali West",
      agentName: "Priya Shah",
      message: "I'm interested in viewing this property. When would be a good time?",
      status: "Pending",
      date: "2024-09-25",
      response: null
    },
    {
      id: 2,
      propertyTitle: "Modern 2BHK for Rent",
      agentName: "Amit Kumar", 
      message: "What are the rental terms and conditions?",
      status: "Responded",
      date: "2024-09-23",
      response: "Thank you for your inquiry. The rental terms include..."
    }
  ];

  const tabs = [
    { id: 'saved', label: 'Saved Properties', icon: Heart, count: savedProperties.length },
    { id: 'viewed', label: 'Recently Viewed', icon: Eye, count: recentlyViewed.length },
    { id: 'inquiries', label: 'My Inquiries', icon: MessageSquare, count: inquiries.length }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Here you would typically send the updated user data to your backend
    console.log('Profile updated:', user);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar & Basic Info */}
            <div className="flex items-center gap-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </p>
                <p className="text-sm text-gray-500 mt-1">Member since {user.memberSince}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 ml-auto">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Bell className="h-4 w-4" />
                Notifications
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
          <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.totalSaved}</div>
              <div className="text-sm text-gray-600">Saved Properties</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.totalViews}</div>
              <div className="text-sm text-gray-600">Properties Viewed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.totalInquiries}</div>
              <div className="text-sm text-gray-600">Inquiries Made</div>
            </div>
          </div>
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
                        className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                          activeTab === tab.id 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5" />
                          <span>{tab.label}</span>
                        </div>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          activeTab === tab.id 
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
                  {savedProperties.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {savedProperties.map((property) => (
                        <div key={property.id} className="relative">
                          <PropertyCard property={property} />
                          <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
                            Saved {new Date(property.savedDate).toLocaleDateString()}
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

              {activeTab === 'viewed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Recently Viewed</h2>
                  {recentlyViewed.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {recentlyViewed.map((property) => (
                        <div key={property.id} className="relative">
                          <PropertyCard property={property} />
                          <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
                            Viewed {new Date(property.viewedDate).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Eye className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Recently Viewed</h3>
                      <p className="text-gray-600">Properties you view will appear here for quick access.</p>
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
                  {inquiries.length > 0 ? (
                    <div className="space-y-4">
                      {inquiries.map((inquiry) => (
                        <div key={inquiry.id} className="bg-white rounded-lg shadow-md p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-gray-800">{inquiry.propertyTitle}</h3>
                              <p className="text-sm text-gray-600">Agent: {inquiry.agentName}</p>
                              <p className="text-xs text-gray-500">{new Date(inquiry.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              inquiry.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {inquiry.status}
                            </span>
                          </div>
                          
                          <div className="border-l-4 border-gray-200 pl-4 mb-4">
                            <p className="text-gray-700">{inquiry.message}</p>
                          </div>
                          
                          {inquiry.response && (
                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-primary">
                              <p className="text-sm text-gray-700">{inquiry.response}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Inquiries Yet</h3>
                      <p className="text-gray-600">Your property inquiries and agent communications will appear here.</p>
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
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Edit Profile</h3>
              <button 
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({...user, name: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={user.phone}
                  onChange={(e) => setUser({...user, phone: e.target.value})}
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={user.location}
                  onChange={(e) => setUser({...user, location: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveProfile}
                className="flex-1 btn-primary"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Profile;