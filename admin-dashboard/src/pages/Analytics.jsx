import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Users, Building, MessageSquare, MapPin, Calendar, DollarSign, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import statisticsService from '../services/statisticsService';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('📊 Fetching analytics data...');

      // Fetch real statistics
      const [dashboardStats, monthlyStats] = await Promise.all([
        statisticsService.getDashboardStats(),
        statisticsService.getMonthlyStats()
      ]);

      setStats(dashboardStats);
      setMonthlyData(monthlyStats);

      console.log('✅ Analytics data loaded:', {
        totalProperties: dashboardStats.totalProperties,
        monthlyDataPoints: monthlyStats.length
      });

    } catch (error) {
      console.error('❌ Failed to fetch analytics data:', error);
      setError(error.message);
      toast.error('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  // Process data for charts
  const propertyTypeData = Object.entries(stats.propertyTypes || {}).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'][index % 6]
  }));

  const locationData = Object.entries(stats.locationStats || {}).map(([name, value], index) => ({
    name,
    value,
    color: ['#06B6D4', '#84CC16', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  }));

  const priceRangeData = Object.entries(stats.priceRanges || {}).map(([name, value], index) => ({
    name,
    value,
    color: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatCompactCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return formatCurrency(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="w-32 h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Loading skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <button
            onClick={fetchAnalyticsData}
            className="btn-primary"
          >
            Retry
          </button>
        </div>

        <div className="card p-8 text-center">
          <div className="text-red-500 mb-4">
            <Activity className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Analytics</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCompactCurrency(stats.monthlyRevenue || 0)}</p>
              <p className="text-sm text-blue-600 flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                This month
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
              <p className="text-sm font-medium text-gray-600">Properties Sold</p>
              <p className="text-2xl font-bold text-gray-900">{stats.soldProperties || 0}</p>
              <p className="text-sm text-green-600 flex items-center">
                <Building className="h-3 w-3 mr-1" />
                Completed deals
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
              <p className="text-2xl font-bold text-gray-900">{stats.activeProperties || 0}</p>
              <p className={`text-sm flex items-center ${stats.activeGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                {stats.activeGrowth >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {stats.activeGrowth >= 0 ? '+' : ''}{stats.activeGrowth || 0}% growth
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Activity className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInquiries || 0}</p>
              <p className="text-sm text-blue-600 flex items-center">
                <MessageSquare className="h-3 w-3 mr-1" />
                Estimated leads
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <MessageSquare className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="text-center">
            <div className="p-3 bg-indigo-100 rounded-full w-fit mx-auto mb-3">
              <Building className="h-6 w-6 text-indigo-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{formatCompactCurrency(stats.totalValue || 0)}</p>
            <p className="text-sm text-gray-500 mt-1">Total property value</p>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-center">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">Average Price</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{formatCompactCurrency(stats.averagePrice || 0)}</p>
            <p className="text-sm text-gray-500 mt-1">Per property</p>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-center">
            <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">User Engagement</p>
            <p className="text-xl font-bold text-gray-900 mt-1">{Math.round((stats.totalUsers || 0) / Math.max(stats.totalProperties || 1, 1))}</p>
            <p className="text-sm text-gray-500 mt-1">Users per property</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Bar dataKey="properties" fill="#3B82F6" name="Properties" radius={[2, 2, 0, 0]} />
              <Bar dataKey="inquiries" fill="#10B981" name="Inquiries" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Property Types Distribution</h3>
          {propertyTypeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <Building className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No property data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Revenue Trend */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => formatCompactCurrency(value)}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), 'Revenue']}
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Locations */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Locations</h3>
          {locationData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 12 }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No location data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Price Range Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range Distribution</h3>
          {priceRangeData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priceRangeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {priceRangeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              <div className="text-center">
                <DollarSign className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No price data available</p>
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {priceRangeData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: entry.color }}
                  ></div>
                  <span className="text-gray-600">{entry.name}</span>
                </div>
                <span className="font-medium text-gray-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;