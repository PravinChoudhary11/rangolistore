
// lib/hooks/useProtectedRoute.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './useAuth';

/**
 * Hook for protecting routes that require authentication
 * @param {string} redirectTo - Where to redirect if not authenticated
 * @param {boolean} requireAuth - Whether authentication is required (default: true)
 */
export function useProtectedRoute(redirectTo = '/login', requireAuth = true) {
  const { user, isInitialized, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized && !loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        // Redirect authenticated users away from auth pages
        router.push('/dashboard');
      }
    }
  }, [user, isInitialized, loading, requireAuth, redirectTo, router]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading || !isInitialized,
    canAccess: requireAuth ? !!user : true
  };
}