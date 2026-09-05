import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Code,
  Layers,
  FileJson
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalJsonToXmlConverterProps {
  onBackToGrid?: () => void;
}

const SAMPLE_JSON_PRESETS = [
  {
    name: 'E-Commerce Order',
    json: JSON.stringify({
      orderId: 'ORD-98421',
      customer: {
        id: 402,
        name: 'Sarah Connor',
        email: 'sarah@cyberdyne.org',
        verified: true
      },
      items: [
        { sku: 'CPU-990', name: 'Neural Processor', price: 1250.00, qty: 1 },
        { sku: 'CBL-042', name: 'Optical Fiber Line', price: 45.50, qty: 3 }
      ],
      shippingAddress: {
        street: '100 Cyber Way',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90001'
      },
      payment: {
        method: 'CREDIT_CARD',
        status: 'PAID',
        amount: 1386.50
      }
    }, null, 2)
  },
  {
    name: 'User Directory API',
    json: JSON.stringify({
      status: 'success',
      total: 2,
      users: [
        { id: 1, username: 'neo', roles: ['admin', 'developer'], active: true },
        { id: 2, username: 'trinity', roles: ['security_lead'], active: true }
      ]
    }, null, 2)
  },
  {
    name: 'Server Config Matrix',
    json: JSON.stringify({
      server: {
        host: '0.0.0.0',
        port: 3000,
        ssl: {
          enabled: true,
          certPath: '/etc/ssl/certs/bundle.crt'
        },
        timeoutMs: 5000,
        corsOrigins: ['https://app.example.com', 'https://admin.example.com']
      }
    }, null, 2)
  }
];

const sanitizeXmlTag = (key: string): string => {
  let cleaned = key.trim().replace(/^[^a-zA-Z_]+/, '_').replace(/[^a-zA-Z0-9._-]/g, '_');
  return cleaned || 'node';
};

