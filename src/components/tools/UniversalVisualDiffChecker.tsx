import React, { useState, useMemo } from 'react';
import { 
  GitCompare, 
  ArrowLeft, 
  Copy, 
  Check, 
  ArrowRightLeft, 
  Sparkles, 
  Trash2, 
  Columns, 
  List, 
  Plus, 
  Minus, 
  Equal,
  FileCode
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalVisualDiffCheckerProps {
  onBackToGrid?: () => void;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  leftLine?: string;
  rightLine?: string;
  leftLineNum?: number;
  rightLineNum?: number;
}

const SAMPLE_ORIGINAL = `// User Authentication Controller
function authenticateUser(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).send("Missing credentials");
  }

  const user = database.findUser(username);
  if (user && user.password === password) {
    const token = createSession(user.id);
    return res.json({ status: "success", token: token });
  }

  return res.status(401).send("Unauthorized");
}`;

const SAMPLE_MODIFIED = `// User Authentication Controller (Secured V2)
import { verifyPassword, createJwtToken } from '../security';

async function authenticateUser(req, res) {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: "Missing required credentials" });
  }

  const user = await database.findUserByUsername(username);
  const isValid = user ? await verifyPassword(password, user.passwordHash) : false;
  
  if (isValid) {
    const token = createJwtToken(user.id, { role: user.role });
    return res.json({ status: "success", token, user: { id: user.id, username } });
  }

  return res.status(401).json({ error: "Invalid username or password" });
}`;

export const UniversalVisualDiffChecker: React.FC<UniversalVisualDiffCheckerProps> = ({
  onBackToGrid
}) => {
  const [originalText, setOriginalText] = useState<string>(SAMPLE_ORIGINAL);
  const [modifiedText, setModifiedText] = useState<string>(SAMPLE_MODIFIED);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Native string sequence array split diff algorithm
  const diffResult = useMemo(() => {
    const clean = (s: string) => (ignoreWhitespace ? s.trim() : s);

    const origLines = originalText.split('\n');
    const modLines = modifiedText.split('\n');

    const result: DiffLine[] = [];
    let origIdx = 0;
    let modIdx = 0;
    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;

    // LCS Matrix calculation on lines
    const m = origLines.length;
    const n = modLines.length;
    const lcs: number[][] = Array(m + 1)
      .fill(0)
      .map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (clean(origLines[i - 1]) === clean(modLines[j - 1])) {
          lcs[i][j] = lcs[i - 1][j - 1] + 1;
        } else {
          lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1]);
        }
      }
    }

    // Backtrack to find diff sequences
    let i = m;
    let j = n;
    const revDiff: DiffLine[] = [];

    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && clean(origLines[i - 1]) === clean(modLines[j - 1])) {
        revDiff.push({
          type: 'unchanged',
          leftLine: origLines[i - 1],
          rightLine: modLines[j - 1],
          leftLineNum: i,
          rightLineNum: j
        });
        unchangedCount++;
        i--;
        j--;
      } else if (j > 0 && (i === 0 || lcs[i][j - 1] >= lcs[i - 1][j])) {
        revDiff.push({
          type: 'added',
          rightLine: modLines[j - 1],
          rightLineNum: j
        });
        addedCount++;
        j--;
      } else if (i > 0 && (j === 0 || lcs[i][j - 1] < lcs[i - 1][j])) {
        revDiff.push({
          type: 'removed',
          leftLine: origLines[i - 1],
          leftLineNum: i
        });
        removedCount++;
        i--;
      }
    }

    revDiff.reverse();

    const totalLines = origLines.length + modLines.length;
    const similarity = totalLines > 0 
      ? Math.round((unchangedCount * 2 / totalLines) * 100) 
      : 100;

    return {
      lines: revDiff,
      stats: { addedCount, removedCount, unchangedCount, similarity }
    };
  }, [originalText, modifiedText, ignoreWhitespace]);

  const swapTexts = () => {
    playSound('tap');
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
  };

  const copyDiffSummary = () => {
    playSound('bell');
    const summary = 
      `--- Diff Summary ---\n` +
      `Added Lines: +${diffResult.stats.addedCount}\n` +
      `Removed Lines: -${diffResult.stats.removedCount}\n` +
      `Unchanged Lines: ${diffResult.stats.unchangedCount}\n` +
      `Similarity Score: ${diffResult.stats.similarity}%\n\n` +
      diffResult.lines.map(l => {
        if (l.type === 'added') return `+ ${l.rightLine}`;
        if (l.type === 'removed') return `- ${l.leftLine}`;
        return `  ${l.leftLine || l.rightLine}`;
      }).join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (type: 'code' | 'json' | 'text') => {
    playSound('tap');
    if (type === 'code') {
      setOriginalText(SAMPLE_ORIGINAL);
      setModifiedText(SAMPLE_MODIFIED);
    } else if (type === 'json') {
      setOriginalText(JSON.stringify({ name: "App", version: "1.0.0", port: 3000, active: true }, null, 2));
      setModifiedText(JSON.stringify({ name: "App Engine", version: "1.2.0", port: 8080, active: true, ssl: true }, null, 2));
    } else if (type === 'text') {
      setOriginalText("The quick brown fox jumps over the lazy dog.\nHe was very energetic and fast.\nHave a wonderful sunny afternoon!");
      setModifiedText("The fast crimson fox leaps above the sleepy dog.\nHe was extremely energetic and quick.\nHave a wonderful sunny afternoon!");
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          {onBackToGrid && (
            <button
              onClick={onBackToGrid}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-white/60 transition-colors"
              title="Back to tools"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <GitCompare className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Side-by-Side Visual Diff Checker & Text Comparison
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              Developer Utility
            </span>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={swapTexts}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-all cursor-pointer"
            title="Swap Original and Modified"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Swap</span>
          </button>
          <button
            onClick={copyDiffSummary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-md hover:shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-white" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Options & Telemetry Stats Bar */}
      <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* View Modes */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold">
            <button
              onClick={() => {
                setViewMode('split');
                playSound('tap');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'split'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Comparison</span>
            </button>
            <button
              onClick={() => {
                setViewMode('unified');
                playSound('tap');
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'unified'
                  ? 'bg-cyan-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Unified Diff</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-white/40 text-[11px]">Load Sample:</span>
            <button
              onClick={() => loadPreset('code')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 font-bold hover:text-cyan-500"
            >
              TypeScript
            </button>
            <button
              onClick={() => loadPreset('json')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 font-bold hover:text-cyan-500"
            >
              JSON Config
            </button>
            <button
              onClick={() => loadPreset('text')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-white/80 border border-slate-200 dark:border-white/10 font-bold hover:text-cyan-500"
            >
              Sentences
            </button>
          </div>

          {/* Whitespace Toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-600 dark:text-white/70">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => {
                setIgnoreWhitespace(e.target.checked);
                playSound('tap');
              }}
              className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
            />
            <span>Ignore Whitespace</span>
          </label>
        </div>

        {/* Live Diff Stats Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-white/5 text-center text-xs">
          <div className="p-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span><strong>+{diffResult.stats.addedCount}</strong> Added Lines</span>
          </div>
          <div className="p-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400 flex items-center justify-center gap-2">
            <Minus className="w-4 h-4" />
            <span><strong>-{diffResult.stats.removedCount}</strong> Removed Lines</span>
          </div>
          <div className="p-2 rounded-2xl bg-slate-200/60 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-slate-700 dark:text-white/70 flex items-center justify-center gap-2">
            <Equal className="w-4 h-4" />
            <span><strong>{diffResult.stats.unchangedCount}</strong> Unchanged</span>
          </div>
          <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span><strong>{diffResult.stats.similarity}%</strong> Similarity</span>
          </div>
        </div>
      </div>

      {/* Input Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <Minus className="w-3.5 h-3.5" />
              Original Text (Before)
            </span>
            <button
              onClick={() => {
                setOriginalText('');
                playSound('tap');
              }}
              className="text-[11px] text-slate-400 hover:text-rose-500"
            >
              Clear
            </button>
          </div>
          <textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-rose-500 focus:outline-hidden transition-all resize-none selection:bg-rose-500/30"
            placeholder="Paste original source text here..."
          />
        </div>

        {/* Modified Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <Plus className="w-3.5 h-3.5" />
              Modified Text (After)
            </span>
            <button
              onClick={() => {
                setModifiedText('');
                playSound('tap');
              }}
              className="text-[11px] text-slate-400 hover:text-emerald-500"
            >
              Clear
            </button>
          </div>
          <textarea
            value={modifiedText}
            onChange={(e) => setModifiedText(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition-all resize-none selection:bg-emerald-500/30"
            placeholder="Paste revised or edited text here..."
          />
        </div>
      </div>

      {/* Visual Diff Output Canvas */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-white/80">
          <span className="flex items-center gap-1.5">
            <FileCode className="w-4 h-4 text-cyan-500" />
            Visual Diff Comparison ({viewMode === 'split' ? 'Side-by-Side Dual Pane' : 'Unified Stream'})
          </span>
          <span className="text-[11px] text-slate-400">
            {diffResult.lines.length} evaluated lines
          </span>
        </div>

        {viewMode === 'split' ? (
          /* Split View Layout */
          <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-950 overflow-hidden shadow-xl text-xs font-mono">
            {/* Header Columns */}
            <div className="grid grid-cols-2 bg-slate-900/90 text-slate-400 border-b border-white/10 text-[11px] font-bold py-2 px-4">
              <div>Original Document</div>
              <div>Modified Document</div>
            </div>
            <div className="divide-y divide-white/5 max-h-[420px] overflow-y-auto">
              {diffResult.lines.map((line, idx) => {
                const isAdd = line.type === 'added';
                const isRem = line.type === 'removed';
                const isUnchanged = line.type === 'unchanged';

                return (
                  <div key={idx} className="grid grid-cols-2 text-xs leading-relaxed">
                    {/* Left Pane (Original) */}
                    <div className={`p-1.5 px-3 border-r border-white/5 flex items-start gap-2 ${
                      isRem ? 'bg-rose-950/60 text-rose-200' : isAdd ? 'bg-slate-950/40 text-transparent select-none' : 'text-slate-300'
                    }`}>
                      <span className="w-6 shrink-0 text-slate-600 select-none text-[10px] text-right font-mono">
                        {line.leftLineNum || ''}
                      </span>
                      <span className="w-3 shrink-0 select-none font-bold">
                        {isRem ? '-' : ''}
                      </span>
                      <span className="break-all whitespace-pre-wrap">{line.leftLine || ''}</span>
                    </div>

                    {/* Right Pane (Modified) */}
                    <div className={`p-1.5 px-3 flex items-start gap-2 ${
                      isAdd ? 'bg-emerald-950/60 text-emerald-200' : isRem ? 'bg-slate-950/40 text-transparent select-none' : 'text-slate-300'
                    }`}>
                      <span className="w-6 shrink-0 text-slate-600 select-none text-[10px] text-right font-mono">
                        {line.rightLineNum || ''}
                      </span>
                      <span className="w-3 shrink-0 select-none font-bold">
                        {isAdd ? '+' : ''}
                      </span>
                      <span className="break-all whitespace-pre-wrap">{line.rightLine || ''}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Unified View Layout */
          <div className="rounded-3xl border border-slate-300 dark:border-white/10 bg-slate-950 overflow-hidden shadow-xl text-xs font-mono divide-y divide-white/5 max-h-[420px] overflow-y-auto">
            {diffResult.lines.map((line, idx) => {
              const isAdd = line.type === 'added';
              const isRem = line.type === 'removed';

              return (
                <div
                  key={idx}
                  className={`p-1.5 px-4 flex items-start gap-3 leading-relaxed ${
                    isAdd
                      ? 'bg-emerald-950/70 text-emerald-200'
                      : isRem
                      ? 'bg-rose-950/70 text-rose-200'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] font-mono text-right">
                    {line.leftLineNum || line.rightLineNum || ''}
                  </span>
                  <span className="w-4 shrink-0 font-bold select-none text-center">
                    {isAdd ? '+' : isRem ? '-' : ' '}
                  </span>
                  <span className="break-all whitespace-pre-wrap">
                    {isAdd ? line.rightLine : line.leftLine}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
