import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Shield, Clock } from 'lucide-react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const InquiryConversation = ({ inquiry, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async (e) => {
    e.preventDefault();
    
    if (!replyMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.replyToInquiry(inquiry.id, replyMessage.trim());
      
      if (response.success) {
        toast.success('Reply sent successfully!');
        setReplyMessage('');
        setIsReplying(false);
        if (onReply) onReply(); // Refresh inquiries
      } else {
        toast.error(response.error || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Reply error:', error);
      toast.error('Failed to send reply');
    } finally {
      setIsSubmitting(false);
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

  const formatStatus = (status) => {
    switch (status) {
      case 'user-replied':
        return 'Awaiting Response';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  // Use new conversation structure if available, fallback to legacy
  const messages = inquiry.messages || [
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
  ];

  const canReply = inquiry.status === 'responded' || inquiry.status === 'user-replied';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">{inquiry.propertyTitle}</h3>
            <p className="text-sm text-gray-600">{inquiry.propertyLocation}</p>
            <p className="text-xs text-gray-500 mt-1">
              Started {new Date(inquiry.createdAt).toLocaleDateString()} • {inquiry.inquiryType}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
            {formatStatus(inquiry.status)}
          </span>
        </div>
      </div>

      {/* Conversation Thread */}
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message, index) => (
            <motion.div
              key={message.id || index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {message.sender === 'user' ? (
                    <User className="h-3 w-3" />
                  ) : (
                    <Shield className="h-3 w-3" />
                  )}
                  <span className="text-xs font-medium opacity-75">
                    {message.senderName || (message.sender === 'user' ? 'You' : 'Admin Team')}
                  </span>
                  <span className="text-xs opacity-50">
                    {new Date(message.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reply Section */}
        {canReply && (
          <div className="mt-6 pt-4 border-t">
            {!isReplying ? (
              <button
                onClick={() => setIsReplying(true)}
                className="flex items-center gap-2 text-primary hover:text-blue-700 font-medium"
              >
                <MessageSquare className="h-4 w-4" />
                Reply to this conversation
              </button>
            ) : (
              <form onSubmit={handleReply} className="space-y-3">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !replyMessage.trim()}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isSubmitting ? 'Sending...' : 'Send Reply'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsReplying(false);
                      setReplyMessage('');
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Status Messages */}
        {inquiry.status === 'pending' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Waiting for admin response...</span>
            </div>
          </div>
        )}

        {inquiry.status === 'user-replied' && (
          <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-purple-800">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Your reply has been sent. Waiting for admin response...</span>
            </div>
          </div>
        )}

        {inquiry.status === 'resolved' && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <MessageSquare className="h-4 w-4" />
              <span className="text-sm">This inquiry has been resolved.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InquiryConversation;