import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X, Star, ThumbsUp, Send } from 'lucide-react';

interface WebsiteReviewModalProps {
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const WebsiteReviewModal: React.FC<WebsiteReviewModalProps> = ({ onClose, showToast }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please login to leave platform feedback.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitWebsiteReview({
        rating,
        review_text: reviewText.trim(),
      });
      if (res.success) {
        showToast('Thank you for rating EduConnect!', 'success');
        onClose();
      } else {
        showToast(res.message || 'Failed to submit review.', 'error');
      }
    } catch {
      showToast('Error submitting review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Platform Feedback</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">RATE THE OS EXPERIENCE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-400">
              How would you evaluate your overall experience with the EduConnect platform?
            </p>
            <div className="flex justify-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition transform hover:scale-125 cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                        : 'text-white/20'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono-accent uppercase tracking-wider text-slate-300 font-bold">
              Your Commentary
            </label>
            <textarea
              rows={3}
              required
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="What features impressed you most? What can we elevate further?"
              className="w-full p-3.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl border border-white/[0.1] text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-white/[0.05] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
