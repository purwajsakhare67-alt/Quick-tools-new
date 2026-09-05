import React, { useState } from 'react';
import { 
  Database, 
  Link2, 
  Lock, 
  Calculator, 
  Key, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalSqlQueryFormatter } from './tools/UniversalSqlQueryFormatter';
import { UniversalSeoSlugConverter } from './tools/UniversalSeoSlugConverter';
import { UniversalJsObfuscator } from './tools/UniversalJsObfuscator';
import { UniversalRomanNumeralsConverter } from './tools/UniversalRomanNumeralsConverter';
import { UniversalBulkUuidGenerator } from './tools/UniversalBulkUuidGenerator';

interface AdvancedSqlObfuscationHubProps {
  initialTool?: 'sql_query_formatter' | 'seo_slug_converter' | 'javascript_obfuscator' | 'roman_numerals_converter' | 'bulk_uuid_generator';
  defaultExpanded?: boolean;
}

export const AdvancedSqlObfuscationHub: React.FC<AdvancedSqlObfuscationHubProps> = ({
  initialTool = 'sql_query_formatter',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'sql_query_formatter' | 'seo_slug_converter' | 'javascript_obfuscator' | 'roman_numerals_converter' | 'bulk_uuid_generator'>(initialTool);

  const tools = [
    {
      id: 'sql_query_formatter',
      name: 'SQL Query Formatter & Code Indenter',
      shortName: 'SQL Formatter',
      icon: Database,
      tagline: 'Uppercase SQL syntax statements and add proper nested indentation lines natively in browser RAM',
      badge: 'Database Utility',
      accent: 'from-emerald-600 via-teal-500 to-cyan-500'
    },
    {
      id: 'seo_slug_converter',
      name: 'Instant SEO URL Slug Converter',
      shortName: 'SEO Slug Converter',
      icon: Link2,
      tagline: 'Scrub alphanumeric characters, lowercase text, and replace whitespace with hyphen characters natively',
      badge: 'Productivity Utility',
      accent: 'from-sky-500 via-blue-500 to-indigo-600'
    },
    {
      id: 'javascript_obfuscator',
      name: 'Client-Side JavaScript Obfuscator Code Scrambler',
      shortName: 'JS Code Scrambler',
      icon: Lock,
      tagline: 'Execute Base-64 masking array adjustments and variable renaming loops inside the browser context',
      badge: 'Developer Utility',
      accent: 'from-purple-600 via-violet-500 to-indigo-600'
    },
    {
      id: 'roman_numerals_converter',
      name: 'Dynamic Roman Numerals Forward/Reverse Converter',
      shortName: 'Roman Numerals',
      icon: Calculator,
      tagline: 'Calculate values matching standard international numeric mathematical matrix properties recursively',
      badge: 'Academic Utility',
      accent: 'from-amber-600 via-orange-500 to-yellow-500'
    },
    {
      id: 'bulk_uuid_generator',
      name: 'Cryptographic Bulk UUID / GUID Generator',
      shortName: 'Bulk UUID / GUID',
      icon: Key,
      tagline: 'Iterate cryptographic string arrays using crypto.randomUUID browser algorithms programmatically',
      badge: 'System Admin Utility',
      accent: 'from-rose-500 via-pink-500 to-purple-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="advanced-sql-obfuscation-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-emerald-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-purple-600 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex items-center justify-center text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Advanced SQL Logic &amp; Code Obfuscation Hub
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-3 h-3" />
                Zero Host Bills • 100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              High-throughput client-side SQL code indenters, URL slug generators, Base-64 JS obfuscators, Roman numeral matrix solvers &amp; cryptographic bulk UUID factories.
            </p>
          </div>
        </div>

        {/* Toggle Expand/Collapse */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              playSound('tap');
              setIsExpanded(!isExpanded);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-white/80 transition-colors cursor-pointer"
            id="advanced-sql-obfuscation-toggle-btn"
          >
            <span>{isExpanded ? 'Collapse Suite' : 'Expand Suite (5 Tools)'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Tab Selector & Tool Rendering */}
      {isExpanded && (
        <div className="space-y-6">
          {/* 5 Tab Navigation Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {tools.map((tool) => {
              const IconComp = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    playSound('tap');
                    setActiveTab(tool.id as any);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[90px] ${
                    isActive
                      ? 'bg-white dark:bg-white/[0.08] border-emerald-500/50 shadow-md shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                      : 'bg-white/40 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.04]'
                  }`}
                  id={`tab-sql-obfuscation-${tool.id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${tool.accent} flex items-center justify-center text-white shadow-xs`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/50">
                      {tool.badge}
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold mt-2 truncate ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white/80'}`}>
                      {tool.shortName}
                    </h4>
                    <p className="text-[10px] text-slate-400 dark:text-white/40 truncate">
                      {tool.name}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tool Workspace Display */}
          <div className="pt-2">
            {activeTab === 'sql_query_formatter' && <UniversalSqlQueryFormatter />}
            {activeTab === 'seo_slug_converter' && <UniversalSeoSlugConverter />}
            {activeTab === 'javascript_obfuscator' && <UniversalJsObfuscator />}
            {activeTab === 'roman_numerals_converter' && <UniversalRomanNumeralsConverter />}
            {activeTab === 'bulk_uuid_generator' && <UniversalBulkUuidGenerator />}
          </div>
        </div>
      )}
    </section>
  );
};
