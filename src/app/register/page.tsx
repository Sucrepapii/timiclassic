'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scissors, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#d4af37]/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111111]/85 border border-[#1f1b12] rounded-xl p-8 backdrop-blur-md shadow-2xl relative">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#111] to-[#1f1b12] border border-[#d4af37]/35 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
            <Scissors className="w-6 h-6 text-[#d4af37]" />
          </div>
          <h1 className="text-3xl font-serif tracking-widest uppercase font-semibold text-[#f5f5f0]">
            TIMICLASSIC
          </h1>
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4af37] mt-1.5 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-[#d4af37]" /> Register Designer
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 bg-red-950/40 border border-red-900/60 text-red-200 p-3.5 rounded-lg text-xs leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-start gap-2 bg-emerald-950/40 border border-emerald-900/60 text-emerald-200 p-3.5 rounded-lg text-xs leading-relaxed">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>Registration successful! Redirecting to login...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#8e8e88] mb-1.5 font-medium">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full luxury-input text-sm"
              placeholder="e.g. Timi Classic"
            />
          </div>

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
              placeholder="e.g. designer@timiclassic.com"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-widest text-[#8e8e88] mb-1.5 font-medium">
              Password
            </label>
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
            disabled={loading || success}
            className="w-full mt-4 luxury-btn-primary flex items-center justify-center text-sm font-semibold tracking-widest uppercase transition-all py-3 shadow-[0_0_15px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:pointer-events-none"
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-[#1f1b12]/50 pt-5 text-xs text-[#8e8e88]">
          <p>
            Already have an account?{' '}
            <Link href="/login" className="text-[#d4af37] hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
