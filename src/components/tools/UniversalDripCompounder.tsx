import React, { useState } from 'react';
import { RefreshCw, ArrowLeft, BarChart3, Copy, Check, TrendingUp } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalDripCompounder: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [sharePrice, setSharePrice] = useState<number>(currency === 'INR' ? 250 : 50);
  const [initialShares, setInitialShares] = useState<number>(1000);
  const [dividendYield, setDividendYield] = useState<number>(4.5);
  const [stockGrowth, setStockGrowth] = useState<number>(7.0);
  const [years, setYears] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);

  const initialCapital = sharePrice * initialShares;
  const g = stockGrowth / 100;
  const yDiv = dividendYield / 100;

  const trajectory: Array<{
    year: number;
    sharePrice: number;
    sharesHeldDrip: number;
    portfolioDrip: number;
    portfolioNoDrip: number;
  }> = [];

  let runningShares = initialShares;
  for (let y = 1; y <= years; y++) {
    const currentPrice = sharePrice * Math.pow(1 + g, y);
    const annualDiv = runningShares * currentPrice * yDiv;
    const newShares = annualDiv / currentPrice;
    runningShares += newShares;

    trajectory.push({
      year: y,
      sharePrice: Math.round(currentPrice),
      sharesHeldDrip: Math.round(runningShares),
      portfolioDrip: Math.round(runningShares * currentPrice),
      portfolioNoDrip: Math.round(initialShares * currentPrice)
    });
  }

  const finalDrip = trajectory[trajectory.length - 1] || { portfolioDrip: initialCapital, portfolioNoDrip: initialCapital, sharesHeldDrip: initialShares };
  const dripAdvantage = finalDrip.portfolioDrip - finalDrip.portfolioNoDrip;
  const dripAdvantagePct = finalDrip.portfolioNoDrip > 0 ? (dripAdvantage / finalDrip.portfolioNoDrip) * 100 : 0;

  const handleCopy = () => {
    const text = `💧 DRIP (Dividend Reinvestment Plan) Growth Analysis (${currency}):\n` +
      `• Initial Invested Capital: ${format(initialCapital)} (${initialShares} shares @ ${format(sharePrice)})\n` +
      `• Dividend Yield: ${dividendYield}% p.a. | Stock Appreciation: ${stockGrowth}% p.a.\n` +
      `• With DRIP Reinvestment (${years} yrs): ${format(finalDrip.portfolioDrip)} (${finalDrip.sharesHeldDrip} shares)\n` +
      `• Without DRIP (Cash Dividends): ${format(finalDrip.portfolioNoDrip)} (${initialShares} shares)\n` +
      `👉 DRIP COMPOUNDING ADVANTAGE: +${format(dripAdvantage)} (+${dripAdvantagePct.toFixed(1)}% extra corpus)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="drip-tool-content">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-teal-500/10 to-emerald-500/10 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-500" />
              DRIP Portfolio Value
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
              Reinvested
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 tracking-tight">
            {format(finalDrip.portfolioDrip)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            Accumulated {finalDrip.sharesHeldDrip.toLocaleString()} shares (+{((finalDrip.sharesHeldDrip / initialShares - 1) * 100).toFixed(0)}%)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>DRIP Alpha / Boost</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono">
              +{dripAdvantagePct.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            +{format(dripAdvantage)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Extra wealth generated by auto-reinvesting dividends
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>Without DRIP (Cash Out)</span>
            <span className="p-1 rounded-md bg-slate-200 dark:bg-white/10 font-mono text-xs">{initialShares} Shares</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {format(finalDrip.portfolioNoDrip)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Base stock price appreciation only
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Share Price & Initial Quantity</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(sharePrice)} / {initialShares} shares</span>
          </div>
          <input 
            type="range" 
            min={1} 
            max={currency === 'INR' ? 5000 : 500} 
            value={sharePrice} 
            onChange={(e) => setSharePrice(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Dividend Yield (% p.a.)</label>
            <span className="font-mono text-emerald-500">{dividendYield}%</span>
          </div>
          <input 
            type="range" 
            min={0.5} 
            max={15} 
            step={0.25}
            value={dividendYield} 
            onChange={(e) => setDividendYield(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Stock Price Growth & Horizon</label>
            <span className="font-mono text-purple-600 dark:text-purple-300">{stockGrowth}% / {years} Yrs</span>
          </div>
          <input 
            type="range" 
            min={1} 
            max={30} 
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied' : 'Copy DRIP Forecast'}</span>
        </button>
      </div>
    </div>
  );
};
