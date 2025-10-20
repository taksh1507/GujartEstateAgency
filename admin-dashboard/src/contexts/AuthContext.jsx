import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('adminToken');
      const savedUser = localStorage.getItem('adminUser');
      
      if (token && savedUser) {
        try {
          // Verify token with backend
          const userData = await authAPI.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { user, token } = response.data;
        
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify(user));
        
        setUser(user);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        return { success: true, user };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        const updatedUser = response.data;
        localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      } else {
        throw new Error(response.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Mock login for development (remove in production)
  const mockLogin = () => {
    const mockUser = {
      id: 1,
      name: 'Admin User',
      email: 'admin@gujaratestate.com',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      permissions: ['properties', 'users', 'analytics', 'settings']
    };

    localStorage.setItem('adminToken', 'mock-admin-token');
    localStorage.setItem('adminUser', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    toast.success('Mock login successful!');
    return { success: true, user: mockUser };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    mockLogin, // For development only
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;