import React, { useState, useMemo } from 'react';
import { 
  Scissors, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Zap, 
  RotateCcw, 
  Sliders, 
  Code2, 
  Percent, 
  FileCheck,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalCssMinifierOptimizerProps {
  onBackToGrid?: () => void;
}

const SAMPLE_CSS = `/* ==========================================================================
   Modern Frosted Glass Card & Micro-Interaction Styling
   Version: 3.4.0 (Production Candidate)
   ========================================================================== */

:root {
  --primary-accent: #06b6d4;
  --secondary-accent: #8b5cf6;
  --glass-surface: rgba(255, 255, 255, 0.08);
  --border-subtle: rgba(255, 255, 255, 0.12);
  --card-radius: 24px;
}

.glass-dashboard-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  background-color: var(--glass-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--card-radius);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
  margin: 0px 0px 24px 0px;
}

.glass-dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 20px 40px rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.4);
}

/* Keyframe Pulsing Radar Glow Animation */
@keyframes radarPulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

@media (max-width: 768px) {
  .glass-dashboard-card {
    padding: 20px 16px;
    border-radius: 16px;
    margin: 0px 0px 16px 0px;
  }
}`;

export const UniversalCssMinifierOptimizer: React.FC<UniversalCssMinifierOptimizerProps> = ({ onBackToGrid }) => {
  const [rawCss, setRawCss] = useState<string>(SAMPLE_CSS);
  const [stripComments, setStripComments] = useState<boolean>(true);
  const [normalizeZeroes, setNormalizeZeroes] = useState<boolean>(true);
  const [removeLastSemicolon, setRemoveLastSemicolon] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Core regex minification pipeline
  const minificationResult = useMemo(() => {
    if (!rawCss.trim()) {
      return {
        minified: '',
        originalBytes: 0,
        minifiedBytes: 0,
        savedBytes: 0,
        percentageSaved: '0.0',
        rulesCount: 0
      };
    }

    let css = rawCss;

    // 1. Strip CSS comments (/* ... */)
    if (stripComments) {
      css = css.replace(/\/\*[\s\S]*?\*\//g, '');
    }

    // 2. Normalize zero units (e.g., 0px, 0em, 0rem, 0% -> 0)
    if (normalizeZeroes) {
      css = css.replace(/(?<=[:\s])0(?:px|em|rem|%|pt|in|cm|mm|pc|vh|vw|vmin|vmax)/gi, '0');
    }

    // 3. Remove newlines, carriage returns, tabs
    css = css.replace(/[\r\n\t]+/g, ' ');

    // 4. Collapse multiple spaces
    css = css.replace(/\s{2,}/g, ' ');

    // 5. Remove whitespace around operators, braces, colons, semicolons, commas
    css = css.replace(/\s*([\{\}\:\;\,\>\+\~])\s*/g, '$1');

    // 6. Fix spaces needed inside calc(), var(), or media queries
    // Restore space for media query features like `and (`
    css = css.replace(/and\(/g, 'and (');

    // 7. Remove trailing semicolon before closing brace if requested
    if (removeLastSemicolon) {
      css = css.replace(/;\}/g, '}');
    }

    // Trim remaining leading/trailing whitespace
    css = css.trim();

    // Telemetry metrics
    const originalBytes = new Blob([rawCss]).size;
    const minifiedBytes = new Blob([css]).size;
    const savedBytes = Math.max(0, originalBytes - minifiedBytes);
    const percentageSaved = originalBytes > 0 ? ((savedBytes / originalBytes) * 100).toFixed(1) : '0.0';
    const rulesCount = (css.match(/\{/g) || []).length;

    return {
      minified: css,
      originalBytes,
      minifiedBytes,
      savedBytes,
      percentageSaved,
      rulesCount
    };
  }, [rawCss, stripComments, normalizeZeroes, removeLastSemicolon]);

  // Copy handler
  const handleCopy = async () => {
    if (!minificationResult.minified) return;
    playSound('calcChime');
    try {
      await navigator.clipboard.writeText(minificationResult.minified);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = minificationResult.minified;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    playSound('tap');
    const blob = new Blob([minificationResult.minified], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `style.min_${Date.now()}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleBeautify = () => {
    playSound('tap');
    try {
      // Clean and indent CSS
      let b = minificationResult.minified;
      b = b.replace(/\{/g, ' {\n  ');
      b = b.replace(/\}/g, '\n}\n\n');
      b = b.replace(/;/g, ';\n  ');
      b = b.replace(/\n\s+\n/g, '\n');
      b = b.trim();
      setRawCss(b);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-white/90" id="css-minifier-optimizer-tool">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>CSS Minifier & Code Optimization Dashboard</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-600 dark:text-blue-300">
                Web Performance
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Strip unnecessary whitespace, comments, and carriage return symbols instantly for maximum throughput
            </p>
          </div>
        </div>

        {/* Action presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              setRawCss(SAMPLE_CSS);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            Reset Demo CSS
          </button>
        </div>
      </div>

      {/* Performance Optimization Dashboard Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Metric 1: Original Size */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-white/50 tracking-wider block mb-1">
            Original Size
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-mono">
            {(minificationResult.originalBytes / 1024).toFixed(2)} KB
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {minificationResult.originalBytes.toLocaleString()} bytes
          </span>
        </div>

        {/* Metric 2: Minified Size */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-blue-600 dark:text-blue-400 tracking-wider block mb-1">
            Minified Size
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {(minificationResult.minifiedBytes / 1024).toFixed(2)} KB
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {minificationResult.minifiedBytes.toLocaleString()} bytes
          </span>
        </div>

        {/* Metric 3: Compression Reduction Percentage */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-center shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-emerald-700 dark:text-emerald-300 tracking-wider block mb-1 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-emerald-500" />
            <span>File Reduction</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            -{minificationResult.percentageSaved}%
          </div>
          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80 font-mono">
            {minificationResult.savedBytes.toLocaleString()} bytes saved
          </span>
        </div>

        {/* Metric 4: Total Rules Count */}
        <div className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[10px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider block mb-1">
            Rules Parsed
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-mono">
            {minificationResult.rulesCount}
          </div>
          <span className="text-[10px] text-slate-400">
            CSS Rule blocks
          </span>
        </div>

      </div>

      {/* Regex Optimization Toggles Ribbon */}
      <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-bold text-slate-600 dark:text-white/70">Optimization Passes:</span>
          
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={stripComments}
              onChange={(e) => {
                setStripComments(e.target.checked);
                playSound('tap');
              }}
              className="accent-blue-600 rounded cursor-pointer"
            />
            <span className="font-semibold text-slate-700 dark:text-white/80">Strip Comments</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={normalizeZeroes}
              onChange={(e) => {
                setNormalizeZeroes(e.target.checked);
                playSound('tap');
              }}
              className="accent-blue-600 rounded cursor-pointer"
            />
            <span className="font-semibold text-slate-700 dark:text-white/80">Normalize Zero Units (0px → 0)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={removeLastSemicolon}
              onChange={(e) => {
                setRemoveLastSemicolon(e.target.checked);
                playSound('tap');
              }}
              className="accent-blue-600 rounded cursor-pointer"
            />
            <span className="font-semibold text-slate-700 dark:text-white/80">Strip Trailing Semicolons (;)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBeautify}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
          >
            Beautify / Expand
          </button>
        </div>
      </div>

      {/* Two Column Layout (Input vs Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left: Input Textarea */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="raw-css-input" className="flex items-center gap-1.5">
              <span>Standard Formatted Stylesheet</span>
              <span className="text-slate-400 font-mono">({rawCss.length} chars)</span>
            </label>
            <button
              onClick={() => {
                setRawCss('');
                playSound('reset');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-[11px]"
            >
              Clear Buffer
            </button>
          </div>

          <textarea
            id="raw-css-input"
            value={rawCss}
            onChange={(e) => setRawCss(e.target.value)}
            placeholder="Paste your unminified CSS rules here..."
            rows={14}
            className="w-full h-full min-h-[320px] p-3.5 rounded-2xl bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-y selection:bg-blue-500/30"
            spellCheck={false}
          />
        </div>

        {/* Right: Compressed Minified Single-Line Code Chunk */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <div className="flex items-center gap-1.5">
              <span>Compressed Minified CSS Output</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono">
                Single-Line Chunk
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                id="copy-minified-css-btn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Minified CSS!' : 'Copy Minified'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Download .min.css file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[320px] rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 shadow-inner overflow-hidden flex flex-col">
            
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                <span className="ml-1 text-slate-300">bundle.min.css</span>
              </span>
              <span className="text-emerald-400 font-bold">-{minificationResult.percentageSaved}% Reduction</span>
            </div>

            {/* Read-only Minified View */}
            <div className="flex-1 p-3.5 overflow-auto custom-scrollbar">
              <pre className="font-mono text-xs text-blue-300 whitespace-pre-wrap break-all select-all leading-relaxed">
                {minificationResult.minified || '/* Minified code will generate automatically */'}
              </pre>
            </div>

            {/* Footer with quick metrics */}
            <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>{minificationResult.minified.length} chars</span>
              <span>100% In-Browser String Replacement</span>
            </div>
          </div>
        </div>

      </div>

      {/* Back to All Tools Button if in standalone modal */}
      {onBackToGrid && (
        <div className="pt-2 flex justify-start">
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tools Hub</span>
          </button>
        </div>
      )}

    </div>
  );
};
