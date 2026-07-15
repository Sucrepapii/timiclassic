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
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const date = formData.get('date');
    const notes = formData.get('notes');
    
    let text = `Hello Timiclassic, I would like to book a fitting.`;
    if (dressName) text += `\n*Dress:* ${dressName}`;
    text += `\n*Name:* ${name}`;
    text += `\n*Email:* ${email}`;
    text += `\n*Phone:* ${phone}`;
    if (date) text += `\n*Preferred Date:* ${date}`;
    if (notes) text += `\n*Notes:* ${notes}`;
    
    const whatsappUrl = `https://wa.me/2347058255440?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Full Name</label>
                <input name="name" required type="text" className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="Jane Doe" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Email Address</label>
                <input name="email" required type="email" className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="jane@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Phone Number</label>
                <input name="phone" required type="tel" className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors" placeholder="+234 (555) 000-0000" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Preferred Date</label>
                <input name="date" type="date" className="w-full bg-[#111] border border-[#1f1b12] text-[#8e8e88] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors [&::-webkit-calendar-picker-indicator]:filter-[invert(1)]" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#8e8e88] uppercase tracking-wider">Additional Inquiries</label>
              <textarea name="notes" rows={4} className="w-full bg-[#111] border border-[#1f1b12] text-[#f5f5f0] px-4 py-2 text-sm focus:outline-none focus:border-[#d4af37] transition-colors resize-none" placeholder="Any specific requirements or measurements we should know about?"></textarea>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                className="w-full bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs py-3 px-6 hover:bg-[#b08d2c] transition-colors flex items-center justify-center gap-2"
              >
                Continue to WhatsApp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
