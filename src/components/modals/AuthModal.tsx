import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { X, Lock, Mail, User, GraduationCap, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  initialMode: 'login' | 'register';
  initialRole?: 'student' | 'tutor' | 'parent';
  onClose: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  initialRole = 'student',
  onClose,
  showToast,
}) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState(initialRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) {
        showToast('Login successful! Welcome back.', 'success');
        onClose();
      } else {
        showToast(res.message || 'Invalid email or password.', 'error');
      }
    } else {
      if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        setLoading(false);
        return;
      }

      const res = await register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role,
      });

      if (res.success) {
        showToast('Account created successfully! You are now logged in.', 'success');
        onClose();
      } else {
        showToast(res.message || 'Registration failed. Please check inputs.', 'error');
      }
    }

    setLoading(false);
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
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">
                {mode === 'login' ? 'Authenticate Access' : 'Create EduConnect Account'}
              </h3>
              <p className="text-[10px] font-mono-accent uppercase tracking-wider text-slate-400">
                SECURE TOKEN PORTAL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-white/[0.08] bg-white/[0.02]">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-mono-accent font-bold uppercase tracking-wider transition cursor-pointer ${
              mode === 'login'
                ? 'bg-violet-600/20 text-violet-300 border-b-2 border-violet-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-mono-accent font-bold uppercase tracking-wider transition cursor-pointer ${
              mode === 'register'
                ? 'bg-violet-600/20 text-violet-300 border-b-2 border-violet-500'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rivera"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-accent uppercase tracking-wider text-slate-300 font-bold mb-1">
                  I AM ENROLLING AS
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#161B2E] border border-white/[0.12] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 font-medium"
                >
                  <option value="student">Student (Seeking Tutors)</option>
                  <option value="parent">Parent (Booking for Children)</option>
                  <option value="tutor">Tutor (Offering Instruction)</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white/[0.04] border border-white/[0.12] rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-violet-600/30 transition disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
