import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  MessageSquare,
  Edit3,
  LogOut,
  Menu,
  X,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenMessages: () => void;
  onOpenSessions: () => void;
  onOpenEditProfile: () => void;
  onOpenHowItWorks: () => void;
  onOpenPricing: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenRegister,
  onOpenMessages,
  onOpenSessions,
  onOpenEditProfile,
  onOpenHowItWorks,
  onOpenPricing,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#07080D]/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Maximalist Brand Mark */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-xl"
          >
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 opacity-75 blur group-hover:opacity-100 transition duration-500" />
              <div className="relative w-11 h-11 rounded-xl bg-[#0F121E] border border-white/20 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-6 h-6 text-violet-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:via-violet-200 group-hover:to-cyan-300 transition-all">
                EDU<span className="text-violet-400">CONNECT</span>
              </span>
              <span className="text-[10px] font-mono-accent uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                EXPERT TUTORING OS
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.06] backdrop-blur-md">
            <a
              href="#"
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-white/[0.08] rounded-xl transition"
            >
              Home
            </a>
            <a
              href="#tutorsSection"
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
            >
              Tutors
            </a>
            <a
              href="#subjectsSection"
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition"
            >
              Subjects
            </a>
            <button
              onClick={onOpenHowItWorks}
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={onOpenPricing}
              className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-slate-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* User State & Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-white leading-tight">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span className="text-[11px] font-mono-accent uppercase tracking-wider text-violet-300 font-bold">
                      {user.role}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenSessions}
                  title="My Sessions"
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-violet-600/20 text-slate-200 hover:text-violet-300 border border-white/[0.08] hover:border-violet-500/40 transition cursor-pointer relative"
                >
                  <Calendar className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenMessages}
                  title="Messages"
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-violet-600/20 text-slate-200 hover:text-violet-300 border border-white/[0.08] hover:border-violet-500/40 transition cursor-pointer relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
                </motion.button>

                {user.role === 'tutor' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onOpenEditProfile}
                    title="Edit Tutor Profile"
                    className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-violet-600/20 text-slate-200 hover:text-violet-300 border border-white/[0.08] hover:border-violet-500/40 transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/[0.08] hover:border-rose-500/40 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenLogin}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl transition"
                >
                  Sign In
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onOpenRegister}
                  className="relative group px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white rounded-xl overflow-hidden shadow-lg shadow-violet-600/25 transition cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 transition-all duration-300 group-hover:opacity-90" />
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>Join Free</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden border-b border-white/[0.1] bg-[#0D0F1A] px-6 py-6 space-y-4"
          >
            <div className="space-y-1">
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-semibold text-slate-200 hover:text-violet-400"
              >
                Home
              </a>
              <a
                href="#tutorsSection"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-semibold text-slate-200 hover:text-violet-400"
              >
                Find Tutors
              </a>
              <a
                href="#subjectsSection"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2.5 text-sm font-semibold text-slate-200 hover:text-violet-400"
              >
                Subjects
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenHowItWorks();
                }}
                className="block w-full text-left py-2.5 text-sm font-semibold text-slate-200 hover:text-violet-400"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPricing();
                }}
                className="block w-full text-left py-2.5 text-sm font-semibold text-slate-200 hover:text-violet-400"
              >
                Pricing Plans
              </button>
            </div>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              {isAuthenticated && user ? (
                <>
                  <div className="py-2 text-sm font-bold text-white flex items-center justify-between">
                    <span>{user.first_name} {user.last_name}</span>
                    <span className="text-xs uppercase font-mono-accent text-violet-400">{user.role}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSessions();
                    }}
                    className="w-full flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-white/[0.05] text-slate-200 text-sm font-semibold"
                  >
                    <Calendar className="w-4 h-4 text-violet-400" /> My Sessions
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenMessages();
                    }}
                    className="w-full flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-white/[0.05] text-slate-200 text-sm font-semibold"
                  >
                    <MessageSquare className="w-4 h-4 text-cyan-400" /> Messages
                  </button>
                  {user.role === 'tutor' && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenEditProfile();
                      }}
                      className="w-full flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-white/[0.05] text-slate-200 text-sm font-semibold"
                    >
                      <Edit3 className="w-4 h-4 text-amber-400" /> Edit Tutor Profile
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-rose-500/10 text-rose-300 text-sm font-semibold"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-slate-200 border border-white/[0.1] rounded-xl bg-white/[0.04]"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRegister();
                    }}
                    className="flex-1 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-xl shadow-md"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
