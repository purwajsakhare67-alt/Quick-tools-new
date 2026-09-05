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
  Code2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalJsonToYamlConverterProps {
  onBackToGrid?: () => void;
}

// In-memory pure JS recursive JSON to YAML serializer
const jsonToYaml = (val: any, indentLevel = 0, indentSpaces = 2): string => {
  const indent = ' '.repeat(indentLevel * indentSpaces);

  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    // Escape string if needed or multiline
    if (val.includes('\n')) {
      return `|\n${val.split('\n').map(line => `${indent}${' '.repeat(indentSpaces)}${line}`).join('\n')}`;
    }
    if (/[:#\[\]{},&*?|<>=!%@`-]/.test(val) || val === '' || /^\s|\s$/.test(val)) {
      return JSON.stringify(val);
    }
    return val;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    return val
      .map(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const objYaml = jsonToYaml(item, indentLevel + 1, indentSpaces);
          const lines = objYaml.split('\n');
          const first = lines[0].trimStart();
          const rest = lines.slice(1).join('\n');
          return `${indent}- ${first}${rest ? '\n' + rest : ''}`;
        }
        return `${indent}- ${jsonToYaml(item, indentLevel + 1, indentSpaces)}`;
      })
      .join('\n');
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) return '{}';
    return keys
      .map(key => {
        const itemVal = val[key];
        const formattedKey = /[:#\s]/.test(key) ? JSON.stringify(key) : key;
        if (typeof itemVal === 'object' && itemVal !== null) {
          if (Array.isArray(itemVal) && itemVal.length === 0) return `${indent}${formattedKey}: []`;
          if (!Array.isArray(itemVal) && Object.keys(itemVal).length === 0) return `${indent}${formattedKey}: {}`;
          return `${indent}${formattedKey}:\n${jsonToYaml(itemVal, indentLevel + 1, indentSpaces)}`;
        }
        return `${indent}${formattedKey}: ${jsonToYaml(itemVal, indentLevel, indentSpaces)}`;
      })
      .join('\n');
  }

  return String(val);
};

const SAMPLE_JSON = `{
  "apiVersion": "apps/v1",
  "kind": "Deployment",
  "metadata": {
    "name": "nginx-ingress-gateway",
    "labels": {
      "app": "nginx-ingress",
      "env": "production"
    }
  },
  "spec": {
    "replicas": 3,
    "strategy": {
      "type": "RollingUpdate"
    },
    "template": {
      "containers": [
        {
          "name": "nginx",
          "image": "nginx:1.25.3-alpine",
          "ports": [
            { "containerPort": 80, "name": "http" },
            { "containerPort": 443, "name": "https" }
          ],
          "resources": {
            "limits": { "cpu": "500m", "memory": "256Mi" }
          }
        }
      ]
    }
  }
}`;

export const UniversalJsonToYamlConverter: React.FC<UniversalJsonToYamlConverterProps> = ({ onBackToGrid }) => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [indentSpaces, setIndentSpaces] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  const { yamlOutput, error, stats } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { yamlOutput: '', error: null, stats: { lines: 0, bytes: 0 } };
    }
    try {
      const parsed = JSON.parse(jsonInput);
      const yaml = jsonToYaml(parsed, 0, indentSpaces);
      return {
        yamlOutput: yaml,
        error: null,
        stats: {
          lines: yaml.split('\n').length,
          bytes: new Blob([yaml]).size
        }
      };
    } catch (err: any) {
      return {
        yamlOutput: '',
        error: err.message || 'Invalid JSON syntax',
        stats: { lines: 0, bytes: 0 }
      };
    }
  }, [jsonInput, indentSpaces]);

  const handleCopy = () => {
    if (!yamlOutput) return;
    navigator.clipboard.writeText(yamlOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!yamlOutput) return;
    const blob = new Blob([yamlOutput], { type: 'text/yaml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'config.yaml';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="json-yaml-converter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Synchronous JSON to YAML Document Converter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                Developer Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Transform JSON matrices into clean, indentation-accurate YAML documents in browser RAM
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

      {/* Control Configuration Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-500" />
            YAML Indent Spacing:
          </span>
          {[2, 4].map(num => (
            <button
              key={num}
              onClick={() => {
                setIndentSpaces(num);
                playSound('tap');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                indentSpaces === num
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10'
              }`}
            >
              {num} Spaces
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setJsonInput(SAMPLE_JSON);
            playSound('click');
          }}
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Kubernetes Sample
        </button>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="json-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-500" />
              Raw JSON Document Structure
            </label>
            <button
              onClick={() => {
                setJsonInput('');
                playSound('click');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>

          <textarea
            id="json-input"
            rows={14}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste JSON object or array here..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
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
              <span className="text-xs font-bold text-emerald-400">
                Generated YAML Output
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.lines} lines • {stats.bytes} bytes
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="yaml-output"
                readOnly
                rows={14}
                value={yamlOutput || (error ? '# Correct JSON syntax error to generate YAML' : '# YAML document output appears here')}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-emerald-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!yamlOutput || !!error}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied YAML to Clipboard!' : 'Copy YAML Document'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!yamlOutput || !!error}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .yaml
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
