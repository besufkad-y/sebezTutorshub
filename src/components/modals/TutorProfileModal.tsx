import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorDetail, TutorReview, api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatRating, formatDate } from '../../utils/validation';
import {
  X,
  Star,
  Calendar,
  MessageSquare,
  Award,
  Clock,
  DollarSign,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface TutorProfileModalProps {
  tutor: TutorDetail | null;
  onClose: () => void;
  onBookSession: (tutor: TutorDetail) => void;
  onSendMessage: (tutor: TutorDetail) => void;
  onOpenSessions: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const TutorProfileModal: React.FC<TutorProfileModalProps> = ({
  tutor,
  onClose,
  onBookSession,
  onSendMessage,
  onOpenSessions,
  showToast,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<TutorReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (tutor) {
      loadReviews();
    }
  }, [tutor]);

  const loadReviews = async () => {
    if (!tutor) return;
    setLoadingReviews(true);
    try {
      const data = await api.getTutorReviews(tutor.user_id);
      if (data.success) {
        setReviews(data.reviews);
      }
    } catch {
      // Handled silently
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please login to leave a review.', 'warning');
      return;
    }
    if (!tutor) return;

    setSubmittingReview(true);
    try {
      const res = await api.submitTutorReview({
        tutor_id: tutor.user_id,
        rating: ratingInput,
        comment: commentInput.trim(),
      });
      if (res.success) {
        showToast('Review submitted successfully!', 'success');
        setCommentInput('');
        loadReviews();
      } else {
        showToast(res.message || 'Failed to submit review.', 'error');
      }
    } catch {
      showToast('Error submitting review.', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!tutor) return null;

  const name = `${tutor.first_name} ${tutor.last_name}`;
  const avatar = tutor.profile_picture_url || '/images/users/1.jpg';
  const hasReviewed = user && reviews.some((r) => r.student_id === user.user_id);
  const isOwnProfile = user && user.user_id === tutor.user_id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-4xl bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-accent font-bold uppercase tracking-wider text-violet-300 bg-violet-600/20 border border-violet-500/30 px-3 py-1 rounded-xl">
              TUTOR DOSSIER
            </span>
            <span className="text-white/20">|</span>
            <span className="text-xs font-mono-accent uppercase tracking-wider text-slate-300">
              {name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar (Left) */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-white/[0.02] rounded-3xl border border-white/[0.08] space-y-4">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-violet-500/40 shadow-xl bg-[#161B2E]">
              <img
                src={avatar}
                alt={name}
                onError={(e: any) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{name}</h2>
              <p className="text-xs font-mono-accent uppercase tracking-wider text-violet-400 mt-0.5">
                VERIFIED INSTRUCTOR
              </p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-2xl">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= Math.round(tutor.average_rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/20'
                    }`}
                  />
                ))}
              </div>
              <span className="font-mono-accent font-bold text-xs text-amber-300">
                {formatRating(tutor.average_rating)}
              </span>
              <span className="text-[10px] text-amber-200/60 font-mono-accent">
                ({tutor.total_reviews} reviews)
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 w-full pt-2">
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06]">
                <div className="text-sm font-black text-white">5+</div>
                <div className="text-[9px] font-mono-accent uppercase font-bold text-slate-400">Yrs Exp</div>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06]">
                <div className="text-sm font-black text-emerald-400">99%</div>
                <div className="text-[9px] font-mono-accent uppercase font-bold text-slate-400">Pass Rate</div>
              </div>
              <div className="bg-white/[0.03] p-3 rounded-2xl border border-white/[0.06]">
                <div className="text-sm font-black text-cyan-400">50+</div>
                <div className="text-[9px] font-mono-accent uppercase font-bold text-slate-400">Alumni</div>
              </div>
            </div>

            {/* Price Badge */}
            <div className="w-full py-3.5 px-4 bg-emerald-500/10 text-emerald-300 rounded-2xl font-mono-accent font-bold text-base flex items-center justify-center gap-1 border border-emerald-500/30">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>{tutor.hourly_rate ? `$${tutor.hourly_rate} / Hour` : 'Contact For Rate'}</span>
            </div>

            {/* Actions */}
            <div className="w-full space-y-2.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onBookSession(tutor)}
                className="w-full py-3.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-violet-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book 1-on-1 Session</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSendMessage(tutor)}
                className="w-full py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold text-xs uppercase tracking-wider rounded-2xl border border-white/[0.1] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Send Direct Message</span>
              </motion.button>

              {isOwnProfile && (
                <button
                  onClick={onOpenSessions}
                  className="w-full py-2.5 px-4 bg-white/[0.04] text-slate-300 hover:text-white text-xs font-semibold rounded-2xl border border-white/[0.08] transition"
                >
                  Manage My Sessions
                </button>
              )}
            </div>
          </div>

          {/* Main Info (Right) */}
          <div className="md:col-span-7 space-y-6">
            {/* Bio */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>About & Philosophy</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                {tutor.bio || 'Experienced educator focused on personalized instruction, exam strategy, and student confidence.'}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-violet-400" />
                <span>Education & Credentials</span>
              </h3>
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-200 font-light">
                {tutor.education || 'Credentials audited and verified by EduConnect academic advisors.'}
              </div>
            </div>

            {/* Subjects (Zero-pill text separation) */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">Disciplines Taught</h3>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {tutor.subjects && tutor.subjects.length > 0 ? (
                  tutor.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-300 font-medium"
                    >
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">All Core Subjects</span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-400" />
                <span>Availability Schedule</span>
              </h3>
              <p className="text-xs text-slate-400 mb-2">
                {tutor.availability || 'Available weekly for scheduled sessions.'}
              </p>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-mono-accent">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const isAvail = idx !== 0 && idx !== 6;
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-xl text-[11px] font-bold border ${
                        isAvail
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          : 'bg-white/[0.02] border-white/[0.06] text-slate-500'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <h3 className="text-base font-bold text-white flex items-center justify-between">
                <span>Verified Reviews ({reviews.length})</span>
              </h3>

              {loadingReviews ? (
                <div className="text-xs text-slate-500">Loading student reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{r.student_name}</span>
                        <span className="text-[10px] font-mono-accent text-slate-500">{formatDate(r.created_at)}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-300 font-light">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No reviews recorded yet.</p>
              )}

              {/* Review Submission Form */}
              {user && (user.role === 'student' || user.role === 'parent') && (
                <div className="pt-2">
                  {hasReviewed ? (
                    <div className="flex items-center gap-2 p-3 bg-violet-600/15 border border-violet-500/30 text-violet-300 text-xs font-semibold rounded-2xl">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>You have already submitted a review for this tutor.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                      <h4 className="text-xs font-mono-accent uppercase tracking-wider text-slate-300 font-bold">
                        Leave Student Review
                      </h4>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-400">Rating:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setRatingInput(val)}
                              className="focus:outline-none cursor-pointer"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  val <= ratingInput
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-white/20'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        required
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Share your experience regarding lesson clarity, patience, and progress..."
                        className="w-full p-2.5 text-xs bg-white/[0.03] border border-white/[0.1] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        {submittingReview ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
