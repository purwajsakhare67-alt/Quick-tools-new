import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Copy, 
  Check, 
  Clock, 
  BookOpen, 
  Mic, 
  Zap, 
  BarChart2, 
  Layers, 
  Sparkles, 
  RotateCcw,
  Gauge
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalWordReadingAnalyticsProps {
  onBackToGrid?: () => void;
}

const SAMPLE_TEXTS = {
  article: `In the modern software landscape, micro-utilities that execute entirely client-side have transformed digital workflows. By utilizing native browser compute layers such as WebCrypto, DOMParser, and pure JavaScript string matrices, tools achieve instantaneous sub-millisecond responsiveness without ever sending sensitive user bytes across internet connections.\n\nPrivacy-conscious developers and remote knowledge workers now actively favor zero-telemetry architectures. Such systems eliminate latency, bypass third-party server throttling, and provide resilient offline functionality regardless of network conditions. Embracing native in-browser compute represents not just an optimization, but a fundamental paradigm shift in web engineering.`,
  social: `✨ Pro Tip for Developers: Stop writing heavy backend endpoints for simple string formatting, JSON validation, and regex checks. The browser's native JavaScript engine is astonishingly fast and 100% private. Build client-side first! #WebDev #JavaScript #Productivity`,
  academic: `Abstract: This inquiry evaluates the algorithmic efficacy of client-side text parsing mechanisms in distributed web architectures. Empirical benchmarks reveal a 98.4% reduction in computational latency relative to traditional REST API telemetry pipelines. Consequently, client-directed processing facilitates optimal throughput while upholding stringent data privacy protocols.`
};

