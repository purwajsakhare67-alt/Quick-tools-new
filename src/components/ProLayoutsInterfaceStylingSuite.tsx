import React, { useState } from 'react';
import { 
  Layers, 
  FileText, 
  GitCompare, 
  Monitor, 
  Palette, 
  FileCode, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Cpu, 
  Layout
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalLoremIpsumGenerator } from './tools/UniversalLoremIpsumGenerator';
import { UniversalVisualDiffChecker } from './tools/UniversalVisualDiffChecker';
import { UniversalResolutionMonitor } from './tools/UniversalResolutionMonitor';
import { UniversalBoxShadowGradientStudio } from './tools/UniversalBoxShadowGradientStudio';
import { UniversalMarkdownHtmlConverter } from './tools/UniversalMarkdownHtmlConverter';

interface ProLayoutsInterfaceStylingSuiteProps {
  initialTool?: 'lorem_generator' | 'side_diff_checker' | 'resolution_monitor' | 'box_shadow_gradient' | 'markdown_html';
  defaultExpanded?: boolean;
}

export const ProLayoutsInterfaceStylingSuite: React.FC<ProLayoutsInterfaceStylingSuiteProps> = ({
  initialTool = 'lorem_generator',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'lorem_generator' | 'side_diff_checker' | 'resolution_monitor' | 'box_shadow_gradient' | 'markdown_html'>(initialTool);

  const tools = [
    {
      id: 'lorem_generator',
      name: 'Advanced Lorem Ipsum & Placeholder Text Generator',
      shortName: 'Lorem Ipsum Generator',
      icon: FileText,
      tagline: 'Dynamic browser dictionary compilation, HTML tags & multi-flavor text units',
      badge: 'Design Utility',
      accent: 'from-violet-500 to-purple-600'
    },
    {
      id: 'side_diff_checker',
      name: 'Side-by-Side Visual Diff Checker & Text Comparison',
      shortName: 'Visual Diff Checker',
      icon: GitCompare,
      tagline: 'Native array split diffing, dual side-by-side panes & inline additions/deletions',
      badge: 'Developer Utility',
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'resolution_monitor',
      name: 'Live Display Resolution & Aspect Ratio Monitor',
      shortName: 'Resolution & Aspect Monitor',
      icon: Monitor,
      tagline: 'Window.screen system attributes, real-time resize listener & DPI wireframe canvas',
      badge: 'Daily Tech',
      accent: 'from-amber-500 to-orange-600'
    },
    {
      id: 'box_shadow_gradient',
      name: 'Visual CSS Box-Shadow & Linear Gradient Studio',
      shortName: 'Shadow & Gradient Studio',
      icon: Palette,
      tagline: 'Interactive offset/spread sliders, multi-angle linear/radial gradients & raw CSS',
      badge: 'Designer',
      accent: 'from-pink-500 to-rose-600'
    },
    {
      id: 'markdown_html',
      name: 'Instant Markdown to Clean HTML Converter',
      shortName: 'Markdown to HTML',
      icon: FileCode,
      tagline: 'Pure client-side regex replacement parser with dual live preview & code export',
      badge: 'Productivity',
      accent: 'from-teal-500 to-emerald-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="pro-layouts-interface-styling-suite" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-indigo-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-500 via-pink-500 to-amber-500 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Layout className="w-6 h-6 text-pink-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white reading:text-[#3d2e24]">
                Pro Layouts & Interface Styling Engine
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-violet-500/20 to-pink-500/20 text-violet-700 dark:text-pink-300 border border-violet-500/30">
                <Cpu className="w-3 h-3 text-pink-400" />
                100% In-Browser Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 reading:text-[#6a5546]">
              Real-time design & DOM tools • Pure vanilla JavaScript string engines • HTML5 window specifications
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-500/20 scrollbar-track-transparent">
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
                      ? `bg-gradient-to-r ${tool.accent} text-white shadow-lg shadow-indigo-500/20 border-transparent scale-[1.02]`
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
          <div className="p-3 rounded-2xl bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-transparent border border-violet-500/10 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
              <span>{currentTool.tagline}</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 dark:text-violet-300 hidden md:inline">
              Instant Client Compute
            </span>
          </div>

          {/* Render Active Tool Panel */}
          <div className="p-1 sm:p-2">
            {activeTab === 'lorem_generator' && <UniversalLoremIpsumGenerator />}
            {activeTab === 'side_diff_checker' && <UniversalVisualDiffChecker />}
            {activeTab === 'resolution_monitor' && <UniversalResolutionMonitor />}
            {activeTab === 'box_shadow_gradient' && <UniversalBoxShadowGradientStudio />}
            {activeTab === 'markdown_html' && <UniversalMarkdownHtmlConverter />}
          </div>
        </div>
      )}
    </section>
  );
};
