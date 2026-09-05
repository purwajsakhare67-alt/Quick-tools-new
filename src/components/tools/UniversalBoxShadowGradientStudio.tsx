import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sliders, 
  Sparkles, 
  Sun, 
  Moon, 
  Grid, 
  RotateCw, 
  Layers,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalBoxShadowGradientStudioProps {
  onBackToGrid?: () => void;
}

interface PresetConfig {
  name: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  shadowColor: string;
  shadowOpacity: number;
  inset: boolean;
  gradientType: 'linear' | 'radial';
  gradientAngle: number;
  color1: string;
  color2: string;
  borderRadius: number;
}

const PRESETS: PresetConfig[] = [
  {
    name: 'Soft Modern Elevation',
    offsetX: 0,
    offsetY: 18,
    blur: 35,
    spread: -8,
    shadowColor: '#0f172a',
    shadowOpacity: 25,
    inset: false,
    gradientType: 'linear',
    gradientAngle: 135,
    color1: '#6366f1',
    color2: '#a855f7',
    borderRadius: 24
  },
  {
    name: 'Cyberpunk Neon Glow',
    offsetX: 0,
    offsetY: 0,
    blur: 40,
    spread: 8,
    shadowColor: '#ec4899',
    shadowOpacity: 65,
    inset: false,
    gradientType: 'linear',
    gradientAngle: 90,
    color1: '#ec4899',
    color2: '#8b5cf6',
    borderRadius: 20
  },
  {
    name: 'Sunset Horizon',
    offsetX: 6,
    offsetY: 14,
    blur: 28,
    spread: -4,
    shadowColor: '#ea580c',
    shadowOpacity: 35,
    inset: false,
    gradientType: 'linear',
    gradientAngle: 45,
    color1: '#f97316',
    color2: '#db2777',
    borderRadius: 28
  },
  {
    name: 'Emerald Deep Layer',
    offsetX: 0,
    offsetY: 20,
    blur: 45,
    spread: -5,
    shadowColor: '#059669',
    shadowOpacity: 40,
    inset: false,
    gradientType: 'linear',
    gradientAngle: 180,
    color1: '#10b981',
    color2: '#06b6d4',
    borderRadius: 24
  },
  {
    name: 'Subtle Inner Inset',
    offsetX: 2,
    offsetY: 4,
    blur: 16,
    spread: 2,
    shadowColor: '#000000',
    shadowOpacity: 30,
    inset: true,
    gradientType: 'linear',
    gradientAngle: 120,
    color1: '#334155',
    color2: '#1e293b',
    borderRadius: 20
  }
];

