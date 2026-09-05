import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Copy, 
  Check, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  RotateCcw,
  BookOpen,
  ArrowRight,
  Sun
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalLeapYearMatrixCalculatorProps {
  onBackToGrid?: () => void;
}

const YEAR_PRESETS = [
  { label: 'Current Year (2026)', val: 2026 },
  { label: 'Recent Leap (2024)', val: 2024 },
  { label: 'Next Leap (2028)', val: 2028 },
  { label: 'Century Leap (2000)', val: 2000 },
  { label: 'Not a Leap (1900)', val: 1900 },
  { label: 'Future Century (2100)', val: 2100 }
];

export const UniversalLeapYearMatrixCalculator: React.FC<UniversalLeapYearMatrixCalculatorProps> = ({ onBackToGrid }) => {
  const [yearInput, setYearInput] = useState<number>(2026);
  const [copied, setCopied] = useState<boolean>(false);

  // Mathematical logic according to Gregorian Calendar rules
  const {
    isLeapYear,
    ruleDiv4,
    ruleDiv100,
    ruleDiv400,
    totalDays,
    februaryDays,
    explanation,
    nearbyLeapYears,
    calendarInfo
  } = useMemo(() => {
    const y = Math.floor(yearInput);
    const div4 = y % 4 === 0;
    const div100 = y % 100 === 0;
    const div400 = y % 400 === 0;

    // Standard Gregorian leap year algorithm:
    // A year is a leap year if it is divisible by 4, except if it is divisible by 100 unless also divisible by 400.
    const leap = (div4 && !div100) || div400;

    let explainText = '';
    if (div400) {
      explainText = `${y} is divisible by 400, so it is a Quadricentennial Leap Year despite ending in 00.`;
    } else if (div100) {
      explainText = `${y} is divisible by 100 but NOT 400, making it a Common Year (Century Exception).`;
    } else if (div4) {
      explainText = `${y} is divisible by 4 and not a century year, making it a standard Leap Year.`;
    } else {
      explainText = `${y} is not divisible by 4 (remainder ${y % 4}), making it a Common Year.`;
    }

    // Find 3 past and 3 future leap years
    const findNearbyLeaps = () => {
      const past: number[] = [];
      const future: number[] = [];
      let testY = y - 1;
      while (past.length < 3 && testY >= 1) {
        if ((testY % 4 === 0 && testY % 100 !== 0) || testY % 400 === 0) {
          past.push(testY);
        }
        testY--;
      }
      testY = y + 1;
      while (future.length < 3 && testY <= 9999) {
        if ((testY % 4 === 0 && testY % 100 !== 0) || testY % 400 === 0) {
          future.push(testY);
        }
        testY++;
      }
      return { past: past.reverse(), future };
    };

    // Calculate calendar day details
    const jan1 = new Date(y, 0, 1).toLocaleDateString('en-US', { weekday: 'long' });
    const dec31 = new Date(y, 11, 31).toLocaleDateString('en-US', { weekday: 'long' });

    return {
      isLeapYear: leap,
      ruleDiv4: div4,
      ruleDiv100: div100,
      ruleDiv400: div400,
      totalDays: leap ? 366 : 365,
      februaryDays: leap ? 29 : 28,
      explanation: explainText,
      nearbyLeapYears: findNearbyLeaps(),
      calendarInfo: {
        jan1Day: jan1,
        dec31Day: dec31,
        weeksCount: leap ? '52 weeks + 2 days' : '52 weeks + 1 day',
        solarDeviation: leap ? '+44 minutes over astronomical year' : '-5 hours 48 minutes under astronomical year'
      }
    };
  }, [yearInput]);

  const handleCopySummary = () => {
    const summary = `Year: ${yearInput}\nStatus: ${isLeapYear ? 'Leap Year (366 Days, Feb 29)' : 'Common Year (365 Days, Feb 28)'}\nReason: ${explanation}\nDivisible by 4: ${ruleDiv4 ? 'Yes' : 'No'}\nDivisible by 100: ${ruleDiv100 ? 'Yes' : 'No'}\nDivisible by 400: ${ruleDiv400 ? 'Yes' : 'No'}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="leap-year-calculator-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/20 dark:border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Leap Year Boundary Mathematics &amp; Calendar Matrix
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Gregorian Modulo 400
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate astronomical leap year boundary rules, February calendar lengths, and century exceptions
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

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {YEAR_PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setYearInput(p.val);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-amber-300 transition-colors cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Slider & Year Field */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label htmlFor="year-input-field" className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select or Enter Calendar Year (1 - 4000)
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Gregorian calendar system established in 1582 AD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="year-input-field"
              type="number"
              min="1"
              max="9999"
              value={yearInput}
              onChange={(e) => setYearInput(parseInt(e.target.value, 10) || 1)}
              className="w-32 px-3 py-2 font-mono text-xl font-black rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <div className="flex gap-1">
              <button
                onClick={() => {
                  setYearInput(prev => Math.max(1, prev - 1));
                  playSound('tap');
                }}
                className="px-2.5 py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer"
              >
                -1
              </button>
              <button
                onClick={() => {
                  setYearInput(prev => prev + 1);
                  playSound('tap');
                }}
                className="px-2.5 py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer"
              >
                +1
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <input
            type="range"
            min="1600"
            max="2500"
            value={yearInput}
            onChange={(e) => setYearInput(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>1600 AD</span>
            <span>2000 (Y2K)</span>
            <span>2026 (Now)</span>
            <span>2400 AD</span>
            <span>2500 AD</span>
          </div>
        </div>
      </div>

      {/* Status Hero Card */}
      <div className={`p-6 rounded-3xl border shadow-lg transition-all duration-300 ${
        isLeapYear 
          ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border-emerald-500/30' 
          : 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/5 border-amber-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md ${
              isLeapYear ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-amber-600 shadow-amber-500/20'
            }`}>
              {isLeapYear ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>
            <div>
              <span className={`text-xs font-black uppercase tracking-wider ${isLeapYear ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                Calendar Classification
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {yearInput} is a {isLeapYear ? 'LEAP YEAR' : 'COMMON YEAR'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                {explanation}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Days</span>
              <span className="font-mono text-2xl font-black text-slate-900 dark:text-white">
                {totalDays} Days
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                Feb has <strong>{februaryDays} days</strong>
              </span>
            </div>

            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center gap-1.5 shadow-md transition-colors cursor-pointer shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* 3 Step Mathematical Modulo Rule Validation Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Rule 1: % 4 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rule 1: Modulo 4</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ruleDiv4 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400'
            }`}>
              {ruleDiv4 ? 'DIVISIBLE (PASS)' : 'NOT DIVISIBLE'}
            </span>
          </div>
          <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {yearInput} ÷ 4 = {(yearInput / 4).toFixed(2)} (rem {yearInput % 4})
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {ruleDiv4 ? 'Satisfies the primary 4-year orbital alignment condition.' : 'Fails basic leap year divisibility.'}
          </p>
        </div>

        {/* Rule 2: % 100 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rule 2: Century (÷ 100)</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ruleDiv100 ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400'
            }`}>
              {ruleDiv100 ? 'CENTURY YEAR' : 'NON-CENTURY'}
            </span>
          </div>
          <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {yearInput} ÷ 100 = {(yearInput / 100).toFixed(2)} (rem {yearInput % 100})
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {ruleDiv100 ? 'Century years are skipped unless passing Rule 3.' : 'Not a turn-of-century year.'}
          </p>
        </div>

        {/* Rule 3: % 400 */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Rule 3: Quadricentennial</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ruleDiv400 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400'
            }`}>
              {ruleDiv400 ? 'DIVISIBLE (OVERRIDE)' : 'NOT ÷ 400'}
            </span>
          </div>
          <div className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {yearInput} ÷ 400 = {(yearInput / 400).toFixed(2)} (rem {yearInput % 400})
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {ruleDiv400 ? '400-year cycle overrides century rule (e.g. 2000, 2400).' : 'Standard century exclusion remains in effect.'}
          </p>
        </div>
      </div>

      {/* Calendar Details & Nearby Leap Years */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calendar Day Landmarks */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            Calendar Landmark Milestones ({yearInput})
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Starts on (Jan 1)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{calendarInfo.jan1Day}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Ends on (Dec 31)</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{calendarInfo.dec31Day}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Year Span Length</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{calendarInfo.weeksCount}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-500">Solar Drift Delta</span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">{calendarInfo.solarDeviation}</span>
            </div>
          </div>
        </div>

        {/* Nearby Chronological Leap Years */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-orange-500" />
            Chronological Nearby Leap Years
          </h3>

          <div className="space-y-2 text-xs">
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Previous Leap Years:</span>
              <div className="flex gap-2">
                {nearbyLeapYears.past.map(y => (
                  <button
                    key={y}
                    onClick={() => { setYearInput(y); playSound('click'); }}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-amber-100 dark:hover:bg-amber-950/60 font-mono font-bold text-slate-700 dark:text-slate-300 text-center transition-colors cursor-pointer"
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <span className="text-[11px] text-slate-400 block mb-1">Upcoming Leap Years:</span>
              <div className="flex gap-2">
                {nearbyLeapYears.future.map(y => (
                  <button
                    key={y}
                    onClick={() => { setYearInput(y); playSound('click'); }}
                    className="flex-1 py-1 px-2 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-center transition-colors cursor-pointer"
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
