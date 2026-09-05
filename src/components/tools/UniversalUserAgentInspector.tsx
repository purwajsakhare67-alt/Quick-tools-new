import React, { useState, useEffect, useMemo } from 'react';
import { 
  Laptop, 
  ArrowLeft, 
  Copy, 
  Check, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  HardDrive, 
  RefreshCw, 
  Sparkles, 
  Layers, 
  Zap, 
  Bot,
  Terminal,
  Activity
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalUserAgentInspectorProps {
  onBackToGrid?: () => void;
}

interface ParsedUA {
  browserName: string;
  browserVersion: string;
  osName: string;
  osVersion: string;
  engineName: string;
  engineVersion: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot' | 'Unknown';
  architecture: string;
  platform: string;
  isTouchDevice: boolean;
  maxTouchPoints: number;
  language: string;
  hardwareConcurrency: number;
  deviceMemoryGB?: number;
  cookieEnabled: boolean;
  onlineStatus: boolean;
  vendor: string;
  colorDepth: number;
  rawUA: string;
}

const SAMPLE_USER_AGENTS = [
  {
    name: 'Current Browser (Live)',
    ua: ''
  },
  {
    name: 'Chrome 128 (Windows 11 x64)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
  },
  {
    name: 'Safari 17.5 (macOS Sonoma)',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15'
  },
  {
    name: 'Mobile Safari (iPhone 15 Pro, iOS 17.5)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Chrome Mobile (Google Pixel 8, Android 14)',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.88 Mobile Safari/537.36'
  },
  {
    name: 'Firefox 129 (Ubuntu Linux x86_64)',
    ua: 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:129.0) Gecko/20100101 Firefox/129.0'
  },
  {
    name: 'Microsoft Edge 128 (Windows 11)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.2739.42'
  },
  {
    name: 'iPadOS Safari (iPad Pro)',
    ua: 'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1'
  },
  {
    name: 'Googlebot 2.1 (Web Crawler)',
    ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  }
];

