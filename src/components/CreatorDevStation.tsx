import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Shapes, 
  Smartphone, 
  Table, 
  Palette, 
  ChevronDown, 
  ChevronUp, 
  Terminal, 
  Layers, 
  Zap, 
  Sliders
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalAiPromptEnhancer } from './tools/UniversalAiPromptEnhancer';
import { UniversalSvgWaveBlob } from './tools/UniversalSvgWaveBlob';
import { UniversalSocialSafeZone } from './tools/UniversalSocialSafeZone';
import { UniversalCsvToMarkdown } from './tools/UniversalCsvToMarkdown';
import { UniversalPaletteExtractor } from './tools/UniversalPaletteExtractor';

interface CreatorDevStationProps {
  initialTool?: 'prompt' | 'wave' | 'safe_zone' | 'csv' | 'palette';
  defaultExpanded?: boolean;
}

export const CreatorDevStation: React.FC<CreatorDevStationProps> = ({ 
  initialTool = 'prompt',
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'prompt' | 'wave' | 'safe_zone' | 'csv' | 'palette'>(initialTool);

  const tools = [
    {
      id: 'prompt',
      name: 'AI Prompt Enhancer',
      shortName: 'Prompt Enhancer',
      icon: Wand2,
      tagline: 'Refine & expand raw ideas into system prompts',
      badge: 'Gemini Engine',
      accent: 'from-violet-500 to-fuchsia-500',
      activeColor: 'text-violet-400 border-violet-500 bg-violet-500/10'
    },
    {
      id: 'wave',
      name: 'SVG Wave & Blob Generator',
      shortName: 'SVG Waves & Blobs',
      icon: Shapes,
      tagline: 'Dynamic Bezier vector graphics & CSS export',
      badge: 'Vector Math',
      accent: 'from-pink-500 to-purple-500',
      activeColor: 'text-pink-400 border-pink-500 bg-pink-500/10'
    },
    {
      id: 'safe_zone',
      name: 'Social Safe-Zone Checker',
      shortName: 'Safe-Zone Checker',
      icon: Smartphone,
      tagline: 'TikTok, Reels & Shorts mobile overlay test',
      badge: 'Mobile Matrix',
      accent: 'from-cyan-500 to-blue-500',
      activeColor: 'text-cyan-400 border-cyan-500 bg-cyan-500/10'
    },
    {
      id: 'csv',
      name: 'CSV to Markdown Converter',
      shortName: 'CSV to Markdown',
      icon: Table,
      tagline: 'GitHub/Notion tables with alignment & padding',
      badge: 'Zero Latency',
      accent: 'from-emerald-500 to-teal-500',
      activeColor: 'text-emerald-400 border-emerald-500 bg-emerald-500/10'
    },
    {
      id: 'palette',
      name: 'Color Palette Extractor',
      shortName: 'Palette Extractor',
      icon: Palette,
      tagline: 'Isolate dominant top 5 HEX & RGB swatches',
      badge: 'HTML5 Canvas',
      accent: 'from-amber-500 to-rose-500',
      activeColor: 'text-amber-400 border-amber-500 bg-amber-500/10'
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
      id="creator-dev-station" 
      className="relative rounded-3xl border border-slate-300/80 dark:border-white/15 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-300 mb-8"
    >
      {/* Station Minimalist Banner Header & Toggle */}
      <div className="p-4 sm:p-6 border-b border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-violet-500/5 via-cyan-500/5 to-emerald-500/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-violet-500/20 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Advanced Creator & Developer Station
              </h2>
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" />
                <span>100% Client-Side Pure JS</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 mt-0.5">
              5 viral micro-utilities engineered with zero hosting latency and instant in-browser computation
            </p>
          </div>
        </div>

        {/* Minimalist Toggle Button */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleToggleExpand}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-700 dark:text-white border border-slate-300/80 dark:border-white/15 transition-all cursor-pointer shadow-xs"
            id="toggle-creator-dev-station"
          >
            <span>{isExpanded ? 'Collapse Station' : 'Expand Station Workspace'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Station Workspace */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* Station Nav Tabs */}
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
                  id={`tab-creator-${t.id}`}
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
            {activeTab === 'prompt' && <UniversalAiPromptEnhancer />}
            {activeTab === 'wave' && <UniversalSvgWaveBlob />}
            {activeTab === 'safe_zone' && <UniversalSocialSafeZone />}
            {activeTab === 'csv' && <UniversalCsvToMarkdown />}
            {activeTab === 'palette' && <UniversalPaletteExtractor />}
          </div>
        </div>
      )}
    </section>
  );
};
