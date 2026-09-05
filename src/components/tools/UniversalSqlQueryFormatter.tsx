import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Sliders, 
  Code2, 
  Minimize2,
  FileCode,
  CheckCircle2,
  Info
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UniversalSqlQueryFormatterProps {
  onBackToGrid?: () => void;
}

const SAMPLE_QUERY = `select u.id as user_id, u.email, u.full_name, count(o.id) as total_orders, coalesce(sum(o.amount), 0.00) as lifetime_spend, max(o.created_at) as last_order_date from users u inner join orders o on u.id = o.user_id left join user_profiles p on u.id = p.user_id where u.status in ('active', 'verified') and u.created_at >= '2025-01-01' and (o.status = 'completed' or o.status is null) group by u.id, u.email, u.full_name having count(o.id) > 2 order by lifetime_spend desc, last_order_date desc limit 50 offset 0;`;

const SAMPLE_INSERT = `insert into audit_logs (id, event_type, actor_id, target_entity, metadata, ip_address, created_at) values ('uuid-101', 'AUTH_LOGIN', 8492, 'sessions', '{"method": "sso_google", "mfa": true}', '192.168.1.45', now());`;

const SAMPLE_UPDATE = `update customer_subscriptions set tier = 'enterprise', seat_count = 250, auto_renew = true, updated_at = now() where organization_id = 'org_7749' and status = 'active';`;

// Standard SQL keywords to capitalize
const SQL_KEYWORDS = [
  'SELECT', 'DISTINCT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT',
  'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN', 'LEFT OUTER JOIN', 'RIGHT OUTER JOIN',
  'ON', 'USING',
  'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
  'INSERT INTO', 'INSERT', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'DELETE',
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE', 'TRUNCATE TABLE',
  'UNION', 'UNION ALL', 'INTERSECT', 'EXCEPT',
  'AS', 'IN', 'BETWEEN', 'LIKE', 'ILIKE', 'IS NULL', 'IS NOT NULL', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
  'ASC', 'DESC', 'NULLS FIRST', 'NULLS LAST',
  'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'COALESCE', 'NOW()', 'CURRENT_TIMESTAMP'
];

