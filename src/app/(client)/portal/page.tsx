'use client';

import React, { useState, useEffect } from 'react';
import {
  Crown,
  Scissors,
  Banknote,
  Calendar,
  MessageSquare,
  Camera,
  Download,
  Upload,
  Send,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  Bell,
  ChevronUp,
  Star
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/billing/InvoicePDF';
import toast from 'react-hot-toast';

interface Garment {
  id: string;
  name: string;
  description: string | null;
  designFiles: string[];
  fabricType: string | null;
  color: string | null;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  dueDate: string | null;
  totalAmount: number | null;
  depositPaid: number | null;
  balanceDue: number | null;
  notes: string | null;
  createdAt: string;
  garments: Garment[];
}

interface Communication {
  id: string;
  type: string;
  direction: string;
  subject: string | null;
  content: string;
  createdAt: string;
}

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  measurements: any;
  orders: Order[];
  communications: Communication[];
}

const TIMELINE_STEPS = [
  'CONFIRMED',
  'DESIGN_PHASE',
  'FABRIC_SOURCING',
  'SEWING',
  'FITTING',
  'QUALITY_CHECK',
  'COMPLETED'
];

const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: 'Order Confirmed',
  DESIGN_PHASE: 'Design Phase',
  FABRIC_SOURCING: 'Fabric Sourcing',
  SEWING: 'Sewing / Crafting',
  FITTING: 'Fitting Session',
  QUALITY_CHECK: 'Quality Checking',
  COMPLETED: 'Ready for Collection',
  DRAFT: 'Drafting Details',
  DELIVERED: 'Delivered',
  CANCELLED: 'Order Cancelled'
};

