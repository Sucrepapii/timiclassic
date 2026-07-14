'use client';

import React from 'react';
import { X } from 'lucide-react';

interface DressDetails {
  image: string;
  title: string;
  name: string;
  description: string;
}

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dress: DressDetails | null;
  onBookFitting: (dressName: string) => void;
}

export default function ViewDetailsModal({ isOpen, onClose, dress, onBookFitting }: ViewDetailsModalProps) {
  if (!isOpen || !dress) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-[#0a0a0a] border border-[#1f1b12] w-full max-w-5xl rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-300 max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 p-2 rounded-full text-white hover:text-[#d4af37] hover:bg-black transition-all"
        >
          <X size={24} />
        </button>

        {/* Image Side */}
        <div className="w-full md:w-1/2 h-[40vh] md:h-[80vh] relative">
          <img 
            src={dress.image} 
            alt={dress.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#0a0a0a]"></div>
        </div>

        {/* Content Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
          <div className="text-[#d4af37] font-bold tracking-widest text-xs uppercase mb-2">
            {dress.title} Collection
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#f5f5f0] mb-6 uppercase leading-tight">
            {dress.name}
          </h2>
          
          <div className="space-y-6 text-[#8e8e88] text-sm leading-relaxed mb-10">
            <p className="text-base text-white/90">
              {dress.description}
            </p>
            <div className="border-t border-[#1f1b12] pt-6 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-white text-xs uppercase tracking-widest mb-1">Fabric</h4>
                <p>Premium Imported Silk & French Lace</p>
              </div>
              <div>
                <h4 className="text-white text-xs uppercase tracking-widest mb-1">Craftsmanship</h4>
                <p>Bespoke Tailoring, Hand-Beaded Details</p>
              </div>
              <div>
                <h4 className="text-white text-xs uppercase tracking-widest mb-1">Fit</h4>
                <p>Made to Measure</p>
              </div>
              <div>
                <h4 className="text-white text-xs uppercase tracking-widest mb-1">Production Time</h4>
                <p>6 - 8 Weeks</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button 
              onClick={() => {
                onClose();
                onBookFitting(dress.name);
              }}
              className="flex-1 px-6 py-4 bg-[#d4af37] text-black text-xs font-bold uppercase tracking-widest hover:bg-[#b08d2c] transition-colors text-center"
            >
              Book a Fitting
            </button>
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 border border-[#1f1b12] text-white text-xs font-bold uppercase tracking-widest hover:border-[#d4af37] hover:text-[#d4af37] transition-colors text-center"
            >
              Back to Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
