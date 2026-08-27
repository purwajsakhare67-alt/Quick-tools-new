import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  TrendingUp, 
  Calculator, 
  Coins, 
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
  ChevronRight,
  Zap,
  Code
} from 'lucide-react';
import { ToolItem, ToolCategory } from '../types';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory: (category: ToolCategory) => void;
  currentCategory: ToolCategory;
}

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
  Timer
};

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
  onSelectCategory,
  currentCategory
}) => {
  const [drawerSearch, setDrawerSearch] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Categorized tool lists
  const financialTools = useMemo(() => {
    return tools.filter(t => t.category === 'financial');
  }, [tools]);

  const devTools = useMemo(() => {
    return tools.filter(t => t.category === 'tech_utilities');
  }, [tools]);

  const productivityTools = useMemo(() => {
    return tools.filter(t => t.category === 'productivity_math' || t.category === 'ai_media');
  }, [tools]);

  const filterList = (list: ToolItem[]) => {
    if (!drawerSearch.trim()) return list;
    const q = drawerSearch.toLowerCase().trim();
    return list.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.tagline.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  };

  const filteredFinancial = filterList(financialTools);
  const filteredDev = filterList(devTools);
  const filteredProductivity = filterList(productivityTools);
  const totalFiltered = filteredFinancial.length + filteredDev.length + filteredProductivity.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex" id="sidebar-drawer-root">
      
      {/* Backdrop overlay */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 dark:bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn cursor-pointer"
        aria-label="Close sidebar backdrop"
        id="sidebar-drawer-backdrop"
      />

      {/* Slide-in Drawer Container */}
      <div 
        className="relative z-10 w-full max-w-md sm:max-w-lg bg-white/95 dark:bg-[#060814]/95 text-slate-900 dark:text-white h-full shadow-2xl border-r border-slate-200/80 dark:border-white/10 flex flex-col backdrop-blur-2xl transform transition-transform duration-300 ease-out animate-slideInLeft overflow-hidden"
        id="sidebar-drawer-panel"
      >
        
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.02] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Tool Directory
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                  {tools.length} Tools
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-white/50">
                Quick jump to any micro-tool
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-white/10 transition-colors cursor-pointer border border-transparent hover:border-slate-300 dark:hover:border-white/15"
            aria-label="Close drawer"
            id="btn-close-sidebar-drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search inside Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/10 bg-white/40 dark:bg-white/[0.01]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={drawerSearch}
              onChange={(e) => setDrawerSearch(e.target.value)}
              placeholder="Search tools, formulas, generators..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
              id="sidebar-drawer-search-input"
            />
            {drawerSearch && (
              <button
                onClick={() => setDrawerSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Tool Directory List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 custom-scrollbar">
          
          {totalFiltered === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3 text-xl">
                🔍
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-white/80 mb-1">
                No tools matching &ldquo;{drawerSearch}&rdquo;
              </p>
              <p className="text-xs text-slate-500 dark:text-white/40">
                Try searching for SIP, EMI, JSON, Base64, QR, or PDF.
              </p>
            </div>
          ) : (
            <>
              {/* Category 1: Financial Engines */}
              {filteredFinancial.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💰</span>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        Financial Engines ({filteredFinancial.length})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectCategory('financial');
                        onClose();
                        const el = document.getElementById('tools-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Filter View
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {filteredFinancial.map((tool) => {
                      const IconComponent = iconMap[tool.icon] || Calculator;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onSelectTool(tool);
                            onClose();
                          }}
                          className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 border border-slate-200/70 dark:border-white/5 hover:border-emerald-500/30 transition-all flex items-center justify-between group cursor-pointer"
                          id={`drawer-tool-item-${tool.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tool.gradient} p-0.5 shrink-0 flex items-center justify-center text-white shadow-xs`}>
                              <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center">
                                <IconComponent className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white/90 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-white/40 truncate">
                                {tool.tagline}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 2: Developer & Tech Utilities */}
              {filteredDev.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💻</span>
                      <span className="text-xs font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                        Developer & Tech Utilities ({filteredDev.length})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectCategory('tech_utilities');
                        onClose();
                        const el = document.getElementById('tools-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Filter View
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {filteredDev.map((tool) => {
                      const IconComponent = iconMap[tool.icon] || Code;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onSelectTool(tool);
                            onClose();
                          }}
                          className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 border border-slate-200/70 dark:border-white/5 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
                          id={`drawer-tool-item-${tool.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tool.gradient} p-0.5 shrink-0 flex items-center justify-center text-white shadow-xs`}>
                              <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center">
                                <IconComponent className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white/90 truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-white/40 truncate">
                                {tool.tagline}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Category 3: Everyday Productivity */}
              {filteredProductivity.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⚡</span>
                      <span className="text-xs font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                        Everyday Productivity ({filteredProductivity.length})
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onSelectCategory('productivity');
                        onClose();
                        const el = document.getElementById('tools-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      Filter View
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {filteredProductivity.map((tool) => {
                      const IconComponent = iconMap[tool.icon] || Zap;
                      return (
                        <button
                          key={tool.id}
                          onClick={() => {
                            onSelectTool(tool);
                            onClose();
                          }}
                          className="w-full text-left p-2.5 sm:p-3 rounded-2xl bg-white dark:bg-white/[0.03] hover:bg-pink-500/10 dark:hover:bg-pink-500/10 border border-slate-200/70 dark:border-white/5 hover:border-pink-500/30 transition-all flex items-center justify-between group cursor-pointer"
                          id={`drawer-tool-item-${tool.id}`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${tool.gradient} p-0.5 shrink-0 flex items-center justify-center text-white shadow-xs`}>
                              <div className="w-full h-full bg-slate-950/20 rounded-[10px] flex items-center justify-center">
                                <IconComponent className="w-4 h-4" />
                              </div>
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white/90 truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                                  {tool.name}
                                </span>
                                {tool.badge && (
                                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-pink-500/10 text-pink-600 dark:text-pink-400">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-white/40 truncate">
                                {tool.tagline}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 dark:text-white/30 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

        </div>

        {/* Drawer Bottom Quick Action */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.02] flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-white/40">
            Current filter: <strong className="text-purple-600 dark:text-purple-300 font-bold capitalize">{currentCategory === 'all' ? 'All Tools' : currentCategory.replace('_', ' ')}</strong>
          </span>
          <button
            onClick={() => {
              onSelectCategory('all');
              onClose();
              const el = document.getElementById('tools-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/10 font-bold text-slate-700 dark:text-white hover:bg-purple-600 hover:text-white transition-colors"
          >
            View All 35
          </button>
        </div>

      </div>
    </div>
  );
};
