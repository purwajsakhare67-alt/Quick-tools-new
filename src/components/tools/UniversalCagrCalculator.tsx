import React, { useState } from 'react';
import { TrendingUp, ArrowLeft, BarChart3, Copy, Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalCagrCalculator: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [initialVal, setInitialVal] = useState<number>(currency === 'INR' ? 100000 : 10000);
  const [finalVal, setFinalVal] = useState<number>(currency === 'INR' ? 450000 : 45000);
  const [years, setYears] = useState<number>(5);
  const [copied, setCopied] = useState<boolean>(false);

  const safeInitial = Math.max(1, initialVal);
  const safeFinal = Math.max(0, finalVal);
  const safeYears = Math.max(0.1, years);

  // CAGR Formula: ((Final / Initial) ^ (1 / Years)) - 1
  const cagr = ((Math.pow(safeFinal / safeInitial, 1 / safeYears) - 1) * 100);
  
  // Total Absolute Return
  const absoluteReturn = ((safeFinal - safeInitial) / safeInitial) * 100;
  const netGain = safeFinal - safeInitial;
  const multiplier = (safeFinal / safeInitial).toFixed(2);

  // Growth trajectory points
  const points: Array<{ year: number; value: number }> = [];
  const rDecimal = cagr / 100;
  for (let y = 0; y <= Math.ceil(safeYears); y++) {
    const valAtY = safeInitial * Math.pow(1 + rDecimal, y);
    points.push({
      year: y,
      value: Math.round(valAtY)
    });
  }

  const maxVal = Math.max(...points.map(p => p.value), 1);

  const handleCopySummary = () => {
    const text = `📊 CAGR & Multi-Year Growth Metrics (${currency}):\n` +
      `• Starting Capital: ${format(safeInitial)}\n` +
      `• Ending Value: ${format(safeFinal)}\n` +
      `• Duration: ${years} Years\n` +
      `• Compound Annual Growth Rate (CAGR): ${cagr.toFixed(2)}% p.a.\n` +
      `• Total Absolute Gain: +${format(netGain)} (+${absoluteReturn.toFixed(1)}%)\n` +
      `• Wealth Multiplier: ${multiplier}x`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="cagr-tool-content">
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

      {/* 3 Major Live Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Compound Annual Growth Rate */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-amber-500/10 border border-purple-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
              CAGR (Annualized Return)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
              Annual Rate
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 tracking-tight">
            {cagr.toFixed(2)}% p.a.
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            Compound growth rate over {years} years
          </div>
        </div>

        {/* Card 2: Total Absolute Return */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Total Absolute Gain</span>
            <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono text-xs">
              {multiplier}x
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            +{format(netGain)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            +{absoluteReturn.toFixed(1)}% total capital growth
          </div>
        </div>

        {/* Card 3: Capital Multiplier */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Wealth Multiplier</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              Maturity
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {multiplier}x
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Grew from {formatShort(safeInitial)} to {formatShort(safeFinal)}
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Initial Investment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="cagr-initial">Initial Investment</label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>{symbol}</span>
              <input
                id="cagr-initial"
                type="number"
                min={1}
                max={50000000}
                step={100}
                value={initialVal}
                onChange={(e) => setInitialVal(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={currency === 'INR' ? 1000000 : 100000}
            step={100}
            value={initialVal}
            onChange={(e) => setInitialVal(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* 2. Final / Ending Value */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="cagr-final">Final / Ending Value</label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>{symbol}</span>
              <input
                id="cagr-final"
                type="number"
                min={1}
                max={500000000}
                step={100}
                value={finalVal}
                onChange={(e) => setFinalVal(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={currency === 'INR' ? 5000000 : 500000}
            step={100}
            value={finalVal}
            onChange={(e) => setFinalVal(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* 3. Duration in Years */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="cagr-years">Duration (Years)</label>
            <div className="flex items-center gap-1 font-mono text-pink-600 dark:text-pink-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <input
                id="cagr-years"
                type="number"
                min={0.1}
                max={50}
                step={0.5}
                value={years}
                onChange={(e) => setYears(Math.max(0.1, Math.min(50, Number(e.target.value) || 0.1)))}
                className="w-14 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>Yrs</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-pink-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

      </div>

      {/* Growth Curve Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Annualized Compounding Progression
            </h4>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy CAGR Summary'}</span>
          </button>
        </div>

        <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-white/10">
          {points.map((p) => {
            const hPct = (p.value / maxVal) * 100;
            return (
              <div key={p.year} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                <div
                  className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md transition-all"
                  style={{ height: `${Math.max(6, hPct)}%` }}
                  title={`Year ${p.year}: ${format(p.value)}`}
                />
                <span className="text-[9px] font-mono text-slate-400 dark:text-white/40 mt-1">
                  Y{p.year}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
