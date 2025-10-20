import { useState, useEffect } from 'react';
import { Search, MessageSquare, Eye, CheckCircle } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setIsLoading(true);
      
      // Mock data
      const mockInquiries = [
        {
          id: 1,
          propertyTitle: 'Luxury Villa in Ahmedabad',
          userName: 'Amit Kumar',
          userEmail: 'amit@example.com',
          userPhone: '+91 98765 43210',
          message: 'I am interested in viewing this property. When can I schedule a visit?',
          status: 'new',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          propertyTitle: 'Commercial Space in Surat',
          userName: 'Neha Patel',
          userEmail: 'neha@example.com',
          userPhone: '+91 98765 43211',
          message: 'Need more details about the pricing and lease terms.',
          status: 'responded',
          createdAt: '2024-01-14T14:20:00Z'
        }
      ];
      
      setInquiries(mockInquiries);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-red-100 text-red-800';
      case 'responded':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry.id} className="card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {inquiry.userName}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  Property: <span className="font-medium">{inquiry.propertyTitle}</span>
                </p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>{inquiry.userEmail}</span>
                  <span>{inquiry.userPhone}</span>
                  <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                </div>
                
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {inquiry.message}
                </p>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inquiries;