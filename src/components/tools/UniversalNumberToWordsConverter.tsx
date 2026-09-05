import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Sparkles, 
  DollarSign, 
  RotateCcw, 
  CheckCircle2, 
  BookOpen, 
  BadgeDollarSign,
  Layers
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalNumberToWordsConverterProps {
  onBackToGrid?: () => void;
}

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const SCALES = ['', 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion'];

const convertThreeDigits = (num: number, useAnd: boolean): string => {
  let result = '';
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  if (hundreds > 0) {
    result += ONES[hundreds] + ' Hundred';
    if (remainder > 0) {
      result += useAnd ? ' and ' : ' ';
    }
  }

  if (remainder > 0) {
    if (remainder < 10) {
      result += ONES[remainder];
    } else if (remainder < 20) {
      result += TEENS[remainder - 10];
    } else {
      const ten = Math.floor(remainder / 10);
      const one = remainder % 10;
      result += TENS[ten];
      if (one > 0) {
        result += '-' + ONES[one];
      }
    }
  }

  return result.trim();
};

const numberToWordsStandard = (numStr: string, useAnd: boolean): string => {
  const clean = numStr.replace(/,/g, '').trim();
  if (!clean || clean === '0') return 'Zero';
  if (clean === '-') return 'Minus';

  let isNegative = false;
  let working = clean;
  if (working.startsWith('-')) {
    isNegative = true;
    working = working.substring(1);
  }

  const parts = working.split('.');
  let integerPart = parts[0].replace(/^0+/, '');
  if (!integerPart) integerPart = '0';
  const decimalPart = parts[1] || '';

  if (integerPart === '0' && !decimalPart) {
    return 'Zero';
  }

  // Process integer part in chunks of 3 from right to left
  const chunks: number[] = [];
  while (integerPart.length > 0) {
    const chunkStr = integerPart.slice(Math.max(0, integerPart.length - 3));
    chunks.push(parseInt(chunkStr, 10));
    integerPart = integerPart.slice(0, Math.max(0, integerPart.length - 3));
  }

  if (chunks.length > SCALES.length) {
    return 'Number exceeds maximum supported quintillion threshold';
  }

  const wordChunks: string[] = [];
  for (let i = chunks.length - 1; i >= 0; i--) {
    const val = chunks[i];
    if (val > 0) {
      const chunkWords = convertThreeDigits(val, useAnd);
      const scale = SCALES[i];
      wordChunks.push(scale ? `${chunkWords} ${scale}` : chunkWords);
    }
  }

  let finalWords = wordChunks.join(' ').trim();
  if (!finalWords) finalWords = 'Zero';
  if (isNegative) finalWords = 'Negative ' + finalWords;

  return finalWords;
};

const PRESETS = [
  { label: 'Check Payment ($1,429.50)', val: '1429.50' },
  { label: 'Quarterly Bonus ($25,000)', val: '25000' },
  { label: 'Angel Round ($1,500,000)', val: '1500000' },
  { label: 'Corporate Budget ($48,912,300.85)', val: '48912300.85' },
  { label: 'National Debt Scale ($1,000,000,000)', val: '1000000000' }
];

export const UniversalNumberToWordsConverter: React.FC<UniversalNumberToWordsConverterProps> = ({ onBackToGrid }) => {
  const [inputVal, setInputVal] = useState<string>('1429.50');
  const [currencyMode, setCurrencyMode] = useState<'none' | 'usd' | 'eur' | 'gbp' | 'inr'>('usd');
  const [casing, setCasing] = useState<'title' | 'upper' | 'lower' | 'sentence'>('title');
  const [includeAnd, setIncludeAnd] = useState<boolean>(true);
  const [includeOnlySuffix, setIncludeOnlySuffix] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Compute text output
  const { wordsOutput, breakdown, rawIntegerWords, decimalFraction } = useMemo(() => {
    const cleaned = inputVal.replace(/[^\d.-]/g, '');
    if (!cleaned || isNaN(Number(cleaned))) {
      return { wordsOutput: '', breakdown: [], rawIntegerWords: '', decimalFraction: '' };
    }

    const parts = cleaned.split('.');
    const intStr = parts[0] || '0';
    const decStr = parts[1] || '';

    const intWords = numberToWordsStandard(intStr, includeAnd);

    let finalStr = '';

    if (currencyMode === 'none') {
      if (decStr) {
        const decWords = decStr
          .split('')
          .map(d => (d === '0' ? 'Zero' : ONES[parseInt(d, 10)]))
          .join(' ');
        finalStr = `${intWords} Point ${decWords}`;
      } else {
        finalStr = intWords;
      }
    } else {
      // Currency specific phrasing
      const centsVal = decStr ? parseInt(decStr.padEnd(2, '0').slice(0, 2), 10) : 0;
      const centsWords = centsVal > 0 ? numberToWordsStandard(centsVal.toString(), includeAnd) : 'Zero';

      const currencyLabels: Record<string, { majorSingular: string; majorPlural: string; minorSingular: string; minorPlural: string }> = {
        usd: { majorSingular: 'Dollar', majorPlural: 'Dollars', minorSingular: 'Cent', minorPlural: 'Cents' },
        eur: { majorSingular: 'Euro', majorPlural: 'Euros', minorSingular: 'Cent', minorPlural: 'Cents' },
        gbp: { majorSingular: 'Pound', majorPlural: 'Pounds', minorSingular: 'Penny', minorPlural: 'Pence' },
        inr: { majorSingular: 'Rupee', majorPlural: 'Rupees', minorSingular: 'Paisa', minorPlural: 'Paise' }
      };

      const cfg = currencyLabels[currencyMode];
      const isOneMajor = Math.abs(parseInt(intStr || '0', 10)) === 1;
      const majorUnit = isOneMajor ? cfg.majorSingular : cfg.majorPlural;

      if (centsVal > 0) {
        const isOneMinor = centsVal === 1;
        const minorUnit = isOneMinor ? cfg.minorSingular : cfg.minorPlural;
        finalStr = `${intWords} ${majorUnit} and ${centsWords} ${minorUnit}`;
      } else {
        finalStr = `${intWords} ${majorUnit}`;
      }

      if (includeOnlySuffix) {
        finalStr += ' Only';
      }
    }

    // Apply casing
    let formatted = finalStr;
    if (casing === 'upper') {
      formatted = finalStr.toUpperCase();
    } else if (casing === 'lower') {
      formatted = finalStr.toLowerCase();
    } else if (casing === 'sentence') {
      formatted = finalStr.charAt(0).toUpperCase() + finalStr.slice(1).toLowerCase();
    } else {
      // Title Case (default)
      formatted = finalStr.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1));
    }

    // Breakdown info
    const steps = [
      { label: 'Raw Numeric', value: cleaned },
      { label: 'Integer Part', value: Number(intStr || '0').toLocaleString() },
      { label: 'Fractional Part', value: decStr ? `.${decStr}` : 'None (00/100)' },
      { label: 'Check Format', value: `${intWords} and ${decStr.padEnd(2, '0').slice(0, 2)}/100` }
    ];

    return {
      wordsOutput: formatted,
      breakdown: steps,
      rawIntegerWords: intWords,
      decimalFraction: decStr ? `${decStr.padEnd(2, '0').slice(0, 2)}/100` : '00/100'
    };
  }, [inputVal, currencyMode, casing, includeAnd, includeOnlySuffix]);

  const handleCopy = () => {
    if (!wordsOutput) return;
    navigator.clipboard.writeText(wordsOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="number-to-words-converter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Real-Time Number to Words Capital Text Converter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Accounting &amp; Banking
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform numbers and currency checks into English words with single-click clipboard copying
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

      {/* Preset Quick Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Presets:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputVal(p.val);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-emerald-300 transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input & Control Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left 2 Cols: Number Input & Options */}
        <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
          <div>
            <label htmlFor="number-input-field" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Enter Numeric Value or Currency Amount
            </label>
            <div className="relative">
              <input
                id="number-input-field"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="e.g. 1429.50"
                className="w-full px-4 py-3 font-mono text-xl font-bold rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 tracking-wide"
              />
              <button
                onClick={() => {
                  setInputVal('');
                  playSound('click');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Option Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
            <div>
              <span className="block text-slate-500 text-[11px] mb-1 font-medium">Currency Context</span>
              <select
                value={currencyMode}
                onChange={(e) => {
                  setCurrencyMode(e.target.value as any);
                  playSound('tap');
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="usd">USD ($ Dollars)</option>
                <option value="eur">EUR (€ Euros)</option>
                <option value="gbp">GBP (£ Pounds)</option>
                <option value="inr">INR (₹ Rupees)</option>
                <option value="none">Raw Numbers (No Currency)</option>
              </select>
            </div>

            <div>
              <span className="block text-slate-500 text-[11px] mb-1 font-medium">Text Casing</span>
              <select
                value={casing}
                onChange={(e) => {
                  setCasing(e.target.value as any);
                  playSound('tap');
                }}
                className="w-full py-1.5 px-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <option value="title">Title Case</option>
                <option value="upper">UPPERCASE</option>
                <option value="sentence">Sentence case</option>
                <option value="lower">lowercase</option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none py-1.5">
                <input
                  type="checkbox"
                  checked={includeAnd}
                  onChange={(e) => setIncludeAnd(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded"
                />
                <span className="text-xs">Include "and"</span>
              </label>
            </div>

            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none py-1.5">
                <input
                  type="checkbox"
                  checked={includeOnlySuffix}
                  disabled={currencyMode === 'none'}
                  onChange={(e) => setIncludeOnlySuffix(e.target.checked)}
                  className="accent-emerald-500 w-4 h-4 rounded disabled:opacity-40"
                />
                <span className={`text-xs ${currencyMode === 'none' ? 'opacity-40' : ''}`}>"Only" Suffix</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Banking Check Preview Simulator */}
        <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-amber-200/80 dark:border-amber-800/40">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <BadgeDollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Check Line Memo
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                Official Check
              </span>
            </div>
            <div className="pt-2 text-xs text-amber-950 dark:text-amber-200 font-mono space-y-1">
              <p className="text-[11px] text-amber-700 dark:text-amber-400 font-sans">
                PAY TO THE ORDER OF: <strong className="underline decoration-dotted">Authorized Recipient</strong>
              </p>
              <div className="p-2 rounded bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-800 font-serif italic text-xs leading-relaxed break-words">
                {rawIntegerWords || 'Zero'} and {decimalFraction}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center justify-between">
            <span>Bank Format: <strong>Verified</strong></span>
            <span className="font-mono">VOID IF DETACHED</span>
          </div>
        </div>
      </div>

      {/* Main Output Display */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">
              Generated Capital Text Output
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {wordsOutput ? `${wordsOutput.split(' ').length} words` : '0 words'}
          </span>
        </div>

        <div
          id="number-words-result"
          className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-sans text-lg font-semibold text-emerald-300 leading-relaxed break-words select-all min-h-[70px] flex items-center shadow-inner"
        >
          {wordsOutput || 'Enter a valid number above...'}
        </div>

        <button
          onClick={handleCopy}
          disabled={!wordsOutput}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied Full Text to Clipboard!' : 'Copy Converted Words String'}
        </button>
      </div>

      {/* Metadata & Arithmetic Breakdown */}
      {breakdown.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {breakdown.map((item, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">{item.label}</span>
              <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
