import React from 'react';
import { GlobalCurrency, CURRENCY_LIST } from '../utils/currency';
import { Globe } from 'lucide-react';

interface CurrencySelectorProps {
  currentCurrency: GlobalCurrency;
  onCurrencyChange: (c: GlobalCurrency) => void;
  className?: string;
  variant?: 'pills' | 'dropdown' | 'compact';
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  currentCurrency,
  onCurrencyChange,
  className = '',
  variant = 'pills'
}) => {
  if (variant === 'dropdown') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <select
          value={currentCurrency}
          onChange={(e) => onCurrencyChange(e.target.value as GlobalCurrency)}
          className="px-2.5 py-1 rounded-xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white font-bold text-xs outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer shadow-xs"
        >
          {CURRENCY_LIST.map((c) => (
            <option key={c.code} value={c.code} className="dark:bg-slate-900 text-slate-900 dark:text-white">
              {c.flag} {c.code} ({c.symbol}) - {c.name}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/10 border border-slate-300/60 dark:border-white/10 gap-1 ${className}`}>
        {CURRENCY_LIST.map((c) => {
          const isActive = currentCurrency === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onCurrencyChange(c.code)}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
              title={`${c.name} (${c.code})`}
            >
              <span>{c.flag}</span>
              <span className="font-mono">{c.symbol}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default pills
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 ${className}`}>
      <div className="flex items-center gap-1 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/40">
        <Globe className="w-3.5 h-3.5 text-cyan-500" />
        <span>Currency:</span>
      </div>
      <div className="flex items-center gap-1 flex-wrap">
        {CURRENCY_LIST.map((c) => {
          const isActive = currentCurrency === c.code;
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onCurrencyChange(c.code)}
              className={`px-2.5 py-1 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white shadow-sm shadow-purple-500/25 scale-102'
                  : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-white/80 hover:bg-slate-200/80 dark:hover:bg-white/15'
              }`}
            >
              <span>{c.flag}</span>
              <span className="font-mono">{c.code}</span>
              <span className="opacity-80 font-mono">({c.symbol})</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
