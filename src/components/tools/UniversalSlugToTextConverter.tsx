import React, { useState, useMemo } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  Sliders, 
  ArrowRight,
  Type,
  FileText,
  Download
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalSlugToTextConverterProps {
  onBackToGrid?: () => void;
}

const SAMPLE_SLUGS = [
  'how-to-build-a-fast-react-app-with-vite-and-tailwind-2026',
  '10_proven_seo_keyword_research_strategies_for_saas',
  'enterprise-cloud-infrastructure-migration-best-practices',
  'top-rated-mechanical-keyboards-under-100-dollars',
  'the_ultimate_guide_to_client_side_data_compression'
];

type CaseMode = 'title' | 'sentence' | 'upper' | 'lower' | 'capitalized';

export const UniversalSlugToTextConverter: React.FC<UniversalSlugToTextConverterProps> = ({ onBackToGrid }) => {
  const [slugInput, setSlugInput] = useState<string>(SAMPLE_SLUGS[0]);
  const [caseMode, setCaseMode] = useState<CaseMode>('title');
  const [removeNumbers, setRemoveNumbers] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion engine in browser RAM
  const formattedText = useMemo(() => {
    if (!slugInput.trim()) return '';

    // Split multiple lines if user pasted a batch of slugs
    const lines = slugInput.split('\n');

    const convertedLines = lines.map((line) => {
      let cleaned = line.trim();
      if (!cleaned) return '';

      // Strip query parameters, hashes, or domain prefixes if pasted full URL
      if (cleaned.includes('://')) {
        try {
          const url = new URL(cleaned);
          cleaned = url.pathname.split('/').filter(Boolean).pop() || cleaned;
        } catch {
          cleaned = cleaned.replace(/^https?:\/\/[^/]+\//, '');
        }
      }
      cleaned = cleaned.split('?')[0].split('#')[0];

      // Replace hyphens, underscores, pluses, and encoded spaces
      let words = cleaned
        .replace(/%20/g, ' ')
        .replace(/[-_+]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (removeNumbers) {
        words = words.replace(/\b\d+\b/g, '').replace(/\s+/g, ' ').trim();
      }

      const wordList = words.split(' ').filter(Boolean);

      if (caseMode === 'lower') {
        return wordList.map((w) => w.toLowerCase()).join(' ');
      }
      if (caseMode === 'upper') {
        return wordList.map((w) => w.toUpperCase()).join(' ');
      }
      if (caseMode === 'sentence') {
        const sentence = wordList.map((w) => w.toLowerCase()).join(' ');
        return sentence.charAt(0).toUpperCase() + sentence.slice(1);
      }
      if (caseMode === 'capitalized') {
        return wordList
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
      }

      // Title Case (handling minor words like a, an, the, and, but, or, for, nor, on, at, to, from, by)
      const minorWords = new Set(['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'in', 'of', 'with']);
      return wordList
        .map((w, idx) => {
          const lower = w.toLowerCase();
          if (idx !== 0 && idx !== wordList.length - 1 && minorWords.has(lower)) {
            return lower;
          }
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join(' ');
    });

    return convertedLines.join('\n');
  }, [slugInput, caseMode, removeNumbers]);

  const stats = useMemo(() => {
    const chars = formattedText.length;
    const words = formattedText ? formattedText.trim().split(/\s+/).filter(Boolean).length : 0;
    const lines = formattedText ? formattedText.split('\n').filter(Boolean).length : 0;
    return { chars, words, lines };
  }, [formattedText]);

  const handleCopy = () => {
    if (!formattedText) return;
    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!formattedText) return;
    const blob = new Blob([formattedText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'slug_converted_text.txt';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="slug-to-text-converter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-cyan-500/10 border border-teal-500/20 dark:border-teal-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              SEO URL Slug to Plain Text Converter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-300 dark:border-teal-800">
                Productivity Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform hyphenated slugs and permalinks into clean, title-cased editorial headlines in browser RAM
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

      {/* Preset Slugs & Casing Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Presets:
          </span>
          {SAMPLE_SLUGS.slice(0, 3).map((slug, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSlugInput(slug);
                playSound('click');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-teal-300 transition-colors truncate max-w-[160px] cursor-pointer"
            >
              {slug.substring(0, 20)}...
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setSlugInput('');
            playSound('click');
          }}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-teal-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Casing Mode:</span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'title', label: 'Title Case' },
                  { id: 'sentence', label: 'Sentence case' },
                  { id: 'capitalized', label: 'Capitalize Every Word' },
                  { id: 'upper', label: 'UPPERCASE' },
                  { id: 'lower', label: 'lowercase' }
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setCaseMode(mode.id);
                    playSound('tap');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    caseMode === mode.id
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-teal-300'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeNumbers}
              onChange={(e) => setRemoveNumbers(e.target.checked)}
              className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
            />
            Omit Isolated Numbers (Years, IDs)
          </label>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="slug-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Link2 className="w-4 h-4 text-teal-500" />
              Raw URL Slugs or Permalinks
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {slugInput.length} chars
            </span>
          </div>

          <textarea
            id="slug-input"
            rows={10}
            value={slugInput}
            onChange={(e) => setSlugInput(e.target.value)}
            placeholder="Paste hyphen-separated-slugs, permalinks, or URL paths (one per line)..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed"
          />
        </div>

        {/* Right: Output Structure Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                Plain Headline Text Outcome
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.words} words • {stats.chars} chars
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="slug-converted-output"
                readOnly
                rows={10}
                value={formattedText || '/* Converted readable text renders here */'}
                className="w-full p-3 font-sans text-sm rounded-xl bg-slate-950/90 border border-slate-800 text-teal-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!formattedText}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Text to Clipboard!' : 'Copy Formatted Text'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!formattedText}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export .txt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
