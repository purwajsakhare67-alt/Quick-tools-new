import React, { useState, useMemo } from 'react';
import { 
  Terminal, 
  ArrowLeft, 
  Copy, 
  Check, 
  Sparkles, 
  Sliders, 
  Maximize2, 
  RotateCcw,
  Type,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalAsciiArtGeneratorProps {
  onBackToGrid?: () => void;
}

// Type definitions for ASCII character matrices (5 rows each)
type AsciiFontMatrix = Record<string, string[]>;

// 1. Standard Slant/Block Font (5 rows)
const BLOCK_FONT: AsciiFontMatrix = {
  A: ['  ███  ', ' █   █ ', ' █████ ', ' █   █ ', ' █   █ '],
  B: [' ████  ', ' █   █ ', ' ████  ', ' █   █ ', ' ████  '],
  C: ['  ████ ', ' █     ', ' █     ', ' █     ', '  ████ '],
  D: [' ████  ', ' █   █ ', ' █   █ ', ' █   █ ', ' ████  '],
  E: [' █████ ', ' █     ', ' ████  ', ' █     ', ' █████ '],
  F: [' █████ ', ' █     ', ' ████  ', ' █     ', ' █     '],
  G: ['  ████ ', ' █     ', ' █  ██ ', ' █   █ ', '  ████ '],
  H: [' █   █ ', ' █   █ ', ' █████ ', ' █   █ ', ' █   █ '],
  I: [' █████ ', '   █   ', '   █   ', '   █   ', ' █████ '],
  J: ['    ██ ', '     █ ', '     █ ', ' █   █ ', '  ███  '],
  K: [' █  ██ ', ' █ █   ', ' ██    ', ' █ █   ', ' █  ██ '],
  L: [' █     ', ' █     ', ' █     ', ' █     ', ' █████ '],
  M: [' █   █ ', ' ██ ██ ', ' █ █ █ ', ' █   █ ', ' █   █ '],
  N: [' █   █ ', ' ██  █ ', ' █ █ █ ', ' █  ██ ', ' █   █ '],
  O: ['  ███  ', ' █   █ ', ' █   █ ', ' █   █ ', '  ███  '],
  P: [' ████  ', ' █   █ ', ' ████  ', ' █     ', ' █     '],
  Q: ['  ███  ', ' █   █ ', ' █ █ █ ', ' █  ██ ', '  ██ ██'],
  R: [' ████  ', ' █   █ ', ' ████  ', ' █ █   ', ' █  ██ '],
  S: ['  ████ ', ' █     ', '  ███  ', '     █ ', ' ████  '],
  T: [' █████ ', '   █   ', '   █   ', '   █   ', '   █   '],
  U: [' █   █ ', ' █   █ ', ' █   █ ', ' █   █ ', '  ███  '],
  V: [' █   █ ', ' █   █ ', ' █   █ ', '  █ █  ', '   █   '],
  W: [' █   █ ', ' █   █ ', ' █ █ █ ', ' ██ ██ ', ' █   █ '],
  X: [' █   █ ', '  █ █  ', '   █   ', '  █ █  ', ' █   █ '],
  Y: [' █   █ ', '  █ █  ', '   █   ', '   █   ', '   █   '],
  Z: [' █████ ', '    █  ', '   █   ', '  █    ', ' █████ '],
  '0': ['  ███  ', ' █  ██ ', ' █ █ █ ', ' ██  █ ', '  ███  '],
  '1': ['   █   ', '  ██   ', '   █   ', '   █   ', '  ███  '],
  '2': ['  ███  ', ' █   █ ', '    ██ ', '  ██   ', ' █████ '],
  '3': ['  ███  ', '     █ ', '   ██  ', '     █ ', '  ███  '],
  '4': [' █   █ ', ' █   █ ', ' █████ ', '     █ ', '     █ '],
  '5': [' █████ ', ' █     ', ' ████  ', '     █ ', ' ████  '],
  '6': ['  ████ ', ' █     ', ' ████  ', ' █   █ ', '  ███  '],
  '7': [' █████ ', '     █ ', '    █  ', '   █   ', '   █   '],
  '8': ['  ███  ', ' █   █ ', '  ███  ', ' █   █ ', '  ███  '],
  '9': ['  ███  ', ' █   █ ', '  ████ ', '     █ ', '  ███  '],
  '!': ['   █   ', '   █   ', '   █   ', '       ', '   █   '],
  '?': ['  ███  ', ' █   █ ', '   ██  ', '       ', '   █   '],
  '.': ['       ', '       ', '       ', '       ', '   █   '],
  ':': ['       ', '   █   ', '       ', '   █   ', '       '],
  '-': ['       ', '       ', ' █████ ', '       ', '       '],
  '+': ['       ', '   █   ', ' █████ ', '   █   ', '       '],
  '*': ['       ', ' █ █ █ ', '  ███  ', ' █ █ █ ', '       '],
  '#': [' █ █ █ ', ' █████ ', ' █ █ █ ', ' █████ ', ' █ █ █ '],
  '/': ['     █ ', '    █  ', '   █   ', '  █    ', ' █     '],
  ' ': ['       ', '       ', '       ', '       ', '       ']
};

// 2. Cyber Matrix Hatch Font (5 rows)
const CYBER_FONT: AsciiFontMatrix = {
  A: ['  /\\   ', ' /  \\  ', '/====\\ ', '|    | ', '|    | '],
  B: ['|===\\  ', '|    ) ', '|===<  ', '|    ) ', '|===/  '],
  C: [' /```  ', '|      ', '|      ', '|      ', ' \\___  '],
  D: ['|```\\  ', '|    ) ', '|    | ', '|    ) ', '|___/  '],
  E: ['|====  ', '|--    ', '|====  ', '|--    ', '|====  '],
  F: ['|====  ', '|--    ', '|===   ', '|      ', '|      '],
  G: [' /```  ', '|  ___ ', '| |  | ', '| |__| ', ' \\___/ '],
  H: ['|    | ', '|    | ', '|====| ', '|    | ', '|    | '],
  I: [' |==|  ', '  ||   ', '  ||   ', '  ||   ', ' |==|  '],
  J: ['    || ', '    || ', '    || ', '||  || ', ' \\==/  '],
  K: ['|   /  ', '|  /   ', '|<=    ', '|  \\   ', '|   \\  '],
  L: ['|      ', '|      ', '|      ', '|      ', '|____  '],
  M: ['|\\  /| ', '| \\/ | ', '|    | ', '|    | ', '|    | '],
  N: ['|\\   | ', '| \\  | ', '|  \\ | ', '|   \\| ', '|    | '],
  O: [' /```\\ ', '|     |', '|     |', '|     |', ' \\___/ '],
  P: ['|```\\  ', '|    ) ', '|===/  ', '|      ', '|      '],
  Q: [' /```\\ ', '|     |', '|   \\ |', '|    \\|', ' \\___\\/'],
  R: ['|```\\  ', '|    ) ', '|===/  ', '|   \\  ', '|    \\ '],
  S: [' /```  ', '(```\\  ', ' ````) ', ' \\___/ ', '       '],
  T: ['|====| ', '  ||   ', '  ||   ', '  ||   ', '  ||   '],
  U: ['|    | ', '|    | ', '|    | ', '|    | ', ' \\___/ '],
  V: ['\\    / ', ' \\  /  ', '  \\/   ', '  ||   ', '  ||   '],
  W: ['|    | ', '|    | ', '| /\\ | ', '|/  \\| ', '       '],
  X: [' \\  /  ', '  \\/   ', '  /\\   ', ' /  \\  ', '       '],
  Y: ['\\    / ', ' \\  /  ', '  \\/   ', '  ||   ', '  ||   '],
  Z: ['|====/ ', '    /  ', '   /   ', '  /    ', ' /====|'],
  '0': [' /```\\ ', '|  /  |', '| /   |', '|/    |', ' \\___/ '],
  '1': ['  /|   ', ' / |   ', '   |   ', '   |   ', ' |===| '],
  '2': [' /```\\ ', '     / ', '  --<  ', ' /     ', ' |===| '],
  '3': [' |```\\ ', '     ) ', '  ==<  ', '     ) ', ' |___/ '],
  '4': ['|    | ', '|    | ', '|====| ', '     | ', '     | '],
  '5': ['|====  ', '|___   ', '    \\  ', '    )  ', ' \\==/  '],
  '6': [' /```  ', '|====  ', '|    | ', '|    | ', ' \\___/ '],
  '7': ['|====| ', '    /  ', '   /   ', '  /    ', ' /     '],
  '8': [' /```\\ ', '(  o  )', ' /```\\ ', '(  o  )', ' \\___/ '],
  '9': [' /```\\ ', '|     |', ' \\____|', '     | ', ' \\___/ '],
  '!': ['  ||   ', '  ||   ', '  ||   ', '       ', '  ()   '],
  '?': [' /```\\ ', '     / ', '   ./  ', '       ', '   ()  '],
  '.': ['       ', '       ', '       ', '       ', '  ()   '],
  ':': ['       ', '  ()   ', '       ', '  ()   ', '       '],
  '-': ['       ', '       ', ' [===] ', '       ', '       '],
  '+': ['   |   ', ' --+-- ', '   |   ', '       ', '       '],
  '*': [' \\ | / ', ' --*-- ', ' / | \\ ', '       ', '       '],
  '#': [' || || ', '=++=++=', ' || || ', '=++=++=', ' || || '],
  '/': ['     / ', '    /  ', '   /   ', '  /    ', ' /     '],
  ' ': ['       ', '       ', '       ', '       ', '       ']
};

// 3. Mini Outline Bubble Font (4 rows)
const MINI_FONT: AsciiFontMatrix = {
  A: [' /-\\ ', '| - |', '|_|_|', '     '],
  B: ['|--\\ ', '|--< ', '|__/ ', '     '],
  C: [' /-- ', '|    ', ' \\__ ', '     '],
  D: ['|--\\ ', '|   |', '|__/ ', '     '],
  E: ['|--- ', '|--  ', '|___ ', '     '],
  F: ['|--- ', '|--  ', '|    ', '     '],
  G: [' /-- ', '| _- ', ' \\__|', '     '],
  H: ['|  | ', '|--| ', '|  | ', '     '],
  I: ['-|-  ', ' |   ', '-|-  ', '     '],
  J: ['  -| ', '   | ', '|_/  ', '     '],
  K: ['| /  ', '|<   ', '| \\  ', '     '],
  L: ['|    ', '|    ', '|___ ', '     '],
  M: ['|\\/| ', '|  | ', '|  | ', '     '],
  N: ['|\\ | ', '| \\| ', '|  | ', '     '],
  O: [' /-\\ ', '|   |', ' \\_/ ', '     '],
  P: ['|--\\ ', '|__/ ', '|    ', '     '],
  Q: [' /-\\ ', '|   |', ' \\_\\|', '     '],
  R: ['|--\\ ', '|--/ ', '|  \\ ', '     '],
  S: [' /-- ', ' \\-  ', '__/  ', '     '],
  T: ['-|-  ', ' |   ', ' |   ', '     '],
  U: ['|  | ', '|  | ', ' \\_/ ', '     '],
  V: ['\\  / ', ' \\/  ', ' ||  ', '     '],
  W: ['|  | ', '|/\\| ', '    ', '     '],
  X: ['\\  / ', ' \\/  ', '/  \\ ', '     '],
  Y: ['\\  / ', ' \\/  ', '  |  ', '     '],
  Z: ['--/  ', ' /   ', '/__  ', '     '],
  '0': [' /-\\ ', '| / |', ' \\_/ ', '     '],
  '1': [' /|  ', '  |  ', ' _|_ ', '     '],
  '2': ['/-_\\ ', ' _/  ', '/___ ', '     '],
  '3': ['---\\ ', ' -_-|', '___/ ', '     '],
  '4': ['|  | ', '|--| ', '   | ', '     '],
  '5': ['|--- ', '|__\\ ', '___/ ', '     '],
  '6': [' /-- ', '|--\\ ', ' \\_/ ', '     '],
  '7': ['---| ', '  /  ', ' /   ', '     '],
  '8': [' /-\\ ', ' >-< ', ' \\_/ ', '     '],
  '9': [' /-\\ ', ' \\__|', '___/ ', '     '],
  '!': [' |   ', ' |   ', ' .   ', '     '],
  '?': ['/-_\\ ', '  /  ', '  .  ', '     '],
  '.': ['     ', '     ', ' .   ', '     '],
  ':': [' .   ', '     ', ' .   ', '     '],
  '-': ['     ', '---  ', '     ', '     '],
  '+': ['  |  ', '-+-  ', '  |  ', '     '],
  '*': ['\\|/  ', '-*-  ', '/|\\  ', '     '],
  '#': ['#|#  ', '=+=  ', '#|#  ', '     '],
  '/': ['  /  ', ' /   ', '/    ', '     '],
  ' ': ['    ', '    ', '    ', '     ']
};

export const UniversalAsciiArtGenerator: React.FC<UniversalAsciiArtGeneratorProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>('QUICKFREE');
  const [fontStyle, setFontStyle] = useState<'block' | 'cyber' | 'mini'>('block');
  const [frameStyle, setFrameStyle] = useState<'none' | 'simple' | 'double' | 'star' | 'cyber'>('double');
  const [spacing, setSpacing] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const samplePresets = ['QUICKFREE', 'HELLO WORLD', 'DEV SYNTAX', 'CYBER 2026', 'CODE HERO'];

  // Core generation logic
  const generatedArt = useMemo(() => {
    const text = inputText.toUpperCase().trim() || ' ';
    const selectedFont = fontStyle === 'block' ? BLOCK_FONT : fontStyle === 'cyber' ? CYBER_FONT : MINI_FONT;
    const numRows = fontStyle === 'mini' ? 4 : 5;

    // Build raw lines
    const rawLines: string[] = Array(numRows).fill('');
    const spaceGap = ' '.repeat(spacing);

    for (let charIndex = 0; charIndex < text.length; charIndex++) {
      const ch = text[charIndex];
      const matrix = selectedFont[ch] || selectedFont[' '] || Array(numRows).fill(' '.repeat(4));

      for (let r = 0; r < numRows; r++) {
        const rowStr = matrix[r] !== undefined ? matrix[r] : ' '.repeat(5);
        rawLines[r] += rowStr + (charIndex < text.length - 1 ? spaceGap : '');
      }
    }

    // Apply frame decorator
    if (frameStyle === 'none') {
      return rawLines.join('\n');
    }

    const maxLen = Math.max(...rawLines.map(l => l.length), 10);
    const framed: string[] = [];

    if (frameStyle === 'simple') {
      const border = '+' + '-'.repeat(maxLen + 4) + '+';
      framed.push(border);
      framed.push('|' + ' '.repeat(maxLen + 4) + '|');
      for (const line of rawLines) {
        framed.push('|  ' + line.padEnd(maxLen, ' ') + '  |');
      }
      framed.push('|' + ' '.repeat(maxLen + 4) + '|');
      framed.push(border);
    } else if (frameStyle === 'double') {
      const topBorder = '╔' + '═'.repeat(maxLen + 4) + '╗';
      const bottomBorder = '╚' + '═'.repeat(maxLen + 4) + '╝';
      framed.push(topBorder);
      framed.push('║' + ' '.repeat(maxLen + 4) + '║');
      for (const line of rawLines) {
        framed.push('║  ' + line.padEnd(maxLen, ' ') + '  ║');
      }
      framed.push('║' + ' '.repeat(maxLen + 4) + '║');
      framed.push(bottomBorder);
    } else if (frameStyle === 'star') {
      const starBorder = '*' + '*'.repeat(maxLen + 4) + '*';
      framed.push(starBorder);
      for (const line of rawLines) {
        framed.push('*  ' + line.padEnd(maxLen, ' ') + '  *');
      }
      framed.push(starBorder);
    } else if (frameStyle === 'cyber') {
      const cyberTop = '//' + '===================='.slice(0, Math.min(20, maxLen)) + '//[' + text.slice(0, 10) + ']' + '///';
      const cyberBottom = '\\\\' + '='.repeat(Math.max(10, maxLen + 4)) + '\\\\';
      framed.push(cyberTop);
      for (const line of rawLines) {
        framed.push('||  ' + line.padEnd(maxLen, ' ') + '  ||');
      }
      framed.push(cyberBottom);
    }

    return framed.join('\n');
  }, [inputText, fontStyle, frameStyle, spacing]);

  // Copy handler
  const handleCopy = async () => {
    if (!generatedArt) return;
    playSound('calcChime');
    try {
      await navigator.clipboard.writeText(generatedArt);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = generatedArt;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lineCount = generatedArt.split('\n').length;
  const colCount = Math.max(...generatedArt.split('\n').map(l => l.length), 0);

  return (
    <div className="space-y-6 text-slate-800 dark:text-white/90" id="ascii-art-generator-tool">
      
      {/* Top Banner & Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-purple-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>ASCII Text Art Banner Generator</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-600 dark:text-purple-300">
                Retro Matrix Engine
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Transform standard strings into stylized terminal banners, social media headlines & readme banners
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 dark:text-white/40 mr-1">Presets:</span>
          {samplePresets.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setInputText(preset);
                playSound('tap');
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Input Field and Customization Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10">
        
        {/* Text Input */}
        <div className="md:col-span-5 space-y-1.5">
          <label htmlFor="ascii-text-input" className="text-xs font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-purple-500" />
            <span>Banner Text Input</span>
          </label>
          <input
            id="ascii-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            maxLength={25}
            placeholder="Type your banner text..."
            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all uppercase tracking-wider"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Letters, numbers & symbols</span>
            <span>{inputText.length}/25 max</span>
          </div>
        </div>

        {/* Font Style Selector */}
        <div className="md:col-span-3 space-y-1.5">
          <label htmlFor="ascii-font-select" className="text-xs font-bold text-slate-700 dark:text-white/80">
            Font Architecture
          </label>
          <select
            id="ascii-font-select"
            value={fontStyle}
            onChange={(e) => {
              setFontStyle(e.target.value as any);
              playSound('tap');
            }}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            <option value="block">Solid Block 3D (Bold)</option>
            <option value="cyber">Cyber Matrix (Hatch)</option>
            <option value="mini">Mini Outline (Compact)</option>
          </select>
        </div>

        {/* Frame Style Selector */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="ascii-frame-select" className="text-xs font-bold text-slate-700 dark:text-white/80">
            Enclosing Frame
          </label>
          <select
            id="ascii-frame-select"
            value={frameStyle}
            onChange={(e) => {
              setFrameStyle(e.target.value as any);
              playSound('tap');
            }}
            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-black/40 border border-slate-300 dark:border-white/10 font-bold text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all cursor-pointer"
          >
            <option value="double">Double Box (╔═╗)</option>
            <option value="simple">Simple Border (+-+)</option>
            <option value="star">Star Border (***)</option>
            <option value="cyber">Cyber Edge (//==//)</option>
            <option value="none">No Frame (Pure)</option>
          </select>
        </div>

        {/* Spacing Control */}
        <div className="md:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="ascii-spacing-range">Letter Gap</label>
            <span className="font-mono text-purple-600 dark:text-purple-300">{spacing}px</span>
          </div>
          <input
            id="ascii-spacing-range"
            type="range"
            min={0}
            max={3}
            step={1}
            value={spacing}
            onChange={(e) => {
              setSpacing(parseInt(e.target.value, 10));
              playSound('sliderTick');
            }}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>

      </div>

      {/* Output Display Monospace Canvas */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-white/80">
            <Code className="w-4 h-4 text-purple-500" />
            <span>Rendered Monospace Output Box</span>
            <span className="font-mono text-[11px] text-slate-400">({colCount} cols × {lineCount} rows)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              UTF-8 & Monospace Ready
            </span>
          </div>
        </div>

        {/* Visual Terminal Display Box */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
              <span className="ml-1 text-slate-300">ascii_banner_canvas</span>
            </div>
            <span className="text-purple-400 font-bold">{fontStyle.toUpperCase()} FONT</span>
          </div>

          {/* Monospace Art Box */}
          <div className="p-5 overflow-x-auto custom-scrollbar bg-slate-950/90">
            <pre 
              className="font-mono text-xs sm:text-sm text-purple-300 leading-none select-all whitespace-pre tracking-normal"
              style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }}
            >
              {generatedArt}
            </pre>
          </div>

          {/* Action Trigger Footer Bar */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] text-slate-400">
              Click below to copy full raw ascii matrix formatted for GitHub, Discord, Twitter, or code files.
            </span>

            <button
              onClick={handleCopy}
              className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              id="copy-ascii-art-btn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Art Copied to Clipboard!' : 'Copy Art to Clipboard'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Back to All Tools Button if in standalone modal */}
      {onBackToGrid && (
        <div className="pt-2 flex justify-start">
          <button
            onClick={onBackToGrid}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Tools Hub</span>
          </button>
        </div>
      )}

    </div>
  );
};
