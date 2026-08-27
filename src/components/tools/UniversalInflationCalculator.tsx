import React, { useState } from 'react';
import { Hourglass, ArrowLeft, BarChart3, Copy, Check, TrendingDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalInflationCalculator: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [currentAmount, setCurrentAmount] = useState<number>(currency === 'INR' ? 100000 : 5000);
  const [inflationRate, setInflationRate] = useState<number>(3.5);
  const [years, setYears] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);

  const safeYears = Math.max(1, years);
  const infDecimal = inflationRate / 100;

  // Future equivalent cost: Amount * (1 + i)^n
  const futureEquivalentCost = currentAmount * Math.pow(1 + infDecimal, safeYears);

  // Purchasing power of today's amount in the future: Amount / (1 + i)^n
  const futurePurchasingPower = currentAmount / Math.pow(1 + infDecimal, safeYears);
  const purchasingPowerLossPct = ((currentAmount - futurePurchasingPower) / currentAmount) * 100;

  // Progression
  const points: Array<{ year: number; futureCost: number; purchasingPower: number }> = [];
  for (let y = 0; y <= safeYears; y++) {
    points.push({
      year: y,
      futureCost: Math.round(currentAmount * Math.pow(1 + infDecimal, y)),
      purchasingPower: Math.round(currentAmount / Math.pow(1 + infDecimal, y))
    });
  }

  const maxVal = Math.max(...points.map(p => p.futureCost), 1);

  const handleCopySummary = () => {
    const text = `⏳ Global Inflation & Purchasing Power Forecast (${currency}):\n` +
      `• Basket Value Today: ${format(currentAmount)}\n` +
      `• Expected Inflation: ${inflationRate}% p.a. over ${years} years\n` +
      `• Future Cost Required: ${format(futureEquivalentCost)} (+${((futureEquivalentCost / currentAmount - 1) * 100).toFixed(0)}%)\n` +
      `• Purchasing Power of ${format(currentAmount)} in ${years} yrs: ${format(futurePurchasingPower)} (-${purchasingPowerLossPct.toFixed(1)}% erosion)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="inflation-tool-content">
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
        {/* Card 1: Future Cost */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-600/10 via-orange-500/10 to-amber-500/10 border border-rose-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5 text-rose-500" />
              Future Required Cost
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
              +{((futureEquivalentCost / currentAmount - 1) * 100).toFixed(0)}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 tracking-tight">
            {format(futureEquivalentCost)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            To buy what {format(currentAmount)} buys today
          </div>
        </div>

        {/* Card 2: Future Purchasing Power */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Purchasing Power in {years} Yrs</span>
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono text-xs">
              Erosion
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {format(futurePurchasingPower)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Real worth of static cash after {years} years
          </div>
        </div>

        {/* Card 3: Total Power Loss */}
        <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            <span>Cumulative Power Loss</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-600 dark:text-rose-300 font-bold">
              Inflation Impact
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            -{purchasingPowerLossPct.toFixed(1)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Compounded @ {inflationRate}% per year
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Today's Cost / Living Budget */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="inf-cost">Current Cost / Living Expense</label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <span>{symbol}</span>
              <input
                id="inf-cost"
                type="number"
                min={1}
                max={50000000}
                step={100}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Math.max(1, Number(e.target.value) || 1))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={100}
            max={currency === 'INR' ? 1000000 : 50000}
            step={100}
            value={currentAmount}
            onChange={(e) => setCurrentAmount(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* 2. Annual Inflation Rate */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="inf-rate">Annual Inflation Rate (% p.a.)</label>
            <div className="flex items-center gap-1 font-mono text-rose-500 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <input
                id="inf-rate"
                type="number"
                min={0.1}
                max={30}
                step={0.1}
                value={inflationRate}
                onChange={(e) => setInflationRate(Math.max(0.1, Math.min(30, Number(e.target.value) || 0.1)))}
                className="w-14 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>%</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={0.25}
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* 3. Time Horizon in Years */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="inf-years">Time Horizon (Years)</label>
            <div className="flex items-center gap-1 font-mono text-amber-500 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs">
              <input
                id="inf-years"
                type="number"
                min={1}
                max={50}
                value={years}
                onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="w-12 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>Yrs</span>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={40}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

      </div>

      {/* Inflation Curve Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-rose-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Cost Escalation Curve Over {years} Years
            </h4>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Inflation Breakdown'}</span>
          </button>
        </div>

        <div className="h-48 w-full flex items-end gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-white/10">
          {points.map((p) => {
            const hPct = (p.futureCost / maxVal) * 100;
            return (
              <div key={p.year} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                <div
                  className="w-full bg-gradient-to-t from-rose-600 to-amber-500 rounded-t-md transition-all"
                  style={{ height: `${Math.max(6, hPct)}%` }}
                  title={`Year ${p.year}: Cost ${format(p.futureCost)}`}
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
