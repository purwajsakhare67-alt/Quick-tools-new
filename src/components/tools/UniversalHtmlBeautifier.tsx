import React, { useState, useMemo } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Eye, 
  Sparkles, 
  AlignLeft, 
  Layers, 
  FileText 
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHtmlBeautifierProps {
  onBackToGrid?: () => void;
}

const SAMPLE_MESSY_HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>Dashboard</title><link rel="stylesheet" href="style.css"></head><body><header class="navbar"><div class="container"><a href="/" class="brand-logo">DevHub</a><nav><ul><li><a href="#features">Features</a></li><li><a href="#pricing">Pricing</a></li></ul></nav><button class="btn btn-primary">Get Started</button></div></header><main><section class="hero"><h1>Ship Faster With Modern Tools</h1><p>Streamline development pipelines today.</p><div class="cta-group"><a href="/signup" class="cta-link">Start Free</a></div></section></main><footer><p>&copy; 2026 DevHub Inc. All rights reserved.</p></footer></body></html>`;

// Void tags that do not require closing tags
const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
  'link', 'meta', 'param', 'source', 'track', 'wbr', '!doctype'
]);

export const UniversalHtmlBeautifier: React.FC<UniversalHtmlBeautifierProps> = ({ onBackToGrid }) => {
  const [rawHtml, setRawHtml] = useState<string>(SAMPLE_MESSY_HTML);
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [wrapAttributes, setWrapAttributes] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'code' | 'preview'>('code');

  // Client-side HTML formatting engine using tokenizer
  const { beautifiedHtml, stats } = useMemo(() => {
    if (!rawHtml.trim()) {
      return { beautifiedHtml: '', stats: { tags: 0, lines: 0, originalChars: 0, formattedChars: 0 } };
    }

    const indentStr = indentSize === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize, 10));
    let indentLevel = 0;
    let formattedLines: string[] = [];
    let tagCount = 0;

    // Tokenize HTML tags, comments, text
    const tokens = rawHtml
      .replace(/>\s*</g, '><') // remove whitespace between tags
      .replace(/<!--[\s\S]*?-->/g, match => `\n${match}\n`) // isolate comments
      .match(/<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<\/?[a-zA-Z0-9\-]+[^>]*>|[^<]+/g) || [];

    for (let token of tokens) {
      token = token.trim();
      if (!token) continue;

      // Comment token
      if (token.startsWith('<!--')) {
        formattedLines.push(indentStr.repeat(indentLevel) + token);
        continue;
      }

      // Closing tag: </tag>
      if (/^<\/[a-zA-Z0-9\-]+>$/i.test(token)) {
        indentLevel = Math.max(0, indentLevel - 1);
        formattedLines.push(indentStr.repeat(indentLevel) + token);
        tagCount++;
        continue;
      }

      // Opening or self-closing tag: <tag ...> or <tag .../>
      if (token.startsWith('<') && token.endsWith('>')) {
        tagCount++;
        const tagNameMatch = token.match(/^<([a-zA-Z0-9\-!]+)/);
        const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : '';
        const isSelfClosing = token.endsWith('/>') || VOID_TAGS.has(tagName);

        formattedLines.push(indentStr.repeat(indentLevel) + token);

        if (!isSelfClosing && !tagName.startsWith('!')) {
          indentLevel++;
        }
        continue;
      }

      // Plain text node
      formattedLines.push(indentStr.repeat(indentLevel) + token);
    }

    const output = formattedLines.join('\n');
    return {
      beautifiedHtml: output,
      stats: {
        tags: tagCount,
        lines: formattedLines.length,
        originalChars: rawHtml.length,
        formattedChars: output.length
      }
    };
  }, [rawHtml, indentSize, wrapAttributes]);

  const handleCopy = () => {
    if (!beautifiedHtml) return;
    navigator.clipboard.writeText(beautifiedHtml);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    playSound('soft');
    const blob = new Blob([beautifiedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beautified.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    playSound('reset');
    setRawHtml('');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100" id="tool-html-beautifier">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              HTML Code Beautifier & Tag Layout Indenter
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                Zero Dependency Parser
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Format, re-indent, and organize messy HTML source structures into clean nested hierarchies in browser memory.
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

      {/* Options Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        {/* Indent selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-white/50">Indent Spacing:</span>
          {(['2', '4', 'tab'] as const).map(ind => (
            <button
              key={ind}
              onClick={() => {
                playSound('tap');
                setIndentSize(ind);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                indentSize === ind
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-300'
              }`}
            >
              {ind === '2' && '2 Spaces'}
              {ind === '4' && '4 Spaces'}
              {ind === 'tab' && 'Tab'}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound('tap');
              setViewMode('code');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'code'
                ? 'bg-slate-800 text-white dark:bg-white/20'
                : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60'
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span>Formatted Code</span>
          </button>
          <button
            onClick={() => {
              playSound('tap');
              setViewMode('preview');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'preview'
                ? 'bg-slate-800 text-white dark:bg-white/20'
                : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Render</span>
          </button>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <span>Unformatted HTML</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playSound('tap');
                  setRawHtml(SAMPLE_MESSY_HTML);
                }}
                className="text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                Sample HTML
              </button>
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
            value={rawHtml}
            onChange={(e) => setRawHtml(e.target.value)}
            placeholder="Paste messy or minified HTML strings here..."
            rows={14}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 focus:border-emerald-500 dark:focus:border-emerald-400 focus:outline-hidden font-mono text-xs sm:text-sm leading-relaxed transition-all resize-y shadow-inner"
            id="html-beautifier-input"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>Raw Chars: {stats.originalChars}</span>
            <span>Client-side DOM Parser</span>
          </div>
        </div>

        {/* Output Pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700 dark:text-white/80">
                Beautified HTML Structure
              </label>
              {beautifiedHtml && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
                  {stats.lines} lines • {stats.tags} tags
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!beautifiedHtml}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!beautifiedHtml}
                className="p-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-white/70 transition-all cursor-pointer disabled:opacity-50"
                title="Download HTML file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {viewMode === 'code' ? (
            <textarea
              readOnly
              value={beautifiedHtml}
              placeholder="Structured nested HTML will be indented here..."
              rows={14}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 font-mono text-xs sm:text-sm text-emerald-600 dark:text-emerald-300 leading-relaxed resize-y shadow-inner focus:outline-hidden"
              id="html-beautifier-output"
            />
          ) : (
            <div className="w-full h-72 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 overflow-hidden">
              <iframe
                title="HTML Live Preview"
                srcDoc={beautifiedHtml}
                sandbox="allow-same-origin"
                className="w-full h-full border-0"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>Formatted Output: {stats.formattedChars} chars</span>
            <span>Preserves DOCTYPE & Void Tags</span>
          </div>
        </div>
      </div>
    </div>
  );
};
