import React, { useState } from 'react';
import { 
  FileCode, 
  Terminal, 
  FileText, 
  Scissors, 
  Binary, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Cpu,
  Code2
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalJsonValidatorLinter } from './tools/UniversalJsonValidatorLinter';
import { UniversalAsciiArtGenerator } from './tools/UniversalAsciiArtGenerator';
import { UniversalWordReadingAnalytics } from './tools/UniversalWordReadingAnalytics';
import { UniversalCssMinifierOptimizer } from './tools/UniversalCssMinifierOptimizer';
import { UniversalCryptoRandomGenerator } from './tools/UniversalCryptoRandomGenerator';

interface SmartTextWizardsDeveloperSyntaxHubProps {
  initialTool?: 'json_validator_linter' | 'ascii_art_generator' | 'word_reading_analytics' | 'css_minifier_optimizer' | 'crypto_random_generator';
  defaultExpanded?: boolean;
}

export const SmartTextWizardsDeveloperSyntaxHub: React.FC<SmartTextWizardsDeveloperSyntaxHubProps> = ({
  initialTool = 'json_validator_linter',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'json_validator_linter' | 'ascii_art_generator' | 'word_reading_analytics' | 'css_minifier_optimizer' | 'crypto_random_generator'>(initialTool);

  const tools = [
    {
      id: 'json_validator_linter',
      name: 'Real-Time JSON Validator & Formatter Linter',
      shortName: 'JSON Linter & Tree',
      icon: FileCode,
      tagline: 'Native JSON.parse browser error isolation, line array syntax highlighting & beauty indentation',
      badge: 'Developer Utility',
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'ascii_art_generator',
      name: 'ASCII Text Art Banner Generator',
      shortName: 'ASCII Text Art',
      icon: Terminal,
      tagline: 'Matrix character dictionaries in memory for retro digital terminal banners & social headlines',
      badge: 'Creative Utility',
      accent: 'from-purple-500 to-pink-600'
    },
    {
      id: 'word_reading_analytics',
      name: 'Live Comprehensive Word Counter & Reading Time Analytics',
      shortName: 'Word & Reading Analytics',
      icon: FileText,
      tagline: 'Keystroke monitoring, line count, speech duration & Flesch readability metrics in real-time',
      badge: 'Writer Utility',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'css_minifier_optimizer',
      name: 'CSS Minifier & Code Optimization Dashboard',
      shortName: 'CSS Minifier & Optimizer',
      icon: Scissors,
      tagline: 'JavaScript regex search arrays to strip unnecessary spaces, comments, and carriage return symbols',
      badge: 'Web Performance',
      accent: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'crypto_random_generator',
      name: 'True Cryptographic Random Number & Array Generator',
      shortName: 'True Crypto Randomizer',
      icon: Binary,
      tagline: 'Mathematical CSPRNG randomization calls (crypto.getRandomValues) with non-repeating unique rules',
      badge: 'Utility Canvas',
      accent: 'from-teal-500 to-cyan-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="smart-text-wizards-developer-syntax-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-cyan-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-purple-500 to-emerald-500 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Code2 className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white reading:text-[#3d2e24]">
                Smart Text Wizards & Developer Syntax Hub
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                <Cpu className="w-3 h-3 text-cyan-400" />
                100% Client-Side Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 reading:text-[#6a5546]">
              Internal browser execution scopes • Sub-second computational delivery • Zero server dependencies
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
          <span>{isExpanded ? 'Collapse Hub' : 'Expand Hub'}</span>
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
          <div className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-transparent border border-cyan-500/10 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{currentTool.tagline}</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 hidden md:inline font-mono">
              Zero Backend Overhead
            </span>
          </div>

          {/* Render Active Tool Panel */}
          <div className="p-1 sm:p-2">
            {activeTab === 'json_validator_linter' && <UniversalJsonValidatorLinter />}
            {activeTab === 'ascii_art_generator' && <UniversalAsciiArtGenerator />}
            {activeTab === 'word_reading_analytics' && <UniversalWordReadingAnalytics />}
            {activeTab === 'css_minifier_optimizer' && <UniversalCssMinifierOptimizer />}
            {activeTab === 'crypto_random_generator' && <UniversalCryptoRandomGenerator />}
          </div>
        </div>
      )}
    </section>
  );
};
