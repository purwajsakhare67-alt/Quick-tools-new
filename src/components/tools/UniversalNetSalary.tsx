import React, { useState, useEffect } from 'react';
import { Wallet, ArrowLeft, PieChart, Copy, Check, DollarSign, ShieldAlert, FileText } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalNetSalary: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, CurrencySelectorBar } = useCurrency();

  const [grossAnnual, setGrossAnnual] = useState<number>(currency === 'INR' ? 1200000 : 85000);
  const [region, setRegion] = useState<'us' | 'uk' | 'eu' | 'ca' | 'au' | 'in' | 'custom'>('us');
  
  // Custom & Global Parameters
  const [incomeTaxRate, setIncomeTaxRate] = useState<number>(22); // Effective estimated income tax %
  const [socialSecurityRate, setSocialSecurityRate] = useState<number>(7.65); // FICA / NI / Social Security %
  const [retirementPct, setRetirementPct] = useState<number>(5); // 401k / Pension / Super %
  const [monthlyHealthInsurance, setMonthlyHealthInsurance] = useState<number>(currency === 'INR' ? 1500 : 250);
  const [monthlyOtherDeductions, setMonthlyOtherDeductions] = useState<number>(0);
  const [taxRegimeIndia, setTaxRegimeIndia] = useState<'new' | 'old'>('new');
  const [copied, setCopied] = useState<boolean>(false);

  // Sync default values when currency or region changes
  useEffect(() => {
    if (currency === 'INR') {
      setRegion('in');
      setGrossAnnual(1200000);
    } else if (currency === 'GBP') {
      setRegion('uk');
      setGrossAnnual(55000);
    } else if (currency === 'EUR') {
      setRegion('eu');
      setGrossAnnual(65000);
    } else {
      setRegion('us');
      setGrossAnnual(85000);
    }
  }, [currency]);

  // Adjust rates when region changes
  const handleRegionChange = (newRegion: 'us' | 'uk' | 'eu' | 'ca' | 'au' | 'in' | 'custom') => {
    setRegion(newRegion);
    if (newRegion === 'us') {
      setIncomeTaxRate(22);
      setSocialSecurityRate(7.65); // FICA
      setRetirementPct(6);
      setMonthlyHealthInsurance(250);
    } else if (newRegion === 'uk') {
      setIncomeTaxRate(20);
      setSocialSecurityRate(8); // NI
      setRetirementPct(5);
      setMonthlyHealthInsurance(0);
    } else if (newRegion === 'eu') {
      setIncomeTaxRate(25);
      setSocialSecurityRate(12);
      setRetirementPct(4);
      setMonthlyHealthInsurance(150);
    } else if (newRegion === 'ca') {
      setIncomeTaxRate(24);
      setSocialSecurityRate(6.5); // CPP & EI
      setRetirementPct(5);
      setMonthlyHealthInsurance(100);
    } else if (newRegion === 'au') {
      setIncomeTaxRate(24.5);
      setSocialSecurityRate(2); // Medicare Levy
      setRetirementPct(11.5); // Super
      setMonthlyHealthInsurance(0);
    } else if (newRegion === 'in') {
      setIncomeTaxRate(15);
      setSocialSecurityRate(0);
      setRetirementPct(12); // EPF
      setMonthlyHealthInsurance(1500);
    }
  };

  // Calculations
  const grossMonthly = grossAnnual / 12;

  let annualIncomeTax = 0;
  let annualSocialSecurity = 0;
  let annualRetirement = (grossAnnual * retirementPct) / 100;
  let annualHealth = monthlyHealthInsurance * 12;
  let annualOther = monthlyOtherDeductions * 12;

  if (region === 'in') {
    // Specific Indian tax calculation
    const standardDeduction = taxRegimeIndia === 'new' ? 75000 : 50000;
    const taxable = Math.max(0, grossAnnual - standardDeduction);
    if (taxRegimeIndia === 'new') {
      if (taxable <= 700000) annualIncomeTax = 0;
      else if (taxable <= 1000000) annualIncomeTax = 20000 + (taxable - 700000) * 0.10;
      else if (taxable <= 1200000) annualIncomeTax = 50000 + (taxable - 1000000) * 0.15;
      else if (taxable <= 1500000) annualIncomeTax = 80000 + (taxable - 1200000) * 0.20;
      else annualIncomeTax = 140000 + (taxable - 1500000) * 0.30;
    } else {
      if (taxable <= 500000) annualIncomeTax = 0;
      else if (taxable <= 1000000) annualIncomeTax = 12500 + (taxable - 500000) * 0.20;
      else annualIncomeTax = 112500 + (taxable - 1000000) * 0.30;
    }
    annualIncomeTax *= 1.04; // 4% cess
  } else {
    annualIncomeTax = (grossAnnual * incomeTaxRate) / 100;
    annualSocialSecurity = (grossAnnual * socialSecurityRate) / 100;
  }

  const totalAnnualTaxes = annualIncomeTax + annualSocialSecurity;
  const totalAnnualDeductions = totalAnnualTaxes + annualRetirement + annualHealth + annualOther;
  const netAnnualTakeHome = Math.max(0, grossAnnual - totalAnnualDeductions);
  const netMonthlyTakeHome = netAnnualTakeHome / 12;

  const takeHomePct = grossAnnual > 0 ? (netAnnualTakeHome / grossAnnual) * 100 : 0;
  const taxesPct = grossAnnual > 0 ? (totalAnnualTaxes / grossAnnual) * 100 : 0;
  const benefitsPct = grossAnnual > 0 ? ((annualRetirement + annualHealth + annualOther) / grossAnnual) * 100 : 0;

  const handleCopySummary = () => {
    const text = `💵 Global Net Take-Home Salary Breakdown (${currency}):\n` +
      `• Gross Annual Salary: ${format(grossAnnual)}\n` +
      `• Gross Monthly: ${format(grossMonthly)}\n` +
      `• Total Taxes & Social Security: -${format(totalAnnualTaxes)} (${taxesPct.toFixed(1)}%)\n` +
      `• Retirement / Pension Saved: -${format(annualRetirement)} (${retirementPct}%)\n` +
      `• Health & Insurance: -${format(annualHealth)}\n` +
      `👉 NET MONTHLY TAKE-HOME PAY: ${format(netMonthlyTakeHome)}\n` +
      `👉 NET ANNUAL IN-HAND: ${format(netAnnualTakeHome)} (${takeHomePct.toFixed(1)}% of Gross)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="salary-tool-content">
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
        {/* Card 1: Net Monthly In-Hand */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
              Net Monthly Take-Home
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 font-bold">
              {takeHomePct.toFixed(0)}% of Gross
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(netMonthlyTakeHome)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            Annual in-pocket: {format(netAnnualTakeHome)}
          </div>
        </div>

        {/* Card 2: Taxes & Social Security */}
        <div className="p-5 rounded-2xl bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 mb-1.5">
            <span>Taxes & Social Security</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-600 dark:text-rose-300 font-mono">
              -{taxesPct.toFixed(1)}%
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
            -{format(totalAnnualTaxes / 12)}/mo
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Annual tax burden: {format(totalAnnualTaxes)}
          </div>
        </div>

        {/* Card 3: Retirement & Benefits */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Retirement / Benefits</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-600 dark:text-purple-300 font-mono">
              401k / Pension
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            +{format(annualRetirement / 12)}/mo
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Annual wealth saved: {format(annualRetirement)}
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Country / Tax System Selector */}
        <div className="space-y-2">
          <label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80 block">
            Select Tax Jurisdiction & Standard System
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { id: 'us', label: '🇺🇸 United States' },
              { id: 'uk', label: '🇬🇧 United Kingdom' },
              { id: 'ca', label: '🇨🇦 Canada' },
              { id: 'au', label: '🇦🇺 Australia' },
              { id: 'eu', label: '🇪🇺 European Union' },
              { id: 'in', label: '🇮🇳 India' },
              { id: 'custom', label: '⚙️ Custom Rates' },
            ].map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleRegionChange(r.id as any)}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all border text-center ${
                  region === r.id
                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-xs'
                    : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          
          {/* Gross Annual Compensation */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <label>Gross Annual Salary</label>
              <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(grossAnnual)}</span>
            </div>
            <input
              type="range"
              min={currency === 'INR' ? 200000 : 15000}
              max={currency === 'INR' ? 10000000 : 500000}
              step={currency === 'INR' ? 50000 : 2500}
              value={grossAnnual}
              onChange={(e) => setGrossAnnual(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
          </div>

          {/* Income Tax Rate % */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <label>Estimated Income Tax Rate</label>
              <span className="font-mono text-rose-500">{incomeTaxRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={0.5}
              value={incomeTaxRate}
              onChange={(e) => setIncomeTaxRate(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
          </div>

          {/* Social Security / Payroll Tax % */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <label>Social Security / FICA / NI</label>
              <span className="font-mono text-amber-500">{socialSecurityRate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={0.25}
              value={socialSecurityRate}
              onChange={(e) => setSocialSecurityRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
          </div>

          {/* Retirement / 401(k) / Pension Contribution % */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <label>Retirement Plan (401k/Super/Pension)</label>
              <span className="font-mono text-purple-600 dark:text-purple-300">{retirementPct}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={30}
              step={0.5}
              value={retirementPct}
              onChange={(e) => setRetirementPct(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
          </div>

          {/* Monthly Health Insurance */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <label>Health & Insurance (Monthly)</label>
              <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(monthlyHealthInsurance)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={currency === 'INR' ? 10000 : 1500}
              step={currency === 'INR' ? 250 : 25}
              value={monthlyHealthInsurance}
              onChange={(e) => setMonthlyHealthInsurance(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
          </div>

          {/* Other Monthly Deductions */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <label>Other Pre/Post-Tax Deductions</label>
              <span className="font-mono text-slate-600 dark:text-white/70">{format(monthlyOtherDeductions)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={currency === 'INR' ? 10000 : 1000}
              step={currency === 'INR' ? 250 : 25}
              value={monthlyOtherDeductions}
              onChange={(e) => setMonthlyOtherDeductions(Number(e.target.value))}
              className="w-full accent-slate-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
            />
          </div>

        </div>

      </div>

      {/* Proportional Salary Distribution Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Income Allocation Matrix
            </h4>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Summary Copied' : 'Copy Paycheck Breakdown'}</span>
          </button>
        </div>

        <div className="space-y-2">
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-200 dark:bg-white/10 shadow-inner">
            <div
              style={{ width: `${takeHomePct}%` }}
              className="bg-emerald-500 hover:brightness-110 transition-all flex items-center justify-center text-[10px] font-bold text-white tracking-wide"
            >
              {takeHomePct > 15 && `Take-Home: ${takeHomePct.toFixed(0)}%`}
            </div>
            <div
              style={{ width: `${taxesPct}%` }}
              className="bg-rose-500 hover:brightness-110 transition-all flex items-center justify-center text-[10px] font-bold text-white tracking-wide"
            >
              {taxesPct > 12 && `Taxes: ${taxesPct.toFixed(0)}%`}
            </div>
            <div
              style={{ width: `${benefitsPct}%` }}
              className="bg-purple-500 hover:brightness-110 transition-all flex items-center justify-center text-[10px] font-bold text-white tracking-wide"
            >
              {benefitsPct > 10 && `Benefits: ${benefitsPct.toFixed(0)}%`}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 dark:text-white/60">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Net Take-Home: {format(netAnnualTakeHome)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span>Taxes: {format(totalAnnualTaxes)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>Retirement & Benefits: {format(annualRetirement + annualHealth + annualOther)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