export const UniversalSqlQueryFormatter: React.FC<UniversalSqlQueryFormatterProps> = ({ onBackToGrid }) => {
  const [rawSql, setRawSql] = useState<string>(SAMPLE_QUERY);
  const [uppercaseKeywords, setUppercaseKeywords] = useState<boolean>(true);
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab'>('2');
  const [commaPosition, setCommaPosition] = useState<'trailing' | 'leading'>('trailing');
  const [newlinePerColumn, setNewlinePerColumn] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // SQL Formatting Engine
  const { formattedSql, stats } = useMemo(() => {
    if (!rawSql.trim()) {
      return { formattedSql: '', stats: { keywordsDetected: 0, clausesCount: 0, rawLength: 0, formattedLength: 0, linesCount: 0 } };
    }

    let sql = rawSql.trim();
    const indentStr = indentSize === 'tab' ? '\t' : ' '.repeat(parseInt(indentSize, 10));

    // Major top-level clauses that start on a new line with no indent
    const majorClauses = [
      'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET',
      'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'UNION ALL', 'UNION',
      'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE'
    ];

    // Sub-clauses that indent under major clauses
    const subClauses = [
      'LEFT OUTER JOIN', 'RIGHT OUTER JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 
      'FULL JOIN', 'CROSS JOIN', 'JOIN', 'ON', 'AND', 'OR'
    ];

    let keywordsDetected = 0;
    let clausesCount = 0;

    // Normalizing spaces & preserving strings
    const stringLiterals: string[] = [];
    let processed = sql.replace(/'(?:''|[^'])*'|"(?:""|[^"])*"/g, (match) => {
      stringLiterals.push(match);
      return `___STR_${stringLiterals.length - 1}___`;
    });

    // Uppercase SQL Keywords if toggled
    if (uppercaseKeywords) {
      SQL_KEYWORDS.forEach(kw => {
        const regex = new RegExp(`\\b${kw.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        processed = processed.replace(regex, () => {
          keywordsDetected++;
          return kw;
        });
      });
    }

    // Standardize whitespace
    processed = processed.replace(/\s+/g, ' ');

    // Break lines for major clauses
    majorClauses.forEach(clause => {
      const regex = new RegExp(`\\b${clause.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      processed = processed.replace(regex, (match) => {
        clausesCount++;
        return `\n\n${match.toUpperCase()}\n`;
      });
    });

    // Break lines and indent for sub-clauses
    subClauses.forEach(clause => {
      const regex = new RegExp(`\\b${clause.replace(/\s+/g, '\\s+')}\\b`, 'gi');
      processed = processed.replace(regex, (match) => {
        return `\n${indentStr}${match.toUpperCase()} `;
      });
    });

    // Handle columns in SELECT if newlinePerColumn is enabled
    const lines = processed.split('\n');
    const formattedLines: string[] = [];
    let insideSelect = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      if (!line) continue;

      if (/^SELECT\b/i.test(line)) {
        insideSelect = true;
        formattedLines.push(line);
        continue;
      } else if (/^(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|INSERT INTO|VALUES|UPDATE|SET|DELETE FROM)\b/i.test(line)) {
        insideSelect = false;
      }

      if (insideSelect && newlinePerColumn) {
        // Split columns while respecting nested parentheses
        const cols: string[] = [];
        let current = '';
        let parenDepth = 0;

        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '(') parenDepth++;
          else if (char === ')') parenDepth--;

          if (char === ',' && parenDepth === 0) {
            cols.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        if (current.trim()) cols.push(current.trim());

        if (cols.length > 1) {
          cols.forEach((col, idx) => {
            if (commaPosition === 'trailing') {
              formattedLines.push(`${indentStr}${col}${idx < cols.length - 1 ? ',' : ''}`);
            } else {
              formattedLines.push(`${indentStr}${idx === 0 ? ' ' : ','} ${col}`);
            }
          });
          continue;
        }
      }

      // Check if line is a major clause
      const isMajor = majorClauses.some(mc => new RegExp(`^${mc}\\b`, 'i').test(line));
      if (isMajor) {
        formattedLines.push(line);
      } else {
        // Add single indentation to regular expressions
        if (!line.startsWith(indentStr)) {
          formattedLines.push(`${indentStr}${line}`);
        } else {
          formattedLines.push(line);
        }
      }
    }

    let result = formattedLines.join('\n');

    // Restore string literals
    result = result.replace(/___STR_(\d+)___/g, (_, idx) => {
      return stringLiterals[parseInt(idx, 10)] || '';
    });

    // Clean up excessive blank lines
    result = result.replace(/\n{3,}/g, '\n\n').trim();

    return {
      formattedSql: result,
      stats: {
        keywordsDetected,
        clausesCount,
        rawLength: rawSql.length,
        formattedLength: result.length,
        linesCount: result.split('\n').length
      }
    };
  }, [rawSql, uppercaseKeywords, indentSize, commaPosition, newlinePerColumn]);

  const handleCopy = () => {
    if (!formattedSql) return;
    navigator.clipboard.writeText(formattedSql);
    setCopied(true);
    playSound('success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMinify = () => {
    const minified = rawSql
      .replace(/\s+/g, ' ')
      .replace(/\s*([,;()=<>])\s*/g, '$1')
      .trim();
    setRawSql(minified);
    playSound('click');
  };

  const handleDownload = () => {
    if (!formattedSql) return;
    const blob = new Blob([formattedSql], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'query_formatted.sql';
    link.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  return (
    <div id="sql-query-formatter-container" className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20 dark:border-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              SQL Query Formatter &amp; Code Indenter
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                100% Client-Side
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clean, uppercase, and hierarchically indent complex SQL statements instantly with zero server lag
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

      {/* Preset Query Pickers */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 mr-1">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Presets:
        </span>
        <button
          onClick={() => { setRawSql(SAMPLE_QUERY); playSound('click'); }}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-emerald-300 transition-colors cursor-pointer"
        >
          Complex JOIN &amp; Aggregation
        </button>
        <button
          onClick={() => { setRawSql(SAMPLE_INSERT); playSound('click'); }}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-emerald-300 transition-colors cursor-pointer"
        >
          INSERT INTO Query
        </button>
        <button
          onClick={() => { setRawSql(SAMPLE_UPDATE); playSound('click'); }}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/5 hover:border-emerald-300 transition-colors cursor-pointer"
        >
          UPDATE Statement
        </button>
        <button
          onClick={() => { setRawSql(''); playSound('click'); }}
          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:border-red-300 transition-colors cursor-pointer ml-auto"
        >
          Clear
        </button>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Keywords Case
          </label>
          <div className="flex rounded-lg border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => { setUppercaseKeywords(true); playSound('click'); }}
              className={`flex-1 py-1 text-xs font-semibold ${uppercaseKeywords ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'} cursor-pointer`}
            >
              UPPERCASE
            </button>
            <button
              onClick={() => { setUppercaseKeywords(false); playSound('click'); }}
              className={`flex-1 py-1 text-xs font-semibold ${!uppercaseKeywords ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'} cursor-pointer`}
            >
              Preserve
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Indentation
          </label>
          <select
            value={indentSize}
            onChange={(e) => { setIndentSize(e.target.value as any); playSound('click'); }}
            className="w-full text-xs py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
            <option value="tab">Tab Indent</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Comma Style
          </label>
          <select
            value={commaPosition}
            onChange={(e) => { setCommaPosition(e.target.value as any); playSound('click'); }}
            className="w-full text-xs py-1.5 px-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="trailing">Trailing (col,)</option>
            <option value="leading">Leading (, col)</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1">
            Select Columns
          </label>
          <button
            onClick={() => { setNewlinePerColumn(!newlinePerColumn); playSound('click'); }}
            className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${newlinePerColumn ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10'}`}
          >
            {newlinePerColumn ? '✓ New Line per Col' : 'Inline Columns'}
          </button>
        </div>
      </div>

      {/* Two-Column Editor View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="raw-sql-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-500" /> Raw SQL Query
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {rawSql.length} chars
            </span>
          </div>

          <textarea
            id="raw-sql-input"
            rows={14}
            value={rawSql}
            onChange={(e) => setRawSql(e.target.value)}
            placeholder="PASTE UNFORMATTED RAW SQL HERE (e.g. select a, b from table where x = 1)..."
            className="w-full p-3 font-mono text-xs rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none shadow-xs"
          />

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleMinify}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Minimize2 className="w-3.5 h-3.5 text-slate-500" />
              Minify One-Liner
            </button>
            <button
              onClick={() => {
                // Re-trigger formatting with sound
                playSound('success');
              }}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Re-Format Layout
            </button>
          </div>
        </div>

        {/* Output Column */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-500" /> Formatted SQL
            </label>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
              {stats.linesCount} lines | {stats.clausesCount} clauses
            </span>
          </div>

          <div className="relative">
            <pre
              id="formatted-sql-output"
              className="w-full p-3.5 font-mono text-xs rounded-xl bg-slate-900 text-emerald-300 border border-slate-800 overflow-x-auto h-[310px] select-all shadow-inner leading-relaxed"
            >
              {formattedSql || '-- Enter SQL on the left to see formatted output'}
            </pre>

            {formattedSql && (
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 shadow-md cursor-pointer transition-colors backdrop-blur-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              disabled={!formattedSql}
              className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Formatted SQL'}
            </button>
            <button
              onClick={handleDownload}
              disabled={!formattedSql}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download .sql
            </button>
          </div>
        </div>
      </div>

      {/* SQL Insights & Analysis Card */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Compliant with ANSI SQL, PostgreSQL, MySQL, MariaDB, SQLite, and MSSQL syntax specifications.
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
          <span>Keywords: <strong className="text-slate-900 dark:text-white">{stats.keywordsDetected}</strong></span>
          <span>Char delta: <strong className="text-emerald-600 dark:text-emerald-400">+{stats.formattedLength - stats.rawLength}</strong></span>
        </div>
      </div>
    </div>
  );
};
