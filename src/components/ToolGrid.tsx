import React from 'react';
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
  ArrowRight,
  Play,
  Sparkle
} from 'lucide-react';
import { ToolItem, ToolCategory } from '../types';

interface ToolGridProps {
  tools: ToolItem[];
  selectedCategory: ToolCategory;
  onSelectCategory: (category: ToolCategory) => void;
  onLaunchTool: (tool: ToolItem) => void;
  searchQuery: string;
  isolatedToolId?: string | null;
  onResetIsolation?: () => void;
}

// Icon mapping helper
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
  Timer
};

export const ToolGrid: React.FC<ToolGridProps> = ({
  tools,
  selectedCategory,
  onSelectCategory,
  onLaunchTool,
  searchQuery,
  isolatedToolId,
  onResetIsolation
}) => {
  const primaryCategories: { id: ToolCategory; label: string; icon: string; count: number; gradient: string; glow: string }[] = [
    { 
      id: 'financial', 
      label: 'Financial Engines', 
      icon: '💰', 
      count: 12,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      glow: 'shadow-emerald-500/25'
    },
    { 
      id: 'tech_utilities', 
      label: 'Developer & Tech Utilities', 
      icon: '💻', 
      count: 12,
      gradient: 'from-blue-600 via-indigo-600 to-purple-600',
      glow: 'shadow-indigo-500/25'
    },
    { 
      id: 'productivity', 
      label: 'Everyday Productivity', 
      icon: '⚡', 
      count: 11,
      gradient: 'from-pink-500 via-rose-500 to-amber-500',
      glow: 'shadow-pink-500/25'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: 'spring', 
        stiffness: 260, 
        damping: 20 
      }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="tools-section">
      
      {/* Top Category Pill Tabs Navigation Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-cyan-500 dark:text-cyan-400 font-bold text-xs sm:text-sm uppercase tracking-wider mb-1.5">
              <motion.span 
                initial={{ width: 0 }}
                animate={{ width: 24 }}
                transition={{ duration: 0.5 }}
                className="h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
              />
              <span>{isolatedToolId ? 'Direct Search Focus' : 'Dynamic Category Filter'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isolatedToolId ? 'Searched Engine Match' : 'Select Your Engine'}
            </h2>
          </div>

          {/* Quick status & reset indicator */}
          <div className="flex items-center gap-2">
            {(selectedCategory !== 'all' || isolatedToolId) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (onResetIsolation) onResetIsolation();
                  onSelectCategory('all');
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-slate-300 dark:border-white/15 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <span>⬅️ Show All 35 Tools</span>
              </motion.button>
            )}
            <motion.span 
              key={tools.length}
              initial={{ scale: 0.9, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20"
            >
              Showing {tools.length} of 35
            </motion.span>
          </div>
        </div>

        {/* 3 Vibrant Colorful Pill-Shaped Tabs Bar (Horizontal scrolling on mobile) */}
        <div className="relative p-2 rounded-3xl bg-white/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-purple-950/20 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-max p-1">
            {primaryCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative group px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-3 overflow-hidden ${
                    isActive
                      ? `bg-gradient-to-r ${cat.gradient} text-white shadow-xl ${cat.glow} ring-2 ring-white/30 dark:ring-white/20`
                      : 'bg-white/80 dark:bg-white/[0.04] text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/15'
                  }`}
                  id={`category-pill-${cat.id}`}
                >
                  {/* Active background indicator */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeCategoryGlow"
                      className="absolute inset-0 bg-white/20 dark:bg-white/10 backdrop-blur-xs pointer-events-none"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <motion.span 
                    animate={isActive ? { rotate: [0, -8, 8, 0], scale: [1, 1.15, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-lg sm:text-xl drop-shadow-xs"
                  >
                    {cat.icon}
                  </motion.span>
                  <span className="relative z-10">{cat.label}</span>
                  <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive 
                      ? 'bg-black/25 text-white' 
                      : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/60'
                  }`}>
                    {cat.count}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Passive Search Focus Banner when tool is isolated from direct search hash */}
      {isolatedToolId && tools.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-cyan-400/40 dark:border-cyan-400/30 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-cyan-500/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-500 dark:text-cyan-300 flex items-center justify-center text-lg font-bold shrink-0 animate-pulse">
              🎯
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <span>Matched Search Engine:</span>
                <span className="text-cyan-600 dark:text-cyan-300 underline decoration-cyan-400">{tools[0]?.name}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-white/60">
                All other cards have been isolated. Tap the glowing card below to calculate or view details.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onResetIsolation && (
              <button
                onClick={onResetIsolation}
                className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-black bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white border border-slate-700 dark:border-white/20 transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5"
              >
                <span>⬅️ Back to All Tools</span>
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Grid of Tools with Frosted Glass styling & Interactive Motion Animation */}
      {tools.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white/60 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10 p-8 backdrop-blur-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
            🔍
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            No micro-tools found for &ldquo;{searchQuery}&rdquo;
          </h3>
          <p className="text-sm text-slate-500 dark:text-white/40 max-w-md mx-auto mb-6">
            Try searching for common terms like &ldquo;SIP&rdquo;, &ldquo;EMI&rdquo;, &ldquo;PDF&rdquo;, &ldquo;AI&rdquo;, &ldquo;QR&rdquo;, or &ldquo;Crypto&rdquo;.
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => {
              if (onResetIsolation) onResetIsolation();
              onSelectCategory('financial');
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 cursor-pointer"
          >
            Reset Filters (Show Financial Engines)
          </motion.button>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div 
            key={`${selectedCategory}-${searchQuery}-${isolatedToolId || 'all'}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={
              isolatedToolId && tools.length === 1 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }
            id="tools-grid-container"
          >
            {tools.map((tool) => {
              const IconComponent = iconMap[tool.icon] || Sparkles;
              const isIsolated = isolatedToolId === tool.id;

              return (
                <motion.div
                  key={tool.id}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.015,
                    transition: { duration: 0.2, ease: 'easeOut' }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onLaunchTool(tool)}
                  className={`group relative rounded-3xl p-6 sm:p-7 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
                    isIsolated
                      ? 'bg-white/95 dark:bg-white/10 border-2 border-cyan-400 dark:border-cyan-300 ring-4 ring-cyan-400/40 dark:ring-cyan-400/30 shadow-2xl shadow-cyan-500/30 dark:shadow-cyan-400/20 animate-pulse'
                      : 'bg-white/70 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 hover:bg-white/90 dark:hover:bg-white/10 hover:border-cyan-400/50 dark:hover:border-cyan-400/40 hover:shadow-2xl hover:shadow-cyan-500/10'
                  }`}
                  id={`tool-card-${tool.id}`}
                >
                  {/* Background Subtle Gradient Lighting & Pulsing Hover Aura */}
                  <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br rounded-full blur-2xl transition-transform duration-500 pointer-events-none ${
                    isIsolated
                      ? 'from-cyan-400/30 via-purple-500/30 to-transparent scale-125 animate-spin-slow'
                      : 'from-cyan-500/15 via-purple-500/15 to-transparent group-hover:scale-150'
                  }`} />
                  
                  {/* Shimmer sweep effect on card hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent pointer-events-none" />

                  <div className="relative z-10">
                    {/* Top Row: Icon + Badge */}
                    <div className="flex items-start justify-between gap-3 mb-5">
                      
                      {/* Glowing Frosted Icon Box with interactive spin on hover */}
                      <motion.div 
                        whileHover={{ rotate: 8, scale: 1.08 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        className={`w-13 h-13 rounded-2xl bg-gradient-to-br ${tool.gradient} p-0.5 shadow-lg group-hover:shadow-cyan-500/30 transition-all duration-300 flex items-center justify-center text-white ${
                          isIsolated ? 'ring-2 ring-cyan-400 shadow-cyan-500/50' : ''
                        }`}
                      >
                        <div className="w-full h-full bg-slate-950/20 rounded-[14px] backdrop-blur-xs flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </motion.div>

                      {/* Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {isIsolated && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30 animate-bounce">
                            <Sparkle className="w-3 h-3 fill-current" />
                            Searched Engine
                          </span>
                        )}
                        {tool.badge && !isIsolated && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/60 dark:bg-white/10 text-purple-600 dark:text-cyan-300 border border-slate-200 dark:border-white/15 backdrop-blur-md group-hover:border-purple-400/40 transition-colors">
                            {tool.badge === 'Interactive Demo' && <Play className="w-2.5 h-2.5 fill-current animate-pulse" />}
                            {tool.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Category Name Tag */}
                    <span className="text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest block mb-1">
                      {tool.categoryName}
                    </span>

                    {/* Tool Title */}
                    <h3 className={`text-lg sm:text-xl font-bold tracking-tight mb-1 transition-colors ${
                      isIsolated 
                        ? 'text-cyan-600 dark:text-cyan-300 font-black' 
                        : 'text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-cyan-300'
                    }`}>
                      {tool.name}
                    </h3>

                    {/* Tagline / Subtitle */}
                    <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400/90 mb-2">
                      {tool.tagline}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-white/50 leading-relaxed line-clamp-3 mb-6">
                      {tool.description}
                    </p>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="relative z-10 pt-4 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400 dark:text-white/40">
                      {isIsolated ? '✨ Ready to Calculate' : (tool.stats || 'Instant & Free')}
                    </span>

                    <button
                      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm cursor-pointer ${
                        isIsolated
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/30 scale-105'
                          : 'bg-slate-900/90 dark:bg-white/10 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-purple-600 text-white border border-slate-700/50 dark:border-white/15 group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-purple-500/20'
                      }`}
                      aria-label={`Launch ${tool.name}`}
                    >
                      <span>{isIsolated ? 'Launch Engine' : 'Launch Tool'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
};

