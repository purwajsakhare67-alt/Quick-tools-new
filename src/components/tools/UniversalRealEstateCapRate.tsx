import React, { useState } from 'react';
import { Building2, ArrowLeft, PieChart, Copy, Check, DollarSign, Scale } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalRealEstateCapRate: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [purchasePrice, setPurchasePrice] = useState<number>(currency === 'INR' ? 7500000 : 450000);
  const [monthlyRent, setMonthlyRent] = useState<number>(currency === 'INR' ? 40000 : 3200);
  const [vacancyPct, setVacancyPct] = useState<number>(5); // 5% vacancy
  const [annualTaxes, setAnnualTaxes] = useState<number>(currency === 'INR' ? 30000 : 4500);
  const [annualInsurance, setAnnualInsurance] = useState<number>(currency === 'INR' ? 15000 : 1800);
  const [annualMaintenance, setAnnualMaintenance] = useState<number>(currency === 'INR' ? 25000 : 2500);
  const [copied, setCopied] = useState<boolean>(false);

  const grossAnnualRent = monthlyRent * 12;
  const vacancyLoss = (grossAnnualRent * vacancyPct) / 100;
  const effectiveGrossIncome = grossAnnualRent - vacancyLoss;

  const totalOperatingExpenses = annualTaxes + annualInsurance + annualMaintenance;
  const netOperatingIncome = effectiveGrossIncome - totalOperatingExpenses; // NOI

  const capRate = purchasePrice > 0 ? (netOperatingIncome / purchasePrice) * 100 : 0;
  const grossRentMultiplier = grossAnnualRent > 0 ? (purchasePrice / grossAnnualRent).toFixed(2) : '0';
  const monthlyCashflow = netOperatingIncome / 12;

  const handleCopySummary = () => {
    const text = `🏢 Real Estate Cap Rate & NOI Investment Analysis (${currency}):\n` +
      `• Property Price: ${format(purchasePrice)}\n` +
      `• Gross Annual Rental Income: ${format(grossAnnualRent)} (${format(monthlyRent)}/mo)\n` +
      `• Annual Operating Expenses: -${format(totalOperatingExpenses)}\n` +
      `• Net Operating Income (NOI): ${format(netOperatingIncome)}/yr (${format(monthlyCashflow)}/mo)\n` +
      `👉 CAPITALIZATION RATE (CAP RATE): ${capRate.toFixed(2)}%\n` +
      `👉 GROSS RENT MULTIPLIER (GRM): ${grossRentMultiplier}x`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="caprate-tool-content">
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
        {/* Card 1: Cap Rate */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-cyan-500" />
              Capitalization Rate (Cap Rate)
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold">
              Unlevered Yield
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 tracking-tight">
            {capRate.toFixed(2)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            NOI / Purchase Price ratio
          </div>
        </div>

        {/* Card 2: Net Operating Income */}
        <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span>Net Operating Income (NOI)</span>
            <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-mono text-xs">
              Annual
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {format(netOperatingIncome)}/yr
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {format(monthlyCashflow)} monthly net cashflow
          </div>
        </div>

        {/* Card 3: Gross Rent Multiplier */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Gross Rent Multiplier (GRM)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold">
              Valuation
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            {grossRentMultiplier}x
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Price to Gross Annual Rent Ratio
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Purchase Price */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Property Purchase Price</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(purchasePrice)}</span>
          </div>
          <input
            type="range"
            min={currency === 'INR' ? 1000000 : 50000}
            max={currency === 'INR' ? 50000000 : 2500000}
            step={currency === 'INR' ? 100000 : 10000}
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Monthly Gross Rent */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Monthly Gross Rent</label>
            <span className="font-mono text-emerald-600 dark:text-emerald-300">{format(monthlyRent)}/mo</span>
          </div>
          <input
            type="range"
            min={100}
            max={currency === 'INR' ? 300000 : 20000}
            step={currency === 'INR' ? 1000 : 100}
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Vacancy Rate % */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Estimated Vacancy Rate</label>
            <span className="font-mono text-amber-500">{vacancyPct}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={vacancyPct}
            onChange={(e) => setVacancyPct(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Annual Taxes */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Annual Property Taxes</label>
            <span className="font-mono text-rose-500">{format(annualTaxes)}/yr</span>
          </div>
          <input
            type="range"
            min={0}
            max={currency === 'INR' ? 200000 : 20000}
            step={currency === 'INR' ? 1000 : 100}
            value={annualTaxes}
            onChange={(e) => setAnnualTaxes(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Annual Insurance */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Annual Property Insurance</label>
            <span className="font-mono text-purple-500">{format(annualInsurance)}/yr</span>
          </div>
          <input
            type="range"
            min={0}
            max={currency === 'INR' ? 100000 : 10000}
            step={currency === 'INR' ? 500 : 50}
            value={annualInsurance}
            onChange={(e) => setAnnualInsurance(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Annual Maintenance & Repairs */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Annual Maintenance & Repairs</label>
            <span className="font-mono text-indigo-500">{format(annualMaintenance)}/yr</span>
          </div>
          <input
            type="range"
            min={0}
            max={currency === 'INR' ? 200000 : 15000}
            step={currency === 'INR' ? 1000 : 100}
            value={annualMaintenance}
            onChange={(e) => setAnnualMaintenance(Number(e.target.value))}
            className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

      </div>

      {/* Copy Actions */}
      <div className="flex justify-end">
        <button
          onClick={handleCopySummary}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Cap Rate Report'}</span>
        </button>
      </div>
    </div>
  );
};