export const UniversalWordReadingAnalytics: React.FC<UniversalWordReadingAnalyticsProps> = ({ onBackToGrid }) => {
  const [content, setContent] = useState<string>(SAMPLE_TEXTS.article);
  const [copied, setCopied] = useState<boolean>(false);

  // Real-time calculation matrix
  const metrics = useMemo(() => {
    const raw = content;
    const trimmed = raw.trim();

    // Characters
    const totalChars = raw.length;
    const charsNoSpaces = raw.replace(/\s/g, '').length;
    const whiteSpaces = (raw.match(/\s/g) || []).length;

    // Words
    const wordList = trimmed.length > 0 ? trimmed.split(/\s+/).filter(Boolean) : [];
    const totalWords = wordList.length;

    // Lines & Paragraphs
    const lines = raw.length > 0 ? raw.split('\n').length : 0;
    const paragraphs = raw.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Sentences
    const sentences = raw.split(/[.!?]+/).filter(s => s.trim().length > 0).length;

    // Reading times
    // Silent reading: ~225 WPM
    const silentSeconds = Math.round((totalWords / 225) * 60);
    // Speaking time: ~135 WPM
    const speakingSeconds = Math.round((totalWords / 135) * 60);
    // Skimming time: ~350 WPM
    const skimmingSeconds = Math.round((totalWords / 350) * 60);

    const formatTime = (secs: number) => {
      if (secs < 10) return '< 10 sec';
      if (secs < 60) return `${secs} sec`;
      const mins = Math.floor(secs / 60);
      const remainingSecs = secs % 60;
      return remainingSecs > 0 ? `${mins}m ${remainingSecs}s` : `${mins} min`;
    };

    // Syllables estimation helper for Flesch Reading Ease
    let totalSyllables = 0;
    const countSyllables = (word: string) => {
      const clean = word.toLowerCase().replace(/[^a-z]/g, '');
      if (!clean) return 0;
      if (clean.length <= 3) return 1;
      const matches = clean.replace(/(?:[^laeiouy]|ed|es|e)$/, '').match(/[aeiouy]{1,2}/g);
      return matches ? matches.length : 1;
    };

    for (const w of wordList) {
      totalSyllables += countSyllables(w);
    }

    // Flesch Reading Ease: 206.835 - (1.015 * ASL) - (84.6 * ASW)
    let fleschScore = 100;
    let readabilityGrade = 'Very Easy';
    if (totalWords > 0 && sentences > 0) {
      const avgSentenceLength = totalWords / sentences;
      const avgSyllablesPerWord = totalSyllables / totalWords;
      fleschScore = Math.max(0, Math.min(100, Math.round(206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord))));

      if (fleschScore >= 90) readabilityGrade = '5th Grade (Very Easy)';
      else if (fleschScore >= 80) readabilityGrade = '6th Grade (Easy)';
      else if (fleschScore >= 70) readabilityGrade = '7th Grade (Fairly Easy)';
      else if (fleschScore >= 60) readabilityGrade = '8th–9th Grade (Standard)';
      else if (fleschScore >= 50) readabilityGrade = '10th–12th Grade (Fairly Difficult)';
      else if (fleschScore >= 30) readabilityGrade = 'College Level (Difficult)';
      else readabilityGrade = 'Professional / Academic';
    }

    // Keyword frequency analysis
    const stopWords = new Set(['the', 'and', 'to', 'of', 'a', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with', 'be', 'by', 'on', 'not', 'are', 'this', 'from', 'at', 'an']);
    const frequencyMap: Record<string, number> = {};
    for (const w of wordList) {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (clean.length > 2 && !stopWords.has(clean)) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    }

    const topKeywords = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / Math.max(1, totalWords)) * 100).toFixed(1)
      }));

    return {
      totalWords,
      totalChars,
      charsNoSpaces,
      whiteSpaces,
      lines,
      paragraphs,
      sentences,
      silentTime: formatTime(silentSeconds),
      speakingTime: formatTime(speakingSeconds),
      skimmingTime: formatTime(skimmingSeconds),
      fleschScore,
      readabilityGrade,
      topKeywords,
      avgWordLength: totalWords > 0 ? (charsNoSpaces / totalWords).toFixed(1) : '0.0'
    };
  }, [content]);

  // Copy handler
  const handleCopy = async () => {
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = content;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 dark:text-white/90" id="word-counter-analytics-tool">
      
      {/* Top Banner & Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Live Comprehensive Word Counter & Reading Time Analytics</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                Live Keystroke Engine
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Calculate total words, whitespace, lines, speech durations, and Flesch readability in real time
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 dark:text-white/40 mr-1">Sample:</span>
          <button
            onClick={() => {
              setContent(SAMPLE_TEXTS.article);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            Article
          </button>
          <button
            onClick={() => {
              setContent(SAMPLE_TEXTS.social);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            Social Post
          </button>
          <button
            onClick={() => {
              setContent(SAMPLE_TEXTS.academic);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            Academic
          </button>
        </div>
      </div>

      {/* Primary Minimalist Visual Stats Counter Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Metric 1: Total Words */}
        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 tracking-wider block mb-1">
            Total Words
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalWords.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {metrics.avgWordLength} chars/word
          </span>
        </div>

        {/* Metric 2: Raw Characters */}
        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-cyan-600 dark:text-cyan-400 tracking-wider block mb-1">
            Raw Characters
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.totalChars.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {metrics.charsNoSpaces.toLocaleString()} no spaces
          </span>
        </div>

        {/* Metric 3: White Spaces */}
        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider block mb-1">
            White Spaces
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.whiteSpaces.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {totalWordsRatio(metrics.whiteSpaces, metrics.totalChars)}% of buffer
          </span>
        </div>

        {/* Metric 4: Lines Count */}
        <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400 tracking-wider block mb-1">
            Lines Count
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.lines.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {metrics.paragraphs} paragraphs
          </span>
        </div>

        {/* Metric 5: Silent Reading */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-teal-600 dark:text-teal-300 tracking-wider block mb-1 flex items-center justify-center gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Reading Time</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.silentTime}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            @ 225 wpm silent
          </span>
        </div>

        {/* Metric 6: Speaking Time */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 text-center shadow-xs">
          <span className="text-[11px] font-extrabold uppercase text-purple-600 dark:text-purple-300 tracking-wider block mb-1 flex items-center justify-center gap-1">
            <Mic className="w-3 h-3" />
            <span>Speech Time</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-mono">
            {metrics.speakingTime}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            @ 135 wpm speech
          </span>
        </div>

      </div>

      {/* Main Content Area & Textarea Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Full content input area panel */}
        <div className="lg:col-span-8 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <label htmlFor="word-counter-textarea" className="flex items-center gap-2">
              <span>Full Content Text Area</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60">
                Instant Keystrokes Monitored
              </span>
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={() => {
                  setContent('');
                  playSound('reset');
                }}
                className="px-2 py-1 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <textarea
            id="word-counter-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type or paste text here to monitor words, reading duration, and line metrics instantly..."
            rows={14}
            className="w-full h-full min-h-[320px] p-4 rounded-2xl bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 font-sans text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition-all resize-y selection:bg-emerald-500/30"
          />

          {/* Social Platform Limit Meters */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-white/60">
              Social Platform Character Bounds
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              {/* Twitter / X (280) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Twitter / X</span>
                  <span className={metrics.totalChars > 280 ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                    {metrics.totalChars} / 280
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${metrics.totalChars > 280 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                    style={{ width: `${Math.min(100, (metrics.totalChars / 280) * 100)}%` }}
                  />
                </div>
              </div>

              {/* LinkedIn Post (3000) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>LinkedIn Post</span>
                  <span className={metrics.totalChars > 3000 ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                    {metrics.totalChars} / 3,000
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${metrics.totalChars > 3000 ? 'bg-rose-500' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min(100, (metrics.totalChars / 3000) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Instagram Caption (2200) */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Instagram Caption</span>
                  <span className={metrics.totalChars > 2200 ? 'text-rose-500 font-bold' : 'text-slate-400'}>
                    {metrics.totalChars} / 2,200
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${metrics.totalChars > 2200 ? 'bg-rose-500' : 'bg-pink-500'}`}
                    style={{ width: `${Math.min(100, (metrics.totalChars / 2200) * 100)}%` }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Readability & Keyword Frequency Density */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Readability Score Card */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-black uppercase text-slate-800 dark:text-white">
                  Flesch Reading Ease
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-300">
                Score: {metrics.fleschScore}/100
              </span>
            </div>

            <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200/60 dark:border-white/5">
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {metrics.readabilityGrade}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-white/50 mt-0.5">
                {metrics.sentences} sentences • {(metrics.totalWords / Math.max(1, metrics.sentences)).toFixed(1)} words/sentence
              </p>
            </div>
          </div>

          {/* Reading Speed Speeds Comparison */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5 shadow-xs">
            <span className="text-xs font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-500" />
              <span>Speed Durations</span>
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-black/20">
                <span className="text-slate-600 dark:text-white/70">Silent Reader (~225 wpm)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{metrics.silentTime}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-black/20">
                <span className="text-slate-600 dark:text-white/70">Fast Skimmer (~350 wpm)</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{metrics.skimmingTime}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-black/20">
                <span className="text-slate-600 dark:text-white/70">Speech / Presentation</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{metrics.speakingTime}</span>
              </div>
            </div>
          </div>

          {/* Top Keyword Density */}
          <div className="p-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2.5 shadow-xs">
            <span className="text-xs font-black uppercase text-slate-800 dark:text-white flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-purple-500" />
              <span>Top Keyword Density</span>
            </span>

            {metrics.topKeywords.length > 0 ? (
              <div className="space-y-1.5">
                {metrics.topKeywords.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5">
                    <span className="font-bold text-slate-700 dark:text-white/80">{item.word}</span>
                    <span className="font-mono text-slate-500 dark:text-white/50">
                      {item.count}× ({item.density}%)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-2">Type text to generate keyword distribution.</p>
            )}
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

function totalWordsRatio(num: number, denom: number): string {
  if (!denom) return '0';
  return ((num / denom) * 100).toFixed(0);
}
