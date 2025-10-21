import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Eye, 
  Reply, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [filteredInquiries, setFilteredInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    responded: 0,
    resolved: 0,
    closed: 0
  });

  // Load inquiries
  const loadInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/inquiries', {
        params: { status: statusFilter !== 'all' ? statusFilter : undefined }
      });
      if (response.data.success) {
        setInquiries(response.data.data.inquiries);
        setFilteredInquiries(response.data.data.inquiries);
      } else {
        toast.error('Failed to load inquiries');
      }
    } catch (error) {
      console.error('Load inquiries error:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setIsLoading(false);
    }
  };

  // Load statistics
  const loadStats = async () => {
    try {
      const response = await api.get('/admin/inquiries/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Load stats error:', error);
    }
  };

  useEffect(() => {
    loadInquiries();
    loadStats();
  }, []);

  // Filter inquiries
  useEffect(() => {
    let filtered = inquiries;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredInquiries(filtered);
  }, [inquiries, statusFilter, searchTerm]);

  // Handle response submission
  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setIsResponding(true);
    try {
      const response = await api.put(`/admin/inquiries/${selectedInquiry.id}/respond`, {
        response: responseText.trim(),
        status: 'responded'
      });

      if (response.data.success) {
        toast.success('Response sent successfully');
        setShowResponseModal(false);
        setResponseText('');
        setSelectedInquiry(null);
        await loadInquiries();
        await loadStats();
      } else {
        toast.error('Failed to send response');
      }
    } catch (error) {
      console.error('Submit response error:', error);
      toast.error('Failed to send response');
    } finally {
      setIsResponding(false);
    }
  };

  // Handle status update
  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      const response = await api.put(`/admin/inquiries/${inquiryId}/status`, {
        status: newStatus
      });

      if (response.data.success) {
        toast.success('Status updated successfully');
        await loadInquiries();
        await loadStats();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'responded':
        return 'bg-blue-100 text-blue-800';
      case 'user-replied':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'responded':
        return <Reply className="h-4 w-4" />;
      case 'user-replied':
        return <MessageSquare className="h-4 w-4" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'closed':
        return <XCircle className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inquiries Management</h1>
          <p className="text-gray-600">Manage property inquiries and customer communications</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <Reply className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Responded</p>
              <p className="text-2xl font-bold text-gray-900">{stats.responded}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <XCircle className="h-8 w-8 text-gray-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search inquiries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="responded">Responded</option>
              <option value="user-replied">User Replied</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-lg shadow-md">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading inquiries...</p>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Inquiries Found</h3>
            <p className="text-gray-600">No inquiries match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredInquiries.map((inquiry) => (
              <motion.div
                key={inquiry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {inquiry.propertyTitle}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(inquiry.status)}`}>
                        {getStatusIcon(inquiry.status)}
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{inquiry.userName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{inquiry.userEmail}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{inquiry.propertyLocation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Price: {formatPrice(inquiry.propertyPrice)}</span>
                      </div>
                    </div>

                    {/* Conversation Thread */}
                    <div className="space-y-3 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Conversation History</h4>
                      <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                        {(inquiry.messages || [
                          {
                            id: 1,
                            sender: 'user',
                            senderName: inquiry.userName,
                            message: inquiry.message,
                            timestamp: inquiry.createdAt
                          },
                          ...(inquiry.adminResponse ? [{
                            id: 2,
                            sender: 'admin',
                            senderName: 'Admin Team',
                            message: inquiry.adminResponse,
                            timestamp: inquiry.adminResponseAt
                          }] : [])
                        ]).map((message, index) => (
                          <div
                            key={message.id || index}
                            className={`p-3 rounded-lg ${
                              message.sender === 'user' 
                                ? 'bg-gray-50 border-l-4 border-gray-300 ml-0 mr-8' 
                                : 'bg-blue-50 border-l-4 border-blue-500 ml-8 mr-0'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                {message.sender === 'user' ? (
                                  <User className="h-3 w-3 text-gray-600" />
                                ) : (
                                  <div className="h-3 w-3 bg-blue-600 rounded-full"></div>
                                )}
                                <p className="text-sm font-medium text-gray-800">
                                  {message.sender === 'user' ? message.senderName : 'Admin Team'}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(message.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {/* Always allow admin to respond unless closed */}
                    {inquiry.status !== 'closed' && (
                      <button
                        onClick={() => {
                          setSelectedInquiry(inquiry);
                          setShowResponseModal(true);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                      >
                        <Reply className="h-3 w-3" />
                        {inquiry.status === 'pending' ? 'Respond' : 'Reply'}
                      </button>
                    )}
                    
                    {(inquiry.status === 'responded' || inquiry.status === 'user-replied') && (
                      <button
                        onClick={() => handleStatusUpdate(inquiry.id, 'resolved')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        Resolve
                      </button>
                    )}

                    {(inquiry.status === 'resolved' || inquiry.status === 'responded' || inquiry.status === 'user-replied') && (
                      <button
                        onClick={() => handleStatusUpdate(inquiry.id, 'closed')}
                        className="px-3 py-1 bg-gray-600 text-white text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1"
                      >
                        <XCircle className="h-3 w-3" />
                        Close
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Respond to Inquiry</h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setResponseText('');
                    setSelectedInquiry(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Inquiry Details */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">{selectedInquiry.propertyTitle}</h4>
                <p className="text-sm text-gray-600 mb-2">From: {selectedInquiry.userName} ({selectedInquiry.userEmail})</p>
                <p className="text-sm text-gray-700">{selectedInquiry.message}</p>
              </div>

              {/* Response Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Enter your response to the customer..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      setResponseText('');
                      setSelectedInquiry(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitResponse}
                    disabled={isResponding || !responseText.trim()}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isResponding ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Reply className="h-4 w-4" />
                    )}
                    {isResponding ? 'Sending...' : 'Send Response'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Inquiries;