function parseUserAgentString(ua: string): ParsedUA {
  const raw = ua || '';
  
  // Detect Bot
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot' | 'Unknown' = 'Desktop';
  if (/bot|crawler|spider|slurp|facebookexternalhit/i.test(raw)) {
    deviceType = 'Bot';
  } else if (/ipad|tablet|playbook|silk/i.test(raw)) {
    deviceType = 'Tablet';
  } else if (/mobi|iphone|ipod|android.*mobile/i.test(raw)) {
    deviceType = 'Mobile';
  } else if (/android/i.test(raw)) {
    deviceType = 'Tablet';
  }

  // Detect OS & Version
  let osName = 'Unknown OS';
  let osVersion = '';

  if (/Windows NT 10\.0/i.test(raw)) {
    osName = 'Windows';
    osVersion = '10 / 11';
  } else if (/Windows NT 6\.3/i.test(raw)) {
    osName = 'Windows';
    osVersion = '8.1';
  } else if (/Windows NT 6\.2/i.test(raw)) {
    osName = 'Windows';
    osVersion = '8';
  } else if (/Windows NT 6\.1/i.test(raw)) {
    osName = 'Windows';
    osVersion = '7';
  } else if (/iPhone OS ([0-9_]+)/i.test(raw)) {
    osName = 'iOS';
    osVersion = (raw.match(/iPhone OS ([0-9_]+)/i)?.[1] || '').replace(/_/g, '.');
  } else if (/CPU OS ([0-9_]+)/i.test(raw)) {
    osName = 'iPadOS';
    osVersion = (raw.match(/CPU OS ([0-9_]+)/i)?.[1] || '').replace(/_/g, '.');
  } else if (/Mac OS X ([0-9_]+)/i.test(raw)) {
    osName = 'macOS';
    osVersion = (raw.match(/Mac OS X ([0-9_]+)/i)?.[1] || '').replace(/_/g, '.');
  } else if (/Android ([0-9.]+)/i.test(raw)) {
    osName = 'Android';
    osVersion = raw.match(/Android ([0-9.]+)/i)?.[1] || '';
  } else if (/CrOS/i.test(raw)) {
    osName = 'Chrome OS';
  } else if (/Ubuntu/i.test(raw)) {
    osName = 'Ubuntu Linux';
  } else if (/Linux/i.test(raw)) {
    osName = 'Linux';
  }

  // Detect Browser & Version
  let browserName = 'Unknown Browser';
  let browserVersion = '';

  if (/Edg\/([0-9.]+)/i.test(raw)) {
    browserName = 'Microsoft Edge';
    browserVersion = raw.match(/Edg\/([0-9.]+)/i)?.[1] || '';
  } else if (/OPR\/([0-9.]+)/i.test(raw)) {
    browserName = 'Opera';
    browserVersion = raw.match(/OPR\/([0-9.]+)/i)?.[1] || '';
  } else if (/SamsungBrowser\/([0-9.]+)/i.test(raw)) {
    browserName = 'Samsung Internet';
    browserVersion = raw.match(/SamsungBrowser\/([0-9.]+)/i)?.[1] || '';
  } else if (/Brave/i.test(raw)) {
    browserName = 'Brave';
    browserVersion = raw.match(/Chrome\/([0-9.]+)/i)?.[1] || '';
  } else if (/Chrome\/([0-9.]+)/i.test(raw)) {
    browserName = 'Google Chrome';
    browserVersion = raw.match(/Chrome\/([0-9.]+)/i)?.[1] || '';
  } else if (/Version\/([0-9.]+).*Safari/i.test(raw)) {
    browserName = 'Apple Safari';
    browserVersion = raw.match(/Version\/([0-9.]+)/i)?.[1] || '';
  } else if (/Firefox\/([0-9.]+)/i.test(raw)) {
    browserName = 'Mozilla Firefox';
    browserVersion = raw.match(/Firefox\/([0-9.]+)/i)?.[1] || '';
  } else if (/Googlebot\/([0-9.]+)/i.test(raw)) {
    browserName = 'Googlebot';
    browserVersion = raw.match(/Googlebot\/([0-9.]+)/i)?.[1] || '';
  }

  // Rendering Engine
  let engineName = 'Unknown Engine';
  let engineVersion = '';
  if (/AppleWebKit\/([0-9.]+)/i.test(raw)) {
    if (/Chrome/i.test(raw) || /Edg/i.test(raw) || /OPR/i.test(raw)) {
      engineName = 'Blink';
      engineVersion = raw.match(/Chrome\/([0-9.]+)/i)?.[1] || '';
    } else {
      engineName = 'WebKit';
      engineVersion = raw.match(/AppleWebKit\/([0-9.]+)/i)?.[1] || '';
    }
  } else if (/Gecko\/([0-9.]+)/i.test(raw) && /Firefox/i.test(raw)) {
    engineName = 'Gecko';
    engineVersion = raw.match(/rv:([0-9.]+)/i)?.[1] || '';
  } else if (/Trident\/([0-9.]+)/i.test(raw)) {
    engineName = 'Trident';
    engineVersion = raw.match(/Trident\/([0-9.]+)/i)?.[1] || '';
  }

  // Architecture
  let architecture = 'x86_64 (64-bit)';
  if (/arm64|aarch64/i.test(raw)) {
    architecture = 'ARM64 (Apple Silicon / ARM)';
  } else if (/armv/i.test(raw) || /iPhone|iPad/i.test(raw)) {
    architecture = 'ARM (Mobile SoC)';
  } else if (/x86_64|win64|x64|wow64/i.test(raw)) {
    architecture = 'x86_64 (64-bit Intel/AMD)';
  } else if (/i686|i386/i.test(raw)) {
    architecture = 'x86 (32-bit)';
  }

  // Safe browser runtime fallbacks
  const nav = typeof window !== 'undefined' ? window.navigator : {} as any;
  const isTouch = typeof window !== 'undefined' ? (nav.maxTouchPoints > 0 || 'ontouchstart' in window) : false;

  return {
    browserName,
    browserVersion,
    osName,
    osVersion,
    engineName,
    engineVersion,
    deviceType,
    architecture,
    platform: nav.platform || 'Browser Engine',
    isTouchDevice: isTouch,
    maxTouchPoints: nav.maxTouchPoints || 0,
    language: nav.language || 'en-US',
    hardwareConcurrency: nav.hardwareConcurrency || 4,
    deviceMemoryGB: (nav as any).deviceMemory || undefined,
    cookieEnabled: nav.cookieEnabled ?? true,
    onlineStatus: nav.onLine ?? true,
    vendor: nav.vendor || 'Standard WebKit / Chromium',
    colorDepth: typeof window !== 'undefined' && window.screen ? window.screen.colorDepth : 24,
    rawUA: raw
  };
}

