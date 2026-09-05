import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  BookOpen,
  Compass, 
  Info,
  Search,
  LayoutGrid,
  SlidersHorizontal
} from 'lucide-react';
import { ThemeMode } from '../types';
import { useCurrency } from '../context/CurrencyContext';
import { useSound } from '../context/SoundContext';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenCategoriesOverlay: () => void;
  onOpenOperationsHub: () => void;
  onOpenSpotlight?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenAbout,
  onNavigateToSection,
  onOpenCategoriesOverlay,
  onOpenOperationsHub,
  onOpenSpotlight
}) => {
  const { CurrencySelectorBar } = useCurrency();
  const { SoundToggleButton, playClick, playToggle, playToolSelect } = useSound();

  const handleThemeChange = () => {
    playToggle();
    onToggleTheme();
  };

  const handleCategoriesClick = () => {
    playToolSelect();
    onOpenCategoriesOverlay();
  };

  const handleOperationsHubClick = () => {
    playClick();
    onOpenOperationsHub();
  };

  return (
    <header 
      className="sticky top-0 left-0 right-0 z-40 transition-all duration-300 cyber-floating-nav border-b border-[#00f0ff]/15 dark:border-[#00f0ff]/20 shadow-[0_4px_20px_-2px_rgba(0,240,255,0.08),0_0_15px_-3px_rgba(189,0,255,0.1)]"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
      id="main-app-header"
    >
      {/* Top Cyberpunk Neon Hairline Glow Bar (#00f0ff to #bd00ff) */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00f0ff] to-[#bd00ff] opacity-85 shadow-[0_0_10px_#00f0ff,0_0_18px_#bd00ff]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Left Side: Brand Logo + 1. Left Circle Action: Modular Grid Categories Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              playClick();
              onNavigateToSection('home');
            }}
            className="group flex items-center gap-2 sm:gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
            id="brand-logo-link"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#00f0ff] via-[#bd00ff] to-[#ff007f] p-[2px] shadow-[0_0_15px_rgba(0,240,255,0.35)] group-hover:shadow-[0_0_22px_rgba(189,0,255,0.6)] transition-all duration-300">
              <div className="w-full h-full bg-[#07070b]/90 backdrop-blur-md rounded-[14px] flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#00f0ff] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] via-[#c084fc] to-[#bd00ff] flex items-center gap-1.5 font-heading">
                QuickFree Tools <span className="text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_8px_rgba(0,240,255,0.2)]">100 NODES</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-cyan-200/50 -mt-0.5 tracking-wider uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff9f] animate-ping inline-block" />
                Zero Cost • 100% In-Browser Compute
              </span>
            </div>
          </a>

          {/* 1. Left Circle Action - Modular Grid Categories Toggle (High-Tech 4-Square Grid Icon) */}
          <button
            onClick={handleCategoriesClick}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_12px_rgba(0,240,255,0.15)] cursor-pointer backdrop-blur-md"
            title="Modular Grid Categories Toggle (8 Master Nodes Tabs)"
            id="btn-modular-grid-categories-toggle"
          >
            <LayoutGrid className="w-4 h-4 text-[#00f0ff]" />
            <span className="hidden xs:inline sm:inline font-sans">8 Master Nodes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-[#00f0ff]/20 text-cyan-200 font-mono hidden md:inline">
              100
            </span>
          </button>
        </div>

        {/* Desktop Navigation Links + Spotlight Shortcut Trigger */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {/* Quick Spotlight Global Search Button in Header */}
          <button
            onClick={() => {
              playClick();
              if (onOpenSpotlight) {
                onOpenSpotlight();
              } else {
                const searchInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
                if (searchInput) {
                  searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  searchInput.focus();
                  searchInput.select();
                }
              }
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/40 dark:bg-white/5 hover:bg-[#00f0ff]/10 border border-white/10 hover:border-[#00f0ff]/40 text-xs text-slate-600 dark:text-white/70 hover:text-[#00f0ff] transition-all cursor-pointer shadow-xs group"
            title="Search 100 tools or ask any research query (⌘K)"
            id="nav-spotlight-trigger"
          >
            <Search className="w-3.5 h-3.5 text-[#00f0ff] group-hover:scale-110 transition-transform" />
            <span className="font-medium">Dual Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white/10 dark:bg-white/10 border border-white/20 rounded text-slate-400 dark:text-cyan-200">
              ⌘K
            </kbd>
          </button>

          <button 
            onClick={() => {
              playClick();
              onNavigateToSection('tools-section');
            }}
            className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-[#00f0ff] dark:hover:text-[#00f0ff] hover:bg-white/5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-link-tools"
          >
            <Compass className="w-4 h-4 text-[#00f0ff]" />
            Master Nodes (8)
          </button>
          
          <button 
            onClick={() => {
              playClick();
              onOpenAbout();
            }}
            className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-[#bd00ff] dark:hover:text-[#bd00ff] hover:bg-white/5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-link-about"
          >
            <Info className="w-4 h-4 text-[#bd00ff]" />
            Architecture
          </button>
        </nav>

        {/* Right Side Controls: Currency, Audio, Theme & 2. Global Operations Hub (Sliders glyph) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Universal Currency Selector (Compact on Header) */}
          <div className="hidden lg:flex items-center">
            <CurrencySelectorBar variant="compact" />
          </div>

          {/* Sound Audio Feedback Button */}
          <div className="hidden sm:flex items-center">
            <SoundToggleButton id="header-sound-btn" />
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={handleThemeChange}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 dark:bg-white/10 reading:bg-[#eedfc3] hover:bg-[#00f0ff]/15 dark:hover:bg-[#00f0ff]/15 text-slate-800 dark:text-white reading:text-[#432818] border border-slate-300 dark:border-white/15 reading:border-[#cbb393] hover:border-[#00f0ff]/50 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Cycle theme: Day Light, Obsidian Dark, Sepia Reading"
            id="theme-mode-toggle-btn"
          >
            {theme === 'light' && (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline font-mono">Day Light</span>
              </>
            )}
            {theme === 'dark' && (
              <>
                <Moon className="w-4 h-4 text-[#00f0ff]" />
                <span className="hidden sm:inline font-mono">Obsidian</span>
              </>
            )}
            {theme === 'reading' && (
              <>
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span className="hidden sm:inline font-mono">Sepia</span>
              </>
            )}
          </button>

          {/* 2. Right Circle Action - The Global Operations Hub & Sliding Glass Drawer (iPhone Sliders glyph) */}
          <button
            onClick={handleOperationsHubClick}
            className="relative p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-gradient-to-tr from-[#00f0ff]/15 to-[#bd00ff]/15 hover:from-[#00f0ff]/25 hover:to-[#bd00ff]/25 border border-[#00f0ff]/40 hover:border-[#00f0ff]/70 text-[#00f0ff] hover:text-white shadow-[0_0_12px_rgba(0,240,255,0.2)] hover:shadow-[0_0_18px_rgba(0,240,255,0.35)] backdrop-blur-md transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] flex items-center gap-1.5 sm:gap-2 text-xs font-mono font-bold cursor-pointer"
            aria-label="Open Global Operations Hub"
            id="header-operations-hub-btn"
            title="Open Global Operations Hub (Favorites, Shortcuts, Bulk Exporter, System Parameters)"
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#00f0ff]" />
            <span className="hidden lg:inline font-sans font-bold">Operations Hub</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping hidden sm:inline-block" />
          </button>
        </div>
      </div>
    </header>
  );
};
