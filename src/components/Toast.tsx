import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          let borderAccent = 'border-violet-500/40 text-violet-300';
          let bgGlow = 'rgba(139, 92, 246, 0.15)';
          let Icon = Info;

          if (toast.type === 'success') {
            borderAccent = 'border-emerald-500/40 text-emerald-300';
            bgGlow = 'rgba(16, 185, 129, 0.15)';
            Icon = CheckCircle2;
          } else if (toast.type === 'error') {
            borderAccent = 'border-rose-500/40 text-rose-300';
            bgGlow = 'rgba(244, 63, 94, 0.15)';
            Icon = XCircle;
          } else if (toast.type === 'warning') {
            borderAccent = 'border-amber-500/40 text-amber-300';
            bgGlow = 'rgba(245, 158, 11, 0.15)';
            Icon = AlertTriangle;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              style={{
                boxShadow: `0 15px 35px rgba(0,0,0,0.6), 0 0 25px ${bgGlow}`,
              }}
              className={`pointer-events-auto flex items-center gap-3.5 p-4 rounded-2xl bg-[#0F121E]/95 backdrop-blur-xl border ${borderAccent}`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-xs font-semibold text-slate-100 flex-1 leading-snug">
                {toast.message}
              </span>
              <button
                onClick={() => onDismiss(toast.id)}
                className="p-1 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
