import React, { useState, useMemo } from 'react';
import { 
  Split, 
  Copy, 
  Check, 
  Download, 
  Settings2, 
  ListFilter, 
  Hash, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalStringTokenizerProps {
  onBackToGrid?: () => void;
}

const PRESET_DELIMITERS = [
  { label: 'Comma (,)', value: ',' },
  { label: 'Semicolon (;)', value: ';' },
  { label: 'Pipe (|)', value: '|' },
  { label: 'Tab (\\t)', value: '\t' },
  { label: 'Space', value: ' ' },
  { label: 'Slash (/)', value: '/' },
  { label: 'Newline (\\n)', value: '\n' }
];

export const UniversalStringTokenizer: React.FC<UniversalStringTokenizerProps> = ({ onBackToGrid }) => {
  const [inputData, setInputData] = useState<string>(
    'apple, banana, cherry, date, elderberry, fig, grape, honeydew, kiwi, lemon, mango, nectarine, orange, papaya'
  );
  const [delimiter, setDelimiter] = useState<string>(',');
  const [trimTokens, setTrimTokens] = useState<boolean>(true);
  const [removeEmpty, setRemoveEmpty] = useState<boolean>(true);
  const [sortAlpha, setSortAlpha] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Core parsing using native JS split
  const tokens = useMemo(() => {
    if (!inputData) return [];
    
    // Check delimiter
    let rawTokens: string[] = [];
    if (delimiter === '') {
      rawTokens = inputData.split('');
    } else {
      rawTokens = inputData.split(delimiter);
    }

    if (trimTokens) {
      rawTokens = rawTokens.map(t => t.trim());
    }

    if (removeEmpty) {
      rawTokens = rawTokens.filter(t => t.length > 0);
    }

    if (sortAlpha) {
      rawTokens.sort((a, b) => a.localeCompare(b));
    }

    return rawTokens;
  }, [inputData, delimiter, trimTokens, removeEmpty, sortAlpha]);

  const handleCopyJSON = () => {
    if (tokens.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(tokens, null, 2));
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLines = () => {
    if (tokens.length === 0) return;
    navigator.clipboard.writeText(tokens.join('\n'));
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCSV = () => {
    if (tokens.length === 0) return;
    const csvContent = 'Index,Token\n' + tokens.map((t, idx) => `${idx + 1},"${t.replace(/"/g, '""')}"`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tokenized_array.csv';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="string-tokenizer-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-sky-500/10 to-indigo-500/10 border border-blue-500/20 dark:border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Delimiter-Based String Tokenizer &amp; Splitter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                Data Processing
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Split complex data strings, logs, and CSV lines into indexed array tables with instant export
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

      {/* Delimiter & Options Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        {/* Delimiter Picker */}
        <div className="space-y-2">
          <label htmlFor="custom-delimiter-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-blue-500" />
            Target Matching Delimiter
          </label>
          <div className="flex gap-2">
            <input
              id="custom-delimiter-input"
              type="text"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              placeholder="e.g. , or ; or /"
              className="w-24 p-2 font-mono text-center text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex-1 flex flex-wrap gap-1.5">
              {PRESET_DELIMITERS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setDelimiter(preset.value);
                    playSound('tap');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    delimiter === preset.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-blue-300'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cleaning Options */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-blue-500" />
            Array Processing Filters
          </label>
          <div className="flex flex-wrap gap-3 pt-1">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={trimTokens}
                onChange={(e) => setTrimTokens(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Trim Whitespace
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={removeEmpty}
                onChange={(e) => setRemoveEmpty(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Filter Empty Strings
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={sortAlpha}
                onChange={(e) => setSortAlpha(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
              Sort A → Z
            </label>
          </div>
        </div>
      </div>

      {/* Main Data Input Block */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs space-y-2">
        <div className="flex items-center justify-between pb-1">
          <label htmlFor="tokenizer-raw-input" className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Raw Input Data Block
          </label>
          <span className="text-[11px] text-slate-400">
            {inputData.length} chars • Delimiter: <span className="font-mono font-bold text-blue-600">{JSON.stringify(delimiter)}</span>
          </span>
        </div>
        <textarea
          id="tokenizer-raw-input"
          rows={4}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder="Paste comma separated list, log file, or raw strings here..."
          className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Output Status Table & Actions */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Parsed Token Rows ({tokens.length})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLines}
              disabled={tokens.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              Copy Lines
            </button>
            <button
              onClick={handleCopyJSON}
              disabled={tokens.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Copy JSON Array
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={tokens.length === 0}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download CSV
            </button>
          </div>
        </div>

        {/* Structured table */}
        <div className="max-h-[360px] overflow-y-auto rounded-xl border border-slate-200/80 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="p-2.5 w-16 text-center">#</th>
                <th className="p-2.5">Extracted String Token</th>
                <th className="p-2.5 w-24 text-right">Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-6 text-center text-slate-400">
                    No tokens produced. Provide an input string and matching delimiter.
                  </td>
                </tr>
              ) : (
                tokens.map((tok, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="p-2.5 text-center text-slate-400 font-sans font-bold text-[11px]">{idx + 1}</td>
                    <td className="p-2.5 text-slate-900 dark:text-slate-100 font-medium break-all">{tok}</td>
                    <td className="p-2.5 text-right text-slate-400 text-[11px]">{tok.length} ch</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
