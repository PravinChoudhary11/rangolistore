// lib/providers/AppProviders.js - Fixed version
'use client';

import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { NavigationLoadingProvider } from '@/lib/contexts/NavigationLoadingContext';

/**
 * Combined providers wrapper
 */
export function AppProviders({ children }) {
  return (
    <NavigationLoadingProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NavigationLoadingProvider>
  );
}

/**
 * Combined hook for components that need auth data
 */
export function useAppData() {
  const auth = useAuth();
  
  return {
    // Auth data
    user: auth.user,
    authLoading: auth.loading,
    authError: auth.error,
    isAuthenticated: auth.isAuthenticated,
    authInitialized: auth.isInitialized,
    
    // Auth actions
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    refetchAuth: auth.refetch, // Fixed: using auth.refetch instead of auth.refetch
    clearAuthError: auth.clearError,
    
    // Combined state
    isLoading: auth.loading,
    hasErrors: !!auth.error,
    errors: {
      auth: auth.error,
    },
    isReady: auth.isInitialized,
    
    // Utility functions
    clearAllErrors: () => {
      auth.clearError?.();
    }
  };
}

/**
 * HOC for components that need app data
 */
export function withAppData(WrappedComponent) {
  return function AppDataComponent(props) {
    const appData = useAppData();
    return <WrappedComponent {...props} appData={appData} />;
  };
}

/**
 * Loading component for app initialization
 */
export function AppLoadingScreen({ message = "Initializing app..." }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

/**
 * Error boundary component for app errors
 */
export class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-4 p-8">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900">Something went wrong</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              We encountered an unexpected error. Please refresh the page or try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            {this.props.showError && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded overflow-auto">
                  {this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}