'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Scissors, Crown, Compass, Menu, X } from 'lucide-react';

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f7f4eb] text-[#0d0d0c] font-sans flex flex-col selection:bg-[#a67c1e]/30 selection:text-[#a67c1e]">
      {/* Navbar (Fixed at Top) */}
      <nav className="fixed top-0 left-0 w-full px-8 py-4 flex items-center justify-between z-[200] bg-[#f7f4eb]/80 backdrop-blur-md border-b border-[#d1c9b8]/40">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-[#5c564a] hover:text-[#a67c1e] transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Timiclassic Logo" className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#a67c1e]/30" />
            <div>
              <h1 className="text-lg font-serif tracking-widest uppercase font-bold text-[#0d0d0c] drop-shadow-md">
                TIMICLASSIC
              </h1>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#a67c1e] font-semibold drop-shadow-md">
                Our Story
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <div className="hidden md:flex gap-6 text-xs uppercase tracking-widest font-semibold text-[#5c564a]">
            <Link href="/" className="hover:text-[#a67c1e] transition-colors">Home</Link>
            <Link href="/about" className="text-[#a67c1e] transition-colors">About Us</Link>
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
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#0d0d0c] hover:text-[#a67c1e] transition-colors">Home</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl uppercase tracking-widest font-bold text-[#a67c1e] transition-colors">About Us</Link>
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
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden border-b border-[#d1c9b8]/30 mt-16">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-30 contrast-110" style={{ backgroundImage: `url('/dresses/couture-6.jpg')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f4eb] via-[#f7f4eb]/50 to-transparent" />
        
        <div className="relative z-10 text-center space-y-6 max-w-4xl px-8">
          <div className="inline-flex items-center gap-2 bg-[#111] border border-[#d1c9b8] px-4 py-2 rounded-full text-xs tracking-widest uppercase text-[#a67c1e] font-bold shadow-2xl">
            <Sparkles className="w-4 h-4" /> The Timiclassic Legacy
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-wide leading-tight">
            Elegance in <span className="text-[#a67c1e]">Every Thread</span>
          </h1>
          <p className="text-sm md:text-base text-[#5c564a] max-w-2xl mx-auto leading-relaxed">
            A journey of master craftsmanship, precision structural design, and traditional cultural heritage blended with contemporary luxury.
          </p>
        </div>
      </section>

      {/* Narrative Section */}
      <section className="w-full max-w-6xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide">
            Where Craft Meets <span className="text-[#a67c1e]">Identity</span>
          </h2>
          <p className="text-sm text-[#5c564a] leading-relaxed">
            Founded in 2018, Timiclassic started as a visionary bespoke atelier in response to a growing need for unmatched precision and high-fashion couture. What began as a local sanctuary for tailored luxury has evolved into a state-of-the-art bespoke fashion house.
          </p>
          <p className="text-sm text-[#5c564a] leading-relaxed">
            We specialize in creating premium custom garments—ranging from structural bridal gowns that captivate the room, to vibrant, heritage-rich traditional outfits that celebrate identity and culture. Each piece is modeled and constructed to the wearer's unique dimensions, ensuring an absolute second-skin fit.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4 border-t border-[#d1c9b8]/60">
            <div>
              <div className="text-2xl font-serif text-[#a67c1e] font-bold">2018</div>
              <div className="text-[10px] uppercase text-[#5c564a] tracking-widest font-semibold mt-1">Established</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-[#a67c1e] font-bold">100%</div>
              <div className="text-[10px] uppercase text-[#5c564a] tracking-widest font-semibold mt-1">Bespoke Fits</div>
            </div>
            <div>
              <div className="text-2xl font-serif text-[#a67c1e] font-bold">900+</div>
              <div className="text-[10px] uppercase text-[#5c564a] tracking-widest font-semibold mt-1">Garments Created</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#d1c9b8] shadow-2xl">
            <img src="/dresses/couture-6.jpg" alt="Bridal Craftsmanship" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] tracking-widest uppercase text-[#a67c1e] font-bold">Bridal Couture</span>
            </div>
          </div>
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden border border-[#d1c9b8] shadow-2xl translate-y-8">
            <img src="/dresses/couture-7.jpg" alt="Heritage Attire" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] tracking-widest uppercase text-[#a67c1e] font-bold">Heritage Azure</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Pillars (Philosophy) */}
      <section className="bg-[#eae5da]/40 border-y border-[#d1c9b8]/50 py-24 w-full">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-serif tracking-wide">
              Our Creative <span className="text-[#a67c1e]">Pillars</span>
            </h2>
            <p className="text-xs text-[#5c564a] uppercase tracking-widest font-bold">
              The values that guide every single stitch at Timiclassic
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#fdfcf7] border border-[#d1c9b8] p-8 rounded-xl space-y-4 hover:border-[#a67c1e]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#d1c9b8] flex items-center justify-center text-[#a67c1e]">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold">Uncompromising Fit</h3>
              <p className="text-xs text-[#5c564a] leading-relaxed font-light">
                We take over 30 measurement checkpoints for every client. Our patterns are individually drafted to ensure an effortless, comfortable, and perfect posture alignment.
              </p>
            </div>

            <div className="bg-[#fdfcf7] border border-[#d1c9b8] p-8 rounded-xl space-y-4 hover:border-[#a67c1e]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#d1c9b8] flex items-center justify-center text-[#a67c1e]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold">Structural Precision</h3>
              <p className="text-xs text-[#5c564a] leading-relaxed font-light">
                From built-in corsetry to hand-sewn canvas interfacing, we sculpt the interior structure of our garments so they drape naturally and retain their majestic shape.
              </p>
            </div>

            <div className="bg-[#fdfcf7] border border-[#d1c9b8] p-8 rounded-xl space-y-4 hover:border-[#a67c1e]/40 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-black border border-[#d1c9b8] flex items-center justify-center text-[#a67c1e]">
                <Crown className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-bold">Heritage & Innovation</h3>
              <p className="text-xs text-[#5c564a] leading-relaxed font-light">
                We honor rich fabrics (Aso-Oke, Brocade, Silk, Lace) and traditional weaving techniques, blending them seamlessly with modern cuts and contemporary styling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Atelier Process */}
      <section className="w-full max-w-5xl mx-auto px-8 py-24">
        <div className="text-center space-y-4 mb-20">
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide">
            The Atelier <span className="text-[#a67c1e]">Journey</span>
          </h2>
          <p className="text-xs text-[#5c564a] uppercase tracking-widest font-bold">
            How we translate concepts into couture
          </p>
        </div>

        <div className="relative border-l border-[#a67c1e]/20 ml-4 md:ml-32 space-y-16">
          {/* Step 1 */}
          <div className="relative pl-8 md:pl-16">
            <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#f7f4eb] border-2 border-[#a67c1e] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a67c1e]" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] tracking-widest uppercase text-[#a67c1e] font-bold">Step 01</span>
              <h3 className="text-xl font-serif font-bold text-[#0d0d0c]">Consultation & Silhouette Mapping</h3>
              <p className="text-xs text-[#5c564a] max-w-xl leading-relaxed font-light">
                We sit down to understand your design vision, review inspiration, and choose high-quality fabrics. Our head designer maps the silhouette that best complements your form.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative pl-8 md:pl-16">
            <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#f7f4eb] border-2 border-[#a67c1e] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a67c1e]" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] tracking-widest uppercase text-[#a67c1e] font-bold">Step 02</span>
              <h3 className="text-xl font-serif font-bold text-[#0d0d0c]">Custom Pattern Drafting</h3>
              <p className="text-xs text-[#5c564a] max-w-xl leading-relaxed font-light">
                Your precise measurements are translated onto heavy drafting card. A separate, unique paper blueprint is created from scratch for each outfit—ensuring there are no pre-made templates.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative pl-8 md:pl-16">
            <div className="absolute -left-[9px] top-1.5 w-4.5 h-4.5 rounded-full bg-[#f7f4eb] border-2 border-[#a67c1e] flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#a67c1e]" />
            </div>
            <div className="space-y-2">
              <span className="text-[10px] tracking-widest uppercase text-[#a67c1e] font-bold">Step 03</span>
              <h3 className="text-xl font-serif font-bold text-[#0d0d0c]">Fittings & Assembly</h3>
              <p className="text-xs text-[#5c564a] max-w-xl leading-relaxed font-light">
                The garment is hand-basted together for a preliminary fitting. After adjusting and refining the fit on your body, the dress is carefully stitched, hand-beaded, and lined.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-transparent to-[#eae5da] py-24 text-center px-8 border-t border-[#d1c9b8]/30">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-serif tracking-wide">
            Ready to Begin Your <br/>
            <span className="text-[#a67c1e]">Bespoke Experience?</span>
          </h2>
          <p className="text-xs text-[#5c564a] leading-relaxed max-w-md mx-auto">
            Book an appointment for a personalized fitting, consultation, and see our materials up close.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/collections"
              className="inline-flex items-center justify-center text-xs uppercase tracking-widest font-bold border border-[#a67c1e] bg-[#a67c1e] hover:bg-[#a67c1e]/10 text-black hover:text-[#a67c1e] px-8 py-3.5 rounded transition-all shadow-xl w-full sm:w-auto"
            >
              Explore Collections
            </Link>
            <a
              href="/Timiclassic_Luxury_Portfolio.pdf"
              download="Timiclassic_Luxury_Portfolio.pdf"
              className="inline-flex items-center justify-center text-xs uppercase tracking-widest font-bold border border-[#a67c1e]/50 hover:border-[#a67c1e] bg-transparent hover:bg-[#a67c1e]/10 text-[#a67c1e] px-8 py-3.5 rounded transition-all shadow-xl w-full sm:w-auto"
            >
              Download Portfolio PDF
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-[#d1c9b8]/40 py-8 text-center flex flex-col items-center gap-2 text-[10px] text-[#5c564a] uppercase tracking-wider font-semibold bg-[#f7f4eb]">
        <p>© {new Date().getFullYear()} Timiclassic Bespoke Clothing. All Rights Reserved.</p>
        <p className="flex items-center justify-center gap-1 mt-2">
          <Sparkles className="w-3 h-3 text-[#a67c1e]" /> Elegance in Every Thread
        </p>
      </footer>
    </main>
  );
}
