import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, ServerOff, CheckCircle2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl my-8 rounded-3xl border border-slate-300 dark:border-white/15 bg-white/85 dark:bg-[#080816]/90 backdrop-blur-2xl shadow-2xl p-6 sm:p-8 text-slate-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 pb-5 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-teal-500 p-0.5 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                Privacy Policy & Guarantee
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                Last updated: 2026 • 100% Client-Side Architecture
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
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 flex items-start gap-3">
            <Lock className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <strong>Core Privacy Pledge:</strong> QuickFree Tools does not require user registration, email addresses, or personal credentials. All computations happen in your browser session.
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">Key Principles:</h4>
            
            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Zero Server Storage:</strong> Your SIP inputs, loan details, files, and generated passwords are never transmitted or logged on any external server.</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Ad-Free & Clean Experience:</strong> Zero intrusive popup overlays or forced paywalls so you can compute distraction-free.</span>
            </div>

            <div className="flex items-start gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Local Storage Preferences:</strong> We only store simple UI settings (like your Dark/Light theme choice) locally in your browser&apos;s localStorage.</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-semibold text-xs transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
