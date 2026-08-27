import React, { useState } from 'react';
import { PiggyBank, ArrowLeft, BarChart3, Copy, Check } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalFdRdAnalyzer: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [mode, setMode] = useState<'fd' | 'rd'>('fd');
  const [amount, setAmount] = useState<number>(currency === 'INR' ? 500000 : 25000);
  const [interestRate, setInterestRate] = useState<number>(5.5);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [compoundingFreq, setCompoundingFreq] = useState<number>(4); // 4 = quarterly
  const [copied, setCopied] = useState<boolean>(false);

  const rDecimal = interestRate / 100;
  const n = compoundingFreq;
  const t = tenureYears;

  let totalPrincipal = 0;
  let maturityAmount = 0;
  let totalInterest = 0;

  if (mode === 'fd') {
    totalPrincipal = amount;
    maturityAmount = totalPrincipal * Math.pow(1 + rDecimal / n, n * t);
    totalInterest = Math.max(0, maturityAmount - totalPrincipal);
  } else {
    // Recurring Deposit
    const monthlyDeposit = amount;
    const totalMonths = t * 12;
    totalPrincipal = monthlyDeposit * totalMonths;
    // Standard RD compound formula
    maturityAmount = 0;
    for (let m = 1; m <= totalMonths; m++) {
      const remainingMonths = totalMonths - m + 1;
      maturityAmount += monthlyDeposit * Math.pow(1 + rDecimal / n, (n * remainingMonths) / 12);
    }
    totalInterest = Math.max(0, maturityAmount - totalPrincipal);
  }

  const handleCopy = () => {
    const text = `🏦 Fixed Term / Certificate of Deposit (${mode.toUpperCase()}) Analysis (${currency}):\n` +
      `• Mode: ${mode === 'fd' ? 'Lump-Sum Fixed Term' : 'Recurring Monthly Deposit'}\n` +
      `• Principal: ${format(totalPrincipal)}\n` +
      `• Interest Rate: ${interestRate}% p.a. over ${tenureYears} Years\n` +
      `• Guaranteed Interest: +${format(totalInterest, 2)}\n` +
      `👉 MATURITY PAYOUT: ${format(maturityAmount, 2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="fdrd-tool-content">
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

      <div className="flex justify-center">
        <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-white/10 flex gap-2">
          <button
            type="button"
            onClick={() => setMode('fd')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'fd' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-600 dark:text-white/60'
            }`}
          >
            Fixed Deposit / Term CD
          </button>
          <button
            type="button"
            onClick={() => setMode('rd')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'rd' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-600 dark:text-white/60'
            }`}
          >
            Recurring Deposit (RD)
          </button>
        </div>
      </div>

      {/* 3 Output Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span className="flex items-center gap-1">
              <PiggyBank className="w-3.5 h-3.5 text-cyan-500" />
              Total Maturity Payout
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
              Guaranteed
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 tracking-tight">
            {format(maturityAmount, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            After {tenureYears} Years @ {interestRate}% p.a.
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Interest Earned</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono">
              Yield
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            +{format(totalInterest, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {((totalInterest / Math.max(1, maturityAmount)) * 100).toFixed(1)}% gain
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Total Capital Deposited</span>
            <span className="p-1 rounded-md bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono text-xs">{symbol}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(totalPrincipal)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {mode === 'fd' ? 'One-time lump sum' : `${tenureYears * 12} monthly installments`}
          </div>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>{mode === 'fd' ? 'Deposit Amount' : 'Monthly Recurring Deposit'}</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(amount)}</span>
          </div>
          <input 
            type="range" 
            min={currency === 'INR' ? 5000 : 500} 
            max={currency === 'INR' ? 5000000 : 250000} 
            step={currency === 'INR' ? 5000 : 500}
            value={amount} 
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Annual Interest Rate</label>
            <span className="font-mono text-emerald-500">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min={1} 
            max={15} 
            step={0.1}
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Tenure (Years)</label>
            <span className="font-mono text-purple-600 dark:text-purple-300">{tenureYears} Yrs</span>
          </div>
          <input 
            type="range" 
            min={1} 
            max={15} 
            step={1}
            value={tenureYears} 
            onChange={(e) => setTenureYears(Number(e.target.value))}
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
          <span>{copied ? 'Summary Copied' : 'Copy Maturity Schedule'}</span>
        </button>
      </div>
    </div>
  );
};
