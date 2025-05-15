import React, { createContext, useState, useContext, useEffect } from 'react';
import { suiteDashApi } from '../services/suiteDashApi';

const SuiteDashContext = createContext();

export const useSuiteDash = () => useContext(SuiteDashContext);

export const SuiteDashProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const authStatus = await suiteDashApi.checkAuth();
        setIsAuthenticated(authStatus);
      } catch (error) {
        setError('Failed to connect to SuiteDash');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const refreshData = async () => {
    await suiteDashApi.clearCache();
    const authStatus = await suiteDashApi.checkAuth();
    setIsAuthenticated(authStatus);
  };

  const value = {
    isLoading,
    isAuthenticated,
    error,
    refreshData,
  };

  return (
    <SuiteDashContext.Provider value={value}>
      {children}
    </SuiteDashContext.Provider>
  );
}; 