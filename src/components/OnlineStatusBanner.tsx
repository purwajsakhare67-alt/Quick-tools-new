import React from 'react';
import { WifiOff, Wifi, RefreshCw, Sparkles } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OnlineStatusBanner: React.FC = () => {
  const { isOnline, wasOffline } = useOnlineStatus();

  if (isOnline && !wasOffline) {
    return null;
  }

  if (!isOnline) {
    return (
      <div 
        className="fixed top-0 left-0 right-0 z-50 text-white px-4 py-2.5 shadow-2xl border-b border-[#00f0ff]/30 animate-in slide-in-from-top duration-300"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(10, 10, 14, 0.92)'
        }}
        role="alert"
        aria-live="assertive"
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center shrink-0 animate-pulse text-[#00f0ff]">
              <WifiOff className="w-3.5 h-3.5" />
            </div>
            <p className="text-xs sm:text-sm font-medium truncate text-white/90">
              <strong className="text-[#00f0ff] font-mono">Offline Compute Active:</strong> All 100 client engines run locally. <span className="hidden md:inline text-cyan-200/70">Connect to internet to refresh premium updates.</span>
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
              <Sparkles className="w-3 h-3 text-[#00f0ff]" />
              Private Compute
            </span>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-[0_0_10px_#00f0ff] cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Sync</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Brief reconnection confirmation banner
  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 bg-emerald-600/95 text-white px-4 py-2 shadow-lg backdrop-blur-md flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold animate-in slide-in-from-top duration-300"
      role="status"
      aria-live="polite"
    >
      <Wifi className="w-4 h-4 text-emerald-200" />
      <span>Online Sync Restored — QuickFree Tools connected to cloud network.</span>
    </div>
  );
};
