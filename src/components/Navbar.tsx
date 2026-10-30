import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, MessageSquare, Edit3, LogOut, Menu, X, Calendar } from 'lucide-react';

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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 text-2xl font-extrabold text-indigo-600 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span>EduConnect</span>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-[15px] font-medium text-slate-600">
            <a href="#" className="text-indigo-600 hover:text-indigo-700 transition">Home</a>
            <a href="#tutorsSection" className="hover:text-indigo-600 transition">Tutors</a>
            <a href="#subjectsSection" className="hover:text-indigo-600 transition">Subjects</a>
            <button
              onClick={onOpenHowItWorks}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              How it Works
            </button>
            <button
              onClick={onOpenPricing}
              className="hover:text-indigo-600 transition cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          {/* Auth / User Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-800 leading-tight">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {user.role}
                  </div>
                </div>

                <button
                  onClick={onOpenSessions}
                  title="My Sessions"
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
                >
                  <Calendar className="w-5 h-5" />
                </button>

                <button
                  onClick={onOpenMessages}
                  title="Messages"
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition relative"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>

                {user.role === 'tutor' && (
                  <button
                    onClick={onOpenEditProfile}
                    title="Edit Tutor Profile"
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-lg hover:border-indigo-300 transition"
                >
                  Login
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-300 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Hamburger Menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-4 pb-6 space-y-3">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Home
          </a>
          <a
            href="#tutorsSection"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Tutors
          </a>
          <a
            href="#subjectsSection"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Subjects
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenHowItWorks();
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            How it Works
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenPricing();
            }}
            className="block w-full text-left py-2 text-base font-medium text-slate-700 hover:text-indigo-600"
          >
            Pricing
          </button>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated && user ? (
              <>
                <div className="py-2 text-sm font-bold text-slate-800">
                  Signed in as {user.first_name} {user.last_name} ({user.role})
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSessions();
                  }}
                  className="flex items-center gap-2 w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700"
                >
                  <Calendar className="w-4 h-4" /> My Sessions
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMessages();
                  }}
                  className="flex items-center gap-2 w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700"
                >
                  <MessageSquare className="w-4 h-4" /> Messages
                </button>
                {user.role === 'tutor' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenEditProfile();
                    }}
                    className="flex items-center gap-2 w-full py-2.5 px-4 text-sm font-semibold rounded-lg bg-slate-100 text-slate-700"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="flex items-center gap-2 w-full py-2.5 px-4 text-sm font-semibold rounded-lg text-rose-600 bg-rose-50"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-200 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenRegister();
                  }}
                  className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
