import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  ArrowLeft, 
  Copy, 
  Check, 
  Trash2, 
  Download, 
  Sparkles, 
  Layers, 
  Sliders, 
  CheckCircle2, 
  Code2, 
  Cpu, 
  Scissors,
  ArrowRight
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHtmlTextStripperProps {
  onBackToGrid?: () => void;
}

const SAMPLE_HTML_SNIPPETS = {
  article: `<article class="post-content">
  <header>
    <h1 style="color: #1e293b; font-size: 28px;">The Future of Pure Client-Side Web Architecture</h1>
    <p class="author">By <a href="https://example.com/author">Dr. Sarah Vance</a> &bull; <time datetime="2026-09-03">Sept 3, 2026</time></p>
  </header>
  <div class="ad-banner" style="display:none;"><!-- Google Ad Unit -->Sponsored Content</div>
  <p>Modern progressive web apps now process <strong>high-throughput algorithms</strong> natively in the client runtime without relying on bulky cloud servers.</p>
  <p>Key technical benefits include:</p>
  <ul>
    <li>Zero latency data transformations</li>
    <li>Complete mathematical user privacy</li>
    <li>Offline-first execution capabilities</li>
  </ul>
  <script type="text/javascript">
    console.log("Analytics tracker initialized");
  </script>
  <style>
    .post-content { max-width: 800px; margin: 0 auto; }
  </style>
  <blockquote>&ldquo;Compute at the edge of the glass.&rdquo; &mdash; <em>Tech Review 2026</em></blockquote>
</article>`,
  email: `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc;">
  <tr>
    <td align="center" style="padding: 20px 0;">
      <div style="max-width: 600px; background: #ffffff; border-radius: 8px; padding: 24px; font-family: sans-serif;">
        <h2 style="color: #0f172a; margin-top: 0;">Weekly Engineering Digest #142</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Hello <strong>Engineer</strong>,<br/><br/>
          Your latest security audit report for project <span style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">core-pipeline</span> is ready for review.
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="https://dashboard.example.com/reports/142" style="background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Access Audit Dashboard &rarr;</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
        <p style="color: #94a3b8; font-size: 12px;">You received this because you are subscribed to system alerts. &copy; 2026 Cloud Ops Inc.</p>
      </div>
    </td>
  </tr>
</table>`,
  forms: `<form action="/submit" method="post">
  <fieldset>
    <legend>User Credentials &amp; Contact</legend>
    <label for="username">Username:</label>
    <input type="text" id="username" name="user" value="johndoe_2026" />
    <span class="hint">Must contain &gt; 5 characters &amp; no spaces.</span>
    <br/>
    <label for="email">E-mail Address:</label>
    <input type="email" id="email" value="john.doe@example.org" />
    <p class="terms">By clicking &quot;Register&quot;, you agree to pay &euro;15.00 / month.</p>
  </fieldset>
</form>`
};

