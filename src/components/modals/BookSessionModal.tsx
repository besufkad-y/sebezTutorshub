import React, { useState } from 'react';
import { TutorDetail, api } from '../../services/api';
import { validateSessionDate } from '../../utils/validation';
import { X, Calendar, Clock } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">Book a Tutoring Session</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-indigo-50/70 rounded-xl flex items-center gap-3">
            <img
              src={tutor.profile_picture_url || '/images/users/1.jpg'}
              alt={tutor.first_name}
              className="w-12 h-12 rounded-full object-cover border border-white"
            />
            <div>
              <div className="text-sm font-bold text-slate-900">
                {tutor.first_name} {tutor.last_name}
              </div>
              <div className="text-xs text-indigo-600 font-medium">
                {tutor.hourly_rate ? `$${tutor.hourly_rate} / hour` : 'Standard Session'}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              Session Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <p className="text-[11px] text-slate-400">
              Please choose a future date and time that fits your availability.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Notes or Topics (Optional)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. AP Calculus test preparation, homework review on chapters 4-5..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 transition disabled:opacity-50"
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
