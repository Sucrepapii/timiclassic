'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { allSlides } from '@/components/HeroSlider';
import BookFittingModal from '@/components/BookFittingModal';
import ViewDetailsModal from '@/components/ViewDetailsModal';
import { Sparkles, ArrowLeft, Menu, X } from 'lucide-react';

export default function CollectionsPage() {
  const [isBookFittingOpen, setIsBookFittingOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedDress, setSelectedDress] = useState<any>(null);

  const openBookFitting = (dress: any) => {
    setSelectedDress(dress);
    setIsBookFittingOpen(true);
  };

  const openViewDetails = (dress: any) => {
    setSelectedDress(dress);
    setIsViewDetailsOpen(true);
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f5f0] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between z-[200] bg-[#050505]/80 backdrop-blur-md border-b border-[#1f1b12]/40">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#8e8e88] hover:text-[#d4af37] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Timiclassic Logo" className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#d4af37]/30" />
            <div>
              <h1 className="text-lg font-serif tracking-widest uppercase font-bold text-[#f5f5f0] drop-shadow-md">
                TIMICLASSIC
              </h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#d4af37] font-semibold drop-shadow-md">
                Collections
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-semibold text-[#8e8e88]">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">Home</Link>
            <Link href="/#about" className="hover:text-[#d4af37] transition-colors">About Us</Link>
            <Link href="/collections" className="text-[#d4af37] transition-colors">Collections</Link>
          </div>

          <Link
            href="/login"
            className="hidden md:block text-xs uppercase tracking-widest font-bold border border-[#d4af37]/50 bg-black/30 backdrop-blur-md hover:bg-[#d4af37]/10 text-[#f5f5f0] hover:text-[#d4af37] px-6 py-2.5 rounded-lg transition-all shadow-lg"
          >
            Access Portal
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-[#f5f5f0] hover:text-[#d4af37] transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[190] bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#f5f5f0] hover:text-[#d4af37] transition-colors">Home</Link>
          <Link href="/#about" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#f5f5f0] hover:text-[#d4af37] transition-colors">About Us</Link>
          <Link href="/collections" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#d4af37] transition-colors">Collections</Link>
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="mt-8 text-sm uppercase tracking-widest font-bold border border-[#d4af37]/50 bg-black/30 backdrop-blur-md hover:bg-[#d4af37]/10 text-[#f5f5f0] hover:text-[#d4af37] px-8 py-3 rounded-lg transition-all shadow-lg"
          >
            Access Portal
          </Link>
        </div>
      )}

      {/* Grid Content */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-8 py-32 flex flex-col gap-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#111] border border-[#1f1b12] px-3.5 py-1.5 rounded-full text-[10px] tracking-widest uppercase text-[#d4af37] font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 2026 Season
          </div>
          <h2 className="text-4xl md:text-5xl font-serif tracking-wide leading-tight text-[#d4af37]">
            Couture Masterpieces
          </h2>
          <p className="text-sm text-[#8e8e88] max-w-2xl mx-auto leading-relaxed">
            Explore our curated selection of bespoke gowns, tailored with precision and luxury in mind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          {allSlides.map((slide) => (
            <div key={slide.id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-[#1f1b12] shadow-2xl bg-[#111]">
              <img 
                src={slide.image} 
                alt={slide.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <div className="text-[#d4af37] font-bold tracking-widest text-xs uppercase mb-1">
                  {slide.title}
                </div>
                <div className="text-3xl font-serif font-bold text-[#f5f5f0] mb-3 uppercase shadow-md">
                  {slide.name}
                </div>
                <div className="text-sm text-gray-300 leading-relaxed max-w-md">
                  {slide.description}
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4 opacity-100 transform translate-y-0 md:opacity-0 md:translate-y-4 transition-all duration-500 md:group-hover:opacity-100 md:group-hover:translate-y-0">
                  <button 
                    onClick={() => openViewDetails(slide)}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-[#d4af37] bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-[#d4af37] transition-colors rounded"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => openBookFitting(slide)}
                    className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-white/30 text-white text-xs font-bold uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors rounded bg-transparent"
                  >
                    Book Fitting
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <BookFittingModal 
        isOpen={isBookFittingOpen} 
        onClose={() => setIsBookFittingOpen(false)} 
        dressName={selectedDress?.name} 
      />
      
      <ViewDetailsModal 
        isOpen={isViewDetailsOpen} 
        onClose={() => setIsViewDetailsOpen(false)} 
        dress={selectedDress} 
        onBookFitting={(dressName) => {
          setIsBookFittingOpen(true);
        }}
      />

      {/* Footer */}
      <footer className="w-full border-t border-[#1f1b12]/40 py-8 text-center flex flex-col items-center gap-2 text-[10px] text-[#8e8e88] uppercase tracking-wider font-semibold bg-[#050505]">
        <p>© 2026 Timiclassic Bespoke Clothing. All Rights Reserved.</p>
        <p className="flex items-center justify-center gap-1 mt-2">
          <Sparkles className="w-3 h-3 text-[#d4af37]" /> Built with Couture Integrity
        </p>
      </footer>
    </main>
  );
}
