import React from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle, Lightbulb, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onExplore: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose, onExplore }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-2xl bg-[#0C0E18] rounded-3xl border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#0F121E]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">How EduConnect Operates</h3>
              <p className="text-[11px] font-mono-accent text-slate-400">THE 4-STEP MASTERY WORKFLOW</p>
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
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                step: '01',
                title: 'Enroll & Configure Profile',
                desc: 'Sign up as a student, parent, or certified tutor. Define academic goals or instructional specialties.',
              },
              {
                step: '02',
                title: 'Explore & Chat Live',
                desc: 'Filter by academic discipline, read authentic peer reviews, and message tutors directly to align on topics.',
              },
              {
                step: '03',
                title: 'Schedule 1-on-1 Sessions',
                desc: 'Pick your preferred future time slot with instant validation and specify session homework topics.',
              },
              {
                step: '04',
                title: 'Accelerate Mastery & Review',
                desc: 'Engage in focused lessons, track completed milestones, and submit verified feedback for the community.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/30 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-mono-accent font-bold text-sm flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 font-light mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantee Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/15 to-cyan-500/10 border border-white/[0.1] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-violet-200">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <span>Full satisfaction with flexible rescheduling</span>
            </div>
            <span className="font-mono-accent text-slate-400 text-[10px]">100% VETTED</span>
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
            <span>Explore Tutors Directory</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
