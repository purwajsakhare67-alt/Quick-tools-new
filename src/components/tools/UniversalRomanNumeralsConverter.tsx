import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalRomanNumeralsConverterProps {
  onBackToGrid?: () => void;
}

const ROMAN_MATRIX: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I']
];

const ROMAN_CHAR_VALUES: Record<string, number> = {
  'I': 1,
  'V': 5,
  'X': 10,
  'L': 50,
  'C': 100,
  'D': 500,
  'M': 1000
};

const POPULAR_YEARS = [
  { label: 'Current Year (2026)', value: '2026' },
  { label: 'US Independence (1776)', value: '1776' },
  { label: 'Y2K Millennium (2000)', value: '2000' },
  { label: 'Orwellian Title (1984)', value: '1984' },
  { label: 'Super Bowl LVIII (58)', value: '58' },
  { label: 'Ancient Rome (753 BC)', value: '753' }
];

export const UniversalRomanNumeralsConverter: React.FC<UniversalRomanNumeralsConverterProps> = ({ onBackToGrid }) => {
  const [inputVal, setInputVal] = useState<string>('2026');
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-detect mode: If starts with digit -> Arabic to Roman. Else -> Roman to Arabic.
  const isArabicInput = useMemo(() => {
    return /^\d+$/.test(inputVal.trim());
  }, [inputVal]);

  // Conversion calculations
  const { result, breakdown, error } = useMemo(() => {
    const raw = inputVal.trim().toUpperCase();
    if (!raw) {
      return { result: '', breakdown: [], error: null };
    }

    if (isArabicInput) {
      const num = parseInt(raw, 10);
      if (isNaN(num)) return { result: '', breakdown: [], error: 'Invalid number' };
      if (num < 1) return { result: '', breakdown: [], error: 'Romans had no zero or negative numerals (min: 1)' };
      if (num > 3999) return { result: '', breakdown: [], error: 'Standard classical numerals support up to 3,999 (MMMCMXCIX)' };

      let remaining = num;
      let roman = '';
      const steps: { partNum: number; symbol: string; count: number }[] = [];

      for (const [val, sym] of ROMAN_MATRIX) {
        if (remaining >= val) {
          const count = Math.floor(remaining / val);
          remaining %= val;
          roman += sym.repeat(count);
          steps.push({ partNum: val * count, symbol: sym.repeat(count), count });
        }
      }

      return { result: roman, breakdown: steps, error: null };
    } else {
      // Roman to Arabic validation and conversion
      // Strict regex matching classical roman numerals
      const validRomanRegex = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
      if (!validRomanRegex.test(raw)) {
        return {
          result: '',
          breakdown: [],
          error: 'Invalid Roman Numeral format (check subtractive rules & max 3 consecutive repeats)'
        };
      }

      let total = 0;
      const steps: { partNum: number; symbol: string; count: number }[] = [];

      for (let i = 0; i < raw.length; i++) {
        const currentVal = ROMAN_CHAR_VALUES[raw[i]];
        const nextVal = ROMAN_CHAR_VALUES[raw[i + 1]] || 0;

        if (currentVal < nextVal) {
          const combined = nextVal - currentVal;
          total += combined;
          steps.push({ partNum: combined, symbol: raw[i] + raw[i + 1], count: 1 });
          i++; // Skip next character as it was subtracted
        } else {
          total += currentVal;
          steps.push({ partNum: currentVal, symbol: raw[i], count: 1 });
        }
      }

      return { result: total.toLocaleString(), breakdown: steps, error: null };
    }
  }, [inputVal, isArabicInput]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (result && !error) {
      setInputVal(result.replace(/,/g, ''));
      playSound('click');
    }
  };

  return (
    <div id="roman-numerals-converter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 dark:border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Dynamic Roman Numerals Forward/Reverse Converter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Bidirectional
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert between Arabic numbers (1 - 3,999) and Roman numerals (I, V, X, L, C, D, M) with arithmetic breakdowns
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

      {/* Preset Pickers */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Famous Years:
        </span>
        {POPULAR_YEARS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => { setInputVal(p.value); playSound('click'); }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-amber-300 transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Main Conversion Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <label htmlFor="roman-input-field" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {isArabicInput ? 'Arabic Number (1 - 3999)' : 'Roman Numeral (I, V, X, L, C, D, M)'}
              </label>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                {isArabicInput ? 'Number Mode' : 'Roman Mode'}
              </span>
            </div>

            <div className="pt-3">
              <input
                id="roman-input-field"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value.toUpperCase())}
                placeholder="Type 2026 or MMXXVI..."
                className="w-full px-4 py-3 font-mono text-xl font-bold rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner tracking-wider uppercase"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleSwap}
              disabled={!result || !!error}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Swap Direction
            </button>
            <button
              onClick={() => { setInputVal(''); playSound('click'); }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Output Card */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {isArabicInput ? 'Roman Numeral Equivalent' : 'Arabic Decimal Equivalent'}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Mathematical Result
              </span>
            </div>

            <div className="pt-3">
              <div
                id="roman-conversion-result"
                className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-2xl font-black text-amber-300 tracking-wider break-all select-all min-h-[64px] flex items-center shadow-inner"
              >
                {result || (error ? '—' : 'Enter value...')}
              </div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            disabled={!result || !!error}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Result'}
          </button>
        </div>
      </div>

      {/* Arithmetic Decomposition Breakdown */}
      {breakdown.length > 0 && !error && (
        <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
          <h3 className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Decomposition Breakdown Calculation
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {breakdown.map((item, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 shadow-xs">
                <strong>{item.symbol}</strong> = {item.partNum}
              </span>
            ))}
            <span className="text-amber-700 dark:text-amber-400 font-bold ml-1">
              &rarr; Total = {isArabicInput ? result : inputVal}
            </span>
          </div>
        </div>
      )}

      {/* Classical Roman Numerals Cheat Sheet */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-amber-500" /> Classical Roman Numerals Value Matrix
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 text-center text-xs">
          {[
            { sym: 'I', val: 1 },
            { sym: 'V', val: 5 },
            { sym: 'X', val: 10 },
            { sym: 'L', val: 50 },
            { sym: 'C', val: 100 },
            { sym: 'D', val: 500 },
            { sym: 'M', val: 1000 }
          ].map(item => (
            <div key={item.sym} className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
              <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 block">{item.sym}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
