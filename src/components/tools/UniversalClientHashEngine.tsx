import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText, 
  Upload, 
  Lock, 
  Key, 
  Search, 
  Sparkles, 
  Trash2, 
  Cpu, 
  CheckCircle2, 
  XCircle,
  FileCode,
  HardDrive
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalClientHashEngineProps {
  onBackToGrid?: () => void;
}

// Pure client-side MD5 implementation (RFC 1321)
function md5(input: Uint8Array): string {
  function safeAdd(x: number, y: number): number {
    const lsw = (x & 0xffff) + (y & 0xffff);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xffff);
  }

  function bitRotateLeft(num: number, cnt: number): number {
    return (num << cnt) | (num >>> (32 - cnt));
  }

  function md5cmn(q: number, a: number, b: number, x: number, s: number, t: number): number {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b);
  }
  function md5ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & c) | (~b & d), a, b, x, s, t);
  }
  function md5gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn((b & d) | (c & ~d), a, b, x, s, t);
  }
  function md5hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(b ^ c ^ d, a, b, x, s, t);
  }
  function md5ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number): number {
    return md5cmn(c ^ (b | ~d), a, b, x, s, t);
  }

  // Convert input Uint8Array to 32-bit words
  const n = input.length;
  const wordCount = (((n + 8) >> 6) + 1) * 16;
  const words = new Int32Array(wordCount);

  for (let i = 0; i < n; i++) {
    words[i >> 2] |= (input[i] & 0xff) << ((i % 4) * 8);
  }
  words[n >> 2] |= 0x80 << ((n % 4) * 8);
  words[wordCount - 2] = (n * 8) & 0xffffffff;
  words[wordCount - 1] = Math.floor((n * 8) / 0x100000000);

  let a = 1732584193;
  let b = -271733879;
  let c = -1732584194;
  let d = 271733878;

  for (let i = 0; i < words.length; i += 16) {
    const olda = a;
    const oldb = b;
    const oldc = c;
    const oldd = d;

    a = md5ff(a, b, c, d, words[i + 0], 7, -680876936);
    d = md5ff(d, a, b, c, words[i + 1], 12, -389564586);
    c = md5ff(c, d, a, b, words[i + 2], 17, 606105819);
    b = md5ff(b, c, d, a, words[i + 3], 22, -1044525330);
    a = md5ff(a, b, c, d, words[i + 4], 7, -176418897);
    d = md5ff(d, a, b, c, words[i + 5], 12, 1200080426);
    c = md5ff(c, d, a, b, words[i + 6], 17, -1473231341);
    b = md5ff(b, c, d, a, words[i + 7], 22, -45705983);
    a = md5ff(a, b, c, d, words[i + 8], 7, 1770035416);
    d = md5ff(d, a, b, c, words[i + 9], 12, -1958414417);
    c = md5ff(c, d, a, b, words[i + 10], 17, -42063);
    b = md5ff(b, c, d, a, words[i + 11], 22, -1990404162);
    a = md5ff(a, b, c, d, words[i + 12], 7, 1804603682);
    d = md5ff(d, a, b, c, words[i + 13], 12, -40341101);
    c = md5ff(c, d, a, b, words[i + 14], 17, -1502002290);
    b = md5ff(b, c, d, a, words[i + 15], 22, 1236535329);

    a = md5gg(a, b, c, d, words[i + 1], 5, -165796510);
    d = md5gg(d, a, b, c, words[i + 6], 9, -1069501632);
    c = md5gg(c, d, a, b, words[i + 11], 14, 643717713);
    b = md5gg(b, c, d, a, words[i + 0], 20, -373897302);
    a = md5gg(a, b, c, d, words[i + 5], 5, -701558691);
    d = md5gg(d, a, b, c, words[i + 10], 9, 38016083);
    c = md5gg(c, d, a, b, words[i + 15], 14, -660478335);
    b = md5gg(b, c, d, a, words[i + 4], 20, -405537812);
    a = md5gg(a, b, c, d, words[i + 9], 5, 568446438);
    d = md5gg(d, a, b, c, words[i + 14], 9, -1019803690);
    c = md5gg(c, d, a, b, words[i + 3], 14, -187363961);
    b = md5gg(b, c, d, a, words[i + 8], 20, 1163531501);
    a = md5gg(a, b, c, d, words[i + 13], 5, -1444681467);
    d = md5gg(d, a, b, c, words[i + 2], 9, -51403784);
    c = md5gg(c, d, a, b, words[i + 7], 14, 1735328473);
    b = md5gg(b, c, d, a, words[i + 12], 20, -1926607734);

    a = md5hh(a, b, c, d, words[i + 5], 4, -378558);
    d = md5hh(d, a, b, c, words[i + 8], 11, -2022574463);
    c = md5hh(c, d, a, b, words[i + 11], 16, 1839030562);
    b = md5hh(b, c, d, a, words[i + 14], 23, -35309556);
    a = md5hh(a, b, c, d, words[i + 1], 4, -1530992060);
    d = md5hh(d, a, b, c, words[i + 4], 11, 1272893353);
    c = md5hh(c, d, a, b, words[i + 7], 16, -155497632);
    b = md5hh(b, c, d, a, words[i + 10], 23, -1094730640);
    a = md5hh(a, b, c, d, words[i + 13], 4, 681279174);
    d = md5hh(d, a, b, c, words[i + 0], 11, -358537222);
    c = md5hh(c, d, a, b, words[i + 3], 16, -722521979);
    b = md5hh(b, c, d, a, words[i + 6], 23, 76029189);
    a = md5hh(a, b, c, d, words[i + 9], 4, -640364487);
    d = md5hh(d, a, b, c, words[i + 12], 11, -421815835);
    c = md5hh(c, d, a, b, words[i + 15], 16, 530742520);
    b = md5hh(b, c, d, a, words[i + 2], 23, -995338651);

    a = md5ii(a, b, c, d, words[i + 0], 6, -198630844);
    d = md5ii(d, a, b, c, words[i + 7], 10, 1126891415);
    c = md5ii(c, d, a, b, words[i + 14], 15, -1416354905);
    b = md5ii(b, c, d, a, words[i + 5], 21, -57434055);
    a = md5ii(a, b, c, d, words[i + 12], 6, 1700485571);
    d = md5ii(d, a, b, c, words[i + 3], 10, -1894986606);
    c = md5ii(c, d, a, b, words[i + 10], 15, -1051523);
    b = md5ii(b, c, d, a, words[i + 1], 21, -2054922799);
    a = md5ii(a, b, c, d, words[i + 8], 6, 1873313359);
    d = md5ii(d, a, b, c, words[i + 15], 10, -30611744);
    c = md5ii(c, d, a, b, words[i + 6], 15, -1560198380);
    b = md5ii(b, c, d, a, words[i + 13], 21, 1309151649);
    a = md5ii(a, b, c, d, words[i + 4], 6, -145523070);
    d = md5ii(d, a, b, c, words[i + 11], 10, -1120210379);
    c = md5ii(c, d, a, b, words[i + 2], 15, 718787259);
    b = md5ii(b, c, d, a, words[i + 9], 21, -343485551);

    a = safeAdd(a, olda);
    b = safeAdd(b, oldb);
    c = safeAdd(c, oldc);
    d = safeAdd(d, oldd);
  }

  const resultWords = [a, b, c, d];
  let hex = '';
  for (let i = 0; i < resultWords.length * 4; i++) {
    const byte = (resultWords[i >> 2] >> ((i % 4) * 8)) & 0xff;
    hex += byte.toString(16).padStart(2, '0');
  }
  return hex;
}

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

