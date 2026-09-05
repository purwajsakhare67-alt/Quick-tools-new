import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Download, 
  FileCode, 
  Layers, 
  HardDrive,
  Clock,
  Radio,
  Share2
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalTorrentBencodeJsonParserProps {
  onBackToGrid?: () => void;
}

// Bencode Recursive Decoder
const decodeBencodeString = (str: string): any => {
  let index = 0;

  const parseNext = (): any => {
    if (index >= str.length) {
      throw new Error('Unexpected end of bencoded stream');
    }

    const char = str[index];

    // Integer: i<num>e
    if (char === 'i') {
      index++;
      const endIdx = str.indexOf('e', index);
      if (endIdx === -1) throw new Error(`Unterminated integer starting at offset ${index - 1}`);
      const intStr = str.substring(index, endIdx);
      index = endIdx + 1;
      const num = Number(intStr);
      if (isNaN(num)) throw new Error(`Invalid integer representation: "${intStr}"`);
      return num;
    }

    // List: l<contents>e
    if (char === 'l') {
      index++;
      const list: any[] = [];
      while (str[index] !== 'e') {
        if (index >= str.length) throw new Error('Unterminated list in bencoded data');
        list.push(parseNext());
      }
      index++; // skip 'e'
      return list;
    }

    // Dictionary: d<key1><val1>...e
    if (char === 'd') {
      index++;
      const dict: Record<string, any> = {};
      while (str[index] !== 'e') {
        if (index >= str.length) throw new Error('Unterminated dictionary in bencoded data');
        const key = parseNext();
        if (typeof key !== 'string') {
          throw new Error(`Dictionary key at offset ${index} must be a string, got ${typeof key}`);
        }
        const val = parseNext();
        dict[key] = val;
      }
      index++; // skip 'e'
      return dict;
    }

    // String: <length>:<data>
    if (char >= '0' && char <= '9') {
      const colonIdx = str.indexOf(':', index);
      if (colonIdx === -1) throw new Error(`Malformed string length prefix at offset ${index}`);
      const lenStr = str.substring(index, colonIdx);
      const len = parseInt(lenStr, 10);
      if (isNaN(len) || len < 0) throw new Error(`Invalid byte string length "${lenStr}"`);
      index = colonIdx + 1;
      const val = str.substring(index, index + len);
      index += len;
      return val;
    }

    throw new Error(`Unrecognized bencode token '${char}' at offset ${index}`);
  };

  const result = parseNext();
  return result;
};

const SAMPLE_BENCODE = `d8:announce39:udp://tracker.opentrackr.org:1337/announce13:announce-listll39:udp://tracker.opentrackr.org:1337/announceel37:udp://open.stealth.si:80/announceee7:comment31:Arch Linux Minimal x86_64 ISO10:created by13:mktorrent 1.113:creation datei1714560000e4:infod6:lengthi858993459e4:name27:archlinux-2026-x86_64.iso12:piece lengthi2097152e6:pieces40:0123456789abcdef0123456789abcdef01234567ee`;

