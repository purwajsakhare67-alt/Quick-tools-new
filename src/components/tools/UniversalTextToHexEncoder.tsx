import React, { useState, useMemo } from 'react';
import { 
  Binary, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  Sliders, 
  Download, 
  Cpu, 
  Code,
  Layers
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalTextToHexEncoderProps {
  onBackToGrid?: () => void;
}

const SAMPLE_TEXTS = [
  { name: 'Standard Greeting', text: 'Hello, World!' },
  { name: 'JSON Packet', text: '{"status":200,"ok":true}' },
  { name: 'Hex Signature', text: 'Secured with SHA-256 Crypto' }
];

type HexFormat = 'space' | 'colon' | 'prefix' | 'escape' | 'continuous';

export const UniversalTextToHexEncoder: React.FC<UniversalTextToHexEncoderProps> = ({ onBackToGrid }) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS[0].text);
  const [hexFormat, setHexFormat] = useState<HexFormat>('space');
  const [uppercase, setUppercase] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Conversion engine in browser RAM via TextEncoder UTF-8 byte stream
  const { hexOutput, byteList, stats } = useMemo(() => {
    if (!inputText) {
      return { hexOutput: '', byteList: [], stats: { bytes: 0, chars: 0 } };
    }

    const encoder = new TextEncoder();
    const bytes = encoder.encode(inputText);

    const hexArray = Array.from(bytes).map((b) => {
      let h = b.toString(16).padStart(2, '0');
      return uppercase ? h.toUpperCase() : h.toLowerCase();
    });

    let formatted = '';
    if (hexFormat === 'space') {
      formatted = hexArray.join(' ');
    } else if (hexFormat === 'colon') {
      formatted = hexArray.join(':');
    } else if (hexFormat === 'prefix') {
      formatted = hexArray.map((h) => `0x${h}`).join(', ');
    } else if (hexFormat === 'escape') {
      formatted = hexArray.map((h) => `\\x${h}`).join('');
    } else {
      formatted = hexArray.join('');
    }

    const byteDetails = Array.from(bytes).slice(0, 16).map((b, idx) => ({
      char: inputText[idx] || '·',
      dec: b,
      hex: uppercase ? b.toString(16).toUpperCase().padStart(2, '0') : b.toString(16).padStart(2, '0'),
      bin: b.toString(2).padStart(8, '0')
    }));

    return {
      hexOutput: formatted,
      byteList: byteDetails,
      stats: {
        bytes: bytes.length,
        chars: inputText.length
      }
    };
  }, [inputText, hexFormat, uppercase]);

  const handleCopy = () => {
    if (!hexOutput) return;
    navigator.clipboard.writeText(hexOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!hexOutput) return;
    const blob = new Blob([hexOutput], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hex_encoded_output.txt';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="text-to-hex-encoder-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 dark:border-cyan-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Binary className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Real-Time Text String to Hex Encoder
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800">
                Developer Canvas Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Compute UTF-8 character codes and byte structures into raw hexadecimal strings in browser RAM
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

      {/* Preset Selectors & Clean Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Presets:
          </span>
          {SAMPLE_TEXTS.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(sample.text);
                playSound('click');
              }}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-cyan-300 transition-colors cursor-pointer"
            >
              {sample.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setInputText('');
            playSound('click');
          }}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Delimiter & Formatting Selectors */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Format Delimiter:</span>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'space', label: 'Space (48 65 6C)' },
                  { id: 'colon', label: 'Colon (48:65:6C)' },
                  { id: 'prefix', label: '0x Array (0x48, 0x65)' },
                  { id: 'escape', label: 'Escape (\\x48\\x65)' },
                  { id: 'continuous', label: 'Raw Flat' }
                ] as const
              ).map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    setHexFormat(fmt.id);
                    playSound('tap');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    hexFormat === fmt.id
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-cyan-300'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
            />
            Uppercase Hex (A-F)
          </label>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input Textarea */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
            <label htmlFor="text-hex-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-cyan-500" />
              Source Plaintext String
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {stats.chars} characters • {stats.bytes} bytes
            </span>
          </div>

          <textarea
            id="text-hex-input"
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or paste text string to convert to hexadecimal..."
            className="w-full flex-1 p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none leading-relaxed"
          />
        </div>

        {/* Right: Hex Output Panel */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Binary className="w-4 h-4" />
                Calculated Hexadecimal String
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {hexOutput.length} chars
              </span>
            </div>

            <div className="pt-2">
              <textarea
                id="hex-encoded-output"
                readOnly
                rows={10}
                value={hexOutput || '/* Hexadecimal byte representation renders here */'}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-cyan-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleCopy}
              disabled={!hexOutput}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-md shadow-cyan-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Hex to Clipboard!' : 'Copy Hex String'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!hexOutput}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export .txt
            </button>
          </div>
        </div>
      </div>

      {/* Byte Inspection Table (First 16 Bytes) */}
      {byteList.length > 0 && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-white/5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-500" />
              Byte Matrix Memory Inspection (Sample Bytes)
            </span>
            <span className="text-[10px] text-slate-400">Byte • Dec • Hex • Binary</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 pt-1">
            {byteList.map((item, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-white/5 text-center">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {item.char === ' ' ? '␣' : item.char}
                </div>
                <div className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold mt-0.5">
                  0x{item.hex}
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  d:{item.dec}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
