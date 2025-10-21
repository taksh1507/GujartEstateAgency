import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authService } from '../services/authService';

const SavedPropertiesContext = createContext();

export const useSavedProperties = () => {
  const context = useContext(SavedPropertiesContext);
  if (!context) {
    throw new Error('useSavedProperties must be used within a SavedPropertiesProvider');
  }
  return context;
};

export const SavedPropertiesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [savedPropertyIds, setSavedPropertyIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Load saved properties when user logs in
  useEffect(() => {
    const loadSavedProperties = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          // First try to load saved properties
          let response = await authService.getSavedProperties();
          
          // If it fails, try to cleanup invalid saved properties and retry
          if (!response.success) {
            console.log('🧹 Attempting to cleanup invalid saved properties...');
            await authService.cleanupSavedProperties();
            response = await authService.getSavedProperties();
          }
          
          if (response.success) {
            const propertyIds = new Set(
              response.data.savedProperties.map(item => item.propertyId)
            );
            setSavedPropertyIds(propertyIds);
          }
        } catch (error) {
          console.error('Failed to load saved properties:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // Clear saved properties when user logs out
        setSavedPropertyIds(new Set());
      }
    };

    loadSavedProperties();
  }, [isAuthenticated, user]);

  // Check if a property is saved
  const isPropertySaved = (propertyId) => {
    return savedPropertyIds.has(propertyId);
  };

  // Add property to saved list
  const addSavedProperty = (propertyId) => {
    setSavedPropertyIds(prev => new Set([...prev, propertyId]));
  };

  // Remove property from saved list
  const removeSavedProperty = (propertyId) => {
    setSavedPropertyIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(propertyId);
      return newSet;
    });
  };

  // Toggle save status
  const toggleSavedProperty = async (propertyId) => {
    if (!isAuthenticated) {
      throw new Error('User must be authenticated to save properties');
    }

    const isSaved = isPropertySaved(propertyId);
    
    try {
      if (isSaved) {
        const response = await authService.unsaveProperty(propertyId);
        if (response.success) {
          removeSavedProperty(propertyId);
          return { success: true, action: 'removed' };
        } else {
          throw new Error(response.error || 'Failed to remove property');
        }
      } else {
        const response = await authService.saveProperty(propertyId);
        if (response.success) {
          addSavedProperty(propertyId);
          return { success: true, action: 'added' };
        } else {
          throw new Error(response.error || 'Failed to save property');
        }
      }
    } catch (error) {
      console.error('Toggle saved property error:', error);
      throw error;
    }
  };

  // Get saved properties count
  const getSavedCount = () => {
    return savedPropertyIds.size;
  };

  const value = {
    savedPropertyIds,
    isLoading,
    isPropertySaved,
    addSavedProperty,
    removeSavedProperty,
    toggleSavedProperty,
    getSavedCount
  };

  return (
    <SavedPropertiesContext.Provider value={value}>
      {children}
    </SavedPropertiesContext.Provider>
  );
};

export default SavedPropertiesContext;