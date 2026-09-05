import React, { useState } from 'react';
import { 
  Binary, 
  Terminal, 
  Split, 
  Contrast, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalBencodeParser } from './tools/UniversalBencodeParser';
import { UniversalLeetSpeakScrambler } from './tools/UniversalLeetSpeakScrambler';
import { UniversalStringTokenizer } from './tools/UniversalStringTokenizer';
import { UniversalImageColorInverter } from './tools/UniversalImageColorInverter';
import { UniversalEmptyLineTrimmer } from './tools/UniversalEmptyLineTrimmer';

interface AdvancedMetadataCyberTextHubProps {
  initialTool?: 'bencode_parser' | 'leet_speak_scrambler' | 'string_tokenizer' | 'image_color_inverter' | 'empty_line_trimmer';
  defaultExpanded?: boolean;
}

export const AdvancedMetadataCyberTextHub: React.FC<AdvancedMetadataCyberTextHubProps> = ({
  initialTool = 'bencode_parser',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'bencode_parser' | 'leet_speak_scrambler' | 'string_tokenizer' | 'image_color_inverter' | 'empty_line_trimmer'>(initialTool);

  const tools = [
    {
      id: 'bencode_parser',
      name: 'Bencode Metadata Stream Encoder & Decoder',
      shortName: 'Bencode Decoder',
      icon: Binary,
      tagline: 'Parse bencode notation strings recursively inside local browser memory to inspect torrent metadata trees',
      badge: 'Torrent Developer Utility',
      accent: 'from-violet-600 via-purple-500 to-indigo-600'
    },
    {
      id: 'leet_speak_scrambler',
      name: 'Retro Leet Speak (1337) Text Scrambler',
      shortName: 'Leet Scrambler',
      icon: Terminal,
      tagline: 'Map characters natively using localized dictionary substitution arrays in browser RAM with custom density',
      badge: 'Creative Gaming Utility',
      accent: 'from-emerald-600 via-green-500 to-teal-600'
    },
    {
      id: 'string_tokenizer',
      name: 'Delimiter-Based String Tokenizer & Splitter',
      shortName: 'String Tokenizer',
      icon: Split,
      tagline: 'Execute native JavaScript split string array manipulations to segment heavy data chunks instantly',
      badge: 'Data Processing Utility',
      accent: 'from-blue-600 via-sky-500 to-cyan-600'
    },
    {
      id: 'image_color_inverter',
      name: 'In-Memory Image Color Inverter & Canvas Matrix',
      shortName: 'Image Inverter',
      icon: Contrast,
      tagline: 'Read pixel array coordinates via in-memory HTML5 canvas, programmatically inverting RGB (255 - value) values',
      badge: 'Design Canvas Utility',
      accent: 'from-pink-600 via-rose-500 to-orange-500'
    },
    {
      id: 'empty_line_trimmer',
      name: 'Code Empty Line Trimmer & Space Cleaner',
      shortName: 'Empty Line Trimmer',
      icon: FileText,
      tagline: 'Apply clean array filter mapping blocks and regex codes natively to erase blank lines and strip trailing whitespace',
      badge: 'Technical Writing Utility',
      accent: 'from-amber-500 via-orange-500 to-yellow-500'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="advanced-metadata-cyber-text-hub" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-violet-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300 mb-8"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-pink-500 p-0.5 shadow-lg shadow-violet-500/20">
            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex items-center justify-center text-white">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                Advanced Metadata Parsers &amp; Cyber Text Utilities
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <Cpu className="w-3 h-3" />
                Zero Host Bills • 100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Torrent bencode tree parsers, retro 1337 cyber text generators, delimiter splitters, in-memory HTML5 image pixel inverters &amp; empty line cleaners.
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
            id="advanced-metadata-cyber-text-toggle-btn"
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
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : 'bg-transparent text-slate-500'}`}>
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
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Active Utility: <span className="text-violet-600 dark:text-violet-400">{currentTool.name}</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {currentTool.tagline}
            </div>
          </div>

          {/* Render Active Component */}
          <div className="pt-2">
            {activeTab === 'bencode_parser' && <UniversalBencodeParser />}
            {activeTab === 'leet_speak_scrambler' && <UniversalLeetSpeakScrambler />}
            {activeTab === 'string_tokenizer' && <UniversalStringTokenizer />}
            {activeTab === 'image_color_inverter' && <UniversalImageColorInverter />}
            {activeTab === 'empty_line_trimmer' && <UniversalEmptyLineTrimmer />}
          </div>
        </div>
      )}
    </section>
  );
};
