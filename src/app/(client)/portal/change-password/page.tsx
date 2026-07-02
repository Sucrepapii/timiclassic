'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { update } = useSession();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await fetch('/api/portal/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      
      if (res.ok) {
        setSuccess(true);
        
        // Wait so they can see the success message, then update session and redirect
        setTimeout(() => {
          update({ needsPasswordChange: false }).then(() => {
            window.location.href = '/portal';
          });
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#111111] border border-[#1f1b12] rounded-xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 bg-[#1f1b12]/30 border border-[#d4af37]/30 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert className="w-6 h-6 text-[#d4af37]" />
          </div>
          <h1 className="text-2xl font-serif tracking-wide text-[#f5f5f0]">Security Update Required</h1>
          <p className="text-xs text-[#8e8e88] mt-2 leading-relaxed">
            For your security, please change the temporary password provided by your designer before accessing your portal.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-950/40 border border-red-900/60 text-red-200 rounded text-xs text-center">
            {error}
          </div>
        )}
        
        {success ? (
          <div className="flex flex-col items-center justify-center p-6 bg-green-950/20 border border-green-900/50 rounded-lg text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
            <h3 className="text-sm font-semibold text-green-400">Password Updated!</h3>
            <p className="text-xs text-[#8e8e88]">Redirecting you to your portal...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#8e8e88] mb-1.5 font-medium">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full luxury-input text-sm pr-10"
                  placeholder="Enter a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8e8e88] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#8e8e88] mb-1.5 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full luxury-input text-sm pr-10"
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8e8e88] hover:text-[#d4af37] transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 luxury-btn-primary py-3 text-xs uppercase tracking-widest font-semibold disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password & Continue'}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
              import('next-auth/react').then((mod) => mod.signOut({ callbackUrl: '/' }));
            }} 
            className="text-xs uppercase tracking-widest text-[#8e8e88] hover:text-[#d4af37] transition-colors font-semibold"
          >
            Cancel & Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
