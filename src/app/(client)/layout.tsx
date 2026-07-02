'use client';

import React from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { Crown, LogOut, Sparkles } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-[#d4af37]">Loading Timiclassic Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f0]">
      {/* Top Header Navbar */}
      <header className="bg-[#111] border-b border-[#1f1b12] px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Timiclassic Logo" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(212,175,55,0.2)]" />
          <div>
            <h1 className="text-sm font-serif tracking-widest uppercase font-semibold text-[#f5f5f0]">
              TIMICLASSIC
            </h1>
            <p className="text-[9px] tracking-[0.2em] uppercase text-[#d4af37] font-semibold mt-0.5">
              Client Portal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-[#8e8e88]">
            Welcome, <span className="text-[#f5f5f0]">{session?.user?.name || 'Valued Client'}</span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-red-400 hover:text-red-300 transition-all border border-red-950 hover:bg-red-950/20 px-3 py-1.5 rounded cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
