import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono-accent font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono-accent font-bold uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5 text-rose-400" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-mono-accent font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Scheduled
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-3xl bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Scheduled Sessions</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">APPOINTMENTS & HISTORY</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs font-mono-accent">
              RETRIEVING APPOINTMENT LEDGER...
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((sess) => {
                const isTutor = user && sess.tutor_id === user.user_id;
                const canManage = isTutor && sess.status === 'scheduled';

                return (
                  <div
                    key={sess.id || sess.session_id}
                    className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-violet-500/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white font-mono-accent">
                          {formatDate(sess.session_date)}
                        </span>
                        {getStatusBadge(sess.status)}
                      </div>

                      <div className="text-xs text-slate-300 flex flex-wrap gap-x-5 gap-y-1">
                        <span>
                          <strong className="text-slate-400 font-normal">Tutor:</strong>{' '}
                          <span className="font-semibold text-white">{sess.tutor_name || 'Tutor #' + sess.tutor_id}</span>
                        </span>
                        <span>
                          <strong className="text-slate-400 font-normal">Student:</strong>{' '}
                          <span className="font-semibold text-white">{sess.student_name || 'Student #' + sess.student_id}</span>
                        </span>
                      </div>

                      {sess.notes && (
                        <p className="text-xs text-slate-400 italic bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.05]">
                          "{sess.notes}"
                        </p>
                      )}
                    </div>

                    {/* Tutor status actions */}
                    {canManage && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateStatus(sess.id || sess.session_id, 'completed')}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition cursor-pointer"
                        >
                          Mark Done
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(sess.id || sess.session_id, 'cancelled')}
                          className="px-3.5 py-2 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
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
            <div className="text-center py-16 space-y-2">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="font-bold text-white text-base">No Sessions Booked Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Explore our top-rated tutors or filter by subject to schedule your next 1-on-1 session.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
