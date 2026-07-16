'use client';

import React, { useEffect } from 'react';
import { SessionProvider, useSession, signOut } from 'next-auth/react';

function InactivityAutoSignout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        signOut({ callbackUrl: '/login' });
      }, 5 * 60 * 1000); // 5 minutes inactivity
    };

    // Events to monitor for activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    // Initialize timer
    resetTimer();

    // Add event listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [session]);

  return null;
}

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
          .then((reg) => console.log('Fashion Designer ServiceWorker registered:', reg.scope))
          .catch((err) => console.error('Fashion Designer ServiceWorker failed:', err));
      }
    }
  }, []);

  return (
    <SessionProvider>
      <InactivityAutoSignout />
      {children}
    </SessionProvider>
  );
}
