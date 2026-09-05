import React, { useState } from 'react';
import { 
  Binary, 
  FileJson, 
  Code2, 
  Activity, 
  Replace, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Network,
  Cpu
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalTextBinaryConverter } from './tools/UniversalTextBinaryConverter';
import { UniversalJsonKeysSorter } from './tools/UniversalJsonKeysSorter';
import { UniversalHtmlBeautifier } from './tools/UniversalHtmlBeautifier';
import { UniversalLatencyChecker } from './tools/UniversalLatencyChecker';
import { UniversalBulkMultiReplace } from './tools/UniversalBulkMultiReplace';

interface AdvancedWebSyntaxNetworkHubProps {
  initialTool?: 'text_binary_converter' | 'json_keys_sorter' | 'html_beautifier_indenter' | 'latency_stream_checker' | 'bulk_multi_replace';
  defaultExpanded?: boolean;
}

export const AdvancedWebSyntaxNetworkHub: React.FC<AdvancedWebSyntaxNetworkHubProps> = ({
  initialTool = 'text_binary_converter',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'text_binary_converter' | 'json_keys_sorter' | 'html_beautifier_indenter' | 'latency_stream_checker' | 'bulk_multi_replace'>(initialTool);

  const tools = [
    {
      id: 'text_binary_converter',
      name: 'Real-Time Text ⇄ Binary Bitshift Studio',
      shortName: 'Text ⇄ Binary',
      icon: Binary,
      tagline: 'Standard binary bit shift operators natively in browser memory to compile strings values characters',
      badge: 'Dev Utility',
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'json_keys_sorter',
      name: 'JavaScript Object (JSON) Keys Sorter & Alphabetizer',
      shortName: 'JSON Keys Sorter',
      icon: FileJson,
      tagline: 'Recursive JavaScript mapping sort loops natively to arrange keys alphabetically without corrupting arrays',
      badge: 'Data Processing',
      accent: 'from-amber-500 to-orange-600'
    },
    {
      id: 'html_beautifier_indenter',
      name: 'HTML Code Beautifier & Tag Layout Indenter',
      shortName: 'HTML Beautifier',
      icon: Code2,
      tagline: 'Dynamic syntax formatting indent code blocks parsing attributes and opening/closing tag boundaries',
      badge: 'Developer Canvas',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'latency_stream_checker',
      name: 'Client-Side Latency Test & Connection Stream Checker',
      shortName: 'Latency & Stream RTT',
      icon: Activity,
      tagline: 'Programmatically measure round-trip times (RTT) via browser network benchmarks or performance interface timestamps',
      badge: 'Network Utility',
      accent: 'from-sky-500 to-indigo-600'
    },
    {
      id: 'bulk_multi_replace',
      name: 'Bulk String Multi-Replace Text Factory',
      shortName: 'Multi-Replace Text',
      icon: Replace,
      tagline: 'Iterate global split-and-join mapping strings operations natively to adjust character arrays simultaneously',
      badge: 'Data Entry',
      accent: 'from-rose-500 to-pink-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="advanced-web-syntax-network-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-indigo-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-sky-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex items-center justify-center text-white">
              <Network className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Advanced Web Syntax &amp; Network Performance Hub
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">
                <Cpu className="w-3 h-3" />
                Zero Host Bills • 100% In-Browser
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              High-throughput client-side binary bitshifters, recursive JSON alphabetizers, HTML beautifiers, live RTT stream tests &amp; multi-string factories.
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
            id="advanced-syntax-network-toggle-btn"
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
                      ? 'bg-white dark:bg-white/[0.08] border-indigo-500/50 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20'
                      : 'bg-white/40 dark:bg-white/[0.02] border-slate-200/60 dark:border-white/5 hover:bg-white dark:hover:bg-white/[0.04]'
                  }`}
                  id={`tab-syntax-network-${tool.id}`}
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
                    <h4 className={`text-xs font-bold mt-2 truncate ${isActive ? 'text-indigo-600 dark:text-cyan-400' : 'text-slate-800 dark:text-white/80'}`}>
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
            {activeTab === 'text_binary_converter' && <UniversalTextBinaryConverter />}
            {activeTab === 'json_keys_sorter' && <UniversalJsonKeysSorter />}
            {activeTab === 'html_beautifier_indenter' && <UniversalHtmlBeautifier />}
            {activeTab === 'latency_stream_checker' && <UniversalLatencyChecker />}
            {activeTab === 'bulk_multi_replace' && <UniversalBulkMultiReplace />}
          </div>
        </div>
      )}
    </section>
  );
};
