import React, { useState, useMemo, useEffect } from 'react';
import { 
  Shapes, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  ArrowLeft, 
  Shuffle, 
  Sliders, 
  Eye, 
  Code2, 
  Layers, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface SvgWaveBlobProps {
  onBackToGrid?: () => void;
}

export const UniversalSvgWaveBlob: React.FC<SvgWaveBlobProps> = ({ onBackToGrid }) => {
  const [mode, setMode] = useState<'wave' | 'blob'>('wave');
  
  // Wave Controls
  const [waveCount, setWaveCount] = useState<number>(3);
  const [amplitude, setAmplitude] = useState<number>(75);
  const [steepness, setSteepness] = useState<number>(50); // tension / curvature
  const [randomness, setRandomness] = useState<number>(30);
  const [layersCount, setLayersCount] = useState<number>(3);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(42);

  // Blob Controls
  const [blobPoints, setBlobPoints] = useState<number>(6);
  const [blobSpikiness, setBlobSpikiness] = useState<number>(35);
  const [blobSize, setBlobSize] = useState<number>(240);

  // Palette & Styling
  const [paletteIndex, setPaletteIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedCss, setCopiedCss] = useState<boolean>(false);

  const palettes = [
    { name: 'Cyber Violet', from: '#8b5cf6', to: '#ec4899', stops: ['#6366f1', '#8b5cf6', '#ec4899'] },
    { name: 'Ocean Cyan', from: '#06b6d4', to: '#3b82f6', stops: ['#0891b2', '#06b6d4', '#3b82f6'] },
    { name: 'Sunset Amber', from: '#f43f5e', to: '#f59e0b', stops: ['#e11d48', '#f43f5e', '#fbbf24'] },
    { name: 'Emerald Mint', from: '#10b981', to: '#06b6d4', stops: ['#059669', '#10b981', '#14b8a6'] },
    { name: 'Neon Acid', from: '#a855f7', to: '#84cc16', stops: ['#7c3aed', '#a855f7', '#84cc16'] }
  ];

  const currentPalette = palettes[paletteIndex];

  // Pseudo-random deterministic generator based on seed
  const pseudoRandom = (offset: number) => {
    const x = Math.sin(seed + offset) * 10000;
    return x - Math.floor(x);
  };

  // Generate Bezier Curves for SVG Waves
  const generateWavePath = (layerIndex: number, width = 1440, height = 360): string => {
    const layerOffset = layerIndex * 18;
    const effectiveAmp = Math.max(10, amplitude + (layerIndex * 15) - 20);
    const step = width / (waveCount * 2);
    const baseY = isFlipped ? effectiveAmp + 20 : height - effectiveAmp - 40;

    let path = `M 0,${baseY} `;

    for (let i = 0; i < waveCount * 2; i++) {
      const x1 = (i * step) + (step / 2);
      const randOffset1 = ((pseudoRandom(i + layerOffset) - 0.5) * (randomness / 100)) * effectiveAmp;
      const isUp = i % 2 === 0;
      const y1 = isUp 
        ? baseY - (effectiveAmp * (steepness / 50)) + randOffset1 
        : baseY + (effectiveAmp * (steepness / 50)) + randOffset1;

      const x2 = (i + 1) * step;
      const randOffset2 = ((pseudoRandom(i + layerOffset + 50) - 0.5) * (randomness / 100)) * effectiveAmp;
      const y2 = baseY + randOffset2;

      path += `Q ${x1.toFixed(1)},${y1.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)} `;
    }

    if (isFlipped) {
      path += `L ${width},0 L 0,0 Z`;
    } else {
      path += `L ${width},${height} L 0,${height} Z`;
    }

    return path;
  };

  // Generate Catmull-Rom or cubic Bezier polygon for smooth organic blob
  const generateBlobPath = (): string => {
    const center = 200;
    const baseRadius = blobSize / 2;
    const points: Array<{ x: number; y: number }> = [];

    const angleStep = (Math.PI * 2) / blobPoints;
    for (let i = 0; i < blobPoints; i++) {
      const angle = i * angleStep;
      const randFactor = 1 + ((pseudoRandom(i * 3 + seed) - 0.5) * 2 * (blobSpikiness / 100));
      const radius = baseRadius * randFactor;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      points.push({ x, y });
    }

    // Connect points using smooth cubic Bezier splines
    let path = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)} `;
    const len = points.length;

    for (let i = 0; i < len; i++) {
      const p0 = points[(i - 1 + len) % len];
      const p1 = points[i];
      const p2 = points[(i + 1) % len];
      const p3 = points[(i + 2) % len];

      // Catmull-Rom to Cubic Bezier conversion
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += `C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)} `;
    }

    path += 'Z';
    return path;
  };

  const wavePaths = useMemo(() => {
    const paths: string[] = [];
    for (let i = 0; i < layersCount; i++) {
      paths.push(generateWavePath(i));
    }
    return paths;
  }, [waveCount, amplitude, steepness, randomness, layersCount, isFlipped, seed]);

  const blobPath = useMemo(() => {
    return generateBlobPath();
  }, [blobPoints, blobSpikiness, blobSize, seed]);

  // Full SVG markup string
  const rawSvgCode = useMemo(() => {
    if (mode === 'wave') {
      const gradientStops = currentPalette.stops.map((stop, idx) => 
        `    <stop offset="${Math.round((idx / (currentPalette.stops.length - 1)) * 100)}%" stop-color="${stop}" />`
      ).join('\n');

      const pathElements = wavePaths.map((p, idx) => {
        const opacity = (0.35 + (idx * 0.25)).toFixed(2);
        return `  <path d="${p}" fill="url(#waveGradient)" opacity="${opacity}" />`;
      }).join('\n');

      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 360" width="100%" height="100%">
  <defs>
    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
${gradientStops}
    </linearGradient>
  </defs>
${pathElements}
</svg>`;
    } else {
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${currentPalette.from}" />
      <stop offset="100%" stop-color="${currentPalette.to}" />
    </linearGradient>
  </defs>
  <path d="${blobPath}" fill="url(#blobGradient)" />
</svg>`;
    }
  }, [mode, wavePaths, blobPath, currentPalette]);

  const handleCopySvg = () => {
    playSound('success');
    navigator.clipboard.writeText(rawSvgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCss = () => {
    playSound('success');
    const cleanSvg = rawSvgCode.replace(/"/g, "'").replace(/[\n\r\t]/g, ' ').replace(/\s+/g, ' ');
    const cssCode = `background-image: url("data:image/svg+xml,${encodeURIComponent(cleanSvg)}");\nbackground-size: cover;\nbackground-repeat: no-repeat;`;
    navigator.clipboard.writeText(cssCode);
    setCopiedCss(true);
    setTimeout(() => setCopiedCss(false), 2000);
  };

  const handleExportSvg = () => {
    playSound('click');
    const blob = new Blob([rawSvgCode], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'wave' ? 'svg-wave' : 'css-blob'}-${Date.now()}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRandomize = () => {
    playSound('sliderTick');
    setSeed(Math.floor(Math.random() * 10000));
  };

  return (
    <div className="space-y-6" id="svg-wave-blob-tool">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-purple-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-lg shrink-0">
            <Shapes className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                SVG Wave & CSS Blob Generator
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/30">
                Vector Canvas Math
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Dynamically compute cubic Bezier nodes with real-time morphing & clean SVG export
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

      {/* Mode Switcher */}
      <div className="flex items-center justify-between gap-3 p-1.5 rounded-2xl bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 max-w-sm">
        <button
          onClick={() => {
            playSound('click');
            setMode('wave');
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            mode === 'wave'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layered Waves</span>
        </button>
        <button
          onClick={() => {
            playSound('click');
            setMode('blob');
          }}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
            mode === 'blob'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
              : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shapes className="w-3.5 h-3.5" />
          <span>Organic Blob</span>
        </button>
      </div>

      {/* Live Interactive Visual Preview Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Real-Time Visual Viewport</span>
          </label>
          <button
            onClick={handleRandomize}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-all cursor-pointer"
            title="Randomize shape seed"
          >
            <Shuffle className="w-3 h-3 text-purple-400" />
            <span>Morph Seed #{seed}</span>
          </button>
        </div>

        <div className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden border border-slate-300 dark:border-white/15 bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center shadow-2xl">
          {/* Subtle grid backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Rendered SVG Preview */}
          <div className="w-full h-full flex items-center justify-center transition-all duration-300">
            {mode === 'wave' ? (
              <svg viewBox="0 0 1440 360" className="w-full h-full preserve-3d" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="liveWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    {currentPalette.stops.map((stop, i) => (
                      <stop 
                        key={i} 
                        offset={`${Math.round((i / (currentPalette.stops.length - 1)) * 100)}%`} 
                        stopColor={stop} 
                      />
                    ))}
                  </linearGradient>
                </defs>
                {wavePaths.map((p, idx) => (
                  <path 
                    key={idx} 
                    d={p} 
                    fill="url(#liveWaveGradient)" 
                    opacity={0.35 + (idx * 0.25)} 
                    className="transition-all duration-200 ease-out"
                  />
                ))}
              </svg>
            ) : (
              <svg viewBox="0 0 400 400" className="w-56 h-56 sm:w-64 sm:h-64 drop-shadow-2xl">
                <defs>
                  <linearGradient id="liveBlobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={currentPalette.from} />
                    <stop offset="100%" stopColor={currentPalette.to} />
                  </linearGradient>
                </defs>
                <path 
                  d={blobPath} 
                  fill="url(#liveBlobGradient)" 
                  className="transition-all duration-200 ease-out"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-pink-400" />
            <span>Mathematical Curve Parameters</span>
          </span>
          {/* Palette selector chips */}
          <div className="flex items-center gap-1.5">
            {palettes.map((p, i) => (
              <button
                key={p.name}
                onClick={() => {
                  playSound('click');
                  setPaletteIndex(i);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                  paletteIndex === i ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {mode === 'wave' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Wave Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Waves Frequency</span>
                <span className="font-mono text-purple-400">{waveCount} cycles</span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={1}
                value={waveCount}
                onChange={(e) => {
                  playSound('sliderTick');
                  setWaveCount(parseInt(e.target.value));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Amplitude */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Peak Amplitude</span>
                <span className="font-mono text-pink-400">{amplitude} px</span>
              </div>
              <input
                type="range"
                min={20}
                max={150}
                step={5}
                value={amplitude}
                onChange={(e) => {
                  playSound('sliderTick');
                  setAmplitude(parseInt(e.target.value));
                }}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Steepness / Tension */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Curvature Tension</span>
                <span className="font-mono text-cyan-400">{steepness}%</span>
              </div>
              <input
                type="range"
                min={15}
                max={90}
                step={5}
                value={steepness}
                onChange={(e) => {
                  playSound('sliderTick');
                  setSteepness(parseInt(e.target.value));
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Randomness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Organic Randomness</span>
                <span className="font-mono text-amber-400">{randomness}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={randomness}
                onChange={(e) => {
                  playSound('sliderTick');
                  setRandomness(parseInt(e.target.value));
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Layer Count */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Layer Stacks</span>
                <span className="font-mono text-emerald-400">{layersCount} layers</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                step={1}
                value={layersCount}
                onChange={(e) => {
                  playSound('sliderTick');
                  setLayersCount(parseInt(e.target.value));
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Invert Orientation */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-bold text-slate-700 dark:text-white/80">
                Invert Direction (Top/Bottom)
              </span>
              <button
                onClick={() => {
                  playSound('click');
                  setIsFlipped(!isFlipped);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isFlipped 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white'
                }`}
              >
                {isFlipped ? 'Top Anchor' : 'Bottom Anchor'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Blob Points */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Complexity Points</span>
                <span className="font-mono text-purple-400">{blobPoints} nodes</span>
              </div>
              <input
                type="range"
                min={4}
                max={10}
                step={1}
                value={blobPoints}
                onChange={(e) => {
                  playSound('sliderTick');
                  setBlobPoints(parseInt(e.target.value));
                }}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            {/* Blob Spikiness */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Organic Morphing / Spikiness</span>
                <span className="font-mono text-pink-400">{blobSpikiness}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={75}
                step={5}
                value={blobSpikiness}
                onChange={(e) => {
                  playSound('sliderTick');
                  setBlobSpikiness(parseInt(e.target.value));
                }}
                className="w-full accent-pink-500 cursor-pointer"
              />
            </div>

            {/* Blob Scale */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
                <span>Render Diameter</span>
                <span className="font-mono text-cyan-400">{blobSize} px</span>
              </div>
              <input
                type="range"
                min={160}
                max={320}
                step={10}
                value={blobSize}
                onChange={(e) => {
                  playSound('sliderTick');
                  setBlobSize(parseInt(e.target.value));
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Raw SVG & CSS Export Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Generated Vector Code Block
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCss}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              {copiedCss ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCss ? 'CSS Copied!' : 'Copy CSS'}</span>
            </button>

            <button
              onClick={handleCopySvg}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                copied 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white shadow-xs'
              }`}
              id="btn-copy-raw-svg"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'SVG Copied!' : 'Copy SVG'}</span>
            </button>

            <button
              onClick={handleExportSvg}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white shadow-md transition-all cursor-pointer"
              id="btn-export-svg-trigger"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export SVG File</span>
            </button>
          </div>
        </div>

        {/* Raw Code Block */}
        <div className="relative rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 p-4 font-mono text-xs overflow-x-auto max-h-48 shadow-inner">
          <pre className="whitespace-pre-wrap font-mono text-[11px] text-slate-300">
            {rawSvgCode}
          </pre>
        </div>
      </div>
    </div>
  );
};
