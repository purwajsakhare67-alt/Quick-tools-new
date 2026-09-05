import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle, 
  FileCode, 
  Table, 
  Sparkles, 
  RotateCcw, 
  Cpu, 
  Layers,
  Settings2,
  ChevronDown
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalJsonCsvFlatteningMatrixProps {
  onBackToGrid?: () => void;
}

const SAMPLE_DATASETS = {
  ecommerce: [
    {
      orderId: "ORD-94821",
      status: "fulfilled",
      customer: {
        id: "CUST-104",
        name: "Elena Rostova",
        email: "elena@example.com",
        address: {
          street: "742 Evergreen Terrace",
          city: "Springfield",
          state: "OR",
          zip: "97477",
          geo: { lat: 44.0462, lng: -123.022 }
        }
      },
      payment: {
        method: "credit_card",
        last4: "4242",
        amountUSD: 149.99
      },
      items: [
        { sku: "KEY-01", name: "Wireless Mechanical Keyboard", qty: 1, price: 119.99 },
        { sku: "PAD-02", name: "Extended Desk Mat", qty: 1, price: 30.00 }
      ]
    },
    {
      orderId: "ORD-94822",
      status: "processing",
      customer: {
        id: "CUST-208",
        name: "Marcus Chen",
        email: "marcus@domain.org",
        address: {
          street: "120 Broadway",
          city: "New York",
          state: "NY",
          zip: "10271",
          geo: { lat: 40.7081, lng: -74.0108 }
        }
      },
      payment: {
        method: "apple_pay",
        last4: "9812",
        amountUSD: 89.50
      },
      items: [
        { sku: "MOUSE-09", name: "Ergonomic Vertical Mouse", qty: 1, price: 89.50 }
      ]
    }
  ],
  profiles: [
    {
      userId: 101,
      username: "alex_coder",
      profile: {
        firstName: "Alex",
        lastName: "Vance",
        age: 29,
        skills: ["TypeScript", "React", "Rust"]
      },
      settings: {
        theme: "dark",
        notifications: { email: true, sms: false }
      }
    },
    {
      userId: 102,
      username: "sophia_ui",
      profile: {
        firstName: "Sophia",
        lastName: "Miller",
        age: 34,
        skills: ["Figma", "Design Systems", "CSS"]
      },
      settings: {
        theme: "light",
        notifications: { email: false, sms: true }
      }
    }
  ],
  serverLogs: [
    {
      timestamp: "2026-09-03T10:14:00Z",
      level: "INFO",
      request: {
        method: "POST",
        path: "/api/v1/auth/login",
        ip: "192.168.1.45"
      },
      response: {
        statusCode: 200,
        latencyMs: 34.2
      }
    },
    {
      timestamp: "2026-09-03T10:14:05Z",
      level: "WARN",
      request: {
        method: "GET",
        path: "/api/v1/users/unknown",
        ip: "10.0.0.82"
      },
      response: {
        statusCode: 404,
        latencyMs: 12.8
      }
    }
  ]
};

// Recursive object flattener
function flattenObject(
  obj: any, 
  prefix = '', 
  separator = '.', 
  arrayMode: 'index' | 'join' = 'index', 
  res: Record<string, any> = {}
): Record<string, any> {
  if (obj === null || obj === undefined) {
    if (prefix) res[prefix] = '';
    return res;
  }

  if (typeof obj !== 'object') {
    res[prefix] = obj;
    return res;
  }

  if (Array.isArray(obj)) {
    if (arrayMode === 'join') {
      res[prefix] = obj.map(item => (typeof item === 'object' ? JSON.stringify(item) : String(item))).join('; ');
      return res;
    }
    // 'index' array mode
    if (obj.length === 0) {
      res[prefix] = '[]';
      return res;
    }
    for (let i = 0; i < obj.length; i++) {
      const newPrefix = prefix ? `${prefix}${separator}${i}` : String(i);
      flattenObject(obj[i], newPrefix, separator, arrayMode, res);
    }
    return res;
  }

  // Plain Object
  const keys = Object.keys(obj);
  if (keys.length === 0) {
    res[prefix] = '{}';
    return res;
  }

  for (const key of keys) {
    const newPrefix = prefix ? `${prefix}${separator}${key}` : key;
    flattenObject(obj[key], newPrefix, separator, arrayMode, res);
  }

  return res;
}

