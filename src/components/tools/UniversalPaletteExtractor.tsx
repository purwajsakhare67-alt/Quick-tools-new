import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Copy, 
  Check, 
  Upload, 
  ArrowLeft, 
  Image as ImageIcon, 
  Sparkles, 
  Sliders, 
  Download,
  Code2,
  Layers,
  Cpu
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface PaletteExtractorProps {
  onBackToGrid?: () => void;
}

interface ExtractedColor {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
  luminance: number;
  frequencyPercent: number;
  name: string;
}

export const UniversalPaletteExtractor: React.FC<PaletteExtractorProps> = ({ onBackToGrid }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<ExtractedColor[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedRgb, setCopiedRgb] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preset sample inspiring images (Generated high-contrast SVGs as data URLs)
  const samplePresets = [
    {
      id: 'cyberpunk',
      name: 'Cyberpunk Neon City',
      src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="%237928ca"/>
            <stop offset="40%" stop-color="%23ff0080"/>
            <stop offset="70%" stop-color="%2300dfd8"/>
            <stop offset="100%" stop-color="%23ff4b4b"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="%230b0b14"/>
        <rect x="40" y="40" width="520" height="320" rx="28" fill="url(%23g1)"/>
        <circle cx="200" cy="200" r="90" fill="%23f59e0b"/>
        <circle cx="420" cy="160" r="70" fill="%2306b6d4"/>
      </svg>`
    },
    {
      id: 'sunset',
      name: 'Mediterranean Coast Sunset',
      src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="%23ea580c"/>
            <stop offset="35%" stop-color="%23f97316"/>
            <stop offset="65%" stop-color="%23facc15"/>
            <stop offset="100%" stop-color="%230284c7"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(%23g2)"/>
        <path d="M 0,260 Q 150,220 300,260 T 600,240 L 600,400 L 0,400 Z" fill="%230f172a"/>
        <circle cx="300" cy="180" r="55" fill="%23fef08a"/>
      </svg>`
    },
    {
      id: 'emerald',
      name: 'Nordic Forest & Aurora',
      src: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
        <defs>
          <linearGradient id="g3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="%23064e3b"/>
            <stop offset="50%" stop-color="%2310b981"/>
            <stop offset="85%" stop-color="%232dd4bf"/>
            <stop offset="100%" stop-color="%2338bdf8"/>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="%23022c22"/>
        <rect x="50" y="50" width="500" height="300" rx="30" fill="url(%23g3)"/>
        <circle cx="150" cy="150" r="60" fill="%23a7f3d0"/>
        <circle cx="450" cy="220" r="80" fill="%231e3a8a"/>
      </svg>`
    }
  ];

  // Mathematical Color Isolation via In-Memory HTML5 Canvas
  const extractTop5Colors = (imgElement: HTMLImageElement) => {
    setIsProcessing(true);

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Downscale to 100x100 for sub-millisecond calculation (10,000 pixels)
      const size = 100;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(imgElement, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size);
      const data = imageData.data;

      // Quantization buckets (step = 16 to group similar colors)
      const colorCounts: Record<string, { r: number; g: number; b: number; count: number }> = {};
      const totalPixels = size * size;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // Filter out transparent pixels
        if (a < 128) continue;

        // Group into 16-step quantization bins
        const quantR = Math.round(r / 16) * 16;
        const quantG = Math.round(g / 16) * 16;
        const quantB = Math.round(b / 16) * 16;
        const key = `${quantR},${quantG},${quantB}`;

        if (!colorCounts[key]) {
          colorCounts[key] = { r: quantR, g: quantG, b: quantB, count: 0 };
        }
        colorCounts[key].count++;
      }

      // Sort candidate colors by frequency
      const sortedCandidates = Object.values(colorCounts).sort((a, b) => b.count - a.count);

      // Euclidean distance in RGB color space
      const colorDistance = (c1: { r: number; g: number; b: number }, c2: { r: number; g: number; b: number }) => {
        return Math.sqrt(
          Math.pow(c1.r - c2.r, 2) +
          Math.pow(c1.g - c2.g, 2) +
          Math.pow(c1.b - c2.b, 2)
        );
      };

      // Select top 5 distinct colors with minimum distance separation (Delta E > 36)
      const top5: typeof sortedCandidates = [];
      const minDistance = 36;

      for (const candidate of sortedCandidates) {
        if (top5.length >= 5) break;

        const isDistinct = top5.every(selected => colorDistance(candidate, selected) > minDistance);
        if (isDistinct) {
          top5.push(candidate);
        }
      }

      // If less than 5 distinct colors found, backfill with next most frequent
      for (const candidate of sortedCandidates) {
        if (top5.length >= 5) break;
        if (!top5.includes(candidate)) {
          top5.push(candidate);
        }
      }

      // Convert to rich formatted objects
      const rgbToHex = (r: number, g: number, b: number) => {
        const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
      };

      const rgbToHsl = (r: number, g: number, b: number) => {
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
            case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
            case gNorm: h = (bNorm - rNorm) / d + 2; break;
            case bNorm: h = (rNorm - gNorm) / d + 4; break;
          }
          h /= 6;
        }

        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
      };

      const getColorName = (r: number, g: number, b: number) => {
        if (r > 200 && g > 200 && b > 200) return 'Near White';
        if (r < 40 && g < 40 && b < 40) return 'Deep Onyx';
        if (r > g && r > b) return r > 180 && g > 100 ? 'Sunset Amber' : 'Crimson Rose';
        if (g > r && g > b) return 'Emerald Jade';
        if (b > r && b > g) return b > 180 && r > 120 ? 'Violet Indigo' : 'Cyan Azure';
        return 'Harmonic Slate';
      };

      const parsed: ExtractedColor[] = top5.map((c) => {
        const hex = rgbToHex(c.r, c.g, c.b);
        const rgb = `rgb(${c.r}, ${c.g}, ${c.b})`;
        const hsl = rgbToHsl(c.r, c.g, c.b);
        const luminance = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
        const frequencyPercent = Math.round((c.count / totalPixels) * 100);
        const name = getColorName(c.r, c.g, c.b);

        return {
          hex,
          rgb,
          hsl,
          r: c.r,
          g: c.g,
          b: c.b,
          luminance,
          frequencyPercent,
          name
        };
      });

      setColors(parsed);
      playSound('success');
    } catch (err) {
      console.error('Palette extraction failed', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process image when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      extractTop5Colors(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Load default preset on initial mount
  useEffect(() => {
    if (!imageSrc) {
      setImageSrc(samplePresets[0].src);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    playSound('click');
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyHex = (hex: string) => {
    playSound('success');
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const handleCopyRgb = (rgb: string) => {
    playSound('success');
    navigator.clipboard.writeText(rgb);
    setCopiedRgb(rgb);
    setTimeout(() => setCopiedRgb(null), 1800);
  };

  const handleCopyAllCss = () => {
    if (colors.length === 0) return;
    playSound('success');
    const cssVars = `:root {\n` + colors.map((c, idx) => `  --color-${idx + 1}: ${c.hex}; /* ${c.name} */`).join('\n') + `\n}`;
    navigator.clipboard.writeText(cssVars);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6" id="image-palette-extractor-tool">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
            <Palette className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Image Color Palette Extractor
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                HTML5 Canvas Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Read pixel array coordinates and mathematically isolate the top 5 dominant HEX & RGB values
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

      {/* Input Selection & Preset Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Upload Drop Zone */}
        <div
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`md:col-span-7 border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-all cursor-pointer flex items-center justify-center gap-4 ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10'
              : 'border-slate-300 dark:border-white/15 bg-white/50 dark:bg-white/[0.03] hover:border-amber-400/50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
            }}
          />
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
              Drop any photo or UI screenshot
            </p>
            <p className="text-[11px] text-slate-400">
              Evaluated in memory • Zero server upload
            </p>
          </div>
          <span className="ml-auto px-3 py-1 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-white shrink-0">
            Browse
          </span>
        </div>

        {/* Sample Presets */}
        <div className="md:col-span-5 p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider">
            Or Test Sample Graphic:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {samplePresets.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  playSound('click');
                  setImageSrc(p.src);
                }}
                className="p-1.5 rounded-xl text-[11px] font-bold text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 hover:border-amber-400 text-slate-700 dark:text-white transition-all cursor-pointer truncate"
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Extracted 5 Visual Color Cards */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Isolated Dominant Palette (Top 5 Hexadecimal & RGB)
            </h4>
          </div>

          <button
            onClick={handleCopyAllCss}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-all cursor-pointer self-start sm:self-auto"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'CSS Variables Copied!' : 'Copy All CSS Variables'}</span>
          </button>
        </div>

        {/* 5 Distinct Color Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {colors.map((color, index) => (
            <div
              key={index}
              className="group relative rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-slate-900/80 overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col"
            >
              {/* Color Swatch Canvas */}
              <div 
                className="relative h-28 w-full transition-transform duration-300 group-hover:scale-105 flex items-end p-2.5"
                style={{ backgroundColor: color.hex }}
              >
                <span 
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md shadow-xs ${
                    color.luminance > 0.5 ? 'bg-black/40 text-white' : 'bg-white/40 text-black'
                  }`}
                >
                  Dominance #{index + 1}
                </span>
              </div>

              {/* Color Meta & Copy Controls */}
              <div className="p-3.5 flex flex-col justify-between flex-1 space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {color.hex}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {color.name}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 dark:text-white/60 mt-0.5">
                    {color.rgb}
                  </p>
                </div>

                {/* Individual Copy Buttons */}
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    onClick={() => handleCopyHex(color.hex)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      copiedHex === color.hex
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:border-amber-400'
                    }`}
                    title="Copy HEX string"
                  >
                    {copiedHex === color.hex ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-amber-500" />}
                    <span>HEX</span>
                  </button>

                  <button
                    onClick={() => handleCopyRgb(color.rgb)}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 border ${
                      copiedRgb === color.rgb
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-white hover:border-amber-400'
                    }`}
                    title="Copy RGB string"
                  >
                    {copiedRgb === color.rgb ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-rose-500" />}
                    <span>RGB</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
