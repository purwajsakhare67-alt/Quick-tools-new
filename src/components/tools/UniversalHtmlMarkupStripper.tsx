import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck,
  Scissors,
  ArrowRight
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHtmlMarkupStripperProps {
  onBackToGrid?: () => void;
}

const DIRTY_HTML_PRESETS = [
  {
    name: 'Scraped Article with Scripts',
    html: `<!DOCTYPE html>
<html>
<head>
  <title>Deep Space Exploration</title>
  <style>
    body { font-family: sans-serif; background: #000; }
    .ad-banner { display: block; border: 1px solid red; }
  </style>
  <script type="text/javascript">
    window.telemetry = { user: "anonymous", trackerId: 98124 };
    console.log("Tracking user payload initialized");
  </script>
</head>
<body>
  <div class="ad-banner">Click here for free interstellar tickets!</div>
  <main>
    <h1>The Dawn of Quantum Astronomy</h1>
    <p>Astronomers have unveiled a <strong>revolutionary optical sensor</strong> capable of resolving distant exoplanets in atmospheric detail.</p>
    <p>Key mission parameters include:</p>
    <ul>
      <li>Direct planetary spectroscopic analysis</li>
      <li>Sub-nanometer interferometer alignment</li>
      <li>Autonomous trajectory correction thrusters</li>
    </ul>
    <script>fetch('/api/beacon?view=article');</script>
  </main>
  <footer>&copy; 2026 Galactic Science Press &bull; All Rights Reserved.</footer>
</body>
</html>`
  },
  {
    name: 'Newsletter Email Template',
    html: `<div style="background-color: #f4f4f4; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>
        <h2 style="color: #2b6cb0;">Weekly Tech Briefing &mdash; Issue #142</h2>
        <p>Hello VIP Subscriber,</p>
        <p>Here are your top software architecture insights for this week:</p>
        <ol>
          <li>Client-side compute avoids recurring container ingress charges.</li>
          <li>Standardized Web APIs reduce bundle payloads by up to <strong>70%</strong>.</li>
        </ol>
        <p>Unsubscribe <a href="https://example.com/unsub">here</a> or update preferences.</p>
      </td>
    </tr>
  </table>
</div>`
  },
  {
    name: 'Dirty Markup with Inline Styles & Entities',
    html: `<p class="MsoNormal" style="margin: 0in; line-height: normal;">
  <span style="font-size: 12.0pt; font-family: 'Times New Roman',serif; color: #333333;">
    Quarterly report &amp; financial audit for <b>Acme Corp &trade;</b>.<br/>
    Gross revenue exceeded &pound;1,500,000 &plusmn; 5% in Q3.
  </span>
</p>
<script>alert("Unauthorized telemetry ping");</script>`
  }
];

