import React, { useState, useMemo } from 'react';
import { 
  Palette, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sliders, 
  Sparkles, 
  Eye, 
  CheckCircle2, 
  Layers, 
  RefreshCw,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHexRgbConverterProps {
  onBackToGrid?: () => void;
}

const COLOR_PRESETS = [
  { name: 'Cyber Cyan', hex: '#06B6D4' },
  { name: 'Electric Violet', hex: '#8B5CF6' },
  { name: 'Emerald Glow', hex: '#10B981' },
  { name: 'Neon Amber', hex: '#F59E0B' },
  { name: 'Crimson Pulse', hex: '#EF4444' },
  { name: 'Midnight Navy', hex: '#0F172A' },
  { name: 'Champagne Gold', hex: '#D97706' },
  { name: 'Blush Rose', hex: '#EC4899' },
];

export const UniversalHexRgbConverter: React.FC<UniversalHexRgbConverterProps> = ({ onBackToGrid }) => {
  const [hexInput, setHexInput] = useState<string>('#06B6D4');
  const [alpha, setAlpha] = useState<number>(1.0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Bitwise HEX parsing & conversions
  const colorData = useMemo(() => {
    let cleanHex = hexInput.trim().replace(/^#/, '');

    // Expand 3-digit hex to 6-digit
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }

    // Check if 8-digit hex (contains alpha)
    let parsedAlpha = alpha;
    if (cleanHex.length === 8) {
      const alphaHex = cleanHex.slice(6, 8);
      cleanHex = cleanHex.slice(0, 6);
      const alphaInt = parseInt(alphaHex, 16);
      if (!isNaN(alphaInt)) {
        parsedAlpha = Number((alphaInt / 255).toFixed(2));
      }
    }

    // Validate 6-digit hex
    const isValid = /^[0-9A-Fa-f]{6}$/.test(cleanHex);

    if (!isValid) {
      return {
        isValid: false,
        hex: hexInput,
        r: 0,
        g: 0,
        b: 0,
        alpha: alpha,
        rgbStr: '',
        rgbaStr: '',
        hslStr: '',
        hslaStr: '',
        cmykStr: '',
        isLight: false,
        contrastTextColor: '#FFFFFF',
        cssSnippet: '',
      };
    }

    // Native bitwise operations:
    const num = parseInt(cleanHex, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    // Relative luminance for contrast ratio
    // Standard sRGB coefficients: 0.299*R + 0.587*G + 0.114*B
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const isLight = luminance > 0.55;
    const contrastTextColor = isLight ? '#0F172A' : '#FFFFFF';

    // Calculate HSL
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm:
          h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
          break;
        case gNorm:
          h = (bNorm - rNorm) / d + 2;
          break;
        case bNorm:
          h = (rNorm - gNorm) / d + 4;
          break;
      }
      h = Math.round(h * 60);
    }
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);

    // Calculate CMYK
    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    const c = k === 1 ? 0 : Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = k === 1 ? 0 : Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = k === 1 ? 0 : Math.round(((1 - bNorm - k) / (1 - k)) * 100);
    const kPct = Math.round(k * 100);

    const fullHex = `#${cleanHex.toUpperCase()}`;
    const rgbStr = `rgb(${r}, ${g}, ${b})`;
    const rgbaStr = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    const hslStr = `hsl(${h}, ${sPct}%, ${lPct}%)`;
    const hslaStr = `hsla(${h}, ${sPct}%, ${lPct}%, ${alpha.toFixed(2)})`;
    const cmykStr = `cmyk(${c}%, ${m}%, ${y}%, ${kPct}%)`;

    // Harmonious shades & tints generator
    const tintsShades = [-40, -25, -15, 0, 15, 25, 40].map(delta => {
      const adjust = (val: number) => Math.max(0, Math.min(255, Math.round(val + delta * 2.55)));
      const tr = adjust(r);
      const tg = adjust(g);
      const tb = adjust(b);
      const tHex = `#${((1 << 24) + (tr << 16) + (tg << 8) + tb).toString(16).slice(1).toUpperCase()}`;
      return { delta, hex: tHex, rgb: `rgb(${tr}, ${tg}, ${tb})` };
    });

    // Complementary & Analogous hues
    const compH = (h + 180) % 360;
    const anal1H = (h + 30) % 360;
    const anal2H = (h + 330) % 360;
    const tri1H = (h + 120) % 360;
    const tri2H = (h + 240) % 360;

    const harmonies = [
      { type: 'Primary Base', hsl: `hsl(${h}, ${sPct}%, ${lPct}%)`, name: 'Base' },
      { type: 'Complementary', hsl: `hsl(${compH}, ${sPct}%, ${lPct}%)`, name: '+180°' },
      { type: 'Analogous Left', hsl: `hsl(${anal1H}, ${sPct}%, ${lPct}%)`, name: '+30°' },
      { type: 'Analogous Right', hsl: `hsl(${anal2H}, ${sPct}%, ${lPct}%)`, name: '-30°' },
      { type: 'Triadic 1', hsl: `hsl(${tri1H}, ${sPct}%, ${lPct}%)`, name: '+120°' },
      { type: 'Triadic 2', hsl: `hsl(${tri2H}, ${sPct}%, ${lPct}%)`, name: '+240°' },
    ];

    return {
      isValid: true,
      hex: fullHex,
      cleanHex,
      r,
      g,
      b,
      alpha,
      rgbStr,
      rgbaStr,
      hslStr,
      hslaStr,
      cmykStr,
      isLight,
      contrastTextColor,
      tintsShades,
      harmonies,
      cssSnippet: `--custom-color: ${rgbaStr};\nbackground-color: var(--custom-color);\nborder-color: ${fullHex};\nbox-shadow: 0 10px 25px -5px ${rgbaStr};`,
    };
  }, [hexInput, alpha]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    playSound('soft');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRandomColor = () => {
    const randomInt = Math.floor(Math.random() * 16777215);
    const newHex = '#' + randomInt.toString(16).padStart(6, '0').toUpperCase();
    setHexInput(newHex);
    playSound('click');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
              title="Return to Grid"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              Interactive HEX to RGB/RGBA Color Grid
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                Bitwise Parser
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Native client-side bitwise color channel decoding with live CSS code generation
            </p>
          </div>
        </div>

        <button
          onClick={handleRandomColor}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-pink-500" />
          <span>Random Color</span>
        </button>
      </div>

      {/* Quick Color Swatches Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 dark:text-white/40 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Presets:
        </span>
        {COLOR_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setHexInput(preset.hex);
              playSound('click');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/5 transition-all cursor-pointer shrink-0"
          >
            <span
              className="w-3 h-3 rounded-full border border-black/10 shadow-xs"
              style={{ backgroundColor: preset.hex }}
            />
            <span className="text-slate-700 dark:text-white/80">{preset.name}</span>
          </button>
        ))}
      </div>

      {/* Main Grid: Controls & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-pink-500" /> Color Input Controls
            </h3>

            {/* HEX Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-white/90 flex items-center justify-between">
                <span>HEX Color Code</span>
                <span className="text-[11px] font-mono text-slate-400">#RGB, #RRGGBB, #RRGGBBAA</span>
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={hexInput}
                  onChange={(e) => setHexInput(e.target.value)}
                  placeholder="#06B6D4"
                  maxLength={9}
                  className="w-full pl-11 pr-12 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-mono font-bold text-base outline-none focus:ring-2 focus:ring-pink-500/30 uppercase tracking-wider"
                />
                <div className="absolute left-3 w-5 h-5 rounded-lg border border-black/20 shadow-xs overflow-hidden">
                  <input
                    type="color"
                    value={colorData.isValid ? colorData.hex : '#06B6D4'}
                    onChange={(e) => setHexInput(e.target.value.toUpperCase())}
                    className="w-8 h-8 -top-1.5 -left-1.5 absolute cursor-pointer opacity-0"
                  />
                  <div
                    className="w-full h-full"
                    style={{ backgroundColor: colorData.isValid ? colorData.hex : '#94A3B8' }}
                  />
                </div>
                {colorData.isValid && (
                  <span className="absolute right-3 text-emerald-500 text-xs font-bold">
                    <Check className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Alpha Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-700 dark:text-white/90">Alpha Opacity Channel</span>
                <span className="font-mono text-pink-600 dark:text-pink-400">
                  {alpha.toFixed(2)} ({Math.round(alpha * 100)}%)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={alpha}
                onChange={(e) => setAlpha(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0.0 (Transparent)</span>
                <span>0.5 (Half)</span>
                <span>1.0 (Opaque)</span>
              </div>
            </div>

            {/* Bitwise Channel Breakdown */}
            {colorData.isValid && (
              <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 dark:text-white/40 block uppercase tracking-wider">
                  Native Bitwise Registers (8-bit Channels)
                </span>
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20">
                    <span className="text-[10px] font-bold text-red-500 block">RED (&gt;&gt; 16)</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{colorData.r}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-[10px] font-bold text-emerald-500 block">GREEN (&gt;&gt; 8)</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{colorData.g}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <span className="text-[10px] font-bold text-blue-500 block">BLUE (&amp; 255)</span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">{colorData.b}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Showcase & Copy Modules (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Visual Showcase Box */}
          <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-pink-500" /> Live Preview Layout Box
            </h3>

            {/* Checkered Canvas Container */}
            <div
              className="w-full h-44 sm:h-48 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-inner transition-all border border-black/10"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                  linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                  linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
                `,
                backgroundSize: '20px 20px',
                backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
              }}
            >
              {/* Color Layer with Opacity */}
              <div
                className="absolute inset-0 transition-colors duration-200"
                style={{
                  backgroundColor: colorData.isValid ? colorData.hex : '#94A3B8',
                  opacity: colorData.isValid ? colorData.alpha : 1
                }}
              />

              {/* Text Card with Calculated Contrast */}
              <div
                className="relative z-10 p-3.5 sm:p-4 rounded-xl backdrop-blur-xs shadow-lg transition-all max-w-sm"
                style={{
                  color: colorData.contrastTextColor,
                  backgroundColor: colorData.isLight ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.25)',
                }}
              >
                <p className="text-base sm:text-lg font-black tracking-tight drop-shadow-xs">
                  {colorData.isValid ? colorData.hex : 'Invalid Hex'}
                </p>
                <p className="text-xs font-mono opacity-90 mt-0.5">
                  {colorData.isValid ? colorData.rgbaStr : 'Please enter valid 3, 6, or 8 digit hex'}
                </p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/30 text-white">
                  Luminance: {colorData.isLight ? 'Light Surface' : 'Dark Surface'}
                </span>
              </div>
            </div>

            {/* Formatted Declarations Quick Copy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {[
                { label: 'HEX Color', val: colorData.hex, key: 'hex' },
                { label: 'RGB Declaration', val: colorData.rgbStr, key: 'rgb' },
                { label: 'RGBA Declaration', val: colorData.rgbaStr, key: 'rgba' },
                { label: 'HSL Value', val: colorData.hslStr, key: 'hsl' },
                { label: 'HSLA Value', val: colorData.hslaStr, key: 'hsla' },
                { label: 'CMYK Print Code', val: colorData.cmykStr, key: 'cmyk' },
              ].map((item) => (
                <button
                  key={item.key}
                  disabled={!colorData.isValid}
                  onClick={() => copyToClipboard(item.val, item.key)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/5 transition-all text-left flex items-center justify-between group cursor-pointer disabled:opacity-40"
                >
                  <div className="min-w-0 pr-2">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 block uppercase">
                      {item.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-800 dark:text-white truncate block">
                      {item.val || '—'}
                    </span>
                  </div>
                  <span className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-500 group-hover:text-pink-500 transition-colors shrink-0 shadow-xs">
                    {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </span>
                </button>
              ))}
            </div>

            {/* CSS Variables Snippet */}
            {colorData.isValid && (
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono relative overflow-hidden">
                <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[11px] text-slate-400">
                  <span>CSS Properties Snippet</span>
                  <button
                    onClick={() => copyToClipboard(colorData.cssSnippet, 'css')}
                    className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-bold cursor-pointer"
                  >
                    {copiedKey === 'css' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'css' ? 'Copied' : 'Copy CSS'}</span>
                  </button>
                </div>
                <pre className="pt-2 text-[11px] overflow-x-auto text-emerald-400 leading-relaxed">
                  {colorData.cssSnippet}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tints, Shades & Color Harmonies Grid */}
      {colorData.isValid && colorData.tintsShades && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-500" />
              Tonal Ladder (Tints to Shades) & Harmonies
            </h3>
            <span className="text-xs text-slate-400">Click any swatch to apply</span>
          </div>

          <div className="space-y-3">
            {/* Tints / Shades strip */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {colorData.tintsShades.map((swatch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setHexInput(swatch.hex);
                    playSound('click');
                  }}
                  className="group flex flex-col items-center p-2 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                  style={{ backgroundColor: swatch.hex }}
                >
                  <span className="text-[10px] font-mono font-bold px-1 rounded bg-black/40 text-white mt-8 group-hover:bg-black/70">
                    {swatch.hex}
                  </span>
                </button>
              ))}
            </div>

            {/* Harmonies */}
            {colorData.harmonies && (
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-100 dark:border-white/5">
                {colorData.harmonies.map((h, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200/60 dark:border-white/5 text-center flex flex-col items-center gap-1.5"
                  >
                    <div
                      className="w-10 h-10 rounded-full shadow-md border border-black/10"
                      style={{ backgroundColor: h.hsl }}
                    />
                    <span className="text-[11px] font-bold text-slate-700 dark:text-white/90 truncate max-w-full">
                      {h.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{h.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="p-3.5 rounded-xl bg-pink-500/5 dark:bg-pink-500/10 border border-pink-500/20 text-xs text-slate-600 dark:text-pink-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
        <p>
          <strong>Bitwise Parsing:</strong> Color channels are isolated through bit shifts: <code>(hex &gt;&gt; 16) &amp; 0xFF</code> extracts Red, <code>(hex &gt;&gt; 8) &amp; 0xFF</code> extracts Green, and <code>hex &amp; 0xFF</code> isolates Blue without string slicing.
        </p>
      </div>
    </div>
  );
};
