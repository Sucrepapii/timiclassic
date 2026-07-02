'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Scissors, Crown, AlertCircle, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isPortal, setIsPortal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="w-full max-w-md bg-[#111111]/85 border border-[#1f1b12] rounded-xl p-8 backdrop-blur-md shadow-2xl relative">
      {/* Brand Banner */}
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-14 h-14 bg-gradient-to-tr from-[#111] to-[#1f1b12] border border-[#d4af37]/35 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
          {isPortal ? (
            <Crown className="w-6 h-6 text-[#d4af37]" />
          ) : (
            <Scissors className="w-6 h-6 text-[#d4af37]" />
          )}
        </div>
        <h1 className="text-3xl font-serif tracking-widest uppercase font-semibold text-[#f5f5f0]">
          TIMICLASSIC
        </h1>
        <p className="text-xs tracking-[0.3em] uppercase text-[#d4af37] mt-1.5 flex items-center gap-1 font-medium">
          <Sparkles className="w-3 h-3 text-[#d4af37]" /> DesignerOS
        </p>
      </div>

      {/* Console / Portal Toggle */}
      <div className="grid grid-cols-2 gap-1 p-1 bg-[#161616] border border-[#1f1b12] rounded-lg mb-6">
        <button
          type="button"
          onClick={() => {
            setIsPortal(false);
            setError(null);
          }}
          className={`py-2 px-3 text-xs tracking-wider uppercase rounded-md font-medium transition-all ${
            !isPortal
              ? 'bg-[#d4af37] text-[#050505] shadow-md'
              : 'text-[#8e8e88] hover:text-[#f5f5f0]'
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
          className={`py-2 px-3 text-xs tracking-wider uppercase rounded-md font-medium transition-all ${
            isPortal
              ? 'bg-[#d4af37] text-[#050505] shadow-md'
              : 'text-[#8e8e88] hover:text-[#f5f5f0]'
          }`}
        >
          Client Portal
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-5 flex items-start gap-2 bg-red-950/40 border border-red-900/60 text-red-200 p-3.5 rounded-lg text-xs leading-relaxed">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-widest text-[#8e8e88] mb-1.5 font-medium">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full luxury-input text-sm"
            placeholder="e.g. fashion@timiclassic.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="block text-[11px] uppercase tracking-widest text-[#8e8e88] font-medium">
              Password
            </label>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full luxury-input text-sm"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 luxury-btn-primary flex items-center justify-center text-sm font-semibold tracking-widest uppercase transition-all py-3 shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-8 text-center border-t border-[#1f1b12]/50 pt-5 text-xs text-[#8e8e88]">
        {isPortal ? (
          <p>
            Don't have portal access?{' '}
            <span className="text-[#d4af37] font-medium">Contact Timiclassic support</span>
          </p>
        ) : (
          <p>
            Need to register a designer account?{' '}
            <Link href="/register" className="text-[#d4af37] hover:underline font-medium">
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-[#111111]/85 border border-[#1f1b12] rounded-xl p-8 backdrop-blur-md flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] uppercase tracking-widest text-[#d4af37]">Loading Credentials Panel...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