export const UniversalHtmlMarkupStripper: React.FC<UniversalHtmlMarkupStripperProps> = ({ onBackToGrid }) => {
  const [rawHtml, setRawHtml] = useState<string>(DIRTY_HTML_PRESETS[0].html);
  const [stripScriptsStyles, setStripScriptsStyles] = useState<boolean>(true);
  const [preserveBlockBreaks, setPreserveBlockBreaks] = useState<boolean>(true);
  const [decodeEntities, setDecodeEntities] = useState<boolean>(true);
  const [collapseBlankLines, setCollapseBlankLines] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Stripping engine using DOMParser
  const { cleanText, stats } = useMemo(() => {
    if (!rawHtml.trim()) {
      return { cleanText: '', stats: { originalChars: 0, cleanChars: 0, reductionPct: 0 } };
    }

    try {
      // Use DOMParser to safely parse HTML without execution
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawHtml, 'text/html');

      // 1. Remove dangerous or non-content tags completely
      if (stripScriptsStyles) {
        const removeTags = ['script', 'style', 'noscript', 'iframe', 'object', 'embed', 'svg', 'canvas'];
        removeTags.forEach(tag => {
          const elements = doc.querySelectorAll(tag);
          elements.forEach(el => el.remove());
        });
      }

      let resultText = '';

      if (preserveBlockBreaks) {
        // Replace block tags with newline markers before extracting text
        const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr', 'li', 'header', 'footer', 'section', 'article', 'br'];
        blockTags.forEach(tag => {
          const elements = doc.querySelectorAll(tag);
          elements.forEach(el => {
            if (tag === 'br') {
              el.replaceWith('\n');
            } else if (tag === 'li') {
              el.prepend('• ');
              el.append('\n');
            } else {
              el.append('\n');
            }
          });
        });
        resultText = doc.body.textContent || '';
      } else {
        resultText = doc.body.textContent || '';
      }

      if (decodeEntities) {
        // DOMParser natively decodes standard HTML entities into UTF-8 text
        // Additional decode fallback
        const textarea = document.createElement('textarea');
        textarea.innerHTML = resultText;
        resultText = textarea.value;
      }

      if (collapseBlankLines) {
        // Collapse 3 or more consecutive newlines to 2, trim trailing whitespace per line
        resultText = resultText
          .split('\n')
          .map(line => line.trim())
          .join('\n')
          .replace(/\n{3,}/g, '\n\n')
          .trim();
      }

      const origLen = rawHtml.length;
      const cleanLen = resultText.length;
      const pct = origLen > 0 ? Math.round(((origLen - cleanLen) / origLen) * 100) : 0;

      return {
        cleanText: resultText,
        stats: {
          originalChars: origLen,
          cleanChars: cleanLen,
          reductionPct: pct
        }
      };
    } catch (e) {
      // Fallback regex stripper
      let fallback = rawHtml;
      if (stripScriptsStyles) {
        fallback = fallback.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        fallback = fallback.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
      }
      fallback = fallback.replace(/<[^>]+>/g, ' ');
      return {
        cleanText: fallback.trim(),
        stats: {
          originalChars: rawHtml.length,
          cleanChars: fallback.length,
          reductionPct: Math.round(((rawHtml.length - fallback.length) / rawHtml.length) * 100)
        }
      };
    }
  }, [rawHtml, stripScriptsStyles, preserveBlockBreaks, decodeEntities, collapseBlankLines]);

  const handleCopy = () => {
    if (!cleanText) return;
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!cleanText) return;
    const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'isolated_plain_text.txt';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="html-markup-stripper-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-green-500/10 border border-teal-500/20 dark:border-teal-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              HTML Document Markup Stripper &amp; Text Isolate Engine
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-400 border border-teal-300 dark:border-teal-800">
                DOMParser Isolation
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scrub nested tags, scripts, and styling from web scrapes and emails with entity decoding
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

      {/* Preset Quick Picks */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-teal-500" /> Presets:
        </span>
        {DIRTY_HTML_PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setRawHtml(p.html);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-teal-50 dark:hover:bg-teal-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-teal-300 transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Options Strip */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={stripScriptsStyles}
            onChange={(e) => setStripScriptsStyles(e.target.checked)}
            className="accent-teal-500 w-4 h-4 rounded"
          />
          <span className="text-xs font-medium">Scrub &lt;script&gt; &amp; &lt;style&gt;</span>
        </label>

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={preserveBlockBreaks}
            onChange={(e) => setPreserveBlockBreaks(e.target.checked)}
            className="accent-teal-500 w-4 h-4 rounded"
          />
          <span className="text-xs font-medium">Keep Paragraph Breaks</span>
        </label>

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={decodeEntities}
            onChange={(e) => setDecodeEntities(e.target.checked)}
            className="accent-teal-500 w-4 h-4 rounded"
          />
          <span className="text-xs font-medium">Decode &amp;entities;</span>
        </label>

        <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={collapseBlankLines}
            onChange={(e) => setCollapseBlankLines(e.target.checked)}
            className="accent-teal-500 w-4 h-4 rounded"
          />
          <span className="text-xs font-medium">Trim Empty Blank Lines</span>
        </label>
      </div>

      {/* Main Dual Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Dirty HTML Input */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              Source Dirty HTML / Scrape Textarea
            </span>
            <button
              onClick={() => {
                setRawHtml('');
                playSound('click');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>

          <textarea
            id="html-input-textarea"
            rows={14}
            value={rawHtml}
            onChange={(e) => setRawHtml(e.target.value)}
            placeholder="Paste dirty HTML documents, scrapes, or email code here..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none leading-relaxed"
          />
        </div>

        {/* Right: Clean Text Output */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span className="text-xs font-bold text-teal-300">
                  Isolated Clean Plain Text
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.cleanChars} chars ({stats.reductionPct}% scrubbed)
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="clean-text-textarea"
                readOnly
                rows={14}
                value={cleanText || '<!-- Clean extracted text will display here -->'}
                className="w-full p-3 font-sans text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-slate-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!cleanText}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Clean Text to Clipboard!' : 'Copy Clean Plain Text'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!cleanText}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .txt
            </button>
          </div>
        </div>
      </div>

      {/* Scrubbing Telemetry Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Raw Input Size</span>
          <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{stats.originalChars.toLocaleString()} bytes</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Clean Output Size</span>
          <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 block mt-0.5">{stats.cleanChars.toLocaleString()} bytes</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Markup Overhead Stripped</span>
          <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{(stats.originalChars - stats.cleanChars).toLocaleString()} bytes</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
          <span className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold block">Efficiency Ratio</span>
          <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 block mt-0.5">{stats.reductionPct}% Removed</span>
        </div>
      </div>
    </div>
  );
};
