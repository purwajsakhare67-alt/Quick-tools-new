import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutGrid, 
  TrendingUp, 
  Code2, 
  Type, 
  Terminal, 
  Palette, 
  ShieldCheck, 
  BarChart3, 
  Calculator, 
  ArrowRight,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { MASTER_NODES } from '../data/masterNodes';
import { MasterNodeId } from '../types';
import { useSound } from '../context/SoundContext';

interface ModularCategoryOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMasterNode: MasterNodeId;
  onSelectMasterNode: (nodeId: MasterNodeId) => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  Code2,
  Type,
  Terminal,
  Palette,
  ShieldCheck,
  BarChart3,
  Calculator
};

export const ModularCategoryOverlay: React.FC<ModularCategoryOverlayProps> = ({
  isOpen,
  onClose,
  selectedMasterNode,
  onSelectMasterNode
}) => {
  const [filterText, setFilterText] = useState('');
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

  // Lock body scroll when open
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

  const filteredNodes = MASTER_NODES.filter(node => 
    node.name.toLowerCase().includes(filterText.toLowerCase()) ||
    node.description.toLowerCase().includes(filterText.toLowerCase()) ||
    node.tabLabel.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectNode = (nodeId: MasterNodeId) => {
    playToolSelect();
    onSelectMasterNode(nodeId);
    onClose();
    // Smooth scroll to tools grid
    setTimeout(() => {
      const el = document.getElementById('tools-section') || document.getElementById('tools-grid-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-overlay-title"
      id="modular-category-overlay-container"
    >
      {/* Dark Translucent Glass Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Main Glass Modal Panel */}
      <div 
        className="relative w-full max-w-5xl my-auto rounded-3xl border border-[#00f0ff]/30 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,240,255,0.2)] overflow-hidden transition-all duration-300 animate-in zoom-in-95"
        style={{
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          background: 'rgba(10, 10, 14, 0.90)'
        }}
      >
        {/* Top Cyberpunk Glow Strip */}
        <div className="h-[2px] w-full bg-gradient-to-r from-[#00f0ff] via-[#bd00ff] to-[#ff007f] shadow-[0_0_15px_#00f0ff]" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30">
                  8 Master Nodes
                </span>
                <span className="text-xs font-mono text-cyan-200/60">
                  100 In-Browser Engines
                </span>
              </div>
              <h2 id="category-overlay-title" className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 font-heading">
                Modular Grid Categories
              </h2>
            </div>
          </div>

          {/* Search within Categories + Close Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-300/60" />
              <input 
                type="text"
                placeholder="Filter 8 categories..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 focus:bg-black/50 border border-white/15 focus:border-[#00f0ff] text-xs text-white placeholder-slate-400 focus:outline-hidden transition-colors font-mono"
              />
            </div>

            <button
              onClick={() => {
                playClick();
                onClose();
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-all cursor-pointer"
              aria-label="Close categories overlay"
              id="btn-close-category-overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8-Card Modular Grid Body */}
        <div className="p-4 sm:p-6 max-h-[68vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {filteredNodes.map((node) => {
              const IconComponent = ICON_MAP[node.icon] || LayoutGrid;
              const isActive = selectedMasterNode === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => handleSelectNode(node.id)}
                  className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#00f0ff]/15 border-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.3)] ring-1 ring-[#00f0ff]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#00f0ff]/50'
                  }`}
                  id={`overlay-node-card-${node.id}`}
                >
                  {/* Top Accent Gradient Line */}
                  <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${node.gradient} opacity-80`} />

                  <div>
                    {/* Top Row: Node # + Icon + Tool Count */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold ${
                          isActive ? 'bg-[#00f0ff] text-black shadow-[0_0_8px_#00f0ff]' : 'bg-white/10 text-white/70'
                        }`}>
                          0{node.tabNumber}
                        </span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
                          isActive ? 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]' : 'bg-white/5 border-white/10 text-white/70 group-hover:text-[#00f0ff]'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isActive ? 'bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40' : 'bg-white/10 text-white/60'
                      }`}>
                        {node.expectedCount} Tools
                      </span>
                    </div>

                    {/* Node Title */}
                    <h3 className={`text-base font-bold tracking-tight mb-1.5 transition-colors ${
                      isActive ? 'text-[#00f0ff]' : 'text-white group-hover:text-cyan-200'
                    }`}>
                      {node.name}
                    </h3>

                    {/* Node Description */}
                    <p className="text-xs text-white/60 line-clamp-2 leading-relaxed mb-4">
                      {node.description}
                    </p>
                  </div>

                  {/* Bottom Action Indicator */}
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono mt-auto">
                    {isActive ? (
                      <span className="flex items-center gap-1.5 text-xs text-[#00f0ff] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active Tab</span>
                      </span>
                    ) : (
                      <span className="text-white/40 group-hover:text-white transition-colors">
                        Select Category
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                      isActive ? 'text-[#00f0ff]' : 'text-white/40 group-hover:text-cyan-300'
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50 font-mono">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/15 text-cyan-200 text-[11px]">
              G
            </kbd>
            <span>Keyboard shortcut to open this categories grid</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Zero Server Queries • 100% In-Browser</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
