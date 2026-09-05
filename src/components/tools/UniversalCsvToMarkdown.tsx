import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  RotateCcw, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Table, 
  Sparkles, 
  Code2,
  Eye,
  Sliders
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface CsvToMarkdownProps {
  onBackToGrid?: () => void;
}

type Alignment = 'left' | 'center' | 'right';

export const UniversalCsvToMarkdown: React.FC<CsvToMarkdownProps> = ({ onBackToGrid }) => {
  const initialCsv = `Plan,Monthly ($),Annual ($),Storage,Seats,SLA
Starter,29,290,50 GB,3 Users,99.5%
Growth,79,790,250 GB,10 Users,99.9%
Scale,199,1990,1 TB,Unlimited,99.99%
Enterprise,Custom,Custom,Dedicated,Unlimited,99.999%`;

  const [csvInput, setCsvInput] = useState<string>(initialCsv);
  const [hasHeader, setHasHeader] = useState<boolean>(true);
  const [defaultAlignment, setDefaultAlignment] = useState<Alignment>('left');
  const [columnAlignments, setColumnAlignments] = useState<Record<number, Alignment>>({});
  const [prettyPad, setPrettyPad] = useState<boolean>(true);
  const [delimiter, setDelimiter] = useState<string>('auto');
  const [copied, setCopied] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'table' | 'raw'>('table');

  // Sample quick-load presets
  const samplePresets = [
    {
      label: 'SaaS Pricing Tiers',
      data: `Tier,Monthly ($),Storage,Seats,Support
Free,0,5 GB,1 User,Community
Pro,29,100 GB,5 Users,Email
Business,99,1 TB,25 Users,24/7 Priority
Enterprise,Custom,Unlimited,Unlimited,Dedicated TAM`
    },
    {
      label: 'API Endpoints Matrix',
      data: `Method,Endpoint,Description,Auth,Rate Limit
GET,/api/v1/tools,List all micro utilities,None,120/min
POST,/api/v1/enhance,Synthesize system prompt,Bearer,30/min
GET,/api/v1/metrics,Platform health heartbeat,API-Key,60/min
DELETE,/api/v1/cache,Clear browser session cache,Admin,10/min`
    },
    {
      label: 'Asset Portfolio Balance',
      data: `Asset Class,Ticker,Target %,Current %,Annual Yield
US Equities,VTI,40%,42%,1.8%
Global Tech,QQQ,25%,24%,0.9%
Short Treasuries,SGOV,20%,19%,5.2%
Crypto Assets,BTC,15%,15%,0.0%`
    }
  ];

  // Pure vanilla JavaScript CSV line & cell parser (handles quotes, commas, tabs)
  const parseCsvLine = (text: string, sep: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === sep && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  // Detect delimiter automatically
  const detectedDelimiter = useMemo(() => {
    if (delimiter !== 'auto') return delimiter;
    const firstLine = csvInput.split('\n')[0] || '';
    if (firstLine.includes('\t')) return '\t';
    if (firstLine.includes(';') && !firstLine.includes(',')) return ';';
    if (firstLine.includes('|')) return '|';
    return ',';
  }, [csvInput, delimiter]);

  // Parse 2D Grid
  const parsedGrid = useMemo(() => {
    if (!csvInput.trim()) return [];
    const lines = csvInput.split(/\r?\n/).filter(line => line.trim().length > 0);
    return lines.map(line => parseCsvLine(line, detectedDelimiter));
  }, [csvInput, detectedDelimiter]);

  // Generate GitHub/Notion compatible Markdown string
  const markdownOutput = useMemo(() => {
    if (parsedGrid.length === 0) return '';

    // Standardize column count across rows
    const colCount = Math.max(...parsedGrid.map(row => row.length));
    const normalizedGrid = parsedGrid.map(row => {
      const copy = [...row];
      while (copy.length < colCount) copy.push('');
      return copy;
    });

    // Calculate maximum widths per column for pretty padding
    const colWidths: number[] = new Array(colCount).fill(3);
    if (prettyPad) {
      normalizedGrid.forEach(row => {
        row.forEach((cell, colIdx) => {
          colWidths[colIdx] = Math.max(colWidths[colIdx], cell.length);
        });
      });
    }

    const formatCell = (val: string, colIdx: number) => {
      if (!prettyPad) return val;
      const width = colWidths[colIdx];
      return val.padEnd(width, ' ');
    };

    let md = '';

    // Header row
    const headerRow = hasHeader ? normalizedGrid[0] : normalizedGrid[0].map((_, idx) => `Column ${idx + 1}`);
    md += '| ' + headerRow.map((cell, colIdx) => formatCell(cell, colIdx)).join(' | ') + ' |\n';

    // Delimiter line with alignment syntax
    const separatorLine = headerRow.map((_, colIdx) => {
      const align = columnAlignments[colIdx] || defaultAlignment;
      const width = Math.max(3, prettyPad ? colWidths[colIdx] : 3);
      
      if (align === 'center') {
        return ':' + '-'.repeat(Math.max(1, width - 2)) + ':';
      } else if (align === 'right') {
        return '-'.repeat(Math.max(2, width - 1)) + ':';
      } else {
        return ':' + '-'.repeat(Math.max(2, width - 1));
      }
    });
    md += '| ' + separatorLine.join(' | ') + ' |\n';

    // Data rows
    const dataRows = hasHeader ? normalizedGrid.slice(1) : normalizedGrid;
    dataRows.forEach(row => {
      md += '| ' + row.map((cell, colIdx) => formatCell(cell, colIdx)).join(' | ') + ' |\n';
    });

    return md;
  }, [parsedGrid, hasHeader, defaultAlignment, columnAlignments, prettyPad]);

  const handleCopy = () => {
    if (!markdownOutput) return;
    playSound('success');
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!markdownOutput) return;
    playSound('click');
    const blob = new Blob([markdownOutput], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table-export-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const setAlignForCol = (colIdx: number, align: Alignment) => {
    playSound('click');
    setColumnAlignments(prev => ({ ...prev, [colIdx]: align }));
  };

  return (
    <div className="space-y-6" id="csv-to-markdown-tool">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
            <Table className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                CSV to Markdown Table Converter
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                GitHub / Notion Syntax
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Parse comma-separated data arrays instantly with column alignment & pretty padding
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={() => {
              playSound('click');
              onBackToGrid();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all self-start sm:self-auto cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Grid</span>
          </button>
        )}
      </div>

      {/* Preset Quick Loader */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider">
            Load Sample CSV Datasets:
          </label>
          <span className="text-[11px] text-slate-400">1-click populate</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {samplePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                playSound('click');
                setCsvInput(preset.data);
              }}
              className="p-2 rounded-xl text-xs font-bold text-left bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-emerald-400 text-slate-700 dark:text-white transition-all cursor-pointer"
            >
              <span className="block truncate">{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Formatting Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider block mb-1">
            Delimiter Detection
          </label>
          <select
            value={delimiter}
            onChange={(e) => {
              playSound('click');
              setDelimiter(e.target.value);
            }}
            className="w-full text-xs font-semibold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white"
          >
            <option value="auto">Auto-Detect (Comma/Tab/Semicolon)</option>
            <option value=",">Comma (,)</option>
            <option value="&#9;">Tab (\t)</option>
            <option value=";">Semicolon (;)</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-slate-500 dark:text-white/60 uppercase tracking-wider block mb-1">
            Global Alignment
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                playSound('click');
                setDefaultAlignment('left');
                setColumnAlignments({});
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center justify-center ${
                defaultAlignment === 'left' ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400' : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10'
              }`}
              title="Left Align"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playSound('click');
                setDefaultAlignment('center');
                setColumnAlignments({});
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center justify-center ${
                defaultAlignment === 'center' ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400' : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10'
              }`}
              title="Center Align"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                playSound('click');
                setDefaultAlignment('right');
                setColumnAlignments({});
              }}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer flex items-center justify-center ${
                defaultAlignment === 'right' ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400' : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10'
              }`}
              title="Right Align"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between sm:pt-4">
          <span className="text-xs font-bold text-slate-700 dark:text-white/80">Header Row</span>
          <button
            onClick={() => {
              playSound('click');
              setHasHeader(!hasHeader);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              hasHeader
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300'
                : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
            }`}
          >
            {hasHeader ? 'Row 1 = Header' : 'No Header'}
          </button>
        </div>

        <div className="flex items-center justify-between sm:pt-4">
          <span className="text-xs font-bold text-slate-700 dark:text-white/80">Pretty Pad</span>
          <button
            onClick={() => {
              playSound('click');
              setPrettyPad(!prettyPad);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              prettyPad
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-600 dark:text-emerald-300'
                : 'bg-white/50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
            }`}
          >
            {prettyPad ? 'Monospace Pad' : 'Compact'}
          </button>
        </div>
      </div>

      {/* CSV Input Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-white/80 uppercase tracking-wider">
            Raw CSV / Delimited Input
          </label>
          <span className="text-[11px] text-slate-400">
            {parsedGrid.length} rows • {parsedGrid[0]?.length || 0} columns
          </span>
        </div>

        <div className="relative">
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={6}
            placeholder="Paste your CSV data here..."
            className="w-full p-3.5 font-mono text-xs rounded-2xl bg-white/80 dark:bg-slate-900/90 border border-slate-300 dark:border-white/15 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {csvInput && (
            <button
              onClick={() => {
                playSound('click');
                setCsvInput('');
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold transition-all cursor-pointer"
              title="Clear input"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Output / Preview Section */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Tabs: Table Preview vs Raw Markdown */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-white/5 border border-slate-300 dark:border-white/10 self-start">
            <button
              onClick={() => {
                playSound('click');
                setPreviewTab('table');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'table'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Interactive Table View</span>
            </button>
            <button
              onClick={() => {
                playSound('click');
                setPreviewTab('raw');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                previewTab === 'raw'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Raw Markdown Syntax</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>

            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'
              }`}
              id="btn-copy-markdown-table"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Markdown!' : 'One-Click Copy Table'}</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {previewTab === 'table' ? (
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] overflow-x-auto shadow-inner">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04]">
                  {parsedGrid[0]?.map((headerCell, colIdx) => (
                    <th key={colIdx} className="p-3 font-extrabold text-slate-900 dark:text-white whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span>{hasHeader ? headerCell : `Column ${colIdx + 1}`}</span>
                        <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100">
                          <button
                            onClick={() => setAlignForCol(colIdx, 'left')}
                            className="p-1 hover:text-emerald-400"
                            title="Left align column"
                          >
                            <AlignLeft className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => setAlignForCol(colIdx, 'center')}
                            className="p-1 hover:text-emerald-400"
                            title="Center align column"
                          >
                            <AlignCenter className="w-2.5 h-2.5" />
                          </button>
                          <button
                            onClick={() => setAlignForCol(colIdx, 'right')}
                            className="p-1 hover:text-emerald-400"
                            title="Right align column"
                          >
                            <AlignRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(hasHeader ? parsedGrid.slice(1) : parsedGrid).map((row, rowIdx) => (
                  <tr 
                    key={rowIdx} 
                    className="border-b border-slate-200/60 dark:border-white/5 hover:bg-emerald-500/5 transition-colors"
                  >
                    {row.map((cell, colIdx) => {
                      const align = columnAlignments[colIdx] || defaultAlignment;
                      return (
                        <td 
                          key={colIdx} 
                          className={`p-3 text-slate-700 dark:text-white/80 whitespace-nowrap ${
                            align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 p-4 font-mono text-xs overflow-x-auto max-h-60 shadow-inner">
            <pre className="whitespace-pre font-mono text-xs text-emerald-300">
              {markdownOutput}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
