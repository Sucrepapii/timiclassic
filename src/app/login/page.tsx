'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Sparkles, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { initialSlides } from '@/components/HeroSlider';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isPortal, setIsPortal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-detect portal intent from URL query params
  useEffect(() => {
    if (searchParams.get('isPortal') === 'true') {
      setIsPortal(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        isPortal: isPortal ? 'true' : 'false',
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Success: Redirect to appropriate route
        if (isPortal) {
          router.push('/portal');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      }
    } catch (err: any) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Banner */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] border border-[#a67c1e]/40 overflow-hidden">
          <img src="/logo.jpg" alt="Timiclassic Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-3xl font-serif tracking-widest uppercase font-semibold text-[#0d0d0c] drop-shadow-md">
          TIMICLASSIC
        </h1>
        <p className="text-xs tracking-[0.2em] uppercase text-[#a67c1e] mt-2 flex items-center gap-1.5 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#a67c1e]" /> Access Portal
        </p>
      </div>

      {/* Console / Portal Toggle */}
      <div className="relative flex p-1.5 bg-[#fdfcf7] border border-[#d1c9b8] rounded-full mb-8 shadow-inner">
        <div 
          className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#a67c1e] rounded-full transition-transform duration-300 ease-in-out shadow-md"
          style={{ transform: isPortal ? 'translateX(100%)' : 'translateX(0)' }}
        />
        <button
          type="button"
          onClick={() => {
            setIsPortal(false);
            setError(null);
          }}
          className={`flex-1 relative z-10 py-3 text-xs tracking-widest uppercase rounded-full font-bold transition-colors duration-300 ${
            !isPortal ? 'text-[#fdfcf7]' : 'text-[#5c564a] hover:text-[#0d0d0c]'
          }`}
        >
          Designer Console
        </button>
        <button
          type="button"
          onClick={() => {
            setIsPortal(true);
            setError(null);
          }}
          className={`flex-1 relative z-10 py-3 text-xs tracking-widest uppercase rounded-full font-bold transition-colors duration-300 ${
            isPortal ? 'text-[#fdfcf7]' : 'text-[#5c564a] hover:text-[#0d0d0c]'
          }`}
        >
          Client Portal
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-xs leading-relaxed animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1.5">
          <label className="block text-[10px] uppercase tracking-widest text-[#5c564a] font-bold pl-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-[#fdfcf7] border border-[#d1c9b8] rounded-xl px-5 py-4 text-sm text-[#0d0d0c] focus:outline-none focus:border-[#a67c1e]/60 focus:bg-[#eae5da] transition-all placeholder:text-[#333]"
            placeholder="e.g. fashion@timiclassic.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center pl-1">
            <label className="block text-[10px] uppercase tracking-widest text-[#5c564a] font-bold">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#fdfcf7] border border-[#d1c9b8] rounded-xl pl-5 pr-12 py-4 text-sm text-[#0d0d0c] focus:outline-none focus:border-[#a67c1e]/60 focus:bg-[#eae5da] transition-all placeholder:text-[#333]"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#5c564a] hover:text-[#a67c1e] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-[#a67c1e] to-[#8c6717] text-[#0d0d0c] rounded-xl flex items-center justify-center text-sm font-bold tracking-widest uppercase transition-all py-4 hover:shadow-[0_0_20px_rgba(166,124,30,0.4)] disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-95"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-10 text-center border-t border-[#d1c9b8]/50 pt-6 text-[11px] text-[#5c564a] tracking-wider uppercase font-semibold">
        {isPortal ? (
          <p>
            No portal access?{' '}
            <span className="text-[#a67c1e] hover:text-[#0d0d0c] transition-colors cursor-pointer">Contact Support</span>
          </p>
        ) : (
          <p>
            Authorized Personnel Only
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % initialSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f4eb] font-sans flex font-sans">
      
      {/* Left Column - Hero Image */}
      <div className="hidden lg:flex w-1/2 relative bg-[#fdfcf7] overflow-hidden border-r border-[#d1c9b8]">
        {initialSlides.map((slide, index) => (
          <img 
            key={slide.id}
            src={slide.image} 
            alt={slide.name} 
            className={`absolute top-0 left-0 w-full h-full object-cover scale-[1.02] transform transition-all duration-1000 ease-in-out hover:scale-105 ${
              index === currentImageIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Gradients to blend image into the dark UI */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f4eb] via-transparent to-black/30 z-20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#f7f4eb] z-20 pointer-events-none" />
        
        {/* Floating badge over image */}
        <div className="absolute bottom-12 left-12 bg-[#fdfcf7]/80 backdrop-blur-md border border-[#d1c9b8]/40 p-6 rounded-2xl max-w-sm z-30">
          <div className="text-[#a67c1e] text-[10px] tracking-widest uppercase font-bold mb-2 flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#a67c1e] rounded-full animate-pulse" /> Live Production
          </div>
          <h3 className="text-[#0d0d0c] text-lg font-serif mb-2">The Collection</h3>
          <p className="text-[#5c564a] text-xs leading-relaxed">
            Oversee bespoke garments from initial sketch to final fitting through the Timiclassic command center.
          </p>
        </div>
      </div>

      {/* Right Column - Login Interface */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center p-8 sm:p-12">
        {/* Back Button */}
        <Link 
          href="/" 
          className="absolute top-8 right-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#5c564a] hover:text-[#a67c1e] transition-all bg-[#fdfcf7] border border-[#d1c9b8] px-4 py-2 rounded-full font-bold z-10"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return Home
        </Link>
        
        {/* Background glow behind form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#a67c1e]/5 blur-[150px] pointer-events-none" />

        <Suspense fallback={
          <div className="w-full max-w-md flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-2 border-[#a67c1e] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] uppercase tracking-widest text-[#a67c1e] font-bold">Loading Portal...</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>

    </main>
  );
}
