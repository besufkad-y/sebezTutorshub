import React, { useState } from 'react';
import { motion } from 'motion/react';
import { TutorDetail, api } from '../../services/api';
import { validateSessionDate } from '../../utils/validation';
import { X, Calendar, Clock, DollarSign, Sparkles } from 'lucide-react';

interface BookSessionModalProps {
  tutor: TutorDetail | null;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({
  tutor,
  onClose,
  onSuccess,
  showToast,
}) => {
  const [sessionDate, setSessionDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!tutor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate) {
      showToast('Please select a session date and time.', 'warning');
      return;
    }

    if (!validateSessionDate(sessionDate)) {
      showToast('Session date/time cannot be in the past.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createSession({
        tutor_id: tutor.user_id,
        session_date: new Date(sessionDate).toISOString(),
        notes: notes.trim(),
      });

      if (res.success) {
        showToast('Session booked successfully!', 'success');
        onSuccess();
        onClose();
      } else {
        showToast(res.message || 'Failed to book session.', 'error');
      }
    } catch {
      showToast('Error booking session. Please try again.', 'error');
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
        className="relative w-full max-w-lg bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Schedule Tutoring Session</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">1-ON-1 PRIVATE LESSON</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tutor Info Pill */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={tutor.profile_picture_url || '/images/users/1.jpg'}
                alt={tutor.first_name}
                className="w-11 h-11 rounded-xl object-cover border border-violet-500/30"
              />
              <div>
                <div className="text-sm font-bold text-white">
                  {tutor.first_name} {tutor.last_name}
                </div>
                <div className="text-xs text-slate-400">
                  {tutor.education || 'Verified Educator'}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono-accent font-bold text-emerald-400">
                {tutor.hourly_rate ? `$${tutor.hourly_rate}/hr` : 'Standard'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono-accent uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-400" />
              <span>Target Date & Time</span>
            </label>
            <input
              type="datetime-local"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.12] rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition"
            />
            <p className="text-[11px] text-slate-500">
              Select a future time that suits your study schedule.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono-accent uppercase tracking-wider text-slate-300 font-bold">
              Lesson Topics / Focus (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Preparing for AP Calculus BC midterm, reviewing integration by parts..."
              className="w-full px-4 py-3 text-sm bg-white/[0.04] border border-white/[0.12] rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 px-4 rounded-2xl border border-white/[0.1] text-slate-300 font-bold text-xs uppercase tracking-wider hover:bg-white/[0.05] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