export const UniversalTorrentBencodeJsonParser: React.FC<UniversalTorrentBencodeJsonParserProps> = ({ onBackToGrid }) => {
  const [bencodeInput, setBencodeInput] = useState<string>(SAMPLE_BENCODE);
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table');
  const [copied, setCopied] = useState<boolean>(false);

  // Parse and extract structured metadata
  const { parsedData, jsonOutput, error, summary } = useMemo(() => {
    if (!bencodeInput.trim()) {
      return { parsedData: null, jsonOutput: '', error: null, summary: null };
    }

    try {
      const decoded = decodeBencodeString(bencodeInput.trim());
      const jsonStr = JSON.stringify(decoded, null, 2);

      // Extract high-level torrent properties if available
      let name = 'Unknown / Raw Payload';
      let totalSize = 0;
      let pieceLength = 0;
      let pieceCount = 0;
      let createdBy = 'Not specified';
      let creationDate = '';
      const announceUrls: string[] = [];
      const fileList: { path: string; size: number }[] = [];

      if (decoded && typeof decoded === 'object') {
        if (decoded.announce) announceUrls.push(decoded.announce);
        if (Array.isArray(decoded['announce-list'])) {
          decoded['announce-list'].forEach((sub: any) => {
            if (Array.isArray(sub)) {
              sub.forEach((u) => {
                if (typeof u === 'string' && !announceUrls.includes(u)) announceUrls.push(u);
              });
            } else if (typeof sub === 'string' && !announceUrls.includes(sub)) {
              announceUrls.push(sub);
            }
          });
        }

        if (decoded['created by']) createdBy = String(decoded['created by']);
        if (decoded['creation date']) {
          const d = new Date(Number(decoded['creation date']) * 1000);
          creationDate = d.toLocaleString();
        }

        const info = decoded.info;
        if (info && typeof info === 'object') {
          if (info.name) name = String(info.name);
          if (info['piece length']) pieceLength = Number(info['piece length']);
          if (info.pieces && typeof info.pieces === 'string') {
            pieceCount = Math.floor(info.pieces.length / 20);
          }
          if (info.length) {
            totalSize = Number(info.length);
            fileList.push({ path: name, size: totalSize });
          } else if (Array.isArray(info.files)) {
            info.files.forEach((f: any) => {
              const p = Array.isArray(f.path) ? f.path.join('/') : String(f.path || 'file');
              const s = Number(f.length || 0);
              totalSize += s;
              fileList.push({ path: p, size: s });
            });
          }
        }
      }

      const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      };

      return {
        parsedData: decoded,
        jsonOutput: jsonStr,
        error: null,
        summary: {
          name,
          totalSizeFormatted: formatBytes(totalSize),
          totalBytes: totalSize,
          pieceLengthFormatted: pieceLength > 0 ? formatBytes(pieceLength) : 'N/A',
          pieceCount,
          createdBy,
          creationDate: creationDate || 'Not specified',
          announceUrls,
          fileList
        }
      };
    } catch (err: any) {
      return {
        parsedData: null,
        jsonOutput: '',
        error: err.message || 'Error decoding bencoded metadata string',
        summary: null
      };
    }
  }, [bencodeInput]);

  const handleCopyJson = () => {
    if (!jsonOutput) return;
    navigator.clipboard.writeText(jsonOutput);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!jsonOutput) return;
    const blob = new Blob([jsonOutput], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${summary?.name || 'torrent_metadata'}.json`;
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="torrent-bencode-json-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 border border-blue-500/20 dark:border-blue-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Torrent Bencode to Structured JSON Parser
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
                Data Infrastructure Utility
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Decode programmatic bencode byte streams, dictionary variables, and torrent tracker schemas into clean JSON
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

      {/* Preset & Clear Control */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Presets:
          </span>
          <button
            onClick={() => {
              setBencodeInput(SAMPLE_BENCODE);
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-300 transition-colors cursor-pointer"
          >
            Linux ISO Torrent Metadata
          </button>
          <button
            onClick={() => {
              setBencodeInput('d8:intervali1800e12:min intervali300e8:completei420e10:incompletei18e6:peers0:e');
              playSound('click');
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:border-blue-300 transition-colors cursor-pointer"
          >
            Tracker Announce Response
          </button>
        </div>

        <button
          onClick={() => {
            setBencodeInput('');
            playSound('click');
          }}
          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          Clear
        </button>
      </div>

      {/* Input Textarea */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="bencode-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-blue-500" />
            Raw Bencoded Byte Stream (d...e, l...e, i...e, length:string)
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {bencodeInput.length} bytes
          </span>
        </div>

        <textarea
          id="bencode-input"
          rows={5}
          value={bencodeInput}
          onChange={(e) => setBencodeInput(e.target.value)}
          placeholder="Paste raw bencoded torrent byte stream..."
          className="w-full p-3 font-mono text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
        />

        {error && (
          <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}
      </div>

      {/* Output Tabs & Visual Schema */}
      {parsedData && (
        <div className="space-y-4">
          {/* Tab Switcher */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveTab('table');
                  playSound('tap');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'table'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Torrent Schema &amp; Keys View
              </button>
              <button
                onClick={() => {
                  setActiveTab('json');
                  playSound('tap');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === 'json'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                Raw JSON Tree ({jsonOutput.split('\n').length} lines)
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCopyJson}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied JSON!' : 'Copy JSON'}
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            </div>
          </div>

          {/* View: Schema Table */}
          {activeTab === 'table' && summary && (
            <div className="space-y-4">
              {/* Metric Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-blue-500" />
                    Target Payload Size
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {summary.totalSizeFormatted}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    Piece Length
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {summary.pieceLengthFormatted}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-violet-500" />
                    Trackers Discovered
                  </div>
                  <div className="text-base font-black text-slate-900 dark:text-white mt-1 font-mono">
                    {summary.announceUrls.length}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10">
                  <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    Creation Date
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 truncate">
                    {summary.creationDate}
                  </div>
                </div>
              </div>

              {/* Torrent Details Table */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Torrent Node Properties
                </h4>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/10">
                      <tr>
                        <th className="px-3 py-2 font-bold">Metadata Key</th>
                        <th className="px-3 py-2 font-bold">Type</th>
                        <th className="px-3 py-2 font-bold">Value Summary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-mono">
                      <tr>
                        <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">info.name</td>
                        <td className="px-3 py-2 text-slate-500">string</td>
                        <td className="px-3 py-2 text-slate-800 dark:text-slate-200 font-sans font-medium">{summary.name}</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">created by</td>
                        <td className="px-3 py-2 text-slate-500">string</td>
                        <td className="px-3 py-2 text-slate-800 dark:text-slate-200">{summary.createdBy}</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">announce</td>
                        <td className="px-3 py-2 text-slate-500">list / URI</td>
                        <td className="px-3 py-2 text-slate-800 dark:text-slate-200 truncate max-w-xs">
                          {summary.announceUrls.join(', ') || 'None'}
                        </td>
                      </tr>
                      {summary.fileList.length > 0 && (
                        <tr>
                          <td className="px-3 py-2 font-bold text-blue-600 dark:text-blue-400">files / payload</td>
                          <td className="px-3 py-2 text-slate-500">file array ({summary.fileList.length})</td>
                          <td className="px-3 py-2 text-slate-800 dark:text-slate-200 font-sans">
                            {summary.fileList[0].path} ({summary.totalSizeFormatted})
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* View: Raw JSON View */}
          {activeTab === 'json' && (
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
              <textarea
                readOnly
                rows={14}
                value={jsonOutput}
                className="w-full p-3 font-mono text-xs rounded-xl bg-slate-950/90 border border-slate-800 text-blue-200 select-all focus:outline-none resize-none leading-relaxed"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
