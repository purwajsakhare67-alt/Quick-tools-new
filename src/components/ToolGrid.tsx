import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Calculator, 
  Coins, 
  Sparkles, 
  Flame, 
  Receipt, 
  Wallet, 
  BarChart3, 
  Building2, 
  Hourglass, 
  LineChart, 
  PiggyBank,
  FileText, 
  QrCode, 
  Code2, 
  ShieldCheck, 
  Palette, 
  Binary, 
  Terminal, 
  Clock, 
  Layers, 
  FileCode, 
  Link, 
  Split,
  Wand2, 
  Image as ImageIcon, 
  Shapes, 
  Maximize2, 
  EyeOff, 
  LayoutTemplate, 
  Scale, 
  Type, 
  Percent, 
  Calendar, 
  CreditCard, 
  Timer,
  Smartphone, 
  Table, 
  ArrowRight, 
  Play, 
  Sparkle, 
  Volume2, 
  Code, 
  Link2, 
  Globe, 
  ListOrdered, 
  FileJson,
  Activity, 
  Replace, 
  Database, 
  Lock, 
  Key, 
  FileSpreadsheet, 
  Scissors, 
  Network,
  KeyRound,
  ArrowRightLeft,
  FileSearch,
  ShieldAlert,
  Cpu,
  Hash,
  Dice5,
  FileCheck,
  CheckCircle2,
  Bookmark,
  UserCheck,
  HelpCircle,
  Shuffle,
  Eye,
  Zap,
  CornerDownRight,
  Users,
  Shield,
  GitCompare,
  Monitor,
  Contrast,
  Repeat,
  FileCode2,
  CalendarDays
} from 'lucide-react';
import { ToolItem, ToolCategory, MasterNodeId } from '../types';
import { MASTER_NODES } from '../data/masterNodes';
import { useSound } from '../context/SoundContext';

interface ToolGridProps {
  tools: ToolItem[];
  selectedMasterNode: MasterNodeId;
  onSelectMasterNode: (nodeId: MasterNodeId) => void;
  onLaunchTool: (tool: ToolItem) => void;
  searchQuery: string;
  isolatedToolId?: string | null;
  onResetIsolation?: () => void;
  onClearSearch?: () => void;
  // Optional backward compatibility
  selectedCategory?: ToolCategory;
  onSelectCategory?: (category: ToolCategory) => void;
}

