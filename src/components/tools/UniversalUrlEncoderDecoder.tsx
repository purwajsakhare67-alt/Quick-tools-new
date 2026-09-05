import React, { useState, useMemo } from 'react';
import { 
  Link2, 
  ArrowLeft, 
  Copy, 
  Check, 
  RotateCcw, 
  ArrowLeftRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Download,
  Info,
  Sliders
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalUrlEncoderDecoderProps {
  onBackToGrid?: () => void;
}

type Mode = 'encode' | 'decode';
type Method = 'component' | 'fullUri' | 'formUrlEncoded';

const SAMPLE_PRESETS = [
  {
    name: 'OAuth Query String',
    raw: 'https://auth.example.com/oauth/v2/authorize?client_id=app_90812&redirect_uri=https://myapp.dev/callback&scope=read:profile write:reports&state=xyz987#token',
  },
  {
    name: 'Special Characters & Accents',
    raw: 'Search query: café & crème brûlée + 100% pure = $25.50 (item #42) -> { "query": "hello world" }',
  },
  {
    name: 'UTM Marketing Tracking',
    raw: 'https://site.org/pricing?utm_source=twitter & threads&utm_medium=social-post&utm_campaign=summer_promo_2026&discount=Save 20% Today!',
  },
  {
    name: 'Encoded Sample',
    raw: 'https%3A%2F%2Fapi.enterprise.com%2Fv1%2Fsearch%3Fq%3Ddata%2Bscience%26filter%3Dactive%2520status%26tags%3D%5B%22web%22%2C%22ai%22%5D',
  }
];

export const UniversalUrlEncoderDecoder: React.FC<UniversalUrlEncoderDecoderProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_PRESETS[0].raw);
  const [mode, setMode] = useState<Mode>('encode');
  const [method, setMethod] = useState<Method>('component');
  const [spaceAsPlus, setSpaceAsPlus] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedParams, setCopiedParams] = useState<boolean>(false);

  // Compute transformation
  const { result, error, stats, parsedParams } = useMemo(() => {
    let output = '';
    let errMsg: string | null = null;

    if (!inputText) {
      return { result: '', error: null, stats: null, parsedParams: [] };
    }

    try {
      if (mode === 'encode') {
        if (method === 'component') {
          output = encodeURIComponent(inputText);
          if (spaceAsPlus) {
            output = output.replace(/%20/g, '+');
          }
        } else if (method === 'fullUri') {
          output = encodeURI(inputText);
          if (spaceAsPlus) {
            output = output.replace(/%20/g, '+');
          }
        } else {
          // form url encoded
          output = encodeURIComponent(inputText).replace(/%20/g, '+');
        }
      } else {
        // Decode
        let textToDecode = inputText;
        if (spaceAsPlus) {
          textToDecode = textToDecode.replace(/\+/g, ' ');
        }
        if (method === 'component') {
          output = decodeURIComponent(textToDecode);
        } else {
          output = decodeURI(textToDecode);
        }
      }
    } catch (e: any) {
      errMsg = e?.message || 'Malformed URL or byte sequence detected during conversion.';
      output = '';
    }

    // Diagnostics stats
    const inLen = inputText.length;
    const outLen = output.length;
    const diff = outLen - inLen;
    const pct = inLen > 0 ? ((diff / inLen) * 100).toFixed(1) : '0';

    // Parse URL query params if input or output looks like a URL
    const targetUrl = mode === 'decode' ? output : inputText;
    const paramsList: { key: string; value: string }[] = [];
    try {
      const questionIdx = targetUrl.indexOf('?');
      if (questionIdx !== -1) {
        const queryPart = targetUrl.substring(questionIdx + 1).split('#')[0];
        const searchParams = new URLSearchParams(queryPart);
        searchParams.forEach((val, key) => {
          paramsList.push({ key, value: val });
        });
      }
    } catch {
      // Ignore URL parsing errors
    }

    return {
      result: output,
      error: errMsg,
      stats: {
        inLen,
        outLen,
        diff,
        pct: Number(pct),
        specialCharCount: (inputText.match(/[^a-zA-Z0-9]/g) || []).length
      },
      parsedParams: paramsList
    };
  }, [inputText, mode, method, spaceAsPlus]);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyParams = () => {
    if (parsedParams.length === 0) return;
    const formatted = JSON.stringify(
      Object.fromEntries(parsedParams.map(p => [p.key, p.value])),
      null,
      2
    );
    navigator.clipboard.writeText(formatted);
    setCopiedParams(true);
    playSound('soft');
    setTimeout(() => setCopiedParams(false), 2000);
  };

  const handleSwap = () => {
    if (!result) return;
    setInputText(result);
    setMode(mode === 'encode' ? 'decode' : 'encode');
    playSound('click');
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `url_${mode}d_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const handleClear = () => {
    setInputText('');
    playSound('soft');
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
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              Real-Time URL Encoder & Decoder
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                100% Client-Side
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Native browser encodeURIComponent and decodeURIComponent with query string inspector
            </p>
          </div>
        </div>

        {/* Mode Toggle Pills */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            <button
              onClick={() => { setMode('encode'); playSound('click'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'encode'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/70 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              Encode URL
            </button>
            <button
              onClick={() => { setMode('decode'); playSound('click'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'decode'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/70 hover:text-cyan-600 dark:hover:text-cyan-400'
              }`}
            >
              Decode URL
            </button>
          </div>
        </div>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 dark:text-white/40 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Presets:
        </span>
        {SAMPLE_PRESETS.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(preset.raw);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-slate-700 dark:text-white/80 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200/60 dark:border-white/5 whitespace-nowrap transition-colors cursor-pointer"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Configuration Bar */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-xl p-3 border border-slate-200/60 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 dark:text-white/70 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-cyan-500" /> Function:
            </span>
            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value as Method);
                playSound('click');
              }}
              className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white rounded-lg px-2.5 py-1 font-semibold border border-slate-200 dark:border-white/10 outline-none cursor-pointer"
            >
              <option value="component">encodeURIComponent (Standard query params)</option>
              <option value="fullUri">encodeURI (Preserves ://?#&= complete URL)</option>
              <option value="formUrlEncoded">application/x-www-form-urlencoded</option>
            </select>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-white/80 font-medium">
            <input
              type="checkbox"
              checked={spaceAsPlus}
              onChange={(e) => {
                setSpaceAsPlus(e.target.checked);
                playSound('click');
              }}
              className="rounded accent-cyan-500"
            />
            Replace space with &quot;+&quot; (Form Standard)
          </label>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleSwap}
            disabled={!result}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-medium disabled:opacity-40 transition-colors cursor-pointer"
            title="Swap input with output"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-cyan-500" />
            <span>Swap Input/Output</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-red-500/10 text-slate-700 dark:text-white/80 hover:text-red-500 font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Double-Pane Editor & Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Pane: Input */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
                {mode === 'encode' ? 'Raw Text / URL to Encode' : 'Encoded String to Decode'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400 dark:text-white/40">
              {inputText.length} chars
            </span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Type or paste raw URL or text string here...'
                : 'Paste percent-encoded string (e.g., https%3A%2F%2F...)...'
            }
            rows={12}
            className="w-full p-4 bg-transparent text-slate-800 dark:text-slate-100 font-mono text-xs sm:text-sm resize-none outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all leading-relaxed"
          />
        </div>

        {/* Right Pane: Processed Output */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-sm flex flex-col overflow-hidden">
          <div className="px-4 py-3 bg-slate-50/90 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
                {mode === 'encode' ? 'Percent-Encoded Output' : 'Decoded String Output'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                disabled={!result}
                className="p-1 rounded-md text-slate-500 dark:text-white/50 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                title="Download as TXT"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleCopy}
                disabled={!result}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-600 text-white disabled:opacity-40'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy URL'}</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 p-4 bg-slate-950/[0.02] dark:bg-slate-950/40">
            {error ? (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Decoding Error</p>
                  <p className="text-[11px] opacity-90 mt-0.5">{error}</p>
                </div>
              </div>
            ) : (
              <textarea
                readOnly
                value={result}
                placeholder="Conversion will appear here immediately..."
                rows={12}
                className="w-full h-full bg-transparent text-cyan-600 dark:text-cyan-300 font-mono text-xs sm:text-sm resize-none outline-none leading-relaxed select-all"
              />
            )}
          </div>
        </div>
      </div>

      {/* Telemetry Diagnostics Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-white/40 block">Input Length</span>
            <span className="text-base font-black text-slate-800 dark:text-white">{stats.inLen} characters</span>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-white/40 block">Output Length</span>
            <span className="text-base font-black text-cyan-600 dark:text-cyan-400">{stats.outLen} characters</span>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-white/40 block">Length Delta</span>
            <span className={`text-base font-black ${stats.diff >= 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {stats.diff >= 0 ? `+${stats.diff}` : stats.diff} ({stats.pct}%)
            </span>
          </div>
          <div className="bg-white/60 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200/60 dark:border-white/5">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-white/40 block">Special Symbols</span>
            <span className="text-base font-black text-purple-600 dark:text-purple-400">{stats.specialCharCount} encoded symbols</span>
          </div>
        </div>
      )}

      {/* Query Parameters Extractor (if any detected) */}
      {parsedParams.length > 0 && (
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white">
                Detected Query Parameters ({parsedParams.length})
              </h3>
            </div>
            <button
              onClick={handleCopyParams}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white transition-colors cursor-pointer"
            >
              {copiedParams ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copiedParams ? 'Copied JSON!' : 'Copy as JSON'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-white/5">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-100/80 dark:bg-white/[0.03] text-slate-500 dark:text-white/40 border-b border-slate-200/60 dark:border-white/5">
                <tr>
                  <th className="py-2 px-3 font-semibold">Parameter Key</th>
                  <th className="py-2 px-3 font-semibold">Decoded Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {parsedParams.map((param, index) => (
                  <tr key={index} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                    <td className="py-2 px-3 font-bold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                      {param.key}
                    </td>
                    <td className="py-2 px-3 text-slate-700 dark:text-white/80 break-all">
                      {param.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Info Card */}
      <div className="p-3.5 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 text-xs text-slate-600 dark:text-cyan-200 flex items-start gap-2">
        <Info className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
        <p>
          <strong>RFC 3986 Standard:</strong> <code>encodeURIComponent</code> encodes all characters except <code>A-Z a-z 0-9 - _ . ! ~ * &apos; ( )</code>. Use <code>encodeURI</code> when you need to preserve the URL protocol scheme (<code>https://</code>), query boundaries (<code>?</code>), and paths (<code>/</code>).
        </p>
      </div>
    </div>
  );
};
