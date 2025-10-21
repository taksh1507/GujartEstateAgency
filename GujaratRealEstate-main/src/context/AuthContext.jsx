import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

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

  // Check for existing session on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          
          // Set user immediately from cache for better UX
          setUser(parsedUser);
          setIsAuthenticated(true);
          console.log('✅ User session restored from cache:', parsedUser.email);
          
          // Verify token is still valid in background
          try {
            const isValid = await authService.verifyToken(token);
            if (isValid) {
              // Token is valid, try to get fresh profile data
              const profileResponse = await authService.getProfile();
              if (profileResponse.success) {
                const freshUserData = profileResponse.data.user;
                setUser(freshUserData);
                
                // Update stored data with fresh data
                const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
                storage.setItem('userData', JSON.stringify(freshUserData));
                console.log('✅ Profile data refreshed from server');
              }
            } else {
              // Token expired, clear storage
              localStorage.removeItem('authToken');
              localStorage.removeItem('userData');
              sessionStorage.removeItem('authToken');
              sessionStorage.removeItem('userData');
              setUser(null);
              setIsAuthenticated(false);
              console.log('⚠️ Token expired, session cleared');
            }
          } catch (verifyError) {
            console.warn('⚠️ Token verification failed, using cached data:', verifyError.message);
            // Keep using cached data if verification fails (network issues, etc.)
          }
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userData');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password, rememberMe = false) => {
    try {
      setIsLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        const { token, user: userData } = response.data;
        
        // Store in localStorage or sessionStorage based on rememberMe
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('authToken', token);
        storage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
        setIsAuthenticated(true);
        
        console.log('✅ User logged in:', userData.email);
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        console.log('✅ User registered:', userData.email);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email function
  const verifyEmail = async (email, otp) => {
    try {
      setIsLoading(true);
      const response = await authService.verifyEmail(email, otp);
      
      if (response.success) {
        console.log('✅ Email verified successfully:', email);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Email verification error:', error);
      return { success: false, error: error.message || 'Verification failed' };
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification function
  const resendVerification = async (email) => {
    try {
      const response = await authService.resendVerification(email);
      return response;
    } catch (error) {
      console.error('❌ Resend verification error:', error);
      return { success: false, error: error.message || 'Failed to resend verification' };
    }
  };

  // Forgot password function
  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      console.error('❌ Forgot password error:', error);
      return { success: false, error: error.message || 'Failed to send reset code' };
    }
  };

  // Verify reset OTP function
  const verifyResetOTP = async (email, otp) => {
    try {
      const response = await authService.verifyResetOTP(email, otp);
      return response;
    } catch (error) {
      console.error('❌ Verify reset OTP error:', error);
      return { success: false, error: error.message || 'Failed to verify reset code' };
    }
  };

  // Reset password function
  const resetPassword = async (resetToken, newPassword, confirmPassword) => {
    try {
      const response = await authService.resetPassword(resetToken, newPassword, confirmPassword);
      return response;
    } catch (error) {
      console.error('❌ Reset password error:', error);
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  // Logout function
  const logout = () => {
    // Clear all storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    
    setUser(null);
    setIsAuthenticated(false);
    
    console.log('✅ User logged out');
  };

  // Update user profile
  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    
    // Update stored data
    const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
    storage.setItem('userData', JSON.stringify(updatedUser));
    
    console.log('✅ User profile updated');
  };

  // Get user profile from server
  const getProfile = async () => {
    try {
      const response = await authService.getProfile();
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        
        // Update stored data
        const storage = localStorage.getItem('authToken') ? localStorage : sessionStorage;
        storage.setItem('userData', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('❌ Get profile error:', error);
      return { success: false, error: error.message || 'Failed to get profile' };
    }
  };

  // Clear cache and force refresh
  const clearCache = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setUser(null);
    setIsAuthenticated(false);
    console.log('✅ Cache cleared');
  };

  // Check if user data is from cache
  const isDataFromCache = () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    return !!(token && userData && user);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is verified
  const isVerified = () => {
    return user && user.verified;
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    verifyEmail,
    resendVerification,
    forgotPassword,
    verifyResetOTP,
    resetPassword,
    logout,
    updateProfile,
    getProfile,
    clearCache,
    isDataFromCache,
    hasRole,
    isVerified
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;