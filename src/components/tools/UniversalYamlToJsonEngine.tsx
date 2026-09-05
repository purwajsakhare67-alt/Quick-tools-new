import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Download, 
  Sliders, 
  ArrowRight,
  Code2,
  Cpu
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalYamlToJsonEngineProps {
  onBackToGrid?: () => void;
}

// Lightweight client-side YAML parser
const parseYamlSimple = (yamlStr: string): any => {
  const lines = yamlStr.split('\n');

  // Helper to parse scalar values
  const parseScalar = (val: string): any => {
    const trimmed = val.trim();
    if (trimmed === 'true' || trimmed === 'True') return true;
    if (trimmed === 'false' || trimmed === 'False') return false;
    if (trimmed === 'null' || trimmed === '~' || trimmed === '') return null;
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
      return trimmed.slice(1, -1);
    }
    return trimmed;
  };

  // Recursive block parser
  const parseBlock = (lineIdx: number, baseIndent: number): [any, number] => {
    let result: any = null;
    let isArray = false;
    let isObject = false;

    let i = lineIdx;

    while (i < lines.length) {
      const line = lines[i];
      // Skip empty lines and comment-only lines
      if (!line.trim() || line.trim().startsWith('#')) {
        i++;
        continue;
      }

      // Calculate indentation
      const indent = line.search(/\S/);
      if (indent < baseIndent) {
        // Returned back to parent scope
        break;
      }

      const trimmed = line.trim();

      // Array item check
      if (trimmed.startsWith('- ')) {
        if (!isArray && !isObject) {
          isArray = true;
          result = [];
        } else if (isObject) {
          throw new Error(`Syntax error at line ${i + 1}: Unexpected array item in object scope`);
        }

        const itemContent = trimmed.substring(2).trim();

        // Check if item has key-value (e.g. - name: nginx)
        if (itemContent.includes(':') && !itemContent.startsWith('{')) {
          // It's an object starting on the same line
          const colonIdx = itemContent.indexOf(':');
          const key = itemContent.substring(0, colonIdx).trim();
          const valStr = itemContent.substring(colonIdx + 1).trim();

          const subObj: Record<string, any> = {};
          if (valStr === '') {
            // Nested block below
            const [subVal, nextI] = parseBlock(i + 1, indent + 2);
            subObj[key] = subVal;
            result.push(subObj);
            i = nextI;
            continue;
          } else {
            subObj[key] = parseScalar(valStr);
            // Check if subsequent lines have same indentation + 2 belonging to this object
            result.push(subObj);
            i++;
            continue;
          }
        } else if (itemContent === '') {
          // Nested block below item
          const [subVal, nextI] = parseBlock(i + 1, indent + 2);
          result.push(subVal);
          i = nextI;
          continue;
        } else {
          result.push(parseScalar(itemContent));
          i++;
          continue;
        }
      }

      // Key-Value Object check
      if (trimmed.includes(':')) {
        if (!isArray && !isObject) {
          isObject = true;
          result = {};
        } else if (isArray) {
          // If we had an array, and now have key:value at same base indent
          break;
        }

        const colonIdx = trimmed.indexOf(':');
        let key = trimmed.substring(0, colonIdx).trim();
        if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
          key = key.slice(1, -1);
        }
        const valStr = trimmed.substring(colonIdx + 1).trim();

        if (valStr === '' || valStr.startsWith('#')) {
          // Child block
          const [subVal, nextI] = parseBlock(i + 1, indent + 1);
          result[key] = subVal;
          i = nextI;
          continue;
        } else {
          result[key] = parseScalar(valStr.split(' #')[0]);
          i++;
          continue;
        }
      }

      i++;
    }

    return [result, i];
  };

  const [res] = parseBlock(0, 0);
  return res || {};
};

const SAMPLE_YAML = `# Kubernetes Microservice Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
  namespace: production
  labels:
    tier: gateway
    cluster: us-central-1
spec:
  replicas: 5
  enabled: true
  ports:
    - name: http
      port: 80
    - name: https
      port: 443
  env:
    NODE_ENV: production
    CACHE_TTL: 3600
`;

export const UniversalYamlToJsonEngine: React.FC<UniversalYamlToJsonEngineProps> = ({ onBackToGrid }) => {
  const [yamlInput, setYamlInput] = useState<string>(SAMPLE_YAML);
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [compact, setCompact] = useState<boolean>(false);
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { jsonOutput, error, stats } = useMemo(() => {
    if (!yamlInput.trim()) {
      return { jsonOutput: '', error: null, stats: { lines: 0, bytes: 0 } };
    }

    try {
      let parsed = parseYamlSimple(yamlInput);

      if (sortKeys && parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const sortedObj: any = {};
        Object.keys(parsed)
          .sort()
          .forEach((k) => {
            sortedObj[k] = parsed[k];
          });
        parsed = sortedObj;
      }

      const jsonStr = compact ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentSpaces);
      return {
        jsonOutput: jsonStr,
        error: null,
        stats: {
          lines: jsonStr.split('\n').length,
          bytes: new Blob([jsonStr]).size
        }
      };
    } catch (err: any) {
      return {
        jsonOutput: '',
        error: err.message || 'Error parsing YAML document structure',
        stats: { lines: 0, bytes: 0 }
      };
    }
  }, [yamlInput, indentSpaces, compact, sortKeys]);

  const handleCopy = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'output.json';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="yaml-to-json-engine-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 dark:border-amber-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Structured YAML to JSON Format Engine
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                Cloud Analytics Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Run string node analysis routines client-side to convert mapping structures into indented standard JSON strings
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

      {/* Configuration Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
            JSON Indentation:
          </span>
          {[2, 4].map((num) => (
            <button
              key={num}
              onClick={() => {
                setIndentSpaces(num);
                setCompact(false);
                playSound('tap');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                indentSpaces === num && !compact
                  ? 'bg-amber-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              {num} Spaces
            </button>
          ))}
          <button
            onClick={() => {
              setCompact(!compact);
              playSound('tap');
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              compact
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
            }`}
          >
            Compact Minified
          </button>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500"
            />
            Sort Keys A-Z
          </label>
          <button
            onClick={() => {
              setYamlInput(SAMPLE_YAML);
              playSound('click');
            }}
            className="text-xs text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Reload Sample
          </button>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="yaml-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-amber-500" />
              Source Nested YAML Syntax
            </label>
            <button
              onClick={() => {
                setYamlInput('');
                playSound('click');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              Clear
            </button>
          </div>

          <textarea
            id="yaml-input"
            rows={13}
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            placeholder="Paste nested YAML mapping document here..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none leading-relaxed"
          />

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Right: Output Structure Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400">
                Generated JSON Object Tree
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.lines} lines • {stats.bytes} bytes
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="json-engine-output"
                readOnly
                rows={13}
                value={jsonOutput || (error ? '/* Correct YAML syntax to generate JSON */' : '/* Generated JSON tree renders here */')}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-amber-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!jsonOutput || !!error}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white shadow-md shadow-amber-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied JSON to Clipboard!' : 'Copy JSON Tree'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!jsonOutput || !!error}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .json
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
