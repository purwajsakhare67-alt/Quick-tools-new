import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  X, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Layers, 
  ArrowRight,
  CornerDownLeft,
  Terminal,
  ShieldCheck,
  Palette,
  Code2,
  Clock,
  BarChart3,
  Type
} from 'lucide-react';
import { ToolItem, MasterNodeId } from '../types';
import { MASTER_NODES } from '../data/masterNodes';
import { useSound } from '../context/SoundContext';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTrendingTag: (tag: string) => void;
  totalToolsCount: number;
  tools: ToolItem[];
  onLaunchTool: (tool: ToolItem) => void;
  onSelectMasterNode?: (nodeId: MasterNodeId) => void;
  isSpotlightOpenExternal?: boolean;
  onCloseSpotlightExternal?: () => void;
  onExecuteResearchQuery?: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTrendingTag,
  totalToolsCount,
  tools,
  onLaunchTool,
  onSelectMasterNode,
  isSpotlightOpenExternal,
  onCloseSpotlightExternal,
  onExecuteResearchQuery
}) => {
  const [isSpotlightFocused, setIsSpotlightFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const spotlightInputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const { playClick, playToolSelect } = useSound();

  const isSpotlightActive = isSpotlightFocused || Boolean(isSpotlightOpenExternal);

  // Determine if query is an informational / research question or calculation
  const isResearchQueryType = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return false;
    return (
      q.endsWith('?') ||
      /^(what|how|why|explain|difference|formula|definition|compare|is|can|calculate|convert)\b/.test(q) ||
      /\b(percent|percentage|%|of|\+|\-|\*|\/|vs|cagr|apr|apy|rule of 72|bits|entropy)\b/.test(q)
    );
  }, [searchQuery]);

  // Global hotkey (press 'Ctrl+K', 'Cmd+K', or '/' to focus Spotlight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrlK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''));

      if (isCmdOrCtrlK || isSlash) {
        e.preventDefault();
        setIsSpotlightFocused(true);
        setTimeout(() => {
          spotlightInputRef.current?.focus();
        }, 60);
      } else if (e.key === 'Escape' && isSpotlightActive) {
        e.preventDefault();
        closeSpotlight();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpotlightActive]);

  const closeSpotlight = () => {
    setIsSpotlightFocused(false);
    if (onCloseSpotlightExternal) {
      onCloseSpotlightExternal();
    }
  };

  // Instant Sub-Second Indexing across all 100 tools
  const matchingTools = useMemo(() => {
    if (!searchQuery.trim()) {
      // Default: Return 8 curated flagship tools (1 from each Master Node)
      return MASTER_NODES.map(node => {
        const flagship = tools.find(t => t.masterNode === node.id);
        return flagship;
      }).filter(Boolean) as ToolItem[];
    }

    const q = searchQuery.toLowerCase().trim();
    const tokens = q.split(/\s+/);

    return tools
      .map(tool => {
        let score = 0;
        const nameLower = tool.name.toLowerCase();
        const descLower = tool.description.toLowerCase();
        const taglineLower = tool.tagline.toLowerCase();
        const tagsJoined = tool.tags.join(' ').toLowerCase();
        const categoryLower = tool.categoryName.toLowerCase();

        // Exact name match
        if (nameLower === q) score += 100;
        else if (nameLower.startsWith(q)) score += 60;
        else if (nameLower.includes(q)) score += 40;

        // Token match
        for (const token of tokens) {
          if (nameLower.includes(token)) score += 25;
          if (tagsJoined.includes(token)) score += 20;
          if (taglineLower.includes(token)) score += 15;
          if (descLower.includes(token)) score += 10;
          if (categoryLower.includes(token)) score += 15;
        }

        return { tool, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 18)
      .map(item => item.tool);
  }, [searchQuery, tools]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleLaunch = (tool: ToolItem) => {
    playToolSelect();
    closeSpotlight();
    if (tool.masterNode && onSelectMasterNode) {
      onSelectMasterNode(tool.masterNode);
    }
    onLaunchTool(tool);
  };

  const handleExecuteResearch = (queryToResearch?: string) => {
    const q = (queryToResearch || searchQuery).trim();
    if (!q) return;
    playClick();
    closeSpotlight();
    if (onExecuteResearchQuery) {
      onExecuteResearchQuery(q);
    }
  };

  // Build combined navigation items for Spotlight keyboard arrows
  // If query is an informational/question query, Research is index 0
  const isResearchTopPriority = Boolean(searchQuery.trim() && isResearchQueryType);
  const totalNavigableItems = matchingTools.length + (searchQuery.trim() ? 1 : 0);

  // Arrow key navigation inside Spotlight
  const handleSpotlightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < totalNavigableItems - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : Math.max(0, totalNavigableItems - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (!searchQuery.trim()) {
        if (matchingTools[selectedIndex]) {
          handleLaunch(matchingTools[selectedIndex]);
        }
        return;
      }

      // Check if research card is selected
      if (isResearchTopPriority) {
        if (selectedIndex === 0) {
          handleExecuteResearch();
        } else if (matchingTools[selectedIndex - 1]) {
          handleLaunch(matchingTools[selectedIndex - 1]);
        }
      } else {
        if (selectedIndex < matchingTools.length && matchingTools[selectedIndex]) {
          handleLaunch(matchingTools[selectedIndex]);
        } else {
          handleExecuteResearch();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      closeSpotlight();
    }
  };

  const trendingTags = [
    { label: 'SIP Compounding', query: 'SIP', isResearch: false, icon: TrendingUp, color: 'text-[#00f0ff]' },
    { label: 'What is SHA-256?', query: 'What is SHA-256?', isResearch: true, icon: ShieldCheck, color: 'text-[#00ff9f]' },
    { label: 'Loan EMI Amortization', query: 'EMI', isResearch: false, icon: Zap, color: 'text-[#bd00ff]' },
    { label: 'Rule of 72 Formula', query: 'What is compound interest and the Rule of 72?', isResearch: true, icon: TrendingUp, color: 'text-[#00f0ff]' },
    { label: 'JSON vs YAML', query: 'JSON vs YAML', isResearch: true, icon: Terminal, color: 'text-[#ffaa00]' },
    { label: '15% of 85,000', query: '15% of 85000', isResearch: true, icon: Sparkles, color: 'text-[#ff007f]' },
  ];

  return (
    <section className="relative pt-6 sm:pt-10 pb-8 sm:pb-12 text-center max-w-5xl mx-auto px-4 sm:px-6" id="home">
      
      {/* Top Value Cyberpunk Pill */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/40 dark:bg-white/5 border border-[#00f0ff]/30 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white/90 shadow-[0_0_15px_rgba(0,240,255,0.15)] backdrop-blur-xl mb-5 sm:mb-6"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f0ff]"></span>
        </span>
        <span className="text-[#00f0ff] font-mono font-bold">{totalToolsCount} Client-Side Nodes</span>
        <span className="text-white/30">•</span>
        <span className="text-white/70">Sub-Second Processing • 8 Master Nodes</span>
      </motion.div>

      {/* Main Bold Hero Title with Cyberpunk Gradients */}
      <motion.h1 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-5 font-heading"
      >
        Ultra-Fast Client-Side Utilities.<br className="hidden sm:inline" />{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#c084fc] to-[#bd00ff]">
          Zero Paywalls. Pure Browser RAM.
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15 }}
        className="text-base sm:text-lg text-slate-600 dark:text-white/60 max-w-2xl mx-auto mb-7 sm:mb-9 font-normal leading-relaxed"
      >
        100 production-ready financial, developer, and cryptographic tools running 100% locally with zero latency, zero telemetry tracking, and zero subscription traps.
      </motion.p>

      {/* Hero Resting Search Trigger Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="max-w-2xl mx-auto relative group mb-6"
      >
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00f0ff]/40 via-[#bd00ff]/30 to-[#ff007f]/30 opacity-30 group-hover:opacity-60 blur-xl transition duration-500"></div>
        
        <div 
          onClick={() => {
            playClick();
            setIsSpotlightFocused(true);
            setTimeout(() => spotlightInputRef.current?.focus(), 60);
          }}
          className="relative flex items-center justify-between rounded-2xl border border-slate-200 dark:border-[#00f0ff]/25 reading:border-[#cbb393] hover:border-[#0284c7]/50 dark:hover:border-[#00f0ff]/50 bg-white/90 dark:bg-[#0a0a0f]/80 reading:bg-[#fbf0d9] shadow-md dark:shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl px-4 sm:px-5 py-3.5 sm:py-4 cursor-pointer transition-all duration-300 group-hover:scale-[1.01]"
          id="hero-spotlight-resting-box"
        >
          <div className="flex items-center gap-3 text-slate-500 dark:text-white/40 reading:text-[#785942] flex-1">
            <Search className="w-5 h-5 text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-800 group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base text-slate-500 dark:text-white/40 reading:text-[#785942] font-medium select-none truncate">
              {searchQuery ? searchQuery : "Search 100 tools or ask any research query..."}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-semibold bg-slate-100 dark:bg-white/10 reading:bg-[#eedfc3] border border-slate-300 dark:border-white/15 reading:border-[#cbb393] rounded-lg text-slate-700 dark:text-cyan-200 reading:text-[#583d28]">
              <span className="text-xs">⌘</span>K
            </kbd>
            <span className="text-xs font-mono font-bold text-[#0284c7] dark:text-[#00f0ff] reading:text-amber-900 px-2 py-1 rounded bg-cyan-100 dark:bg-[#00f0ff]/10 reading:bg-amber-200/80 border border-cyan-300 dark:border-[#00f0ff]/20 reading:border-amber-400">
              DUAL SEARCH
            </span>
          </div>
        </div>
      </motion.div>

      {/* Trending Fast-Launch Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-600 dark:text-white/60">
        <span className="font-mono text-slate-400 dark:text-white/40 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#00f0ff]" /> Trending & Research:
        </span>
        {trendingTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => {
              playClick();
              if (tag.isResearch && onExecuteResearchQuery) {
                onExecuteResearchQuery(tag.query);
              } else {
                onSelectTrendingTag(tag.query);
              }
            }}
            className="px-3 py-1 rounded-full bg-white/40 dark:bg-white/5 hover:bg-[#00f0ff]/15 border border-white/10 hover:border-[#00f0ff]/40 text-slate-700 dark:text-white/80 hover:text-[#00f0ff] transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <tag.icon className={`w-3.5 h-3.5 ${tag.color}`} />
            <span>{tag.label}</span>
            {tag.isResearch && (
              <span className="text-[9px] font-mono uppercase text-[#00f0ff] bg-[#00f0ff]/15 px-1 rounded">
                SEO
              </span>
            )}
          </button>
        ))}
      </div>

      {/* APPLE SPOTLIGHT-STYLE GLOBAL SEARCH OVERLAY */}
      <AnimatePresence>
        {isSpotlightActive && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 sm:px-6">
            
            {/* Smooth Translucent Overlay (Dims background elements) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={closeSpotlight}
              className="fixed inset-0 bg-black/75 backdrop-blur-md cursor-pointer -z-10"
              aria-hidden="true"
            />

            {/* Spotlight Floating Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl bg-[#08080d]/95 border border-[#00f0ff]/40 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl flex flex-col max-h-[82vh]"
              id="apple-spotlight-modal"
            >
              {/* Top Search Input Row */}
              <div className="flex items-center px-4 sm:px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                <Search className="w-5 h-5 text-[#00f0ff] mr-3 shrink-0 animate-pulse" />
                <input
                  ref={spotlightInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={handleSpotlightKeyDown}
                  placeholder="Search 100 tools or ask any research query..."
                  className="w-full bg-transparent text-white placeholder-white/30 text-base sm:text-lg focus:outline-hidden font-medium"
                  autoFocus
                  id="spotlight-active-input"
                />
                {searchQuery ? (
                  <button
                    onClick={() => onSearchChange('')}
                    className="p-1 text-white/40 hover:text-white transition-colors cursor-pointer mr-2"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : null}
                <button
                  onClick={closeSpotlight}
                  className="px-2 py-1 text-xs font-mono text-white/50 hover:text-white bg-white/10 hover:bg-white/15 rounded border border-white/15 transition-all cursor-pointer"
                >
                  ESC
                </button>
              </div>

              {/* Status Row */}
              <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-xs font-mono text-white/50">
                <div className="flex items-center gap-2 truncate">
                  {searchQuery ? (
                    <>
                      <span>Matched <strong className="text-[#00f0ff]">{matchingTools.length}</strong> tools</span>
                      <span className="text-white/20">•</span>
                      <span className="text-[#c084fc] font-semibold">Dual Engine Active</span>
                    </>
                  ) : (
                    <span>100 Client-Side Utilities • Dual Intelligence Engine</span>
                  )}
                </div>
                <span className="hidden sm:inline text-white/40">Use ↑ ↓ to navigate, ↵ to select</span>
              </div>

              {/* Scrollable Results List */}
              <div 
                ref={resultsContainerRef}
                className="overflow-y-auto p-2 space-y-1.5 max-h-[60vh] custom-scroll"
              >
                {/* 1. If user typed a query, show Research Data Engine Option */}
                {searchQuery.trim() && isResearchTopPriority && (
                  <div
                    onClick={() => handleExecuteResearch()}
                    onMouseEnter={() => setSelectedIndex(0)}
                    className={`group flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${
                      selectedIndex === 0
                        ? 'bg-gradient-to-r from-[#00f0ff]/20 via-[#bd00ff]/20 to-transparent border border-[#00f0ff]/50 shadow-[0_0_20px_rgba(0,240,255,0.2)] text-white'
                        : 'bg-white/[0.03] border border-white/10 hover:border-[#00f0ff]/30 text-white/90'
                    }`}
                    id="spotlight-research-engine-card"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00f0ff] to-[#bd00ff] p-[1px] shrink-0">
                        <div className="w-full h-full bg-black/90 rounded-[7px] flex items-center justify-center text-[#00f0ff]">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase text-[#00f0ff] px-1.5 py-0.2 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                            Research Data Engine
                          </span>
                          <span className="text-[10px] font-mono text-[#c084fc]">
                            Google Featured Snippet
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-white truncate mt-0.5">
                          Instant direct answer & schema for &ldquo;{searchQuery}&rdquo;
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExecuteResearch();
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.5)] flex items-center gap-1"
                      >
                        Answer <CornerDownLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. Tool Items List */}
                {matchingTools.map((tool, idx) => {
                  const effectiveIndex = isResearchTopPriority ? idx + 1 : idx;
                  const isSelected = effectiveIndex === selectedIndex;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleLaunch(tool)}
                      onMouseEnter={() => setSelectedIndex(effectiveIndex)}
                      className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#00f0ff]/15 border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)] text-white' 
                          : 'hover:bg-white/5 border border-transparent text-white/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                          isSelected 
                            ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]' 
                            : 'bg-white/10 text-[#00f0ff]'
                        }`}>
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white truncate">
                              {tool.name}
                            </span>
                            {tool.badge && (
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-cyan-200 shrink-0 hidden xs:inline">
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/50 truncate font-normal">
                            {tool.tagline}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] font-mono text-white/40 hidden sm:inline">
                          {tool.categoryName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLaunch(tool);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-[#00f0ff] text-black shadow-[0_0_12px_rgba(0,240,255,0.5)]'
                              : 'bg-white/10 text-white group-hover:bg-[#00f0ff]/20 group-hover:text-[#00f0ff]'
                          }`}
                        >
                          Launch <CornerDownLeft className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* 3. If query is present and NOT top priority, append Research Engine card */}
                {searchQuery.trim() && !isResearchTopPriority && (
                  <div
                    onClick={() => handleExecuteResearch()}
                    onMouseEnter={() => setSelectedIndex(matchingTools.length)}
                    className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                      selectedIndex === matchingTools.length
                        ? 'bg-[#bd00ff]/20 border border-[#bd00ff]/50 shadow-[0_0_20px_rgba(189,0,255,0.2)] text-white'
                        : 'bg-white/[0.02] border border-white/5 hover:border-[#bd00ff]/30 text-white/80'
                    }`}
                    id="spotlight-research-engine-card-secondary"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <div className="w-9 h-9 rounded-lg bg-[#bd00ff]/20 border border-[#bd00ff]/40 flex items-center justify-center text-[#c084fc] shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold uppercase text-[#c084fc]">
                            Research Engine
                          </span>
                          <span className="text-[10px] text-white/40">
                            Schema.org Dynamic State
                          </span>
                        </div>
                        <p className="text-xs text-white/70 truncate">
                          Ask Research Engine for direct answer & Rich Snippet: &ldquo;{searchQuery}&rdquo;
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExecuteResearch();
                      }}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#bd00ff]/30 hover:bg-[#bd00ff] text-white hover:text-black transition-all flex items-center gap-1 shrink-0"
                    >
                      Research <CornerDownLeft className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* 4. Empty State with prominent Research CTA */}
                {matchingTools.length === 0 && !isResearchTopPriority && (
                  <div className="py-8 px-4 text-center">
                    <div className="max-w-md mx-auto p-5 rounded-2xl bg-[#00f0ff]/5 border border-[#00f0ff]/30 text-center space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center mx-auto">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          Query Research Data Engine
                        </h4>
                        <p className="text-xs text-white/60 mt-1">
                          No direct utility matched &ldquo;{searchQuery}&rdquo;, but our Research Engine can compute an instant direct answer, formulas, and Schema.org rich snippet!
                        </p>
                      </div>
                      <button
                        onClick={() => handleExecuteResearch()}
                        className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 mx-auto shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                        id="btn-spotlight-empty-research"
                      >
                        <span>Generate Direct Answer & Schema</span>
                        <CornerDownLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick-Action Footer */}
              <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/40">
                <div className="flex items-center gap-3">
                  <span>ESC to exit</span>
                  <span>•</span>
                  <span>100% In-Browser RAM</span>
                </div>
                <div className="text-[#00f0ff] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] inline-block animate-pulse" />
                  <span>Dual Intelligence Engine</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