const escapeXmlText = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export const UniversalJsonToXmlConverter: React.FC<UniversalJsonToXmlConverterProps> = ({ onBackToGrid }) => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON_PRESETS[0].json);
  const [rootElement, setRootElement] = useState<string>('root');
  const [arrayItemTag, setArrayItemTag] = useState<string>('item');
  const [includeDeclaration, setIncludeDeclaration] = useState<boolean>(true);
  const [indentOption, setIndentOption] = useState<'2' | '4' | 'tab' | 'compact'>('2');
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion logic
  const { xmlOutput, error, nodeCount } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { xmlOutput: '', error: null, nodeCount: 0 };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonInput);
    } catch (err: any) {
      return { xmlOutput: '', error: err.message || 'Malformed JSON syntax', nodeCount: 0 };
    }

    const indentStr = indentOption === '2' ? '  ' : indentOption === '4' ? '    ' : indentOption === 'tab' ? '\t' : '';
    const isCompact = indentOption === 'compact';
    let nodesVisited = 0;

    const buildXml = (obj: any, currentIndent: string): string => {
      nodesVisited++;
      if (obj === null || obj === undefined) {
        return '';
      }

      if (typeof obj !== 'object') {
        return escapeXmlText(String(obj));
      }

      if (Array.isArray(obj)) {
        return obj.map(item => {
          const inner = buildXml(item, currentIndent + (isCompact ? '' : indentStr));
          const tag = sanitizeXmlTag(arrayItemTag);
          if (typeof item === 'object' && item !== null) {
            return isCompact
              ? `<${tag}>${inner}</${tag}>`
              : `${currentIndent}<${tag}>\n${inner}\n${currentIndent}</${tag}>`;
          } else {
            return isCompact
              ? `<${tag}>${inner}</${tag}>`
              : `${currentIndent}<${tag}>${inner}</${tag}>`;
          }
        }).join(isCompact ? '' : '\n');
      }

      const keys = Object.keys(obj);
      const lines: string[] = [];

      for (const rawKey of keys) {
        const val = obj[rawKey];
        const tag = sanitizeXmlTag(rawKey);

        if (Array.isArray(val)) {
          // If array, either render enclosing tag or repeat item tags
          const arrayContent = val.map(item => {
            const inner = buildXml(item, currentIndent + (isCompact ? '' : indentStr + indentStr));
            const subTag = sanitizeXmlTag(arrayItemTag);
            if (typeof item === 'object' && item !== null) {
              return isCompact
                ? `<${subTag}>${inner}</${subTag}>`
                : `${currentIndent}${indentStr}<${subTag}>\n${inner}\n${currentIndent}${indentStr}</${subTag}>`;
            } else {
              return isCompact
                ? `<${subTag}>${inner}</${subTag}>`
                : `${currentIndent}${indentStr}<${subTag}>${inner}</${subTag}>`;
            }
          }).join(isCompact ? '' : '\n');

          if (isCompact) {
            lines.push(`<${tag}>${arrayContent}</${tag}>`);
          } else {
            lines.push(`${currentIndent}<${tag}>\n${arrayContent}\n${currentIndent}</${tag}>`);
          }
        } else if (typeof val === 'object' && val !== null) {
          const inner = buildXml(val, currentIndent + (isCompact ? '' : indentStr));
          if (isCompact) {
            lines.push(`<${tag}>${inner}</${tag}>`);
          } else {
            lines.push(`${currentIndent}<${tag}>\n${inner}\n${currentIndent}</${tag}>`);
          }
        } else {
          const text = escapeXmlText(String(val ?? ''));
          lines.push(isCompact ? `<${tag}>${text}</${tag}>` : `${currentIndent}<${tag}>${text}</${tag}>`);
        }
      }

      return lines.join(isCompact ? '' : '\n');
    };

    const rootTag = sanitizeXmlTag(rootElement || 'root');
    const innerXml = buildXml(parsed, isCompact ? '' : indentStr);

    let result = '';
    if (includeDeclaration) {
      result += '<?xml version="1.0" encoding="UTF-8"?>' + (isCompact ? '' : '\n');
    }

    if (isCompact) {
      result += `<${rootTag}>${innerXml}</${rootTag}>`;
    } else {
      result += `<${rootTag}>\n${innerXml}\n</${rootTag}>`;
    }

    return { xmlOutput: result, error: null, nodeCount: nodesVisited };
  }, [jsonInput, rootElement, arrayItemTag, includeDeclaration, indentOption]);

  const handleCopy = () => {
    if (!xmlOutput) return;
    navigator.clipboard.writeText(xmlOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!xmlOutput) return;
    const blob = new Blob([xmlOutput], { type: 'application/xml;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${rootElement || 'data'}.xml`;
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="json-to-xml-converter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 dark:border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Synchronous JSON to XML Document Structural Converter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                Recursive DOM
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert raw JSON objects into standardized, valid XML nodes with schema tree indentation
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

      {/* Preset Pickers */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Templates:
        </span>
        {SAMPLE_JSON_PRESETS.map((p, idx) => (
          <button
            key={idx}
            onClick={() => {
              setJsonInput(p.json);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-blue-300 transition-colors cursor-pointer"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Configuration Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <label htmlFor="root-tag-input" className="block text-slate-500 text-[11px] mb-1 font-medium">Root Node Tag</label>
          <input
            id="root-tag-input"
            type="text"
            value={rootElement}
            onChange={(e) => setRootElement(e.target.value)}
            placeholder="root"
            className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs"
          />
        </div>

        <div>
          <label htmlFor="item-tag-input" className="block text-slate-500 text-[11px] mb-1 font-medium">Array Child Tag</label>
          <input
            id="item-tag-input"
            type="text"
            value={arrayItemTag}
            onChange={(e) => setArrayItemTag(e.target.value)}
            placeholder="item"
            className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 font-mono text-xs"
          />
        </div>

        <div>
          <label htmlFor="indent-select" className="block text-slate-500 text-[11px] mb-1 font-medium">Tree Indentation</label>
          <select
            id="indent-select"
            value={indentOption}
            onChange={(e) => {
              setIndentOption(e.target.value as any);
              playSound('tap');
            }}
            className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs cursor-pointer"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">Tab Character</option>
            <option value="compact">Compact / Minified</option>
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 cursor-pointer select-none py-1.5">
            <input
              type="checkbox"
              checked={includeDeclaration}
              onChange={(e) => setIncludeDeclaration(e.target.checked)}
              className="accent-blue-500 w-4 h-4 rounded"
            />
            <span className="text-xs">&lt;?xml declaration?&gt;</span>
          </label>
        </div>
      </div>

      {/* Editor Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: JSON Input Panel */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="json-input-textarea" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileJson className="w-4 h-4 text-blue-500" />
              Source JSON Document
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
            id="json-input-textarea"
            rows={15}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste raw JSON object here..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
          />

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Right: XML Output Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5">
                <Code className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">
                  Target XML Node Structure
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {xmlOutput ? `${xmlOutput.length} characters` : '0 characters'}
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="xml-output-textarea"
                readOnly
                rows={15}
                value={xmlOutput || (error ? '<!-- Correct JSON syntax error to generate XML -->' : '<!-- Paste or choose a JSON preset -->')}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-blue-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!xmlOutput || !!error}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white shadow-md shadow-blue-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied XML to Clipboard!' : 'Copy XML Code'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!xmlOutput || !!error}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .xml
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
