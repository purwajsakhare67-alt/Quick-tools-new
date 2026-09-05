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
  Smartphone, 
  Table, 
  Wand2, 
  ChevronRight, 
  Zap, 
  Code, 
  Volume2, 
  Scissors, 
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
  ChevronDown,
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

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory?: (category: ToolCategory) => void;
  currentCategory?: ToolCategory;
  selectedMasterNode?: MasterNodeId;
  onSelectMasterNode?: (nodeId: MasterNodeId) => void;
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
  Timer,
  Smartphone,
  Table,
  Wand2,
  Code,
  Volume2,
  Scissors,
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

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  tools,
  onSelectTool,
  onSelectMasterNode,
  selectedMasterNode = 'finance_wealth'
}) => {
  const [drawerSearch, setDrawerSearch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    [selectedMasterNode]: true
  });
  const { playClick, playToolSelect } = useSound();

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

  // Expand active node when selectedMasterNode changes
  useEffect(() => {
    if (selectedMasterNode) {
      setExpandedNodes(prev => ({
        ...prev,
        [selectedMasterNode]: true
      }));
    }
  }, [selectedMasterNode]);

  const toggleNodeExpand = (nodeId: string) => {
    playClick();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  // Filter tools per node
  const getToolsForNode = (nodeId: MasterNodeId) => {
    const nodeTools = tools.filter(t => t.masterNode === nodeId);
    if (!drawerSearch.trim()) return nodeTools;

    const q = drawerSearch.toLowerCase().trim();
    return nodeTools.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.tags.some(tag => tag.toLowerCase().includes(q))
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => {
          playClick();
          onClose();
        }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 cursor-pointer"
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-[#07070b]/95 border-l border-[#00f0ff]/20 shadow-2xl backdrop-blur-2xl flex flex-col"
          id="tools-sidebar-drawer"
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white font-heading">
                  All 100 Tools Directory
                </h3>
                <p className="text-xs font-mono text-[#00f0ff]">
                  8 Master Nodes • Client-Side Engine
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close directory"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Search inside Drawer */}
          <div className="p-4 border-b border-white/10 bg-white/[0.02]">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#00f0ff] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                placeholder="Search across all 100 tools..."
                className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-black/50 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-hidden focus:border-[#00f0ff]/50 font-medium"
              />
              {drawerSearch && (
                <button
                  onClick={() => setDrawerSearch('')}
                  className="absolute right-2.5 p-1 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Master Nodes Tool Hierarchy */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scroll">
            {MASTER_NODES.map((node) => {
              const nodeTools = getToolsForNode(node.id);
              const isExpanded = Boolean(drawerSearch.trim()) || Boolean(expandedNodes[node.id]);
              const IconComponent = iconMap[node.icon] || Sparkles;

              if (drawerSearch.trim() && nodeTools.length === 0) return null;

              return (
                <div 
                  key={node.id} 
                  className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
                >
                  {/* Node Accordion Header */}
                  <button
                    onClick={() => toggleNodeExpand(node.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 h-5 rounded text-[10px] font-mono font-bold bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center shrink-0">
                        0{node.tabNumber}
                      </span>
                      <IconComponent className="w-4 h-4 text-[#00f0ff] shrink-0" />
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {node.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/10 text-cyan-200">
                        {nodeTools.length}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-white/40" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/40" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Tools List */}
                  {isExpanded && (
                    <div className="border-t border-white/5 bg-black/30 p-1.5 space-y-1">
                      {nodeTools.map((tool) => {
                        const ToolIcon = iconMap[tool.icon] || Sparkles;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => {
                              playToolSelect();
                              if (onSelectMasterNode) onSelectMasterNode(node.id);
                              onSelectTool(tool);
                              onClose();
                            }}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#00f0ff]/10 text-left transition-all group cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              <ToolIcon className="w-3.5 h-3.5 text-[#00f0ff] shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="min-w-0">
                                <span className="text-xs font-medium text-white/90 group-hover:text-[#00f0ff] truncate block">
                                  {tool.name}
                                </span>
                                <span className="text-[10px] text-white/40 truncate block">
                                  {tool.tagline}
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-white/60 group-hover:bg-[#00f0ff] group-hover:text-black shrink-0 font-bold transition-colors">
                              Open
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/10 bg-black/50 flex flex-col gap-2">
            <div className="text-[10px] font-mono text-center text-white/30">
              QuickFree Tools • 100 Tools • 100% In-Browser Compute
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
