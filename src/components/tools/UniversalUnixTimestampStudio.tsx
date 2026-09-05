import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  ArrowLeft, 
  Copy, 
  Check, 
  Calendar, 
  Play, 
  Pause, 
  RotateCcw, 
  Globe, 
  Zap, 
  Sparkles, 
  Layers, 
  Database,
  ArrowRightLeft,
  ChevronRight
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalUnixTimestampStudioProps {
  onBackToGrid?: () => void;
}

// Astronomical & Calendar helpers
function getDayOfYear(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 0));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const isPast = diffMs < 0;
  const absSec = Math.floor(Math.abs(diffMs) / 1000);

  if (absSec < 5) return 'Just now';
  if (absSec < 60) return isPast ? `${absSec} seconds ago` : `in ${absSec} seconds`;
  const absMin = Math.floor(absSec / 60);
  if (absMin < 60) return isPast ? `${absMin} minute${absMin > 1 ? 's' : ''} ago` : `in ${absMin} minute${absMin > 1 ? 's' : ''}`;
  const absHours = Math.floor(absMin / 60);
  if (absHours < 24) return isPast ? `${absHours} hour${absHours > 1 ? 's' : ''} ago` : `in ${absHours} hour${absHours > 1 ? 's' : ''}`;
  const absDays = Math.floor(absHours / 24);
  return isPast ? `${absDays} day${absDays > 1 ? 's' : ''} ago` : `in ${absDays} day${absDays > 1 ? 's' : ''}`;
}

