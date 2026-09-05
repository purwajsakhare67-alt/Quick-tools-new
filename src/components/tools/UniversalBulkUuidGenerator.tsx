import React, { useState, useMemo, useEffect } from 'react';
import { 
  Key, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalBulkUuidGeneratorProps {
  onBackToGrid?: () => void;
}

// Robust RFC4122 v4 Generator with crypto fallback
const generateSingleUuid = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback to crypto.getRandomValues
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    // Set version to 0100 (v4)
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // Set variant to 10xx (RFC4122)
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  // Ultimate Math.random fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const UniversalBulkUuidGenerator: React.FC<UniversalBulkUuidGeneratorProps> = ({ onBackToGrid }) => {
  const [count, setCount] = useState<number>(25);
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [wrapBraces, setWrapBraces] = useState<boolean>(false);
  const [urnPrefix, setUrnPrefix] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'plain' | 'json' | 'sql'>('plain');
  const [uuidList, setUuidList] = useState<string[]>([]);
  const [generationTimeMs, setGenerationTimeMs] = useState<number>(0);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedSingleIndex, setCopiedSingleIndex] = useState<number | null>(null);

  // Generate UUIDs function
  const regenerate = () => {
    const start = performance.now();
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(generateSingleUuid());
    }
    const end = performance.now();
    setGenerationTimeMs(Math.round((end - start) * 100) / 100);
    setUuidList(list);
    playSound('click');
  };

  // Initial generation
  useEffect(() => {
    regenerate();
  }, [count]);

  // Formatted output mapping
  const formattedItems = useMemo(() => {
    return uuidList.map(raw => {
      let val = raw;
      if (!includeHyphens) {
        val = val.replace(/-/g, '');
      }
      if (uppercase) {
        val = val.toUpperCase();
      } else {
        val = val.toLowerCase();
      }
      if (wrapBraces) {
        val = `{${val}}`;
      }
      if (urnPrefix) {
        val = `urn:uuid:${val}`;
      }
      return val;
    });
  }, [uuidList, uppercase, includeHyphens, wrapBraces, urnPrefix]);

  const outputString = useMemo(() => {
    if (outputFormat === 'json') {
      return JSON.stringify(formattedItems, null, 2);
    }
    if (outputFormat === 'sql') {
      return `INSERT INTO ids (uuid_val) VALUES\n` + formattedItems.map(id => `  ('${id}')`).join(',\n') + ';';
    }
    return formattedItems.join('\n');
  }, [formattedItems, outputFormat]);

  const handleCopyAll = () => {
    if (!outputString) return;
    navigator.clipboard.writeText(outputString);
    setCopiedAll(true);
    playSound('success');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (id: string, index: number) => {
    navigator.clipboard.writeText(id);
    setCopiedSingleIndex(index);
    playSound('click');
    setTimeout(() => setCopiedSingleIndex(null), 1500);
  };

  const handleDownload = () => {
    const ext = outputFormat === 'json' ? 'json' : outputFormat === 'sql' ? 'sql' : 'txt';
    const blob = new Blob([outputString], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids_${count}_batch.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="bulk-uuid-generator-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-purple-500/10 border border-rose-500/20 dark:border-rose-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Cryptographic Bulk UUID / GUID Generator
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
                crypto.randomUUID()
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generate collision-free RFC 4122 Version 4 UUIDs instantly in bulk with customizable formats
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Back to Grid
          </button>
        )}
      </div>

      {/* Control Strip */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-4">
        {/* Count Slider */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Total Quantity:
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              {count} UUIDs
            </span>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-md">
            <input
              type="range"
              min="1"
              max="250"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="flex-1 accent-rose-500 cursor-pointer"
            />
            <div className="flex gap-1">
              {[10, 25, 50, 100].map(cnt => (
                <button
                  key={cnt}
                  onClick={() => setCount(cnt)}
                  className={`px-2 py-0.5 text-xs font-semibold rounded-md border transition-colors cursor-pointer ${count === cnt ? 'bg-rose-500 text-white border-rose-500' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
                >
                  {cnt}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={regenerate}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 cursor-pointer transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Generate New Set
          </button>
        </div>

        {/* Checkbox Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-200/60 dark:border-white/5 text-xs">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="accent-rose-500 w-4 h-4 rounded"
            />
            UPPERCASE
          </label>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeHyphens}
              onChange={(e) => setIncludeHyphens(e.target.checked)}
              className="accent-rose-500 w-4 h-4 rounded"
            />
            Include Hyphens (-)
          </label>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={wrapBraces}
              onChange={(e) => setWrapBraces(e.target.checked)}
              className="accent-rose-500 w-4 h-4 rounded"
            />
            Wrap with {'{ }'}
          </label>

          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={urnPrefix}
              onChange={(e) => setUrnPrefix(e.target.checked)}
              className="accent-rose-500 w-4 h-4 rounded"
            />
            URN Prefix (urn:uuid:)
          </label>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 text-[11px]">Format:</span>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as any)}
              className="text-xs py-1 px-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              <option value="plain">Lines</option>
              <option value="json">JSON Array</option>
              <option value="sql">SQL INSERT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Display Area */}
      <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-rose-300">
              Generated System Identifiers ({formattedItems.length})
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg font-semibold bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'All Copied!' : 'Copy All'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

        {/* Scrollable List of UUIDs */}
        <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
          {formattedItems.map((id, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-slate-600 text-[10px] w-6 text-right shrink-0 select-none">
                  {index + 1}
                </span>
                <span className="text-rose-300 group-hover:text-white truncate select-all">
                  {id}
                </span>
              </div>

              <button
                onClick={() => handleCopySingle(id, index)}
                className="px-2 py-0.5 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 group-hover:opacity-100 opacity-60 transition-opacity flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedSingleIndex === index ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generation Stats Bar */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <span>Entropy: <strong className="text-slate-900 dark:text-white">122 bits (v4 RFC 4122)</strong></span>
          <span>Execution: <strong className="text-rose-600 dark:text-rose-400">{generationTimeMs} ms</strong></span>
          <span>Collision Chance: <strong className="text-emerald-600 dark:text-emerald-400">&lt; 1 in 10³⁶</strong></span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          CSPRNG Algorithm: Web Crypto Subsystem
        </span>
      </div>
    </div>
  );
};
