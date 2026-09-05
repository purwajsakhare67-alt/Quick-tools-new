import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Check, 
  Copy, 
  Share2, 
  ExternalLink, 
  Terminal, 
  BookOpen, 
  Code2, 
  ShieldCheck, 
  Layers, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Globe
} from 'lucide-react';
import { ResearchDataResult, ToolItem } from '../types';
import { useSound } from '../context/SoundContext';

interface ResearchAnswerModalProps {
  researchData: ResearchDataResult | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchTool?: (tool: ToolItem) => void;
  allTools?: ToolItem[];
}

export const ResearchAnswerModal: React.FC<ResearchAnswerModalProps> = ({
  researchData,
  isOpen,
  onClose,
  onLaunchTool,
  allTools = []
}) => {
  const { playClick, playToolSelect } = useSound();
  const [showSchemaInspector, setShowSchemaInspector] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  if (!isOpen || !researchData) {
    return null;
  }

  const matchingTool = allTools.find(t => t.id === researchData.relevantToolId);
  const permalinkUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?q=${researchData.slug}` 
    : `https://quickfreetools.com/?q=${researchData.slug}`;

  const handleCopyAnswer = () => {
    playClick();
    navigator.clipboard.writeText(
      `${researchData.query}\n\n${researchData.snippetAnswer}\n\nKey Takeaways:\n${researchData.bulletPoints.map(b => `• ${b}`).join('\n')}\n\nSource: ${permalinkUrl}`
    );
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2500);
  };

  const handleCopyPermalink = () => {
    playClick();
    navigator.clipboard.writeText(permalinkUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopySchema = () => {
    playClick();
    const fullSchema = {
      "@context": "https://schema.org",
      "@graph": [
        researchData.schemaFaqJson,
        researchData.schemaTechArticleJson
      ]
    };
    navigator.clipboard.writeText(JSON.stringify(fullSchema, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2500);
  };

  const handleLaunchConnectedTool = () => {
    if (matchingTool && onLaunchTool) {
      playToolSelect();
      onClose();
      onLaunchTool(matchingTool);
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        id="research-answer-modal-overlay"
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl cursor-pointer -z-10"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl bg-[#0a0a10]/95 border border-[#00f0ff]/40 rounded-3xl shadow-[0_0_60px_rgba(0,240,255,0.2),0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-2xl flex flex-col max-h-[90vh] text-white"
          id="research-answer-modal-box"
          role="dialog"
          aria-modal="true"
          aria-labelledby="research-modal-title"
        >
          {/* Top Cyber Glow Hairline */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00f0ff] to-[#bd00ff] shadow-[0_0_12px_#00f0ff]" />

          {/* Modal Header */}
          <div className="px-5 sm:px-7 py-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#00f0ff] to-[#bd00ff] p-[1.5px] shrink-0 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
                <div className="w-full h-full bg-black/90 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                </div>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#00f0ff] px-2 py-0.5 rounded bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                    Dual Intelligence Engine
                  </span>
                  <span className="text-[10px] font-mono text-white/50 hidden sm:inline">
                    {researchData.category}
                  </span>
                </div>
                <h2 
                  id="research-modal-title"
                  className="text-base sm:text-lg font-bold text-white truncate tracking-tight"
                >
                  {researchData.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer border border-white/10"
                aria-label="Close research modal"
                id="btn-close-research-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body - Scrollable */}
          <div className="overflow-y-auto p-5 sm:p-7 space-y-6 custom-scroll">
            
            {/* 1. Google SERP Featured Snippet Simulator */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 shadow-inner relative overflow-hidden group">
              <div className="flex items-center justify-between text-xs font-mono text-white/50 mb-2.5">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>Google Rich Snippet & SERP Preview</span>
                </div>
                <span className="text-[10px] bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 px-2 py-0.5 rounded-full">
                  FAQPage + TechArticle JSON-LD Injected
                </span>
              </div>

              {/* Simulated Google Search Result */}
              <div className="space-y-1.5 font-sans">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <span className="text-white/40">https://quickfreetools.com</span>
                  <span className="text-white/20">›</span>
                  <span className="text-[#00f0ff] truncate">?q={researchData.slug}</span>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#8ab4f8] hover:underline cursor-pointer">
                  {researchData.title} — QuickFree Tools
                </h3>
                
                {/* Highlighted 40-50 Word Featured Snippet Box */}
                <div className="mt-2.5 p-3.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-white/95 text-sm sm:text-base leading-relaxed font-normal shadow-[0_0_20px_rgba(0,240,255,0.08)]">
                  <p>
                    <strong className="text-[#00f0ff] font-semibold">{researchData.snippetAnswer.split('.')[0]}.</strong>{' '}
                    {researchData.snippetAnswer.split('.').slice(1).join('.')}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Technical Breakdown & Core Principles */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-[#bd00ff]" />
                Architectural Breakdown & Core Principles
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {researchData.bulletPoints.map((point, idx) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm text-white/80"
                  >
                    <div className="w-5 h-5 rounded-md bg-[#bd00ff]/20 text-[#c084fc] flex items-center justify-center shrink-0 mt-0.5 text-xs font-mono font-bold">
                      {idx + 1}
                    </div>
                    <p className="leading-snug">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Mathematical Formula or Practical Example (If present) */}
            {researchData.technicalFormula && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-[#00ff9f]" />
                  Mathematical Specification / Computational Formula
                </h4>
                <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs sm:text-sm text-[#00ff9f] flex items-center justify-between gap-3 overflow-x-auto">
                  <code>{researchData.technicalFormula}</code>
                </div>
              </div>
            )}

            {researchData.practicalExample && (
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  Practical Calculation / Real-World Walkthrough
                </h4>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-xs sm:text-sm text-white/75 leading-relaxed font-sans">
                  {researchData.practicalExample}
                </div>
              </div>
            )}

            {/* 4. Connected Client-Side Tool (Direct Launch) */}
            {matchingTool && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00f0ff]/10 via-[#bd00ff]/10 to-transparent border border-[#00f0ff]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shrink-0">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-wider font-bold">
                      Interactive Client-Side Engine Ready
                    </span>
                    <h5 className="text-sm font-bold text-white">
                      {matchingTool.name}
                    </h5>
                    <p className="text-xs text-white/50 truncate max-w-md">
                      {matchingTool.tagline}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleLaunchConnectedTool}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0"
                  id="btn-launch-connected-tool-from-research"
                >
                  <span>Launch Engine</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* 5. Schema.org Rich Snippet JSON-LD Inspector (Accordion) */}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
              <button
                onClick={() => {
                  playClick();
                  setShowSchemaInspector(prev => !prev);
                }}
                className="w-full px-4 py-3 flex items-center justify-between text-xs font-mono text-white/70 hover:text-white bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer"
                id="btn-toggle-schema-inspector"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
                  <span>Inspect Live Schema.org JSON-LD (Head Script)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white/40">
                    {showSchemaInspector ? 'Collapse' : 'Expand'}
                  </span>
                  {showSchemaInspector ? (
                    <ChevronUp className="w-4 h-4 text-white/50" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/50" />
                  )}
                </div>
              </button>

              {showSchemaInspector && (
                <div className="p-4 border-t border-white/10 space-y-3 bg-[#050508]">
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                    <span>Target: document.head #seo-rich-snippet-schema</span>
                    <button
                      onClick={handleCopySchema}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[#00f0ff] flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedSchema ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSchema ? 'Copied' : 'Copy JSON'}</span>
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-cyan-300 overflow-x-auto p-3 rounded-lg bg-black/70 border border-white/10 max-h-56 custom-scroll">
                    {JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@graph": [
                          researchData.schemaFaqJson,
                          researchData.schemaTechArticleJson
                        ]
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>

          </div>

          {/* Modal Footer Bar */}
          <div className="px-5 sm:px-7 py-3.5 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-white/40 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] inline-block animate-ping" />
              <span>100% In-Browser RAM • Zero Telemetry</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAnswer}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/90 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                id="btn-copy-research-answer"
              >
                {copiedAnswer ? <Check className="w-3.5 h-3.5 text-[#00ff9f]" /> : <Copy className="w-3.5 h-3.5 text-cyan-300" />}
                <span>{copiedAnswer ? 'Answer Copied!' : 'Copy Answer'}</span>
              </button>

              <button
                onClick={handleCopyPermalink}
                className="px-3 py-1.5 rounded-xl bg-[#00f0ff]/15 hover:bg-[#00f0ff]/25 text-[#00f0ff] border border-[#00f0ff]/30 flex items-center gap-1.5 transition-all cursor-pointer"
                id="btn-copy-research-permalink"
                title="Copy permanent programmatic SEO URL: /?q=slug"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00ff9f]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy URL'}</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
