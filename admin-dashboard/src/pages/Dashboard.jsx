import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import statisticsService from '../services/statisticsService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    soldProperties: 0,
    pendingProperties: 0,
    totalUsers: 0,
    totalInquiries: 0,
    monthlyRevenue: 0,
    totalValue: 0,
    averagePrice: 0,
    propertyGrowth: 0,
    activeGrowth: 0,
    recentProperties: [],
    recentInquiries: [],
    propertyTypes: {},
    locationStats: {},
    priceRanges: {}
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('📊 Fetching real dashboard statistics...');
      
      // Fetch real statistics from Firebase via our statistics service
      const realStats = await statisticsService.getDashboardStats();
      
      console.log('✅ Dashboard statistics loaded:', {
        totalProperties: realStats.totalProperties,
        activeProperties: realStats.activeProperties,
        monthlyRevenue: realStats.monthlyRevenue,
        recentProperties: realStats.recentProperties.length
      });
      
      setStats(realStats);
    } catch (error) {
      console.error('❌ Failed to fetch dashboard data:', error);
      setError(error.message);
      toast.error('Failed to load dashboard statistics');
      
      // Fallback to basic stats if API fails
      setStats({
        totalProperties: 0,
        activeProperties: 0,
        soldProperties: 0,
        pendingProperties: 0,
        totalUsers: 0,
        totalInquiries: 0,
        monthlyRevenue: 0,
        totalValue: 0,
        averagePrice: 0,
        propertyGrowth: 0,
        activeGrowth: 0,
        recentProperties: [],
        recentInquiries: [],
        propertyTypes: {},
        locationStats: {},
        priceRanges: {}
      });
    } finally {
      setIsLoading(false);
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
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/properties/new"
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              <p className={`text-sm flex items-center mt-1 ${
                stats.propertyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.propertyGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stats.propertyGrowth >= 0 ? '+' : ''}{stats.propertyGrowth}% from last month
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProperties}</p>
              <p className={`text-sm flex items-center mt-1 ${
                stats.activeGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stats.activeGrowth >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                {stats.activeGrowth >= 0 ? '+' : ''}{stats.activeGrowth}% from last month
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Users className="h-3 w-3 mr-1" />
                Est. {Math.round(stats.totalUsers / Math.max(stats.totalProperties, 1))} per property
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyRevenue)}</p>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Building className="h-3 w-3 mr-1" />
                {stats.soldProperties} sold this month
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalValue)}</p>
            <p className="text-sm text-gray-500 mt-1">Total property value</p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Price</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.averagePrice)}</p>
            <p className="text-sm text-gray-500 mt-1">Per property</p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{stats.totalInquiries}</p>
            <p className="text-sm text-gray-500 mt-1">Estimated leads</p>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Types Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Types</h3>
          <div className="space-y-3">
            {Object.entries(stats.propertyTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{type}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalProperties) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h3>
          <div className="space-y-3">
            {Object.entries(stats.locationStats).map(([location, count]) => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 truncate">{location}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalProperties) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Ranges */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Price Ranges</h3>
          <div className="space-y-3">
            {Object.entries(stats.priceRanges).map(([range, count]) => (
              <div key={range} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{range}</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(count / stats.totalProperties) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Properties */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Properties</h3>
              <Link to="/properties" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentProperties.map((property) => (
                <div key={property.id} className="flex items-center space-x-4">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {property.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(property.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(property.status)}`}>
                      {property.status}
                    </span>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="card">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Inquiries</h3>
              <Link to="/inquiries" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentInquiries.map((inquiry) => (
                <div key={inquiry.id} className="border-l-4 border-primary-500 pl-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {inquiry.userName}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {inquiry.propertyTitle}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {inquiry.message}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;