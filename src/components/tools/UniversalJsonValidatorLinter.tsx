import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  Code2, 
  Wand2,
  Minimize2,
  Maximize2,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalJsonValidatorLinterProps {
  onBackToGrid?: () => void;
}

interface JsonSyntaxError {
  message: string;
  line: number;
  column: number;
  snippet?: string;
  hint?: string;
}

const SAMPLE_JSONS = {
  apiResponse: JSON.stringify({
    status: 200,
    timestamp: "2026-09-03T13:00:00Z",
    data: {
      user: {
        id: "usr_99812",
        name: "Alex Sterling",
        email: "alex@example.io",
        roles: ["admin", "developer"],
        verified: true,
        preferences: {
          theme: "dark",
          notifications: { email: true, push: false, sms: null }
        }
      },
      tokens: {
        accessExpiresIn: 3600,
        type: "Bearer"
      }
    }
  }, null, 2),
  
  eCommerce: JSON.stringify({
    catalog: "Hardware 2026",
    currency: "USD",
    totalItems: 3,
    products: [
      { id: "PROD-101", title: "Mechanical Keyboard", price: 129.99, inStock: true, tags: ["peripherals", "rgb"] },
      { id: "PROD-102", title: "Precision Wireless Mouse", price: 79.50, inStock: true, tags: ["wireless", "gaming"] },
      { id: "PROD-103", title: "Ultra-Wide 4K Monitor", price: 499.00, inStock: false, tags: ["displays", "hdr"] }
    ]
  }, null, 2),

  brokenJson: `{\n  "name": "Dev Studio",\n  "version": 2.5\n  "debugMode": true,\n  "supportedEngines": [\n    "v8",\n    "spidermonkey",\n  ]\n}`
};

