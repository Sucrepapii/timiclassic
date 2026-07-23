'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scissors, Crown, Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f4eb] text-[#0d0d0c] font-sans flex flex-col">
      {/* Navbar (Fixed at Top) */}
      <nav className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between z-[200] bg-[#f7f4eb]/80 backdrop-blur-md border-b border-[#d1c9b8]/40">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="Timiclassic Logo" className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#a67c1e]/30" />
          <div>
            <h1 className="text-lg font-serif tracking-widest uppercase font-bold text-[#0d0d0c] drop-shadow-md">
              TIMICLASSIC
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#a67c1e] font-semibold drop-shadow-md">
              Bespoke Fashion House
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-semibold text-[#5c564a]">
            <Link href="#hero" className="hover:text-[#a67c1e] transition-colors">Home</Link>
            <Link href="#about" className="hover:text-[#a67c1e] transition-colors">About Us</Link>
            <Link href="/collections" className="hover:text-[#a67c1e] transition-colors">Collections</Link>
          </div>

          <Link
            href="/login"
            className="hidden md:block text-xs uppercase tracking-widest font-bold border border-[#a67c1e]/50 bg-black/30 backdrop-blur-md hover:bg-[#a67c1e]/10 text-[#0d0d0c] hover:text-[#a67c1e] px-6 py-2.5 rounded-lg transition-all shadow-lg"
          >
            Access Portal
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#0d0d0c] hover:text-[#a67c1e] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[190] bg-[#f7f4eb]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          <Link href="#hero" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#0d0d0c] hover:text-[#a67c1e] transition-colors">Home</Link>
          <Link href="#about" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#0d0d0c] hover:text-[#a67c1e] transition-colors">About Us</Link>
          <Link href="/collections" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#0d0d0c] hover:text-[#a67c1e] transition-colors">Collections</Link>
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="mt-8 text-sm uppercase tracking-widest font-bold border border-[#a67c1e]/50 bg-black/30 backdrop-blur-md hover:bg-[#a67c1e]/10 text-[#0d0d0c] hover:text-[#a67c1e] px-8 py-3 rounded-lg transition-all shadow-lg"
          >
            Access Portal
          </Link>
        </div>
      )}

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
          className="group relative bg-[#fdfcf7] border border-[#d1c9b8] hover:border-2 hover:border-[#a67c1e] hover:bg-[#a67c1e]/10 rounded-2xl p-8 text-left transition-all shadow-xl hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#f7f4eb] border border-[#d1c9b8] group-hover:border-[#a67c1e] rounded-xl flex items-center justify-center text-[#a67c1e] shadow-inner transition-all">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-base uppercase tracking-widest font-bold text-[#0d0d0c] group-hover:text-[#a67c1e] transition-all drop-shadow-md">
              Designer Console
            </h3>
          </div>
          <p className="text-xs text-[#5c564a] leading-relaxed font-light">
            Manage client profiles, custom measurements, and track the production pipeline.
          </p>
          <div className="mt-6 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#a67c1e]">
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Card 2: Client Portal */}
        <Link
          href="/login?isPortal=true"
          className="group relative bg-[#fdfcf7] border border-[#d1c9b8] hover:border-2 hover:border-[#a67c1e] hover:bg-[#a67c1e]/10 rounded-2xl p-8 text-left transition-all shadow-xl hover:scale-[1.01]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#f7f4eb] border border-[#d1c9b8] group-hover:border-[#a67c1e] rounded-xl flex items-center justify-center text-[#a67c1e] shadow-inner transition-all">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="text-base uppercase tracking-widest font-bold text-[#0d0d0c] group-hover:text-[#a67c1e] transition-all drop-shadow-md">
              Client Portal
            </h3>
          </div>
          <p className="text-xs text-[#5c564a] leading-relaxed font-light">
            View active order milestones, measurement history, and fetch invoices.
          </p>
          <div className="mt-6 flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#a67c1e]">
            <span>Enter Portal</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </section>

      {/* About Us Section */}
      <section id="about" className="relative w-full py-24 px-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-8">
          <div className="inline-flex items-center gap-1.5 bg-[#111] border border-[#d1c9b8] px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-[#a67c1e] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Established 2018
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide leading-tight">
            The Definition of <br />
            <span className="text-[#a67c1e]">Couture Excellence</span>
          </h2>
          <p className="text-sm text-[#5c564a] leading-relaxed max-w-md">
            At Timiclassic, we believe that true luxury lies in the details. Every stitch, every seam, and every fabric selection is meticulously curated to deliver unparalleled elegance and fit.
          </p>
          <p className="text-sm text-[#5c564a] leading-relaxed max-w-md">
            Our atelier merges traditional bespoke craftsmanship with modern operational efficiency, ensuring that your garments are not just beautifully made, but perfectly orchestrated.
          </p>
          <Link 
            href="/about" 
            className="inline-block uppercase tracking-widest text-xs font-bold border-b border-[#a67c1e] text-[#a67c1e] pb-1 hover:text-[#0d0d0c] hover:border-[#0d0d0c] transition-all"
          >
            Read Our Story
          </Link>
        </div>
        <div className="flex-1">
          <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#d1c9b8] shadow-2xl">
            {/* Using one of the dress images as an about-us showcase */}
            <img 
              src="/dresses/couture-2 (6).jpeg" 
              alt="Timiclassic Atelier" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Footer Overlay */}
      <footer className="w-full border-t border-[#d1c9b8]/40 py-8 text-center flex flex-col items-center gap-2 text-[10px] text-[#5c564a] uppercase tracking-wider font-semibold bg-[#f7f4eb]">
        <p>© {new Date().getFullYear()} Timiclassic Bespoke Clothing. All Rights Reserved.</p>
        <p className="flex items-center justify-center gap-1 mt-2">
          <Sparkles className="w-3 h-3 text-[#a67c1e]" /> Elegance in Every Thread
        </p>
      </footer>
    </main>
  );
}
