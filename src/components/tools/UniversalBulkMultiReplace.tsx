import React, { useState, useMemo } from 'react';
import { 
  Replace, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  ArrowLeftRight, 
  Sparkles, 
  CheckCheck, 
  FileText, 
  Settings2, 
  Filter 
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalBulkMultiReplaceProps {
  onBackToGrid?: () => void;
}

interface ReplaceRule {
  id: string;
  find: string;
  replace: string;
  caseSensitive: boolean;
  matchWholeWord: boolean;
}

const SAMPLE_TEXT = `Welcome to our platform! 
Our api_endpoint is located at https://api.oldcompany.com/v1.
Contact oldcompany_support if you need assistance with user_id or account_id.
Note: OldCompany provides 24/7 client uptime across all server clusters.
Thank you for partnering with OldCompany!`;

const SAMPLE_RULES: ReplaceRule[] = [
  { id: '1', find: 'OldCompany', replace: 'NexGen', caseSensitive: true, matchWholeWord: false },
  { id: '2', find: 'oldcompany', replace: 'nexgen', caseSensitive: true, matchWholeWord: false },
  { id: '3', find: 'user_id', replace: 'customer_uuid', caseSensitive: false, matchWholeWord: true },
  { id: '4', find: 'account_id', replace: 'workspace_id', caseSensitive: false, matchWholeWord: true }
];

export const UniversalBulkMultiReplace: React.FC<UniversalBulkMultiReplaceProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXT);
  const [rules, setRules] = useState<ReplaceRule[]>(SAMPLE_RULES);
  const [copied, setCopied] = useState<boolean>(false);

  // Add new rule row
  const addRule = () => {
    playSound('tap');
    const newRule: ReplaceRule = {
      id: Math.random().toString(36).substring(2, 9),
      find: '',
      replace: '',
      caseSensitive: false,
      matchWholeWord: false
    };
    setRules(prev => [...prev, newRule]);
  };

  // Remove rule
  const removeRule = (id: string) => {
    playSound('tap');
    setRules(prev => prev.filter(r => r.id !== id));
  };

  // Update rule field
  const updateRule = (id: string, updates: Partial<ReplaceRule>) => {
    setRules(prev => prev.map(r => (r.id === id ? { ...r, ...updates } : r)));
  };

  // Core action: iterate global split-and-join mapping strings operations in browser RAM
  const { replacedText, ruleStats, totalReplacements } = useMemo(() => {
    if (!inputText) {
      return { replacedText: '', ruleStats: {}, totalReplacements: 0 };
    }

    let current = inputText;
    const stats: Record<string, number> = {};
    let total = 0;

    for (const rule of rules) {
      if (!rule.find) {
        stats[rule.id] = 0;
        continue;
      }

      let count = 0;
      if (rule.matchWholeWord || !rule.caseSensitive) {
        // Regex approach for word boundaries and case insensitivity
        const escaped = rule.find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const flags = rule.caseSensitive ? 'g' : 'gi';
        const pattern = rule.matchWholeWord ? `\\b${escaped}\\b` : escaped;
        try {
          const regex = new RegExp(pattern, flags);
          const matches = current.match(regex);
          count = matches ? matches.length : 0;
          current = current.replace(regex, rule.replace);
        } catch {
          count = 0;
        }
      } else {
        // Fast vanilla JavaScript split & join mapping loop
        const parts = current.split(rule.find);
        count = Math.max(0, parts.length - 1);
        current = parts.join(rule.replace);
      }

      stats[rule.id] = count;
      total += count;
    }

    return {
      replacedText: current,
      ruleStats: stats,
      totalReplacements: total
    };
  }, [inputText, rules]);

  const handleCopy = () => {
    if (!replacedText) return;
    navigator.clipboard.writeText(replacedText);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectAll = () => {
    const el = document.getElementById('bulk-replace-output') as HTMLTextAreaElement;
    if (el) {
      el.select();
      playSound('tap');
    }
  };

  const handleDownload = () => {
    playSound('soft');
    const blob = new Blob([replacedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'replaced-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSwap = () => {
    playSound('sliderTick');
    setInputText(replacedText);
  };

  const handleClear = () => {
    playSound('reset');
    setInputText('');
  };

  const loadPreset = (type: 'branding' | 'redaction' | 'transcript') => {
    playSound('tap');
    if (type === 'branding') {
      setInputText(SAMPLE_TEXT);
      setRules(SAMPLE_RULES);
    } else if (type === 'redaction') {
      setInputText(`Payment receipt for client John Doe (johndoe@gmail.com). Card ending in 4921, secret key sk_live_8392104928.`);
      setRules([
        { id: 'r1', find: 'John Doe', replace: '[REDACTED_NAME]', caseSensitive: false, matchWholeWord: true },
        { id: 'r2', find: 'johndoe@gmail.com', replace: '[REDACTED_EMAIL]', caseSensitive: false, matchWholeWord: true },
        { id: 'r3', find: 'sk_live_8392104928', replace: 'sk_live_***', caseSensitive: true, matchWholeWord: false }
      ]);
    } else if (type === 'transcript') {
      setInputText(`So, um, basically we wanted to, you know, launch the product like, ASAP, you know?`);
      setRules([
        { id: 't1', find: 'um, ', replace: '', caseSensitive: false, matchWholeWord: false },
        { id: 't2', find: 'you know, ', replace: '', caseSensitive: false, matchWholeWord: false },
        { id: 't3', find: 'like, ', replace: '', caseSensitive: false, matchWholeWord: false }
      ]);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100" id="tool-bulk-multi-replace">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-md">
            <Replace className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Bulk String Multi-Replace Text Factory
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono font-bold">
                RAM Multi-Map Engine
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Apply multiple [Find] &amp; [Replace] rules simultaneously in browser memory with zero server lag.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-xs font-semibold transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Presets Bar */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="font-semibold text-slate-400 dark:text-white/40">Presets:</span>
        <button
          onClick={() => loadPreset('branding')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-500/10 text-slate-700 dark:text-white/80 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
        >
          Company Rebranding
        </button>
        <button
          onClick={() => loadPreset('redaction')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-500/10 text-slate-700 dark:text-white/80 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
        >
          PII &amp; Secret Redaction
        </button>
        <button
          onClick={() => loadPreset('transcript')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-rose-500/10 text-slate-700 dark:text-white/80 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
        >
          Transcript Filler Cleaner
        </button>
      </div>

      {/* Dynamic Find & Replace Parameters Container */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
              Active Replacement Rules ({rules.length})
            </h4>
          </div>

          <button
            onClick={addRule}
            className="px-3 py-1 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Rule</span>
          </button>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto">
          {rules.map((rule, index) => (
            <div
              key={rule.id}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5"
            >
              <span className="text-[10px] font-mono text-slate-400 w-5 shrink-0 text-center font-bold">
                #{index + 1}
              </span>

              {/* Find String Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={rule.find}
                  onChange={(e) => updateRule(rule.id, { find: e.target.value })}
                  placeholder="Find string..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Replace With Input */}
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={rule.replace}
                  onChange={(e) => updateRule(rule.id, { replace: e.target.value })}
                  placeholder="Replace with..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-800 dark:text-white focus:outline-hidden focus:border-rose-500"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2 text-[11px] shrink-0">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.caseSensitive}
                    onChange={(e) => updateRule(rule.id, { caseSensitive: e.target.checked })}
                    className="rounded text-rose-500"
                  />
                  <span className="text-slate-500 dark:text-white/60">Match Case</span>
                </label>

                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.matchWholeWord}
                    onChange={(e) => updateRule(rule.id, { matchWholeWord: e.target.checked })}
                    className="rounded text-rose-500"
                  />
                  <span className="text-slate-500 dark:text-white/60">Whole Word</span>
                </label>
              </div>

              {/* Match Counter Badge */}
              <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-bold shrink-0">
                {ruleStats[rule.id] || 0} hits
              </span>

              {/* Remove Button */}
              <button
                onClick={() => removeRule(rule.id)}
                className="p-1 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors shrink-0 cursor-pointer"
                title="Remove Rule"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dual Text Block Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Text Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <span>Source Text Data</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text to perform bulk replacements..."
            rows={10}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 focus:border-rose-500 dark:focus:border-rose-400 focus:outline-hidden font-mono text-xs sm:text-sm leading-relaxed transition-all resize-y shadow-inner"
            id="bulk-replace-input"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>{inputText.length} Characters • {inputText.split(/\s+/).filter(Boolean).length} Words</span>
            <span>Client RAM Buffer</span>
          </div>
        </div>

        {/* Formatted Replaced Text Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700 dark:text-white/80">
                Processed Outcome
              </label>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono">
                {totalReplacements} substitutions
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSelectAll}
                className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-white/70 text-xs font-bold transition-all cursor-pointer"
                title="Select all text"
              >
                Select All
              </button>
              <button
                onClick={handleCopy}
                disabled={!replacedText}
                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Formatted Output'}</span>
              </button>
              <button
                onClick={handleSwap}
                className="p-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-white/70 transition-all cursor-pointer"
                title="Use as new input"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDownload}
                disabled={!replacedText}
                className="p-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-white/70 transition-all cursor-pointer disabled:opacity-50"
                title="Download text"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            id="bulk-replace-output"
            readOnly
            value={replacedText}
            placeholder="Substituted text will stream here in real time..."
            rows={10}
            className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 font-mono text-xs sm:text-sm text-rose-600 dark:text-rose-300 leading-relaxed resize-y shadow-inner focus:outline-hidden"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>{replacedText.length} Characters ({replacedText.length - inputText.length >= 0 ? `+${replacedText.length - inputText.length}` : replacedText.length - inputText.length} Chars)</span>
            <span>Multi-Rule Cascade Execution</span>
          </div>
        </div>
      </div>
    </div>
  );
};
