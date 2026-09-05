import React, { useState } from 'react';
import { 
  Link2, 
  Palette, 
  Table, 
  Globe, 
  ListOrdered, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Cpu,
  Network
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalUrlEncoderDecoder } from './tools/UniversalUrlEncoderDecoder';
import { UniversalHexRgbConverter } from './tools/UniversalHexRgbConverter';
import { UniversalHtmlTableGenerator } from './tools/UniversalHtmlTableGenerator';
import { UniversalDnsInspector } from './tools/UniversalDnsInspector';
import { UniversalTextLineSorterStripper } from './tools/UniversalTextLineSorterStripper';

interface CoreWebInfrastructureFormattersHubProps {
  initialTool?: 'url_encoder_decoder' | 'hex_rgb_converter' | 'html_table_generator' | 'dns_inspector' | 'text_line_sorter_stripper';
  defaultExpanded?: boolean;
}

export const CoreWebInfrastructureFormattersHub: React.FC<CoreWebInfrastructureFormattersHubProps> = ({
  initialTool = 'url_encoder_decoder',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'url_encoder_decoder' | 'hex_rgb_converter' | 'html_table_generator' | 'dns_inspector' | 'text_line_sorter_stripper'>(initialTool);

  const tools = [
    {
      id: 'url_encoder_decoder',
      name: 'Real-Time URL Encoder & Decoder',
      shortName: 'URL Encode/Decode',
      icon: Link2,
      tagline: 'Native encodeURIComponent browser processes with live query parameter extractor',
      badge: 'Web Utility',
      accent: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'hex_rgb_converter',
      name: 'Interactive HEX to RGB/RGBA Color Grid',
      shortName: 'HEX to RGB/RGBA',
      icon: Palette,
      tagline: 'Native bitwise color channel parsing in local memory with real-time CSS declarations',
      badge: 'Design Utility',
      accent: 'from-pink-500 to-purple-600'
    },
    {
      id: 'html_table_generator',
      name: 'Visual HTML Grid Table Blueprint Generator',
      shortName: 'HTML Table Blueprint',
      icon: Table,
      tagline: 'Programmatic structural loops constructing compliant HTML5, Tailwind & Markdown tables',
      badge: 'Productivity Utility',
      accent: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'dns_inspector',
      name: 'Client-Side DNS Field & Domain Attribute Inspector',
      shortName: 'DNS Inspector (DoH)',
      icon: Globe,
      tagline: 'Lightweight public DNS-over-HTTPS JSON lookups natively via browser fetch commands',
      badge: 'Networking Utility',
      accent: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'text_line_sorter_stripper',
      name: 'Text Line Count Sorter & Empty Spaces Stripper',
      shortName: 'Line Sorter & Stripper',
      icon: ListOrdered,
      tagline: 'Array split mapping to deduplicate items, erase blank lines, and natural sort strings',
      badge: 'Data Analytics',
      accent: 'from-amber-500 to-orange-600'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="core-web-infrastructure-formatters-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-blue-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Category 7 Micro-Suite
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                Zero Cloud Cost • 100% Client-Side
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Core Web Infrastructure & Code Formatters
            </h2>
          </div>
        </div>

        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            playSound('click');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-xs transition-all cursor-pointer shadow-xs self-end sm:self-auto"
        >
          <span>{isExpanded ? 'Collapse Suite' : 'Expand 5 Micro-Tools'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-6">
          {/* Responsive Tab Bar Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTab === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTab(tool.id as any);
                    playSound('click');
                  }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/20 scale-[1.02]'
                      : 'bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-700 dark:text-white/80 border-slate-200 dark:border-white/5'
                  }`}
                  id={`btn-tab-infra-${tool.id}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                  <span>{tool.shortName}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  }`}>
                    {tool.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Tool Sub-Header Summary */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent border border-blue-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentTool.accent} p-0.5 flex items-center justify-center text-white shadow-xs`}>
                <currentTool.icon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 dark:text-white">
                  {currentTool.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-white/60">
                  {currentTool.tagline}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-blue-500" />
              <span>Native Vanilla V8 Engine</span>
            </div>
          </div>

          {/* Active Tool View Renderer */}
          <div className="pt-2">
            {activeTab === 'url_encoder_decoder' && <UniversalUrlEncoderDecoder />}
            {activeTab === 'hex_rgb_converter' && <UniversalHexRgbConverter />}
            {activeTab === 'html_table_generator' && <UniversalHtmlTableGenerator />}
            {activeTab === 'dns_inspector' && <UniversalDnsInspector />}
            {activeTab === 'text_line_sorter_stripper' && <UniversalTextLineSorterStripper />}
          </div>
        </div>
      )}
    </section>
  );
};
