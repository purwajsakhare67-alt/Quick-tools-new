import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  Sparkles, 
  SlidersHorizontal, 
  Layers,
  ArrowRight,
  Code2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalEmptyLineTrimmerProps {
  onBackToGrid?: () => void;
}

const SAMPLE_MESSY_CODE = `// Enterprise Service Worker Initialization

import { initializeApp } from 'firebase/app';


const config = {
  apiKey: "AIzaSyD-sample-key",   
  projectId: "cloud-project-sample"    
};   


function bootApp() {  

  console.log("System booting...");   

  
  return true;

}   

export default bootApp;   

`;

export const UniversalEmptyLineTrimmer: React.FC<UniversalEmptyLineTrimmerProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_MESSY_CODE);
  const [stripTrailingSpaces, setStripTrailingSpaces] = useState<boolean>(true);
  const [removeConsecutiveBlanks, setRemoveConsecutiveBlanks] = useState<boolean>(true);
  const [removeAllBlankLines, setRemoveAllBlankLines] = useState<boolean>(false);
  const [stripLeadingSpaces, setStripLeadingSpaces] = useState<boolean>(false);
  const [trimWholeDocument, setTrimWholeDocument] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Core array filter mapping & regex cleaning
  const cleanedText = useMemo(() => {
    if (!inputText) return '';

    let lines = inputText.split('\n');

    // 1. Process individual line spaces
    lines = lines.map((line) => {
      let l = line;
      if (stripTrailingSpaces) {
        l = l.replace(/[ \t]+$/, '');
      }
      if (stripLeadingSpaces) {
        l = l.replace(/^[ \t]+/, '');
      }
      return l;
    });

    // 2. Filter empty lines
    if (removeAllBlankLines) {
      lines = lines.filter((line) => line.trim().length > 0);
    } else if (removeConsecutiveBlanks) {
      // Compress multiple consecutive empty lines to a single empty line
      const compressed: string[] = [];
      let lastWasEmpty = false;
      for (const line of lines) {
        const isEmpty = line.trim().length === 0;
        if (isEmpty) {
          if (!lastWasEmpty) {
            compressed.push('');
            lastWasEmpty = true;
          }
        } else {
          compressed.push(line);
          lastWasEmpty = false;
        }
      }
      lines = compressed;
    }

    let result = lines.join('\n');
    if (trimWholeDocument) {
      result = result.trim();
    }
    return result;
  }, [inputText, stripTrailingSpaces, removeConsecutiveBlanks, removeAllBlankLines, stripLeadingSpaces, trimWholeDocument]);

  // Metrics
  const stats = useMemo(() => {
    const rawLines = inputText.split('\n').length;
    const cleanLines = cleanedText ? cleanedText.split('\n').length : 0;
    const linesRemoved = Math.max(0, rawLines - cleanLines);

    const rawBytes = new Blob([inputText]).size;
    const cleanBytes = new Blob([cleanedText]).size;
    const bytesSaved = Math.max(0, rawBytes - cleanBytes);
    const savingsPercent = rawBytes > 0 ? Math.round((bytesSaved / rawBytes) * 100) : 0;

    return { rawLines, cleanLines, linesRemoved, rawBytes, cleanBytes, bytesSaved, savingsPercent };
  }, [inputText, cleanedText]);

  const handleCopy = () => {
    if (!cleanedText) return;
    navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="empty-line-trimmer-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 dark:border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Code Empty Line Trimmer &amp; Space Cleaner
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Technical Writing &amp; Code Sanitizer
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean array filters and regex trims to eliminate ghost blank lines and erase trailing whitespace in RAM
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

      {/* Options & Metric Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        {/* Cleaning Options */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
            Sanitization Rules
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={stripTrailingSpaces}
                onChange={(e) => setStripTrailingSpaces(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              Strip Trailing Spaces
            </label>

            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={removeConsecutiveBlanks && !removeAllBlankLines}
                disabled={removeAllBlankLines}
                onChange={(e) => setRemoveConsecutiveBlanks(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 disabled:opacity-50"
              />
              Collapse Multiple Blanks
            </label>

            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={removeAllBlankLines}
                onChange={(e) => setRemoveAllBlankLines(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              Purge ALL Blank Lines
            </label>

            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={trimWholeDocument}
                onChange={(e) => setTrimWholeDocument(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400"
              />
              Trim Document Bounds
            </label>
          </div>
        </div>

        {/* Live Reduction Stats */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
          <div className="text-center">
            <div className="text-xs text-slate-400">Lines Removed</div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">
              -{stats.linesRemoved}
            </div>
            <div className="text-[10px] text-slate-500">{stats.rawLines} → {stats.cleanLines}</div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />

          <div className="text-center">
            <div className="text-xs text-slate-400">Bytes Saved</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              -{stats.bytesSaved} B
            </div>
            <div className="text-[10px] text-slate-500">{stats.savingsPercent}% compression</div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />

          <button
            onClick={() => {
              setInputText('');
              playSound('click');
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            title="Clear input"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dual Workspace Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="messy-code-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-500" />
              Raw Messy Code / Text Array Input
            </label>
            <span className="text-[11px] font-mono text-slate-400">{stats.rawLines} lines</span>
          </div>

          <textarea
            id="messy-code-input"
            rows={14}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste code or logs with redundant empty lines and trailing spaces..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
          />
        </div>

        {/* Right: Clean Compressed Output Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                Sanitized Compressed Output
              </span>
              <span className="text-[11px] font-mono text-slate-400">{stats.cleanLines} lines</span>
            </div>

            <div className="pt-2">
              <textarea
                id="cleaned-code-output"
                readOnly
                rows={14}
                value={cleanedText}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-amber-100 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <button
            onClick={handleCopy}
            disabled={!cleanedText}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Clean Code to Clipboard!' : 'Copy Sanitized Code'}
          </button>
        </div>
      </div>
    </div>
  );
};
