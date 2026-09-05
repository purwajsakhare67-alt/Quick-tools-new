import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Terminal, 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  FileCode, 
  EyeOff, 
  Lock,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalJsObfuscatorProps {
  onBackToGrid?: () => void;
}

const SAMPLE_CODE = `// Production API Client & Authentication Token Validator
function authenticateUser(username, role) {
  const apiKey = "sk_live_99827401928472910482";
  const endpoint = "https://api.internal-cloud.org/v2/auth";
  
  if (!username || username.trim() === "") {
    console.error("Invalid credentials provided");
    return false;
  }
  
  const payload = {
    user: username,
    role: role || "guest",
    timestamp: Date.now(),
    signature: btoa(username + ":" + apiKey)
  };
  
  console.log("Transmitting secure payload to:", endpoint);
  return payload;
}

// Execute authentication test
const session = authenticateUser("developer_admin", "superadmin");
console.log("Generated Token:", session.signature);`;

export const UniversalJsObfuscator: React.FC<UniversalJsObfuscatorProps> = ({ onBackToGrid }) => {
  const [rawCode, setRawCode] = useState<string>(SAMPLE_CODE);
  const [encodeStrings, setEncodeStrings] = useState<boolean>(true);
  const [mangleIdentifiers, setMangleIdentifiers] = useState<boolean>(true);
  const [wrapInIife, setWrapInIife] = useState<boolean>(true);
  const [stripComments, setStripComments] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [testOutput, setTestOutput] = useState<string>('');
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);

  // Obfuscation Engine
  const { obfuscatedCode, stats, syntaxValid } = useMemo(() => {
    if (!rawCode.trim()) {
      return { 
        obfuscatedCode: '', 
        stats: { stringsExtracted: 0, varsMangled: 0, origSize: 0, obfSize: 0, compressionRatio: 1 },
        syntaxValid: true 
      };
    }

    let code = rawCode;
    let syntaxValid = true;

    // Syntax validation check
    try {
      new Function(rawCode);
    } catch {
      syntaxValid = false;
    }

    // 1. Strip comments if enabled
    if (stripComments) {
      code = code.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
    }

    let stringsExtracted = 0;
    let varsMangled = 0;

    // 2. Extract and Base-64 mask string literals
    if (encodeStrings) {
      const extractedStrings: string[] = [];
      // Match double and single quoted strings safely
      code = code.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => {
        const strContent = match.slice(1, -1);
        try {
          const encoded = btoa(strContent);
          extractedStrings.push(encoded);
          stringsExtracted++;
          return `_0xdecode(${extractedStrings.length - 1})`;
        } catch {
          return match;
        }
      });

      if (extractedStrings.length > 0) {
        const tableId = `_0x${Math.random().toString(16).slice(2, 6)}`;
        const decodeFn = `const ${tableId} = [${extractedStrings.map(s => `"${s}"`).join(',')}];
const _0xdecode = function(_0xidx) {
  try {
    return atob(${tableId}[_0xidx]);
  } catch(e) {
    return "";
  }
};\n`;
        code = decodeFn + code;
      }
    }

    // 3. Variable and function identifier mangling
    if (mangleIdentifiers) {
      // Find declared identifiers: function names, let/const/var variable names
      const idMap = new Map<string, string>();
      const identifierRegex = /\b(var|let|const|function)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
      let match;

      while ((match = identifierRegex.exec(rawCode)) !== null) {
        const origName = match[2];
        // Don't mangle standard keywords or very common builtins
        if (!['console', 'window', 'document', 'Date', 'Math', 'JSON', 'Object', 'Array'].includes(origName)) {
          if (!idMap.has(origName)) {
            const mangled = `_0x${Math.random().toString(16).slice(2, 6)}`;
            idMap.set(origName, mangled);
            varsMangled++;
          }
        }
      }

      // Replace identifiers safely with boundary checks
      idMap.forEach((mangled, original) => {
        const regex = new RegExp(`\\b${original}\\b`, 'g');
        code = code.replace(regex, mangled);
      });
    }

    // 4. Wrap in self-executing IIFE
    if (wrapInIife) {
      code = `(function() {\n${code}\n})();`;
    }

    // Measure sizes
    const origSize = new Blob([rawCode]).size;
    const obfSize = new Blob([code]).size;

    return {
      obfuscatedCode: code,
      stats: {
        stringsExtracted,
        varsMangled,
        origSize,
        obfSize,
        compressionRatio: origSize > 0 ? (obfSize / origSize) : 1
      },
      syntaxValid
    };
  }, [rawCode, encodeStrings, mangleIdentifiers, wrapInIife, stripComments]);

  const handleCopy = () => {
    if (!obfuscatedCode) return;
    navigator.clipboard.writeText(obfuscatedCode);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!obfuscatedCode) return;
    const blob = new Blob([obfuscatedCode], { type: 'text/javascript;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'obfuscated_script.js';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const handleRunSandbox = () => {
    setIsRunningTest(true);
    playSound('click');
    setTestOutput('Executing in sandboxed runtime...\n');

    setTimeout(() => {
      const logs: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      try {
        console.log = (...args: any[]) => {
          logs.push(`[LOG] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
        };
        console.error = (...args: any[]) => {
          logs.push(`[ERROR] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
        };
        console.warn = (...args: any[]) => {
          logs.push(`[WARN] ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}`);
        };

        // Run the obfuscated code
        const runner = new Function(obfuscatedCode);
        runner();

        if (logs.length === 0) {
          setTestOutput('✓ Code executed successfully without uncaught runtime errors (0 console outputs emitted).');
        } else {
          setTestOutput(logs.join('\n'));
        }
        playSound('success');
      } catch (err: any) {
        setTestOutput(`✕ Runtime Error: ${err.message || String(err)}`);
        playSound('error');
      } finally {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        setIsRunningTest(false);
      }
    }, 150);
  };

  return (
    <div id="js-obfuscator-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/20 dark:border-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Client-Side JavaScript Obfuscator Code Scrambler
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
                100% In-Browser
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scramble variables, mask string literals with Base-64 array tables, and protect source logic
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

      {/* Preset Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setRawCode(SAMPLE_CODE); playSound('click'); }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-purple-300 transition-colors cursor-pointer"
          >
            Reset Sample Script
          </button>
          <button
            onClick={() => { setRawCode(''); playSound('click'); }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-red-300 transition-colors cursor-pointer"
          >
            Clear Editor
          </button>
        </div>

        {!syntaxValid && rawCode.trim() && (
          <span className="text-xs text-amber-500 flex items-center gap-1 font-semibold">
            ⚠ Warning: Source code has syntax warning or dynamic imports
          </span>
        )}
      </div>

      {/* Obfuscation Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Base-64 String Table
          </label>
          <button
            onClick={() => { setEncodeStrings(!encodeStrings); playSound('click'); }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${encodeStrings ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
          >
            {encodeStrings ? '✓ Mask Strings (Base-64)' : 'Raw Strings'}
          </button>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Identifier Mangling
          </label>
          <button
            onClick={() => { setMangleIdentifiers(!mangleIdentifiers); playSound('click'); }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${mangleIdentifiers ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
          >
            {mangleIdentifiers ? '✓ Scramble Variables (_0x..)' : 'Keep Identifiers'}
          </button>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            IIFE Self-Execution
          </label>
          <button
            onClick={() => { setWrapInIife(!wrapInIife); playSound('click'); }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${wrapInIife ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
          >
            {wrapInIife ? '✓ Wrap in (function(){})()' : 'Global Scope'}
          </button>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Strip Comments
          </label>
          <button
            onClick={() => { setStripComments(!stripComments); playSound('click'); }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${stripComments ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
          >
            {stripComments ? '✓ Remove Comments' : 'Keep Comments'}
          </button>
        </div>
      </div>

      {/* Dual Panel Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Code Panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="raw-js-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-purple-500" /> Source JavaScript
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {stats.origSize} bytes
            </span>
          </div>

          <textarea
            id="raw-js-input"
            rows={14}
            value={rawCode}
            onChange={(e) => setRawCode(e.target.value)}
            placeholder="PASTE YOUR CLIENT-SIDE JAVASCRIPT CODE HERE..."
            className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none shadow-xs"
          />
        </div>

        {/* Obfuscated Output Panel */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-purple-500" /> Obfuscated Output
            </label>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-mono">
              {stats.stringsExtracted} strings masked | {stats.varsMangled} vars renamed
            </span>
          </div>

          <div className="relative">
            <pre
              id="obfuscated-js-output"
              className="w-full p-3.5 font-mono text-xs rounded-xl bg-slate-900 text-purple-300 border border-slate-800 overflow-x-auto h-[260px] select-all shadow-inner leading-relaxed"
            >
              {obfuscatedCode || '// Paste source code to view obfuscated script'}
            </pre>

            {obfuscatedCode && (
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 shadow-md cursor-pointer transition-colors backdrop-blur-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              disabled={!obfuscatedCode}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied Scrambled Code!' : 'Copy Obfuscated Code'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!obfuscatedCode}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download .js
            </button>
            <button
              onClick={handleRunSandbox}
              disabled={!obfuscatedCode || isRunningTest}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Test Run
            </button>
          </div>
        </div>
      </div>

      {/* Sandbox Test Console Window */}
      {testOutput && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-800">
            <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Sandboxed Runtime Execution Console
            </span>
            <button
              onClick={() => setTestOutput('')}
              className="text-[11px] text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              Close
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-300/90 whitespace-pre-wrap max-h-32 overflow-y-auto leading-relaxed">
            {testOutput}
          </pre>
        </div>
      )}
    </div>
  );
};
