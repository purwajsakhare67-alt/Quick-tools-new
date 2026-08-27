import React, { useState } from 'react';
import { Coins, ArrowLeft, Copy, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalCryptoRoi: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [investment, setInvestment] = useState<number>(currency === 'INR' ? 50000 : 1000);
  const [buyPrice, setBuyPrice] = useState<number>(currency === 'INR' ? 4500000 : 65000);
  const [sellPrice, setSellPrice] = useState<number>(currency === 'INR' ? 7000000 : 95000);
  const [investmentFeePct, setInvestmentFeePct] = useState<number>(0.1);
  const [exitFeePct, setExitFeePct] = useState<number>(0.1);
  const [copied, setCopied] = useState<boolean>(false);

  const safeBuy = Math.max(0.000001, buyPrice);
  const coinsOwned = investment / safeBuy;
  const grossExitValue = coinsOwned * sellPrice;

  const entryFee = (investment * investmentFeePct) / 100;
  const exitFee = (grossExitValue * exitFeePct) / 100;
  const totalFees = entryFee + exitFee;

  const netExitValue = Math.max(0, grossExitValue - exitFee);
  const netProfit = netExitValue - investment - entryFee;
  const roiPct = investment > 0 ? (netProfit / investment) * 100 : 0;
  const isProfit = netProfit >= 0;

  const handleCopy = () => {
    const text = `🪙 Crypto ROI & Profit/Loss Calculation (${currency}):\n` +
      `• Initial Investment: ${format(investment)}\n` +
      `• Buy Price: ${format(buyPrice)} | Sell Target: ${format(sellPrice)}\n` +
      `• Coins Accumulated: ${coinsOwned.toFixed(6)}\n` +
      `• Exchange Fees: -${format(totalFees, 2)}\n` +
      `👉 NET PROFIT/LOSS: ${isProfit ? '+' : ''}${format(netProfit, 2)} (${roiPct.toFixed(2)}% ROI)\n` +
      `👉 FINAL PORTFOLIO CASH-OUT: ${format(netExitValue, 2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="crypto-tool-content">
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
        {/* Card 1 */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md ${
          isProfit ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-1.5">
            <span className={isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {isProfit ? 'Net Capital Gain' : 'Net Loss'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isProfit ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
            }`}>
              {roiPct.toFixed(2)}% ROI
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {isProfit ? `+${format(netProfit, 2)}` : format(netProfit, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            After {format(totalFees, 2)} trading fees
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Total Exit Cashout</span>
            <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono text-xs">{symbol}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(netExitValue, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Initial {format(investment)} + PnL
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Tokens / Coins Acquired</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">Units</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight font-mono">
            {coinsOwned < 1 ? coinsOwned.toFixed(6) : coinsOwned.toFixed(4)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Purchased @ {format(buyPrice)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Investment Capital</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(investment)}</span>
          </div>
          <input 
            type="number" 
            value={investment} 
            onChange={(e) => setInvestment(Math.max(1, Number(e.target.value) || 1))}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-sm font-bold font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Buy Price per Unit</label>
            <span className="font-mono text-purple-600 dark:text-purple-300">{format(buyPrice)}</span>
          </div>
          <input 
            type="number" 
            value={buyPrice} 
            onChange={(e) => setBuyPrice(Math.max(0.000001, Number(e.target.value) || 0.000001))}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-sm font-bold font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Exit / Sell Target Price</label>
            <span className="font-mono text-emerald-600 dark:text-emerald-300">{format(sellPrice)}</span>
          </div>
          <input 
            type="number" 
            value={sellPrice} 
            onChange={(e) => setSellPrice(Math.max(0, Number(e.target.value) || 0))}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-sm font-bold font-mono"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied' : 'Copy ROI Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
