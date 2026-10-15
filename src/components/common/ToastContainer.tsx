import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Trophy, CheckCircle2, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isXP = toast.type === 'xp';
        const isSuccess = toast.type === 'success';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl backdrop-blur-xl border transition-all duration-300 animate-in slide-in-from-right flex items-start gap-3 ${
              isXP
                ? 'bg-[#1E1A45]/95 border-[#6C4DFF]/40 text-white shadow-[#6C4DFF]/20'
                : isSuccess
                ? 'bg-[#142E25]/95 border-[#12B886]/40 text-white shadow-[#12B886]/20'
                : 'bg-[#1E1A45]/95 border-white/20 text-white'
            }`}
          >
            <div className="p-2 rounded-xl bg-white/10 shrink-0 mt-0.5">
              {isXP && <Sparkles className="w-4 h-4 text-[#FFB703]" />}
              {isSuccess && <Trophy className="w-4 h-4 text-[#12B886]" />}
              {!isXP && !isSuccess && <CheckCircle2 className="w-4 h-4 text-[#2F9BFF]" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold tracking-tight">{toast.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 line-clamp-2">
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg shrink-0 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
