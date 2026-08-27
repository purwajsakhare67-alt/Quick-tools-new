import React from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Flame, 
  TrendingUp, 
  FileText, 
  Wand2, 
  Layers
} from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectTrendingTag: (tag: string) => void;
  totalToolsCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectTrendingTag,
  totalToolsCount
}) => {
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [isMac, setIsMac] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && navigator.platform) {
      setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform));
    }
  }, []);

  // Global hotkey (press 'Ctrl+K', 'Cmd+K', or '/' to focus search)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrlK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((document.activeElement?.tagName || ''));

      if (isCmdOrCtrlK || isSlash) {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const trendingTags = [
    { label: 'SIP Visualizer', query: 'SIP', icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Loan EMI', query: 'EMI', icon: Zap, color: 'text-indigo-500' },
    { label: 'AI Cutout', query: 'AI', icon: Wand2, color: 'text-pink-500' },
    { label: 'PDF Compressor', query: 'PDF', icon: FileText, color: 'text-rose-500' },
    { label: 'QR Code Pro', query: 'QR', icon: Layers, color: 'text-cyan-500' },
    { label: 'Compound Interest', query: 'Compound', icon: Sparkles, color: 'text-purple-500' }
  ];

  return (
    <section className="relative pt-8 sm:pt-14 pb-10 sm:pb-16 text-center max-w-5xl mx-auto px-4 sm:px-6" id="home">
      
      {/* Top Value Pill */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white/90 shadow-sm backdrop-blur-xl mb-6 sm:mb-8"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
        </span>
        <span className="text-cyan-600 dark:text-cyan-300 font-bold">{totalToolsCount}+ Pro Utilities</span>
        <span className="text-slate-400 dark:text-white/30">•</span>
        <span>Zero Paywalls & No Account Required</span>
      </motion.div>

      {/* Main Bold Hero Title */}
      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12] mb-6"
      >
        Premium Utilities & Financial Tools.<br className="hidden sm:inline" />{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
          100% Free. Forever.
        </span>
      </motion.h1>

      {/* Sub-headline */}
      <motion.p 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-white/60 max-w-3xl mx-auto mb-8 sm:mb-10 font-normal leading-relaxed"
      >
        No subscriptions, no logins, no hidden fees. Access a complete suite of high-tier production tools directly from your browser.
      </motion.p>

      {/* High-Utility Interactive Search Bar in Frosted Glass */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="max-w-2xl mx-auto relative group"
      >
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 opacity-20 group-hover:opacity-40 blur-xl transition duration-500 group-focus-within:opacity-60"></div>
        
        <div className="relative flex items-center rounded-2xl border border-slate-300/80 dark:border-white/10 bg-white/80 dark:bg-white/5 shadow-2xl backdrop-blur-xl overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
          <div className="pl-4 sm:pl-5 text-slate-400 dark:text-white/40">
            <Search className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-cyan-400" />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 50+ free premium tools (e.g., SIP, PDF, AI)..."
            className="w-full py-4 sm:py-5 px-3 sm:px-4 text-base sm:text-lg bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-white/30 focus:outline-hidden font-medium"
            id="hero-search-input"
          />

          {searchQuery ? (
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className="pr-4 text-slate-400 hover:text-slate-600 dark:text-white/40 dark:hover:text-white transition-colors p-1 cursor-pointer"
              aria-label="Clear search"
              id="btn-clear-search"
            >
              <X className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 pr-4 text-slate-400 dark:text-white/40">
              <kbd className="px-2 py-1 text-[11px] font-semibold bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-white/70 rounded-md border border-slate-300 dark:border-white/10 flex items-center gap-0.5 shadow-xs">
                <span>{isMac ? '⌘K' : 'Ctrl+K'}</span>
              </kbd>
              <span className="text-xs">or</span>
              <kbd className="px-2 py-1 text-[11px] font-semibold bg-slate-200/70 dark:bg-white/10 text-slate-600 dark:text-white/70 rounded-md border border-slate-300 dark:border-white/10 shadow-xs">
                /
              </kbd>
            </div>
          )}
        </div>
      </motion.div>

      {/* Trending Quick Search Buttons in Frosted Glass */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-white/50"
      >
        <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-white/70">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Popular Searches:
        </span>
        {trendingTags.map((tag) => (
          <motion.button
            key={tag.label}
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectTrendingTag(tag.query)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white transition-colors font-medium backdrop-blur-md cursor-pointer"
            id={`trending-tag-${tag.query.toLowerCase()}`}
          >
            <tag.icon className={`w-3.5 h-3.5 ${tag.color}`} />
            {tag.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Trust & Performance Badges Bar in Frosted Glass */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-10 sm:mt-14 pt-8 border-t border-slate-200/80 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
      >
        <motion.div 
          whileHover={{ y: -3, scale: 1.02 }}
          className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-white/80"
        >
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white">100% Client-Side</div>
            <div className="text-[11px] text-slate-500 dark:text-white/40">Data never leaves browser</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, scale: 1.02 }}
          className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-white/80"
        >
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400">
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Instant Compute</div>
            <div className="text-[11px] text-slate-500 dark:text-white/40">Zero backend lag</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, scale: 1.02 }}
          className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-white/80"
        >
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white">Free Forever</div>
            <div className="text-[11px] text-slate-500 dark:text-white/40">No credit card or limits</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, scale: 1.02 }}
          className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md text-slate-700 dark:text-white/80"
        >
          <div className="p-2 rounded-xl bg-pink-500/10 text-pink-500 dark:text-pink-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-900 dark:text-white">50+ Micro-Tools</div>
            <div className="text-[11px] text-slate-500 dark:text-white/40">Finance, Tech & AI</div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
};

