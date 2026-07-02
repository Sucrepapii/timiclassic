'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Scissors,
  Layers,
  Mail,
  LogOut,
  Sparkles,
  Play,
  Square,
  Clock
} from 'lucide-react';
import { useTimerStore } from '@/store/useStore';

export default function DesignerLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Connect task timer
  const { isRunning, activeTaskTitle, elapsedSeconds, tick, stopTimer } = useTimerStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopTimer = async () => {
    const result = useTimerStore.getState().stopTimer();
    if (result) {
      const { elapsedHours, taskId } = result;
      // Log timer completion to DB
      try {
        await fetch('/api/tasks', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId, addTime: elapsedHours }),
        });
        alert(`Logged ${elapsedHours} hours to task!`);
      } catch (err) {
        console.error('Failed to log time:', err);
      }
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Orders & Garments', href: '/orders', icon: Scissors },
    { name: 'Kanban Board', href: '/kanban', icon: Layers },
    { name: 'Communication Hub', href: '/communications', icon: Mail },
  ];

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-[#d4af37]">Loading DesignerOS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#050505] text-[#f5f5f0]">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#111111] border-r border-[#1f1b12] flex flex-col justify-between shrink-0">
        <div>
          {/* Header Branding */}
          <div className="p-6 border-b border-[#1f1b12]/50">
            <Link href="/dashboard" className="group">
              <h2 className="text-xl font-serif tracking-widest uppercase font-semibold text-[#f5f5f0] group-hover:text-[#d4af37] transition-all">
                TIMICLASSIC
              </h2>
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#d4af37] mt-1 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3" /> DesignerOS
              </p>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[#d4af37] text-[#050505] shadow-[0_0_12px_rgba(212,175,55,0.2)] font-semibold'
                      : 'text-[#8e8e88] hover:text-[#f5f5f0] hover:bg-[#161616]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Widget Area (Time tracker / profile) */}
        <div className="p-4 border-t border-[#1f1b12]/50 space-y-4 bg-[#0d0d0d]">
          {/* Live Task Timer Widget */}
          {isRunning && (
            <div className="border border-[#d4af37]/30 bg-[#161410] p-3.5 rounded-lg flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#d4af37]">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span className="text-[9px] uppercase tracking-widest font-semibold">Active Timer</span>
                </div>
                <span className="text-xs font-mono text-[#d4af37] font-semibold">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <p className="text-xs font-serif italic line-clamp-1 text-[#f5f5f0]">
                {activeTaskTitle}
              </p>
              <button
                onClick={handleStopTimer}
                className="w-full flex items-center justify-center gap-1.5 bg-red-950/60 border border-red-800 text-red-200 py-1.5 rounded text-[10px] uppercase font-bold tracking-widest hover:bg-red-900/80 transition-all cursor-pointer"
              >
                <Square className="w-3 h-3 fill-red-200" /> Stop & Log
              </button>
            </div>
          )}

          {/* Designer User profile */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1f1b12] to-[#d4af37]/20 border border-[#d4af37]/30 flex items-center justify-center text-sm font-serif font-bold text-[#d4af37] shrink-0">
                {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'T'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-[#f5f5f0] truncate">
                  {session?.user?.name || 'Timi Designer'}
                </p>
                <p className="text-[10px] text-[#8e8e88] uppercase tracking-widest font-semibold">
                  {(session?.user as any)?.role || 'ADMIN'}
                </p>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-[#8e8e88] hover:text-red-400 p-2 hover:bg-[#161616] rounded-md transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1 p-8 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