export const UniversalBoxShadowGradientStudio: React.FC<UniversalBoxShadowGradientStudioProps> = ({
  onBackToGrid
}) => {
  // Shadow state
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(18);
  const [blur, setBlur] = useState<number>(35);
  const [spread, setSpread] = useState<number>(-8);
  const [shadowColor, setShadowColor] = useState<string>('#0f172a');
  const [shadowOpacity, setShadowOpacity] = useState<number>(25);
  const [inset, setInset] = useState<boolean>(false);

  // Gradient state
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState<number>(135);
  const [color1, setColor1] = useState<string>('#6366f1');
  const [color2, setColor2] = useState<string>('#a855f7');
  const [borderRadius, setBorderRadius] = useState<number>(24);

  // Preview stage theme
  const [stageBg, setStageBg] = useState<'dark' | 'light' | 'checker'>('dark');
  const [copiedCss, setCopiedCss] = useState<boolean>(false);

  // Convert Hex + opacity into rgba string
  const rgbaShadow = useMemo(() => {
    let hex = shadowColor.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const a = (shadowOpacity / 100).toFixed(2);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }, [shadowColor, shadowOpacity]);

  // Pure standard CSS rules
  const cssStyles = useMemo(() => {
    const shadowRule = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${rgbaShadow}`;
    const backgroundRule =
      gradientType === 'linear'
        ? `linear-gradient(${gradientAngle}deg, ${color1}, ${color2})`
        : `radial-gradient(circle at center, ${color1}, ${color2})`;

    return {
      boxShadow: shadowRule,
      backgroundImage: backgroundRule,
      borderRadius: `${borderRadius}px`
    };
  }, [offsetX, offsetY, blur, spread, rgbaShadow, inset, gradientType, gradientAngle, color1, color2, borderRadius]);

  const rawCssCode = useMemo(() => {
    return `/* Pro Layouts & Interface Styling Engine */
box-shadow: ${cssStyles.boxShadow};
background: ${cssStyles.backgroundImage};
border-radius: ${cssStyles.borderRadius};
-webkit-box-shadow: ${cssStyles.boxShadow};`;
  }, [cssStyles]);

  const applyPreset = (p: PresetConfig) => {
    playSound('tap');
    setOffsetX(p.offsetX);
    setOffsetY(p.offsetY);
    setBlur(p.blur);
    setSpread(p.spread);
    setShadowColor(p.shadowColor);
    setShadowOpacity(p.shadowOpacity);
    setInset(p.inset);
    setGradientType(p.gradientType);
    setGradientAngle(p.gradientAngle);
    setColor1(p.color1);
    setColor2(p.color2);
    setBorderRadius(p.borderRadius);
  };

  const copyCss = () => {
    playSound('bell');
    navigator.clipboard.writeText(rawCssCode);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

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
            <span className="p-1.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400">
              <Palette className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Visual CSS Box-Shadow & Linear Gradient Studio
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500/20 text-pink-600 dark:text-pink-400">
              Designer Utility
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={copyCss}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md hover:shadow-pink-500/25 active:scale-95 transition-all cursor-pointer"
        >
          {copiedCss ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>CSS Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Standard CSS</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Swatches Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 shrink-0">Presets:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 text-xs font-bold text-slate-700 dark:text-white whitespace-nowrap transition-all"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Studio Grid: Controls & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Interactive Sliders & Color Configuration */}
        <div className="lg:col-span-6 space-y-4 p-5 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-500" />
              Shadow & Elevation Controls
            </span>
            <label className="flex items-center gap-1.5 text-xs font-bold cursor-pointer text-slate-700 dark:text-white">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => {
                  setInset(e.target.checked);
                  playSound('tap');
                }}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500"
              />
              <span>Inset Shadow</span>
            </label>
          </div>

          {/* Shadow X and Y Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Offset X</span>
                <span className="font-mono text-pink-500">{offsetX}px</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={offsetX}
                onChange={(e) => setOffsetX(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Offset Y</span>
                <span className="font-mono text-pink-500">{offsetY}px</span>
              </div>
              <input
                type="range"
                min={-50}
                max={50}
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Blur and Spread Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Blur Radius</span>
                <span className="font-mono text-pink-500">{blur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Spread Radius</span>
                <span className="font-mono text-pink-500">{spread}px</span>
              </div>
              <input
                type="range"
                min={-30}
                max={50}
                value={spread}
                onChange={(e) => setSpread(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Shadow Color & Opacity */}
          <div className="grid grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 dark:text-white/80 block">Shadow Tint:</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-slate-300 dark:border-white/10 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                  className="w-24 px-2 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold text-slate-800 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Shadow Opacity</span>
                <span className="font-mono text-pink-500">{shadowOpacity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={shadowOpacity}
                onChange={(e) => setShadowOpacity(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Gradient Controls Divider */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-white/80 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                Linear & Radial Gradient Studio
              </span>
              <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[11px] font-bold">
                <button
                  onClick={() => setGradientType('linear')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    gradientType === 'linear' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  Linear
                </button>
                <button
                  onClick={() => setGradientType('radial')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    gradientType === 'radial' ? 'bg-indigo-600 text-white' : 'text-slate-500'
                  }`}
                >
                  Radial
                </button>
              </div>
            </div>

            {/* Gradient Colors and Angle */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-white/80 block">Color 1:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 dark:text-white/80 block">Color 2:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-20 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {gradientType === 'linear' && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                  <span>Gradient Angle</span>
                  <span className="font-mono text-indigo-500">{gradientAngle}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={gradientAngle}
                  onChange={(e) => setGradientAngle(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            )}

            {/* Border Radius */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Corner Radius</span>
                <span className="font-mono text-indigo-500">{borderRadius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Visual Center Canvas & Raw Code */}
        <div className="lg:col-span-6 space-y-4">
          {/* Visual Presentation Canvas */}
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-pink-500" />
                Live Center Canvas Preview
              </span>
              {/* Background stage toggles */}
              <div className="flex items-center p-0.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                <button
                  onClick={() => setStageBg('dark')}
                  className={`p-1 rounded ${stageBg === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
                  title="Dark Stage"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setStageBg('light')}
                  className={`p-1 rounded ${stageBg === 'light' ? 'bg-slate-200 text-slate-900' : 'text-slate-400'}`}
                  title="Light Stage"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setStageBg('checker')}
                  className={`p-1 rounded ${stageBg === 'checker' ? 'bg-slate-300 text-slate-900' : 'text-slate-400'}`}
                  title="Grid Stage"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Box Container */}
            <div
              className={`w-full h-72 rounded-2xl flex items-center justify-center p-6 transition-all duration-300 ${
                stageBg === 'dark'
                  ? 'bg-slate-950'
                  : stageBg === 'light'
                  ? 'bg-slate-100'
                  : 'bg-[radial-gradient(#94a3b8_1px,transparent_1px)] bg-[size:16px_16px] bg-white'
              }`}
            >
              {/* Stylized Object Box */}
              <div
                style={{
                  boxShadow: cssStyles.boxShadow,
                  backgroundImage: cssStyles.backgroundImage,
                  borderRadius: cssStyles.borderRadius,
                  width: '210px',
                  height: '160px'
                }}
                className="flex flex-col items-center justify-center text-white text-center p-4 transition-all duration-200 cursor-pointer select-none"
              >
                <span className="text-xs font-black tracking-wide drop-shadow-md">Pro Styling Engine</span>
                <span className="text-[10px] opacity-80 mt-1 font-mono">{borderRadius}px radius</span>
              </div>
            </div>
          </div>

          {/* Raw CSS Code Output Module */}
          <div className="relative group">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-pink-500" />
                Standard CSS Output
              </span>
            </div>
            <pre className="w-full p-4 rounded-2xl bg-slate-950 text-pink-300 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed shadow-lg">
              {rawCssCode}
            </pre>
            <button
              onClick={copyCss}
              className="absolute top-8 right-3 px-2.5 py-1 rounded-lg bg-pink-600/90 hover:bg-pink-600 text-white text-[11px] font-bold shadow-md backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              {copiedCss ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCss ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
