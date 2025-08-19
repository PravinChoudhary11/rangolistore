// lib/contexts/AuthContext.js - Fixed version with refetch
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const authRequestRef = useRef(null);
  const lastAuthCheckRef = useRef(0);
  const initializationRef = useRef(false);
  const MIN_AUTH_CHECK_INTERVAL = 5000; // 5 seconds
  const retryTimeoutRef = useRef(null);

  // Optimized checkAuth with better error handling and caching
  const checkAuth = useCallback(async (showLoading = false, forceRefresh = false) => {
    const now = Date.now();

    // Restore JWT from localStorage if missing
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth-jwt') : null;
    if (storedToken && (!user || !user.jwt)) {
      setUser(prev => prev ? { ...prev, jwt: storedToken } : { jwt: storedToken });
    }

    // Skip if there's an ongoing request or recent check (unless forced)
    if (!forceRefresh) {
      if (authRequestRef.current) {
        return await authRequestRef.current;
      }
      if (now - lastAuthCheckRef.current < MIN_AUTH_CHECK_INTERVAL) {
        return { success: true, user, cached: true };
      }
    }

    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (showLoading) setLoading(true);
    setError(null);

    const requestPromise = (async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
          },
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const userData = await response.json();
          const userInfo = userData.user || null;
          const finalUser = userInfo ? { ...userInfo, jwt: storedToken || user?.jwt } : null;
          
          setUser(finalUser);
          lastAuthCheckRef.current = now;

          // Dispatch auth change event
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('authChange', { 
              detail: { user: finalUser, authenticated: !!finalUser } 
            }));

          }
          return { success: true, user: finalUser };
        } else if (response.status === 503) {
          // Database temporarily unavailable - retry with exponential backoff
          const retryDelay = Math.min(2000 * Math.pow(2, 0), 10000);
          retryTimeoutRef.current = setTimeout(() => {
            checkAuth(false, true);
          }, retryDelay);
          
          throw new Error('Service temporarily unavailable');
        } else {
          // Auth failed - clear user data
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth-jwt');
            window.dispatchEvent(new CustomEvent('authChange', { 
              detail: { user: null, authenticated: false } 
            }));
          }
          return { success: false, user: null };
        }
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          console.warn('Auth check timeout');
          setError('Connection timeout. Please check your internet connection.');
        } else if (error.message.includes('Service temporarily unavailable')) {
          console.warn('Database temporarily unavailable, will retry');
          setError('Service temporarily unavailable. Retrying...');
        } else {
          console.error('Auth check error:', error);
          setError('Failed to verify authentication');
        }
        
        return { success: false, user: null, error };
      } finally {
        if (showLoading) setLoading(false);
        if (!initializationRef.current) {
          setIsInitialized(true);
          initializationRef.current = true;
        }
        authRequestRef.current = null;
      }
    })();

    authRequestRef.current = requestPromise;
    return await requestPromise;
  }, [user]);

  // Refetch function - alias for checkAuth with force refresh
  const refetch = useCallback(async () => {
    return await checkAuth(true, true);
  }, [checkAuth]);

  // Initialize auth on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized && !initializationRef.current) {
      checkAuth(true);
    }
  }, [isInitialized, checkAuth]);

  // Optimized login with better error handling
  const login = useCallback(async (emailOrCredential, isGoogleLogin = false) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      let requestBody;
      
      if (isGoogleLogin) {
        // Handle Google OAuth credential
        requestBody = { credential: emailOrCredential };
      } else if (typeof emailOrCredential === 'string') {
        // Handle regular email login
        requestBody = { email: emailOrCredential };
      } else {
        // Handle object with email property
        requestBody = emailOrCredential;
      }

      console.log('Login request:', requestBody); // Debug log

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify(requestBody)
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      console.log('Login response:', result); // Debug log

      if (response.ok && result.success) {
        const finalUser = { ...result.user, jwt: result.jwt };
        setUser(finalUser);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-jwt', result.jwt);
          window.dispatchEvent(new CustomEvent('authChange', { 
            detail: { user: finalUser, authenticated: true } 
          }));
        }
        
        setIsInitialized(true);
        lastAuthCheckRef.current = Date.now();

        return { success: true, user: finalUser };
      } else {
        const errorMsg = result.error || 'Login failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Login error:', err);
      
      let errorMessage = 'Network error. Please try again.';
      if (err.name === 'AbortError') {
        errorMessage = 'Login timeout. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Optimized register with better error handling
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify(userData)
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (response.ok && result.success) {
        const finalUser = { ...result.user, jwt: result.jwt };
        setUser(finalUser);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-jwt', result.jwt);
          window.dispatchEvent(new CustomEvent('authChange', { 
            detail: { user: finalUser, authenticated: true } 
          }));
        }
        
        setIsInitialized(true);
        lastAuthCheckRef.current = Date.now();

        return { success: true, user: finalUser };
      } else {
        setError(result.error || 'Registration failed');
        return { success: false, error: result.error || 'Registration failed' };
      }
    } catch (err) {
      clearTimeout(timeoutId);
      console.error('Registration error:', err);
      
      let errorMessage = 'Network error. Please try again.';
      if (err.name === 'AbortError') {
        errorMessage = 'Registration timeout. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Fast logout - optimistic updates
  const logout = useCallback(async () => {
    // Optimistically clear state immediately
    setUser(null);
    setIsInitialized(true);
    lastAuthCheckRef.current = 0;
    authRequestRef.current = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-jwt');
      window.dispatchEvent(new CustomEvent('authChange', { 
        detail: { user: null, authenticated: false } 
      }));
    }

    // Navigate immediately
    router.push('/');

    // Clear retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Then make the API call in the background
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error (non-critical):', error);
      // Don't show error to user since logout already succeeded locally
    }
  }, [router]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (authRequestRef.current) {
        // Don't cancel ongoing requests, just clear the reference
        authRequestRef.current = null;
      }
    };
  }, []);

  const value = {
    user,
    loading,
    isInitialized,
    error,
    login,
    register,
    logout,
    checkAuth,
    refetch, // Added the missing refetch function
    clearError: () => setError(null),
    isAuthenticated: !!user,
    lastAuthCheck: lastAuthCheckRef.current
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}