import React, { useState, useMemo } from 'react';
import { 
  FileCode2, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  FolderTree, 
  Binary,
  Code,
  Download
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalBencodeParserProps {
  onBackToGrid?: () => void;
}

// Bencode parsing & encoding logic pure client-side
const decodeBencode = (data: string): { result: any; length: number } => {
  let index = 0;

  const parse = (): any => {
    if (index >= data.length) {
      throw new Error('Unexpected end of bencoded stream');
    }
    const char = data[index];

    // Integer: i<number>e
    if (char === 'i') {
      index++; // skip 'i'
      const end = data.indexOf('e', index);
      if (end === -1) throw new Error('Unterminated integer token at position ' + index);
      const numStr = data.substring(index, end);
      const num = parseInt(numStr, 10);
      if (isNaN(num)) throw new Error('Invalid bencoded integer: ' + numStr);
      index = end + 1;
      return num;
    }

    // List: l<items>e
    if (char === 'l') {
      index++; // skip 'l'
      const list: any[] = [];
      while (data[index] !== 'e') {
        if (index >= data.length) throw new Error('Unterminated list token');
        list.push(parse());
      }
      index++; // skip 'e'
      return list;
    }

    // Dictionary: d<key><value>e
    if (char === 'd') {
      index++; // skip 'd'
      const dict: Record<string, any> = {};
      while (data[index] !== 'e') {
        if (index >= data.length) throw new Error('Unterminated dictionary token');
        const key = parse();
        if (typeof key !== 'string') throw new Error('Bencode dictionary keys must be byte strings');
        const val = parse();
        dict[key] = val;
      }
      index++; // skip 'e'
      return dict;
    }

    // Byte string: <length>:<contents>
    if (char >= '0' && char <= '9') {
      const colon = data.indexOf(':', index);
      if (colon === -1) throw new Error('Missing colon in byte string token at ' + index);
      const lenStr = data.substring(index, colon);
      const strLen = parseInt(lenStr, 10);
      if (isNaN(strLen) || strLen < 0) throw new Error('Invalid string length specifier: ' + lenStr);
      const start = colon + 1;
      const str = data.substring(start, start + strLen);
      index = start + strLen;
      return str;
    }

    throw new Error(`Unexpected character '${char}' at offset ${index}`);
  };

  const parsed = parse();
  return { result: parsed, length: index };
};

const encodeBencode = (data: any): string => {
  if (typeof data === 'number') {
    return `i${Math.floor(data)}e`;
  }
  if (typeof data === 'string') {
    return `${data.length}:${data}`;
  }
  if (Array.isArray(data)) {
    return `l${data.map(encodeBencode).join('')}e`;
  }
  if (typeof data === 'object' && data !== null) {
    const keys = Object.keys(data).sort();
    return `d${keys.map(k => `${k.length}:${k}${encodeBencode(data[k])}`).join('')}e`;
  }
  return '0:';
};

const SAMPLE_BENCODE_PRESETS = [
  {
    name: 'Debian Minimal Torrent',
    raw: 'd8:announce35:https://torrent.debian.org/announce13:creation datei1714560000e4:infod6:lengthi654311424e4:name30:debian-12.5.0-amd64-netinst.iso12:piece lengthi262144e6:pieces20:abcdefghij0123456789ee'
  },
  {
    name: 'Ubuntu Cloud Node Manifest',
    raw: 'd8:announce33:https://tracker.ubuntu.com/announce7:comment28:Official Ubuntu 24.04 Server4:infod4:name18:ubuntu-server.raw6:lengthi1073741824e12:piece lengthi524288ee'
  },
  {
    name: 'Multi-File Distribution Spec',
    raw: 'd4:infod5:filesld6:lengthi1048576e4:pathl8:read.txtted6:lengthi52428800e4:pathl8:binaries7:core.bineee4:name11:distributionee'
  }
];

export const UniversalBencodeParser: React.FC<UniversalBencodeParserProps> = ({ onBackToGrid }) => {
  const [mode, setMode] = useState<'decode' | 'encode'>('decode');
  const [inputVal, setInputVal] = useState<string>(SAMPLE_BENCODE_PRESETS[0].raw);
  const [copied, setCopied] = useState<boolean>(false);

  // Computational output
  const { outputText, error, stats } = useMemo(() => {
    if (!inputVal.trim()) {
      return { outputText: '', error: null, stats: { bytes: 0, items: 0 } };
    }

    if (mode === 'decode') {
      try {
        const { result, length } = decodeBencode(inputVal.trim());
        const jsonFormatted = JSON.stringify(result, null, 2);
        return {
          outputText: jsonFormatted,
          error: null,
          stats: {
            bytes: length,
            items: typeof result === 'object' && result ? Object.keys(result).length : 1
          }
        };
      } catch (err: any) {
        return { outputText: '', error: err.message || 'Malformed bencode payload', stats: { bytes: 0, items: 0 } };
      }
    } else {
      try {
        const parsedJson = JSON.parse(inputVal);
        const encoded = encodeBencode(parsedJson);
        return {
          outputText: encoded,
          error: null,
          stats: {
            bytes: encoded.length,
            items: typeof parsedJson === 'object' && parsedJson ? Object.keys(parsedJson).length : 1
          }
        };
      } catch (err: any) {
        return { outputText: '', error: 'JSON Parse Error: ' + (err.message || 'Invalid syntax'), stats: { bytes: 0, items: 0 } };
      }
    }
  }, [inputVal, mode]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: mode === 'decode' ? 'application/json' : 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = mode === 'decode' ? 'torrent_meta_decoded.json' : 'payload.torrent';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="bencode-parser-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/20 dark:border-violet-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Bencode Metadata Stream Encoder &amp; Decoder
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-400 border border-violet-300 dark:border-violet-800">
                Torrent RFC Spec
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Recursive in-memory decoder for BitTorrent dictionary tokens, byte strings, and lists
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

      {/* Mode Switch & Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setMode('decode');
              setInputVal(SAMPLE_BENCODE_PRESETS[0].raw);
              playSound('tap');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mode === 'decode'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            Decode Bencode → JSON Tree
          </button>
          <button
            onClick={() => {
              setMode('encode');
              setInputVal(JSON.stringify({ announce: "https://tracker.org", info: { name: "file.iso", length: 1048576 } }, null, 2));
              playSound('tap');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              mode === 'encode'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
            }`}
          >
            Encode JSON Tree → Bencode
          </button>
        </div>

        {mode === 'decode' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-violet-500" /> Samples:
            </span>
            {SAMPLE_BENCODE_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputVal(p.raw);
                  playSound('click');
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-violet-300 transition-colors cursor-pointer"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="bencode-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-violet-500" />
              {mode === 'decode' ? 'Raw Bencode Stream Input' : 'JSON Schema Object to Encode'}
            </label>
            <button
              onClick={() => {
                setInputVal('');
                playSound('click');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          </div>

          <textarea
            id="bencode-input"
            rows={14}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={mode === 'decode' ? 'Paste bencoded data string (e.g. d8:announce...)' : 'Paste JSON object to encode into bencode...'}
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none leading-relaxed"
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
              <div className="flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-bold text-violet-300">
                  {mode === 'decode' ? 'Parsed Object Hierarchy (JSON)' : 'Encoded Bencode Result'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.bytes} bytes {stats.items > 0 ? `• ${stats.items} nodes` : ''}
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="bencode-output"
                readOnly
                rows={14}
                value={outputText || (error ? '<!-- Correct syntax error to generate output -->' : '<!-- Output structure appears here -->')}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-violet-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!outputText || !!error}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white shadow-md shadow-violet-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Output to Clipboard!' : 'Copy Formatted Output'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!outputText || !!error}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download {mode === 'decode' ? '.json' : '.torrent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
