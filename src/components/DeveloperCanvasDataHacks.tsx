import React, { useState } from 'react';
import { 
  FileCode, 
  Users, 
  Shield, 
  QrCode, 
  Type, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Zap, 
  Cpu, 
  Wand2 
} from 'lucide-react';
import { playSound } from '../utils/audioFeedback';
import { UniversalBase64ImageProcessor } from './tools/UniversalBase64ImageProcessor';
import { UniversalMockProfileGenerator } from './tools/UniversalMockProfileGenerator';
import { UniversalHtmlEntityProcessor } from './tools/UniversalHtmlEntityProcessor';
import { UniversalQrCodeScanner } from './tools/UniversalQrCodeScanner';
import { UniversalTextCaseWizard } from './tools/UniversalTextCaseWizard';

interface DeveloperCanvasDataHacksProps {
  initialTool?: 'base64_image' | 'mock_profile' | 'html_entity' | 'qr_scanner' | 'case_wizard';
  defaultExpanded?: boolean;
}

export const DeveloperCanvasDataHacks: React.FC<DeveloperCanvasDataHacksProps> = ({
  initialTool = 'base64_image',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'base64_image' | 'mock_profile' | 'html_entity' | 'qr_scanner' | 'case_wizard'>(initialTool);

  const tools = [
    {
      id: 'base64_image',
      name: 'Base64 Image Encoder & Decoder',
      shortName: 'Base64 Image',
      icon: FileCode,
      tagline: 'Client-side FileReader image pixel extraction & canvas reverse rendering',
      badge: 'Developer Utility',
      accent: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'mock_profile',
      name: 'Mock Random Profile & User Generator',
      shortName: 'Mock Profile Gen',
      icon: Users,
      tagline: 'Synthetic QA testing profiles, localized phone masks & JSON export',
      badge: 'QA Testing',
      accent: 'from-purple-500 to-pink-500'
    },
    {
      id: 'html_entity',
      name: 'HTML Entity Encoder & Decoder',
      shortName: 'HTML Entities',
      icon: Shield,
      tagline: 'Neutralize XSS vectors, encode active tags & decode web entities',
      badge: 'Security Utility',
      accent: 'from-amber-500 to-rose-500'
    },
    {
      id: 'qr_scanner',
      name: 'Client-Side Web QR Code Scanner',
      shortName: 'QR Code Scanner',
      icon: QrCode,
      tagline: 'Real-time camera viewfinder & canvas ImageData vector decoding',
      badge: 'Device Camera',
      accent: 'from-emerald-500 to-teal-500'
    },
    {
      id: 'case_wizard',
      name: 'Text Case Wizard & List Array Sorter',
      shortName: 'Text Case Wizard',
      icon: Type,
      tagline: 'Transform string cases, sort line arrays & deduplicate whitespace',
      badge: 'Writer Utility',
      accent: 'from-blue-500 to-indigo-500'
    }
  ];

  const currentTool = tools.find((t) => t.id === activeTab) || tools[0];

  return (
    <section 
      id="developer-canvas-data-hacks-suite" 
      className="w-full rounded-3xl bg-white/70 dark:bg-slate-900/80 reading:bg-[#f6ebd4] backdrop-blur-xl border border-purple-500/20 dark:border-white/10 shadow-2xl p-4 sm:p-7 space-y-6 transition-all duration-300"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Wand2 className="w-6 h-6 text-cyan-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white reading:text-[#3d2e24]">
                Developer Canvas & Everyday Data Hacks
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                <Cpu className="w-3 h-3 text-cyan-400" />
                100% In-Browser Compute
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60 reading:text-[#6a5546]">
              Sub-second client-side execution • HTML5 Canvas & Native JS • Zero server lag & zero data transmission
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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
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
                      ? `bg-gradient-to-r ${tool.accent} text-white shadow-lg shadow-purple-500/20 border-transparent scale-[1.02]`
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
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-transparent border border-purple-500/10 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-white/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{currentTool.tagline}</span>
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-300 hidden md:inline">
              Instant Local Compute
            </span>
          </div>

          {/* Render Active Tool Panel */}
          <div className="p-1 sm:p-2">
            {activeTab === 'base64_image' && <UniversalBase64ImageProcessor />}
            {activeTab === 'mock_profile' && <UniversalMockProfileGenerator />}
            {activeTab === 'html_entity' && <UniversalHtmlEntityProcessor />}
            {activeTab === 'qr_scanner' && <UniversalQrCodeScanner />}
            {activeTab === 'case_wizard' && <UniversalTextCaseWizard />}
          </div>
        </div>
      )}
    </section>
  );
};
