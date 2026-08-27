import React, { useState } from 'react';
import { Receipt, CheckCircle2, PieChart, ArrowLeft, Copy, Check, Globe } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalVatSalesTax: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, CurrencySelectorBar } = useCurrency();

  const [amount, setAmount] = useState<number>(1000);
  const [taxRate, setTaxRate] = useState<number>(20);
  const [taxType, setTaxType] = useState<'exclusive' | 'inclusive'>('exclusive');
  const [copied, setCopied] = useState<boolean>(false);

  // Global Presets
  const presets = [
    { name: 'US Avg Sales Tax', rate: 7.25, region: '🇺🇸 US' },
    { name: 'Australia GST', rate: 10, region: '🇦🇺 AU' },
    { name: 'Canada GST/HST', rate: 13, region: '🇨🇦 CA' },
    { name: 'EU Standard VAT', rate: 20, region: '🇪🇺 EU' },
    { name: 'UK Standard VAT', rate: 20, region: '🇬🇧 UK' },
    { name: 'Germany MwSt', rate: 19, region: '🇩🇪 DE' },
    { name: 'India Standard GST', rate: 18, region: '🇮🇳 IN' },
  ];

  let netAmount = 0;
  let taxAmount = 0;
  let grossAmount = 0;

  if (taxType === 'exclusive') {
    // Tax Exclusive: Amount entered is Net (Pre-Tax)
    netAmount = amount;
    taxAmount = (netAmount * taxRate) / 100;
    grossAmount = netAmount + taxAmount;
  } else {
    // Tax Inclusive: Amount entered is Gross (Post-Tax)
    grossAmount = amount;
    netAmount = grossAmount / (1 + taxRate / 100);
    taxAmount = grossAmount - netAmount;
  }

  const basePct = grossAmount > 0 ? (netAmount / grossAmount) * 100 : 100;
  const taxPct = grossAmount > 0 ? (taxAmount / grossAmount) * 100 : 0;

  const handleCopyInvoice = () => {
    const text = `🧾 Universal VAT & Sales Tax Invoice Breakdown (${currency}):\n` +
      `• Calculation Mode: ${taxType === 'exclusive' ? 'Tax Exclusive (Added to Base)' : 'Tax Inclusive (Extracted from Total)'}\n` +
      `• Net Pre-Tax Amount: ${format(netAmount, 2)}\n` +
      `• Tax Rate: ${taxRate}%\n` +
      `• Total Tax Paid: ${format(taxAmount, 2)}\n` +
      `👉 FINAL GROSS TOTAL: ${format(grossAmount, 2)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="vat-sales-tax-tool-content">
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
        {/* Card 1: Net Amount */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Net Price (Pre-Tax)</span>
            <span className="p-1 rounded-md bg-cyan-500/20 font-mono text-xs">{symbol}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(netAmount, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Base goods / services cost before {taxRate}% tax
          </div>
        </div>

        {/* Card 2: Total Tax Amount */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Tax Portion ({taxRate}%)</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 font-mono">
              VAT / GST
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            +{format(taxAmount, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {taxPct.toFixed(1)}% of final gross invoice
          </div>
        </div>

        {/* Card 3: Gross Total */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-teal-500/10 border border-blue-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-blue-500" />
              Gross Invoice Total
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-600 dark:text-blue-300 font-bold">
              Payable
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(grossAmount, 2)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            {taxType === 'exclusive' ? 'Added Tax' : 'Extracted Tax'} Included
          </div>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Toggle Mode: Tax Exclusive vs Inclusive */}
        <div className="md:col-span-2 space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 block">
            Tax Calculation Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-200/80 dark:bg-white/10">
            <button
              type="button"
              onClick={() => setTaxType('exclusive')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                taxType === 'exclusive'
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${taxType === 'exclusive' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Tax Exclusive (Add VAT/Tax to Base)</span>
            </button>

            <button
              type="button"
              onClick={() => setTaxType('inclusive')}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                taxType === 'inclusive'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${taxType === 'inclusive' ? 'opacity-100' : 'opacity-0'}`} />
              <span>Tax Inclusive (Extract VAT from Total)</span>
            </button>
          </div>
        </div>

        {/* 1. Base Amount Input & Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="vat-amount-input">
              {taxType === 'exclusive' ? 'Base / Net Amount' : 'Gross / Invoice Total'}
            </label>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <span>{symbol}</span>
              <input
                id="vat-amount-input"
                type="number"
                min={1}
                max={100000000}
                step={10}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                className="w-28 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input
            type="range"
            min={10}
            max={currency === 'INR' ? 1000000 : 50000}
            step={10}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>{symbol}10</span>
            <span>{format(currency === 'INR' ? 500000 : 25000)}</span>
            <span>{format(currency === 'INR' ? 1000000 : 50000)}</span>
          </div>
        </div>

        {/* 2. Tax Rate Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="vat-rate-input">VAT / GST / Sales Tax Rate</label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <input
                id="vat-rate-input"
                type="number"
                min={0}
                max={50}
                step={0.1}
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, Math.min(50, Number(e.target.value) || 0)))}
                className="w-14 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>%</span>
            </div>
          </div>

          {/* Quick preset buttons for global jurisdictions */}
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setTaxRate(preset.rate)}
                className={`py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                  taxRate === preset.rate
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-200 dark:hover:bg-white/20'
                }`}
              >
                {preset.region} {preset.rate}%
              </button>
            ))}
          </div>

          <input
            type="range"
            min={0}
            max={40}
            step={0.5}
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

      </div>

      {/* Visual Proportional Split Chart & Tax Breakdown */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Price vs. Tax Breakdown Matrix
            </h4>
          </div>

          <button
            onClick={handleCopyInvoice}
            className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Invoice Copied' : 'Copy Invoice Summary'}</span>
          </button>
        </div>

        {/* Visual Multi-Segment Bar */}
        <div className="space-y-2">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-200 dark:bg-white/10 shadow-inner">
            <div
              style={{ width: `${basePct}%` }}
              className="bg-cyan-500 hover:brightness-110 transition-all flex items-center justify-center text-[10px] font-bold text-white tracking-wide"
              title={`Base Price: ${basePct.toFixed(1)}%`}
            >
              {basePct > 15 && `Net: ${basePct.toFixed(1)}%`}
            </div>
            <div
              style={{ width: `${taxPct}%` }}
              className="bg-purple-500 hover:brightness-110 transition-all flex items-center justify-center text-[10px] font-bold text-white tracking-wide"
              title={`Tax: ${taxPct.toFixed(1)}%`}
            >
              {taxPct > 12 && `Tax: ${taxPct.toFixed(1)}%`}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-white/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
              <span>Net Price: {format(netAmount, 2)} ({basePct.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Tax Paid: {format(taxAmount, 2)} ({taxPct.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
