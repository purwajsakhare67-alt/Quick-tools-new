import React, { useState } from 'react';
import { 
  FileCode, 
  Repeat, 
  FileCode2, 
  CalendarDays, 
  Key, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  Layers
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalJsonToYamlConverter } from './tools/UniversalJsonToYamlConverter';
import { UniversalTextEmojiRepeater } from './tools/UniversalTextEmojiRepeater';
import { UniversalHtmlMinifier } from './tools/UniversalHtmlMinifier';
import { UniversalDurationDaysCalculator } from './tools/UniversalDurationDaysCalculator';
import { UniversalBase64ToTextDecoder } from './tools/UniversalBase64ToTextDecoder';

interface AdvancedSyntaxCompressorsDateHubProps {
  initialTool?: 'json_to_yaml' | 'text_emoji_repeater' | 'html_code_minifier' | 'duration_days_calculator' | 'base64_to_text_decoder';
  defaultExpanded?: boolean;
}

export const AdvancedSyntaxCompressorsDateHub: React.FC<AdvancedSyntaxCompressorsDateHubProps> = ({
  initialTool = 'json_to_yaml',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'json_to_yaml' | 'text_emoji_repeater' | 'html_code_minifier' | 'duration_days_calculator' | 'base64_to_text_decoder'>(initialTool);

  const tools = [
    {
      id: 'json_to_yaml',
      name: 'Synchronous JSON to YAML Document Converter',
      shortName: 'JSON → YAML',
      icon: FileCode,
      tagline: 'Parse elements data nodes to transform object notation variables into neat YAML spacing formats',
      badge: 'Developer Utility',
      accent: 'from-emerald-600 via-teal-500 to-cyan-600'
    },
    {
      id: 'text_emoji_repeater',
      name: 'Creative Bulk Text & Emoji Repeater Studio',
      shortName: 'Text & Emoji Repeater',
      icon: Repeat,
      tagline: 'Execute native JavaScript loop array join methods to multiply strings and emojis in browser RAM',
      badge: 'Productivity Utility',
      accent: 'from-orange-500 via-amber-500 to-pink-500'
    },
    {
      id: 'html_code_minifier',
      name: 'Performance HTML Code Minifier & Script Compressor',
      shortName: 'HTML Minifier',
      icon: FileCode2,
      tagline: 'Apply clean regex filter mapping routines natively to erase tag spaces, comments, and carriage return symbols',
      badge: 'SEO Utility',
      accent: 'from-blue-600 via-indigo-600 to-violet-600'
    },
    {
      id: 'duration_days_calculator',
      name: 'Comprehensive Duration & Days Between Dates Calculator',
      shortName: 'Duration & Days Calculator',
      icon: CalendarDays,
      tagline: 'Calculate date milliseconds difference parameters natively within browser local runtime layers',
      badge: 'Time Analytics',
      accent: 'from-teal-600 via-cyan-600 to-blue-600'
    },
    {
      id: 'base64_to_text_decoder',
      name: 'Real-Time Base64 to Text Document Decoder',
      shortName: 'Base64 Decoder',
      icon: Key,
      tagline: 'Process window.atob decoding logic scopes natively to translate safe values into plain character layouts',
      badge: 'Security Utility',
      accent: 'from-purple-600 via-violet-600 to-indigo-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="advanced-syntax-compressors-date-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-teal-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex items-center justify-center text-white">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Advanced Web Syntax Compressors &amp; Date Engine
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                <Cpu className="w-3 h-3" />
                Zero Host Bills • 100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              JSON to YAML serializers, bulk emoji text repeaters, HTML code minifiers, calendar duration calculators &amp; Base64 decoders.
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
            id="advanced-syntax-compressors-date-toggle-btn"
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
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400' : 'bg-transparent text-slate-500'}`}>
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
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Active Utility: <span className="text-teal-600 dark:text-teal-400">{currentTool.name}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {currentTool.tagline}
            </div>
          </div>

          {/* Render Active Component */}
          <div className="pt-2">
            {activeTab === 'json_to_yaml' && <UniversalJsonToYamlConverter />}
            {activeTab === 'text_emoji_repeater' && <UniversalTextEmojiRepeater />}
            {activeTab === 'html_code_minifier' && <UniversalHtmlMinifier />}
            {activeTab === 'duration_days_calculator' && <UniversalDurationDaysCalculator />}
            {activeTab === 'base64_to_text_decoder' && <UniversalBase64ToTextDecoder />}
          </div>
        </div>
      )}
    </section>
  );
};
