import React, { useState } from 'react';
import { Flame, ArrowLeft, BarChart3, Download, Copy, Check, ShieldCheck, TrendingUp, Hourglass } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';

export const UniversalFireRetirement: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retireAge, setRetireAge] = useState<number>(50);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(currency === 'INR' ? 50000 : 4000);
  const [currentSavings, setCurrentSavings] = useState<number>(currency === 'INR' ? 1000000 : 80000);
  const [monthlyInvest, setMonthlyInvest] = useState<number>(currency === 'INR' ? 35000 : 2500);
  const [returnRate, setReturnRate] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(3.5);
  const [fireMultiplier, setFireMultiplier] = useState<number>(25); // 25x = 4% rule, 33x = 3% rule
  const [copied, setCopied] = useState<boolean>(false);

  const yearsToRetire = Math.max(1, retireAge - currentAge);
  const annualExpensesToday = monthlyExpense * 12;

  // Future annual expenses at retirement adjusted for inflation
  const futureAnnualExpenses = annualExpensesToday * Math.pow(1 + inflationRate / 100, yearsToRetire);
  
  // Total FIRE Target Corpus
  const fireTargetCorpus = futureAnnualExpenses * fireMultiplier;

  // Year-by-year trajectory
  const trajectory: Array<{
    age: number;
    yearIndex: number;
    projectedWealth: number;
    targetCorpus: number;
  }> = [];

  let runningBalance = currentSavings;
  const r = returnRate / 100;
  const inf = inflationRate / 100;

  for (let y = 0; y <= yearsToRetire; y++) {
    const ageAtYear = currentAge + y;
    const expAtYear = annualExpensesToday * Math.pow(1 + inf, y);
    const targetAtYear = expAtYear * fireMultiplier;

    trajectory.push({
      age: ageAtYear,
      yearIndex: y,
      projectedWealth: Math.round(runningBalance),
      targetCorpus: Math.round(targetAtYear)
    });

    if (y < yearsToRetire) {
      // 12 months compounding
      for (let m = 1; m <= 12; m++) {
        runningBalance += monthlyInvest;
        runningBalance *= Math.pow(1 + r, 1 / 12);
      }
    }
  }

  const finalProjectedWealth = trajectory[trajectory.length - 1]?.projectedWealth || currentSavings;
  const fireSurplusOrDeficit = finalProjectedWealth - fireTargetCorpus;
  const isFireAchieved = fireSurplusOrDeficit >= 0;
  const fireReadinessPct = fireTargetCorpus > 0 ? Math.min(200, (finalProjectedWealth / fireTargetCorpus) * 100) : 100;

  const maxVal = Math.max(
    ...trajectory.map(t => Math.max(t.projectedWealth, t.targetCorpus)),
    1
  );

  const handleCopySummary = () => {
    const text = `🔥 F.I.R.E. (Financial Independence & Early Retirement) Plan (${currency}):\n` +
      `• Target Retirement Age: ${retireAge} (in ${yearsToRetire} years)\n` +
      `• Monthly Expenses Today: ${format(monthlyExpense)}\n` +
      `• Future Monthly Expenses (Adjusted for ${inflationRate}% Inflation): ${format(futureAnnualExpenses / 12)}\n` +
      `• Target FIRE Corpus Needed (${fireMultiplier}x Rule): ${format(fireTargetCorpus)}\n` +
      `• Projected Wealth at Age ${retireAge}: ${format(finalProjectedWealth)}\n` +
      `• Status: ${isFireAchieved ? `✅ ON TRACK (Surplus: +${format(fireSurplusOrDeficit)})` : `⚠️ GAP: -${format(Math.abs(fireSurplusOrDeficit))}`}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="fire-tool-content">
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
        {/* Card 1: FIRE Target Number */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 backdrop-blur-md relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Target FIRE Corpus
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-300 font-bold">
              {fireMultiplier}x Rule
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 tracking-tight">
            {format(fireTargetCorpus)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            At Age {retireAge} with {format(futureAnnualExpenses / 12)}/mo expenses
          </div>
        </div>

        {/* Card 2: Projected Wealth at Retirement */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Projected Wealth @ {retireAge}</span>
            <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-mono text-xs">
              {yearsToRetire} Yrs
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(finalProjectedWealth)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Growing at {returnRate}% p.a. with {format(monthlyInvest)}/mo savings
          </div>
        </div>

        {/* Card 3: Readiness Verdict */}
        <div className={`p-5 rounded-2xl border backdrop-blur-md ${
          isFireAchieved
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : 'bg-rose-500/10 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-1.5">
            <span className={isFireAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
              {isFireAchieved ? '🎉 FIRE Goal Achieved!' : '⚠️ Funding Gap'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isFireAchieved ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-300' : 'bg-rose-500/20 text-rose-600 dark:text-rose-300'
            }`}>
              {fireReadinessPct.toFixed(0)}% Funded
            </span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tracking-tight ${
            isFireAchieved ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {isFireAchieved ? `+${format(fireSurplusOrDeficit)}` : `-${format(Math.abs(fireSurplusOrDeficit))}`}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            {isFireAchieved ? 'Safe withdrawal covers 100% of lifelong expenses' : 'Increase monthly savings or adjust target retirement age'}
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* Current Age */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Current Age</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300">{currentAge} Yrs</span>
          </div>
          <input
            type="range"
            min={18}
            max={75}
            value={currentAge}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentAge(val);
              if (val >= retireAge) setRetireAge(val + 5);
            }}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Target Retire Age */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Target Retirement Age</label>
            <span className="font-mono text-amber-500">{retireAge} Yrs</span>
          </div>
          <input
            type="range"
            min={currentAge + 1}
            max={85}
            value={retireAge}
            onChange={(e) => setRetireAge(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Monthly Expenses Today */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Monthly Expenses (Today)</label>
            <span className="font-mono text-purple-600 dark:text-purple-300">{format(monthlyExpense)}</span>
          </div>
          <input
            type="range"
            min={500}
            max={currency === 'INR' ? 300000 : 25000}
            step={100}
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Current Net Worth / Savings */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Current Net Worth / Corpus</label>
            <span className="font-mono text-cyan-600 dark:text-cyan-300">{format(currentSavings)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={currency === 'INR' ? 10000000 : 1000000}
            step={currency === 'INR' ? 10000 : 1000}
            value={currentSavings}
            onChange={(e) => setCurrentSavings(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Monthly Investment Contribution */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Monthly Savings Added</label>
            <span className="font-mono text-emerald-600 dark:text-emerald-300">{format(monthlyInvest)}/mo</span>
          </div>
          <input
            type="range"
            min={0}
            max={currency === 'INR' ? 300000 : 20000}
            step={currency === 'INR' ? 1000 : 100}
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
        </div>

        {/* Pre-Retirement Return & Inflation */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label>Portfolio Return / Inflation</label>
            <span className="font-mono text-pink-500">{returnRate}% / {inflationRate}%</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
              placeholder="Return %"
              className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold"
            />
            <input
              type="number"
              value={inflationRate}
              onChange={(e) => setInflationRate(Number(e.target.value))}
              placeholder="Inflation %"
              className="p-2 rounded-xl bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* FIRE Multiplier Rule */}
        <div className="md:col-span-2 lg:col-span-3 space-y-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span>Safe Withdrawal Multiplier</span>
            <span className="text-slate-500 text-[11px]">Calculates total portfolio size from annual living expenses</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 20, label: '20x (LeanFIRE / 5% SWR)' },
              { id: 25, label: '25x (Trinity 4% Standard)' },
              { id: 30, label: '30x (Conservative 3.3% SWR)' },
              { id: 33, label: '33x (FatFIRE / 3% Ultra-Safe)' },
            ].map(m => (
              <button
                key={m.id}
                type="button"
                onClick={() => setFireMultiplier(m.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  fireMultiplier === m.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                    : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Trajectory Visualizer */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Projected Wealth vs. Target Corpus Curve
            </h4>
          </div>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Plan Copied' : 'Copy FIRE Plan'}</span>
          </button>
        </div>

        {/* Trajectory comparison bars */}
        <div className="h-52 w-full flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-white/10">
          {trajectory.map((t, idx) => {
            const wealthHeightPct = (t.projectedWealth / maxVal) * 100;
            const targetHeightPct = (t.targetCorpus / maxVal) * 100;

            return (
              <div key={t.age} className="flex-1 flex flex-col justify-end items-center h-full group relative">
                <div className="w-full flex items-end justify-center gap-0.5 sm:gap-1 h-full">
                  <div
                    className="w-1/2 bg-cyan-500 rounded-t-sm transition-all"
                    style={{ height: `${Math.max(4, wealthHeightPct)}%` }}
                    title={`Age ${t.age}: Projected ${format(t.projectedWealth)}`}
                  />
                  <div
                    className="w-1/2 bg-amber-500/50 rounded-t-sm transition-all border-t-2 border-amber-500"
                    style={{ height: `${Math.max(4, targetHeightPct)}%` }}
                    title={`Age ${t.age}: Target ${format(t.targetCorpus)}`}
                  />
                </div>
                {(trajectory.length <= 15 || idx % 3 === 0 || idx === trajectory.length - 1) && (
                  <span className="text-[9px] font-mono text-slate-400 dark:text-white/40 mt-1">
                    {t.age}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-white/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-cyan-500"></span>
              <span>Projected Wealth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-amber-500/50 border border-amber-500"></span>
              <span>Inflation-Adjusted Target Corpus</span>
            </div>
          </div>
          <span>Retirement Horizon: {yearsToRetire} Years</span>
        </div>
      </div>
    </div>
  );
};
