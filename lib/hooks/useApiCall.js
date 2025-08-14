
// lib/hooks/useApiCall.js
'use client';

import { useState, useCallback } from 'react';

/**
 * Generic hook for API calls with loading states and error handling
 */
export function useApiCall() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiCall = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      console.error('API call error:', err);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    apiCall,
    clearError
  };
}