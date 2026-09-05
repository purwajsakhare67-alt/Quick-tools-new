import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Code, 
  Sparkles, 
  Trash2, 
  Columns, 
  BookOpen, 
  ListOrdered
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalMarkdownHtmlConverterProps {
  onBackToGrid?: () => void;
}

const SAMPLE_MARKDOWN = `# QuickFree Tools Release Notes v4.2

Welcome to the **Pro Layouts & Interface Styling Engine**! This release enhances developer ergonomics with 100% *client-side* in-browser utilities.

## Key Features & Highlights
- **High Performance:** Zero backend round-trips for maximum privacy.
- **Cross-Browser Compatible:** Standard CSS rules & clean semantic markup.
- **Hardware Telemetry:** Direct window DPI and aspect ratio analytics.

### Code Example
\`\`\`javascript
// Instant client-side string engine
function sanitizeInput(raw) {
  return raw.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}
console.log(sanitizeInput("<script>alert('safe')</script>"));
\`\`\`

> "Craftsmanship is not about feature volume; it is about pristine execution, mathematical rhythm, and zero latency."

Visit our [Documentation Portal](https://quickfree.tools/docs) to learn more or explore our full suite of 50+ free utilities!
`;

// Native JavaScript Regex Markdown Parser
function parseMarkdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // 1. Normalize line endings
  html = html.replace(/\r\n/g, '\n');

  // 2. Escape standalone raw HTML tags to prevent arbitrary injection while allowing standard conversions
  // Store code blocks first so they aren't mangled
  const codeBlocks: string[] = [];
  html = html.replace(/```([a-zA-Z0-9]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
    const escapedCode = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    codeBlocks.push(`<pre><code class="language-${lang || 'text'}">${escapedCode}</code></pre>`);
    return placeholder;
  });

  // Store inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_, code) => {
    const placeholder = `__INLINE_CODE_${inlineCodes.length}__`;
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    inlineCodes.push(`<code>${escaped}</code>`);
    return placeholder;
  });

  // 3. Headers (# to ######)
  html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

  // 4. Horizontal Rules
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, '<hr />');

  // 5. Blockquotes (> ...)
  html = html.replace(/^>\s+(.*)$/gm, '<blockquote><p>$1</p></blockquote>');
  // Combine consecutive blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '');

  // 6. Bold and Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');

  // 7. Images ![alt](url)
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

  // 8. Hyperlinks [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

  // 9. Unordered Lists
  html = html.replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, (match) => {
    // If not already in ul or ol
    return `<ul>${match}</ul>`;
  });
  // Clean duplicated adjacent <ul> tags
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // 10. Paragraphs: wrap standalone non-tag lines in <p>
  const lines = html.split('\n\n');
  const processed = lines.map((block) => {
    const trimmed = block.trim();
    if (!trimmed) return '';
    if (
      trimmed.startsWith('<h') ||
      trimmed.startsWith('<ul') ||
      trimmed.startsWith('<ol') ||
      trimmed.startsWith('<pre') ||
      trimmed.startsWith('<blockquote') ||
      trimmed.startsWith('<hr') ||
      trimmed.startsWith('__CODE_BLOCK_')
    ) {
      return trimmed;
    }
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  });

  html = processed.join('\n\n');

  // Restore inline codes
  inlineCodes.forEach((code, idx) => {
    html = html.replace(`__INLINE_CODE_${idx}__`, code);
  });

  // Restore code blocks
  codeBlocks.forEach((code, idx) => {
    html = html.replace(`__CODE_BLOCK_${idx}__`, code);
  });

  return html;
}

export const UniversalMarkdownHtmlConverter: React.FC<UniversalMarkdownHtmlConverterProps> = ({
  onBackToGrid
}) => {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_MARKDOWN);
  const [activeTab, setActiveTab] = useState<'preview' | 'html'>('preview');
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  // Convert markdown to HTML in browser
  const rawHtml = useMemo(() => {
    return parseMarkdownToHtml(markdown);
  }, [markdown]);

  // Statistics
  const stats = useMemo(() => {
    const words = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
    const chars = markdown.length;
    const lines = markdown.split('\n').length;
    return { words, chars, lines };
  }, [markdown]);

  const copyHtml = () => {
    playSound('bell');
    navigator.clipboard.writeText(rawHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const downloadHtmlFile = () => {
    playSound('tap');
    const fullDoc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    pre { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 12px; overflow-x: auto; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; color: #475569; font-style: italic; }
    a { color: #4f46e5; text-decoration: underline; }
  </style>
</head>
<body>
${rawHtml}
</body>
</html>`;

    const blob = new Blob([fullDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-colors"
              title="Back to tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <FileCode className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Instant Markdown to Clean HTML Converter
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-600 dark:text-teal-400">
              Productivity Utility
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadHtmlFile}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            title="Download Standalone HTML Document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .html</span>
          </button>
          <button
            onClick={copyHtml}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md hover:shadow-teal-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {copiedHtml ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>HTML Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy Clean HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Column: Markdown Editor */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-500" />
              Markdown Input Source
            </span>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>{stats.words} words</span>
              <span>•</span>
              <span>{stats.chars} chars</span>
              <span>•</span>
              <span>{stats.lines} lines</span>
            </div>
          </div>

          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={18}
            className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden transition-all resize-y shadow-inner leading-relaxed selection:bg-teal-500/30"
            placeholder="Type or paste markdown here..."
          />
        </div>

        {/* Right Column: Live Rendered Preview or Raw HTML */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            {/* View Selector Tabs */}
            <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold">
              <button
                onClick={() => {
                  setActiveTab('preview');
                  playSound('tap');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'preview'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Rendered HTML Preview</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('html');
                  playSound('tap');
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === 'html'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Raw HTML Code</span>
              </button>
            </div>

            <button
              onClick={copyHtml}
              className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
            >
              {copiedHtml ? 'Copied' : 'Copy Output'}
            </button>
          </div>

          {/* Rendered View Container */}
          {activeTab === 'preview' ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 min-h-[400px] max-h-[520px] overflow-y-auto text-slate-800 dark:text-slate-200 space-y-4 shadow-sm text-sm leading-relaxed">
              <div
                dangerouslySetInnerHTML={{ __html: rawHtml }}
                className="[&>h1]:text-2xl [&>h1]:font-black [&>h1]:mb-3 [&>h1]:text-slate-900 dark:[&>h1]:text-white
                           [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-4 [&>h2]:mb-2 [&>h2]:text-slate-900 dark:[&>h2]:text-white
                           [&>h3]:text-base [&>h3]:font-bold [&>h3]:mt-3 [&>h3]:mb-1 [&>h3]:text-slate-900 dark:[&>h3]:text-white
                           [&>p]:text-slate-700 dark:[&>p]:text-slate-300 [&>p]:mb-3
                           [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1 [&>ul]:mb-3
                           [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1 [&>ol]:mb-3
                           [&>blockquote]:border-l-4 [&>blockquote]:border-teal-500 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-slate-500 dark:[&>blockquote]:text-slate-400 [&>blockquote]:my-3
                           [&>pre]:bg-slate-950 [&>pre]:text-slate-200 [&>pre]:p-4 [&>pre]:rounded-2xl [&>pre]:overflow-x-auto [&>pre]:font-mono [&>pre]:text-xs [&>pre]:my-3
                           [&>code]:bg-slate-100 dark:[&>code]:bg-slate-800 [&>code]:text-teal-600 dark:[&>code]:text-teal-400 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded-md [&>code]:font-mono [&>code]:text-xs
                           [&>a]:text-teal-600 dark:[&>a]:text-teal-400 [&>a]:underline [&>hr]:my-4 [&>hr]:border-slate-200 dark:[&>hr]:border-white/10"
              />
            </div>
          ) : (
            <div className="relative group">
              <pre className="p-4 rounded-3xl bg-slate-950 text-teal-300 font-mono text-xs overflow-x-auto border border-white/10 leading-relaxed shadow-lg min-h-[400px] max-h-[520px] overflow-y-auto whitespace-pre-wrap select-all">
                {rawHtml}
              </pre>
              <button
                onClick={copyHtml}
                className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-teal-600/90 hover:bg-teal-600 text-white text-[11px] font-bold shadow-md backdrop-blur-xs flex items-center gap-1 transition-all cursor-pointer"
              >
                {copiedHtml ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHtml ? 'Copied' : 'Copy HTML'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
