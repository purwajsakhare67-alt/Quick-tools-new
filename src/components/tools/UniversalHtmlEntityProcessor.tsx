import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Code2, 
  Copy, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  Unlock, 
  FileText,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHtmlEntityProcessorProps {
  onBackToGrid?: () => void;
}

export const UniversalHtmlEntityProcessor: React.FC<UniversalHtmlEntityProcessorProps> = ({
  onBackToGrid
}) => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputText, setInputText] = useState<string>(
    '<div class="alert" onclick="execute()">' + '\n' +
    '  <h3>Security Notice: "XSS Vulnerability Neutralized" & Tested!</h3>' + '\n' +
    '  <script>alert("Malicious Script Tag Isolated");</script>' + '\n' +
    '  <p>© 2026 QuickFree™ • All Rights Reserved & Protected → 100% Client-Side</p>' + '\n' +
    '</div>'
  );
  const [encodeFormat, setEncodeFormat] = useState<'named' | 'decimal' | 'hex' | 'allChars'>('named');
  const [outputText, setOutputText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // HTML Entity Conversion Engine
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    if (mode === 'encode') {
      let result = '';
      if (encodeFormat === 'named') {
        // Standard Named entities for active HTML syntax characters
        const map: Record<string, string> = {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '`': '&#96;',
          '©': '&copy;',
          '®': '&reg;',
          '™': '&trade;',
          '€': '&euro;',
          '£': '&pound;',
          '¥': '&yen;',
          '•': '&bull;',
          '—': '&mdash;',
          '–': '&ndash;',
          '→': '&rarr;',
          '←': '&larr;',
          ' ': '&nbsp;'
        };
        // We escape core HTML active syntax + common symbols (preserve standard newlines)
        result = inputText.replace(/[&<>"'`©®™€£¥•—–→←]/g, (char) => map[char] || char);
      } else if (encodeFormat === 'decimal') {
        // Decimal entity replacement (e.g. < -> &#60;)
        result = inputText.replace(/[&<>"'`]/g, (char) => `&#${char.charCodeAt(0)};`);
      } else if (encodeFormat === 'hex') {
        // Hexadecimal entity replacement (e.g. < -> &#x3c;)
        result = inputText.replace(/[&<>"'`]/g, (char) => `&#x${char.charCodeAt(0).toString(16)};`);
      } else if (encodeFormat === 'allChars') {
        // Encode all non-alphanumeric characters into decimal entities
        result = inputText.replace(/[^a-zA-Z0-9\s]/g, (char) => `&#${char.charCodeAt(0)};`);
      }
      setOutputText(result);
    } else {
      // Decode Mode: Convert HTML Entities back to normal characters
      try {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = inputText;
        setOutputText(textarea.value);
      } catch {
        // Fallback standard regex entity replacer
        const decoded = inputText
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&#96;/g, '`')
          .replace(/&copy;/g, '©')
          .replace(/&reg;/g, '®')
          .replace(/&trade;/g, '™')
          .replace(/&euro;/g, '€')
          .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
          .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        setOutputText(decoded);
      }
    }
  }, [inputText, mode, encodeFormat]);

  const copyToClipboard = () => {
    if (!outputText) return;
    playSound('bell');
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Preset snippets
  const loadPreset = (snippet: string) => {
    playSound('tap');
    setInputText(snippet);
  };

  const originalLength = inputText.length;
  const processedLength = outputText.length;
  const diffChars = processedLength - originalLength;

  return (
    <div className="w-full space-y-6">
      {/* Top Header Controls */}
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
            <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Shield className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              HTML Entity Encoder & Decoder
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Security Utility
            </span>
          </div>
        </div>

        {/* Encode vs Decode Mode Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-200/80 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => {
              setMode('encode');
              playSound('tap');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'encode'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Encode Entities</span>
          </button>
          <button
            onClick={() => {
              setMode('decode');
              playSound('tap');
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              mode === 'decode'
                ? 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-xs'
                : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Decode Entities</span>
          </button>
        </div>
      </div>

      {/* Preset Buttons & Sub-Format Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
        {mode === 'encode' ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-white/70">Format:</span>
            <div className="flex items-center gap-1 text-xs">
              {[
                { id: 'named', label: 'Named (&lt;)' },
                { id: 'decimal', label: 'Decimal (&#60;)' },
                { id: 'hex', label: 'Hex (&#x3c;)' },
                { id: 'allChars', label: 'Strict Non-Alpha' }
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    setEncodeFormat(fmt.id as any);
                    playSound('tap');
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors ${
                    encodeFormat === fmt.id
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-white/70 hover:bg-slate-200'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-500 dark:text-white/60 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Auto-decodes Named, Decimal (&#00;), and Hex (&#x00;) entities simultaneously.</span>
          </div>
        )}

        {/* Quick Sample Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 dark:text-white/40 text-[11px]">Load Sample:</span>
          <button
            onClick={() => loadPreset('<script>alert("XSS Vector Attack Neutralized");</script>')}
            className="px-2 py-0.8 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white/80 hover:text-amber-500 text-[10px] font-mono border border-slate-200 dark:border-white/10"
          >
            &lt;script&gt;
          </button>
          <button
            onClick={() => loadPreset('Special Characters: & " \' < > © ® ™ € £ ¥ • — → 🚀')}
            className="px-2 py-0.8 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-white/80 hover:text-amber-500 text-[10px] font-mono border border-slate-200 dark:border-white/10"
          >
            Symbols
          </button>
        </div>
      </div>

      {/* Main Dual-Textarea Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-500" />
              {mode === 'encode' ? 'Raw HTML / Input Text' : 'Encoded HTML Entities Input'}
            </span>
            <span className="text-[10px] text-slate-400">
              {originalLength.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={12}
            className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden transition-all resize-none selection:bg-amber-500/30"
            placeholder="Type or paste text with HTML tags or entities here..."
          />
        </div>

        {/* Output Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-500" />
              {mode === 'encode' ? 'Sanitized Encoded Entities' : 'Decoded Clean HTML Text'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-mono font-bold">
                {processedLength.toLocaleString()} chars {diffChars !== 0 && `(${diffChars > 0 ? '+' : ''}${diffChars})`}
              </span>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-white" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputText}
            rows={12}
            className="w-full p-4 rounded-2xl bg-slate-950 text-amber-300 font-mono text-xs border border-amber-500/30 focus:outline-hidden resize-none selection:bg-amber-500/40"
            placeholder="Sanitized entity output appears here..."
          />
        </div>
      </div>

      {/* Security Info Card */}
      <div className="p-4 rounded-3xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3 text-xs text-slate-600 dark:text-white/70">
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-700 dark:text-amber-300">
            Cross-Site Scripting (XSS) Sanitization Standard
          </p>
          <p className="text-[11px] leading-relaxed">
            Converting active characters such as <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-800 dark:text-amber-200">&lt;</code> into <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-800 dark:text-amber-200">&amp;lt;</code> prevents browsers from treating user-supplied input strings as executable JavaScript payload vectors in web layout markup.
          </p>
        </div>
      </div>
    </div>
  );
};
