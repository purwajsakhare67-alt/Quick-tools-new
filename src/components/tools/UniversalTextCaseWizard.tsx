import React, { useState, useMemo } from 'react';
import { 
  Type, 
  Copy, 
  Check, 
  ArrowLeft, 
  RotateCcw, 
  ArrowDownAZ, 
  ArrowUpAZ, 
  Filter, 
  ListOrdered, 
  FileText, 
  Sparkles, 
  AlignLeft,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalTextCaseWizardProps {
  onBackToGrid?: () => void;
}

export const UniversalTextCaseWizard: React.FC<UniversalTextCaseWizardProps> = ({
  onBackToGrid
}) => {
  const [inputText, setInputText] = useState<string>(
    'apple\n' +
    'orange\n' +
    'BANANA\n' +
    'grape fruit\n' +
    'apple\n' +
    '\n' +
    'strawBerry smoothie\n' +
    'WATERMELON'
  );
  const [copied, setCopied] = useState(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const raw = inputText;
    const lines = raw ? raw.split('\n').length : 0;
    const words = raw.trim() ? raw.trim().split(/\s+/).length : 0;
    const chars = raw.length;
    const charsNoSpaces = raw.replace(/\s/g, '').length;
    return { lines, words, chars, charsNoSpaces };
  }, [inputText]);

  // Transformation Formulas
  const applyTransform = (action: string) => {
    playSound('tap');
    if (!inputText) return;

    let result = inputText;

    switch (action) {
      case 'sentence':
        // Sentence case: Capitalize first letter of every sentence
        result = inputText.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;

      case 'title':
        // Title Case: Capitalize every major word
        result = inputText.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        break;

      case 'upper':
        result = inputText.toUpperCase();
        break;

      case 'lower':
        result = inputText.toLowerCase();
        break;

      case 'camel':
        // camelCase
        result = inputText
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, (c) => c.toLowerCase());
        break;

      case 'pascal':
        // PascalCase
        result = inputText
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter) => letter.toUpperCase())
          .replace(/[^a-zA-Z0-9]/g, '');
        break;

      case 'kebab':
        // kebab-case
        result = inputText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        break;

      case 'snake':
        // snake_case
        result = inputText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        break;

      case 'constant':
        // CONSTANT_CASE
        result = inputText
          .toUpperCase()
          .replace(/[^A-Z0-9]+/g, '_')
          .replace(/^_+|_+$/g, '');
        break;

      case 'inverse':
        // Invert character cases
        result = inputText
          .split('')
          .map((c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()))
          .join('');
        break;

      case 'alternating':
        // aLtErNaTiNg cAsE
        result = inputText
          .split('')
          .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
          .join('');
        break;

      // Array List Operations
      case 'sort_az': {
        const lines = inputText.split('\n');
        result = lines.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })).join('\n');
        break;
      }

      case 'sort_za': {
        const lines = inputText.split('\n');
        result = lines.sort((a, b) => b.localeCompare(a, undefined, { sensitivity: 'base' })).join('\n');
        break;
      }

      case 'reverse_lines': {
        const lines = inputText.split('\n');
        result = lines.reverse().join('\n');
        break;
      }

      case 'remove_blanks': {
        const lines = inputText.split('\n');
        result = lines.filter((line) => line.trim().length > 0).join('\n');
        break;
      }

      case 'remove_duplicates': {
        const lines = inputText.split('\n');
        result = Array.from(new Set(lines)).join('\n');
        break;
      }

      case 'trim_lines': {
        const lines = inputText.split('\n');
        result = lines.map((line) => line.trim()).join('\n');
        break;
      }

      case 'number_lines': {
        const lines = inputText.split('\n');
        result = lines.map((line, idx) => `${idx + 1}. ${line}`).join('\n');
        break;
      }

      case 'bullet_lines': {
        const lines = inputText.split('\n');
        result = lines.map((line) => `• ${line}`).join('\n');
        break;
      }

      default:
        break;
    }

    setInputText(result);
  };

  const copyToClipboard = () => {
    if (!inputText) return;
    playSound('bell');
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample Text Loaders
  const loadSample = (type: 'fruits' | 'sentence' | 'tech') => {
    playSound('tap');
    if (type === 'fruits') {
      setInputText('apple\norange\nBANANA\ngrape fruit\napple\n\nstrawBerry smoothie\nWATERMELON');
    } else if (type === 'sentence') {
      setInputText('the QUICK brown fox jumps OVER the lazy dog! it was a sunny day? yes, indeed.');
    } else if (type === 'tech') {
      setInputText('user_authentication_flow\napi_gateway_proxy\nDATABASE_CONNECTION_POOL\nMicroservice architecture\napi_gateway_proxy');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Controls */}
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
            <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Type className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Text Case Wizard & List Array Sorter
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-600 dark:text-blue-400">
              Writer Utility
            </span>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInputText('');
              playSound('tap');
            }}
            className="p-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-rose-500/20 text-slate-600 dark:text-white/70 hover:text-rose-500 transition-colors"
            title="Clear all text"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md hover:shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Action Toolbar Panel */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
        {/* Case Transformations */}
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-1.5">
            Case Conversions:
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            {[
              { id: 'sentence', label: 'Sentence case' },
              { id: 'title', label: 'Title Case' },
              { id: 'upper', label: 'UPPERCASE' },
              { id: 'lower', label: 'lowercase' },
              { id: 'camel', label: 'camelCase' },
              { id: 'pascal', label: 'PascalCase' },
              { id: 'kebab', label: 'kebab-case' },
              { id: 'snake', label: 'snake_case' },
              { id: 'constant', label: 'CONSTANT_CASE' },
              { id: 'inverse', label: 'iNVERSE cASE' },
              { id: 'alternating', label: 'aLtErNaTe' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => applyTransform(btn.id)}
                className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* List & Array Sorting Transformations */}
        <div className="pt-2 border-t border-slate-200 dark:border-white/5">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-1.5">
            List & Line Operations:
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs font-bold">
            <button
              onClick={() => applyTransform('sort_az')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              <ArrowDownAZ className="w-3.5 h-3.5 text-blue-500" />
              <span>Sort A-Z</span>
            </button>
            <button
              onClick={() => applyTransform('sort_za')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              <ArrowUpAZ className="w-3.5 h-3.5 text-blue-500" />
              <span>Sort Z-A</span>
            </button>
            <button
              onClick={() => applyTransform('reverse_lines')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              Reverse Lines
            </button>
            <button
              onClick={() => applyTransform('remove_blanks')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              <Filter className="w-3.5 h-3.5 text-blue-500" />
              <span>Remove Blank Lines</span>
            </button>
            <button
              onClick={() => applyTransform('remove_duplicates')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              Remove Duplicates
            </button>
            <button
              onClick={() => applyTransform('trim_lines')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              Trim Whitespace
            </button>
            <button
              onClick={() => applyTransform('number_lines')}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              <ListOrdered className="w-3.5 h-3.5 text-blue-500" />
              <span>Add 1. 2. 3.</span>
            </button>
            <button
              onClick={() => applyTransform('bullet_lines')}
              className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300/80 dark:border-white/10 hover:border-blue-500 hover:text-blue-500 text-slate-700 dark:text-white/80 transition-all text-[11px] active:scale-95"
            >
              Add Bullets (•)
            </button>
          </div>
        </div>
      </div>

      {/* Main Textarea Formatting Pane */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/60">
          <span className="font-bold flex items-center gap-1">
            <AlignLeft className="w-3.5 h-3.5 text-blue-500" />
            Working Text Canvas:
          </span>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Load Preset:</span>
            <button
              onClick={() => loadSample('fruits')}
              className="hover:text-blue-500 underline"
            >
              Messy List
            </button>
            <span>•</span>
            <button
              onClick={() => loadSample('sentence')}
              className="hover:text-blue-500 underline"
            >
              Article Text
            </button>
            <span>•</span>
            <button
              onClick={() => loadSample('tech')}
              className="hover:text-blue-500 underline"
            >
              Code Identifiers
            </button>
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={12}
          className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all selection:bg-blue-500/30"
          placeholder="Paste or write your text here to transform..."
        />

        {/* Live Text Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
            <span className="text-slate-400 dark:text-white/40 block text-[10px] uppercase font-bold">Total Lines</span>
            <strong className="text-sm font-black text-slate-800 dark:text-white">{stats.lines}</strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
            <span className="text-slate-400 dark:text-white/40 block text-[10px] uppercase font-bold">Words</span>
            <strong className="text-sm font-black text-slate-800 dark:text-white">{stats.words}</strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
            <span className="text-slate-400 dark:text-white/40 block text-[10px] uppercase font-bold">Characters</span>
            <strong className="text-sm font-black text-slate-800 dark:text-white">{stats.chars}</strong>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5">
            <span className="text-slate-400 dark:text-white/40 block text-[10px] uppercase font-bold">Chars (No Spaces)</span>
            <strong className="text-sm font-black text-blue-600 dark:text-blue-400">{stats.charsNoSpaces}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
