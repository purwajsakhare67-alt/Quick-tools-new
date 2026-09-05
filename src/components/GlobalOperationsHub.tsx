import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Star, 
  Clock, 
  Trash2, 
  Keyboard, 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  FileJson, 
  Check, 
  Sun, 
  Moon, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Shield, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ToolItem, ThemeMode } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useSound } from '../context/SoundContext';
import { CURRENCIES, GlobalCurrency } from '../utils/currency';

interface GlobalOperationsHubProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onLaunchTool: (tool: ToolItem) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onSetTheme?: (theme: ThemeMode) => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
}

const DEFAULT_PINNED = [
  'sip-visualizer',
  'loan-emi-breakout',
  'json-validator-linter',
  'regex-tester-visualizer'
];

export const GlobalOperationsHub: React.FC<GlobalOperationsHubProps> = ({
  isOpen,
  onClose,
  tools,
  onLaunchTool,
  theme,
  onToggleTheme,
  onSetTheme,
  onOpenAbout,
  onOpenPrivacy
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'shortcuts' | 'exporter' | 'params'>('all');
  
  // Module A State: Pinned & Recent Tools
  const [pinnedToolIds, setPinnedToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quickfree_pinned_tools');
      return saved ? JSON.parse(saved) : DEFAULT_PINNED;
    } catch {
      return DEFAULT_PINNED;
    }
  });

  const [recentToolIds, setRecentToolIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('quickfree_recent_tools');
      return saved ? JSON.parse(saved) : ['sip-visualizer', 'loan-emi-breakout'];
    } catch {
      return ['sip-visualizer', 'loan-emi-breakout'];
    }
  });

  const [toolSearchQuery, setToolSearchQuery] = useState('');

  // Module B State: Shortcuts Switch
  const [shortcutsEnabled, setShortcutsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('quickfree_shortcuts_enabled') !== 'false';
    } catch {
      return true;
    }
  });

  // Module C State: Import / Export feedback
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
  const [importStatusMsg, setImportStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currency, setCurrency } = useCurrency();
  const { soundEnabled, setSound, playClick, playToggle, playToolSelect } = useSound();

  // Save pinned tools to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('quickfree_pinned_tools', JSON.stringify(pinnedToolIds));
    } catch {
      // Ignore localStorage exceptions
    }
  }, [pinnedToolIds]);

  // Save shortcutsEnabled to localStorage and dispatch event
  const toggleShortcuts = () => {
    playToggle();
    const next = !shortcutsEnabled;
    setShortcutsEnabled(next);
    try {
      localStorage.setItem('quickfree_shortcuts_enabled', String(next));
      window.dispatchEvent(new CustomEvent('shortcuts-toggle', { detail: { enabled: next } }));
    } catch {
      // Ignore
    }
  };

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

  // Lock body scroll when drawer is open
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

  if (!isOpen) return null;

  // Toggle Pin Status
  const handleTogglePin = (toolId: string) => {
    playClick();
    setPinnedToolIds(prev => 
      prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]
    );
  };

  // Clear Recent History
  const handleClearRecent = () => {
    playClick();
    setRecentToolIds([]);
    try {
      localStorage.removeItem('quickfree_recent_tools');
    } catch {
      // Ignore
    }
  };

  // Handle Tool Launch
  const handleLaunch = (tool: ToolItem) => {
    playToolSelect();
    // Update recents
    const updated = [tool.id, ...recentToolIds.filter(id => id !== tool.id)].slice(0, 8);
    setRecentToolIds(updated);
    try {
      localStorage.setItem('quickfree_recent_tools', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    onLaunchTool(tool);
    onClose();
  };

  // Map tool IDs to ToolItems
  const pinnedTools = tools.filter(t => pinnedToolIds.includes(t.id));
  const recentTools = tools.filter(t => recentToolIds.includes(t.id));

  // Filter tools for pinning search
  const searchableTools = toolSearchQuery.trim()
    ? tools.filter(t => 
        t.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        t.tagline.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
        t.tags?.some(tag => tag.toLowerCase().includes(toolSearchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  // ================= EXPORT ACTIONS =================
  const handleExportProfileJson = () => {
    playClick();
    const data = {
      platform: 'QuickFree Tools',
      exportDate: new Date().toISOString(),
      theme,
      currency,
      soundEnabled,
      shortcutsEnabled,
      pinnedToolIds,
      recentToolIds,
      totalToolsSupported: tools.length
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickfree_system_profile_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccessMsg('Profile & Bookmarks JSON exported!');
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  const handleExportToolsCsv = () => {
    playClick();
    const header = ['Tool ID', 'Tool Name', 'Master Node', 'Category', 'Tagline', 'Stats'];
    const rows = tools.map(t => [
      `"${t.id}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.masterNode || ''}"`,
      `"${t.categoryName || t.category}"`,
      `"${t.tagline.replace(/"/g, '""')}"`,
      `"${t.stats || '<1ms In-Browser'}"`
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickfree_100_tools_catalog_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccessMsg('100 Tools Matrix CSV exported!');
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  const handleExportDiagnosticsTxt = () => {
    playClick();
    const diag = `================================================
QUICKFREE TOOLS SYSTEM DIAGNOSTICS LOG
Generated: ${new Date().toUTCString()}
Platform: 100 Free Client-Side Tools
Architecture: In-Browser Compute (Zero Server Storage)
================================================
Active Currency: ${currency}
Theme Mode: ${theme}
Sound Effects: ${soundEnabled ? 'Enabled' : 'Disabled'}
Keyboard Shortcuts: ${shortcutsEnabled ? 'Enabled' : 'Disabled'}
Pinned Tools: ${pinnedToolIds.join(', ') || 'None'}
Total Catalog Nodes: 8 Master Nodes (100 Tools)
Local Compute Status: Operational
GDPR / CCPA: Fully Client-Side Isolated
================================================`;
    const blob = new Blob([diag], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quickfree_diagnostics_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccessMsg('System Diagnostics TXT exported!');
    setTimeout(() => setExportSuccessMsg(null), 3500);
  };

  // ================= IMPORT ACTIONS =================
  const handleProcessImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.pinnedToolIds)) {
            setPinnedToolIds(parsed.pinnedToolIds);
          }
          if (parsed.currency && typeof parsed.currency === 'string') {
            setCurrency(parsed.currency);
          }
          if (parsed.shortcutsEnabled !== undefined) {
            setShortcutsEnabled(Boolean(parsed.shortcutsEnabled));
          }
          setImportStatusMsg({ text: `Successfully restored backup from ${file.name}!`, isError: false });
          playToggle();
        } else if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
          const lines = text.split('\n').filter(l => l.trim().length > 0);
          setImportStatusMsg({ text: `Parsed ${lines.length} lines from ${file.name}. Structural data recognized!`, isError: false });
          playClick();
        } else {
          setImportStatusMsg({ text: 'File format not supported. Use .json, .csv, or .txt', isError: true });
        }
      } catch {
        setImportStatusMsg({ text: 'Error parsing file contents. Please verify file integrity.', isError: true });
      }
      setTimeout(() => setImportStatusMsg(null), 4500);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessImportFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="global-operations-hub-title"
      id="global-operations-hub-container"
    >
      {/* Dark Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sliding Glass Drawer Panel (Slide out from Right) */}
      <div 
        className="fixed inset-y-0 right-0 z-50 w-full sm:w-[500px] md:w-[540px] flex flex-col shadow-2xl border-l border-[#00f0ff]/25 animate-in slide-in-from-right duration-300 overflow-hidden"
        style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: 'rgba(10, 10, 14, 0.88)'
        }}
      >
        {/* Top Cyberpunk Neon Strip */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#ff007f] shadow-[0_0_12px_#00f0ff]" />

        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#00f0ff]/20 to-[#bd00ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
                  Global Hub
                </span>
                <span className="text-[11px] font-mono text-cyan-200/60">
                  Central Utility Engine
                </span>
              </div>
              <h2 id="global-operations-hub-title" className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5 font-heading">
                Operations &amp; Control Center
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 transition-all cursor-pointer"
            aria-label="Close Operations Hub"
            id="btn-close-operations-hub"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Nav Module Switcher Pills */}
        <div className="px-4 py-2.5 border-b border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 bg-black/40">
          <button
            onClick={() => { playClick(); setActiveTab('all'); }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'all' 
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            All Modules
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('favorites'); }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'favorites' 
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            A: Favorites
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('shortcuts'); }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'shortcuts' 
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            B: Shortcuts
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('exporter'); }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'exporter' 
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            C: Data Export
          </button>
          <button
            onClick={() => { playClick(); setActiveTab('params'); }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'params' 
                ? 'bg-[#00f0ff] text-black shadow-[0_0_10px_#00f0ff]' 
                : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            D: Parameters
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">

          {/* ========================================================= */}
          {/* MODULE A: Personal Favorites & Local History Node */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'favorites') && (
            <section 
              className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4"
              id="operations-hub-module-a"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Star className="w-4 h-4 fill-amber-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                      Module A
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Personal Favorites &amp; Local History Node
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-cyan-200 bg-white/10 px-2 py-0.5 rounded-full">
                  {pinnedTools.length} Pinned
                </span>
              </div>

              {/* Tool Search & Quick Pin Selector */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300/60" />
                  <input 
                    type="text"
                    placeholder="Search 100 tools to bookmark/pin..."
                    value={toolSearchQuery}
                    onChange={(e) => setToolSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/15 focus:border-[#00f0ff] text-xs text-white placeholder-slate-400 focus:outline-hidden font-mono"
                  />
                </div>

                {/* Dropdown search results to pin */}
                {searchableTools.length > 0 && (
                  <div className="p-2 rounded-xl bg-black/80 border border-[#00f0ff]/30 space-y-1 max-h-48 overflow-y-auto">
                    <span className="text-[10px] font-mono text-cyan-300/70 px-2 uppercase">Search Results:</span>
                    {searchableTools.map(t => {
                      const isPinned = pinnedToolIds.includes(t.id);
                      return (
                        <div key={t.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/10 text-xs">
                          <span className="text-white font-medium truncate flex-1 mr-2">{t.name}</span>
                          <button
                            onClick={() => handleTogglePin(t.id)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer ${
                              isPinned 
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                                : 'bg-white/10 text-white/70 hover:text-white border border-white/20'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${isPinned ? 'fill-amber-400 text-amber-400' : ''}`} />
                            {isPinned ? 'Pinned' : 'Pin'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pinned Tools List */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 dark:text-white/50 uppercase tracking-wider block">
                  Pinned Micro-Engines ({pinnedTools.length})
                </span>

                {pinnedTools.length === 0 ? (
                  <div className="p-3 text-center rounded-xl bg-black/20 border border-dashed border-white/10 text-xs text-white/40">
                    No pinned tools yet. Search above to pin your top utilities!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {pinnedTools.map((tool) => (
                      <div 
                        key={tool.id}
                        className="group p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/40 flex items-center justify-between gap-3 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors truncate">
                              {tool.name}
                            </span>
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-cyan-200">
                              {tool.badge || 'Fast'}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/50 truncate mt-0.5">
                            {tool.tagline}
                          </p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleTogglePin(tool.id)}
                            className="p-1.5 rounded-lg text-amber-400 hover:bg-white/10 cursor-pointer"
                            title="Unpin tool"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                          </button>

                          <button
                            onClick={() => handleLaunch(tool)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#00f0ff]/15 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black border border-[#00f0ff]/30 text-xs font-mono font-bold transition-all cursor-pointer"
                          >
                            <span>Launch</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent History Block */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 dark:text-white/50 uppercase tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Recent History ({recentTools.length})</span>
                  </div>
                  {recentTools.length > 0 && (
                    <button
                      onClick={handleClearRecent}
                      className="text-[10px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>

                {recentTools.length === 0 ? (
                  <p className="text-xs text-white/40 italic">No recent tools logged yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {recentTools.map(t => (
                      <button
                        key={t.id}
                        onClick={() => handleLaunch(t)}
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-[#00f0ff]/40 text-xs font-mono text-white/80 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                        <span className="truncate max-w-[140px]">{t.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MODULE B: Keyboard Command Center Guide */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'shortcuts') && (
            <section 
              className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4"
              id="operations-hub-module-b"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#bd00ff]/20 text-[#bd00ff] border border-[#bd00ff]/30 flex items-center justify-center">
                    <Keyboard className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#bd00ff] font-bold uppercase tracking-wider block">
                      Module B
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Keyboard Command Center Guide
                    </h3>
                  </div>
                </div>

                {/* Instant Quick-Toggle Switch */}
                <button
                  onClick={toggleShortcuts}
                  className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    shortcutsEnabled
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                  id="btn-toggle-shortcuts-param"
                >
                  <span className={`w-2 h-2 rounded-full ${shortcutsEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {shortcutsEnabled ? 'ENABLED' : 'PAUSED'}
                </button>
              </div>

              <p className="text-xs text-slate-400 dark:text-white/60">
                Execute lightning-fast client operations with zero mouse latency across the platform:
              </p>

              {/* Shortcut Key Mappings */}
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/70">Apple Spotlight Global Search</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">⌘</kbd>
                    <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">K</kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/70">Modular Grid Categories (8 Nodes)</span>
                  <kbd className="px-2.5 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">G</kbd>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/70">Toggle Global Operations Hub</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">S</kbd>
                    <span className="text-white/40">/</span>
                    <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">O</kbd>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/70">Cycle Display Theme (3 Modes)</span>
                  <kbd className="px-2.5 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">T</kbd>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/70">Toggle Sound Effects Audio</span>
                  <kbd className="px-2.5 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">M</kbd>
                </div>

                <div className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5">
                  <span className="text-white/70">Dismiss Active Modal / Drawer</span>
                  <kbd className="px-2 py-0.5 rounded bg-white/10 text-cyan-200 border border-white/20 text-[11px]">Esc</kbd>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MODULE C: Bulk Data File Export Console */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'exporter') && (
            <section 
              className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4"
              id="operations-hub-module-c"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#00f0ff] font-bold uppercase tracking-wider block">
                      Module C
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Bulk Data File Export Console
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-300">Local I/O</span>
              </div>

              {exportSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{exportSuccessMsg}</span>
                </div>
              )}

              {importStatusMsg && (
                <div className={`p-2.5 rounded-xl text-xs font-mono flex items-center gap-2 animate-in fade-in ${
                  importStatusMsg.isError 
                    ? 'bg-rose-500/20 border border-rose-500/40 text-rose-300' 
                    : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                }`}>
                  {importStatusMsg.isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{importStatusMsg.text}</span>
                </div>
              )}

              {/* Batch Exporter Trigger Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={handleExportProfileJson}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/40 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer"
                  id="btn-export-profile-json"
                >
                  <FileJson className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold text-white">Profile &amp; Pins</span>
                  <span className="text-[10px] font-mono text-white/50">.JSON Package</span>
                </button>

                <button
                  onClick={handleExportToolsCsv}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/40 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer"
                  id="btn-export-tools-csv"
                >
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-white">100 Tools Matrix</span>
                  <span className="text-[10px] font-mono text-white/50">.CSV Directory</span>
                </button>

                <button
                  onClick={handleExportDiagnosticsTxt}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00f0ff]/40 flex flex-col items-center justify-center gap-1.5 text-center transition-all cursor-pointer"
                  id="btn-export-diagnostics-txt"
                >
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-bold text-white">Diagnostics</span>
                  <span className="text-[10px] font-mono text-white/50">.TXT Audit Log</span>
                </button>
              </div>

              {/* File Drag & Drop Loader Fallback */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${
                  isDragOver 
                    ? 'border-[#00f0ff] bg-[#00f0ff]/10' 
                    : 'border-white/20 hover:border-white/40 bg-black/40'
                }`}
              >
                <Upload className="w-6 h-6 mx-auto mb-2 text-cyan-300" />
                <p className="text-xs font-bold text-white">
                  Drag &amp; Drop Backup File (.json, .csv, .txt)
                </p>
                <p className="text-[10px] font-mono text-white/50 mt-0.5">
                  Or click to browse local files for instant configuration reload
                </p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleProcessImportFile(e.target.files[0]);
                    }
                  }}
                  accept=".json,.csv,.txt"
                  className="hidden" 
                />
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* MODULE D: Universal System Parameters Toggle */}
          {/* ========================================================= */}
          {(activeTab === 'all' || activeTab === 'params') && (
            <section 
              className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.03] space-y-4"
              id="operations-hub-module-d"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#ff007f]/20 text-[#ff007f] border border-[#ff007f]/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#ff007f] font-bold uppercase tracking-wider block">
                      Module D
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Universal System Parameters Toggle
                    </h3>
                  </div>
                </div>

                <span className="text-xs font-mono text-cyan-300">Live Config</span>
              </div>

              {/* 1. Currency Selector Tab Dropdown */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 dark:text-white/60 uppercase tracking-wider block">
                  Global Financial Currency
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {Object.values(CURRENCIES).map(c => {
                    const isSelected = currency === c.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => {
                          playClick();
                          setCurrency(c.code as GlobalCurrency);
                        }}
                        className={`px-2 py-1.5 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#00f0ff] text-black shadow-[0_0_8px_#00f0ff]'
                            : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10'
                        }`}
                      >
                        <div>{c.code}</div>
                        <div className="text-[10px] opacity-75">{c.symbol}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Theme Mode Switcher */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <label className="text-xs font-mono text-slate-400 dark:text-white/60 uppercase tracking-wider block">
                  Display Atmosphere Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      playToggle();
                      if (onSetTheme) onSetTheme('light');
                      else if (theme !== 'light') onToggleTheme();
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-amber-400 text-black border-amber-400 shadow-md font-black'
                        : 'bg-white/5 text-white/70 hover:text-white border-white/10'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" />
                    <span>Day Light</span>
                  </button>

                  <button
                    onClick={() => {
                      playToggle();
                      if (onSetTheme) onSetTheme('dark');
                      else if (theme !== 'dark') onToggleTheme();
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-[#00f0ff] text-black border-[#00f0ff] shadow-[0_0_12px_#00f0ff] font-black'
                        : 'bg-white/5 text-white/70 hover:text-white border-white/10'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-[#00f0ff]" />
                    <span>Obsidian</span>
                  </button>

                  <button
                    onClick={() => {
                      playToggle();
                      if (onSetTheme) onSetTheme('reading');
                      else if (theme !== 'reading') onToggleTheme();
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                      theme === 'reading'
                        ? 'bg-[#e4d2b2] text-[#432818] border-[#cbb393] shadow-md font-black'
                        : 'bg-white/5 text-white/70 hover:text-white border-white/10'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-amber-800" />
                    <span>Sepia Reading</span>
                  </button>
                </div>
              </div>

              {/* 3. Audio Feedback Toggle */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-[#00f0ff]" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                  <span>In-Browser Mechanical Audio Chimes</span>
                </div>
                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSound(next);
                    if (next) playClick();
                  }}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                    soundEnabled ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {soundEnabled ? 'AUDIO ON' : 'MUTED'}
                </button>
              </div>

              {/* 4. Hyperlink References: Privacy, Terms, Legal Compliance */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 dark:text-white/50 uppercase tracking-wider block">
                  Legal Compliance &amp; Security Disclosures
                </span>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => {
                      playClick();
                      onOpenPrivacy();
                      onClose();
                    }}
                    className="flex-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center justify-between cursor-pointer"
                  >
                    <span>Privacy Policy</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#00f0ff]" />
                  </button>

                  <button
                    onClick={() => {
                      playClick();
                      onOpenAbout();
                      onClose();
                    }}
                    className="flex-1 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center justify-between cursor-pointer"
                  >
                    <span>About Platform</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#bd00ff]" />
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>100% In-Browser Compute • Zero Server Cloud Logging • GDPR/CCPA Safe</span>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Drawer Footer Status */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-black/60 flex items-center justify-between text-xs font-mono text-white/50 shrink-0">
          <span>QuickFree Hub v2.8</span>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
