import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../../services/api';
import { X, Mail, Send } from 'lucide-react';

interface ContactModalProps {
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose, showToast }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      if (res.success) {
        showToast('Message sent successfully! Our academic team will respond promptly.', 'success');
        onClose();
      } else {
        showToast(res.message || 'Failed to send message.', 'error');
      }
    } catch {
      showToast('Error sending message. Please try again.', 'error');
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
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Direct Support Transmission</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">ACADEMIC & BILLING ASSISTANCE</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Tutor matching inquiry, billing inquiry..."
              className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can our educational coordinators support your journey?"
              className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
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
              className="flex-1 py-3 px-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-violet-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Transmitting...' : 'Send Message'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
