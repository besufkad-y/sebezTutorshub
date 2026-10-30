import React, { useState, useEffect } from 'react';
import { TutorDetail, TutorReview, api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatRating, formatDate } from '../../utils/validation';
import { X, Star, Calendar, MessageSquare, Award, Clock, DollarSign, CheckCircle2 } from 'lucide-react';

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
      // Error loading reviews
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
              Tutor Profile
            </span>
            <span className="text-slate-400 font-light">|</span>
            <span className="text-sm font-semibold text-slate-700">{name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar (Left) */}
          <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
            <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
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
              <h2 className="text-2xl font-bold text-slate-900">{name}</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">Verified Instructor</p>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1.5 text-amber-500">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(tutor.average_rating || 5)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-800 text-sm">
                {formatRating(tutor.average_rating)}
              </span>
              <span className="text-xs text-slate-400">({tutor.total_reviews} reviews)</span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 w-full pt-3 border-t border-slate-200/60">
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <div className="text-base font-bold text-slate-900">5+</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Years Exp</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <div className="text-base font-bold text-emerald-600">99%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pass Rate</div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                <div className="text-base font-bold text-indigo-600">50+</div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Students</div>
              </div>
            </div>

            {/* Price Badge */}
            <div className="w-full py-3 px-4 bg-emerald-50 text-emerald-800 rounded-xl font-bold text-lg flex items-center justify-center gap-1 border border-emerald-100">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>{tutor.hourly_rate ? `$${tutor.hourly_rate} / hour` : 'Contact for rate'}</span>
            </div>

            {/* Action Buttons */}
            <div className="w-full space-y-2 pt-2">
              <button
                onClick={() => onBookSession(tutor)}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Session</span>
              </button>

              <button
                onClick={() => onSendMessage(tutor)}
                className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-200 transition flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>

              {isOwnProfile && (
                <button
                  onClick={onOpenSessions}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition"
                >
                  My Sessions
                </button>
              )}
            </div>
          </div>

          {/* Main Info (Right) */}
          <div className="md:col-span-7 space-y-6">
            {/* About */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                About Me
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {tutor.bio || 'No bio provided yet.'}
              </p>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Education & Credentials
              </h3>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm text-slate-700">
                {tutor.education || 'Credentials verified by EduConnect staff.'}
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {tutor.subjects && tutor.subjects.length > 0 ? (
                  tutor.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold"
                    >
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">All subjects</span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Availability
              </h3>
              <p className="text-xs text-slate-500 mb-2">
                {tutor.availability || 'Available throughout the week by appointment.'}
              </p>
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                  const isAvail = idx !== 0 && idx !== 6; // Active weekdays representation
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-lg font-semibold border ${
                        isAvail
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                Student Reviews ({reviews.length})
              </h3>

              {loadingReviews ? (
                <div className="text-xs text-slate-400">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {reviews.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">{r.student_name}</span>
                        <span className="text-slate-400">{formatDate(r.created_at)}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= r.rating ? 'fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-slate-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review!</p>
              )}

              {/* Review Form */}
              {user && (user.role === 'student' || user.role === 'parent') && (
                <div className="pt-2">
                  {hasReviewed ? (
                    <div className="flex items-center gap-2 p-3 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-xl">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>You have already reviewed this tutor.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Leave a Review
                      </h4>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-slate-600 font-semibold">Your Rating:</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              type="button"
                              key={val}
                              onClick={() => setRatingInput(val)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  val <= ratingInput
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300'
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
                        placeholder="Write your feedback regarding the tutor's teaching..."
                        className="w-full p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <button
                        type="submit"
                        disabled={submittingReview}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
