'use client';

import React from 'react';
import Link from 'next/link';
import { Scissors, Crown, Sparkles, ArrowRight } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f0] font-sans flex flex-col">
      {/* Navbar (Fixed at Top) */}
      <nav className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between z-[200] bg-[#050505]/80 backdrop-blur-md border-b border-[#1f1b12]/40">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Timiclassic Logo" className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]/30" />
          <div>
            <h1 className="text-lg font-serif tracking-widest uppercase font-bold text-[#f5f5f0] drop-shadow-md">
              TIMICLASSIC
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37] font-semibold drop-shadow-md">
              Bespoke Fashion House
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-semibold text-[#8e8e88]">
            <Link href="#hero" className="hover:text-[#d4af37] transition-colors">Home</Link>
            <Link href="#about" className="hover:text-[#d4af37] transition-colors">About Us</Link>
            <Link href="/collections" className="hover:text-[#d4af37] transition-colors">Collections</Link>
          </div>

          <Link
            href="/login"
            className="text-xs uppercase tracking-widest font-bold border border-[#d4af37]/50 bg-black/30 backdrop-blur-md hover:bg-[#d4af37]/10 text-[#f5f5f0] hover:text-[#d4af37] px-6 py-2.5 rounded-lg transition-all shadow-lg"
          >
            Access Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative w-full h-screen">
        {/* Background Slider without text */}
        <HeroSlider showText={false} />
      </section>

      {/* Portals Section */}
      <section className="w-full max-w-5xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Designer Console */}
        <Link
          href="/login"
          className="group relative bg-[#111] border border-[#1f1b12] rounded-2xl p-8 text-left transition-all hover:border-[#d4af37]/60 hover:bg-[#161616] shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-black border border-[#1f1b12] group-hover:border-[#d4af37]/50 rounded-xl flex items-center justify-center text-[#d4af37] shadow-inner transition-all">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-base uppercase tracking-widest font-bold text-[#f5f5f0] group-hover:text-[#d4af37] transition-all drop-shadow-md">
              Designer Console
            </h3>
          </div>
          <p className="text-xs text-[#8e8e88] leading-relaxed font-light">
            Manage client profiles, custom measurements, and track the production pipeline.
          </p>
          <div className="mt-6 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2: Client Portal */}
        <Link
          href="/login?isPortal=true"
          className="group relative bg-[#111] border border-[#1f1b12] rounded-2xl p-8 text-left transition-all hover:border-[#d4af37]/60 hover:bg-[#161616] shadow-2xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-black border border-[#1f1b12] group-hover:border-[#d4af37]/50 rounded-xl flex items-center justify-center text-[#d4af37] shadow-inner transition-all">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-base uppercase tracking-widest font-bold text-[#f5f5f0] group-hover:text-[#d4af37] transition-all drop-shadow-md">
              Client Portal
            </h3>
          </div>
          <p className="text-xs text-[#8e8e88] leading-relaxed font-light">
            View active order milestones, measurement history, and fetch invoices.
          </p>
          <div className="mt-6 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
            <span>Enter Portal</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative w-full py-24 px-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-1.5 bg-[#111] border border-[#1f1b12] px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-[#d4af37] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Established 2026
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide leading-tight">
            The Definition of <br />
            <span className="text-[#d4af37]">Couture Excellence</span>
          </h2>
          <p className="text-sm text-[#8e8e88] leading-relaxed max-w-md">
            At Timiclassic, we believe that true luxury lies in the details. Every stitch, every seam, and every fabric selection is meticulously curated to deliver unparalleled elegance and fit.
          </p>
          <p className="text-sm text-[#8e8e88] leading-relaxed max-w-md">
            Our atelier merges traditional bespoke craftsmanship with modern operational efficiency, ensuring that your garments are not just beautifully made, but perfectly orchestrated.
          </p>
          <button className="uppercase tracking-widest text-xs font-bold border-b border-[#d4af37] text-[#d4af37] pb-1 hover:text-[#f5f5f0] hover:border-[#f5f5f0] transition-all">
            Read Our Story
          </button>
        </div>
        <div className="flex-1">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#1f1b12] shadow-2xl">
            {/* Using one of the dress images as an about-us showcase */}
            <img 
              src="/dresses/dress_gold.png" 
              alt="Timiclassic Atelier" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Footer Overlay */}
      <footer className="w-full border-t border-[#1f1b12]/40 py-8 text-center flex flex-col items-center gap-2 text-[10px] text-[#8e8e88] uppercase tracking-wider font-semibold bg-[#050505]">
        <p>© 2026 Timiclassic Bespoke Clothing. All Rights Reserved.</p>
        <p className="flex items-center justify-center gap-1 mt-2">
          <Sparkles className="w-3 h-3 text-[#d4af37]" /> Built with Couture Integrity
        </p>
      </footer>
    </main>
  );
}
