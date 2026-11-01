import React from 'react';
import { motion } from 'motion/react';
import { X, DollarSign, ShieldCheck, Zap, ArrowRight, Check } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
  onExplore: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onExplore }) => {
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
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Transparent Pricing Model</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">PAY-AS-YOU-GO • NO LOCK-IN</p>
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
        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
            EduConnect believes in direct, transparent educational access. Tutors independently define their hourly rates according to subject specialization and academic credentials.
          </p>

          <div className="space-y-3">
            {[
              {
                icon: Zap,
                color: 'text-amber-400',
                title: 'Clear Hourly Rates Upfront',
                desc: 'See the exact hourly fee on every tutor profile before booking a single minute.',
              },
              {
                icon: DollarSign,
                color: 'text-emerald-400',
                title: 'No Recurring Platform Fees',
                desc: 'Pay exclusively for the 1-on-1 tutoring sessions you schedule. No subscription trap.',
              },
              {
                icon: ShieldCheck,
                color: 'text-cyan-400',
                title: '100% Satisfaction Guarantee',
                desc: 'Reschedule or cancel according to simple policies without arbitrary penalty fees.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
              >
                <div className={`p-2 rounded-xl bg-white/[0.05] ${item.color} mt-0.5`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-400 font-light mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onClose();
              onExplore();
            }}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-violet-600/30 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Browse Tutors & Rates</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
