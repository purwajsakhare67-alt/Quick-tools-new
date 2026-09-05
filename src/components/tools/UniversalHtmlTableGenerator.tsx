import React, { useState, useMemo } from 'react';
import { 
  Table, 
  ArrowLeft, 
  Copy, 
  Check, 
  Download, 
  Sliders, 
  Eye, 
  Code2, 
  Sparkles, 
  CheckSquare, 
  RefreshCw,
  FileCode,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalHtmlTableGeneratorProps {
  onBackToGrid?: () => void;
}

interface TablePreset {
  name: string;
  rows: number;
  cols: number;
  headers: string[];
  data: string[][];
}

const PRESETS: TablePreset[] = [
  {
    name: 'SaaS Pricing Tiers',
    rows: 4,
    cols: 4,
    headers: ['Plan Feature', 'Starter ($0)', 'Pro ($29)', 'Enterprise ($99)'],
    data: [
      ['Monthly Active Users', '1,000', '50,000', 'Unlimited'],
      ['API Rate Limits', '60 req/min', '1,200 req/min', 'Custom Dedicate'],
      ['Cloud Storage Sync', '5 GB', '250 GB', '10 TB Encrypted'],
      ['Technical Support', 'Community Forum', '24/7 Priority Chat', 'Dedicated SLA'],
    ]
  },
  {
    name: 'Financial Quarterly Report',
    rows: 4,
    cols: 5,
    headers: ['Fiscal Quarter', 'Gross Revenue', 'COGS', 'Operating Income', 'Net Margin'],
    data: [
      ['Q1 2026', '$1,450,000', '$420,000', '$680,000', '28.4%'],
      ['Q2 2026', '$1,720,000', '$490,000', '$810,000', '31.2%'],
      ['Q3 2026', '$2,100,000', '$580,000', '$1,020,000', '34.5%'],
      ['Q4 2026 (Est.)', '$2,450,000', '$650,000', '$1,220,000', '36.8%'],
    ]
  },
  {
    name: 'Product Inventory Ledger',
    rows: 4,
    cols: 4,
    headers: ['SKU Code', 'Item Description', 'Stock Units', 'Unit Price'],
    data: [
      ['SKU-8812', 'Ergonomic Desk Mat', '142', '$34.99'],
      ['SKU-4910', 'Mechanical Switch Keycaps', '68', '$59.00'],
      ['SKU-1029', 'Thunderbolt 4 Cable (2m)', '320', '$24.50'],
      ['SKU-7731', 'Studio Noise-Cancel Mic', '45', '$189.00'],
    ]
  }
];

export const UniversalHtmlTableGenerator: React.FC<UniversalHtmlTableGeneratorProps> = ({ onBackToGrid }) => {
  const [rowsCount, setRowsCount] = useState<number>(4);
  const [colsCount, setColsCount] = useState<number>(4);

  // Table styling config
  const [isStriped, setIsStriped] = useState<boolean>(true);
  const [isBordered, setIsBordered] = useState<boolean>(true);
  const [isHoverable, setIsHoverable] = useState<boolean>(true);
  const [isCompact, setIsCompact] = useState<boolean>(false);
  const [hasDarkHeader, setHasDarkHeader] = useState<boolean>(true);
  const [isRounded, setIsRounded] = useState<boolean>(true);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'tailwind' | 'markdown'>('html');
  const [copied, setCopied] = useState<boolean>(false);

  // Editable Cells Matrix State
  const [headers, setHeaders] = useState<string[]>(PRESETS[0].headers);
  const [matrixData, setMatrixData] = useState<string[][]>(PRESETS[0].data);

  // Adjust headers and matrix whenever rowsCount or colsCount change
  const handleResize = (newRows: number, newCols: number) => {
    const clampedRows = Math.max(1, Math.min(20, newRows));
    const clampedCols = Math.max(1, Math.min(10, newCols));

    setRowsCount(clampedRows);
    setColsCount(clampedCols);

    // Update headers
    const nextHeaders = Array.from({ length: clampedCols }, (_, c) => {
      return headers[c] || `Column ${c + 1}`;
    });
    setHeaders(nextHeaders);

    // Update data rows
    const nextData = Array.from({ length: clampedRows }, (_, r) => {
      return Array.from({ length: clampedCols }, (_, c) => {
        return matrixData[r]?.[c] || `Row ${r + 1}, Col ${c + 1}`;
      });
    });
    setMatrixData(nextData);
    playSound('soft');
  };

  const handleApplyPreset = (preset: TablePreset) => {
    setRowsCount(preset.rows);
    setColsCount(preset.cols);
    setHeaders([...preset.headers]);
    setMatrixData(preset.data.map(row => [...row]));
    playSound('click');
  };

  const updateHeader = (colIdx: number, val: string) => {
    const copy = [...headers];
    copy[colIdx] = val;
    setHeaders(copy);
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const copy = matrixData.map(r => [...r]);
    if (!copy[rowIdx]) copy[rowIdx] = [];
    copy[rowIdx][colIdx] = val;
    setMatrixData(copy);
  };

  // Generate HTML Blueprint
  const htmlBlueprint = useMemo(() => {
    let classes = ['styled-table'];
    if (isStriped) classes.push('table-striped');
    if (isBordered) classes.push('table-bordered');
    if (isHoverable) classes.push('table-hover');
    if (isCompact) classes.push('table-compact');
    if (isRounded) classes.push('table-rounded');

    const pad = isCompact ? 'padding: 6px 10px;' : 'padding: 12px 16px;';
    const borderStyle = isBordered ? 'border: 1px solid #e2e8f0;' : 'border-bottom: 1px solid #e2e8f0;';
    const headerBg = hasDarkHeader ? 'background-color: #0f172a; color: #ffffff;' : 'background-color: #f8fafc; color: #1e293b;';

    const headerHtml = headers.map(h => `      <th style="${pad} text-align: left; font-weight: 600; font-size: 14px; ${borderStyle}">${h}</th>`).join('\n');
    
    const bodyHtml = matrixData.map((row, rIdx) => {
      const rowBg = isStriped && rIdx % 2 === 1 ? ' style="background-color: #f8fafc;"' : '';
      const cells = row.map(cell => `      <td style="${pad} font-size: 14px; ${borderStyle}">${cell}</td>`).join('\n');
      return `    <tr${rowBg}>\n${cells}\n    </tr>`;
    }).join('\n');

    return `<div style="overflow-x: auto; width: 100%;">
  <table style="width: 100%; border-collapse: collapse; font-family: system-ui, -apple-system, sans-serif;">
    <thead style="${headerBg}">
      <tr>
${headerHtml}
      </tr>
    </thead>
    <tbody>
${bodyHtml}
    </tbody>
  </table>
</div>`;
  }, [headers, matrixData, isStriped, isBordered, isHoverable, isCompact, hasDarkHeader, isRounded]);

  // Generate Tailwind HTML
  const tailwindBlueprint = useMemo(() => {
    const tableClasses = [
      'w-full',
      'text-left',
      'border-collapse',
      'text-sm',
      isRounded ? 'rounded-xl overflow-hidden' : '',
      isBordered ? 'border border-slate-200 dark:border-slate-800' : ''
    ].filter(Boolean).join(' ');

    const thClasses = [
      hasDarkHeader ? 'bg-slate-900 text-white dark:bg-slate-950' : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
      'font-semibold',
      isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
      isBordered ? 'border-b border-slate-200 dark:border-slate-800' : ''
    ].filter(Boolean).join(' ');

    const tdClasses = [
      isCompact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm',
      isBordered ? 'border-b border-slate-200 dark:border-slate-800' : 'border-b border-slate-100 dark:border-slate-800/60',
      'text-slate-700 dark:text-slate-300'
    ].filter(Boolean).join(' ');

    const headerHtml = headers.map(h => `        <th class="${thClasses}">${h}</th>`).join('\n');
    
    const bodyHtml = matrixData.map((row, rIdx) => {
      const trClasses = [
        isStriped && rIdx % 2 === 1 ? 'bg-slate-50 dark:bg-white/[0.02]' : '',
        isHoverable ? 'hover:bg-slate-100/80 dark:hover:bg-white/5 transition-colors' : ''
      ].filter(Boolean).join(' ');

      const cells = row.map(cell => `        <td class="${tdClasses}">${cell}</td>`).join('\n');
      return `      <tr class="${trClasses}">\n${cells}\n      </tr>`;
    }).join('\n');

    return `<div class="w-full overflow-x-auto shadow-sm">
  <table class="${tableClasses}">
    <thead>
      <tr>
${headerHtml}
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
${bodyHtml}
    </tbody>
  </table>
</div>`;
  }, [headers, matrixData, isStriped, isBordered, isHoverable, isCompact, hasDarkHeader, isRounded]);

  // Generate Markdown Table
  const markdownBlueprint = useMemo(() => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${headers.map(() => '---').join(' | ')} |`;
    const rows = matrixData.map(row => `| ${row.join(' | ')} |`).join('\n');
    return `${headerRow}\n${separatorRow}\n${rows}`;
  }, [headers, matrixData]);

  const activeOutput = activeCodeTab === 'html' 
    ? htmlBlueprint 
    : activeCodeTab === 'tailwind' 
      ? tailwindBlueprint 
      : markdownBlueprint;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeOutput);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Generated HTML Table</title>
</head>
<body style="padding: 40px; background-color: #f1f5f9; display: flex; justify-content: center;">
  <div style="max-width: 900px; width: 100%;">
${htmlBlueprint}
  </div>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table_blueprint_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
              title="Return to Grid"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Table className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              Visual HTML Grid Table Blueprint Generator
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Interactive Grid
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Live structural HTML, Tailwind CSS & Markdown table generator with inline editing
            </p>
          </div>
        </div>

        <button
          onClick={() => handleApplyPreset(PRESETS[0])}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
          <span>Reset Table</span>
        </button>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 dark:text-white/40 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Presets:
        </span>
        {PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleApplyPreset(p)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-emerald-500/10 text-slate-700 dark:text-white/80 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200/60 dark:border-white/5 whitespace-nowrap transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Grid Dimension Controls & Checkbox Options */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Rows Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <span>Rows Count</span>
              <span className="text-emerald-600 font-mono">{rowsCount} rows</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              value={rowsCount}
              onChange={(e) => handleResize(parseInt(e.target.value), colsCount)}
              className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Columns Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-white/80">
              <span>Columns Count</span>
              <span className="text-emerald-600 font-mono">{colsCount} columns</span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              value={colsCount}
              onChange={(e) => handleResize(rowsCount, parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          {/* Styling Options Checkboxes */}
          <div className="col-span-1 md:col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-700 dark:text-white/80">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isStriped}
                onChange={(e) => { setIsStriped(e.target.checked); playSound('soft'); }}
                className="rounded accent-emerald-500"
              />
              <span>Striped Rows</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isBordered}
                onChange={(e) => { setIsBordered(e.target.checked); playSound('soft'); }}
                className="rounded accent-emerald-500"
              />
              <span>Bordered Grid</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isHoverable}
                onChange={(e) => { setIsHoverable(e.target.checked); playSound('soft'); }}
                className="rounded accent-emerald-500"
              />
              <span>Hover Highlight</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={hasDarkHeader}
                onChange={(e) => { setHasDarkHeader(e.target.checked); playSound('soft'); }}
                className="rounded accent-emerald-500"
              />
              <span>Dark Header</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isCompact}
                onChange={(e) => { setIsCompact(e.target.checked); playSound('soft'); }}
                className="rounded accent-emerald-500"
              />
              <span>Compact Padding</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isRounded}
                onChange={(e) => { setIsRounded(e.target.checked); playSound('soft'); }}
                className="rounded accent-emerald-500"
              />
              <span>Rounded Corners</span>
            </label>
          </div>
        </div>
      </div>

      {/* Live Interactive Table Preview */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
              Live Interactive Prototype (Click cells to edit text)
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {rowsCount} rows × {colsCount} cols ({rowsCount * colsCount} total cells)
          </span>
        </div>

        <div className="p-4 overflow-x-auto">
          <div className={`overflow-hidden ${isRounded ? 'rounded-xl' : ''} ${isBordered ? 'border border-slate-200 dark:border-white/10' : ''}`}>
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className={hasDarkHeader ? 'bg-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white'}>
                <tr>
                  {headers.slice(0, colsCount).map((header, colIdx) => (
                    <th
                      key={colIdx}
                      className={`${isCompact ? 'p-2' : 'p-3'} font-bold ${isBordered ? 'border border-slate-300/40 dark:border-white/10' : 'border-b border-slate-300 dark:border-white/10'}`}
                    >
                      <input
                        type="text"
                        value={header}
                        onChange={(e) => updateHeader(colIdx, e.target.value)}
                        className="bg-transparent font-bold outline-none w-full hover:bg-white/10 px-1 py-0.5 rounded focus:bg-white/20 transition-colors"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixData.slice(0, rowsCount).map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`
                      ${isStriped && rowIdx % 2 === 1 ? 'bg-slate-50 dark:bg-white/[0.02]' : 'bg-white dark:bg-slate-900'}
                      ${isHoverable ? 'hover:bg-emerald-500/5 transition-colors' : ''}
                    `}
                  >
                    {row.slice(0, colsCount).map((cell, colIdx) => (
                      <td
                        key={colIdx}
                        className={`${isCompact ? 'p-1.5' : 'p-2.5'} ${isBordered ? 'border border-slate-200 dark:border-white/5' : 'border-b border-slate-100 dark:border-white/5'}`}
                      >
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                          className="bg-transparent text-slate-700 dark:text-slate-200 outline-none w-full hover:bg-slate-100 dark:hover:bg-white/5 px-1 py-0.5 rounded focus:bg-emerald-500/10 transition-colors"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Code Generation Clipboard Section */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm overflow-hidden">
        {/* Output Tabs Bar */}
        <div className="px-4 py-2.5 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'html', label: 'Semantic HTML' },
              { id: 'tailwind', label: 'Tailwind CSS HTML' },
              { id: 'markdown', label: 'Markdown Table' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveCodeTab(tab.id as any); playSound('click'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCodeTab === tab.id
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .HTML</span>
            </button>
            <button
              onClick={handleCopyCode}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Code!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
          <pre className="text-emerald-400">
            {activeOutput}
          </pre>
        </div>
      </div>

      {/* Info Card */}
      <div className="p-3.5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-600 dark:text-emerald-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <p>
          <strong>Zero Dependencies:</strong> Table blueprints are constructed dynamically using string concatenation and native DOM mapping loops. Fully compliant with HTML5, W3C accessibility specs, and GitHub-flavored Markdown.
        </p>
      </div>
    </div>
  );
};
