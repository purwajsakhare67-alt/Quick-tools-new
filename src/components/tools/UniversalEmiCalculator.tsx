import React, { useState } from 'react';
import { Calculator, ArrowLeft, Copy, Check, ShieldCheck } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalEmiCalculator: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [principal, setPrincipal] = useState<number>(currency === 'INR' ? 5000000 : 350000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [copied, setCopied] = useState<boolean>(false);

  const monthlyRate = interestRate / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayment - principal);

  const handleCopy = () => {
    const text = `💳 Loan EMI & Mortgage Payment Schedule (${currency}):\n` +
      `• Loan Principal: ${format(principal)}\n` +
      `• Interest Rate: ${interestRate}% p.a. over ${tenureYears} Years\n` +
      `👉 MONTHLY EMI PAYMENT: ${format(emi, 2)}\n` +
      `• Total Interest Payable: ${format(totalInterest, 2)}\n` +
      `• Total Lifetime Repayment: ${format(totalPayment, 2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="emi-tool-content">
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
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Loan Principal Amount</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{format(principal)}</span>
          </div>
          <input 
            type="range" 
            min={currency === 'INR' ? 100000 : 10000} 
            max={currency === 'INR' ? 20000000 : 2000000} 
            step={currency === 'INR' ? 100000 : 10000}
            value={principal} 
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Interest Rate (p.a.)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{interestRate}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            step="0.1" 
            value={interestRate} 
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-2">
            <span>Tenure (Years)</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{tenureYears} Yrs</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="30" 
            step="1"
            value={tenureYears} 
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">Monthly EMI</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {format(emi, 2)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Interest</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-mono">
            {format(totalInterest, 2)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 text-center">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Payment</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white font-mono">
            {format(totalPayment, 2)}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Summary Copied' : 'Copy Loan Summary'}</span>
        </button>
      </div>
    </div>
  );
};
