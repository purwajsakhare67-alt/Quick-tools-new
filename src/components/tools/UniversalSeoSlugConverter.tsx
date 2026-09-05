import React, { useState, useMemo } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Hash,
  FileText
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalSeoSlugConverterProps {
  onBackToGrid?: () => void;
}

const COMMON_STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'nor', 'at', 'by', 'for', 'from',
  'in', 'into', 'of', 'off', 'on', 'onto', 'out', 'over', 'to', 'up', 'with',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'that', 'this', 'these', 'those', 'it', 'its'
]);

const SAMPLE_TITLES = [
  "10 Proven Next.js 15 Performance Optimization Tips & Tricks in 2026!",
  "Why Every Developer Needs a Local-First Architecture: An In-Depth Guide",
  "Café & Résumé: Modern French Bistro & Pastry Shop — Grand Opening!",
  "How to Scale Kubernetes Clusters to 10,000 Nodes with Zero Downtime?"
];

export const UniversalSeoSlugConverter: React.FC<UniversalSeoSlugConverterProps> = ({ onBackToGrid }) => {
  const [inputTitle, setInputTitle] = useState<string>(SAMPLE_TITLES[0]);
  const [separator, setSeparator] = useState<'-' | '_' | '.' | '/'>('-');
  const [caseOption, setCaseOption] = useState<'lower' | 'upper' | 'preserve'>('lower');
  const [removeStopWords, setRemoveStopWords] = useState<boolean>(false);
  const [maxLength, setMaxLength] = useState<number>(80);
  const [baseUrl, setBaseUrl] = useState<string>('https://example.com/blog/');
  const [copiedSlug, setCopiedSlug] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Slug Generation Logic
  const { slug, stats } = useMemo(() => {
    if (!inputTitle.trim()) {
      return {
        slug: '',
        stats: {
          originalLength: 0,
          slugLength: 0,
          wordCount: 0,
          filteredStopWords: 0,
          seoScore: 0,
          statusText: 'No input provided'
        }
      };
    }

    let text = inputTitle.trim();

    // 1. Normalize diacritics / accents (e.g., é -> e, ñ -> n)
    text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 2. Remove special characters (keep only alphanumerics and spaces)
    // Replace ampersand with 'and'
    text = text.replace(/&+/g, ' and ');

    // Remove unwanted punctuation except alphanumerics and whitespace
    text = text.replace(/[^\w\s-]/g, ' ');

    // 3. Word tokenization
    let words = text.split(/\s+/).filter(Boolean);
    let filteredStopWords = 0;

    if (removeStopWords) {
      const originalCount = words.length;
      words = words.filter(w => {
        const lower = w.toLowerCase();
        if (COMMON_STOP_WORDS.has(lower)) {
          filteredStopWords++;
          return false;
        }
        return true;
      });
      // Fallback if all words were stop words
      if (words.length === 0) {
        words = text.split(/\s+/).filter(Boolean);
        filteredStopWords = 0;
      }
    }

    // 4. Join with separator
    let generatedSlug = words.join(separator);

    // 5. Casing
    if (caseOption === 'lower') {
      generatedSlug = generatedSlug.toLowerCase();
    } else if (caseOption === 'upper') {
      generatedSlug = generatedSlug.toUpperCase();
    }

    // 6. Clean consecutive separators
    const sepEscaped = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regexCons = new RegExp(`${sepEscaped}+`, 'g');
    generatedSlug = generatedSlug.replace(regexCons, separator);

    // Trim leading/trailing separators
    const regexTrim = new RegExp(`^${sepEscaped}+|${sepEscaped}+$`, 'g');
    generatedSlug = generatedSlug.replace(regexTrim, '');

    // 7. Enforce max length safely on word boundaries
    if (maxLength > 0 && generatedSlug.length > maxLength) {
      generatedSlug = generatedSlug.slice(0, maxLength);
      // Remove trailing separator if truncated on one
      generatedSlug = generatedSlug.replace(new RegExp(`${sepEscaped}+$`), '');
    }

    // SEO Score calculation (1-100)
    let score = 100;
    if (generatedSlug.length > 70) score -= 15;
    if (generatedSlug.length < 10) score -= 20;
    if (words.length > 7) score -= 10;
    if (!removeStopWords && filteredStopWords === 0 && words.length > 5) score -= 5;
    score = Math.max(20, Math.min(100, score));

    let statusText = 'Optimal SEO Length';
    if (generatedSlug.length > 60) statusText = 'Slightly long for Google SERP display';
    if (generatedSlug.length < 15) statusText = 'Short / Low keyword density';

    return {
      slug: generatedSlug,
      stats: {
        originalLength: inputTitle.length,
        slugLength: generatedSlug.length,
        wordCount: words.length,
        filteredStopWords,
        seoScore: score,
        statusText
      }
    };
  }, [inputTitle, separator, caseOption, removeStopWords, maxLength]);

  const fullUrl = `${baseUrl.replace(/\/+$/, '')}/${slug}`;

  const handleCopySlug = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    setCopiedSlug(true);
    playSound('success');
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleCopyUrl = () => {
    if (!fullUrl) return;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(true);
    playSound('success');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div id="seo-slug-converter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 border border-sky-500/20 dark:border-sky-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Instant SEO URL Slug Converter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-300 dark:border-sky-800">
                Browser Native
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform blog headlines and product titles into clean, search-engine-optimized permalinks
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

      {/* Preset Title Suggestions */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" /> Samples:
        </span>
        {SAMPLE_TITLES.map((title, idx) => (
          <button
            key={idx}
            onClick={() => { setInputTitle(title); playSound('click'); }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-sky-50 dark:hover:bg-sky-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-sky-300 transition-colors cursor-pointer truncate max-w-[200px]"
            title={title}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Main Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="article-title-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-sky-500" /> Article Title / Headline
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {inputTitle.length} characters
          </span>
        </div>

        <input
          id="article-title-input"
          type="text"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
          placeholder="Enter headline or article title..."
          className="w-full px-4 py-3 text-sm rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
        />
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Separator
          </label>
          <select
            value={separator}
            onChange={(e) => { setSeparator(e.target.value as any); playSound('click'); }}
            className="w-full text-xs py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="-">Hyphen (-)</option>
            <option value="_">Underscore (_)</option>
            <option value=".">Dot (.)</option>
            <option value="/">Slash (/)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Casing
          </label>
          <select
            value={caseOption}
            onChange={(e) => { setCaseOption(e.target.value as any); playSound('click'); }}
            className="w-full text-xs py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="lower">lowercase (Standard)</option>
            <option value="upper">UPPERCASE</option>
            <option value="preserve">Preserve</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Max Length
          </label>
          <select
            value={maxLength}
            onChange={(e) => { setMaxLength(parseInt(e.target.value, 10)); playSound('click'); }}
            className="w-full text-xs py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-500"
          >
            <option value="50">50 Chars</option>
            <option value="70">70 Chars (Recommended)</option>
            <option value="100">100 Chars</option>
            <option value="0">Unlimited</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Stop Words (a, the, in...)
          </label>
          <button
            onClick={() => { setRemoveStopWords(!removeStopWords); playSound('click'); }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${removeStopWords ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
          >
            {removeStopWords ? '✓ Stripping Stop Words' : 'Keep Stop Words'}
          </button>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Domain Prefix
          </label>
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full text-xs py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Result Cards */}
      <div className="space-y-4">
        {/* Read-Only Slug Output Block */}
        <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" /> Generated URL Slug
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {stats.slugLength} characters | {stats.wordCount} words
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 py-3">
            <code className="text-sm font-mono text-emerald-400 break-all select-all font-semibold">
              {slug || 'your-seo-friendly-slug-appears-here'}
            </code>
            <button
              onClick={handleCopySlug}
              disabled={!slug}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
            >
              {copiedSlug ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSlug ? 'Copied' : 'Copy Slug'}
            </button>
          </div>
        </div>

        {/* Full URL Preview Block */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
              Live Canonical URL Preview
            </span>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 truncate">
              <Globe className="w-3.5 h-3.5 text-sky-500 shrink-0" />
              <span className="truncate">{fullUrl}</span>
            </div>
          </div>

          <button
            onClick={handleCopyUrl}
            disabled={!slug}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedUrl ? 'Copied Full URL' : 'Copy Full URL'}
          </button>
        </div>
      </div>

      {/* SEO Health & Audit Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-[11px] text-slate-400 block mb-0.5">SEO Health Score</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
              {stats.seoScore}/100
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stats.seoScore >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
              {stats.seoScore >= 80 ? 'Excellent' : 'Needs Polish'}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-[11px] text-slate-400 block mb-0.5">SERP Display Status</span>
          <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
            {stats.statusText}
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-[11px] text-slate-400 block mb-0.5">Optimization Ratio</span>
          <div className="text-xs font-mono text-slate-700 dark:text-slate-300">
            {stats.originalLength} chars &rarr; {stats.slugLength} chars ({stats.originalLength ? Math.round((1 - stats.slugLength / stats.originalLength) * 100) : 0}% reduction)
          </div>
        </div>
      </div>
    </div>
  );
};