// Icon mapping helper with safe fallback
const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  Calculator,
  Coins,
  Sparkles,
  Flame,
  Receipt,
  Wallet,
  BarChart3,
  Building2,
  Hourglass,
  LineChart,
  PiggyBank,
  FileText,
  QrCode,
  Code2,
  ShieldCheck,
  Palette,
  Binary,
  Terminal,
  Clock,
  Layers,
  FileCode,
  Link,
  Split,
  Wand2,
  Image: ImageIcon,
  Shapes,
  Maximize2,
  EyeOff,
  LayoutTemplate,
  Scale,
  Type,
  Percent,
  Calendar,
  CreditCard,
  Timer,
  Smartphone,
  Table,
  Volume2,
  Code,
  Link2,
  Globe,
  ListOrdered,
  FileJson,
  Activity,
  Replace,
  Database,
  Lock,
  Key,
  FileSpreadsheet,
  Scissors,
  Network,
  KeyRound,
  ArrowRightLeft,
  FileSearch,
  ShieldAlert,
  Cpu,
  Hash,
  Dice5,
  FileCheck,
  CheckCircle2,
  Bookmark,
  UserCheck,
  HelpCircle,
  Shuffle,
  Eye,
  Zap,
  Users,
  Shield,
  GitCompare,
  Monitor,
  Contrast,
  Repeat,
  FileCode2,
  CalendarDays
};

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  selectedMasterNode,
  onSelectMasterNode,
  onLaunchTool,
  searchQuery,
  isolatedToolId,
  onResetIsolation,
  onClearSearch
}) => {
  const { playClick, playToolSelect } = useSound();

  // 4. Inertia Scroll Card Movement (Engagement Engine)
  // Subtle hardware-accelerated CSS transition layout parameter making active card slots float or glide organically
  const [scrollShift, setScrollShift] = useState(0);
  const lastScrollPos = useRef(0);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleInertiaScroll = () => {
      const currentPos = window.scrollY || window.pageYOffset;
      const delta = currentPos - lastScrollPos.current;
      lastScrollPos.current = currentPos;

      // Soft clamp shift between -8px and +8px based on velocity
      const shift = Math.max(-8, Math.min(8, delta * 0.18));
      setScrollShift(shift);

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // Smoothly return to 0 with 0.6s cubic-bezier curve
      scrollTimeoutRef.current = window.setTimeout(() => {
        setScrollShift(0);
      }, 80);
    };

    window.addEventListener('scroll', handleInertiaScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleInertiaScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Active Master Node Definition
  const activeNodeMeta = useMemo(() => {
    return MASTER_NODES.find(node => node.id === selectedMasterNode) || MASTER_NODES[0];
  }, [selectedMasterNode]);

  // Filter tools: If searching, search across all 100 tools; otherwise isolate only active Master Node
  const visibleTools = useMemo(() => {
    // 1. If isolated tool ID from URL deep-link
    if (isolatedToolId && !searchQuery.trim()) {
      const match = tools.find(t => t.id === isolatedToolId);
      if (match) return [match];
    }

    // 2. If active search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return tools.filter(tool => {
        const nameMatch = tool.name.toLowerCase().includes(q);
        const descMatch = tool.description.toLowerCase().includes(q);
        const taglineMatch = tool.tagline.toLowerCase().includes(q);
        const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));
        const catMatch = tool.categoryName.toLowerCase().includes(q);
        return nameMatch || descMatch || taglineMatch || tagMatch || catMatch;
      });
    }

    // 3. Category Tab Isolation: Only tools belonging to the active Master Node
    return tools.filter(tool => tool.masterNode === selectedMasterNode);
  }, [tools, selectedMasterNode, searchQuery, isolatedToolId]);

  const handleTabClick = (nodeId: MasterNodeId) => {
    playClick();
    if (onResetIsolation) onResetIsolation();
    onSelectMasterNode(nodeId);
  };

  const handleCardClick = (tool: ToolItem) => {
    playToolSelect();
    onLaunchTool(tool);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="tools-section">
      
      {/* 1. RESPONSIVE SEGMENTED CATEGORY TABS (THE 8 MASTER NODES) */}
      <div className="mb-8 sm:mb-10">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
            <h2 className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-[#00f0ff]">
              THE 8 MASTER NODES // 100 CLIENT-SIDE ENGINES
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-white/40 hidden sm:inline">
            Zero Hosting Cost • Instant Local Execution
          </span>
        </div>

        {/* Scrollable / Segmented Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 custom-scroll no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {MASTER_NODES.map((node) => {
            const isActive = selectedMasterNode === node.id && !searchQuery.trim();
            const IconComponent = iconMap[node.icon] || Sparkles;

            return (
              <button
                key={node.id}
                onClick={() => handleTabClick(node.id)}
                className={`group relative shrink-0 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#00f0ff]/15 dark:bg-[#00f0ff]/15 reading:bg-amber-600/20 text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-900 border border-[#0284c7]/50 dark:border-[#00f0ff]/50 reading:border-amber-600/50 shadow-sm dark:shadow-[0_0_20px_rgba(0,240,255,0.25)] font-bold'
                    : 'bg-white/80 dark:bg-white/5 reading:bg-[#eedfc3] text-slate-700 dark:text-white/70 reading:text-[#583d28] hover:bg-white dark:hover:bg-white/10 reading:hover:bg-[#e4d2b2] hover:text-slate-900 dark:hover:text-white reading:hover:text-[#432818] border border-slate-200 dark:border-white/10 reading:border-[#cbb393]'
                }`}
                id={`tab-master-node-${node.id}`}
              >
                {/* Active Glowing Tab Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeMasterNodeIndicator"
                    className="absolute inset-0 rounded-xl bg-[#00f0ff]/10 dark:bg-[#00f0ff]/10 reading:bg-amber-600/10 border border-[#0284c7]/50 dark:border-[#00f0ff]/60 reading:border-amber-600/50 -z-10 shadow-sm dark:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-black ${
                  isActive 
                    ? 'bg-[#00f0ff] text-black shadow-sm dark:shadow-[0_0_8px_#00f0ff]' 
                    : 'bg-slate-200 dark:bg-white/10 reading:bg-[#dfcaa9] text-slate-700 dark:text-white/60 reading:text-[#583d28]'
                }`}>
                  0{node.tabNumber}
                </span>

                <IconComponent className={`w-4 h-4 ${isActive ? 'text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-800' : 'text-slate-500 dark:text-white/50 reading:text-[#785942] group-hover:text-slate-900 dark:group-hover:text-white'}`} />

                <span className="whitespace-nowrap font-sans">
                  {node.tabLabel}
                </span>

                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive 
                    ? 'bg-[#00f0ff]/25 text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-900' 
                    : 'bg-slate-200 dark:bg-white/10 reading:bg-[#dfcaa9] text-slate-600 dark:text-white/50 reading:text-[#583d28]'
                }`}>
                  {node.expectedCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ISOLATED ACTIVE CATEGORY BANNER / SEARCH STATUS */}
      <div className="mb-6 sm:mb-8">
        {searchQuery.trim() ? (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#00f0ff]/10 dark:bg-[#00f0ff]/10 reading:bg-amber-600/15 border border-[#0284c7]/30 dark:border-[#00f0ff]/30 reading:border-amber-600/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm dark:shadow-[0_0_25px_rgba(0,240,255,0.1)]">
            <div>
              <div className="text-xs font-mono text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-800 uppercase tracking-wider font-bold">
                GLOBAL SEARCH ACROSS ALL 100 TOOLS
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white reading:text-[#432818] mt-0.5">
                Found {visibleTools.length} utilities matching &ldquo;{searchQuery}&rdquo;
              </h3>
            </div>
            <button
              onClick={() => {
                playClick();
                if (onClearSearch) {
                  onClearSearch();
                }
                const heroInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
                if (heroInput) heroInput.value = '';
                const evt = new Event('input', { bubbles: true });
                heroInput?.dispatchEvent(evt);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 reading:bg-[#eedfc3] hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-mono text-slate-800 dark:text-white reading:text-[#432818] border border-slate-300 dark:border-white/20 reading:border-[#cbb393] transition-colors cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : isolatedToolId ? (
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 backdrop-blur-xl flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-mono text-purple-700 dark:text-purple-400 font-bold uppercase">Direct Link Isolated</span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white reading:text-[#432818]">Viewing Single Requested Engine</h3>
            </div>
            {onResetIsolation && (
              <button
                onClick={onResetIsolation}
                className="px-3 py-1.5 rounded-xl bg-slate-200/80 dark:bg-white/10 reading:bg-[#eedfc3] hover:bg-slate-300 dark:hover:bg-white/20 text-xs font-mono text-slate-800 dark:text-white reading:text-[#432818] border border-slate-300 dark:border-white/20 reading:border-[#cbb393] transition-colors cursor-pointer"
              >
                View All {activeNodeMeta.expectedCount} Tools in Tab
              </button>
            )}
          </div>
        ) : (
          <div className="relative p-5 sm:p-6 rounded-2xl bg-white/90 dark:bg-gradient-to-r dark:from-[#0a0a10]/90 dark:to-[#12121e]/90 reading:bg-[#f4ebd9] border border-slate-200 dark:border-white/10 reading:border-[#dfcaa9] backdrop-blur-xl overflow-hidden shadow-md dark:shadow-xl">
            {/* Top Accent Line with Node Gradient */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${activeNodeMeta.gradient} opacity-90 shadow-[0_0_12px_rgba(0,240,255,0.5)]`} />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-100 dark:bg-[#00f0ff]/10 reading:bg-amber-200 text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-900 border border-cyan-300 dark:border-[#00f0ff]/30 reading:border-amber-400">
                    TAB 0{activeNodeMeta.tabNumber}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-white/50 reading:text-amber-800/70 tracking-wider uppercase">
                    {activeNodeMeta.badge}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white reading:text-[#432818] tracking-tight font-heading">
                  {activeNodeMeta.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-white/60 reading:text-[#583d28] mt-1 max-w-2xl font-normal">
                  {activeNodeMeta.description}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-black/40 reading:bg-[#eedfc3] border border-slate-200 dark:border-white/10 reading:border-[#cbb393] text-right">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-white/40 reading:text-[#785942] uppercase block">Tab Tool Count</span>
                  <span className="text-lg font-mono font-black text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-800">
                    {visibleTools.length} / {activeNodeMeta.expectedCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. ACTIVE CATEGORY GRID (SMOOTH CSS FADE & SLIDE-UP ISOLATION) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={searchQuery ? 'search' : selectedMasterNode}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 animate-slideUpFade inertia-card-grid"
          id={`grid-master-node-${selectedMasterNode}`}
          style={{ transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s' }}
        >
          {visibleTools.map((tool, index) => {
            const IconComponent = iconMap[tool.icon] || Sparkles;
            const colIndex = index % 3;
            // Subtle hardware-accelerated inertia shift making active card slots float or glide organically on scroll
            const cardInertiaY = scrollShift * (colIndex === 0 ? 0.7 : colIndex === 1 ? -0.45 : 0.85);

            return (
              <div
                key={tool.id}
                onClick={() => handleCardClick(tool)}
                className="cyber-glass-card inertia-scroll-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer group relative overflow-hidden"
                style={{
                  transform: `translate3d(0, ${cardInertiaY}px, 0)`,
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease, box-shadow 0.22s ease',
                  willChange: 'transform, opacity'
                }}
                id={`tool-card-${tool.id}`}
              >
                {/* Ambient Top Corner Light Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00f0ff]/10 via-[#bd00ff]/5 to-transparent rounded-bl-full pointer-events-none -z-10 group-hover:from-[#00f0ff]/20 transition-all duration-300" />

                <div>
                  {/* Top Bar: Icon + Badge + Status */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-gradient-to-tr dark:from-white/10 dark:to-white/5 reading:bg-[#eedfc3] border border-slate-200 dark:border-white/10 reading:border-[#cbb393] group-hover:border-[#00f0ff]/50 flex items-center justify-center transition-all duration-200 group-hover:scale-105 shadow-xs">
                      <IconComponent className="w-5 h-5 text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-800 group-hover:text-cyan-400 transition-colors" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tool.badge && (
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-white/10 reading:bg-[#e4d2b2] text-slate-700 dark:text-cyan-200 reading:text-[#583d28] border border-slate-300 dark:border-white/15 reading:border-[#cbb393]">
                          {tool.badge}
                        </span>
                      )}
                      <span className="w-2 h-2 rounded-full bg-[#00ff9f] inline-block" title="Ready to execute client-side" />
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white reading:text-[#432818] tracking-tight mb-2 group-hover:text-[#0284c7] dark:group-hover:text-[#00f0ff] reading:group-hover:text-amber-700 transition-colors leading-snug font-heading">
                    {tool.name}
                  </h4>

                  {/* Tagline */}
                  <p className="text-xs sm:text-sm font-semibold text-cyan-800 dark:text-cyan-200/80 reading:text-amber-900/90 mb-2 leading-relaxed">
                    {tool.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-white/60 reading:text-[#6b4a31] line-clamp-2 leading-relaxed mb-4">
                    {tool.description}
                  </p>
                </div>

                {/* Bottom Row: Stats/Speed Pill + Launch Button */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 reading:border-[#dfcaa9] flex items-center justify-between gap-2 mt-auto">
                  <div className="text-[10px] font-mono text-slate-500 dark:text-white/40 reading:text-[#785942] truncate">
                    {tool.stats || '<1ms In-Browser'}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(tool);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/10 reading:bg-[#eedfc3] hover:bg-[#00f0ff] dark:hover:bg-[#00f0ff] reading:hover:bg-amber-600 text-slate-800 dark:text-white reading:text-[#432818] hover:text-black reading:hover:text-white border border-slate-300 dark:border-white/20 reading:border-[#cbb393] hover:border-[#00f0ff] text-xs font-mono font-bold transition-all duration-200 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {visibleTools.length === 0 && (
        <div className="py-20 text-center rounded-2xl bg-black/30 border border-white/10 p-8 mt-6">
          <Sparkles className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white">No tools found matching your criteria</h4>
          <p className="text-sm text-white/50 mt-1 max-w-md mx-auto">
            Try adjusting your search terms or switch between the 8 Master Node tabs above.
          </p>
        </div>
      )}

    </section>
  );
};
