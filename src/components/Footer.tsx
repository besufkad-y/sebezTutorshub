import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, MapPin, Phone, Mail, Star, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onOpenHowItWorks: () => void;
  onOpenPricing: () => void;
  onOpenContact: () => void;
  onOpenWebsiteReview: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenHowItWorks,
  onOpenPricing,
  onOpenContact,
  onOpenWebsiteReview,
}) => {
  return (
    <footer className="relative bg-[#05060A] text-slate-400 pt-20 pb-12 border-t border-white/[0.08] overflow-hidden">
      {/* Top subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/[0.06]">
          {/* Brand & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0F121E] border border-white/20 text-white flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                EDU<span className="text-violet-400">CONNECT</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Empowering students and parents with vetted, high-caliber tutors for personalized 1-on-1 academic mastery and career acceleration.
            </p>

            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenWebsiteReview}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-mono-accent font-bold uppercase tracking-wider transition cursor-pointer"
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Rate Platform Experience</span>
              </motion.button>
            </div>
          </div>

          {/* Quick Links (Col 5-7) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-white font-bold">
              PLATFORM NAVIGATION
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#" className="hover:text-white transition">Home</a>
              </li>
              <li>
                <a href="#tutorsSection" className="hover:text-white transition">Find Tutors Directory</a>
              </li>
              <li>
                <a href="#subjectsSection" className="hover:text-white transition">Explore Subjects</a>
              </li>
              <li>
                <button
                  onClick={onOpenHowItWorks}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPricing}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Pricing Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition cursor-pointer text-left"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Core Subjects (Col 8-9) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-white font-bold">
              DOMAINS
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>Mathematics</li>
              <li>Physics</li>
              <li>Computer Science</li>
              <li>Languages</li>
              <li>Test Preparation</li>
              <li>Economics</li>
            </ul>
          </div>

          {/* Direct Support (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-mono-accent uppercase tracking-widest text-white font-bold">
              SUPPORT & INQUIRIES
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <span>San Francisco, CA & Global Remote</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-violet-400 shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-violet-400 shrink-0" />
                <span>support@educonnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="font-mono-accent">
            &copy; {new Date().getFullYear()} EDUCONNECT • ARCHITECTED WITH DRF & REACT 19
          </div>
          <div className="flex items-center gap-2 text-slate-400 font-mono-accent text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
