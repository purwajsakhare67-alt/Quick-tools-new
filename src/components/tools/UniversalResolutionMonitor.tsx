import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Monitor, 
  ArrowLeft, 
  Copy, 
  Check, 
  Maximize, 
  Minimize, 
  Sparkles, 
  Activity, 
  Smartphone, 
  Tv, 
  Eye, 
  Zap, 
  RefreshCw,
  Palette,
  Compass
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalResolutionMonitorProps {
  onBackToGrid?: () => void;
}

// Helper to compute Greatest Common Divisor
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

// Aspect ratio reducer with standard tolerances
function calculateAspectRatio(width: number, height: number): { ratioStr: string; standardName?: string } {
  if (!width || !height) return { ratioStr: 'N/A' };
  const divisor = gcd(Math.round(width), Math.round(height));
  let w = Math.round(width / divisor);
  let h = Math.round(height / divisor);

  // Common approximation matching
  const decimal = width / height;
  let standardName: string | undefined;

  if (Math.abs(decimal - 16 / 9) < 0.05) {
    standardName = '16:9 (Standard Widescreen)';
  } else if (Math.abs(decimal - 16 / 10) < 0.05) {
    standardName = '16:10 (Productivity / MacBook)';
  } else if (Math.abs(decimal - 21 / 9) < 0.08) {
    standardName = '21:9 (Ultrawide Cinema)';
  } else if (Math.abs(decimal - 4 / 3) < 0.05) {
    standardName = '4:3 (Classic Display / iPad)';
  } else if (Math.abs(decimal - 3 / 2) < 0.05) {
    standardName = '3:2 (Surface / Modern Laptop)';
  } else if (Math.abs(decimal - 9 / 16) < 0.05) {
    standardName = '9:16 (Mobile Portrait / Reels)';
  } else if (Math.abs(decimal - 19.5 / 9) < 0.05) {
    standardName = '19.5:9 (Modern Smartphone)';
  }

  // Simplify unwieldy ratios
  if (w > 50 || h > 50) {
    const dec = (width / height).toFixed(2);
    return { ratioStr: `${dec}:1`, standardName };
  }

  return { ratioStr: `${w}:${h}`, standardName };
}

