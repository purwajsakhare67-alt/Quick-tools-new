import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileCode, 
  Scissors, 
  Network, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalNumberToWordsConverter } from './tools/UniversalNumberToWordsConverter';
import { UniversalJsonToXmlConverter } from './tools/UniversalJsonToXmlConverter';
import { UniversalHtmlMarkupStripper } from './tools/UniversalHtmlMarkupStripper';
import { UniversalNetworkLocalInfoTracker } from './tools/UniversalNetworkLocalInfoTracker';
import { UniversalLeapYearMatrixCalculator } from './tools/UniversalLeapYearMatrixCalculator';

interface EnterpriseDataParsersHubProps {
  initialTool?: 'number_to_words' | 'json_to_xml' | 'html_markup_stripper' | 'network_local_tracker' | 'leap_year_matrix';
  defaultExpanded?: boolean;
}

export const EnterpriseDataParsersHub: React.FC<EnterpriseDataParsersHubProps> = ({
  initialTool = 'number_to_words',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'number_to_words' | 'json_to_xml' | 'html_markup_stripper' | 'network_local_tracker' | 'leap_year_matrix'>(initialTool);

  const tools = [
    {
      id: 'number_to_words',
      name: 'Real-Time Number to Words Capital Text Converter',
      shortName: 'Number to Words',
      icon: FileSpreadsheet,
      tagline: 'Run standard international linguistic array calculations natively in browser memory to convert digits to words',
      badge: 'Accounting & Financial',
      accent: 'from-emerald-600 via-teal-500 to-cyan-500'
    },
    {
      id: 'json_to_xml',
      name: 'Synchronous JSON to XML Document Structural Converter',
      shortName: 'JSON to XML',
      icon: FileCode,
      tagline: 'Execute recursive parsing cycles natively inside browser RAM to convert key-value nodes into XML',
      badge: 'Developer Canvas',
      accent: 'from-blue-600 via-indigo-500 to-violet-600'
    },
    {
      id: 'html_markup_stripper',
      name: 'HTML Document Markup Stripper & Text Isolate Engine',
      shortName: 'HTML Text Stripper',
      icon: Scissors,
      tagline: 'Execute JavaScript DOMParser nodes string manipulations natively to isolate clean character content',
      badge: 'Productivity Utility',
      accent: 'from-teal-600 via-emerald-500 to-green-600'
    },
    {
      id: 'network_local_tracker',
      name: 'Client-Side User Network Property & Local Info Tracker',
      shortName: 'Network Diagnostics',
      icon: Network,
      tagline: 'Access native window WebRTC connection candidates or local navigator properties to fetch system routing structures',
      badge: 'Network Utility',
      accent: 'from-sky-500 via-cyan-500 to-blue-600'
    },
    {
      id: 'leap_year_matrix',
      name: 'Leap Year Boundary Mathematics & Calendar Matrix',
      shortName: 'Leap Year Matrix',
      icon: Calendar,
      tagline: 'Compute standard astronomical calendar modulo configurations (divisible by 4, 100, and 400 rules)',
      badge: 'Academic Utility',
      accent: 'from-amber-500 via-orange-500 to-red-500'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="enterprise-data-parsers-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-blue-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-teal-500 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex items-center justify-center text-white">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Enterprise Data Parsers &amp; System Core Validators
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Cpu className="w-3 h-3" />
                Zero Host Bills • 100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              High-throughput client-side number-to-words currency formatters, JSON-to-XML recursive tree converters, DOMParser HTML strippers, WebRTC network trackers &amp; astronomical leap year matrix engines.
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
            id="enterprise-data-parsers-toggle-btn"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                <span>Collapse Suite</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                <span>Expand Suite (5 Tools)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-6 animate-fadeIn">
          {/* Tool Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
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
                  id={`tab-${tool.id}`}
                  className={`flex flex-col items-center sm:items-start text-center sm:text-left gap-1.5 p-3 rounded-xl transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md border border-slate-200 dark:border-white/10 scale-[1.02]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full justify-between">
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-transparent text-slate-500'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="hidden xl:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                      Client-Side
                    </span>
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight line-clamp-1">{tool.shortName}</div>
                    <div className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-1 font-medium">{tool.badge}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Tool Sub-Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/10">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Active Utility: <span className="text-blue-600 dark:text-blue-400">{currentTool.name}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {currentTool.tagline}
            </div>
          </div>

          {/* Render Active Component */}
          <div className="pt-2">
            {activeTab === 'number_to_words' && <UniversalNumberToWordsConverter />}
            {activeTab === 'json_to_xml' && <UniversalJsonToXmlConverter />}
            {activeTab === 'html_markup_stripper' && <UniversalHtmlMarkupStripper />}
            {activeTab === 'network_local_tracker' && <UniversalNetworkLocalInfoTracker />}
            {activeTab === 'leap_year_matrix' && <UniversalLeapYearMatrixCalculator />}
          </div>
        </div>
      )}
    </section>
  );
};
