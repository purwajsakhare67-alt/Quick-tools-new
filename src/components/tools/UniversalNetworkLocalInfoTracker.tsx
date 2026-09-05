import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Copy, 
  Check, 
  RefreshCw, 
  Wifi, 
  Globe, 
  Cpu, 
  Monitor, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Layers,
  CheckCircle2,
  Server
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalNetworkLocalInfoTrackerProps {
  onBackToGrid?: () => void;
}

interface SystemTelemetry {
  isOnline: boolean;
  effectiveType: string;
  downlinkSpeedMbps: string;
  roundTripTimeMs: string;
  saveDataMode: boolean;
  screenResolution: string;
  viewportSize: string;
  devicePixelRatio: number;
  colorDepth: number;
  cpuCores: number;
  deviceMemoryGb: string;
  preferredLanguage: string;
  allLanguages: string;
  timeZone: string;
  utcOffset: string;
  platformOs: string;
  userAgentSnippet: string;
  touchSupported: boolean;
  maxTouchPoints: number;
  cookiesEnabled: boolean;
  webrtcLocalCandidate: string;
  scanTimestamp: string;
}

export const UniversalNetworkLocalInfoTracker: React.FC<UniversalNetworkLocalInfoTrackerProps> = ({ onBackToGrid }) => {
  const [telemetry, setTelemetry] = useState<SystemTelemetry | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const scanProperties = () => {
    setIsScanning(true);
    playSound('click');

    // 1. Gather Navigator & Window props
    const nav: any = typeof navigator !== 'undefined' ? navigator : {};
    const win: any = typeof window !== 'undefined' ? window : {};
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;

    const isOnline = nav.onLine ?? true;
    const effectiveType = conn ? conn.effectiveType || '4g' : 'Broadband (N/A)';
    const downlinkSpeedMbps = conn && conn.downlink !== undefined ? `${conn.downlink} Mbps` : 'Direct Link';
    const roundTripTimeMs = conn && conn.rtt !== undefined ? `${conn.rtt} ms` : '< 50 ms';
    const saveDataMode = conn ? !!conn.saveData : false;

    const screenResolution = win.screen ? `${win.screen.width} × ${win.screen.height}` : '1920 × 1080';
    const viewportSize = `${win.innerWidth || 1024} × ${win.innerHeight || 768}`;
    const devicePixelRatio = win.devicePixelRatio || 1;
    const colorDepth = win.screen ? win.screen.colorDepth || 24 : 24;

    const cpuCores = nav.hardwareConcurrency || 4;
    const deviceMemoryGb = nav.deviceMemory ? `${nav.deviceMemory} GB+` : 'Standard RAM';

    const preferredLanguage = nav.language || 'en-US';
    const allLanguages = nav.languages ? nav.languages.join(', ') : preferredLanguage;

    let timeZone = 'UTC';
    try {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    } catch (e) {
      // fallback
    }

    const offsetMinutes = new Date().getTimezoneOffset();
    const offsetHours = -offsetMinutes / 60;
    const utcOffset = `UTC${offsetHours >= 0 ? '+' : ''}${offsetHours}`;

    const platformOs = nav.userAgentData?.platform || nav.platform || 'Desktop Client';
    const userAgentSnippet = nav.userAgent || 'Modern Browser Runtime';
    const touchSupported = 'ontouchstart' in win || (nav.maxTouchPoints && nav.maxTouchPoints > 0);
    const maxTouchPoints = nav.maxTouchPoints || 0;
    const cookiesEnabled = nav.cookieEnabled ?? true;

    // 2. WebRTC Candidate Local Inspection
    let webrtcCandidateFound = 'Secured / mDNS Protected';

    const finishScan = (webrtcCandidate: string) => {
      setTelemetry({
        isOnline,
        effectiveType,
        downlinkSpeedMbps,
        roundTripTimeMs,
        saveDataMode,
        screenResolution,
        viewportSize,
        devicePixelRatio,
        colorDepth,
        cpuCores,
        deviceMemoryGb,
        preferredLanguage,
        allLanguages,
        timeZone,
        utcOffset,
        platformOs,
        userAgentSnippet,
        touchSupported: !!touchSupported,
        maxTouchPoints,
        cookiesEnabled,
        webrtcLocalCandidate: webrtcCandidate,
        scanTimestamp: new Date().toLocaleTimeString()
      });
      setIsScanning(false);
      playSound('success');
    };

    // Attempt RTCPeerConnection candidate probe safely
    try {
      const RTCPeer = win.RTCPeerConnection || win.webkitRTCPeerConnection || win.mozRTCPeerConnection;
      if (RTCPeer) {
        const pc = new RTCPeer({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        let candidateObserved = false;

        pc.createDataChannel('');
        pc.createOffer()
          .then((offer: any) => pc.setLocalDescription(offer))
          .catch(() => {});

        pc.onicecandidate = (event: any) => {
          if (event && event.candidate && event.candidate.candidate) {
            const candidateStr = event.candidate.candidate;
            const parts = candidateStr.split(' ');
            // Look for IP candidate in candidate string
            for (const part of parts) {
              if (/^(\d{1,3}\.){3}\d{1,3}$/.test(part) || part.endsWith('.local')) {
                webrtcCandidateFound = `${part} (ICE Host)`;
                candidateObserved = true;
                break;
              }
            }
          }
        };

        setTimeout(() => {
          try { pc.close(); } catch (e) {}
          finishScan(candidateObserved ? webrtcCandidateFound : 'Protected (mDNS host masked)');
        }, 400);
      } else {
        finishScan('WebRTC Not Supported in Context');
      }
    } catch (e) {
      finishScan('Local Subsystem Masked');
    }
  };

  useEffect(() => {
    scanProperties();
  }, []);

  const handleCopySingle = (label: string, value: string) => {
    navigator.clipboard.writeText(`${label}: ${value}`);
    setCopiedKey(label);
    playSound('click');
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleCopyAllJson = () => {
    if (!telemetry) return;
    navigator.clipboard.writeText(JSON.stringify(telemetry, null, 2));
    setCopiedAll(true);
    playSound('success');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div id="network-local-tracker-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-teal-500/10 border border-sky-500/20 dark:border-sky-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Client-Side User Network Property &amp; Local Info Tracker
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                Hardware &amp; WebRTC
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inspect your local browser routing parameters, network link rates, hardware concurrency, and display geometry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={scanProperties}
            disabled={isScanning}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            Refresh Diagnostics
          </button>
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              Back to Grid
            </button>
          )}
        </div>
      </div>

      {/* Main Spec Status Cards */}
      {telemetry && (
        <div className="space-y-4">
          {/* Top 3 Metric Feature Tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Link Status</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {telemetry.isOnline ? 'Online / Connected' : 'Offline'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                {telemetry.effectiveType}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Round Trip Latency</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {telemetry.roundTripTimeMs}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {telemetry.downlinkSpeedMbps}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">CPU Concurrency</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {telemetry.cpuCores} Logic Threads
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-600 dark:text-purple-400 font-bold">
                {telemetry.deviceMemoryGb}
              </span>
            </div>
          </div>

          {/* Detailed Property Groups */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Network & Local Routing Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-sky-500" />
                  Network &amp; Subsystem Routing
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Last scanned: {telemetry.scanTimestamp}</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {[
                  { label: 'WebRTC Local Candidate', val: telemetry.webrtcLocalCandidate },
                  { label: 'Downlink Bandwidth', val: telemetry.downlinkSpeedMbps },
                  { label: 'Effective Link Type', val: telemetry.effectiveType },
                  { label: 'Round Trip Ping Estimate', val: telemetry.roundTripTimeMs },
                  { label: 'Save-Data Mode Active', val: telemetry.saveDataMode ? 'Yes (Reduced Data)' : 'Disabled' },
                  { label: 'Cookies Enabled', val: telemetry.cookiesEnabled ? 'Permitted' : 'Blocked' }
                ].map((row, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                        {row.val}
                      </span>
                      <button
                        onClick={() => handleCopySingle(row.label, row.val)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Copy Value"
                      >
                        {copiedKey === row.label ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hardware, Geometry & Locale Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-cyan-500" />
                  Display Geometry &amp; Environment
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">{telemetry.platformOs}</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {[
                  { label: 'Physical Screen Resolution', val: telemetry.screenResolution },
                  { label: 'Active Viewport Dimension', val: telemetry.viewportSize },
                  { label: 'Device Pixel Ratio (DPR)', val: `${telemetry.devicePixelRatio}x scale` },
                  { label: 'Color Bit Depth', val: `${telemetry.colorDepth}-bit sRGB` },
                  { label: 'System Timezone', val: `${telemetry.timeZone} (${telemetry.utcOffset})` },
                  { label: 'Primary Language', val: telemetry.preferredLanguage },
                  { label: 'Touch Digitizer Support', val: telemetry.touchSupported ? `Enabled (${telemetry.maxTouchPoints} points)` : 'Mouse / Trackpad Only' }
                ].map((row, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-slate-500 dark:text-slate-400">{row.label}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                        {row.val}
                      </span>
                      <button
                        onClick={() => handleCopySingle(row.label, row.val)}
                        className="p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="Copy Value"
                      >
                        {copiedKey === row.label ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User Agent String Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-2">
            <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-800">
              <span className="text-slate-400 font-mono">Raw Client User Agent:</span>
              <button
                onClick={handleCopyAllJson}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAll ? 'Copied Full JSON!' : 'Copy Full Diagnostic JSON'}
              </button>
            </div>
            <p className="font-mono text-xs text-sky-200 break-all select-all pt-1">
              {telemetry.userAgentSnippet}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
