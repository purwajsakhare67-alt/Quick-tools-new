import React, { useState } from 'react';
import { Download, Share, Smartphone, X, Check, Laptop } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'drawer' | 'banner';
  className?: string;
  id?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
  id = 'btn-pwa-install'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showInstructions, setShowInstructions] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running in standalone/installed mode, do not render prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 4000);
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <>
      {/* Button Render depending on variant */}
      {variant === 'header' && (
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 hover:from-cyan-500/25 hover:via-purple-500/25 hover:to-pink-500/25 border border-purple-500/30 dark:border-white/15 text-purple-700 dark:text-cyan-300 text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xs cursor-pointer ${className}`}
          id={id}
          title="Install QuickFree Tools as a Desktop or Mobile App (Online Access)"
        >
          {installSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Installed!</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-purple-600 dark:text-cyan-400 shrink-0 animate-bounce" />
              <span className="hidden xs:inline">Install App</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 hidden md:inline">
                PWA
              </span>
            </>
          )}
        </button>
      )}

      {variant === 'drawer' && (
        <button
          onClick={handleInstallClick}
          className={`w-full p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-pink-500/10 hover:from-purple-500/20 hover:via-cyan-500/20 hover:to-pink-500/20 border border-purple-500/20 dark:border-white/10 text-left transition-all flex items-center justify-between group cursor-pointer ${className}`}
          id={id}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white shrink-0">
              <div className="w-full h-full bg-slate-950/80 rounded-[10px] flex items-center justify-center">
                <Download className="w-4 h-4 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-white">Install App (PWA)</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  Online Only
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/40">
                Install locally on desktop, tablet, or phone
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-purple-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform">
            Install →
          </span>
        </button>
      )}

      {variant === 'banner' && (
        <div className={`p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-purple-500/20 dark:border-white/10 shadow-lg backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center text-white shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                Install QuickFree Tools
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300">
                  PWA
                </span>
              </h4>
              <p className="text-xs text-slate-500 dark:text-white/60">
                Launch instantly in standalone window with zero browser tabs (Requires active internet connection).
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider shadow-md hover:shadow-purple-500/30 transition-all cursor-pointer shrink-0"
          >
            Install Now
          </button>
        </div>
      )}

      {/* Guided Install Instructions Modal (for iOS or browsers without native prompt event) */}
      {showInstructions && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowInstructions(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                  <Download className="w-6 h-6 text-cyan-300" />
                </div>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Install QuickFree Tools
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/50">
                  Fast desktop & mobile local app installation
                </p>
              </div>
            </div>

            {/* Online Only Notice */}
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs">
              <span className="font-bold">⚠️ Online Access Required:</span> QuickFree Tools operates exclusively with an active internet connection to ensure real-time financial algorithms and live compute. Offline caching is disabled.
            </div>

            {isIOS ? (
              <div className="space-y-3 mb-6 text-xs text-slate-600 dark:text-white/70">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-purple-400" />
                  Install on iPhone / iPad (Safari):
                </p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Tap the <strong className="text-slate-900 dark:text-white flex inline-flex items-center gap-1"><Share className="w-3 h-3 text-cyan-500 inline" /> Share</strong> button in Safari toolbar.
                  </li>
                  <li>
                    Scroll down and select <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong>.
                  </li>
                  <li>
                    Tap <strong className="text-slate-900 dark:text-white">"Add"</strong> in the top right to launch directly from your home screen.
                  </li>
                </ol>
              </div>
            ) : (
              <div className="space-y-3 mb-6 text-xs text-slate-600 dark:text-white/70">
                <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  Install on Chrome, Edge, or Android:
                </p>
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    Look for the <strong className="text-slate-900 dark:text-white">Install</strong> icon (<Download className="w-3 h-3 text-cyan-500 inline" />) in your browser address bar (top right).
                  </li>
                  <li>
                    Alternatively, open the browser menu (⋮ or ...) and select <strong className="text-slate-900 dark:text-white">"Install QuickFree Tools"</strong> or <strong className="text-slate-900 dark:text-white">"Add to Home Screen"</strong>.
                  </li>
                  <li>
                    Click <strong className="text-slate-900 dark:text-white">Install</strong> to add QuickFree Tools to your desktop or app drawer.
                  </li>
                </ol>
              </div>
            )}

            <button
              onClick={() => setShowInstructions(false)}
              className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
