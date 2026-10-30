import React from 'react';
import { X, DollarSign, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

interface PricingModalProps {
  onClose: () => void;
  onExplore: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose, onExplore }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-base">How Pricing Works</h3>
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
          <p className="text-sm text-slate-600 leading-relaxed">
            Tutors set their own hourly rates based on their experience, subject specialization, and academic credentials. You pay only for the sessions you book—with zero subscriptions or hidden platform fees.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Transparent Pricing</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  See exact hourly rates upfront on every tutor profile before initiating contact or booking.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600 mt-0.5">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Pay As You Go</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Book only the sessions you need. No monthly commitments or recurring credit expiration.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-600 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Secure & Protected</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Full satisfaction guarantee with easy rescheduling and cancellation policies.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onExplore();
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition text-sm"
          >
            Explore Tutors & Rates
          </button>
        </div>
      </div>
    </div>
  );
};
