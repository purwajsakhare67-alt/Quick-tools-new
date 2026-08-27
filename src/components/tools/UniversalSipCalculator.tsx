import React, { useState } from 'react';
import { TrendingUp, ArrowLeft, BarChart3, Copy, Check, Flame } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { playSound } from '../../utils/audioFeedback';

export const UniversalSipCalculator: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [monthly, setMonthly] = useState<number>(currency === 'INR' ? 10000 : 500);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);

  const months = years * 12;
  const i = rate / 12 / 100;
  const totalInvested = monthly * months;
  const totalValue = monthly * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
  const estimatedReturns = Math.max(0, totalValue - totalInvested);
  const multiplier = totalInvested > 0 ? (totalValue / totalInvested).toFixed(2) : '1.0';

  const handleCopy = () => {
    playSound('success');
    const text = `📈 Systematic Investment Plan (SIP) Calculation (${currency}):\n` +
      `• Monthly Investment: ${format(monthly)}\n` +
      `• Expected Return: ${rate}% p.a. over ${years} years\n` +
      `• Total Invested: ${format(totalInvested)}\n` +
      `• Estimated Returns: +${format(estimatedReturns)}\n` +
      `👉 FINAL CORPUS VALUE: ${format(totalValue)} (${multiplier}x growth)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSliderChange = (setter: (val: number) => void, val: number) => {
    setter(val);
    playSound('sliderTick');
  };

  return (
    <div className="space-y-6" id="sip-tool-content">
      {/* Universal Currency Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-white/10 hover:bg-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Global Currency:</span>
        </div>
        <CurrencySelectorBar variant="pills" />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Monthly Investment</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{format(monthly)}</span>
          </div>
          <input 
            type="range" 
            min={currency === 'INR' ? 500 : 50} 
            max={currency === 'INR' ? 200000 : 10000} 
            step={currency === 'INR' ? 500 : 50}
            value={monthly} 
            onChange={(e) => setMonthly(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Expected Return (p.a.)</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{rate}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="0.5"
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Time Period (Years)</span>
            <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{years} Yrs</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="40" 
            step="1"
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer"
          />
        </div>
      </div>

      {/* Visual Result Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-center">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Invested</div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white font-mono">
            {format(totalInvested)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-center">
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Estimated Returns</div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            +{format(estimatedReturns)}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-purple-500/20 to-cyan-500/20 border border-fuchsia-500/30 text-center shadow-lg shadow-purple-500/10">
          <div className="text-xs font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider mb-1">Total Future Value</div>
          <div className="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 font-mono">
            {format(totalValue)}
          </div>
        </div>
      </div>

      {/* Dynamic Ratio Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
          <span>Principal: {Math.round((totalInvested / Math.max(1, totalValue)) * 100)}%</span>
          <span>Returns: {Math.round((estimatedReturns / Math.max(1, totalValue)) * 100)}%</span>
        </div>
        <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300" 
            style={{ width: `${(totalInvested / Math.max(1, totalValue)) * 100}%` }}
          />
          <div 
            className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full transition-all duration-300" 
            style={{ width: `${(estimatedReturns / Math.max(1, totalValue)) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied' : 'Copy SIP Summary'}</span>
        </button>
      </div>
    </div>
  );
};
