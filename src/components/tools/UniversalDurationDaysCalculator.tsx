import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  CalendarDays, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalDurationDaysCalculatorProps {
  onBackToGrid?: () => void;
}

export const UniversalDurationDaysCalculator: React.FC<UniversalDurationDaysCalculatorProps> = ({ onBackToGrid }) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const nextYearStr = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState<string>(todayStr);
  const [endDate, setEndDate] = useState<string>(nextYearStr);
  const [includeEndDay, setIncludeEndDay] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Calculation in browser JS runtime
  const durationMetrics = useMemo(() => {
    if (!startDate || !endDate) return null;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffMs = Math.abs(end.getTime() - start.getTime());
    let totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (includeEndDay) totalDays += 1;

    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Approximate months & years
    const totalMonths = (totalDays / 30.4375).toFixed(1);
    const totalYears = (totalDays / 365.25).toFixed(2);

    // Business days (approximate: Mon-Fri)
    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(Math.min(start.getTime(), end.getTime()));
    const target = new Date(Math.max(start.getTime(), end.getTime()));
    const limit = includeEndDay ? target : new Date(target.getTime() - 24 * 60 * 60 * 1000);

    while (cur <= limit) {
      const dayOfWeek = cur.getUTCDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    const isFuture = end.getTime() >= start.getTime();

    return {
      totalDays,
      totalWeeks,
      remainingDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      totalMonths,
      totalYears,
      businessDays,
      weekendDays,
      isFuture
    };
  }, [startDate, endDate, includeEndDay]);

  const handleCopySummary = () => {
    if (!durationMetrics) return;
    const summary = `Duration: ${durationMetrics.totalDays} days (${durationMetrics.totalWeeks} weeks, ${durationMetrics.remainingDays} days)\nBusiness Days: ${durationMetrics.businessDays}\nWeekend Days: ${durationMetrics.weekendDays}\nHours: ${durationMetrics.totalHours.toLocaleString()} hrs`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="duration-days-calculator-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/20 dark:border-teal-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Comprehensive Duration &amp; Days Between Dates Calculator
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-300 dark:border-teal-800">
                Time Analytics
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Calculate exact days, weeks, business workdays, hours, and solar calendar durations client-side
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
          >
            Back to Grid
          </button>
        )}
      </div>

      {/* Date Pickers Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        {/* Start Date */}
        <div className="space-y-1.5">
          <label htmlFor="start-date-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-500" />
            Start Boundary Date:
          </label>
          <input
            id="start-date-input"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* End Date */}
        <div className="space-y-1.5">
          <label htmlFor="end-date-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-500" />
            Target End Date:
          </label>
          <input
            id="end-date-input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-teal-500 cursor-pointer"
          />
        </div>

        {/* Options */}
        <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-200/60 dark:border-white/5">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEndDay}
              onChange={(e) => setIncludeEndDay(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            Include end day (+1 day in calculation)
          </label>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const now = new Date();
                setStartDate(now.toISOString().split('T')[0]);
                const nextQuarter = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
                setEndDate(nextQuarter.toISOString().split('T')[0]);
                playSound('tap');
              }}
              className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Next 90 Days Preset
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                const now = new Date();
                setStartDate(`${now.getFullYear()}-01-01`);
                setEndDate(`${now.getFullYear()}-12-31`);
                playSound('tap');
              }}
              className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              Full Current Year
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard */}
      {durationMetrics && (
        <div className="space-y-4">
          {/* Hero Days Metric */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white shadow-lg shadow-teal-500/20 text-center space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-teal-200">
              Total Elapsed Duration
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight">
              {durationMetrics.totalDays.toLocaleString()} <span className="text-xl font-sans font-bold">Days</span>
            </div>
            <div className="text-xs text-teal-100 font-medium">
              Equivalent to {durationMetrics.totalWeeks} full weeks and {durationMetrics.remainingDays} days
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center">
              <div className="text-xs text-slate-400">Business Days</div>
              <div className="text-lg font-bold font-mono text-slate-800 dark:text-white mt-1">
                {durationMetrics.businessDays.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400">Mon - Fri Workdays</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center">
              <div className="text-xs text-slate-400">Weekend Days</div>
              <div className="text-lg font-bold font-mono text-slate-800 dark:text-white mt-1">
                {durationMetrics.weekendDays.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400">Sat - Sun Rest</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center">
              <div className="text-xs text-slate-400">Total Hours</div>
              <div className="text-lg font-bold font-mono text-slate-800 dark:text-white mt-1">
                {durationMetrics.totalHours.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-600 dark:text-teal-400">60 mins / hr</div>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center">
              <div className="text-xs text-slate-400">Solar Years</div>
              <div className="text-lg font-bold font-mono text-slate-800 dark:text-white mt-1">
                {durationMetrics.totalYears}
              </div>
              <div className="text-[10px] text-slate-400">~{durationMetrics.totalMonths} months</div>
            </div>
          </div>

          {/* Copy Summary Trigger */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleCopySummary}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Summary Copied!' : 'Copy Formatted Duration Summary'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
