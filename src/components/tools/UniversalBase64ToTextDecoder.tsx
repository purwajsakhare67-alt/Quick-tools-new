import React, { useState, useMemo } from 'react';
import { 
  Key, 
  Copy, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Download, 
  RotateCcw, 
  ShieldCheck,
  Binary,
  Code
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalBase64ToTextDecoderProps {
  onBackToGrid?: () => void;
}

const SAMPLE_PAYLOADS = [
  {
    name: 'JWT Header & Payload',
    b64: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsZXggVmFscXVlciIsImlhdCI6MTUxNjIzOTAyMiwiYWRtaW4iOnRydWV9'
  },
  {
    name: 'HTML Greeting Snippet',
    b64: 'PGRpdiBjbGFzcz0iaGVsbG8td29ybGQiPjxoMT5XZWxjb21lIHRvIEN5YmVyIFNwYWNlISA8L2gxPjxwPkFjY2VsZXJhdGluZyBjbGllbnQtc2lkZSBkZWNvZGluZyB2aWEgd2luZG93LmF0b2I8L3A+PC9kaXY+'
  },
  {
    name: 'JSON Config Object',
    b64: 'ewogICJzZXJ2aWNlIjogImF1dGgtZ2F0ZXdheSIsCiAgInBvcnQiOiA4MDgwLAogICJlbmFibGVkIjogdHJ1ZSwKICAicmVnaW9ucyI6IFsidXMtd2VzdCIsICJldS1jZW50cmFsIl0KfQ=='
  }
];

// UTF-8 safe atob decoding
const decodeBase64Safe = (input: string): string => {
  let cleaned = input.trim();
  // Strip data URL prefixes like data:text/plain;base64,
  if (cleaned.startsWith('data:') && cleaned.includes(';base64,')) {
    cleaned = cleaned.split(';base64,')[1];
  }

  // Handle URL-safe base64 (- and _ instead of + and /)
  cleaned = cleaned.replace(/-/g, '+').replace(/_/g, '/');

  // Add padding if missing
  while (cleaned.length % 4 !== 0) {
    cleaned += '=';
  }

  // Decode via native atob with UTF-8 byte reconstruction
  const binaryString = window.atob(cleaned);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const decoder = new TextDecoder('utf-8');
  return decoder.decode(bytes);
};

export const UniversalBase64ToTextDecoder: React.FC<UniversalBase64ToTextDecoderProps> = ({ onBackToGrid }) => {
  const [base64Input, setBase64Input] = useState<string>(SAMPLE_PAYLOADS[2].b64);
  const [copied, setCopied] = useState<boolean>(false);

  const { decodedText, error, stats } = useMemo(() => {
    if (!base64Input.trim()) {
      return { decodedText: '', error: null, stats: { chars: 0, bytes: 0 } };
    }

    try {
      const parts = base64Input.trim().split('.');
      // If it looks like a JWT token (2 or 3 parts separated by dots)
      if (parts.length >= 2 && !base64Input.includes(' ')) {
        const decodedParts = parts.slice(0, 2).map((p, idx) => {
          try {
            const dec = decodeBase64Safe(p);
            // Attempt to pretty format if JSON
            try {
              return `/* PART ${idx + 1}: ${idx === 0 ? 'HEADER' : 'PAYLOAD'} */\n` + JSON.stringify(JSON.parse(dec), null, 2);
            } catch {
              return `/* PART ${idx + 1} */\n` + dec;
            }
          } catch {
            return `/* PART ${idx + 1} (Raw) */\n` + p;
          }
        });
        const full = decodedParts.join('\n\n');
        return {
          decodedText: full,
          error: null,
          stats: { chars: full.length, bytes: new Blob([full]).size }
        };
      }

      const decoded = decodeBase64Safe(base64Input);
      return {
        decodedText: decoded,
        error: null,
        stats: { chars: decoded.length, bytes: new Blob([decoded]).size }
      };
    } catch (err: any) {
      return {
        decodedText: '',
        error: err.message || 'Invalid Base64 encoding stream',
        stats: { chars: 0, bytes: 0 }
      };
    }
  }, [base64Input]);

  const handleCopy = () => {
    if (!decodedText) return;
    navigator.clipboard.writeText(decodedText);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!decodedText) return;
    const blob = new Blob([decodedText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'decoded_output.txt';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="base64-text-decoder-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-violet-500/10 to-indigo-500/10 border border-purple-500/20 dark:border-purple-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Real-Time Base64 to Text Document Decoder
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-400 border border-purple-300 dark:border-purple-800">
                Security &amp; Data Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Decode raw Base64, data URI strings, and JWT authorization payloads into readable UTF-8 text safely
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

      {/* Preset Payload Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-500" /> Presets:
          </span>
          {SAMPLE_PAYLOADS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setBase64Input(p.b64);
                playSound('click');
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-purple-300 transition-colors cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setBase64Input('');
            playSound('click');
          }}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          Clear Input
        </button>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="b64-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-purple-500" />
              Base64 Encoded Payload Stream
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {base64Input.length} chars
            </span>
          </div>

          <textarea
            id="b64-input"
            rows={13}
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Paste Base64 string (e.g. SGVsbG8gV29ybGQ=) or data:text/plain;base64,..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none leading-relaxed"
          />

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="truncate">{error}</span>
            </div>
          )}
        </div>

        {/* Right: Decoded Output Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                <Code className="w-4 h-4" />
                Decoded Plaintext Outcome
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {stats.chars} chars • {stats.bytes} B
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="b64-decoded-output"
                readOnly
                rows={13}
                value={decodedText || (error ? '/* Correct invalid Base64 input to decode */' : '/* Decoded text renders here */')}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-purple-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!decodedText || !!error}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white shadow-md shadow-purple-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Plaintext to Clipboard!' : 'Select & Copy Plaintext'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!decodedText || !!error}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download .txt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
