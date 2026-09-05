import React, { useState, useMemo } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  Download, 
  Sliders, 
  Percent,
  CheckCircle2,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHtmlMinifierProps {
  onBackToGrid?: () => void;
}

const SAMPLE_DIRTY_HTML = `<!DOCTYPE html>
<html lang="en">
  <!-- Core Head Configuration -->
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>   High Speed Landing Page   </title>
    <!-- Stylesheet -->
    <style>
      body {
        margin: 0;
        padding: 20px;
        background-color: #ffffff;
      }
      .card {
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <!-- Main Content Container -->
    <main id="app-root" class="container mx-auto">
      <h1>   Welcome to Ultra Fast Web   </h1>
      <p>
        Accelerating browser rendering pipelines with zero server latency.
      </p>
    </main>

    <script>
      console.log( "Page initialized successfully" );
    </script>
  </body>
</html>`;

export const UniversalHtmlMinifier: React.FC<UniversalHtmlMinifierProps> = ({ onBackToGrid }) => {
  const [htmlInput, setHtmlInput] = useState<string>(SAMPLE_DIRTY_HTML);
  const [stripComments, setStripComments] = useState<boolean>(true);
  const [collapseWhitespace, setCollapseWhitespace] = useState<boolean>(true);
  const [removeOptionalTags, setRemoveOptionalTags] = useState<boolean>(false);
  const [stripTrailingSlashes, setStripTrailingSlashes] = useState<boolean>(true);
  const [minifyEmbeddedCssJs, setMinifyEmbeddedCssJs] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // In-memory regex filtering and minification pipeline
  const minifiedOutput = useMemo(() => {
    if (!htmlInput.trim()) return '';

    let code = htmlInput;

    // 1. Strip HTML comments (preserving conditional comments if needed)
    if (stripComments) {
      code = code.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
    }

    // 2. Minify embedded <style> blocks
    if (minifyEmbeddedCssJs) {
      code = code.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (match, cssContent) => {
        let cleanCss = cssContent
          .replace(/\/\*[\s\S]*?\*\//g, '') // remove css comments
          .replace(/\s+/g, ' ')
          .replace(/\s*([:;{}])\s*/g, '$1')
          .replace(/;}/g, '}')
          .trim();
        return `<style>${cleanCss}</style>`;
      });

      // Minify embedded <script> blocks (basic safe white-space/comment strip)
      code = code.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, (match, jsContent) => {
        let cleanJs = jsContent
          .replace(/\/\*[\s\S]*?\*\//g, '') // multiline comments
          .replace(/^\s*\/\/.*$/gm, '') // single-line comments
          .replace(/\s+/g, ' ')
          .replace(/\s*([=+\-*/{}();,:])\s*/g, '$1')
          .trim();
        return `<script>${cleanJs}</script>`;
      });
    }

    // 3. Strip trailing slashes in void elements (e.g. <br /> -> <br>)
    if (stripTrailingSlashes) {
      code = code.replace(/<(meta|link|img|br|hr|input)([^>]*?)\s*\/>/gi, '<$1$2>');
    }

    // 4. Collapse general whitespace between tags and words
    if (collapseWhitespace) {
      code = code
        .replace(/>\s+</g, '><') // between tags
        .replace(/\s{2,}/g, ' ') // multi spaces to single
        .replace(/^\s+|\s+$/gm, '') // line trim
        .replace(/[\r\n\t]+/g, ''); // strip newlines completely for single-line minification
    }

    return code.trim();
  }, [htmlInput, stripComments, collapseWhitespace, removeOptionalTags, stripTrailingSlashes, minifyEmbeddedCssJs]);

  // Size metrics
  const stats = useMemo(() => {
    const rawBytes = new Blob([htmlInput]).size;
    const minBytes = new Blob([minifiedOutput]).size;
    const savedBytes = Math.max(0, rawBytes - minBytes);
    const reductionPercent = rawBytes > 0 ? Math.round((savedBytes / rawBytes) * 100) : 0;
    const rawLines = htmlInput ? htmlInput.split('\n').length : 0;
    const minLines = minifiedOutput ? minifiedOutput.split('\n').length : 0;

    return { rawBytes, minBytes, savedBytes, reductionPercent, rawLines, minLines };
  }, [htmlInput, minifiedOutput]);

  const handleCopy = () => {
    if (!minifiedOutput) return;
    navigator.clipboard.writeText(minifiedOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!minifiedOutput) return;
    const blob = new Blob([minifiedOutput], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.min.html';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="html-minifier-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 dark:border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <FileCode2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Performance HTML Code Minifier &amp; Script Compressor
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                SEO &amp; Web Performance
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Apply clean regex filter mapping routines natively to erase tag spaces, comments, and carriage return symbols
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

      {/* Control Configuration & Metric Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        {/* Minification Toggles */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-blue-500" />
            Minification Rules
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={stripComments}
                onChange={(e) => setStripComments(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Strip Comments
            </label>

            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={collapseWhitespace}
                onChange={(e) => setCollapseWhitespace(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Single-Line Flatten
            </label>

            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={minifyEmbeddedCssJs}
                onChange={(e) => setMinifyEmbeddedCssJs(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Minify &lt;style&gt; &amp; &lt;script&gt;
            </label>

            <label className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={stripTrailingSlashes}
                onChange={(e) => setStripTrailingSlashes(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              HTML5 Void Slashes
            </label>
          </div>
        </div>

        {/* Live Compression Metrics */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
          <div className="text-center">
            <div className="text-[11px] text-slate-400">Original Size</div>
            <div className="text-sm font-bold text-slate-700 dark:text-slate-200 font-mono">
              {stats.rawBytes} B
            </div>
            <div className="text-[10px] text-slate-500">{stats.rawLines} lines</div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />

          <div className="text-center">
            <div className="text-[11px] text-slate-400">Minified Size</div>
            <div className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
              {stats.minBytes} B
            </div>
            <div className="text-[10px] text-slate-500">{stats.minLines} line</div>
          </div>

          <div className="h-8 w-px bg-slate-200 dark:bg-white/10" />

          <div className="text-center">
            <div className="text-[11px] text-slate-400">Reduction</div>
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              -{stats.reductionPercent}%
            </div>
            <div className="text-[10px] text-emerald-500">Saved {stats.savedBytes} B</div>
          </div>
        </div>
      </div>

      {/* Dual Layout Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="html-raw-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-blue-500" />
              Raw HTML / Template Markup
            </label>
            <button
              onClick={() => {
                setHtmlInput('');
                playSound('click');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>

          <textarea
            id="html-raw-input"
            rows={13}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste raw HTML markup or page templates here..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
          />
        </div>

        {/* Right: Minified Code Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-center justify-between pb-1 border-b border-slate-800">
              <span className="text-xs font-bold text-blue-400">
                Minified Single-Line HTML
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                {stats.reductionPercent}% compressed
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="html-minified-output"
                readOnly
                rows={13}
                value={minifiedOutput || '<!-- Minified single line output appears here -->'}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-blue-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!minifiedOutput}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Minified HTML!' : 'Copy Minified HTML'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!minifiedOutput}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .html
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
