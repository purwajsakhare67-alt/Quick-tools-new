import React, { useState } from 'react';
import { 
  BarChart3, 
  Volume2, 
  Code, 
  ShieldCheck, 
  Link2, 
  GraduationCap, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Sparkles,
  Lock,
  Cpu
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalBpmDelayCalculator } from './tools/UniversalBpmDelayCalculator';
import { UniversalRegexVisualizer } from './tools/UniversalRegexVisualizer';
import { UniversalPasswordStrengthAnalyzer } from './tools/UniversalPasswordStrengthAnalyzer';
import { UniversalUtmLinkBuilder } from './tools/UniversalUtmLinkBuilder';
import { UniversalCitationFormatter } from './tools/UniversalCitationFormatter';

interface AnalyticsMarketingSuiteProps {
  initialTool?: 'bpm' | 'regex' | 'password' | 'utm' | 'citation';
  defaultExpanded?: boolean;
}

export const AnalyticsMarketingSuite: React.FC<AnalyticsMarketingSuiteProps> = ({ 
  initialTool = 'bpm',
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'bpm' | 'regex' | 'password' | 'utm' | 'citation'>(initialTool);

  const tools = [
    {
      id: 'bpm',
      name: 'BPM to MS Delay Calculator',
      shortName: 'BPM Delay Calc',
      icon: Volume2,
      tagline: 'Audio echo delays (ms) & Hertz (Hz) conversion matrix',
      badge: 'Audio Utility',
      accent: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'regex',
      name: 'RegEx Tester & Pattern Visualizer',
      shortName: 'RegEx Visualizer',
      icon: Code,
      tagline: 'Live syntax validation, capture groups & substitution',
      badge: 'Dev Utility',
      accent: 'from-blue-500 to-indigo-500'
    },
    {
      id: 'password',
      name: 'Password Strength & Hack-Time Analyzer',
      shortName: 'Password Analyzer',
      icon: ShieldCheck,
      tagline: 'Shannon entropy & GPU brute-force crack time matrix',
      badge: 'Security Utility',
      accent: 'from-rose-500 to-amber-500'
    },
    {
      id: 'utm',
      name: 'UTM Link Builder & Attribute Formatter',
      shortName: 'UTM Builder',
      icon: Link2,
      tagline: 'GA4 campaign URLs with syntax joining & QR generation',
      badge: 'Marketing',
      accent: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'citation',
      name: 'Academic Bibliography & Citation Formatter',
      shortName: 'Citation Formatter',
      icon: GraduationCap,
      tagline: 'APA 7, MLA 9, Harvard & Chicago reference generator',
      badge: 'Academic',
      accent: 'from-purple-500 to-pink-500'
    }
  ];

  const handleToggleExpand = () => {
    playSound('click');
    setIsExpanded(!isExpanded);
  };

  const handleSelectTab = (toolId: typeof activeTab) => {
    playSound('click');
    setActiveTab(toolId);
    if (!isExpanded) setIsExpanded(true);
  };

  return (
    <section 
      id="analytics-marketing-suite" 
      className="relative rounded-3xl border border-slate-300/80 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 mb-8"
    >
      {/* Suite Minimalist Banner Header & Toggle */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-cyan-500/5 via-indigo-500/5 to-purple-500/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Advanced Analytics & Marketing Suite
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                <span>100% Client-Side Pure JS</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
              5 high-converting viral micro-utilities running entirely in the browser with zero backend latency
            </p>
          </div>
        </div>

        {/* Minimalist Toggle Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleToggleExpand}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white border border-slate-300/80 dark:border-white/15 transition-all cursor-pointer shadow-xs"
            id="toggle-analytics-marketing-suite"
          >
            <span>{isExpanded ? 'Collapse Suite' : 'Expand Suite Workspace'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Suite Workspace */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Suite Nav Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-slate-200/80 dark:border-white/10">
            {tools.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTab(t.id as any)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 border ${
                    isActive
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md font-black'
                      : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/10'
                  }`}
                  id={`tab-analytics-${t.id}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.shortName}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-white/20 dark:bg-slate-900/20' : 'bg-slate-200 dark:bg-white/10'
                  }`}>
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tool Viewport */}
          <div className="pt-2">
            {activeTab === 'bpm' && <UniversalBpmDelayCalculator />}
            {activeTab === 'regex' && <UniversalRegexVisualizer />}
            {activeTab === 'password' && <UniversalPasswordStrengthAnalyzer />}
            {activeTab === 'utm' && <UniversalUtmLinkBuilder />}
            {activeTab === 'citation' && <UniversalCitationFormatter />}
          </div>
        </div>
      )}
    </section>
  );
};
