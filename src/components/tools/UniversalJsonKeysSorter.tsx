import React, { useState, useMemo } from 'react';
import { 
  ArrowDownAZ, 
  ArrowUpZA, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Sliders, 
  FileJson
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalJsonKeysSorterProps {
  onBackToGrid?: () => void;
}

const SAMPLE_JSON = `{
  "userId": 9482,
  "status": "active",
  "profile": {
    "zipCode": "94103",
    "firstName": "Alex",
    "lastName": "Rivera",
    "avatar": "https://avatar.dev/alex",
    "address": {
      "street": "456 Market St",
      "city": "San Francisco",
      "country": "USA"
    }
  },
  "metrics": {
    "views": 14200,
    "conversions": 384,
    "bounceRate": 0.24,
    "activeSessions": 42
  },
  "tags": ["developer", "react", "typescript", "fullstack"],
  "preferences": {
    "theme": "dark",
    "notifications": true,
    "currency": "USD",
    "autoSave": true
  }
}`;

export const UniversalJsonKeysSorter: React.FC<UniversalJsonKeysSorterProps> = ({ onBackToGrid }) => {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_JSON);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [indentation, setIndentation] = useState<'2' | '4' | 'tab' | 'compact'>('2');
  const [sortArraysOfObjects, setSortArraysOfObjects] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Recursive deep key sorter
  const { sortedJson, parseError, stats } = useMemo(() => {
    if (!rawInput.trim()) {
      return { sortedJson: '', parseError: null, stats: { totalKeys: 0, depth: 0, rawSize: 0, sortedSize: 0 } };
    }

    try {
      const parsed = JSON.parse(rawInput);
      let keyCount = 0;
      let maxDepth = 0;

      const sortRecursively = (value: any, currentDepth = 1): any => {
        if (currentDepth > maxDepth) maxDepth = currentDepth;

        // Null or primitive
        if (value === null || typeof value !== 'object') {
          return value;
        }

        // Array handling: if array contains objects, optionally sort their keys recursively
        if (Array.isArray(value)) {
          return value.map(item => {
            if (item && typeof item === 'object') {
              return sortRecursively(item, currentDepth + 1);
            }
            return item;
          });
        }

        // Plain object: sort keys
        const keys = Object.keys(value);
        keyCount += keys.length;

        keys.sort((a, b) => {
          const compA = caseSensitive ? a : a.toLowerCase();
          const compB = caseSensitive ? b : b.toLowerCase();
          if (compA < compB) return sortDirection === 'asc' ? -1 : 1;
          if (compA > compB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        });

        const sortedObj: Record<string, any> = {};
        for (const key of keys) {
          sortedObj[key] = sortRecursively(value[key], currentDepth + 1);
        }

        return sortedObj;
      };

      const resultObj = sortRecursively(parsed);

      let formattedOutput = '';
      if (indentation === 'compact') {
        formattedOutput = JSON.stringify(resultObj);
      } else if (indentation === 'tab') {
        formattedOutput = JSON.stringify(resultObj, null, '\t');
      } else {
        const spaces = parseInt(indentation, 10) || 2;
        formattedOutput = JSON.stringify(resultObj, null, spaces);
      }

      return {
        sortedJson: formattedOutput,
        parseError: null,
        stats: {
          totalKeys: keyCount,
          depth: maxDepth,
          rawSize: new Blob([rawInput]).size,
          sortedSize: new Blob([formattedOutput]).size
        }
      };
    } catch (err: any) {
      return {
        sortedJson: '',
        parseError: err?.message || 'Invalid JSON syntax',
        stats: { totalKeys: 0, depth: 0, rawSize: new Blob([rawInput]).size, sortedSize: 0 }
      };
    }
  }, [rawInput, sortDirection, caseSensitive, indentation, sortArraysOfObjects]);

  const handleCopy = () => {
    if (!sortedJson) return;
    navigator.clipboard.writeText(sortedJson);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    playSound('soft');
    const blob = new Blob([sortedJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sorted-keys.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    playSound('reset');
    setRawInput('');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100" id="tool-json-keys-sorter">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md">
            <FileJson className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              JSON Object Keys Sorter & Alphabetizer
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold">
                Recursive Tree Sort
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Recursively sort nested JSON keys alphabetically (A-Z or Z-A) without mutating array values or breaking structures.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-xs font-semibold transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Control Configuration Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Sort Direction Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50">Order:</span>
          <button
            onClick={() => {
              playSound('sliderTick');
              setSortDirection('asc');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              sortDirection === 'asc'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-300'
            }`}
          >
            <ArrowDownAZ className="w-3.5 h-3.5" />
            <span>A → Z (Ascending)</span>
          </button>
          <button
            onClick={() => {
              playSound('sliderTick');
              setSortDirection('desc');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              sortDirection === 'desc'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-300'
            }`}
          >
            <ArrowUpZA className="w-3.5 h-3.5" />
            <span>Z → A (Descending)</span>
          </button>
        </div>

        {/* Indentation Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50">Indent:</span>
          {(['2', '4', 'tab', 'compact'] as const).map((ind) => (
            <button
              key={ind}
              onClick={() => {
                playSound('tap');
                setIndentation(ind);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                indentation === ind
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-300'
              }`}
            >
              {ind === '2' && '2 Spaces'}
              {ind === '4' && '4 Spaces'}
              {ind === 'tab' && 'Tab'}
              {ind === 'compact' && 'Minified'}
            </button>
          ))}
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-3 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => {
                playSound('tap');
                setCaseSensitive(e.target.checked);
              }}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span className="text-slate-600 dark:text-white/70">Case-sensitive</span>
          </label>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-2">
              <span>Raw JSON Input</span>
              {parseError ? (
                <span className="flex items-center gap-1 text-red-500 font-normal">
                  <AlertCircle className="w-3 h-3" />
                  Invalid JSON
                </span>
              ) : rawInput.trim() ? (
                <span className="flex items-center gap-1 text-emerald-500 font-normal">
                  <CheckCircle2 className="w-3 h-3" />
                  Valid JSON
                </span>
              ) : null}
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('tap');
                  setRawInput(SAMPLE_JSON);
                }}
                className="text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
              >
                Sample Data
              </button>
              <button
                onClick={handleClear}
                className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            placeholder="Paste unsorted JSON here..."
            rows={14}
            className={`w-full p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border ${
              parseError ? 'border-red-500/50' : 'border-slate-200 dark:border-white/10'
            } focus:border-amber-500 dark:focus:border-amber-400 focus:outline-hidden font-mono text-xs sm:text-sm leading-relaxed transition-all resize-y shadow-inner`}
            id="json-keys-sorter-input"
          />

          {parseError && (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono">
              Syntax Error: {parseError}
            </div>
          )}
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700 dark:text-white/80">
                Sorted JSON Tree ({sortDirection === 'asc' ? 'A → Z' : 'Z → A'})
              </label>
              {sortedJson && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
                  {stats.totalKeys} keys sorted
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!sortedJson}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!sortedJson}
                className="p-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-white/70 transition-all cursor-pointer disabled:opacity-50"
                title="Download sorted JSON"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={sortedJson}
            placeholder="Alphabetically sorted JSON will appear here..."
            rows={14}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 font-mono text-xs sm:text-sm text-amber-600 dark:text-amber-300 leading-relaxed resize-y shadow-inner focus:outline-hidden"
            id="json-keys-sorter-output"
          />

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>Keys Sorted: {stats.totalKeys} • Max Depth: {stats.depth}</span>
            <span>Size: {stats.rawSize} B → {stats.sortedSize} B</span>
          </div>
        </div>
      </div>
    </div>
  );
};
