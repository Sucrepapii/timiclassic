'use client';

import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

export default function ReviewsManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleApproval = async (id: string, isApproved: boolean) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved }),
      });
      if (res.ok) {
        toast.success(isApproved ? 'Review approved and published!' : 'Review hidden from website.');
        fetchReviews();
      } else {
        toast.error('Failed to update review status.');
      }
    } catch (err) {
      toast.error('Error updating review.');
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Review deleted.');
        fetchReviews();
      } else {
        toast.error('Failed to delete review.');
      }
    } catch (err) {
      toast.error('Error deleting review.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-serif text-[#f5f5f0] tracking-wide">
          Client Reviews
        </h1>
        <p className="text-xs text-[#8e8e88] mt-1 uppercase tracking-widest">
          Manage testimonials and choose which ones appear on the public website.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-[#111] border border-[#1f1b12] rounded-xl p-10 text-center">
          <p className="text-sm text-[#8e8e88]">No reviews submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-[#111] border border-[#1f1b12] rounded-xl p-6 flex flex-col sm:flex-row gap-6 justify-between">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2">
                  <div className="flex text-[#d4af37]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-[#8e8e88] font-semibold tracking-widest uppercase ml-2">
                    {review.client.firstName} {review.client.lastName}
                  </span>
                  <span className="text-[10px] text-[#555] ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-[#f5f5f0] italic bg-[#161616] p-4 rounded-lg border border-[#1f1b12]/50">
                  "{review.comment}"
                </p>
              </div>

              <div className="flex flex-row sm:flex-col gap-2 shrink-0 justify-center">
                {review.isApproved ? (
                  <button
                    onClick={() => toggleApproval(review.id, false)}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase border border-[#d4af37]/30 text-[#d4af37] bg-[#d4af37]/10 px-4 py-2.5 rounded hover:bg-[#d4af37]/20 transition-all"
                  >
                    <XCircle className="w-4 h-4" /> Hide from site
                  </button>
                ) : (
                  <button
                    onClick={() => toggleApproval(review.id, true)}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase bg-[#d4af37] text-black px-4 py-2.5 rounded hover:opacity-90 transition-all shadow-[0_0_10px_rgba(212,175,55,0.2)]"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve & Publish
                  </button>
                )}
                
                <button
                  onClick={() => deleteReview(review.id)}
                  className="flex items-center justify-center gap-1.5 text-xs font-semibold uppercase border border-red-900/30 text-red-400 hover:bg-red-950/40 px-4 py-2.5 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
