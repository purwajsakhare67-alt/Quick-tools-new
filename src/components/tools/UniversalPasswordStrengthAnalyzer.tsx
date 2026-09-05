import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  ShieldX, 
  Lock, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Zap, 
  Cpu, 
  Server, 
  Globe, 
  AlertTriangle,
  KeyRound,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface PasswordStrengthAnalyzerProps {
  onBackToGrid?: () => void;
}

export const UniversalPasswordStrengthAnalyzer: React.FC<PasswordStrengthAnalyzerProps> = ({ onBackToGrid }) => {
  const [password, setPassword] = useState<string>('Tr0ub4dor&3');
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Common dictionary patterns to detect
  const hasSequential = useMemo(() => {
    const s = password.toLowerCase();
    const sequences = ['123', '234', '345', '456', '567', '678', '789', 'abc', 'bcd', 'cde', 'def', 'qwe', 'wer', 'ert', 'rty', 'asd', 'sdf', 'dfg', 'zxc'];
    return sequences.some(seq => s.includes(seq));
  }, [password]);

  const hasRepeated = useMemo(() => {
    return /(.)\1{2,}/.test(password);
  }, [password]);

  // Character set analysis
  const poolAnalysis = useMemo(() => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasDigit) poolSize += 10;
    if (hasSpecial) poolSize += 33;

    const length = password.length;
    // Shannon entropy formula: Length * log2(poolSize)
    let rawEntropy = length > 0 && poolSize > 0 ? length * Math.log2(poolSize) : 0;

    // Apply realism penalties
    if (hasSequential) rawEntropy = Math.max(0, rawEntropy - 8);
    if (hasRepeated) rawEntropy = Math.max(0, rawEntropy - 6);

    const entropy = Math.round(rawEntropy * 10) / 10;

    return {
      hasLower,
      hasUpper,
      hasDigit,
      hasSpecial,
      poolSize,
      length,
      entropy
    };
  }, [password, hasSequential, hasRepeated]);

  // Crack Time Calculators across 4 realistic computational scenarios
  const crackScenarios = useMemo(() => {
    const { poolSize, length } = poolAnalysis;
    if (length === 0 || poolSize === 0) {
      return {
        onlineWeb: '0 seconds',
        onlineApi: '0 seconds',
        offlineGpu: '0 seconds',
        supercomputer: '0 seconds',
        primaryCrackTime: 'Instant',
        score: 0,
        label: 'Empty',
        color: 'text-slate-400',
        barColor: 'bg-slate-300 dark:bg-slate-700'
      };
    }

    // Total search space (combinations): R^L (approximate with BigInt if small, or log10)
    // Total guesses needed on average: (poolSize^length) / 2
    const logTotalCombinations = length * Math.log10(poolSize);

    // Formatter for seconds into human text
    const formatTimeFromLogSeconds = (logSeconds: number): string => {
      if (logSeconds < 0) return 'Instant (< 1 ms)';
      const seconds = Math.pow(10, Math.min(logSeconds, 15));

      if (seconds < 1) return 'Instant (< 1s)';
      if (seconds < 60) return `${Math.round(seconds)} seconds`;
      const minutes = seconds / 60;
      if (minutes < 60) return `${Math.round(minutes)} minutes`;
      const hours = minutes / 60;
      if (hours < 24) return `${Math.round(hours)} hours`;
      const days = hours / 24;
      if (days < 30) return `${Math.round(days)} days`;
      const months = days / 30.4;
      if (months < 12) return `${Math.round(months)} months`;
      const years = days / 365.25;
      if (years < 100) return `${Math.round(years)} years`;
      const centuries = years / 100;
      if (centuries < 1000) return `${Math.round(centuries)} centuries`;
      const millions = years / 1e6;
      if (millions < 1000) return `${Math.round(millions)} million years`;
      const billions = years / 1e9;
      if (billions < 14) return `${billions.toFixed(1)} billion years`;
      return 'Exceeds age of universe';
    };

    // 1. Online web form with rate limiting (1,000 guesses/sec => log10 = 3)
    const logSecWeb = logTotalCombinations - Math.log10(2) - 3;
    // 2. Online unthrottled API (100,000 guesses/sec => log10 = 5)
    const logSecApi = logTotalCombinations - Math.log10(2) - 5;
    // 3. Offline fast GPU hash (100 Billion guesses/sec = 10^11)
    const logSecGpu = logTotalCombinations - Math.log10(2) - 11;
    // 4. Supercomputer / Hashcat Rig (100 Trillion guesses/sec = 10^14)
    const logSecSuper = logTotalCombinations - Math.log10(2) - 14;

    const timeWeb = formatTimeFromLogSeconds(logSecWeb);
    const timeApi = formatTimeFromLogSeconds(logSecApi);
    const timeGpu = formatTimeFromLogSeconds(logSecGpu);
    const timeSuper = formatTimeFromLogSeconds(logSecSuper);

    // Calculate overall strength score (0 to 100)
    let score = Math.min(100, Math.round((poolAnalysis.entropy / 90) * 100));
    if (poolAnalysis.length < 8) score = Math.min(score, 25);
    if (poolAnalysis.length < 12) score = Math.min(score, 60);

    let label = 'Very Weak';
    let color = 'text-rose-500';
    let barColor = 'bg-rose-500';

    if (score >= 85) {
      label = 'Fortified (Military Grade)';
      color = 'text-emerald-500';
      barColor = 'bg-emerald-500';
    } else if (score >= 65) {
      label = 'Strong';
      color = 'text-teal-500';
      barColor = 'bg-teal-500';
    } else if (score >= 45) {
      label = 'Fair';
      color = 'text-amber-500';
      barColor = 'bg-amber-500';
    } else if (score >= 25) {
      label = 'Weak';
      color = 'text-orange-500';
      barColor = 'bg-orange-500';
    }

    return {
      onlineWeb: timeWeb,
      onlineApi: timeApi,
      offlineGpu: timeGpu,
      supercomputer: timeSuper,
      primaryCrackTime: timeGpu, // Primary metric is offline GPU hash
      score,
      label,
      color,
      barColor
    };
  }, [poolAnalysis]);

  // Generate random fortified password
  const generateStrongPassword = () => {
    playSound('click');
    const lowers = 'abcdefghjkmnpqrstuvwxyz';
    const uppers = 'ABCDEFGHJKMNPQRSTUVWXYZ';
    const numbers = '23456789';
    const specials = '!@#$%^&*()-_=+';
    const all = lowers + uppers + numbers + specials;

    let res = '';
    res += lowers[Math.floor(Math.random() * lowers.length)];
    res += uppers[Math.floor(Math.random() * uppers.length)];
    res += numbers[Math.floor(Math.random() * numbers.length)];
    res += specials[Math.floor(Math.random() * specials.length)];

    for (let i = 0; i < 12; i++) {
      res += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle characters
    const shuffled = res.split('').sort(() => 0.5 - Math.random()).join('');
    setPassword(shuffled);
  };

  const handleCopy = () => {
    playSound('calcChime');
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="password-analyzer-root">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-orange-500/10 to-amber-500/10 border border-rose-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Password Strength & Hack-Time Analyzer
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
                Cryptographic Entropy
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Calculate Shannon entropy bits, character pool diversity, and estimated brute-force crack times across GPU clusters.
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-slate-300 dark:border-white/10"
          >
            ← Back to Tools
          </button>
        )}
      </div>

      {/* Main Password Input Container */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <label htmlFor="password-analyzer-input" className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <KeyRound className="w-4 h-4 text-rose-500" />
            <span>Target Password String</span>
          </label>
          <span className="text-xs font-mono text-slate-400">
            {poolAnalysis.length} characters • {poolAnalysis.entropy} bits entropy
          </span>
        </div>

        {/* Input Field with Visibility Toggle & Copy */}
        <div className="relative flex items-center">
          <input
            id="password-analyzer-input"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type or paste password to evaluate..."
            className="w-full font-mono text-base sm:text-xl font-bold py-3.5 pl-4 pr-32 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 tracking-wider"
          />

          <div className="absolute right-2.5 flex items-center gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all cursor-pointer"
              title="Copy password"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Strength Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-slate-300">Security Score:</span>
              <span className={`font-black ${crackScenarios.color}`}>
                {crackScenarios.label} ({crackScenarios.score}%)
              </span>
            </div>
            <span className="font-mono text-slate-400 text-[11px]">
              Pool Size: {poolAnalysis.poolSize} possible chars
            </span>
          </div>

          <div className="h-2.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${crackScenarios.barColor}`}
              style={{ width: `${Math.max(4, crackScenarios.score)}%` }}
            />
          </div>
        </div>

        {/* Presets & Random Generator */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Sample Tests:</span>
            {[
              { label: 'Weak', val: 'password123' },
              { label: 'Medium', val: 'Tr0ub4dor&3' },
              { label: 'Passphrase', val: 'correct-horse-battery-staple' },
              { label: 'Military', val: 'K9#m$X!29vQ@&wL7' }
            ].map(sample => (
              <button
                key={sample.label}
                onClick={() => { playSound('click'); setPassword(sample.val); }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <button
            onClick={generateStrongPassword}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Fortified Password</span>
          </button>
        </div>
      </div>

      {/* Primary Hack-Time Hero Badge & Scenario Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Hero: Estimated Hack Time (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4" />
                <span>Brute-Force Resistance</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10">
                100B Guesses/Sec
              </span>
            </div>

            <div className="pt-2">
              <span className="text-xs text-white/60 block mb-1">Time required to crack via GPU rig:</span>
              <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-tight leading-none">
                {crackScenarios.primaryCrackTime}
              </div>
            </div>

            <p className="text-xs text-white/70 pt-2 leading-relaxed">
              Based on offline dictionary and brute-force hashing clusters attempting 100 billion combinations per second.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/50 block">Shannon Entropy</span>
              <strong className="text-base text-cyan-400">{poolAnalysis.entropy} bits</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[10px] text-white/50 block">Character Space</span>
              <strong className="text-base text-emerald-400">{poolAnalysis.poolSize} chars</strong>
            </div>
          </div>
        </div>

        {/* Right Matrix: Realistic Attack Scenarios & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Attack Scenarios Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-rose-500" />
              <span>Realistic Attack Vector Breakdown</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Online Web Form */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Globe className="w-3.5 h-3.5 text-blue-500" />
                  <span>Online Web Login (Rate-Limited)</span>
                </div>
                <div className="text-base font-mono font-black text-slate-900 dark:text-white">
                  {crackScenarios.onlineWeb}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">1,000 guesses/sec</span>
              </div>

              {/* Online Fast API */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Unthrottled API Endpoint</span>
                </div>
                <div className="text-base font-mono font-black text-slate-900 dark:text-white">
                  {crackScenarios.onlineApi}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100,000 guesses/sec</span>
              </div>

              {/* Fast GPU Hash */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  <span>Offline GPU Rig (MD5/SHA)</span>
                </div>
                <div className="text-base font-mono font-black text-slate-900 dark:text-white">
                  {crackScenarios.offlineGpu}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100 Billion guesses/sec</span>
              </div>

              {/* Supercomputer */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  <Server className="w-3.5 h-3.5 text-rose-500" />
                  <span>Supercomputer / ASIC Cluster</span>
                </div>
                <div className="text-base font-mono font-black text-slate-900 dark:text-white">
                  {crackScenarios.supercomputer}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">100 Trillion guesses/sec</span>
              </div>
            </div>
          </div>

          {/* Security Criteria Checklist */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Composition & Guardrail Checklist
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                poolAnalysis.length >= 12
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
              }`}>
                {poolAnalysis.length >= 12 ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4" />}
                <span>12+ Characters ({poolAnalysis.length})</span>
              </div>

              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                poolAnalysis.hasLower
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
              }`}>
                {poolAnalysis.hasLower ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Lowercase (a-z)</span>
              </div>

              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                poolAnalysis.hasUpper
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
              }`}>
                {poolAnalysis.hasUpper ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Uppercase (A-Z)</span>
              </div>

              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                poolAnalysis.hasDigit
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
              }`}>
                {poolAnalysis.hasDigit ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Numbers (0-9)</span>
              </div>

              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                poolAnalysis.hasSpecial
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10'
              }`}>
                {poolAnalysis.hasSpecial ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <ShieldAlert className="w-4 h-4" />}
                <span>Symbols (!@#$)</span>
              </div>

              <div className={`p-2 rounded-xl flex items-center gap-2 border ${
                !hasSequential && !hasRepeated
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/25'
              }`}>
                {!hasSequential && !hasRepeated ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                <span>No Common Patterns</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
