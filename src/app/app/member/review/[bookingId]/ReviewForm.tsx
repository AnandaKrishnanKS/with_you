'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Loader2, CheckCircle2 } from 'lucide-react';

export default function ReviewForm({
  bookingId,
  existingReview,
}: {
  bookingId: string;
  existingReview: any;
}) {
  const router = useRouter();

  const [rating, setRating] = useState(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || '');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review.');
      }

      setSubmitted(true);
      setTimeout(() => {
        router.push('/app/member/bookings');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && existingReview) {
    return (
      <div className="bg-emerald-50 text-emerald-900 p-6 rounded-xl border border-emerald-200 text-center space-y-2">
        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
        <h3 className="font-bold text-base">Review Submitted</h3>
        <p className="text-xs text-emerald-700">Thank you for sharing your feedback with the community!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
          {error}
        </div>
      )}

      {/* Star Selection */}
      <div className="text-center space-y-2">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Rating</label>
        <div className="flex justify-center items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverRating || rating) >= star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    isFilled ? 'text-amber-500 fill-amber-500' : 'text-slate-300'
                  }`}
                />
              </button>
            );
          })}
        </div>
        <div className="text-xs font-medium text-slate-600">
          {rating === 5 && 'Outstanding Experience'}
          {rating === 4 && 'Great Companion'}
          {rating === 3 && 'Average Session'}
          {rating === 2 && 'Below Expectations'}
          {rating === 1 && 'Unsatisfactory'}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700">Your Review & Comments</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts about your companion's conversation, punctuality, and warmth..."
          rows={4}
          required
          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
          </>
        ) : (
          'Submit Review'
        )}
      </button>
    </form>
  );
}
