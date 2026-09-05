import React, { useState, useMemo } from 'react';
import { 
  ListOrdered, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Sparkles, 
  ArrowDownAZ, 
  ArrowUpAZ, 
  Trash2, 
  Filter, 
  Layers, 
  Sliders, 
  Shuffle, 
  CheckCircle2,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalTextLineSorterStripperProps {
  onBackToGrid?: () => void;
}

type SortMode = 'none' | 'asc' | 'desc' | 'natural' | 'length_asc' | 'length_desc' | 'reverse' | 'shuffle';

const SAMPLE_TEXT_BLOCK = `  apple   
banana
10. Watermelon
2. Orange
banana

grapefruit
  apple
1. Pineapple
strawberry
strawberry

mango
  `;

export const UniversalTextLineSorterStripper: React.FC<UniversalTextLineSorterStripperProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXT_BLOCK);
  
  // Transformation options
  const [stripEmptyLines, setStripEmptyLines] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [deduplicate, setDeduplicate] = useState<boolean>(true);
  const [caseInsensitiveDedupe, setCaseInsensitiveDedupe] = useState<boolean>(true);
  const [sortMode, setSortMode] = useState<SortMode>('natural');
  const [addLineNumbers, setAddLineNumbers] = useState<boolean>(false);
  const [stripExistingNumbers, setStripExistingNumbers] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');

  const [copied, setCopied] = useState<boolean>(false);

  // Compute Processed Lines
  const { processedText, metrics } = useMemo(() => {
    if (!inputText) {
      return {
        processedText: '',
        metrics: {
          originalLines: 0,
          processedLines: 0,
          emptyLinesRemoved: 0,
          duplicatesRemoved: 0,
          charsOriginal: 0,
          charsProcessed: 0,
          reductionPct: 0
        }
      };
    }

    const rawLines = inputText.split(/\r?\n/);
    const originalCount = rawLines.length;
    let emptyRemoved = 0;
    let duplicatesRemoved = 0;

    // 1. Initial mapping & trimming
    let lines = rawLines.map(line => {
      let l = line;
      if (trimWhitespace) {
        l = l.trim();
      }
      if (stripExistingNumbers) {
        l = l.replace(/^\s*\d+[\.\)\-\:\s]+\s*/, '');
      }
      return l;
    });

    // 2. Filter empty lines
    if (stripEmptyLines) {
      const beforeEmptyFilter = lines.length;
      lines = lines.filter(l => l.length > 0);
      emptyRemoved = beforeEmptyFilter - lines.length;
    }

    // 3. Deduplication
    if (deduplicate) {
      const seen = new Set<string>();
      const uniqueLines: string[] = [];

      for (const line of lines) {
        const key = caseInsensitiveDedupe ? line.toLowerCase() : line;
        if (!seen.has(key)) {
          seen.add(key);
          uniqueLines.push(line);
        } else {
          duplicatesRemoved++;
        }
      }
      lines = uniqueLines;
    }

    // 4. Sorting
    if (sortMode === 'asc') {
      lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
    } else if (sortMode === 'desc') {
      lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' }));
    } else if (sortMode === 'natural') {
      lines.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
    } else if (sortMode === 'length_asc') {
      lines.sort((a, b) => a.length - b.length || a.localeCompare(b));
    } else if (sortMode === 'length_desc') {
      lines.sort((a, b) => b.length - a.length || a.localeCompare(b));
    } else if (sortMode === 'reverse') {
      lines.reverse();
    } else if (sortMode === 'shuffle') {
      // Deterministic clone shuffle
      for (let i = lines.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [lines[i], lines[j]] = [lines[j], lines[i]];
      }
    }

    // 5. Prefix, Suffix & Line Numbers
    if (prefix || suffix || addLineNumbers) {
      lines = lines.map((line, idx) => {
        let res = line;
        if (prefix) res = prefix + res;
        if (suffix) res = res + suffix;
        if (addLineNumbers) res = `${idx + 1}. ${res}`;
        return res;
      });
    }

    const output = lines.join('\n');
    const charsOrig = inputText.length;
    const charsProc = output.length;
    const reduction = charsOrig > 0 ? Math.round(((charsOrig - charsProc) / charsOrig) * 100) : 0;

    return {
      processedText: output,
      metrics: {
        originalLines: originalCount,
        processedLines: lines.length,
        emptyLinesRemoved: emptyRemoved,
        duplicatesRemoved: duplicatesRemoved,
        charsOriginal: charsOrig,
        charsProcessed: charsProc,
        reductionPct: Math.max(0, reduction)
      }
    };
  }, [
    inputText, 
    stripEmptyLines, 
    trimWhitespace, 
    deduplicate, 
    caseInsensitiveDedupe, 
    sortMode, 
    addLineNumbers, 
    stripExistingNumbers, 
    prefix, 
    suffix
  ]);

  const handleCopy = () => {
    if (!processedText) return;
    navigator.clipboard.writeText(processedText);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!processedText) return;
    const blob = new Blob([processedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sorted_cleaned_lines_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const handleClear = () => {
    setInputText('');
    playSound('soft');
  };

  const handleReset = () => {
    setInputText(SAMPLE_TEXT_BLOCK);
    setStripEmptyLines(true);
    setTrimWhitespace(true);
    setDeduplicate(true);
    setSortMode('natural');
    setAddLineNumbers(false);
    setStripExistingNumbers(false);
    setPrefix('');
    setSuffix('');
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <ListOrdered className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              Text Line Count Sorter & Empty Spaces Stripper
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                100% In-Browser
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Clean duplicates, strip empty lines, natural sort, and format large lists in sub-millisecond loops
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Metrics Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Original Lines</span>
          <span className="text-base font-black text-slate-800 dark:text-white">{metrics.originalLines}</span>
        </div>
        <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Optimized Lines</span>
          <span className="text-base font-black text-amber-600 dark:text-amber-400">{metrics.processedLines}</span>
        </div>
        <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Empty Removed</span>
          <span className="text-base font-black text-emerald-500">{metrics.emptyLinesRemoved} lines</span>
        </div>
        <div className="bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Duplicates Cleared</span>
          <span className="text-base font-black text-purple-600 dark:text-purple-400">{metrics.duplicatesRemoved} unique</span>
        </div>
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-white/70 dark:bg-slate-900/70 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Size Reduction</span>
          <span className="text-base font-black text-blue-500">-{metrics.reductionPct}%</span>
        </div>
      </div>

      {/* Control Filters Toolbar */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3 text-xs">
        {/* Row 1: Checkbox Operations */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-slate-700 dark:text-white/80 font-medium">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={stripEmptyLines}
              onChange={(e) => { setStripEmptyLines(e.target.checked); playSound('soft'); }}
              className="rounded accent-amber-500"
            />
            <span className="font-bold">Erase Empty Lines</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => { setTrimWhitespace(e.target.checked); playSound('soft'); }}
              className="rounded accent-amber-500"
            />
            <span>Trim Leading/Trailing Spaces</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={deduplicate}
              onChange={(e) => { setDeduplicate(e.target.checked); playSound('soft'); }}
              className="rounded accent-amber-500"
            />
            <span>Remove Duplicates</span>
          </label>

          {deduplicate && (
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-500 dark:text-white/60">
              <input
                type="checkbox"
                checked={caseInsensitiveDedupe}
                onChange={(e) => { setCaseInsensitiveDedupe(e.target.checked); playSound('soft'); }}
                className="rounded accent-amber-500"
              />
              <span>Case-Insensitive Dedupe</span>
            </label>
          )}

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={stripExistingNumbers}
              onChange={(e) => { setStripExistingNumbers(e.target.checked); playSound('soft'); }}
              className="rounded accent-amber-500"
            />
            <span>Strip Existing Numbers</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={addLineNumbers}
              onChange={(e) => { setAddLineNumbers(e.target.checked); playSound('soft'); }}
              className="rounded accent-amber-500"
            />
            <span>Add Line Numbers (1, 2, 3...)</span>
          </label>
        </div>

        {/* Row 2: Sort Mode Selection & Prefix/Suffix */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 dark:text-white/60">Sorting Mode:</span>
            {[
              { id: 'natural', label: 'Natural Sort (1, 2, 10)' },
              { id: 'asc', label: 'A → Z' },
              { id: 'desc', label: 'Z → A' },
              { id: 'length_asc', label: 'Shortest First' },
              { id: 'length_desc', label: 'Longest First' },
              { id: 'reverse', label: 'Reverse Order' },
              { id: 'shuffle', label: 'Random Shuffle' },
              { id: 'none', label: 'No Sort' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => { setSortMode(s.id as SortMode); playSound('click'); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  sortMode === s.id
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white/70'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Prefix:</span>
              <input
                type="text"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder='e.g. "- "'
                className="w-16 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-xs"
              />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Suffix:</span>
              <input
                type="text"
                value={suffix}
                onChange={(e) => setSuffix(e.target.value)}
                placeholder='e.g. ","'
                className="w-16 px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Double Pane Text Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Raw Text Input */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
                Raw Input Data ({metrics.originalLines} lines)
              </span>
            </div>
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Clear
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste raw text block with lines, spaces, duplicates here..."
            rows={14}
            className="w-full p-4 bg-transparent text-slate-800 dark:text-slate-100 font-mono text-xs sm:text-sm resize-none outline-none focus:ring-1 focus:ring-amber-500/30 transition-all leading-relaxed"
          />
        </div>

        {/* Right Pane: Cleaned Output */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
                Cleaned & Sorted Output ({metrics.processedLines} lines)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!processedText}
                className="p-1 rounded-md text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                title="Download as TXT"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!processedText}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white disabled:opacity-40'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Clean Lines!' : 'Copy Lines'}</span>
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={processedText}
            placeholder="Processed output will appear immediately..."
            rows={14}
            className="w-full p-4 bg-slate-950/[0.02] dark:bg-slate-950/40 text-amber-600 dark:text-amber-300 font-mono text-xs sm:text-sm resize-none outline-none leading-relaxed select-all"
          />
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3.5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-xs text-slate-600 dark:text-amber-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p>
          <strong>Natural Sort Algorithm:</strong> Uses ECMAScript <code>Intl.Collator</code> with <code>numeric: true</code>, sorting numbers logically (e.g. &quot;item 2&quot; appears before &quot;item 10&quot;). Computes entirely inside browser V8 memory without uploading any data.
        </p>
      </div>
    </div>
  );
};