export default function ClientPortalPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleLogExpand = (id: string) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Send request message state
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/portal/profile');
      if (!res.ok) {
        throw new Error('Failed to retrieve portal details');
      }
      const data = await res.json();
      setProfile(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !profile) return;
    setSending(true);

    try {
      const res = await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: profile.id,
          type: 'NOTE',
          direction: 'INBOUND',
          content: `[Client Portal Message]: ${comment}`,
        }),
      });

      if (res.ok) {
        setComment('');
        toast.success('Your message was successfully sent to the designer at Timiclassic!');
        fetchProfile();
      } else {
        toast.error('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating: reviewRating,
          comment: reviewComment,
        }),
      });

      if (res.ok) {
        setReviewComment('');
        setReviewRating(5);
        toast.success('Thank you! Your review has been submitted.');
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !profile) return;
    setUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Upload file
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadRes.ok) {
        const data = await uploadRes.json();
        
        // 2. Link photo to client measurements profile
        const currentPhotos = profile.measurements?.photos || [];
        const updatedMeasurements = {
          ...profile.measurements,
          photos: [data.url, ...currentPhotos],
        };

        const updateRes = await fetch(`/api/clients/${profile.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: profile.firstName,
            lastName: profile.lastName,
            measurements: updatedMeasurements,
          }),
        });

        if (updateRes.ok) {
          toast.success('Photo uploaded and sent to designer!');
          fetchProfile();
        } else {
          toast.error('Failed to link photo to profile');
        }
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const getActiveStepIndex = (status: string) => {
    return TIMELINE_STEPS.indexOf(status);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs uppercase tracking-widest text-[#d4af37]">Loading Portal...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center gap-3 bg-red-950/40 border border-red-900/60 text-red-200 p-5 rounded-lg text-xs">
        <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        <span>{error || 'Unable to connect to portal profile'}</span>
      </div>
    );
  }

  const latestOrder = profile.orders[0];
  const activeStepIdx = latestOrder ? getActiveStepIndex(latestOrder.status) : -1;
  const isClientSide = typeof window !== 'undefined';

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#111] to-[#161616] border border-[#1f1b12] rounded-xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-full bg-[#d4af37]/5 blur-[60px] pointer-events-none" />
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] font-bold mb-2 block">
          Client Workspace
        </span>
        <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">
          Your Custom Clothing Portfolio
        </h1>
        <p className="text-xs text-[#8e8e88] mt-1.5 leading-relaxed uppercase tracking-wider font-semibold max-w-xl">
          Track production steps, upload custom sketches, send comments, and retrieve invoices.
        </p>
      </div>

      {/* Main Grid: Left Timeline & details, Right measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Orders and Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {latestOrder ? (
            <div className="luxury-card p-6 space-y-6">
              {/* Order Meta details */}
              <div className="flex justify-between items-center border-b border-[#1f1b12]/50 pb-4">
                <div>
                  <h3 className="font-mono text-sm text-[#d4af37] font-bold">
                    Order Number: {latestOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-[#f5f5f0] font-semibold mt-1">
                    Item: {latestOrder.garments?.[0]?.name || 'Bespoke Garment'}
                  </p>
                </div>
                {/* PDF invoice download link */}
                {isClientSide && (
                  <PDFDownloadLink
                    document={<InvoicePDF order={{ ...latestOrder, client: { firstName: profile.firstName, lastName: profile.lastName, email: profile.email, phone: profile.phone, address: null } }} />}
                    fileName={`invoice-${latestOrder.orderNumber}.pdf`}
                    className="flex items-center gap-1.5 border border-[#d4af37] text-[#d4af37] px-3.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-[#d4af37]/5 transition-all"
                  >
                    {({ loading: pdfLoading }) =>
                      pdfLoading ? <span>Compiling Invoice...</span> : <><Download className="w-3.5 h-3.5" /><span>Invoice</span></>
                    }
                  </PDFDownloadLink>
                )}
              </div>

              {/* Progress Timeline Tracker */}
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest text-[#8e8e88] font-bold">
                  Production Phase: {STATUS_LABELS[latestOrder.status] || latestOrder.status}
                </h4>

                {/* Progress bar line */}
                <div className="relative py-4 flex justify-between items-center text-center">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1f1b12] -translate-y-1/2 z-0" />
                  
                  {TIMELINE_STEPS.map((step, idx) => {
                    const isActive = idx <= activeStepIdx;
                    const isCurrent = idx === activeStepIdx;
                    return (
                      <div key={step} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border text-[9px] font-bold transition-all ${
                            isCurrent
                              ? 'bg-[#d4af37] border-[#d4af37] text-[#050505] shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                              : isActive
                              ? 'bg-[#1f1b12] border-[#d4af37]/60 text-[#d4af37]'
                              : 'bg-[#111] border-[#1f1b12] text-[#8e8e88]'
                          }`}
                        >
                          {isActive ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className="text-[8px] uppercase tracking-wider mt-2 max-w-[50px] font-semibold block leading-tight text-[#8e8e88] hidden sm:block">
                          {step.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Garment details */}
              <div className="border-t border-[#1f1b12]/50 pt-5 space-y-4">
                <h4 className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold">Garment Specifications</h4>
                {latestOrder.garments.map((g) => (
                  <div key={g.id} className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs bg-[#161616] p-4 border border-[#1f1b12] rounded-lg">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Garment Type</span>
                      <p className="font-semibold text-[#f5f5f0] mt-0.5">{g.name}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Fabric</span>
                      <p className="font-semibold text-[#f5f5f0] mt-0.5">{g.fabricType || 'Bespoke selected'}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Color Target</span>
                      <p className="font-semibold text-[#f5f5f0] mt-0.5">{g.color || 'Custom selected'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="luxury-card p-8 text-center text-xs text-[#8e8e88] italic">
              No active clothing orders configured.
            </div>
          )}

          {/* Designer Updates / Notifications */}
          <div className="luxury-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> Updates & Notifications
            </h3>
            
            {profile.communications.filter((c) => c.direction === 'OUTBOUND').length === 0 ? (
              <p className="text-xs text-[#8e8e88] italic py-2">No new updates from your designer.</p>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {profile.communications
                  .filter((c) => c.direction === 'OUTBOUND')
                  .map((msg) => {
                    const isExpanded = !!expandedLogs[msg.id];
                    return (
                      <div 
                        key={msg.id} 
                        onClick={!isExpanded ? () => toggleLogExpand(msg.id) : undefined}
                        className={`bg-[#111] border border-[#1f1b12] text-xs rounded-lg overflow-hidden transition-all duration-200 ${!isExpanded ? 'cursor-pointer hover:bg-[#1f1f1f]/50' : ''}`}
                      >
                        {/* Header */}
                        <div 
                          onClick={isExpanded ? () => toggleLogExpand(msg.id) : undefined}
                          className={`p-3 flex justify-between items-center select-none ${isExpanded ? 'cursor-pointer hover:bg-[#1f1f1f]/50' : ''}`}
                        >
                          <span className="font-semibold text-[#f5f5f0] uppercase tracking-wider text-[10px]">TimiClassic Studio</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[#8e8e88] text-[9px] font-mono">{new Date(msg.createdAt).toLocaleString()}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5 text-[#8e8e88]" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-[#8e8e88]" />
                            )}
                          </div>
                        </div>

                        {/* Content Body */}
                        {isExpanded ? (
                          <div className="px-3 pb-3 border-t border-[#1f1b12]/30 pt-2">
                            {msg.subject && (
                              <p className="text-[10px] text-[#d4af37] font-semibold mb-1">Subject: {msg.subject}</p>
                            )}
                            <p className="text-[#8e8e88] leading-relaxed whitespace-pre-wrap italic">{msg.content}</p>
                          </div>
                        ) : (
                          <div className="px-3 pb-2 text-[10px] text-[#8e8e88]/60 truncate italic">
                            {msg.subject ? `Subject: ${msg.subject} • ` : ''}{msg.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Feedback message box */}
          <div className="luxury-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#f5f5f0] border-b border-[#1f1b12]/50 pb-2">
              Send Message to Designer
            </h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4 text-xs">
              <textarea
                rows={4}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full luxury-input resize-none"
                placeholder="Request fitting slot, ask about fabrics, or send design updates..."
              />
              <button
                type="submit"
                disabled={sending}
                className="luxury-btn-primary flex items-center justify-center gap-1.5 uppercase tracking-widest px-6 py-2.5 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4 text-black" />
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Leave a Review Box */}
          <div className="luxury-card p-6 space-y-4">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 flex items-center gap-1.5">
              <Star className="w-4 h-4" /> Leave a Review
            </h3>
            <p className="text-[10px] text-[#8e8e88] uppercase tracking-widest">
              Tell us about your Timiclassic experience!
            </p>
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= reviewRating ? 'fill-[#d4af37] text-[#d4af37]' : 'text-[#8e8e88]'
                    }`}
                  />
                ))}
              </div>
              <textarea
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full luxury-input resize-none"
                placeholder="How did you love your custom piece?..."
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="luxury-btn-primary flex items-center justify-center gap-1.5 uppercase tracking-widest px-6 py-2.5 disabled:opacity-50 cursor-pointer"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Col: Measurements and Upload Sketches */}
        <div className="space-y-8">
          {/* Active Measurements */}
          <div className="luxury-card p-6 space-y-4 bg-[#111]">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] border-b border-[#1f1b12]/50 pb-2 flex items-center gap-1.5">
              <Scissors className="w-4 h-4" /> Logged Measurements
            </h3>
            
            {!profile.measurements?.sets || profile.measurements.sets.length === 0 ? (
              <p className="text-xs text-[#8e8e88] italic py-2">No measurement specs registered yet.</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Last update: {profile.measurements.sets[0].date}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">

                  <div className="bg-[#161616] p-3 border border-[#1f1b12] rounded">
                    <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Chest</span>
                    <p className="font-semibold text-sm font-mono text-[#f5f5f0] mt-0.5">{profile.measurements.sets[0].chest || 'N/A'}"</p>
                  </div>
                  <div className="bg-[#161616] p-3 border border-[#1f1b12] rounded">
                    <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Waist</span>
                    <p className="font-semibold text-sm font-mono text-[#f5f5f0] mt-0.5">{profile.measurements.sets[0].waist || 'N/A'}"</p>
                  </div>
                  <div className="bg-[#161616] p-3 border border-[#1f1b12] rounded">
                    <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Hips</span>
                    <p className="font-semibold text-sm font-mono text-[#f5f5f0] mt-0.5">{profile.measurements.sets[0].hips || 'N/A'}"</p>
                  </div>
                  <div className="bg-[#161616] p-3 border border-[#1f1b12] rounded">
                    <span className="text-[9px] uppercase tracking-widest text-[#8e8e88] font-semibold">Shoulder</span>
                    <p className="font-semibold text-sm font-mono text-[#f5f5f0] mt-0.5">{profile.measurements.sets[0].shoulder || 'N/A'}"</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reference Photo uploads */}
          <div className="luxury-card p-6 space-y-4 bg-[#111]">
            <div className="flex justify-between items-center border-b border-[#1f1b12]/50 pb-2">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#d4af37] flex items-center gap-1.5">
                <Camera className="w-4 h-4" /> Design Sketch Box
              </h3>
              <label className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-[#d4af37] hover:underline cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
              </label>
            </div>

            {uploading && (
              <p className="text-center text-xs text-[#d4af37] animate-pulse py-2">Uploading sketches...</p>
            )}

            {!profile.measurements?.photos || profile.measurements.photos.length === 0 ? (
              <p className="text-xs text-[#8e8e88] italic py-2">No design inspiration uploaded yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {profile.measurements.photos.map((url: string, idx: number) => (
                  <div key={idx} className="aspect-square border border-[#1f1b12] rounded-lg overflow-hidden bg-[#161616]">
                    <img src={url} alt="Inspiration Sketch" className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
