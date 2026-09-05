import React, { useState, useMemo } from 'react';
import { 
  Binary, 
  Copy, 
  Check, 
  ArrowLeftRight, 
  Download, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Zap, 
  Eye, 
  Layers
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalTextBinaryConverterProps {
  onBackToGrid?: () => void;
}

export const UniversalTextBinaryConverter: React.FC<UniversalTextBinaryConverterProps> = ({ onBackToGrid }) => {
  const [mode, setMode] = useState<'text-to-binary' | 'binary-to-text'>('text-to-binary');
  const [inputText, setInputText] = useState<string>('Hello World! ⚡');
  const [inputBinary, setInputBinary] = useState<string>('01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100 00100001');
  const [delimiter, setDelimiter] = useState<'space' | 'none' | 'comma' | 'prefix'>('space');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'output' | 'breakdown' | 'table'>('output');

  // Text -> Binary calculation using bitwise shift operators
  const { binaryResult, charBreakdown, errorMsg } = useMemo(() => {
    if (mode === 'text-to-binary') {
      if (!inputText) return { binaryResult: '', charBreakdown: [], errorMsg: '' };
      
      const breakdown: Array<{ char: string; code: number; binary: string; hex: string }> = [];
      const binaryChunks: string[] = [];

      for (let i = 0; i < inputText.length; i++) {
        const code = inputText.charCodeAt(i);
        // Bit shift operators to construct 8-bit binary representation
        let bin = '';
        for (let b = 7; b >= 0; b--) {
          const bit = (code >> b) & 1;
          bin += bit ? '1' : '0';
        }

        const hex = '0x' + code.toString(16).toUpperCase().padStart(2, '0');
        breakdown.push({
          char: inputText[i] === ' ' ? '␣ [space]' : inputText[i] === '\n' ? '↵ [newline]' : inputText[i],
          code,
          binary: bin,
          hex
        });

        if (delimiter === 'prefix') {
          binaryChunks.push('0b' + bin);
        } else {
          binaryChunks.push(bin);
        }
      }

      let formatted = '';
      if (delimiter === 'none') {
        formatted = binaryChunks.join('');
      } else if (delimiter === 'comma') {
        formatted = binaryChunks.join(', ');
      } else {
        formatted = binaryChunks.join(' ');
      }

      return { binaryResult: formatted, charBreakdown: breakdown, errorMsg: '' };
    } else {
      // Binary -> Text conversion
      if (!inputBinary.trim()) return { binaryResult: '', charBreakdown: [], errorMsg: '' };

      // Normalize binary input: remove '0b', commas, extra whitespace
      const cleanInput = inputBinary.replace(/0b/gi, '').replace(/,/g, ' ').trim();
      const chunks = cleanInput.split(/\s+/).filter(Boolean);

      let decodedText = '';
      const breakdown: Array<{ char: string; code: number; binary: string; hex: string }> = [];
      let hasInvalidBits = false;

      for (const chunk of chunks) {
        if (!/^[01]+$/.test(chunk)) {
          hasInvalidBits = true;
          continue;
        }

        // Bitwise calculation: iterate bits and shift
        let charCode = 0;
        for (let i = 0; i < chunk.length; i++) {
          const bitVal = chunk[i] === '1' ? 1 : 0;
          charCode = (charCode << 1) | bitVal;
        }

        const char = String.fromCharCode(charCode);
        decodedText += char;
        breakdown.push({
          char: char === ' ' ? '␣ [space]' : char === '\n' ? '↵ [newline]' : char,
          code: charCode,
          binary: chunk.padStart(8, '0'),
          hex: '0x' + charCode.toString(16).toUpperCase().padStart(2, '0')
        });
      }

      return {
        binaryResult: decodedText,
        charBreakdown: breakdown,
        errorMsg: hasInvalidBits ? 'Warning: Some non-binary characters (not 0 or 1) were bypassed during parsing.' : ''
      };
    }
  }, [mode, inputText, inputBinary, delimiter]);

  const handleCopy = () => {
    if (!binaryResult) return;
    navigator.clipboard.writeText(binaryResult);
    setCopied(true);
    playSound('soft');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    playSound('sliderTick');
    if (mode === 'text-to-binary') {
      setInputBinary(binaryResult);
      setMode('binary-to-text');
    } else {
      setInputText(binaryResult);
      setMode('text-to-binary');
    }
  };

  const handleDownload = () => {
    playSound('soft');
    const blob = new Blob([binaryResult], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'text-to-binary' ? 'binary-output.txt' : 'text-output.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    playSound('reset');
    if (mode === 'text-to-binary') {
      setInputText('');
    } else {
      setInputBinary('');
    }
  };

  const loadPreset = (text: string) => {
    playSound('tap');
    if (mode === 'text-to-binary') {
      setInputText(text);
    } else {
      // Convert preset to binary for binary-to-text
      const bin = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
      setInputBinary(bin);
    }
  };

  const totalBits = mode === 'text-to-binary' 
    ? (inputText ? inputText.length * 8 : 0)
    : (inputBinary.replace(/[^01]/g, '').length);

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100" id="tool-text-binary-converter">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md">
            <Binary className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
              Text ⇄ Binary Bitshift Studio
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-mono font-bold">
                Bitwise Shift Native
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/50">
              Convert strings to 8-bit ASCII/UTF-8 byte sequences and decode binary using browser memory bitwise operations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSwap}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Swap Conversion Mode"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Swap Mode</span>
          </button>
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-xs font-semibold transition-colors"
            >
              Exit
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={() => {
            playSound('tap');
            setMode('text-to-binary');
          }}
          className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'text-to-binary'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 ring-2 ring-cyan-500/50'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <Zap className="w-4 h-4" />
          Text to Binary (Encode)
        </button>

        <button
          onClick={() => {
            playSound('tap');
            setMode('binary-to-text');
          }}
          className={`p-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'binary-to-text'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50'
              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/10'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Binary to Text (Decode)
        </button>
      </div>

      {/* Delimiter & Formatting Bar */}
      {mode === 'text-to-binary' && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500 dark:text-white/50">Byte Delimiter:</span>
          {(['space', 'none', 'comma', 'prefix'] as const).map(del => (
            <button
              key={del}
              onClick={() => {
                playSound('tap');
                setDelimiter(del);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                delimiter === del
                  ? 'bg-cyan-500 text-white shadow-xs font-bold'
                  : 'bg-slate-200 dark:bg-white/5 text-slate-600 dark:text-white/60 hover:bg-slate-300'
              }`}
            >
              {del === 'space' && 'Space (0101 0110)'}
              {del === 'none' && 'Continuous (01010110)'}
              {del === 'comma' && 'Comma (0101, 0110)'}
              {del === 'prefix' && '0b Prefix (0b0101)'}
            </button>
          ))}
        </div>
      )}

      {/* Preset Quick Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-400 dark:text-white/40">Quick Presets:</span>
        {['Hello World!', 'AI Studio', 'OpenAI', '12345', 'Zero Latency', 'Cryptographic'].map(preset => (
          <button
            key={preset}
            onClick={() => loadPreset(preset)}
            className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 border border-slate-200 dark:border-white/10 text-[11px] font-medium text-slate-700 dark:text-white/80 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Dual Input/Output Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <span>{mode === 'text-to-binary' ? 'Input Text String' : 'Input Binary Code (0s & 1s)'}</span>
            </label>
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <textarea
            value={mode === 'text-to-binary' ? inputText : inputBinary}
            onChange={(e) => {
              if (mode === 'text-to-binary') {
                setInputText(e.target.value);
              } else {
                setInputBinary(e.target.value);
              }
            }}
            placeholder={
              mode === 'text-to-binary'
                ? 'Type or paste plain text characters here...'
                : 'Paste space-separated 8-bit binary strings (e.g. 01001000 01100101)...'
            }
            rows={8}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-hidden font-mono text-xs sm:text-sm leading-relaxed transition-all resize-y shadow-inner"
            id="binary-converter-input"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>
              {mode === 'text-to-binary' 
                ? `${inputText.length} Characters • ${inputText.length * 8} Bits` 
                : `${inputBinary.replace(/[^01]/g, '').length} Bits parsed`}
            </span>
            <span>UTF-8 / ASCII Safe</span>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs">
              {errorMsg}
            </div>
          )}
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700 dark:text-white/80">
                {mode === 'text-to-binary' ? 'Binary Output Stream' : 'Decoded Text String'}
              </label>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                Live Result
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                disabled={!binaryResult}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Output'}</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={!binaryResult}
                className="p-1 rounded-lg bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-600 dark:text-white/70 transition-all cursor-pointer disabled:opacity-50"
                title="Download as .txt"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={binaryResult}
              placeholder="Output will instantly stream here..."
              rows={8}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-white/10 font-mono text-xs sm:text-sm text-cyan-600 dark:text-cyan-300 leading-relaxed resize-y shadow-inner focus:outline-hidden"
              id="binary-converter-output"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-white/50 px-1 font-mono">
            <span>Total Bits: {totalBits} ({Math.ceil(totalBits / 8)} Bytes)</span>
            <span>100% Client-Side RAM Processing</span>
          </div>
        </div>
      </div>

      {/* Educational Bit Inspection Drawer */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-white/80">
              Byte-by-Byte Memory Breakdown
            </h4>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setActiveTab('output')}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${activeTab === 'output' ? 'bg-cyan-500/20 text-cyan-500 font-bold' : 'text-slate-400'}`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab('breakdown')}
              className={`px-2 py-0.5 rounded-md cursor-pointer ${activeTab === 'breakdown' ? 'bg-cyan-500/20 text-cyan-500 font-bold' : 'text-slate-400'}`}
            >
              Inspector ({charBreakdown.length})
            </button>
          </div>
        </div>

        {charBreakdown.length > 0 ? (
          <div className="max-h-56 overflow-y-auto space-y-1.5 font-mono text-xs">
            <div className="grid grid-cols-4 gap-2 text-[10px] font-bold text-slate-400 uppercase pb-1 border-b border-slate-200 dark:border-white/5">
              <span>Character</span>
              <span>Decimal</span>
              <span>Hex Code</span>
              <span>8-Bit Binary</span>
            </div>
            {charBreakdown.slice(0, 50).map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 gap-2 py-1 px-2 rounded-lg bg-white dark:bg-white/[0.02] hover:bg-cyan-500/5 items-center border border-slate-100 dark:border-white/5"
              >
                <span className="font-bold text-slate-800 dark:text-white">{row.char}</span>
                <span className="text-slate-500 dark:text-white/60">{row.code}</span>
                <span className="text-amber-500">{row.hex}</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-bold tracking-wider">{row.binary}</span>
              </div>
            ))}
            {charBreakdown.length > 50 && (
              <p className="text-[10px] text-slate-400 text-center pt-1">
                Showing first 50 characters of {charBreakdown.length}...
              </p>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            Type or decode characters to view live binary bit significance mappings.
          </p>
        )}
      </div>
    </div>
  );
};