export const UniversalUserAgentInspector: React.FC<UniversalUserAgentInspectorProps> = ({ onBackToGrid }) => {
  const [currentUserAgent, setCurrentUserAgent] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<string>('Current Browser (Live)');
  const [copiedUa, setCopiedUa] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUserAgent(window.navigator.userAgent);
    }
  }, []);

  const parsed = useMemo(() => {
    return parseUserAgentString(currentUserAgent);
  }, [currentUserAgent]);

  const handleCopyUA = () => {
    if (!currentUserAgent) return;
    navigator.clipboard.writeText(currentUserAgent);
    playSound('success');
    setCopiedUa(true);
    setTimeout(() => setCopiedUa(false), 2000);
  };

  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(parsed, null, 2);
    navigator.clipboard.writeText(jsonStr);
    playSound('success');
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    playSound('tap');
    if (presetName === 'Current Browser (Live)') {
      if (typeof window !== 'undefined') {
        setCurrentUserAgent(window.navigator.userAgent);
      }
    } else {
      const match = SAMPLE_USER_AGENTS.find((s) => s.name === presetName);
      if (match) {
        setCurrentUserAgent(match.ua);
      }
    }
  };

  const DeviceIcon = () => {
    switch (parsed.deviceType) {
      case 'Mobile':
        return <Smartphone className="w-6 h-6 text-emerald-400" />;
      case 'Tablet':
        return <Tablet className="w-6 h-6 text-cyan-400" />;
      case 'Bot':
        return <Bot className="w-6 h-6 text-rose-400" />;
      default:
        return <Monitor className="w-6 h-6 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full space-y-6" id="universal-user-agent-inspector">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/80 transition-colors cursor-pointer"
              title="Back to All Tools"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Real-Time User Agent Extractor & Browser Inspector
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Zero backend roundtrip • Instant client-side runtime evaluation • Hardware & platform telemetry
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyUA}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:opacity-95 transition-opacity cursor-pointer"
          >
            {copiedUa ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedUa ? 'Copied Full UA!' : 'Copy Full UA String'}</span>
          </button>
          <button
            onClick={handleCopyJSON}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Layers className="w-4 h-4 text-blue-400" />}
            <span className="hidden sm:inline">{copiedJson ? 'JSON Copied' : 'Export Specs JSON'}</span>
          </button>
        </div>
      </div>

      {/* Preset UA Selector & Custom Edit Ribbon */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target User Agent (Auto-loads from your client runtime):</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
            >
              {SAMPLE_USER_AGENTS.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
            {selectedPreset !== 'Current Browser (Live)' && (
              <button
                onClick={() => handlePresetChange('Current Browser (Live)')}
                className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-500 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Reset to Live Browser"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="text-[10px]">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* User Agent String Editable Display */}
        <div className="relative">
          <textarea
            value={currentUserAgent}
            onChange={(e) => {
              setCurrentUserAgent(e.target.value);
              setSelectedPreset('Custom');
            }}
            rows={2}
            className="w-full text-xs font-mono p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none selection:bg-cyan-500/30"
            placeholder="Paste or type any User-Agent string to inspect..."
          />
        </div>
      </div>

      {/* Primary Highlights Hero Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Browser Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent border border-cyan-500/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
              Browser Family
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {parsed.browserName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 truncate">
              Version {parsed.browserVersion || 'Detected'}
            </p>
          </div>
        </div>

        {/* Operating System Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <Laptop className="w-6 h-6 text-blue-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Operating System
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {parsed.osName} {parsed.osVersion}
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 truncate">
              {parsed.architecture}
            </p>
          </div>
        </div>

        {/* Rendering Engine Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-transparent border border-indigo-500/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Rendering Engine
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {parsed.engineName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 truncate">
              Engine Rev: {parsed.engineVersion || 'N/A'}
            </p>
          </div>
        </div>

        {/* Device Form Factor */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <DeviceIcon />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Device Form Factor
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate">
              {parsed.deviceType}
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60 truncate">
              {parsed.isTouchDevice ? 'Touch Enabled' : 'Pointer / Mouse'}
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Specifications Matrix */}
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
        <div className="p-3.5 bg-slate-100/80 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              Hardware Architecture & Client Telemetry
            </span>
          </div>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
            W3C Navigator API
          </span>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" /> Logical CPU Cores
            </span>
            <p className="font-bold text-slate-800 dark:text-white font-mono">
              {parsed.hardwareConcurrency} Threads Available
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" /> Device Memory (RAM)
            </span>
            <p className="font-bold text-slate-800 dark:text-white font-mono">
              {parsed.deviceMemoryGB ? `~${parsed.deviceMemoryGB} GB` : 'Protected / Unknown'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Primary Language
            </span>
            <p className="font-bold text-slate-800 dark:text-white font-mono">
              {parsed.language}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Cookie Support
            </span>
            <p className="font-bold text-slate-800 dark:text-white font-mono">
              {parsed.cookieEnabled ? 'Enabled (First & Session)' : 'Disabled / Blocked'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Touch Points
            </span>
            <p className="font-bold text-slate-800 dark:text-white font-mono">
              {parsed.maxTouchPoints} Touch Contact{parsed.maxTouchPoints === 1 ? '' : 's'}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 space-y-1">
            <span className="text-[11px] text-slate-500 dark:text-white/50 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" /> Color Depth
            </span>
            <p className="font-bold text-slate-800 dark:text-white font-mono">
              {parsed.colorDepth}-bit TrueColor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
