import React from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Globe,
  Star,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sparkles,
} from 'lucide-react';

interface HeroProps {
  onOpenRegisterTutor: () => void;
}

const TICKER_ITEMS = [
  'VERIFIED ELITE EDUCATORS',
  '1-ON-1 SESSIONS ON DEMAND',
  'ZERO PLATFORM SUBSCRIPTION FEES',
  'DIRECT REAL-TIME MESSAGING',
  '98% STUDENT GRADE IMPROVEMENT',
  '13+ CORE ACADEMIC DOMAINS',
  'AUTHENTIC STUDENT REVIEWS',
  'CUSTOM LEARNING ROADMAPS',
];

export const Hero: React.FC<HeroProps> = ({ onOpenRegisterTutor }) => {
  return (
    <section className="relative py-20 lg:py-28 bg-[#07080D] overflow-hidden border-b border-white/[0.08]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-violet-600/20 via-fuchsia-600/15 to-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -bottom-24 right-0 w-[450px] h-[450px] bg-gradient-to-br from-cyan-600/15 to-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Maximalist Infinite Running Ticker Banner */}
      <div className="w-full overflow-hidden border-y border-white/[0.06] bg-white/[0.02] py-3.5 mb-16 backdrop-blur-md">
        <div className="animate-marquee flex items-center space-x-8 text-xs font-mono-accent uppercase tracking-widest text-slate-300">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center space-x-8 shrink-0">
              <span className="font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
                {item}
              </span>
              <span className="text-white/20">/</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/[0.05] border border-white/[0.1] backdrop-blur-xl">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono-accent font-bold uppercase tracking-wider text-amber-300">
                  NEXT-GEN ACADEMIC ACCELERATOR
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05]">
                Master Any Subject With{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">
                  World-Class Mentors.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
                Connect with verified PhDs, certified school teachers, and industry specialists. 
                Experience tailored curriculum, flexible scheduling, and direct chat designed around your goals.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href="#tutorsSection"
                className="relative group px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-white overflow-hidden shadow-xl shadow-violet-600/30 transition"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600" />
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                  <span>Browse All Tutors</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenRegisterTutor}
                className="px-7 py-4 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] transition backdrop-blur-md cursor-pointer flex items-center gap-2"
              >
                <span>Apply as a Tutor</span>
                <Sparkles className="w-4 h-4 text-violet-400" />
              </motion.button>
            </div>

            {/* Maximalist Value Props Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-violet-500/40 transition">
                <div className="flex items-center gap-2 text-violet-400 mb-1.5">
                  <Users className="w-4 h-4" />
                  <span className="text-[11px] font-mono-accent uppercase tracking-wider text-slate-400 font-bold">Network</span>
                </div>
                <div className="text-xl font-bold text-white">1,000+</div>
                <div className="text-xs text-slate-400 mt-0.5">Top vetted experts</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-cyan-500/40 transition">
                <div className="flex items-center gap-2 text-cyan-400 mb-1.5">
                  <Globe className="w-4 h-4" />
                  <span className="text-[11px] font-mono-accent uppercase tracking-wider text-slate-400 font-bold">Formats</span>
                </div>
                <div className="text-xl font-bold text-white">Online & Live</div>
                <div className="text-xs text-slate-400 mt-0.5">Flexible timezone sync</div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md hover:border-amber-500/40 transition">
                <div className="flex items-center gap-2 text-amber-400 mb-1.5">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-[11px] font-mono-accent uppercase tracking-wider text-slate-400 font-bold">Quality</span>
                </div>
                <div className="text-xl font-bold text-white">4.92 / 5.0</div>
                <div className="text-xs text-slate-400 mt-0.5">Over 2,400+ reviews</div>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Layered glowing frame */}
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 opacity-40 blur-xl -rotate-2" />
              
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.15] bg-[#0E111C] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Tutoring Session in Action"
                  className="w-full h-80 object-cover object-center filter contrast-110"
                />

                {/* Floating stat overlay */}
                <div className="p-6 bg-gradient-to-t from-[#0E111C] via-[#0E111C]/95 to-transparent space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-300 flex items-center justify-center font-bold">
                        98%
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Verified Pass Rate</div>
                        <div className="text-xs text-slate-400">Based on past 12 months</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono-accent font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>GUARANTEED</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-violet-400" />
                      <span>All credentials pre-audited</span>
                    </span>
                    <span className="font-mono-accent text-slate-300">ZERO HIDDEN FEES</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
