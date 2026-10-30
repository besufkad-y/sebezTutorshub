import React from 'react';
import { X, CheckCircle, Lightbulb, Users, Calendar, Award } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onExplore: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose, onExplore }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">How EduConnect Works</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <ol className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div>
                <strong className="text-slate-900 text-sm block">Create Your Profile</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Sign up as a student, parent, or tutor. Customize your learning goals or instructional background.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <strong className="text-slate-900 text-sm block">Find & Connect with Tutors</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Filter by subject, examine verified reviews, and send direct messages to clarify lesson expectations.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div>
                <strong className="text-slate-900 text-sm block">Book a Session</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Select a convenient future time slot that fits your schedule and include your lesson focus or homework topics.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <strong className="text-slate-900 text-sm block">Review & Accelerate Progress</strong>
                <p className="text-xs text-slate-600 mt-0.5">
                  Leave honest feedback after completed sessions to help tutors excel and help fellow students choose wisely.
                </p>
              </div>
            </li>
          </ol>

          {/* Benefits Box */}
          <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800">
              Why Choose EduConnect?
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified tutors & educators</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flexible online/in-person slots</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Secure pay-as-you-go</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authentic student ratings</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onExplore();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition"
          >
            Find a Tutor Now
          </button>
        </div>
      </div>
    </div>
  );
};
