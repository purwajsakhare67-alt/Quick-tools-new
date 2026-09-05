import React from 'react';
import { X, Sparkles, Zap, Shield, Heart, CheckCircle } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto overscroll-contain min-h-screen tool-modal-overlay [-webkit-overflow-scrolling:touch] pt-[calc(var(--nav-height,80px)+1.5rem)] md:pt-12 pb-16 sm:pb-12"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl my-0 sm:my-8 rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-white/15 bg-white/95 dark:bg-[#080816]/95 backdrop-blur-2xl shadow-2xl p-4 sm:p-8 text-slate-900 dark:text-white tool-modal-surface mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                About QuickFree Tools ✨
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                Crafted for creators, engineers, and financial planners
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong className="text-slate-900 dark:text-white font-bold">QuickFree Tools</strong> was founded on a simple principle: high-utility digital tools should be accessible to everyone instantly, without subscriptions, paywalls, login screens, or intrusive data capture.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/5">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold mb-1">
                <Zap className="w-4 h-4" />
                <span>Zero Latency</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                All logic runs directly in your local browser thread using WebAssembly and modern JavaScript APIs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/5">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                <Shield className="w-4 h-4" />
                <span>Zero Telemetry</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your financial numbers, PDFs, passwords, and photos never touch any remote database.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-cyan-500/10 border border-purple-500/20 flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-500 shrink-0" />
            <p className="text-xs text-slate-700 dark:text-slate-200">
              100% free forever with no hidden paywalls, subscriptions, or logins required.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-colors shadow-md shadow-purple-500/20"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
