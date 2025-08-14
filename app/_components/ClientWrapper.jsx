'use client';

import { AppProviders } from '@/lib/providers/AppProviders';

export default function ClientWrapper({ children }) {
  return (
    <AppProviders>
      {children}
    </AppProviders>
  );
}