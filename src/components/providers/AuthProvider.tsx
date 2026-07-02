'use client';

import React, { useEffect } from 'react';
import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      if (process.env.NODE_ENV === 'development') {
        // Unregister service workers in development to prevent infinite reload loops
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
          }
        });
      } else if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
        navigator.serviceWorker.register('/sw.js')
          .then((reg) => console.log('DesignerOS ServiceWorker registered:', reg.scope))
          .catch((err) => console.error('DesignerOS ServiceWorker failed:', err));
      }
    }
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