export const UniversalUnixTimestampStudio: React.FC<UniversalUnixTimestampStudioProps> = ({ onBackToGrid }) => {
  // Live ticking clock state
  const [liveSeconds, setLiveSeconds] = useState<number>(() => Math.floor(Date.now() / 1000));
  const [isLiveClockRunning, setIsLiveClockRunning] = useState<boolean>(true);

  // Active converter state
  const [timestampInput, setTimestampInput] = useState<string>(() => String(Math.floor(Date.now() / 1000)));
  const [unitMode, setUnitMode] = useState<'seconds' | 'milliseconds'>('seconds');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live ticking timer
  useEffect(() => {
    if (!isLiveClockRunning) return;
    const interval = setInterval(() => {
      setLiveSeconds(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [isLiveClockRunning]);

  // Derive target date
  const parsedDate = useMemo(() => {
    const rawNum = parseFloat(timestampInput.trim());
    if (isNaN(rawNum)) return null;

    let ms = rawNum;
    if (unitMode === 'seconds') {
      ms = rawNum * 1000;
    }
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }, [timestampInput, unitMode]);

  // Formatted structures
  const structures = useMemo(() => {
    if (!parsedDate) return null;

    const ms = parsedDate.getTime();
    const sec = Math.floor(ms / 1000);

    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const date = parsedDate.getDate();
    const hours24 = parsedDate.getHours();
    const hours12 = hours24 % 12 || 12;
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const minutes = parsedDate.getMinutes();
    const seconds = parsedDate.getSeconds();
    const milliseconds = parsedDate.getMilliseconds();

    // UTC parts
    const utcYear = parsedDate.getUTCFullYear();
    const utcMonth = parsedDate.getUTCMonth() + 1;
    const utcDate = parsedDate.getUTCDate();
    const utcHours = parsedDate.getUTCHours();
    const utcMinutes = parsedDate.getUTCMinutes();
    const utcSeconds = parsedDate.getUTCSeconds();

    // Timezone string
    const tzOffsetMin = -parsedDate.getTimezoneOffset();
    const tzSign = tzOffsetMin >= 0 ? '+' : '-';
    const tzHours = String(Math.floor(Math.abs(tzOffsetMin) / 60)).padStart(2, '0');
    const tzMins = String(Math.abs(tzOffsetMin) % 60).padStart(2, '0');
    const tzString = `UTC${tzSign}${tzHours}:${tzMins}`;

    return {
      timestampSeconds: String(sec),
      timestampMilliseconds: String(ms),
      isoString: parsedDate.toISOString(),
      utcString: parsedDate.toUTCString(),
      localString: parsedDate.toString(),
      relative: formatRelativeTime(parsedDate),
      dayOfWeek: parsedDate.toLocaleDateString(undefined, { weekday: 'long' }),
      dayOfYear: getDayOfYear(parsedDate),
      weekNumber: getWeekNumber(parsedDate),
      leapYear: isLeapYear(year) ? 'Yes (366 days)' : 'No (365 days)',
      // Components
      year: String(year),
      month: `${String(month).padStart(2, '0')} (${parsedDate.toLocaleDateString(undefined, { month: 'short' })})`,
      day: String(date).padStart(2, '0'),
      hours: `${String(hours12).padStart(2, '0')} ${ampm} (24h: ${String(hours24).padStart(2, '0')})`,
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
      milliseconds: String(milliseconds).padStart(3, '0'),
      timezone: `${Intl.DateTimeFormat().resolvedOptions().timeZone} (${tzString})`,
      // UTC components
      utcFormatted: `${utcYear}-${String(utcMonth).padStart(2, '0')}-${String(utcDate).padStart(2, '0')} ${String(utcHours).padStart(2, '0')}:${String(utcMinutes).padStart(2, '0')}:${String(utcSeconds).padStart(2, '0')} UTC`
    };
  }, [parsedDate]);

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    playSound('success');
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSetToCurrent = () => {
    const current = unitMode === 'seconds' ? Math.floor(Date.now() / 1000) : Date.now();
    setTimestampInput(String(current));
    playSound('tap');
  };

  const handleOffset = (secondsDelta: number) => {
    if (!parsedDate) return;
    const currentSec = Math.floor(parsedDate.getTime() / 1000);
    const newSec = currentSec + secondsDelta;
    setTimestampInput(unitMode === 'seconds' ? String(newSec) : String(newSec * 1000));
    playSound('tap');
  };

  const handleDateLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const d = new Date(e.target.value);
    if (!isNaN(d.getTime())) {
      const val = unitMode === 'seconds' ? Math.floor(d.getTime() / 1000) : d.getTime();
      setTimestampInput(String(val));
      playSound('tap');
    }
  };

  return (
    <div className="w-full space-y-6" id="universal-unix-timestamp-studio">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/80 transition-colors cursor-pointer"
              title="Back to All Tools"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Unix Epoch Timestamp Convert & Parse Studio
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Bidirectional seconds/ms epoch evaluation • UTC & local timezone matrix • Microsecond precision
            </p>
          </div>
        </div>

        {/* Live Clock Badge */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2 px-2.5 py-1 font-mono text-xs font-bold text-purple-600 dark:text-purple-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{liveSeconds}</span>
          </div>
          <button
            onClick={() => handleCopy('live', String(liveSeconds))}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/80 cursor-pointer"
            title="Copy Current Epoch"
          >
            {copiedKey === 'live' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Forward Input: Unix Epoch */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Unix Numeric Timestamp:</span>
            </label>
            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-white/5 text-[11px] font-bold">
              <button
                onClick={() => {
                  setUnitMode('seconds');
                  if (unitMode === 'milliseconds' && timestampInput.length > 10) {
                    setTimestampInput(String(Math.floor(parseFloat(timestampInput) / 1000)));
                  }
                  playSound('tap');
                }}
                className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  unitMode === 'seconds' ? 'bg-purple-600 text-white' : 'text-slate-500 dark:text-white/60'
                }`}
              >
                Seconds (10 Digits)
              </button>
              <button
                onClick={() => {
                  setUnitMode('milliseconds');
                  if (unitMode === 'seconds') {
                    setTimestampInput(String(parseFloat(timestampInput) * 1000));
                  }
                  playSound('tap');
                }}
                className={`px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                  unitMode === 'milliseconds' ? 'bg-purple-600 text-white' : 'text-slate-500 dark:text-white/60'
                }`}
              >
                Milliseconds (13 Digits)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={timestampInput}
              onChange={(e) => setTimestampInput(e.target.value)}
              className="flex-1 text-sm font-mono p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              placeholder="e.g. 1788430000"
            />
            <button
              onClick={handleSetToCurrent}
              className="px-3 py-2.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold transition-colors cursor-pointer whitespace-nowrap"
            >
              Set to Now
            </button>
          </div>

          {/* Quick Offset Jump Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-bold">
            <span className="text-slate-400 dark:text-white/40 text-[10px] mr-1">Quick Jumps:</span>
            <button
              onClick={() => handleOffset(-3600)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white cursor-pointer"
            >
              -1h
            </button>
            <button
              onClick={() => handleOffset(3600)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white cursor-pointer"
            >
              +1h
            </button>
            <button
              onClick={() => handleOffset(-86400)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white cursor-pointer"
            >
              -1d
            </button>
            <button
              onClick={() => handleOffset(86400)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white cursor-pointer"
            >
              +1d
            </button>
            <button
              onClick={() => handleOffset(-604800)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white cursor-pointer"
            >
              -1w
            </button>
            <button
              onClick={() => handleOffset(604800)}
              className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white cursor-pointer"
            >
              +1w
            </button>
          </div>
        </div>

        {/* Reverse Input: Local Human Datetime Picker */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Pick Calendar Date & Time (Reverse Conversion):</span>
          </label>

          <input
            type="datetime-local"
            onChange={handleDateLocalChange}
            className="w-full text-sm font-sans p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
          />

          <div className="text-xs text-slate-500 dark:text-white/60 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Local System Timezone:</span>
            </span>
            <span className="font-mono font-bold text-slate-700 dark:text-white/80">
              {Intl.DateTimeFormat().resolvedOptions().timeZone}
            </span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Data Sheet: Calendar Structures */}
      {structures && (
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 backdrop-blur-md overflow-hidden">
          <div className="p-3.5 bg-slate-100/80 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-white">
                Detailed Date & Time Specifications
              </span>
            </div>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-300">
              {structures.relative}
            </span>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Row: ISO 8601 */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">ISO 8601 (Universal)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white truncate block">
                  {structures.isoString}
                </span>
              </div>
              <button
                onClick={() => handleCopy('iso', structures.isoString)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 cursor-pointer shrink-0"
              >
                {copiedKey === 'iso' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Row: UTC Formatted */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">UTC Canonical Timestamp</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white truncate block">
                  {structures.utcFormatted}
                </span>
              </div>
              <button
                onClick={() => handleCopy('utc', structures.utcFormatted)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 cursor-pointer shrink-0"
              >
                {copiedKey === 'utc' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Row: Local Time */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Local Time Equivalent</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white truncate block">
                  {structures.localString}
                </span>
              </div>
              <button
                onClick={() => handleCopy('local', structures.localString)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 cursor-pointer shrink-0"
              >
                {copiedKey === 'local' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Row: Epoch Seconds */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Unix Timestamp (Seconds)</span>
                <span className="font-mono font-bold text-slate-800 dark:text-white truncate block">
                  {structures.timestampSeconds}
                </span>
              </div>
              <button
                onClick={() => handleCopy('sec', structures.timestampSeconds)}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/70 cursor-pointer shrink-0"
              >
                {copiedKey === 'sec' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Calendar Discrete Parts Grid */}
          <div className="p-4 bg-slate-50/50 dark:bg-white/[0.01] border-t border-slate-200/60 dark:border-white/5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] text-slate-400 block">Year</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{structures.year}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] text-slate-400 block">Month</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{structures.month}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] text-slate-400 block">Day</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{structures.day} ({structures.dayOfWeek.slice(0, 3)})</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] text-slate-400 block">Time</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{structures.hours}:{structures.minutes}:{structures.seconds}</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] text-slate-400 block">Day of Year</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">{structures.dayOfYear} / 365</span>
            </div>
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-white/5">
              <span className="text-[10px] text-slate-400 block">ISO Week</span>
              <span className="font-bold text-slate-800 dark:text-white font-mono">Week {structures.weekNumber}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
