import React, { useState, useMemo } from 'react';
import { 
  Repeat, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  Smile, 
  Sliders, 
  Zap, 
  Hash,
  Download
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalTextEmojiRepeaterProps {
  onBackToGrid?: () => void;
}

const SAMPLE_EMOJIS = ['🚀', '🔥', '✨', '💯', '⚡', '🎉', '🤖', '⭐', '❤️', '🦄', '🎯', '🍀'];

export const UniversalTextEmojiRepeater: React.FC<UniversalTextEmojiRepeaterProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>('🚀 Moon Mission');
  const [repeatCount, setRepeatCount] = useState<number>(20);
  const [separator, setSeparator] = useState<'newline' | 'space' | 'comma' | 'none' | 'custom'>('newline');
  const [customSeparator, setCustomSeparator] = useState<string>(' • ');
  const [addIndexNumbering, setAddIndexNumbering] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Computational execution using native JS loop array join
  const repeatedResult = useMemo(() => {
    if (!inputText || repeatCount <= 0) return '';
    const safeCount = Math.min(Math.max(1, repeatCount), 10000); // capped to 10k to preserve browser UI responsiveness

    let sep = '\n';
    if (separator === 'space') sep = ' ';
    else if (separator === 'comma') sep = ', ';
    else if (separator === 'none') sep = '';
    else if (separator === 'custom') sep = customSeparator;

    if (addIndexNumbering) {
      const arr = new Array(safeCount);
      for (let i = 0; i < safeCount; i++) {
        arr[i] = `${i + 1}. ${inputText}`;
      }
      return arr.join(sep);
    } else {
      return new Array(safeCount).fill(inputText).join(sep);
    }
  }, [inputText, repeatCount, separator, customSeparator, addIndexNumbering]);

  const stats = useMemo(() => {
    const chars = repeatedResult.length;
    const lines = repeatedResult ? repeatedResult.split('\n').length : 0;
    const bytes = new Blob([repeatedResult]).size;
    return { chars, lines, bytes };
  }, [repeatedResult]);

  const handleCopy = () => {
    if (!repeatedResult) return;
    navigator.clipboard.writeText(repeatedResult);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!repeatedResult) return;
    const blob = new Blob([repeatedResult], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'repeated_output.txt';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="text-emoji-repeater-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-pink-500/10 border border-orange-500/20 dark:border-orange-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <Repeat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Creative Bulk Text &amp; Emoji Repeater Studio
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-400 border border-orange-300 dark:border-orange-800">
                Productivity Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Multiply text, slogans, or emoji matrices natively in browser RAM with custom delimiters and index flags
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

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        {/* Count & Separator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="repeat-count-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-orange-500" />
              Repetition Multiplier Count:
            </label>
            <span className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400">{repeatCount} times</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="repeat-count-slider"
              type="range"
              min={1}
              max={1000}
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value))}
              className="flex-1 accent-orange-500 cursor-pointer"
            />
            <input
              id="repeat-count-input"
              type="number"
              min={1}
              max={10000}
              value={repeatCount}
              onChange={(e) => setRepeatCount(Math.min(10000, Math.max(1, Number(e.target.value))))}
              className="w-20 p-1.5 text-center text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Quick:</span>
            {[5, 10, 50, 100, 500].map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setRepeatCount(preset);
                  playSound('tap');
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                  repeatCount === preset
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-orange-300'
                }`}
              >
                {preset}x
              </button>
            ))}
          </div>
        </div>

        {/* Delimiter & Formatting Toggles */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-orange-500" />
            Delimiter &amp; Spacing Matrix
          </label>

          <div className="flex flex-wrap gap-1.5">
            {(['newline', 'space', 'comma', 'none', 'custom'] as const).map((sep) => (
              <button
                key={sep}
                onClick={() => {
                  setSeparator(sep);
                  playSound('tap');
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  separator === sep
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-orange-300'
                }`}
              >
                {sep}
              </button>
            ))}
          </div>

          {separator === 'custom' && (
            <input
              type="text"
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              placeholder="Custom delimiter (e.g. • or ---)"
              className="w-full p-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          )}

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={addIndexNumbering}
              onChange={(e) => setAddIndexNumbering(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
            />
            Prefix Sequence Numbering (1., 2., 3...)
          </label>
        </div>
      </div>

      {/* Input Field with Quick Emojis */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="repeater-text-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Source Text / Emoji Characters
          </label>
          <div className="flex items-center gap-1 overflow-x-auto max-w-[60%]">
            {SAMPLE_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  playSound('click');
                }}
                className="text-sm p-1 rounded hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                title={`Add ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        <input
          id="repeater-text-input"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type word, phrase, emoji, or tag..."
          className="w-full p-3 font-sans text-sm rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Output Presentation Box */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-md space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              Multiplied Output ({repeatCount} iterations)
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {stats.chars} chars • {stats.lines} lines • {stats.bytes} B
          </span>
        </div>

        <textarea
          id="repeater-output-box"
          readOnly
          rows={10}
          value={repeatedResult}
          placeholder="Outcome preview renders here..."
          className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 select-all focus:outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            disabled={!repeatedResult}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white shadow-md shadow-orange-500/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard!' : 'Select & Copy All Text'}
          </button>
          <button
            onClick={handleDownload}
            disabled={!repeatedResult}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export .txt
          </button>
        </div>
      </div>
    </div>
  );
};
