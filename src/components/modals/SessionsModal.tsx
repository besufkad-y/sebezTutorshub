import React, { useState, useEffect } from 'react';
import { TutoringSession, api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/validation';
import { X, Calendar, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

interface SessionsModalProps {
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const SessionsModal: React.FC<SessionsModalProps> = ({ onClose, showToast }) => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<TutoringSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setLoading(true);
    try {
      const res = await api.getSessions();
      if (res.success) {
        setSessions(res.sessions);
      }
    } catch {
      showToast('Error loading sessions.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (sessionId: number, status: 'completed' | 'cancelled') => {
    try {
      const res = await api.updateSessionStatus(sessionId, status);
      if (res.success) {
        showToast(`Session marked as ${status}.`, 'success');
        loadSessions();
      } else {
        showToast(res.message || 'Failed to update session.', 'error');
      }
    } catch {
      showToast('Error updating session status.', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3 h-3" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">My Scheduled Sessions</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              Loading your sessions...
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((sess) => {
                const isTutor = user && sess.tutor_id === user.user_id;
                const canManage = isTutor && sess.status === 'scheduled';

                return (
                  <div
                    key={sess.id || sess.session_id}
                    className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-slate-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {formatDate(sess.session_date)}
                        </span>
                        {getStatusBadge(sess.status)}
                      </div>

                      <div className="text-xs text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          <b>Tutor:</b> {sess.tutor_name || 'Tutor #' + sess.tutor_id}
                        </span>
                        <span>
                          <b>Student:</b> {sess.student_name || 'Student #' + sess.student_id}
                        </span>
                      </div>

                      {sess.notes && (
                        <p className="text-xs text-slate-500 italic mt-1 bg-white p-2 rounded-lg border border-slate-100">
                          "{sess.notes}"
                        </p>
                      )}
                    </div>

                    {/* Tutor status actions */}
                    {canManage && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateStatus(sess.id || sess.session_id, 'completed')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sess.id || sess.session_id, 'cancelled')}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold border border-rose-200 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-700 text-base">No sessions booked</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                You have not booked any tutoring sessions yet. Browse our top-rated tutors to get started!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
