'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface BookFittingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dressName?: string;
}

export default function BookFittingModal({ isOpen, onClose, dressName }: BookFittingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] border border-[#1f1b12] w-full max-w-lg rounded-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-[#1f1b12] shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#f5f5f0] uppercase tracking-wider">Book a Fitting</h2>
            {dressName && (
              <p className="text-[#d4af37] text-xs uppercase tracking-widest mt-1">For: {dressName}</p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="text-[#8e8e88] hover:text-[#d4af37] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#d4af37] text-[#d4af37] mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-xl font-serif text-[#f5f5f0] mb-2">Request Received</h3>
              <p className="text-[#8e8e88] text-sm">Our atelier will contact you shortly to confirm your fitting appointment.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Full Name</label>
                  <input required type="text" className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="Jane Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Email Address</label>
                  <input required type="email" className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="jane@example.com" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Phone Number</label>
                  <input required type="tel" className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="+1 (555) 000-0000" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Preferred Date</label>
                  <input type="date" className="w-full bg-[#111] border border-[#1f1b12] text-[#8e8e88] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Additional Inquiries</label>
                <textarea rows={4} className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none" placeholder="Any specific requirements or measurements we should know about?"></textarea>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs py-3 px-6 hover:bg-[#b08d2c] transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
