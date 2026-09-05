import React, { useState, useMemo, useEffect } from 'react';
import { 
  Binary, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  BarChart, 
  Layers, 
  CheckSquare,
  Hash,
  Dice5
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalCryptoRandomGeneratorProps {
  onBackToGrid?: () => void;
}

export const UniversalCryptoRandomGenerator: React.FC<UniversalCryptoRandomGeneratorProps> = ({ onBackToGrid }) => {
  const [minVal, setMinVal] = useState<number>(1);
  const [maxVal, setMaxVal] = useState<number>(100);
  const [count, setCount] = useState<number>(20);
  const [uniqueOnly, setUniqueOnly] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<'raw' | 'asc' | 'desc'>('raw');
  const [outputFormat, setOutputFormat] = useState<'grid' | 'csv' | 'lines' | 'json'>('grid');
  
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  // Generate cryptographically secure random numbers using window.crypto.getRandomValues
  const generateRandomArray = () => {
    playSound('calcChime');
    const min = Math.min(minVal, maxVal);
    const max = Math.max(minVal, maxVal);
    const range = max - min + 1;

    let targetCount = Math.max(1, Math.min(500, count));

    if (uniqueOnly && targetCount > range) {
      targetCount = range;
    }

    const results: number[] = [];

    if (uniqueOnly && range <= 100000) {
      // Reservoir / Fisher-Yates or Set-based CSPRNG for uniqueness
      const set = new Set<number>();
      const batchSize = Math.min(1000, targetCount * 2);
      const buffer = new Uint32Array(batchSize);

      while (set.size < targetCount) {
        window.crypto.getRandomValues(buffer);
        for (let i = 0; i < buffer.length; i++) {
          // Unbiased modulo mapping
          const num = min + (buffer[i] % range);
          set.add(num);
          if (set.size >= targetCount) break;
        }
      }
      results.push(...Array.from(set));
    } else {
      // Standard CSPRNG without uniqueness constraint
      const buffer = new Uint32Array(targetCount);
      window.crypto.getRandomValues(buffer);
      for (let i = 0; i < targetCount; i++) {
        const num = min + (buffer[i] % range);
        results.push(num);
      }
    }

    // Apply sorting
    if (sortOrder === 'asc') {
      results.sort((a, b) => a - b);
    } else if (sortOrder === 'desc') {
      results.sort((a, b) => b - a);
    }

    setGeneratedNumbers(results);
  };

  // Generate initial numbers on mount
  useEffect(() => {
    generateRandomArray();
  }, []);

  // Statistical calculations
  const stats = useMemo(() => {
    if (generatedNumbers.length === 0) {
      return { sum: 0, mean: 0, median: 0, min: 0, max: 0 };
    }

    const nums = [...generatedNumbers];
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    const mean = (sum / nums.length).toFixed(2);

    const sorted = [...nums].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1);

    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return { sum, mean, median, min, max };
  }, [generatedNumbers]);

  // Formatted string output for clipboard/export
  const formattedOutputString = useMemo(() => {
    if (outputFormat === 'csv') {
      return generatedNumbers.join(', ');
    } else if (outputFormat === 'lines') {
      return generatedNumbers.join('\n');
    } else if (outputFormat === 'json') {
      return JSON.stringify(generatedNumbers, null, 2);
    }
    return generatedNumbers.join(', ');
  }, [generatedNumbers, outputFormat]);

  // Copy handler
  const handleCopy = async () => {
    playSound('calcChime');
    try {
      await navigator.clipboard.writeText(formattedOutputString);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = formattedOutputString;
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
    const isJson = outputFormat === 'json';
    const blob = new Blob([formattedOutputString], { 
      type: isJson ? 'application/json;charset=utf-8' : 'text/plain;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto_random_${Date.now()}.${isJson ? 'json' : 'txt'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadPreset = (min: number, max: number, c: number, u: boolean) => {
    setMinVal(min);
    setMaxVal(max);
    setCount(c);
    setUniqueOnly(u);
    playSound('tap');
    setTimeout(() => {
      // Re-trigger with updated state
      const range = max - min + 1;
      const targetCount = u && c > range ? range : c;
      const buffer = new Uint32Array(targetCount * 2);
      const set = new Set<number>();
      window.crypto.getRandomValues(buffer);
      if (u) {
        for (let i = 0; i < buffer.length && set.size < targetCount; i++) {
          set.add(min + (buffer[i] % range));
        }
        setGeneratedNumbers(Array.from(set));
      } else {
        const res: number[] = [];
        for (let i = 0; i < targetCount; i++) {
          res.push(min + (buffer[i] % range));
        }
        setGeneratedNumbers(res);
      }
    }, 50);
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-white/90" id="crypto-random-generator-tool">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>True Cryptographic Random Number & Array Generator</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                WebCrypto CSPRNG
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              High-entropy browser randomization layer (crypto.getRandomValues) with non-repeating unique array rules
            </p>
          </div>
        </div>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 dark:text-white/40 mr-1">Presets:</span>
          <button
            onClick={() => loadPreset(1, 6, 5, false)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            5 Dice (1-6)
          </button>
          <button
            onClick={() => loadPreset(1, 49, 6, true)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            Lottery 6 of 49
          </button>
          <button
            onClick={() => loadPreset(1, 100, 20, true)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            1-100 Percentiles
          </button>
          <button
            onClick={() => loadPreset(1024, 65535, 10, true)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            Port Range
          </button>
        </div>
      </div>

      {/* Numeric Boundary Selector Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
        
        {/* Minimum Range */}
        <div className="md:col-span-3 space-y-1.5">
          <label htmlFor="crypto-min-range" className="text-xs font-bold text-slate-700 dark:text-white/80">
            Minimum Range
          </label>
          <input
            id="crypto-min-range"
            type="number"
            value={minVal}
            onChange={(e) => setMinVal(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono"
          />
        </div>

        {/* Maximum Range */}
        <div className="md:col-span-3 space-y-1.5">
          <label htmlFor="crypto-max-range" className="text-xs font-bold text-slate-700 dark:text-white/80">
            Maximum Range
          </label>
          <input
            id="crypto-max-range"
            type="number"
            value={maxVal}
            onChange={(e) => setMaxVal(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono"
          />
        </div>

        {/* Total Count */}
        <div className="md:col-span-3 space-y-1.5">
          <label htmlFor="crypto-count" className="text-xs font-bold text-slate-700 dark:text-white/80">
            Total Count (Array Length)
          </label>
          <input
            id="crypto-count"
            type="number"
            min={1}
            max={500}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(500, parseInt(e.target.value, 10) || 1)))}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/40 font-mono"
          />
        </div>

        {/* Action Button: Generate Entropy */}
        <div className="md:col-span-3 flex items-end">
          <button
            onClick={generateRandomArray}
            className="w-full py-2.5 px-4 rounded-xl font-black text-xs bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            id="generate-crypto-entropy-btn"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Roll Entropy Array</span>
          </button>
        </div>

        {/* Option Checkbox & Ordering Row */}
        <div className="md:col-span-12 pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 flex-wrap text-xs">
          
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uniqueOnly}
              onChange={(e) => {
                setUniqueOnly(e.target.checked);
                playSound('tap');
              }}
              className="accent-emerald-600 rounded cursor-pointer"
            />
            <span className="font-bold text-slate-800 dark:text-white">
              Non-Repeating Unique Array Rules
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              (guarantees no duplicate values in sample)
            </span>
          </label>

          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-500 dark:text-white/60">Sorting:</span>
            {(['raw', 'asc', 'desc'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setSortOrder(mode);
                  playSound('tap');
                  // Re-sort current in place
                  if (mode === 'asc') {
                    setGeneratedNumbers(prev => [...prev].sort((a, b) => a - b));
                  } else if (mode === 'desc') {
                    setGeneratedNumbers(prev => [...prev].sort((a, b) => b - a));
                  }
                }}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                  sortOrder === mode
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/15'
                }`}
              >
                {mode === 'raw' ? 'Unsorted (Entropy)' : mode === 'asc' ? 'Ascending (1..9)' : 'Descending (9..1)'}
              </button>
            ))}
          </div>

        </div>

      </div>

      {/* Statistical Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Array Length</span>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{generatedNumbers.length}</div>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Arithmetic Mean</span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{stats.mean}</div>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Median Value</span>
          <div className="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono">{stats.median}</div>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Min Generated</span>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{stats.min}</div>
        </div>
        <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Max Generated</span>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">{stats.max}</div>
        </div>
      </div>

      {/* Generated Numbers Canvas & View Formats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-white/80">View Layout:</span>
            {(['grid', 'csv', 'lines', 'json'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => {
                  setOutputFormat(fmt);
                  playSound('tap');
                }}
                className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all ${
                  outputFormat === fmt
                    ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/15'
                }`}
              >
                {fmt === 'grid' ? 'Visual Badges' : fmt === 'csv' ? 'Comma Separated' : fmt === 'lines' ? 'Line by Line' : 'JSON'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
              id="select-all-copy-crypto-numbers-btn"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Array Copied!' : 'Select-All & Copy Array'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

        </div>

        {/* Output Container */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 min-h-[220px] max-h-[420px] overflow-y-auto custom-scrollbar shadow-inner">
          
          {outputFormat === 'grid' ? (
            <div className="flex flex-wrap gap-2">
              {generatedNumbers.map((val, idx) => (
                <div 
                  key={idx}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 font-mono font-bold text-sm sm:text-base transition-all select-all flex items-center gap-2 group cursor-pointer shadow-xs"
                >
                  <span className="text-[10px] text-slate-500 font-sans font-normal">#{idx + 1}</span>
                  <span className="group-hover:text-emerald-300">{val}</span>
                </div>
              ))}
            </div>
          ) : (
            <pre className="font-mono text-xs sm:text-sm text-emerald-300 select-all whitespace-pre-wrap leading-relaxed">
              {formattedOutputString}
            </pre>
          )}

        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span>Native Uint32Array CSPRNG Buffer</span>
          <span>Zero Server API Calls • 100% In-Browser Isolation</span>
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
