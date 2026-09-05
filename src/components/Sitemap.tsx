import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  Search, 
  Layers, 
  DollarSign, 
  Code2, 
  Clock, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { TOOLS_DATA } from '../data/toolsData';
import { MASTER_NODES } from '../data/masterNodes';
import { generateXmlSitemap, generateSitemapEntries } from '../utils/sitemap';
import { ToolItem, ToolCategory } from '../types';

interface SitemapProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool?: (tool: ToolItem) => void;
}

export const Sitemap: React.FC<SitemapProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<ToolCategory>('all');

  if (!isOpen) return null;

  const xmlContent = generateXmlSitemap();
  const sitemapEntries = generateSitemapEntries();

  const handleCopyXml = async () => {
    try {
      await navigator.clipboard.writeText(xmlContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = xmlContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sitemap.xml';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTools = TOOLS_DATA.filter(tool => {
    const matchesCat = filterCategory === 'all' || tool.masterNode === filterCategory || tool.category === filterCategory;
    const matchesQuery = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto overscroll-contain min-h-screen tool-modal-overlay [-webkit-overflow-scrolling:touch] pt-[calc(var(--nav-height,80px)+1.5rem)] md:pt-12 pb-16 sm:pb-12"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl my-0 sm:my-8 rounded-2xl sm:rounded-3xl border border-slate-300 dark:border-white/15 bg-white/95 dark:bg-[#070714]/95 backdrop-blur-2xl shadow-2xl p-4 sm:p-8 text-slate-900 dark:text-white flex flex-col tool-modal-surface mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-200/80 dark:border-white/10 pb-5 mb-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-0.5 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <div className="w-full h-full bg-slate-950/20 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                <Globe className="w-6 h-6 text-cyan-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                  Official XML Sitemap & Directory
                </h3>
                <span className="text-[11px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                  Protocol 0.9 ({sitemapEntries.length} Endpoints)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-white/60">
                Official Google-compliant Single-Page Application (SPA) sitemap index with canonical deep query endpoints
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10 transition-colors"
            aria-label="Close sitemap modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 shrink-0">
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'visual'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Internal Tool Links ({TOOLS_DATA.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('xml')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'xml'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Raw XML Sitemap</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-white text-xs font-semibold border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer"
              title="Copy XML markup to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied XML!' : 'Copy XML'}</span>
            </button>

            <button
              onClick={handleDownloadXml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all cursor-pointer"
              title="Download sitemap.xml file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download sitemap.xml</span>
            </button>
          </div>
        </div>

        {/* Tab Content 1: Visual Directory with Crawlable Links */}
        {activeTab === 'visual' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Search & Category Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-3 shrink-0">
              <div className="relative sm:col-span-6">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter crawlable routes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-1 sm:col-span-6 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filterCategory === 'all'
                      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50'
                      : 'text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  All ({TOOLS_DATA.length})
                </button>
                {MASTER_NODES.map(node => (
                  <button
                    key={node.id}
                    onClick={() => setFilterCategory(node.id as any)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                      filterCategory === node.id
                        ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50'
                        : 'text-slate-500 dark:text-white/50 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {node.tabLabel} ({node.expectedCount})
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Table of Direct Links */}
            <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-black/20 p-2 space-y-1.5 custom-scrollbar">
              {filteredTools.map((tool, index) => {
                return (
                  <div
                    key={tool.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200/70 dark:border-white/5 hover:border-purple-400/50 transition-all gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-[10px] font-mono font-bold text-slate-400 w-5 shrink-0 text-right">
                        #{index + 1}
                      </span>
                      <span className="text-base shrink-0">{tool.icon}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <a 
                            href={`?tool=${tool.id}`}
                            onClick={(e) => {
                              if (onSelectTool) {
                                e.preventDefault();
                                onSelectTool(tool);
                                onClose();
                              }
                            }}
                            className="text-xs font-bold text-slate-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors truncate"
                          >
                            {tool.name}
                          </a>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            tool.masterNode === 'finance_wealth'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                              : tool.masterNode === 'crypto_shields'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                              : 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          }`}>
                            {tool.categoryName || tool.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-white/50 truncate max-w-md">
                          {tool.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <code className="text-[10px] font-mono text-purple-600 dark:text-cyan-400 bg-purple-50 dark:bg-white/[0.04] px-2 py-0.5 rounded border border-purple-200 dark:border-white/10 hidden md:inline">
                        ?tool={tool.id}
                      </code>

                      <a
                        href={`?tool=${tool.id}`}
                        onClick={(e) => {
                          if (onSelectTool) {
                            e.preventDefault();
                            onSelectTool(tool);
                            onClose();
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/10 hover:bg-purple-600 hover:text-white dark:hover:bg-purple-600 transition-colors text-slate-600 dark:text-white/80"
                        title={`Open ${tool.name}`}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 2: Raw XML Output Viewer */}
        {activeTab === 'xml' && (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="flex items-center justify-between mb-2 shrink-0">
              <span className="text-xs font-mono text-slate-500 dark:text-white/60">
                sitemap.xml (Compliant with Google Sitemaps XML Protocol 0.9)
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{sitemapEntries.length} Total URLs Generated</span>
              </span>
            </div>

            <pre className="flex-1 p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs overflow-x-auto overflow-y-auto custom-scrollbar border border-white/10 leading-relaxed select-all">
              {xmlContent}
            </pre>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-white/50 shrink-0">
          <span className="flex items-center gap-1.5">
            <LinkIcon className="w-3 h-3 text-cyan-500" />
            <span>Clean canonical single-page XML sitemap compliant with Google Sitemaps 0.9 & W3C standards</span>
          </span>
          
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white font-semibold text-xs transition-colors cursor-pointer"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
