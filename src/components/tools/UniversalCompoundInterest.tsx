import React, { useState } from 'react';
import { Flame, ArrowLeft, BarChart3, Download, Copy, Check, Table, HelpCircle } from 'lucide-react';
import { useCurrency } from '../../context/CurrencyContext';
import { playSound } from '../../utils/audioFeedback';

export const UniversalCompoundInterest: React.FC<{ onBackToGrid?: () => void }> = ({ onBackToGrid }) => {
  const { currency, symbol, format, formatShort, CurrencySelectorBar } = useCurrency();

  const [principal, setPrincipal] = useState<number>(10000);
  const [contribution, setContribution] = useState<number>(500);
  const [contributionFreq, setContributionFreq] = useState<'monthly' | 'annually'>('monthly');
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [compoundFreq, setCompoundFreq] = useState<number>(12); // 365=daily, 12=monthly, 4=quarterly, 1=annually
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [showTable, setShowTable] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculate year by year progression
  const yearlyData: Array<{ year: number; invested: number; interest: number; totalValue: number }> = [];
  
  let currentBalance = principal;
  let runningInvested = principal;
  const n = compoundFreq; // compounding periods per year
  const rDecimal = rate / 100;

  for (let y = 1; y <= years; y++) {
    // 12 monthly steps within year
    for (let m = 1; m <= 12; m++) {
      if (contributionFreq === 'monthly' && contribution > 0) {
        currentBalance += contribution;
        runningInvested += contribution;
      } else if (contributionFreq === 'annually' && m === 1 && contribution > 0) {
        currentBalance += contribution;
        runningInvested += contribution;
      }
      // Monthly compounding factor
      currentBalance *= Math.pow(1 + rDecimal / n, n / 12);
    }

    const totalInterest = Math.max(0, currentBalance - runningInvested);
    yearlyData.push({
      year: y,
      invested: Math.round(runningInvested),
      interest: Math.round(totalInterest),
      totalValue: Math.round(currentBalance)
    });
  }

  const finalYear = yearlyData[yearlyData.length - 1] || {
    invested: principal,
    interest: 0,
    totalValue: principal
  };

  const totalInvestedAmount = finalYear.invested;
  const totalInterestEarned = finalYear.interest;
  const maturityFutureWealth = finalYear.totalValue;

  const interestMultiplier = totalInvestedAmount > 0 
    ? (maturityFutureWealth / totalInvestedAmount).toFixed(2)
    : '1.00';

  const maxVal = Math.max(...yearlyData.map(d => d.totalValue), 1);

  const handleCopySummary = () => {
    playSound('success');
    const text = `📈 Compound Interest Growth Summary (${currency}):\n` +
      `• Initial Principal: ${format(principal)}\n` +
      `• Regular Contribution: ${format(contribution)} (${contributionFreq})\n` +
      `• Annual Return: ${rate}% p.a. over ${years} years\n` +
      `• Total Invested: ${format(totalInvestedAmount)}\n` +
      `• Total Interest Earned: ${format(totalInterestEarned)}\n` +
      `• Final Wealth: ${format(maturityFutureWealth)} (${interestMultiplier}x growth)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="compound-interest-tool-content">
      
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
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Selected Currency:</span>
        </div>
        <CurrencySelectorBar variant="pills" />
      </div>

      {/* 3 Major Live Output Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Invested */}
        <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 backdrop-blur-md transition-all hover:border-cyan-500/40">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 mb-1.5">
            <span>Total Invested Amount</span>
            <span className="p-1 rounded-md bg-cyan-500/20 font-mono">{symbol}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {format(totalInvestedAmount)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            Principal {formatShort(principal)} + regular contributions
          </div>
        </div>

        {/* Card 2: Total Interest */}
        <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 backdrop-blur-md transition-all hover:border-purple-500/40">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-1.5">
            <span>Total Interest Earned</span>
            <span className="p-1 rounded-md bg-purple-500/20">📈</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-300 tracking-tight">
            +{format(totalInterestEarned)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1">
            {((totalInterestEarned / Math.max(1, maturityFutureWealth)) * 100).toFixed(1)}% of total corpus
          </div>
        </div>

        {/* Card 3: Maturity Value / Future Wealth */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/10 via-pink-500/10 to-amber-500/10 border border-pink-500/30 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-pink-500/10 rounded-full blur-xl pointer-events-none"></div>
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400 mb-1.5">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-pink-500" />
              Maturity Future Wealth
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-pink-500/20 text-pink-600 dark:text-pink-300 font-bold">
              {interestMultiplier}x Multiplier
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 tracking-tight">
            {format(maturityFutureWealth)}
          </div>
          <div className="text-xs text-slate-500 dark:text-white/50 mt-1 font-medium">
            After {years} Years @ {rate}% p.a.
          </div>
        </div>
      </div>

      {/* Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl">
        
        {/* 1. Initial Investment / Principal */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="ci-principal" className="flex items-center gap-1.5">
              <span>Initial Principal Amount</span>
            </label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <span>{symbol}</span>
              <input 
                id="ci-principal"
                type="number" 
                min={0} 
                max={50000000} 
                step={100}
                value={principal} 
                onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value) || 0))}
                className="w-28 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input 
            type="range" 
            min={0} 
            max={currency === 'INR' ? 10000000 : 500000} 
            step={currency === 'INR' ? 5000 : 250}
            value={principal} 
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>{symbol}0</span>
            <span>{formatShort(currency === 'INR' ? 5000000 : 250000)}</span>
            <span>{formatShort(currency === 'INR' ? 10000000 : 500000)}</span>
          </div>
        </div>

        {/* 2. Regular Contribution */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <div className="flex items-center gap-2">
              <label htmlFor="ci-contrib">Regular Contribution</label>
              <div className="flex items-center bg-slate-200 dark:bg-white/10 rounded-md p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setContributionFreq('monthly')}
                  className={`px-1.5 py-0.5 rounded font-bold ${contributionFreq === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-white/60'}`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setContributionFreq('annually')}
                  className={`px-1.5 py-0.5 rounded font-bold ${contributionFreq === 'annually' ? 'bg-cyan-600 text-white' : 'text-slate-600 dark:text-white/60'}`}
                >
                  Annual
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <span>{symbol}</span>
              <input 
                id="ci-contrib"
                type="number" 
                min={0} 
                max={1000000} 
                step={50}
                value={contribution} 
                onChange={(e) => setContribution(Math.max(0, Number(e.target.value) || 0))}
                className="w-24 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <input 
            type="range" 
            min={0} 
            max={currency === 'INR' ? 200000 : 10000} 
            step={currency === 'INR' ? 1000 : 50}
            value={contribution} 
            onChange={(e) => setContribution(Number(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>{symbol}0</span>
            <span>{formatShort(currency === 'INR' ? 100000 : 5000)}</span>
            <span>{formatShort(currency === 'INR' ? 200000 : 10000)}</span>
          </div>
        </div>

        {/* 3. Expected Annual Return */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="ci-rate">Expected Annual Return (% p.a.)</label>
            <div className="flex items-center gap-1 font-mono text-purple-600 dark:text-purple-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <input 
                id="ci-rate"
                type="number" 
                min={0.1} 
                max={40} 
                step={0.1}
                value={rate} 
                onChange={(e) => setRate(Math.max(0.1, Math.min(40, Number(e.target.value) || 0.1)))}
                className="w-16 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>%</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={30} 
            step={0.5}
            value={rate} 
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>1% (Bonds)</span>
            <span>10% (S&P 500)</span>
            <span>30% (Growth)</span>
          </div>
        </div>

        {/* 4. Time Horizon (Years) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="ci-years">Time Horizon (Years)</label>
            <div className="flex items-center gap-1 font-mono text-pink-600 dark:text-pink-300 font-bold bg-white/80 dark:bg-black/40 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/10 text-xs sm:text-sm">
              <input 
                id="ci-years"
                type="number" 
                min={1} 
                max={50} 
                value={years} 
                onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                className="w-12 bg-transparent text-right outline-none font-bold text-slate-900 dark:text-white"
              />
              <span>Yrs</span>
            </div>
          </div>
          <input 
            type="range" 
            min={1} 
            max={40} 
            step={1}
            value={years} 
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-pink-600 cursor-pointer h-2 bg-slate-200 dark:bg-white/10 rounded-lg"
          />
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-white/40 font-mono">
            <span>1 Yr</span>
            <span>20 Yrs</span>
            <span>40 Yrs</span>
          </div>
        </div>

        {/* 5. Compounding Frequency Selector */}
        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span>Compounding Frequency</span>
            <span className="text-slate-500 text-[11px]">How often interest calculates and adds to principal</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 1, label: 'Annually (1x)' },
              { id: 4, label: 'Quarterly (4x)' },
              { id: 12, label: 'Monthly (12x)' },
              { id: 365, label: 'Daily (365x)' }
            ].map(freq => (
              <button
                key={freq.id}
                type="button"
                onClick={() => setCompoundFreq(freq.id)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                  compoundFreq === freq.id
                    ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                    : 'bg-white/80 dark:bg-white/10 text-slate-700 dark:text-white/70 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/20'
                }`}
              >
                {freq.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Visual Dynamic Trajectory Bar Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Wealth Accumulation Trajectory ({years} Years)
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
                <span className="text-slate-600 dark:text-white/70">Principal Deposited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
                <span className="text-slate-600 dark:text-white/70">Compound Interest</span>
              </div>
            </div>

            <button
              onClick={() => setShowTable(!showTable)}
              className="p-1.5 px-2.5 rounded-lg bg-white dark:bg-white/10 text-xs font-bold border border-slate-200 dark:border-white/10 flex items-center gap-1 hover:bg-slate-100"
            >
              <Table className="w-3.5 h-3.5" />
              <span>{showTable ? 'Hide Table' : 'Show Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Interactive SVG / CSS Chart */}
        <div className="h-56 w-full flex items-end gap-1 sm:gap-2 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-white/10">
          {yearlyData.map((d, idx) => {
            const totalHeightPct = (d.totalValue / maxVal) * 100;
            const investedHeightPct = (d.invested / d.totalValue) * 100;
            const isHovered = hoveredYear === d.year;

            return (
              <div 
                key={d.year}
                onMouseEnter={() => setHoveredYear(d.year)}
                onMouseLeave={() => setHoveredYear(null)}
                className="flex-1 flex flex-col justify-end items-center h-full relative group cursor-pointer"
              >
                {/* Tooltip on Hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900 text-white text-[10px] font-mono shadow-xl whitespace-nowrap pointer-events-none border border-white/20">
                    <div className="font-bold text-cyan-300">Year {d.year}</div>
                    <div>Total: {format(d.totalValue)}</div>
                    <div className="text-purple-300">Gain: +{format(d.interest)}</div>
                  </div>
                )}

                {/* Stacked Bar */}
                <div 
                  className={`w-full rounded-t-md overflow-hidden flex flex-col justify-end transition-all duration-300 ${isHovered ? 'brightness-125 scale-x-110' : ''}`}
                  style={{ height: `${Math.max(4, totalHeightPct)}%` }}
                >
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500" 
                    style={{ height: `${100 - investedHeightPct}%` }}
                  />
                  <div 
                    className="w-full bg-cyan-500" 
                    style={{ height: `${investedHeightPct}%` }}
                  />
                </div>

                {/* Year Label */}
                {(yearlyData.length <= 15 || idx % 2 === 0 || idx === yearlyData.length - 1) && (
                  <span className="text-[9px] font-mono text-slate-400 dark:text-white/40 mt-1">
                    Y{d.year}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Breakdown Table if enabled */}
        {showTable && (
          <div className="overflow-x-auto max-h-60 rounded-xl border border-slate-200 dark:border-white/10">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100 dark:bg-white/10 sticky top-0">
                <tr>
                  <th className="p-2">Year</th>
                  <th className="p-2">Deposited Capital</th>
                  <th className="p-2">Interest Earned</th>
                  <th className="p-2">Total Corpus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {yearlyData.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-white/5">
                    <td className="p-2 font-bold">Year {row.year}</td>
                    <td className="p-2">{format(row.invested)}</td>
                    <td className="p-2 text-purple-600 dark:text-purple-400">+{format(row.interest)}</td>
                    <td className="p-2 font-bold text-slate-900 dark:text-white">{format(row.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Copy / Action buttons */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Forecast Summary'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
