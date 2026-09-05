import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  Sliders, 
  ShieldCheck, 
  Cpu, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalLeetSpeakScramblerProps {
  onBackToGrid?: () => void;
}

// Leet dictionaries with basic and extreme modes
const LEET_DICTIONARY_BASIC: Record<string, string[]> = {
  a: ['4', '@'],
  b: ['8'],
  c: ['(', '<'],
  e: ['3'],
  g: ['6', '9'],
  i: ['1', '!'],
  l: ['1', '|'],
  o: ['0'],
  s: ['5', '$'],
  t: ['7', '+'],
  z: ['2']
};

const LEET_DICTIONARY_ADVANCED: Record<string, string[]> = {
  a: ['4', '/\\', '@'],
  b: ['8', '|3', '13'],
  c: ['(', '<', '{'],
  d: ['|)', '[)'],
  e: ['3', '€'],
  f: ['|=', 'ph'],
  g: ['6', '9', '&'],
  h: ['#', '|-|'],
  i: ['1', '!', '|'],
  j: ['_|', '_/'],
  k: ['|<', '|{'],
  l: ['1', '|_', '|'],
  m: ['|\\/|', '/\\/\\', '^^'],
  n: ['|\\|', '/\\/'],
  o: ['0', '()', '[]'],
  p: ['|D', '|*'],
  q: ['0_', '(,)'],
  r: ['|2', '12'],
  s: ['5', '$', '§'],
  t: ['7', '+', '†'],
  u: ['|_|', '(_)'],
  v: ['\\/', '|/'],
  w: ['\\/\\/', 'vv', '\\N/'],
  x: ['><', '}{'],
  y: ['`/', '¥'],
  z: ['2', '7_']
};

export const UniversalLeetSpeakScrambler: React.FC<UniversalLeetSpeakScramblerProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>('Welcome to the elite hacker underground matrix network!');
  const [density, setDensity] = useState<number>(85); // 0 to 100%
  const [flavor, setFlavor] = useState<'mild' | 'moderate' | 'ultra'>('moderate');
  const [copied, setCopied] = useState<boolean>(false);

  // Scramble execution purely inside memory
  const leetOutput = useMemo(() => {
    if (!inputText) return '';

    const dict = flavor === 'ultra' ? LEET_DICTIONARY_ADVANCED : LEET_DICTIONARY_BASIC;
    const probability = density / 100;

    let result = '';
    // deterministic pseudo-random variation based on char code to prevent flicker
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      const lower = char.toLowerCase();
      const replacements = dict[lower];

      if (replacements && replacements.length > 0) {
        // pseudo RNG seeded with index and charCode
        const pseudoRng = ((char.charCodeAt(0) * 17 + i * 31) % 100) / 100;
        if (pseudoRng <= probability) {
          const choiceIdx = (char.charCodeAt(0) + i) % replacements.length;
          result += replacements[choiceIdx];
          continue;
        }
      }
      result += char;
    }

    return result;
  }, [inputText, density, flavor]);

  const stats = useMemo(() => {
    const originalChars = inputText.length;
    let mutated = 0;
    for (let i = 0; i < Math.min(inputText.length, leetOutput.length); i++) {
      if (inputText[i] !== leetOutput[i]) {
        mutated++;
      }
    }
    const ratio = originalChars > 0 ? Math.round((mutated / originalChars) * 100) : 0;
    return { originalChars, mutated, ratio };
  }, [inputText, leetOutput]);

  const handleCopy = () => {
    if (!leetOutput) return;
    navigator.clipboard.writeText(leetOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="leet-scrambler-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-green-500/10 to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Retro Leet Speak (1337) Text Scrambler
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Cyber Text Engine
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform standard alphabetical sentences into cyberpunk 1337 gamer slang in browser RAM
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

      {/* Controls: Density slider + Flavor buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        {/* Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="leet-density-slider" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-500" />
              Substitution Density: <span className="text-emerald-600 dark:text-emerald-400">{density}%</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {density < 40 ? 'Light Touch' : density < 75 ? 'Optimal 1337' : 'Extreme Obfuscation'}
            </span>
          </div>
          <input
            id="leet-density-slider"
            type="range"
            min={10}
            max={100}
            step={5}
            value={density}
            onChange={(e) => setDensity(Number(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>

        {/* Flavor switch */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            Leet Lexicon Complexity
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['mild', 'moderate', 'ultra'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setFlavor(lvl);
                  playSound('tap');
                }}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  flavor === lvl
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-emerald-300'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
          <label htmlFor="leet-input-text" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Source Text Input
          </label>
          <button
            onClick={() => {
              setInputText('The quick brown fox jumps over the lazy dog 12345!');
              playSound('click');
            }}
            className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            Insert Sample Pangram
          </button>
        </div>
        <textarea
          id="leet-input-text"
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste standard text here to transform into retro 1337 speak..."
          className="w-full p-3 font-sans text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
        />
      </div>

      {/* Output Terminal Presentation Box */}
      <div className="p-5 rounded-2xl bg-slate-950 text-emerald-400 border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-emerald-500 pl-2">
              ROOT@MATRIX:~# ./leet_transpile.sh
            </span>
          </div>

          <div className="text-[11px] font-mono text-emerald-500/70">
            {stats.mutated} glyphs substituted ({stats.ratio}%)
          </div>
        </div>

        <div className="min-h-[110px] max-h-[220px] overflow-y-auto font-mono text-base tracking-wide leading-relaxed selection:bg-emerald-500 selection:text-black">
          {leetOutput || <span className="text-emerald-800">/* awaiting input stream */</span>}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-emerald-500/20">
          <div className="text-[11px] font-mono text-emerald-400/60 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> Client-side character bitwise mapper
          </div>
          <button
            onClick={handleCopy}
            disabled={!leetOutput}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Copy Leet Text'}
          </button>
        </div>
      </div>
    </div>
  );
};
