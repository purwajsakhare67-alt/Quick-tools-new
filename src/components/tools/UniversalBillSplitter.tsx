import React, { useState } from 'react';
import { Receipt, ArrowLeft, Copy, Check, Utensils, Users, Percent, Gift } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalBillSplitter: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, CurrencySelectorBar } = useCurrency();

  const [billAmount, setBillAmount] = useState<number>(currency === 'INR' ? 3600 : 120);
  const [tipPercent, setTipPercent] = useState<number>(15);
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [rounding, setRounding] = useState<'none' | '1' | '5'>('none');
  const [copied, setCopied] = useState<boolean>(false);

  // Computations
  const totalTip = (billAmount * tipPercent) / 100;
  const totalWithTip = billAmount + totalTip;
  const rawPerPerson = peopleCount > 0 ? totalWithTip / peopleCount : 0;
  
  let perPersonFinal = rawPerPerson;
  if (rounding === '1') perPersonFinal = Math.ceil(rawPerPerson);
  else if (rounding === '5') perPersonFinal = Math.ceil(rawPerPerson / 5) * 5;

  const tipPerPerson = peopleCount > 0 ? totalTip / peopleCount : 0;
  const basePerPerson = peopleCount > 0 ? billAmount / peopleCount : 0;

  const handleCopySplit = () => {
    const summary = `🧾 Smart Bill Split Breakdown (${currency}):\n` +
      `• Total Bill: ${format(billAmount, 2)}\n` +
      `• Tip (${tipPercent}%): ${format(totalTip, 2)}\n` +
      `• Grand Total: ${format(totalWithTip, 2)}\n` +
      `• Group Size: ${peopleCount} People\n` +
      `👉 EACH PERSON PAYS: ${format(perPersonFinal, 2)}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="split-tool-content">
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
        {/* Card 1: Per Person */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-teal-500" />
              Each Person Pays
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal-500/20 text-teal-600 dark:text-teal-300 font-bold">
              {peopleCount} People
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(perPersonFinal, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Base {format(basePerPerson, 2)} + Tip {format(tipPerPerson, 2)}
          </div>
        </div>

        {/* Card 2: Total Tip */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Total Tip ({tipPercent}%)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono">
              Gratuity
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            +{format(totalTip, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {format(tipPerPerson, 2)} tip contribution per person
          </div>
        </div>

        {/* Card 3: Grand Total */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            <span>Grand Total With Tip</span>
            <span className="p-1 rounded-md bg-slate-200 dark:bg-white/10 font-mono text-xs">{symbol}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            {format(totalWithTip, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Bill {format(billAmount, 2)} + Tip
          </div>
        </div>
      </div>

      {/* Input controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Bill Amount */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Total Bill Amount</label>
            <span className="font-mono text-teal-600 dark:text-teal-300">{format(billAmount, 2)}</span>
          </div>
          <input 
            type="number" 
            min={1} 
            value={billAmount} 
            onChange={(e) => setBillAmount(Math.max(0, Number(e.target.value) || 0))}
            className="w-full p-2.5 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-sm font-bold font-mono"
          />
        </div>

        {/* Tip % */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Tip Percentage</label>
            <span className="font-mono text-purple-600 dark:text-purple-300">{tipPercent}%</span>
          </div>
          <div className="flex gap-1.5 mb-2">
            {[0, 10, 15, 18, 20].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipPercent(t)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold ${
                  tipPercent === t ? 'bg-purple-600 text-white' : 'bg-white dark:bg-white/10 text-slate-700 dark:text-white/70'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
          <input 
            type="range" 
            min={0} 
            max={35} 
            value={tipPercent} 
            onChange={(e) => setTipPercent(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* People Count */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Number of People</label>
            <span className="font-mono text-teal-600 dark:text-teal-300">{peopleCount} Splitters</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 font-bold"
            >
              -
            </button>
            <input 
              type="number" 
              min={1} 
              max={100} 
              value={peopleCount} 
              onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value) || 1))}
              className="w-full p-2 rounded-xl bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 text-center font-bold font-mono"
            />
            <button
              type="button"
              onClick={() => setPeopleCount(peopleCount + 1)}
              className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-white/10 font-bold"
            >
              +
            </button>
          </div>
        </div>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleCopySplit}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Split Breakdown'}</span>
        </button>
      </div>
    </div>
  );
};
