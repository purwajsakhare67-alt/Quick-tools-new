import React, { useState, useRef } from 'react';
import { 
  Maximize2, 
  Upload, 
  ArrowLeft, 
  Sliders, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Smartphone, 
  Sparkles,
  RotateCcw,
  ShieldCheck,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music,
  Plus
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface SocialSafeZoneProps {
  onBackToGrid?: () => void;
}

type PlatformType = 'tiktok' | 'reels' | 'shorts' | 'story' | 'yt_banner';

export const UniversalSocialSafeZone: React.FC<SocialSafeZoneProps> = ({ onBackToGrid }) => {
  const [platform, setPlatform] = useState<PlatformType>('tiktok');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [overlayOpacity, setOverlayOpacity] = useState<number>(75);
  const [showUiChrome, setShowUiChrome] = useState<boolean>(true);
  const [showDangerZones, setShowDangerZones] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample banners for instant 1-click testing
  const samplePresets = [
    {
      id: 'viral_hook',
      label: 'Sample 9:16 Video Graphic',
      aspect: '9:16',
      // SVG data URL depicting typical video text hook
      src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="%231e1b4b"/>
            <stop offset="50%" stop-color="%23312e81"/>
            <stop offset="100%" stop-color="%230f172a"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(%23g)"/>
        <circle cx="360" cy="540" r="180" fill="%23ec4899" opacity="0.25"/>
        <circle cx="480" cy="720" r="220" fill="%238b5cf6" opacity="0.3"/>
        <text x="360" y="320" font-family="system-ui,sans-serif" font-weight="900" font-size="44" fill="%23ffffff" text-anchor="middle">5 SECRET AI TOOLS</text>
        <text x="360" y="380" font-family="system-ui,sans-serif" font-weight="700" font-size="28" fill="%2338bdf8" text-anchor="middle">YOU NEVER KNEW EXISTED</text>
        <rect x="180" y="440" width="360" height="240" rx="24" fill="%23ffffff" opacity="0.1" stroke="%2338bdf8" stroke-width="2"/>
        <text x="360" y="570" font-family="system-ui,sans-serif" font-weight="800" font-size="26" fill="%23ffffff" text-anchor="middle">SAFE CENTER CONTENT</text>
        <text x="640" y="760" font-family="system-ui,sans-serif" font-weight="700" font-size="20" fill="%23f43f5e" text-anchor="end">⚠️ DANGER: RIGHT EDGE</text>
        <text x="360" y="1180" font-family="system-ui,sans-serif" font-weight="700" font-size="22" fill="%23f43f5e" text-anchor="middle">⚠️ DANGER: BLOCKED BY CAPTION</text>
      </svg>`
    },
    {
      id: 'podcast_promo',
      label: 'Sample Podcast Clip (9:16)',
      aspect: '9:16',
      src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280">
        <defs>
          <linearGradient id="p" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="%2318181b"/>
            <stop offset="100%" stop-color="%2309090b"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(%23p)"/>
        <rect x="80" y="240" width="560" height="700" rx="32" fill="%2327272a" stroke="%233f3f46" stroke-width="2"/>
        <text x="360" y="360" font-family="system-ui,sans-serif" font-weight="900" font-size="36" fill="%23fbbf24" text-anchor="middle">THE FOUNDER DIARIES</text>
        <text x="360" y="420" font-family="system-ui,sans-serif" font-weight="600" font-size="22" fill="%23a1a1aa" text-anchor="middle">Episode 48 • Solo SaaS Growth</text>
        <rect x="160" y="500" width="400" height="320" rx="20" fill="%233f3f46"/>
        <text x="360" y="670" font-family="system-ui,sans-serif" font-weight="800" font-size="32" fill="%23ffffff" text-anchor="middle">PERFECT SAFE ZONE</text>
        <text x="360" y="870" font-family="system-ui,sans-serif" font-weight="700" font-size="20" fill="%2310b981" text-anchor="middle">✓ Visible on All Devices</text>
      </svg>`
    }
  ];

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    playSound('click');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      playSound('success');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const selectPreset = (src: string) => {
    playSound('click');
    setImageSrc(src);
  };

  // Platform Specs
  const platformSpecs: Record<PlatformType, { name: string; ratio: string; dangerNote: string }> = {
    tiktok: {
      name: 'TikTok Video (9:16)',
      ratio: '9:16 (1080 × 1920)',
      dangerNote: 'Top 12% (tabs/search), Right 20% (buttons), Bottom 22% (caption & sound marquee)'
    },
    reels: {
      name: 'Instagram Reels (9:16)',
      ratio: '9:16 (1080 × 1920)',
      dangerNote: 'Top 10% (audio label), Right 18% (likes/comments), Bottom 20% (creator caption)'
    },
    shorts: {
      name: 'YouTube Shorts (9:16)',
      ratio: '9:16 (1080 × 1920)',
      dangerNote: 'Top 8% (search/menu), Right 18% (thumbs/share), Bottom 18% (channel/subscribe)'
    },
    story: {
      name: 'Instagram Story (9:16)',
      ratio: '9:16 (1080 × 1920)',
      dangerNote: 'Top 14% (segment progress & avatar), Bottom 15% (quick reply bar)'
    },
    yt_banner: {
      name: 'YouTube Banner / Header (16:9)',
      ratio: '16:9 (2560 × 1440)',
      dangerNote: 'Mobile safe zone is strictly the center 1546 × 423 pixels'
    }
  };

  return (
    <div className="space-y-6" id="social-safe-zone-tool">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0">
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Social Media Safe-Zone & Overlay Checker
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                Mobile Viewport Matrix
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Verify graphics against TikTok, Instagram Reels & YouTube Shorts mobile interface overlays
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={() => {
              playSound('click');
              onBackToGrid();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Grid</span>
          </button>
        )}
      </div>

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {(Object.keys(platformSpecs) as PlatformType[]).map((key) => (
          <button
            key={key}
            onClick={() => {
              playSound('click');
              setPlatform(key);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
              platform === key
                ? 'bg-cyan-500 text-slate-950 font-black border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-white/70 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
            }`}
          >
            <span>{platformSpecs[key].name}</span>
          </button>
        ))}
      </div>

      {/* Main Workspace: Left Upload & Controls, Right Live Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Upload Zone & Configuration */}
        <div className="lg:col-span-6 space-y-4">
          {/* Drag and Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              isDragging
                ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                : 'border-slate-300 dark:border-white/15 bg-white/50 dark:bg-white/[0.03] hover:border-cyan-500/50 hover:bg-cyan-500/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
            />
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-slate-800 dark:text-white">
                Drop your graphic or banner here
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                PNG, JPG, WebP or SVG • Tested 100% in-browser
              </p>
            </div>
            <span className="px-3.5 py-1 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white">
              Browse Local File
            </span>
          </div>

          {/* Preset Sample Images */}
          <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider block mb-2">
              Or Test Instant Sample Mockup:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {samplePresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => selectPreset(p.src)}
                  className="p-2.5 rounded-xl text-xs font-bold text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-cyan-400 text-slate-700 dark:text-white transition-all cursor-pointer"
                >
                  <span className="block truncate">{p.label}</span>
                  <span className="text-[10px] text-cyan-500 font-mono">Load Mockup</span>
                </button>
              ))}
            </div>
          </div>

          {/* Overlay Customization Controls */}
          <div className="p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Viewport Overlay Options</span>
              </span>
              <span className="text-xs font-mono text-cyan-400">{overlayOpacity}% Opacity</span>
            </div>

            {/* Opacity Range Slider */}
            <div>
              <input
                type="range"
                min={20}
                max={95}
                step={5}
                value={overlayOpacity}
                onChange={(e) => {
                  playSound('sliderTick');
                  setOverlayOpacity(parseInt(e.target.value));
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => {
                  playSound('click');
                  setShowUiChrome(!showUiChrome);
                }}
                className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  showUiChrome
                    ? 'bg-cyan-500/15 border-cyan-400 text-cyan-600 dark:text-cyan-300'
                    : 'bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                UI Controls {showUiChrome ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setShowDangerZones(!showDangerZones);
                }}
                className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  showDangerZones
                    ? 'bg-rose-500/15 border-rose-400 text-rose-600 dark:text-rose-300'
                    : 'bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                Danger Zones {showDangerZones ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={() => {
                  playSound('click');
                  setShowGrid(!showGrid);
                }}
                className={`p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  showGrid
                    ? 'bg-purple-500/15 border-purple-400 text-purple-600 dark:text-purple-300'
                    : 'bg-white/40 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
                }`}
              >
                Rule of 3rds {showGrid ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Assessment Checklist Card */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-300 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Safe-Zone Assessment Metric: {platformSpecs[platform].name}</span>
            </div>
            <p className="text-slate-600 dark:text-white/70 leading-relaxed">
              <strong>Obstructed Areas:</strong> {platformSpecs[platform].dangerNote}. Keep headlines, promotional coupon codes, and call-to-action buttons strictly inside the center safe perimeter.
            </p>
          </div>
        </div>

        {/* Right Column: Live Mobile Viewport Frame */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-xs font-bold text-slate-500 dark:text-white/60 mb-2 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Mobile Preview Screen</span>
          </div>

          {/* Phone Frame Device Mockup */}
          <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-[42px] border-4 border-slate-700 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
            {/* Top Phone Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-800 rounded-full z-40 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700 mr-2" />
              <div className="w-10 h-1.5 rounded-full bg-slate-900" />
            </div>

            {/* Uploaded or default graphic canvas */}
            <div className="relative w-full h-full overflow-hidden bg-slate-900 flex items-center justify-center">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Safe zone preview"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              ) : (
                <div className="text-center p-6 text-slate-400 space-y-2">
                  <Smartphone className="w-10 h-10 mx-auto text-cyan-500 opacity-60 animate-bounce" />
                  <p className="text-xs font-bold text-white">No Image Loaded</p>
                  <p className="text-[11px] text-slate-400">Drop an image or click a sample preset on the left</p>
                </div>
              )}

              {/* Rule of Thirds Grid */}
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-20 border border-purple-400/40">
                  <div className="border-r border-b border-purple-400/30" />
                  <div className="border-r border-b border-purple-400/30" />
                  <div className="border-b border-purple-400/30" />
                  <div className="border-r border-b border-purple-400/30" />
                  <div className="border-r border-b border-purple-400/30" />
                  <div className="border-b border-purple-400/30" />
                  <div className="border-r border-purple-400/30" />
                  <div className="border-r border-purple-400/30" />
                  <div />
                </div>
              )}

              {/* Danger Zone Shading Layer */}
              {showDangerZones && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  {/* Top Danger Bar */}
                  <div className="absolute top-0 inset-x-0 h-[14%] bg-rose-500/30 border-b-2 border-dashed border-rose-500 flex items-center justify-center text-[10px] font-black text-rose-200 tracking-wider">
                    ⚠️ TOP CUT-OFF (NOTCH / TABS)
                  </div>

                  {/* Right Action Rail Danger Zone (for Reels/TikTok/Shorts) */}
                  {(platform === 'tiktok' || platform === 'reels' || platform === 'shorts') && (
                    <div className="absolute top-[14%] right-0 bottom-[22%] w-[22%] bg-rose-500/25 border-l-2 border-dashed border-rose-500 flex items-center justify-center p-1 text-center">
                      <span className="text-[9px] font-black text-rose-200 [writing-mode:vertical-rl]">
                        ⚠️ ICONS DANGER ZONE
                      </span>
                    </div>
                  )}

                  {/* Bottom Danger Bar */}
                  <div className="absolute bottom-0 inset-x-0 h-[22%] bg-rose-500/30 border-t-2 border-dashed border-rose-500 flex items-center justify-center text-[10px] font-black text-rose-200 tracking-wider">
                    ⚠️ CAPTIONS & AUDIO MARQUEE
                  </div>

                  {/* Center Safe Zone Outline */}
                  <div className="absolute top-[14%] left-[4%] right-[22%] bottom-[22%] border-2 border-emerald-400 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs">
                      ✓ 100% Safe Zone
                    </span>
                  </div>
                </div>
              )}

              {/* Realistic Platform UI Chrome Overlay */}
              {showUiChrome && (
                <div 
                  className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 text-white"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  {/* Top Header UI */}
                  <div className="pt-4 flex items-center justify-between text-xs font-bold drop-shadow-md">
                    <span className="opacity-80">Following</span>
                    <span className="font-extrabold border-b-2 border-white pb-0.5">For You</span>
                    <span className="w-5 h-5 flex items-center justify-center">🔍</span>
                  </div>

                  {/* Right Sidebar Icons (TikTok / Reels style) */}
                  <div className="self-end space-y-4 flex flex-col items-center mb-16 mr-1 drop-shadow-lg">
                    {/* Avatar */}
                    <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-cyan-400 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs">
                        👤
                      </div>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                        <Plus className="w-2.5 h-2.5" />
                      </div>
                    </div>

                    {/* Like */}
                    <div className="flex flex-col items-center text-center">
                      <Heart className="w-7 h-7 text-white fill-white/80" />
                      <span className="text-[10px] font-bold">128K</span>
                    </div>

                    {/* Comment */}
                    <div className="flex flex-col items-center text-center">
                      <MessageCircle className="w-7 h-7 text-white fill-white/80" />
                      <span className="text-[10px] font-bold">1,420</span>
                    </div>

                    {/* Bookmark */}
                    <div className="flex flex-col items-center text-center">
                      <Bookmark className="w-6 h-6 text-white fill-white/80" />
                      <span className="text-[10px] font-bold">8.9K</span>
                    </div>

                    {/* Share */}
                    <div className="flex flex-col items-center text-center">
                      <Share2 className="w-6 h-6 text-white fill-white/80" />
                      <span className="text-[10px] font-bold">Share</span>
                    </div>

                    {/* Spinning Audio Vinyl */}
                    <div className="w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 flex items-center justify-center animate-spin">
                      <Music className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>

                  {/* Bottom Captions & Marquee */}
                  <div className="space-y-1.5 text-xs drop-shadow-md pb-2 max-w-[75%]">
                    <p className="font-extrabold text-sm">@creator_brand</p>
                    <p className="text-[11px] text-white/90 line-clamp-2">
                      Stop building landing pages without checking your safe zones! 🚀 #creator #saas #tools
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] opacity-80">
                      <Music className="w-3 h-3" />
                      <span className="truncate">Original Sound - Trending Audio Engine</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40" />
          </div>
        </div>
      </div>
    </div>
  );
};
