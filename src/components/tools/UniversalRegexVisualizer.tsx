import React, { useState, useMemo } from 'react';
import { 
  Code, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Play, 
  RotateCcw, 
  Layers, 
  Zap, 
  Search, 
  FileText,
  Replace,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface RegexVisualizerProps {
  onBackToGrid?: () => void;
}

interface RegexPreset {
  name: string;
  category: string;
  pattern: string;
  flags: string;
  sampleText: string;
  description: string;
}

const REGEX_PRESETS: RegexPreset[] = [
  {
    name: 'Email Addresses',
    category: 'Validation',
    pattern: '([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})',
    flags: 'g',
    sampleText: `Contact team leads:
- Alex (Engineering): alex.smith@company.io
- Sarah (Product): sarah_dev+testing@startup.co.uk
- Support desk: support@domain.org or hello@site.net
- Invalid: missing-at-sign.com or @domain.com`,
    description: 'Captures username and domain parts of email addresses'
  },
  {
    name: 'HTTP/HTTPS URLs',
    category: 'Web',
    pattern: 'https?:\\/\\/([\\w.-]+)(:[0-9]+)?(\\/[\\w./?%&=-]*)?',
    flags: 'gi',
    sampleText: `Check these resources:
https://developer.mozilla.org/en-US/docs/Web/JavaScript
http://localhost:3000/api/health?debug=true
Visit https://github.com/react/react or http://example.com/test.png`,
    description: 'Matches full web URLs with optional port and path/query'
  },
  {
    name: 'US & Intl Phone Numbers',
    category: 'Contacts',
    pattern: '(\\+?[1-9]\\d{0,2}[\\s.-]?)?\\(?(\\d{3})\\)?[\\s.-]?(\\d{3})[\\s.-]?(\\d{4})',
    flags: 'g',
    sampleText: `Call office reception at (555) 234-5678 or direct: +1-800-555-0199.
London office: +44 20 7946 0991. Local cell: 555.867.5309.`,
    description: 'Detects phone numbers with country codes, dashes, and parentheses'
  },
  {
    name: 'Hex Color Codes',
    category: 'Design',
    pattern: '#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'g',
    sampleText: `Theme Palette:
Primary: #8b5cf6 (violet)
Accent: #06b6d4 (cyan)
Shortcuts: #fff, #000, #f43
With alpha: #10b981aa
Not a hex: #zzz or #12345`,
    description: 'Extracts 3, 6, or 8 digit hex color codes'
  },
  {
    name: 'Markdown Hyperlinks',
    category: 'Text',
    pattern: '\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\)]+)\\)',
    flags: 'g',
    sampleText: `Here are references:
Check out [Google Search](https://google.com) for queries.
Read the [Vite Documentation](https://vite.dev) and [React Guide](https://react.dev).`,
    description: 'Extracts link anchor text and destination URL from markdown syntax'
  },
  {
    name: 'ISO 8601 Dates',
    category: 'Time',
    pattern: '\\b(\\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])\\b',
    flags: 'g',
    sampleText: `Project milestones:
Kickoff: 2026-01-15
Release v1.0: 2026-06-30
Final review: 2026-12-31
Invalid date: 2026-13-45 or 26-05-12`,
    description: 'Matches YYYY-MM-DD calendar dates with month/day boundaries'
  }
];

export const UniversalRegexVisualizer: React.FC<RegexVisualizerProps> = ({ onBackToGrid }) => {
  const [pattern, setPattern] = useState<string>('([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\\.[a-zA-Z]{2,})');
  const [flags, setFlags] = useState<{ g: boolean; i: boolean; m: boolean; s: boolean; u: boolean }>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false
  });
  const [testString, setTestString] = useState<string>(REGEX_PRESETS[0].sampleText);
  const [replaceString, setReplaceString] = useState<string>('[$1 at $2]');
  const [activeTab, setActiveTab] = useState<'visualizer' | 'matches' | 'replace'>('visualizer');
  const [copied, setCopied] = useState<string | null>(null);

  // Compute active flags string
  const activeFlagsString = useMemo(() => {
    let res = '';
    if (flags.g) res += 'g';
    if (flags.i) res += 'i';
    if (flags.m) res += 'm';
    if (flags.s) res += 's';
    if (flags.u) res += 'u';
    return res;
  }, [flags]);

  // Syntax validation & RegExp compilation
  const { regExp, syntaxError } = useMemo(() => {
    if (!pattern) {
      return { regExp: null, syntaxError: null };
    }
    try {
      const re = new RegExp(pattern, activeFlagsString);
      return { regExp: re, syntaxError: null };
    } catch (err: any) {
      return { regExp: null, syntaxError: err?.message || 'Invalid regular expression' };
    }
  }, [pattern, activeFlagsString]);

  // Extract all matches
  interface MatchRecord {
    index: number;
    matchText: string;
    groups: string[];
  }

  const matches = useMemo<MatchRecord[]>(() => {
    if (!regExp || !testString || syntaxError) return [];

    const results: MatchRecord[] = [];
    try {
      if (flags.g) {
        // Reset lastIndex
        regExp.lastIndex = 0;
        let match: RegExpExecArray | null;
        let guard = 0;
        while ((match = regExp.exec(testString)) !== null && guard < 500) {
          guard++;
          results.push({
            index: match.index,
            matchText: match[0],
            groups: match.slice(1)
          });
          // Prevent infinite loops on zero-length matches
          if (match[0].length === 0) {
            regExp.lastIndex++;
          }
        }
      } else {
        const singleMatch = regExp.exec(testString);
        if (singleMatch) {
          results.push({
            index: singleMatch.index,
            matchText: singleMatch[0],
            groups: singleMatch.slice(1)
          });
        }
      }
    } catch {
      return [];
    }

    return results;
  }, [regExp, testString, flags.g, syntaxError]);

  // Substitution output
  const replacedOutput = useMemo(() => {
    if (!regExp || !testString || syntaxError) return testString;
    try {
      return testString.replace(regExp, replaceString);
    } catch {
      return testString;
    }
  }, [regExp, testString, replaceString, syntaxError]);

  // Highlighted visualizer segments
  const highlightedSegments = useMemo(() => {
    if (!matches.length || !testString) {
      return [{ text: testString, isMatch: false, matchIndex: -1 }];
    }

    const segments: { text: string; isMatch: boolean; matchIndex: number }[] = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      // Add preceding non-matching text
      if (m.index > lastIndex) {
        segments.push({
          text: testString.slice(lastIndex, m.index),
          isMatch: false,
          matchIndex: -1
        });
      }
      // Add matched text
      segments.push({
        text: m.matchText,
        isMatch: true,
        matchIndex: idx
      });
      lastIndex = m.index + m.matchText.length;
    });

    // Add any remaining text
    if (lastIndex < testString.length) {
      segments.push({
        text: testString.slice(lastIndex),
        isMatch: false,
        matchIndex: -1
      });
    }

    return segments;
  }, [testString, matches]);

  const toggleFlag = (flag: keyof typeof flags) => {
    playSound('toggle');
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const handleCopy = (text: string, id: string) => {
    playSound('calcChime');
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleApplyPreset = (preset: RegexPreset) => {
    playSound('click');
    setPattern(preset.pattern);
    setTestString(preset.sampleText);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
      u: preset.flags.includes('u')
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="regex-visualizer-root">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
            <Code className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                RegEx Tester & Pattern Visualizer
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                100% In-Browser Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Test, debug, and visualize regular expressions in real-time with capture groups, live highlighting, and syntax validation.
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

      {/* Regex Pattern Input & Flags Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label htmlFor="regex-pattern-input" className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span>Regular Expression Pattern</span>
          </label>

          {/* Flags Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase text-slate-400 mr-1">Flags:</span>
            {(['g', 'i', 'm', 's', 'u'] as const).map(flag => (
              <button
                key={flag}
                onClick={() => toggleFlag(flag)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                  flags[flag]
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/60 border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
                title={`Toggle ${flag} (${flag === 'g' ? 'Global' : flag === 'i' ? 'Case-insensitive' : flag === 'm' ? 'Multiline' : flag === 's' ? 'DotAll' : 'Unicode'})`}
              >
                {flag}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Input Container */}
        <div className="flex items-center rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-500/30">
          <span className="text-slate-400 dark:text-white/40 font-mono text-lg font-bold select-none mr-2">/</span>
          <input
            id="regex-pattern-input"
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="Enter regex pattern (e.g., [a-zA-Z0-9]+)"
            className="flex-1 font-mono text-sm sm:text-base font-semibold bg-transparent text-slate-900 dark:text-white focus:outline-none placeholder-slate-400"
          />
          <span className="text-slate-400 dark:text-white/40 font-mono text-lg font-bold select-none ml-2">
            /{activeFlagsString}
          </span>
        </div>

        {/* Syntax Error Boundary Alert */}
        {syntaxError ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Syntax Error: </strong>
              <span>{syntaxError}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/60 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Valid syntax • <strong>{matches.length}</strong> {matches.length === 1 ? 'match' : 'matches'} found</span>
            </div>
            <button
              onClick={() => handleCopy(`const regex = /${pattern}/${activeFlagsString};`, 'js-snippet')}
              className="text-[11px] font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copied === 'js-snippet' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>Copy JS Code</span>
            </button>
          </div>
        )}

        {/* Presets Row */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
            Quick Regex Presets
          </span>
          <div className="flex flex-wrap gap-1.5">
            {REGEX_PRESETS.map((preset) => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer border ${
                  pattern === preset.pattern
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/70 border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area: Test String & Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Test String Input (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="regex-test-string" className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Test String</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {testString.length} chars • {testString.split('\n').length} lines
            </span>
          </div>

          <textarea
            id="regex-test-string"
            rows={10}
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Paste or type text to match regex against..."
            className="w-full font-mono text-xs sm:text-sm p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 leading-relaxed resize-y"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => { playSound('reset'); setTestString(''); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 dark:text-white/60 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
            >
              Clear Text
            </button>
            <button
              onClick={() => { playSound('click'); setTestString(REGEX_PRESETS[0].sampleText); }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-all cursor-pointer"
            >
              Reset Sample
            </button>
          </div>
        </div>

        {/* Right Column: Visualizer / Matches / Replacement View (6 cols) */}
        <div className="lg:col-span-6 space-y-3">
          {/* Sub-tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => { playSound('click'); setActiveTab('visualizer'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'visualizer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                Highlight Visualizer
              </button>
              <button
                onClick={() => { playSound('click'); setActiveTab('matches'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'matches'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <span>Matches ({matches.length})</span>
              </button>
              <button
                onClick={() => { playSound('click'); setActiveTab('replace'); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'replace'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                Substitution
              </button>
            </div>

            {matches.length > 0 && (
              <button
                onClick={() => handleCopy(matches.map(m => m.matchText).join('\n'), 'copy-matches')}
                className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copied === 'copy-matches' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>Copy Matches</span>
              </button>
            )}
          </div>

          {/* Tab 1: Live Highlight Visualizer */}
          {activeTab === 'visualizer' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 min-h-[240px] max-h-[380px] overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words">
              {matches.length === 0 ? (
                <span className="text-slate-400 dark:text-white/40 italic">
                  {syntaxError ? 'Fix syntax error above to view matches.' : 'No matches found in the provided test string.'}
                </span>
              ) : (
                highlightedSegments.map((segment, index) => {
                  if (segment.isMatch) {
                    const isEven = segment.matchIndex % 2 === 0;
                    return (
                      <mark
                        key={index}
                        className={`rounded px-1 py-0.5 mx-0.5 font-bold transition-colors ${
                          isEven
                            ? 'bg-blue-500/25 text-blue-900 dark:text-blue-200 border-b-2 border-blue-500'
                            : 'bg-purple-500/25 text-purple-900 dark:text-purple-200 border-b-2 border-purple-500'
                        }`}
                        title={`Match #${segment.matchIndex + 1}`}
                      >
                        {segment.text}
                      </mark>
                    );
                  }
                  return <span key={index} className="text-slate-700 dark:text-slate-300">{segment.text}</span>;
                })
              )}
            </div>
          )}

          {/* Tab 2: Detailed Matches & Capture Groups */}
          {activeTab === 'matches' && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 min-h-[240px] max-h-[380px] overflow-y-auto space-y-2.5">
              {matches.length === 0 ? (
                <div className="text-center py-8 text-slate-400 dark:text-white/40 text-xs">
                  No matches found.
                </div>
              ) : (
                matches.map((match, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-blue-600 dark:text-blue-400">
                        Match #{idx + 1}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Index {match.index}..{match.index + match.matchText.length} ({match.matchText.length} chars)
                      </span>
                    </div>

                    <div className="font-mono bg-white dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white break-all">
                      {match.matchText}
                    </div>

                    {match.groups.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-200 dark:border-white/10">
                        <span className="text-[10px] font-bold uppercase text-slate-400">
                          Captured Groups ({match.groups.length}):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 font-mono text-[11px]">
                          {match.groups.map((group, gIdx) => (
                            <div key={gIdx} className="px-2 py-1 rounded bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80 truncate">
                              <strong className="text-blue-500 mr-1.5">${gIdx + 1}:</strong>
                              {group || <span className="italic text-slate-400">undefined</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Substitution & Replacement */}
          {activeTab === 'replace' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Replacement String ($1, $2, $&):</span>
                  <span className="text-[10px] text-slate-400 font-mono">$& = Full Match</span>
                </label>
                <input
                  type="text"
                  value={replaceString}
                  onChange={(e) => setReplaceString(e.target.value)}
                  placeholder="e.g., [REDACTED] or $1-$2"
                  className="w-full font-mono text-xs sm:text-sm px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-300 dark:border-white/10 min-h-[170px] max-h-[300px] overflow-y-auto font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words text-slate-900 dark:text-white">
                {replacedOutput}
              </div>

              <button
                onClick={() => handleCopy(replacedOutput, 'copy-replaced')}
                className="w-full py-2.5 rounded-xl text-xs font-black bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {copied === 'copy-replaced' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied === 'copy-replaced' ? 'Copied Substituted Output!' : 'Copy Substituted Output'}</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
