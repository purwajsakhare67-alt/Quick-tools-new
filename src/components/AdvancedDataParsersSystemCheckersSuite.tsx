import React, { useState } from 'react';
import { 
  Cpu, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Terminal, 
  Lock, 
  FileSpreadsheet, 
  Scissors, 
  Clock, 
  ShieldCheck,
  Binary
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalUserAgentInspector } from './tools/UniversalUserAgentInspector';
import { UniversalClientHashEngine } from './tools/UniversalClientHashEngine';
import { UniversalJsonCsvFlatteningMatrix } from './tools/UniversalJsonCsvFlatteningMatrix';
import { UniversalHtmlTextStripper } from './tools/UniversalHtmlTextStripper';
import { UniversalUnixTimestampStudio } from './tools/UniversalUnixTimestampStudio';

interface AdvancedDataParsersSystemCheckersSuiteProps {
  initialTool?: 'user_agent_inspector' | 'client_hash_engine' | 'json_csv_flatten' | 'html_text_stripper' | 'timestamp_studio';
  defaultExpanded?: boolean;
}

export const AdvancedDataParsersSystemCheckersSuite: React.FC<AdvancedDataParsersSystemCheckersSuiteProps> = ({
  initialTool = 'user_agent_inspector',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'user_agent_inspector' | 'client_hash_engine' | 'json_csv_flatten' | 'html_text_stripper' | 'timestamp_studio'>(initialTool);

  const tools = [
    {
      id: 'user_agent_inspector',
      name: 'Real-Time User Agent Extractor & Browser Inspector',
      shortName: 'User Agent Inspector',
      icon: Terminal,
      tagline: 'Access navigator.userAgent runtime specifications, OS & hardware architecture telemetry',
      badge: 'Tech Utility',
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'client_hash_engine',
      name: 'Client-Side Hash Engine - SHA-256, SHA-1 & MD5',
      shortName: 'Client Hash Engine',
      icon: Lock,
      tagline: 'Native WebCrypto API (crypto.subtle.digest) & RFC 1321 MD5 with local file-drop reader',
      badge: 'Security Utility',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'json_csv_flatten',
      name: 'Complex JSON to CSV Flattening Matrix',
      shortName: 'JSON to CSV Matrix',
      icon: FileSpreadsheet,
      tagline: 'Recursive deep nested array parsing loop, RFC 4180 delimiter escaping & .csv download',
      badge: 'Developer Utility',
      accent: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'html_text_stripper',
      name: 'Pure Text Stripper & HTML Tag Remover',
      shortName: 'HTML Text Stripper',
      icon: Scissors,
      tagline: 'Clean DOMParser syntax purging, HTML entities decoding & zero-loss character extraction',
      badge: 'Productivity',
      accent: 'from-amber-500 to-orange-600'
    },
    {
      id: 'timestamp_studio',
      name: 'Unix Epoch Timestamp Convert & Parse Studio',
      shortName: 'Unix Timestamp Studio',
      icon: Clock,
      tagline: 'Bidirectional seconds/ms epoch converter, UTC & local timezone matrix with live ticking clock',
      badge: 'Database Utility',
      accent: 'from-purple-500 to-indigo-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="advanced-data-parsers-system-checkers-suite" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-cyan-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-purple-600 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Binary className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white reading:text-[#3d2e24]">
                Advanced Data Parsers & System Checkers
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                <Cpu className="w-3 h-3 text-emerald-400" />
                100% In-Browser Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 reading:text-[#6a5546]">
              Sub-second computational delivery • Zero server dependencies • WebCrypto & native DOM parsing
            </p>
          </div>
        </div>

        {/* Expand / Collapse Control */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            playSound('tap');
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white text-xs font-bold transition-colors cursor-pointer self-end sm:self-auto"
        >
          <span>{isExpanded ? 'Collapse Suite' : 'Expand Suite'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sleek Tab Navigation Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id as any);
                    playSound('tap');
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 border ${
                    isActive
                      ? `bg-gradient-to-r ${tool.accent} text-white shadow-lg shadow-cyan-500/20 border-transparent scale-[1.02]`
                      : 'bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-white/70 hover:bg-slate-200 dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tool.shortName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${
                    isActive ? 'bg-black/20 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-white/50'
                  }`}>
                    {tool.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tool Tagline Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-transparent border border-cyan-500/10 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{currentTool.tagline}</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 hidden md:inline">
              Instant Client Compute
            </span>
          </div>

          {/* Render Active Tool Panel */}
          <div className="p-1 sm:p-2">
            {activeTab === 'user_agent_inspector' && <UniversalUserAgentInspector />}
            {activeTab === 'client_hash_engine' && <UniversalClientHashEngine />}
            {activeTab === 'json_csv_flatten' && <UniversalJsonCsvFlatteningMatrix />}
            {activeTab === 'html_text_stripper' && <UniversalHtmlTextStripper />}
            {activeTab === 'timestamp_studio' && <UniversalUnixTimestampStudio />}
          </div>
        </div>
      )}
    </section>
  );
};