export const UniversalJsonValidatorLinter: React.FC<UniversalJsonValidatorLinterProps> = ({ onBackToGrid }) => {
  const [rawInput, setRawInput] = useState<string>(SAMPLE_JSONS.apiResponse);
  const [indentOption, setIndentOption] = useState<'2' | '4' | 'tab' | 'minified'>('2');
  const [copied, setCopied] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Validation & Linting logic
  const validationResult = useMemo(() => {
    if (!rawInput.trim()) {
      return {
        isValid: false,
        error: null,
        formatted: '',
        stats: { lines: 0, bytes: 0, keys: 0, depth: 0 }
      };
    }

    try {
      const parsed = JSON.parse(rawInput);
      
      // Calculate formatting
      let formatted = '';
      if (indentOption === 'minified') {
        formatted = JSON.stringify(parsed);
      } else if (indentOption === 'tab') {
        formatted = JSON.stringify(parsed, null, '\t');
      } else {
        formatted = JSON.stringify(parsed, null, parseInt(indentOption, 10));
      }

      // Calculate tree depth and key count
      let keysCount = 0;
      let maxDepth = 0;

      const analyze = (val: any, currentDepth = 1) => {
        if (currentDepth > maxDepth) maxDepth = currentDepth;
        if (val !== null && typeof val === 'object') {
          if (Array.isArray(val)) {
            val.forEach(item => analyze(item, currentDepth + 1));
          } else {
            const keys = Object.keys(val);
            keysCount += keys.length;
            keys.forEach(k => analyze(val[k], currentDepth + 1));
          }
        }
      };
      analyze(parsed);

      return {
        isValid: true,
        error: null,
        formatted,
        stats: {
          lines: formatted.split('\n').length,
          bytes: new Blob([formatted]).size,
          keys: keysCount,
          depth: maxDepth
        }
      };
    } catch (err: any) {
      const msg: string = err?.message || 'Invalid JSON syntax';
      let errorLine = 1;
      let errorCol = 1;
      let hint = 'Verify opening/closing brackets, quotes around keys, and trailing commas.';

      // Attempt parsing error location (standard V8 format: "at position X" or "line Y column Z")
      const posMatch = msg.match(/position (\d+)/i);
      const lineColMatch = msg.match(/line (\d+) column (\d+)/i);

      if (lineColMatch) {
        errorLine = parseInt(lineColMatch[1], 10);
        errorCol = parseInt(lineColMatch[2], 10);
      } else if (posMatch) {
        const charIndex = parseInt(posMatch[1], 10);
        const textUpToError = rawInput.slice(0, charIndex);
        const lines = textUpToError.split('\n');
        errorLine = lines.length;
        errorCol = lines[lines.length - 1].length + 1;
      } else {
        // Heuristic fallback for common syntax mistakes
        const lines = rawInput.split('\n');
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (/,\s*[}\]]/.test(line)) {
            errorLine = i + 1;
            hint = 'Trailing comma detected before closing bracket/brace.';
            break;
          }
          if (/[a-zA-Z0-9_]+\s*:/.test(line) && !/"[^"]+"\s*:/.test(line)) {
            errorLine = i + 1;
            hint = 'Unquoted key detected. JSON keys must strictly be wrapped in double quotes.';
            break;
          }
        }
      }

      // Generate snippet of the error line
      const allLines = rawInput.split('\n');
      const snippet = allLines[errorLine - 1] !== undefined ? allLines[errorLine - 1] : '';

      if (msg.includes('Unexpected token') || msg.includes('Expected')) {
        if (snippet.includes("'")) {
          hint = 'Single quotes are invalid in JSON. Replace with standard double quotes (").';
        } else if (/,\s*$/.test(snippet.trim()) === false && errorLine < allLines.length && allLines[errorLine].trim().startsWith('"')) {
          hint = 'Missing comma (,) at the end of the previous key-value entry.';
        }
      }

      const syntaxError: JsonSyntaxError = {
        message: msg,
        line: errorLine,
        column: errorCol,
        snippet,
        hint
      };

      return {
        isValid: false,
        error: syntaxError,
        formatted: rawInput,
        stats: {
          lines: allLines.length,
          bytes: new Blob([rawInput]).size,
          keys: 0,
          depth: 0
        }
      };
    }
  }, [rawInput, indentOption]);

  // Actions
  const handleFormatAndValidate = () => {
    playSound('calcChime');
    if (validationResult.isValid) {
      setRawInput(validationResult.formatted);
      setStatusMessage('JSON verified and cleanly formatted!');
    } else {
      setStatusMessage('Syntax error detected. Review the highlighted line below.');
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleFixCommonIssues = () => {
    playSound('tap');
    try {
      let fixed = rawInput;
      // 1. Remove trailing commas before } or ]
      fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
      // 2. Replace single quotes around keys/values with double quotes
      fixed = fixed.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, '"$1"');
      // 3. Wrap unquoted keys in quotes: e.g. { foo: 1 } -> { "foo": 1 }
      fixed = fixed.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
      
      // Test if fixed is valid
      JSON.parse(fixed);
      setRawInput(JSON.stringify(JSON.parse(fixed), null, indentOption === 'tab' ? '\t' : parseInt(indentOption, 10) || 2));
      setStatusMessage('Auto-repaired trailing commas and unquoted keys!');
      playSound('success');
    } catch {
      setStatusMessage('Attempted auto-repair, but remaining syntax issues require manual correction.');
    }
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleMinify = () => {
    playSound('tap');
    try {
      const parsed = JSON.parse(rawInput);
      setRawInput(JSON.stringify(parsed));
      setIndentOption('minified');
      setStatusMessage('JSON compressed to single-line minified string.');
    } catch {
      setStatusMessage('Cannot minify invalid JSON. Please resolve syntax errors first.');
    }
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleCopy = async () => {
    const textToCopy = validationResult.isValid ? validationResult.formatted : rawInput;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      playSound('success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    playSound('tap');
    const content = validationResult.isValid ? validationResult.formatted : rawInput;
    const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Split formatted or raw lines for line-numbered view
  const formattedLines = useMemo(() => {
    const text = validationResult.isValid ? validationResult.formatted : rawInput;
    return text.split('\n');
  }, [validationResult, rawInput]);

  return (
    <div className="space-y-6 text-slate-800 dark:text-white/90" id="json-validator-linter-tool">
      
      {/* Top Banner & Presets Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>Real-Time JSON Validator & Formatter Linter</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/20 text-cyan-600 dark:text-cyan-300">
                RFC 8259 Compliant
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Instant in-browser tree parse, line-by-line syntax error trapping, and beauty formatting
            </p>
          </div>
        </div>

        {/* Sample presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 dark:text-white/40 mr-1">Load Preset:</span>
          <button
            onClick={() => {
              setRawInput(SAMPLE_JSONS.apiResponse);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            API User
          </button>
          <button
            onClick={() => {
              setRawInput(SAMPLE_JSONS.eCommerce);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-white/10 hover:bg-slate-100 dark:hover:bg-white/20 border border-slate-200 dark:border-white/10 transition-colors"
          >
            Catalog
          </button>
          <button
            onClick={() => {
              setRawInput(SAMPLE_JSONS.brokenJson);
              playSound('tap');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 transition-colors"
          >
            Syntax Error Demo
          </button>
        </div>
      </div>

      {/* Control Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-500 dark:text-white/60">Indentation:</span>
          {(['2', '4', 'tab', 'minified'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setIndentOption(mode);
                playSound('tap');
              }}
              className={`px-2.5 py-1 rounded-lg font-bold uppercase transition-all ${
                indentOption === mode
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'bg-white dark:bg-white/10 text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/15'
              }`}
            >
              {mode === 'tab' ? 'Tab' : mode === 'minified' ? 'Minified' : `${mode} Spaces`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleFormatAndValidate}
            className="px-3 py-1.5 rounded-xl font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            id="json-validate-format-btn"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Validate & Format</span>
          </button>

          <button
            onClick={handleFixCommonIssues}
            className="px-3 py-1.5 rounded-xl font-bold bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Auto-remove trailing commas and wrap unquoted keys"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Auto-Fix Commas</span>
          </button>

          <button
            onClick={handleMinify}
            className="px-3 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-700 dark:text-white/80 flex items-center gap-1.5 cursor-pointer transition-all"
            title="Minify to single line"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>

          <button
            onClick={() => {
              setRawInput('');
              playSound('reset');
            }}
            className="px-2.5 py-1.5 rounded-xl font-semibold text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Notification Toast if action executed */}
      {statusMessage && (
        <div className="p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-800 dark:text-cyan-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <Info className="w-4 h-4 text-cyan-500 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Status Bar / Error or Success Alert */}
      {validationResult.isValid ? (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-300">
                Syntactically Valid JSON
              </span>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
                Parses cleanly under standard ECMAScript JSON engine with zero syntax violations.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-600 dark:text-white/70">
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded font-bold text-emerald-700 dark:text-emerald-300">
              {validationResult.stats.lines} Lines
            </span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded font-bold text-emerald-700 dark:text-emerald-300">
              {validationResult.stats.keys} Keys
            </span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded font-bold text-emerald-700 dark:text-emerald-300">
              Depth: {validationResult.stats.depth}
            </span>
            <span className="bg-emerald-500/20 px-2 py-0.5 rounded font-bold text-emerald-700 dark:text-emerald-300">
              {(validationResult.stats.bytes / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
      ) : validationResult.error ? (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-extrabold text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Syntax Error Trapped on Line {validationResult.error.line}, Column {validationResult.error.column}</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-mono text-[10px] font-bold">
              JSON.parse Failure
            </span>
          </div>

          <div className="font-mono text-xs p-2.5 rounded-xl bg-slate-900 text-rose-300 border border-rose-500/30 overflow-x-auto">
            <span className="text-slate-500 mr-3">Line {validationResult.error.line}:</span>
            <span className="bg-rose-950/80 px-1 py-0.5 rounded border border-rose-500/40 text-white font-bold">
              {validationResult.error.snippet || '<end of content>'}
            </span>
          </div>

          <p className="text-[11px] text-rose-700 dark:text-rose-300 font-medium">
            <strong>Diagnostic Hint:</strong> {validationResult.error.hint}
          </p>
        </div>
      ) : null}

      {/* Main Two-Column Layout (Raw Input vs Tree Architecture Output) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Left Column: Raw Input Textarea */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-white/70">
            <label htmlFor="raw-json-input" className="flex items-center gap-1.5">
              <span>Input Raw JSON String</span>
              <span className="text-slate-400 font-normal font-mono">({rawInput.length} chars)</span>
            </label>
            <span className="text-[10px] font-mono uppercase text-cyan-600 dark:text-cyan-400">
              Live Keystroke Monitor
            </span>
          </div>

          <div className="relative flex-1">
            <textarea
              id="raw-json-input"
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste raw JSON here or load a sample preset above..."
              rows={16}
              className="w-full h-full min-h-[380px] p-3.5 rounded-2xl bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-cyan-500/40 transition-all resize-y selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Column: Beautiful Indented Tree Architecture Output with Line Numbers */}
        <div className="space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-white/70">
            <div className="flex items-center gap-1.5">
              <span>Formatted Tree Architecture</span>
              {validationResult.isValid && (
                <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  Ready
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Download JSON file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .json</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[380px] rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 shadow-inner overflow-hidden flex flex-col">
            
            {/* Display Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-1 text-slate-300">schema_output.json</span>
              </span>
              <span>{formattedLines.length} lines</span>
            </div>

            {/* Line-numbered Code Area */}
            <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed custom-scrollbar">
              {formattedLines.map((line, idx) => {
                const lineNum = idx + 1;
                const isErrorLine = !validationResult.isValid && validationResult.error?.line === lineNum;

                return (
                  <div 
                    key={idx} 
                    className={`flex items-start hover:bg-white/[0.04] transition-colors rounded ${
                      isErrorLine ? 'bg-rose-950/60 border-l-2 border-rose-500 text-rose-200' : ''
                    }`}
                  >
                    <span className={`w-10 shrink-0 text-right pr-3 select-none text-[11px] ${
                      isErrorLine ? 'text-rose-400 font-bold' : 'text-slate-600'
                    }`}>
                      {lineNum}
                    </span>
                    <pre className="flex-1 whitespace-pre overflow-x-auto text-slate-200 font-mono">
                      {line || ' '}
                    </pre>
                  </div>
                );
              })}
            </div>
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