interface HashRow {
  id: string;
  name: string;
  bitLength: number;
  outputChars: number;
  value: string;
  badgeColor: string;
}

export const UniversalClientHashEngine: React.FC<UniversalClientHashEngineProps> = ({ onBackToGrid }) => {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [textInput, setTextInput] = useState<string>('Hello World 2026');
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number; type: string } | null>(null);
  const [fileBuffer, setFileBuffer] = useState<ArrayBuffer | null>(null);
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [verifyChecksum, setVerifyChecksum] = useState<string>('');
  const [benchTime, setBenchTime] = useState<number>(0);
  const [hashes, setHashes] = useState<{ [key: string]: string }>({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const computeHashes = useCallback(async (buffer: ArrayBuffer) => {
    const t0 = performance.now();
    const uint8 = new Uint8Array(buffer);

    // Compute MD5
    const md5Hash = md5(uint8);

    // Compute Web Crypto hashes
    let sha1Hash = '';
    let sha256Hash = '';
    let sha384Hash = '';
    let sha512Hash = '';

    if (window.crypto && window.crypto.subtle) {
      try {
        const [s1, s256, s384, s512] = await Promise.all([
          window.crypto.subtle.digest('SHA-1', buffer),
          window.crypto.subtle.digest('SHA-256', buffer),
          window.crypto.subtle.digest('SHA-384', buffer),
          window.crypto.subtle.digest('SHA-512', buffer)
        ]);
        sha1Hash = bufferToHex(s1);
        sha256Hash = bufferToHex(s256);
        sha384Hash = bufferToHex(s384);
        sha512Hash = bufferToHex(s512);
      } catch (err) {
        console.error('Web Crypto error:', err);
      }
    }

    const t1 = performance.now();
    setBenchTime(Math.round((t1 - t0) * 10) / 10);

    setHashes({
      md5: md5Hash,
      sha1: sha1Hash,
      sha256: sha256Hash,
      sha384: sha384Hash,
      sha512: sha512Hash
    });
  }, []);

  // Trigger hash calculation on text change or file change
  useEffect(() => {
    if (inputMode === 'text') {
      const encoder = new TextEncoder();
      const buffer = encoder.encode(textInput).buffer as ArrayBuffer;
      computeHashes(buffer);
    } else if (inputMode === 'file' && fileBuffer) {
      computeHashes(fileBuffer);
    }
  }, [inputMode, textInput, fileBuffer, computeHashes]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        setFileInfo({
          name: file.name,
          size: file.size,
          type: file.type || 'Binary Stream'
        });
        setFileBuffer(reader.result);
        playSound('tap');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleCopyHash = (id: string, value: string) => {
    const finalVal = isUppercase ? value.toUpperCase() : value.toLowerCase();
    navigator.clipboard.writeText(finalVal);
    playSound('success');
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = () => {
    const lines = [
      `MD5:    ${isUppercase ? hashes.md5.toUpperCase() : hashes.md5}`,
      `SHA-1:  ${isUppercase ? hashes.sha1.toUpperCase() : hashes.sha1}`,
      `SHA-256:${isUppercase ? hashes.sha256.toUpperCase() : hashes.sha256}`,
      `SHA-384:${isUppercase ? hashes.sha384.toUpperCase() : hashes.sha384}`,
      `SHA-512:${isUppercase ? hashes.sha512.toUpperCase() : hashes.sha512}`
    ].join('\n');
    navigator.clipboard.writeText(lines);
    playSound('success');
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const hashRows: HashRow[] = [
    {
      id: 'md5',
      name: 'MD5',
      bitLength: 128,
      outputChars: 32,
      value: hashes.md5,
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
    },
    {
      id: 'sha1',
      name: 'SHA-1',
      bitLength: 160,
      outputChars: 40,
      value: hashes.sha1,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    },
    {
      id: 'sha256',
      name: 'SHA-256',
      bitLength: 256,
      outputChars: 64,
      value: hashes.sha256,
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'sha384',
      name: 'SHA-384',
      bitLength: 384,
      outputChars: 96,
      value: hashes.sha384,
      badgeColor: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    },
    {
      id: 'sha512',
      name: 'SHA-512',
      bitLength: 512,
      outputChars: 128,
      value: hashes.sha512,
      badgeColor: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    }
  ];

  // Checksum matching
  const cleanVerify = verifyChecksum.trim().toLowerCase();
  const matchedAlgorithm = cleanVerify
    ? hashRows.find((r) => r.value.toLowerCase() === cleanVerify)
    : null;

  return (
    <div className="w-full space-y-6" id="universal-client-hash-engine">
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
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Client-Side Hash Engine - SHA-256, SHA-1 & MD5
            </h2>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Hardware-accelerated native WebCrypto API • 100% In-memory privacy • Zero upload overhead
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsUppercase(!isUppercase)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
          >
            {isUppercase ? 'UPPERCASE HEX' : 'lowercase hex'}
          </button>
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 hover:opacity-95 transition-opacity cursor-pointer"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'All Hashes Copied' : 'Copy All Hashes'}</span>
          </button>
        </div>
      </div>

      {/* Input Mode Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 max-w-sm">
        <button
          onClick={() => {
            setInputMode('text');
            playSound('tap');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            inputMode === 'text'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Raw Text Block</span>
        </button>
        <button
          onClick={() => {
            setInputMode('file');
            playSound('tap');
          }}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            inputMode === 'file'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Local File Drop</span>
        </button>
      </div>

      {/* Text Mode Input */}
      {inputMode === 'text' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-emerald-400" />
              <span>Input String (UTF-8 Encoded):</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-white/50">
              {new TextEncoder().encode(textInput).length} Bytes • {textInput.length} Chars
            </span>
          </div>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            rows={3}
            className="w-full text-xs font-mono p-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 selection:bg-emerald-500/30"
            placeholder="Type or paste any text or token..."
          />
        </div>
      )}

      {/* Local File Drop Mode */}
      {inputMode === 'file' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100/50 dark:hover:bg-white/[0.04] flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
            <HardDrive className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            {fileInfo ? fileInfo.name : 'Click to select or drag & drop any file'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-1 max-w-sm">
            {fileInfo
              ? `${(fileInfo.size / 1024).toFixed(1)} KB • ${fileInfo.type} • Processed entirely in browser RAM`
              : 'Any file format (images, binaries, documents, archives). 100% Client-side hashing.'}
          </p>
        </div>
      )}

      {/* Checksum Verifier Box */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-700 dark:text-white/80 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Verify / Compare Against Checksum (Optional):</span>
          </label>
          {cleanVerify && (
            <span className="flex items-center gap-1 font-bold text-[11px]">
              {matchedAlgorithm ? (
                <span className="text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  MATCHED {matchedAlgorithm.name}!
                </span>
              ) : (
                <span className="text-rose-500 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  NO CHECKSUM MATCH
                </span>
              )}
            </span>
          )}
        </div>
        <input
          type="text"
          value={verifyChecksum}
          onChange={(e) => setVerifyChecksum(e.target.value)}
          placeholder="Paste expected MD5, SHA-1, or SHA-256 hash to verify..."
          className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      {/* Parallel Hash Rows */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-white/50 px-1">
          <span>Cryptographic Hash Output</span>
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Cpu className="w-3 h-3 text-emerald-400" />
            {benchTime}ms sub-millisecond execution
          </span>
        </div>

        {hashRows.map((row) => {
          const finalHash = isUppercase ? row.value.toUpperCase() : row.value.toLowerCase();
          const isCopied = copiedId === row.id;
          const isMatched = cleanVerify && cleanVerify === row.value.toLowerCase();

          return (
            <div
              key={row.id}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isMatched
                  ? 'bg-emerald-500/10 border-emerald-500/40 ring-2 ring-emerald-500/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-white/10'
              }`}
            >
              {/* Algorithm Badge */}
              <div className="flex items-center gap-2 shrink-0">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${row.badgeColor}`}>
                  {row.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-white/40 font-mono">
                  {row.bitLength}-bit • {row.outputChars} hex chars
                </span>
              </div>

              {/* Hash string monospace display */}
              <div className="w-full min-w-0 flex-1">
                <div className="font-mono text-xs text-slate-800 dark:text-emerald-300 break-all bg-slate-50 dark:bg-slate-950/70 p-2 rounded-xl border border-slate-200/60 dark:border-white/5 select-all">
                  {finalHash || 'Computing...'}
                </div>
              </div>

              {/* Individual Copy Button */}
              <button
                onClick={() => handleCopyHash(row.id, row.value)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors cursor-pointer shrink-0 self-end sm:self-auto"
                title={`Copy ${row.name} hash`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
