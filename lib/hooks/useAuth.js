// lib/hooks/useAuth.js
'use client';

import { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Simple auth hook - wrapper around AuthContext
 */
export function useAuth() {
  return useAuthContext();
}