// Escape cell for CSV RFC 4180
function escapeCsvCell(val: any, delimiter: string): string {
  if (val === null || val === undefined) return '';
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  // If contains delimiter, quote, or newline, escape with double quotes
  if (str.includes(delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const UniversalJsonCsvFlatteningMatrix: React.FC<UniversalJsonCsvFlatteningMatrixProps> = ({ onBackToGrid }) => {
  const [rawJson, setRawJson] = useState<string>(() => JSON.stringify(SAMPLE_DATASETS.ecommerce, null, 2));
  const [separator, setSeparator] = useState<'.' | '_'>('.');
  const [delimiter, setDelimiter] = useState<string>(',');
  const [arrayMode, setArrayMode] = useState<'index' | 'join'>('index');
  const [activeTab, setActiveTab] = useState<'csv' | 'table'>('table');
  const [copiedCsv, setCopiedCsv] = useState<boolean>(false);

  // Parse and Flatten
  const { parsedJson, jsonError, flattenedData, allHeaders, csvOutput } = useMemo(() => {
    let parsed: any = null;
    let err: string | null = null;
    let flatList: Record<string, any>[] = [];
    const headersSet = new Set<string>();

    try {
      parsed = JSON.parse(rawJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];

      for (const item of items) {
        const flat = flattenObject(item, '', separator, arrayMode);
        flatList.push(flat);
        Object.keys(flat).forEach((k) => headersSet.add(k));
      }
    } catch (e: any) {
      err = e.message || 'Invalid JSON syntax';
    }

    const headers = Array.from(headersSet);
    let csv = '';

    if (!err && headers.length > 0) {
      // Build Header Line
      const headerLine = headers.map(h => escapeCsvCell(h, delimiter)).join(delimiter);
      
      // Build Rows
      const rowLines = flatList.map(row => {
        return headers.map(h => escapeCsvCell(row[h] !== undefined ? row[h] : '', delimiter)).join(delimiter);
      });

      csv = [headerLine, ...rowLines].join('\n');
    }

    return {
      parsedJson: parsed,
      jsonError: err,
      flattenedData: flatList,
      allHeaders: headers,
      csvOutput: csv
    };
  }, [rawJson, separator, delimiter, arrayMode]);

  const handleCopyCSV = () => {
    if (!csvOutput) return;
    navigator.clipboard.writeText(csvOutput);
    playSound('success');
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  const handleDownloadCSV = () => {
    if (!csvOutput) return;
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `flattened_matrix_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    playSound('tap');
  };

  const loadPreset = (presetKey: keyof typeof SAMPLE_DATASETS) => {
    setRawJson(JSON.stringify(SAMPLE_DATASETS[presetKey], null, 2));
    playSound('tap');
  };

  const formatJson = () => {
    try {
      const obj = JSON.parse(rawJson);
      setRawJson(JSON.stringify(obj, null, 2));
      playSound('tap');
    } catch {
      // Ignore
    }
  };

  return (
    <div className="w-full space-y-6" id="universal-json-csv-flattening-matrix">
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Complex JSON to CSV Flattening Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Recursive deep-nesting traversal • RFC 4180 compliant CSV generator • One-click physical export
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyCSV}
            disabled={!csvOutput}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer disabled:opacity-50"
          >
            {copiedCsv ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCsv ? 'CSV Copied!' : 'Copy CSV'}</span>
          </button>
          <button
            onClick={handleDownloadCSV}
            disabled={!csvOutput}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 hover:opacity-95 transition-opacity cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download .csv File</span>
          </button>
        </div>
      </div>

      {/* Preset Ribbons & Formatting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-600 dark:text-white/70">Quick Datasets:</span>
          <button
            onClick={() => loadPreset('ecommerce')}
            className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold transition-colors cursor-pointer"
          >
            E-Commerce Orders
          </button>
          <button
            onClick={() => loadPreset('profiles')}
            className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold transition-colors cursor-pointer"
          >
            User Profiles
          </button>
          <button
            onClick={() => loadPreset('serverLogs')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold transition-colors cursor-pointer"
          >
            Server Logs
          </button>
        </div>

        <button
          onClick={formatJson}
          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white font-bold transition-colors cursor-pointer"
        >
          Beautify JSON
        </button>
      </div>

      {/* Configuration Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
          <label className="font-bold text-slate-700 dark:text-white/80 block">
            Key Path Separator:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSeparator('.');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                separator === '.'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              Dot (user.name)
            </button>
            <button
              onClick={() => {
                setSeparator('_');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                separator === '_'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              Underscore (user_name)
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
          <label className="font-bold text-slate-700 dark:text-white/80 block">
            CSV Field Delimiter:
          </label>
          <select
            value={delimiter}
            onChange={(e) => {
              setDelimiter(e.target.value);
              playSound('tap');
            }}
            className="w-full px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-mono font-bold cursor-pointer"
          >
            <option value=",">Comma ( , ) Standard CSV</option>
            <option value=";">Semicolon ( ; ) European</option>
            <option value="&#9;">Tab ( \t ) TSV Format</option>
            <option value="|">Pipe ( | )</option>
          </select>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 space-y-1">
          <label className="font-bold text-slate-700 dark:text-white/80 block">
            Nested Array Handling:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setArrayMode('index');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                arrayMode === 'index'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              Indexed Keys (0, 1)
            </button>
            <button
              onClick={() => {
                setArrayMode('join');
                playSound('tap');
              }}
              className={`flex-1 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                arrayMode === 'join'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white'
              }`}
            >
              Joined String
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: JSON Editor */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-blue-400" />
              <span>Input JSON Matrix (Object or Array):</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">
              {rawJson.length} Chars
            </span>
          </div>

          <div className="relative">
            <textarea
              value={rawJson}
              onChange={(e) => setRawJson(e.target.value)}
              rows={16}
              className={`w-full text-xs font-mono p-3 rounded-2xl bg-white dark:bg-slate-950 border text-slate-800 dark:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none ${
                jsonError ? 'border-rose-500/50' : 'border-slate-200 dark:border-white/10'
              }`}
              placeholder="Paste raw JSON array here..."
            />
          </div>

          {jsonError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="font-mono">{jsonError}</span>
            </div>
          )}
        </div>

        {/* Right Pane: Flattened View / Table Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-white/5">
              <button
                onClick={() => setActiveTab('table')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'table'
                    ? 'bg-white dark:bg-slate-900 text-blue-500 shadow-xs'
                    : 'text-slate-500 dark:text-white/60'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Spreadsheet Table</span>
              </button>
              <button
                onClick={() => setActiveTab('csv')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === 'csv'
                    ? 'bg-white dark:bg-slate-900 text-blue-500 shadow-xs'
                    : 'text-slate-500 dark:text-white/60'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Raw CSV Text</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-white/50">
              <span>{flattenedData.length} Rows</span>
              <span>•</span>
              <span>{allHeaders.length} Columns</span>
            </div>
          </div>

          {/* Table View */}
          {activeTab === 'table' && (
            <div className="h-[384px] overflow-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/70 p-1 scrollbar-thin">
              {flattenedData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No valid records to display
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-white/[0.04] border-b border-slate-200 dark:border-white/10 sticky top-0 z-10">
                      <th className="p-2 font-mono text-[10px] text-slate-400 w-10">#</th>
                      {allHeaders.map((header) => (
                        <th key={header} className="p-2 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {flattenedData.slice(0, 50).map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                      >
                        <td className="p-2 font-mono text-[10px] text-slate-400">{idx + 1}</td>
                        {allHeaders.map((header) => {
                          const val = row[header];
                          const displayVal = val !== undefined && val !== null ? String(val) : '';
                          return (
                            <td key={header} className="p-2 font-mono text-slate-700 dark:text-white/80 whitespace-nowrap max-w-xs truncate">
                              {displayVal}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Raw CSV Text View */}
          {activeTab === 'csv' && (
            <textarea
              readOnly
              value={csvOutput}
              rows={16}
              className="w-full text-xs font-mono p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-emerald-300 focus:outline-none resize-none select-all"
              placeholder="Flattened CSV will generate automatically..."
            />
          )}
        </div>
      </div>
    </div>
  );
};