export const UniversalResolutionMonitor: React.FC<UniversalResolutionMonitorProps> = ({
  onBackToGrid
}) => {
  const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);
  const [viewportHeight, setViewportHeight] = useState<number>(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState<number>(window.screen.width);
  const [screenHeight, setScreenHeight] = useState<number>(window.screen.height);
  const [availWidth, setAvailWidth] = useState<number>(window.screen.availWidth);
  const [availHeight, setAvailHeight] = useState<number>(window.screen.availHeight);
  const [dpr, setDpr] = useState<number>(window.devicePixelRatio || 1);
  const [colorDepth, setColorDepth] = useState<number>(window.screen.colorDepth || 24);
  const [orientation, setOrientation] = useState<string>(
    window.screen?.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
  );
  const [fps, setFps] = useState<number>(60);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  const [copied, setCopied] = useState<boolean>(false);

  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());

  // Real-time Resize & Orientation Monitor
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
      setScreenWidth(window.screen.width);
      setScreenHeight(window.screen.height);
      setAvailWidth(window.screen.availWidth);
      setAvailHeight(window.screen.availHeight);
      setDpr(window.devicePixelRatio || 1);
      setColorDepth(window.screen.colorDepth || 24);
      setOrientation(
        window.screen?.orientation?.type || (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
      );
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    document.addEventListener('fullscreenchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      document.removeEventListener('fullscreenchange', handleResize);
    };
  }, []);

  // Frame rate estimation
  useEffect(() => {
    let animId: number;
    const calculateFps = (now: number) => {
      frameCountRef.current++;
      if (now - lastTimeRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };

    animId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Color gamut check
  const colorGamut = useMemo(() => {
    if (window.matchMedia('(color-gamut: p3)').matches) return 'Display P3 (Wide Color)';
    if (window.matchMedia('(color-gamut: rec2020)').matches) return 'Rec. 2020 (Ultra Wide)';
    if (window.matchMedia('(color-gamut: srgb)').matches) return 'sRGB (Standard)';
    return 'Standard RGB';
  }, []);

  const hasTouch = typeof navigator !== 'undefined' && (navigator.maxTouchPoints > 0 || 'ontouchstart' in window);

  // Aspect ratios
  const viewportAspect = useMemo(() => calculateAspectRatio(viewportWidth, viewportHeight), [viewportWidth, viewportHeight]);
  const screenAspect = useMemo(() => calculateAspectRatio(screenWidth, screenHeight), [screenWidth, screenHeight]);

  const toggleFullscreen = () => {
    playSound('tap');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const copyDiagnostics = () => {
    playSound('bell');
    const diag = `--- System Display & Resolution Diagnostics ---
Viewport Window Size: ${viewportWidth} × ${viewportHeight} px
Viewport Aspect Ratio: ${viewportAspect.ratioStr} (${viewportAspect.standardName || 'Custom'})
Physical Screen Resolution: ${screenWidth} × ${screenHeight} px (Effective: ${Math.round(screenWidth * dpr)} × ${Math.round(screenHeight * dpr)} px)
Available Work Area: ${availWidth} × ${availHeight} px
Device Pixel Ratio (DPR): ${dpr}x (${Math.round(dpr * 96)} Estimated DPI)
Color Depth: ${colorDepth}-bit (${Math.pow(2, colorDepth).toLocaleString()} colors)
Color Gamut: ${colorGamut}
Orientation: ${orientation}
Estimated Display Refresh Rate: ~${fps} Hz
Touch Input Hardware: ${hasTouch ? 'Supported' : 'Not Detected'}
Fullscreen Status: ${isFullscreen ? 'Active' : 'Windowed'}
User Agent: ${navigator.userAgent}`;

    navigator.clipboard.writeText(diag);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Scaled mini monitor wireframe calculation
  const monitorScale = useMemo(() => {
    const maxPreviewW = 320;
    const maxPreviewH = 170;
    const ratio = screenWidth / screenHeight;
    let w = maxPreviewW;
    let h = maxPreviewW / ratio;
    if (h > maxPreviewH) {
      h = maxPreviewH;
      w = maxPreviewH * ratio;
    }
    const vpW = Math.round((viewportWidth / screenWidth) * w);
    const vpH = Math.round((viewportHeight / screenHeight) * h);
    return { w: Math.round(w), h: Math.round(h), vpW: Math.min(w, vpW), vpH: Math.min(h, vpH) };
  }, [screenWidth, screenHeight, viewportWidth, viewportHeight]);

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-colors"
              title="Back to tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Monitor className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Live Display Resolution & Aspect Ratio Monitor
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Daily Tech Utility
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
          <button
            onClick={copyDiagnostics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md hover:shadow-amber-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy Diagnostics</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Real-Time Visual Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Monitor Canvas Graphic */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-inner">
          <div className="text-center mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
              Physical vs Viewport Canvas Wireframe
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {viewportAspect.standardName || `${viewportAspect.ratioStr} Viewport`}
            </span>
          </div>

          {/* Miniature Screen Graphic */}
          <div
            style={{ width: `${monitorScale.w}px`, height: `${monitorScale.h}px` }}
            className="relative rounded-xl border-4 border-slate-800 dark:border-slate-700 bg-slate-900 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-300"
          >
            {/* Viewport Sub-rectangle overlay */}
            <div
              style={{ width: `${monitorScale.vpW}px`, height: `${monitorScale.vpH}px` }}
              className="absolute border-2 border-dashed border-amber-400 bg-amber-400/15 rounded-lg flex items-center justify-center transition-all duration-300"
            >
              <div className="p-1 rounded bg-black/80 text-[9px] font-mono text-amber-300 font-bold">
                {viewportWidth} × {viewportHeight}
              </div>
            </div>

            {/* Corner screen label */}
            <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-500">
              {screenWidth}×{screenHeight} Screen
            </span>
          </div>

          {/* Stand base */}
          <div className="w-12 h-3 bg-slate-700 dark:bg-slate-600 rounded-b-md mt-0.5"></div>
          <div className="w-24 h-1.5 bg-slate-800 dark:bg-slate-500 rounded-full shadow-md"></div>

          <p className="mt-4 text-[11px] text-slate-400 text-center">
            Resize your browser window to watch dimensions calculate in real-time.
          </p>
        </div>

        {/* Dynamic Metric Tiles */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Tile 1: Current Viewport */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1 text-amber-500">
                <Eye className="w-3.5 h-3.5" /> Viewport Dimensions
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded font-bold">
                Live Window
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {viewportWidth} <span className="text-slate-400 font-normal">×</span> {viewportHeight}
              <span className="text-xs text-slate-400 font-sans ml-1">px</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-white/60">
              Ratio: <strong className="text-amber-500">{viewportAspect.ratioStr}</strong> ({(viewportWidth / viewportHeight).toFixed(3)}:1)
            </div>
          </div>

          {/* Tile 2: Physical Hardware Resolution */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1 text-cyan-500">
                <Tv className="w-3.5 h-3.5" /> Hardware Resolution
              </span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-1.5 py-0.5 rounded font-bold">
                Screen
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {screenWidth} <span className="text-slate-400 font-normal">×</span> {screenHeight}
              <span className="text-xs text-slate-400 font-sans ml-1">px</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-white/60">
              Screen Ratio: <strong className="text-cyan-500">{screenAspect.ratioStr}</strong> ({screenAspect.standardName || 'Custom'})
            </div>
          </div>

          {/* Tile 3: Device Pixel Ratio & Native Pixels */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1 text-violet-500">
                <Zap className="w-3.5 h-3.5" /> Pixel Density (DPI/Retina)
              </span>
              <span className="text-[10px] bg-violet-500/10 text-violet-500 px-1.5 py-0.5 rounded font-bold">
                {dpr > 1 ? 'HiDPI / Retina' : 'Standard DPI'}
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              {dpr.toFixed(2)}<span className="text-slate-400 text-sm">x Scale</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-white/60">
              Effective Render: <strong>{Math.round(screenWidth * dpr)} × {Math.round(screenHeight * dpr)}</strong> physical px
            </div>
          </div>

          {/* Tile 4: Refresh Rate & Orientation */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1 text-emerald-500">
                <Activity className="w-3.5 h-3.5" /> Refresh & Orientation
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded font-bold">
                Dynamic
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
              ~{fps} <span className="text-sm font-sans text-slate-400">Hz FPS</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-white/60 capitalize">
              {orientation.replace('-', ' ')} {hasTouch ? '• Touchscreen' : '• Desktop Mouse'}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Telemetry Specs Table */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-3">
          Hardware & Color Space Telemetry
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Color Depth</span>
            <span className="font-bold text-slate-800 dark:text-white">
              {colorDepth}-bit ({Math.pow(2, colorDepth).toLocaleString()} shades)
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Color Gamut</span>
            <span className="font-bold text-slate-800 dark:text-white">{colorGamut}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Usable Work Area</span>
            <span className="font-bold text-slate-800 dark:text-white font-mono">
              {availWidth} × {availHeight} px
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Estimated DPI</span>
            <span className="font-bold text-slate-800 dark:text-white font-mono">
              ~{Math.round(dpr * 96)} DPI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
