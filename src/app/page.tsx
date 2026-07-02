'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, Crown, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f0] flex flex-col justify-between p-8 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-[-30%] left-[-15%] w-[650px] h-[650px] rounded-full bg-[#d4af37]/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-15%] w-[650px] h-[650px] rounded-full bg-[#d4af37]/5 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-10 py-4 border-b border-[#1f1b12]/40">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Timiclassic Logo" className="w-8 h-8 rounded-full object-cover shadow-[0_0_10px_rgba(212,175,55,0.2)]" />
          <div>
            <h1 className="text-sm font-serif tracking-widest uppercase font-semibold text-[#f5f5f0]">
              TIMICLASSIC
            </h1>
            <p className="text-[8px] tracking-[0.2em] uppercase text-[#d4af37] font-semibold">
              Bespoke Fashion House
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="text-xs uppercase tracking-widest font-bold border border-[#1f1b12] hover:border-[#d4af37]/35 text-[#8e8e88] hover:text-[#d4af37] px-4 py-2 rounded-lg transition-all"
        >
          Access Portal
        </Link>
      </header>

      {/* Hero section */}
      <section className="max-w-5xl mx-auto w-full flex-1 flex flex-col justify-center items-center py-16 text-center z-10 space-y-8">
        <div className="inline-flex items-center gap-1.5 bg-[#111] border border-[#1f1b12] px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-[#d4af37] font-bold shadow-md">
          <Sparkles className="w-3.5 h-3.5" /> Crafting Tailored Perfection
        </div>

        <h2 className="text-4xl md:text-6xl font-serif tracking-wide text-[#f5f5f0] max-w-2xl leading-tight">
          Where Couture Design Meets Modern <span className="gold-text-gradient font-semibold">Operations</span>
        </h2>

        <p className="text-xs md:text-sm text-[#8e8e88] tracking-widest uppercase max-w-lg leading-relaxed font-semibold">
          Timi Classic command center coordinates fabric selection, customer measurements, production workflows, and real-time client communications.
        </p>

        {/* Dashboard Access Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl pt-6">
          {/* Card 1: Designer Console */}
          <Link
            href="/login"
            className="group relative bg-[#111]/80 hover:bg-[#111] border border-[#1f1b12] rounded-xl p-6 text-left transition-all hover:border-[#d4af37]/40 shadow-xl"
          >
            <div className="w-10 h-10 bg-[#161616] border border-[#1f1b12] group-hover:border-[#d4af37]/35 rounded-lg flex items-center justify-center text-[#d4af37] mb-4 shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#f5f5f0] group-hover:text-[#d4af37] transition-all">
              Designer Console
            </h3>
            <p className="text-[11px] text-[#8e8e88] mt-2 leading-relaxed">
              Log client profiles, track custom measurements, record sewing hours, and oversee the production pipeline.
            </p>
            <div className="mt-5 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Client Portal */}
          <Link
            href="/login?isPortal=true"
            className="group relative bg-[#111]/80 hover:bg-[#111] border border-[#1f1b12] rounded-xl p-6 text-left transition-all hover:border-[#d4af37]/40 shadow-xl"
          >
            <div className="w-10 h-10 bg-[#161616] border border-[#1f1b12] group-hover:border-[#d4af37]/35 rounded-lg flex items-center justify-center text-[#d4af37] mb-4 shadow-md">
              <Crown className="w-5 h-5" />
            </div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#f5f5f0] group-hover:text-[#d4af37] transition-all">
              Client Portal
            </h3>
            <p className="text-[11px] text-[#8e8e88] mt-2 leading-relaxed">
              Check active order milestones, view body measurement history, upload sketch inspiration, and fetch invoices.
            </p>
            <div className="mt-5 flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
              <span>Enter Portal</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto w-full z-10 border-t border-[#1f1b12]/40 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-[10px] text-[#8e8e88] uppercase tracking-wider font-semibold">
        <p>© 2026 Timiclassic Bespoke Clothing. All Rights Reserved.</p>
        <p className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#d4af37]" /> Built with Couture Integrity
        </p>
      </footer>
    </main>
  );
}