export const UniversalHtmlTextStripper: React.FC<UniversalHtmlTextStripperProps> = ({ onBackToGrid }) => {
  const [htmlInput, setHtmlInput] = useState<string>(SAMPLE_HTML_SNIPPETS.article);
  const [lineBreakMode, setLineBreakMode] = useState<'paragraphs' | 'single' | 'collapsed'>('paragraphs');
  const [extractLinkUrls, setExtractLinkUrls] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeExtraNewlines, setRemoveExtraNewlines] = useState<boolean>(true);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Pure DOMParser / Regex text extraction
  const { cleanText, originalBytes, cleanBytes, savingsPercent, tagCount, wordCount } = useMemo(() => {
    if (!htmlInput.trim()) {
      return {
        cleanText: '',
        originalBytes: 0,
        cleanBytes: 0,
        savingsPercent: 0,
        tagCount: 0,
        wordCount: 0
      };
    }

    const origBytes = new TextEncoder().encode(htmlInput).length;
    let countedTags = (htmlInput.match(/<[^>]+>/g) || []).length;

    let processed = htmlInput;

    // Optional link extraction: replace <a href="url">text</a> with "text [url]"
    if (extractLinkUrls) {
      processed = processed.replace(/<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*?>(.*?)<\/a>/gi, '$3 [$2]');
    }

    // Replace block tags with newline markers before parsing
    const blockTags = ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'blockquote', 'article', 'section', 'header', 'footer'];
    for (const tag of blockTags) {
      const closingRegex = new RegExp(`</${tag}>`, 'gi');
      processed = processed.replace(closingRegex, `\n</${tag}>`);
    }
    processed = processed.replace(/<br\s*[\/]?>/gi, '\n');
    processed = processed.replace(/<hr\s*[\/]?>/gi, '\n---\n');

    let textResult = '';

    // Use DOMParser if available in browser
    if (typeof DOMParser !== 'undefined') {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(processed, 'text/html');

        // Remove script, style, noscript, svg, canvas, iframe
        const removeElements = doc.querySelectorAll('script, style, noscript, svg, canvas, iframe, link, meta');
        removeElements.forEach((el) => el.remove());

        textResult = doc.body.textContent || doc.body.innerText || '';
      } catch {
        // Fallback regex if DOMParser fails
        textResult = processed
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, '');
      }
    } else {
      textResult = processed
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, '');
    }

    // Formatting adjustments
    let lines = textResult.split('\n');

    if (trimWhitespace) {
      lines = lines.map((line) => line.trim());
    }

    if (lineBreakMode === 'collapsed') {
      textResult = lines.filter(Boolean).join(' ').replace(/\s+/g, ' ');
    } else if (lineBreakMode === 'paragraphs') {
      if (removeExtraNewlines) {
        textResult = lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
      } else {
        textResult = lines.join('\n').trim();
      }
    } else {
      // single line breaks
      if (removeExtraNewlines) {
        textResult = lines.filter(Boolean).join('\n');
      } else {
        textResult = lines.join('\n');
      }
    }

    const cBytes = new TextEncoder().encode(textResult).length;
    const savings = origBytes > 0 ? Math.max(0, Math.round(((origBytes - cBytes) / origBytes) * 100)) : 0;
    const words = textResult.trim() ? textResult.trim().split(/\s+/).length : 0;

    return {
      cleanText: textResult,
      originalBytes: origBytes,
      cleanBytes: cBytes,
      savingsPercent: savings,
      tagCount: countedTags,
      wordCount: words
    };
  }, [htmlInput, lineBreakMode, extractLinkUrls, trimWhitespace, removeExtraNewlines]);

  const handleCopy = () => {
    if (!cleanText) return;
    navigator.clipboard.writeText(cleanText);
    playSound('success');
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleDownload = () => {
    if (!cleanText) return;
    const blob = new Blob([cleanText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stripped_clean_text_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playSound('tap');
  };

  const loadPreset = (key: keyof typeof SAMPLE_HTML_SNIPPETS) => {
    setHtmlInput(SAMPLE_HTML_SNIPPETS[key]);
    playSound('tap');
  };

  return (
    <div className="w-full space-y-6" id="universal-html-text-stripper">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/80 transition-colors cursor-pointer"
              title="Back to All Tools"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Scissors className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Pure Text Stripper & HTML Tag Remover
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Clean DOMParser extraction • HTML entities decoding • Zero-lag payload cleansing
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={!cleanText}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedText ? 'Text Copied!' : 'Select All & Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={!cleanText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Quick Samples Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600 dark:text-white/70">Sample Presets:</span>
          <button
            onClick={() => loadPreset('article')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold transition-colors cursor-pointer"
          >
            Web Article
          </button>
          <button
            onClick={() => loadPreset('email')}
            className="px-2.5 py-1 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold transition-colors cursor-pointer"
          >
            Rich Email
          </button>
          <button
            onClick={() => loadPreset('forms')}
            className="px-2.5 py-1 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold transition-colors cursor-pointer"
          >
            Entities & Forms
          </button>
        </div>

        <button
          onClick={() => {
            setHtmlInput('');
            playSound('tap');
          }}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-500 hover:bg-rose-500/10 font-bold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Input</span>
        </button>
      </div>

      {/* Settings Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
          <label className="font-bold text-slate-700 dark:text-white/80 block">
            Line Breaking Format:
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setLineBreakMode('paragraphs');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] ${
                lineBreakMode === 'paragraphs'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              Paragraphs
            </button>
            <button
              onClick={() => {
                setLineBreakMode('single');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] ${
                lineBreakMode === 'single'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              Single Lines
            </button>
            <button
              onClick={() => {
                setLineBreakMode('collapsed');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer text-[11px] ${
                lineBreakMode === 'collapsed'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              One-Line
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2 flex flex-col justify-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={extractLinkUrls}
              onChange={(e) => setExtractLinkUrls(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span className="font-bold text-slate-700 dark:text-white/80">
              Extract Anchor URLs in [brackets]
            </span>
          </label>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-2 flex flex-col justify-center">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={trimWhitespace}
              onChange={(e) => setTrimWhitespace(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-400"
            />
            <span className="font-bold text-slate-700 dark:text-white/80">
              Trim Whitespace & Extra Breaks
            </span>
          </label>
        </div>
      </div>

      {/* Dual Pane Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Raw HTML Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Raw HTML Source / Code Snippet:</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">
              {originalBytes} Bytes • {tagCount} Tags Detected
            </span>
          </div>

          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={15}
            className="w-full text-xs font-mono p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-none selection:bg-amber-500/30"
            placeholder="Paste dirty HTML snippet, rich email text, or website markup..."
          />
        </div>

        {/* Right Pane: Pure Plaintext Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pure Clean Plaintext Output:</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              {savingsPercent}% Payload Reduced ({originalBytes - cleanBytes} Bytes Saved)
            </span>
          </div>

          <textarea
            readOnly
            value={cleanText}
            rows={15}
            className="w-full text-xs font-sans p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white/90 focus:outline-none resize-none select-all leading-relaxed"
            placeholder="Clean stripped plaintext will appear automatically..."
          />
        </div>
      </div>

      {/* Telemetry Summary Bar */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-4">
          <div>
            <span className="text-slate-500 dark:text-white/50 block text-[10px]">Clean Word Count</span>
            <span className="font-bold text-slate-800 dark:text-white font-mono">{wordCount} Words</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
          <div>
            <span className="text-slate-500 dark:text-white/50 block text-[10px]">Clean Char Count</span>
            <span className="font-bold text-slate-800 dark:text-white font-mono">{cleanText.length} Characters</span>
          </div>
          <div className="w-px h-6 bg-slate-200 dark:bg-white/10" />
          <div>
            <span className="text-slate-500 dark:text-white/50 block text-[10px]">Stripped Tags</span>
            <span className="font-bold text-amber-500 font-mono">{tagCount} Elements Purged</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
          <CheckCircle2 className="w-4 h-4" />
          <span>100% Client-Side In-Memory Cleanse</span>
        </div>
      </div>
    </div>
  );
};
