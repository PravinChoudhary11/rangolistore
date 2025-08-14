/ lib/hooks/useAppData.js
'use client';

import { useAppData as useAppDataFromProvider } from '../providers/AppProviders';

/**
 * Combined app data hook
 */
export function useAppData() {
  return useAppDataFromProvider();
}