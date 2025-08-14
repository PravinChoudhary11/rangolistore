// lib/providers/AuthProvider.js
'use client';

import { useEffect } from 'react';
import useAuthStore from '@/stores/authStore';

export default function AuthProvider({ children }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    // Initialize auth only once when the app starts
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
}