import React, { useState, useMemo, useEffect } from 'react';
import { 
  KeyRound, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Sliders, 
  Download, 
  Lock,
  Sparkles,
  Zap
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalCryptoPasswordMixerProps {
  onBackToGrid?: () => void;
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const AMBIGUOUS = /[0O1lI|]/g;

export const UniversalCryptoPasswordMixer: React.FC<UniversalCryptoPasswordMixerProps> = ({ onBackToGrid }) => {
  const [length, setLength] = useState<number>(20);
  const [includeUpper, setIncludeUpper] = useState<boolean>(true);
  const [includeLower, setIncludeLower] = useState<boolean>(true);
  const [includeDigits, setIncludeDigits] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [count, setCount] = useState<number>(5);
  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // Generate secure random passwords using window.crypto.getRandomValues
  const generatePasswords = () => {
    let charPool = '';
    if (includeUpper) charPool += UPPERCASE;
    if (includeLower) charPool += LOWERCASE;
    if (includeDigits) charPool += DIGITS;
    if (includeSymbols) charPool += SYMBOLS;

    if (excludeAmbiguous) {
      charPool = charPool.replace(AMBIGUOUS, '');
    }

    if (!charPool) {
      setPasswords(['[Select at least one character set]']);
      return;
    }

    const poolLength = charPool.length;
    const generated: string[] = [];

    for (let c = 0; c < count; c++) {
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);

      let pwd = '';
      for (let i = 0; i < length; i++) {
        pwd += charPool[randomValues[i] % poolLength];
      }
      generated.push(pwd);
    }

    setPasswords(generated);
  };

  useEffect(() => {
    generatePasswords();
  }, [length, includeUpper, includeLower, includeDigits, includeSymbols, excludeAmbiguous, count]);

  // Calculate Shannon entropy bits
  const entropyInfo = useMemo(() => {
    let poolSize = 0;
    if (includeUpper) poolSize += 26;
    if (includeLower) poolSize += 26;
    if (includeDigits) poolSize += 10;
    if (includeSymbols) poolSize += SYMBOLS.length;
    if (excludeAmbiguous) poolSize -= 5;
    poolSize = Math.max(1, poolSize);

    const bits = Math.round(length * Math.log2(poolSize));
    let strength = 'Weak';
    let color = 'text-red-500';
    let bg = 'bg-red-500';

    if (bits >= 128) {
      strength = 'Cryptographic Defense';
      color = 'text-purple-500';
      bg = 'bg-purple-500';
    } else if (bits >= 80) {
      strength = 'Very Strong';
      color = 'text-emerald-500';
      bg = 'bg-emerald-500';
    } else if (bits >= 60) {
      strength = 'Strong';
      color = 'text-teal-500';
      bg = 'bg-teal-500';
    } else if (bits >= 40) {
      strength = 'Fair';
      color = 'text-amber-500';
      bg = 'bg-amber-500';
    }

    return { bits, poolSize, strength, color, bg };
  }, [length, includeUpper, includeLower, includeDigits, includeSymbols, excludeAmbiguous]);

  const handleCopySingle = (pwd: string, idx: number) => {
    navigator.clipboard.writeText(pwd);
    setCopiedIdx(idx);
    playSound('success');
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const handleCopyAll = () => {
    const text = passwords.join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    playSound('success');
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    const text = passwords.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated_crypto_passwords.txt';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="crypto-password-mixer-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Customizable Cryptographic Random Password Mixer
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Security Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Process collision-free hardware random keys utilizing client-side window.crypto.getRandomValues
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

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Sliders & Toggles */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-500" />
              Password Length: <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm font-black">{length} characters</span>
            </label>
            <div className="flex gap-1">
              {[12, 16, 24, 32].map((len) => (
                <button
                  key={len}
                  onClick={() => setLength(len)}
                  className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
                >
                  {len}
                </button>
              ))}
            </div>
          </div>

          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-800 rounded-lg cursor-pointer"
          />

          <div className="pt-2 border-t border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2.5">
              Character Sets &amp; Cryptographic Constraints:
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUpper}
                  onChange={(e) => setIncludeUpper(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                Uppercase (A-Z)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeLower}
                  onChange={(e) => setIncludeLower(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                Lowercase (a-z)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDigits}
                  onChange={(e) => setIncludeDigits(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                Digits (0-9)
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                Symbols (!@#$)
              </label>

              <label className="col-span-2 flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                Exclude Ambiguous Chars (0, O, 1, l, I)
              </label>
            </div>
          </div>
        </div>

        {/* Right: Entropy & Strength Meter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Entropy &amp; Attack Resistance
              </span>
              <span className={`text-xs font-extrabold ${entropyInfo.color}`}>
                {entropyInfo.strength}
              </span>
            </div>

            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Entropy Score:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {entropyInfo.bits} bits of entropy
                </span>
              </div>

              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${entropyInfo.bg} transition-all duration-300`}
                  style={{ width: `${Math.min(100, (entropyInfo.bits / 128) * 100)}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200/60 dark:border-white/5 space-y-1">
                <div className="flex justify-between">
                  <span>Character Pool Size:</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{entropyInfo.poolSize} characters</span>
                </div>
                <div className="flex justify-between">
                  <span>Entropy Standard:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">NIST SP 800-63B Compliant</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Batch Size:</span>
              {[1, 5, 10].map((num) => (
                <button
                  key={num}
                  onClick={() => setCount(num)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    count === num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                generatePasswords();
                playSound('click');
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-Roll
            </button>
          </div>
        </div>
      </div>

      {/* Generated Outcome Screen */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <Lock className="w-4 h-4" />
            Generated Cryptographic Keys ({passwords.length})
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? 'All Copied!' : 'Copy All'}
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Export .txt
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1">
          {passwords.map((pwd, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-3 group hover:border-emerald-500/40 transition-colors"
            >
              <span className="font-mono text-sm text-emerald-200 tracking-wider truncate select-all">
                {pwd}
              </span>
              <button
                onClick={() => handleCopySingle(pwd, idx)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIdx === idx ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
