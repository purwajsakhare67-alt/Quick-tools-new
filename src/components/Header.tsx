import React from 'react';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  BookOpen,
  Compass, 
  Shield, 
  Info,
  Menu,
  X
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
  onOpenSidebarDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenAbout,
  onOpenPrivacy,
  onNavigateToSection,
  onOpenSidebarDrawer
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { CurrencySelectorBar } = useCurrency();
  const { SoundToggleButton, playClick, playToggle, playToolSelect } = useSound();

  const handleThemeChange = () => {
    playToggle();
    onToggleTheme();
  };

  const handleDrawerOpen = () => {
    playToolSelect();
    if (onOpenSidebarDrawer) onOpenSidebarDrawer();
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-40 transition-all duration-300 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#02020a]/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Left Side: Brand Logo + Browse Tools Drawer Trigger */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              playClick();
              onNavigateToSection('home');
            }}
            className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
            id="brand-logo-link"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all">
              <div className="w-full h-full bg-slate-950/80 dark:bg-[#02020a]/80 backdrop-blur-md rounded-[14px] flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 flex items-center gap-1.5">
                QuickFree Tools <span className="text-pink-400 text-lg">✨</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-white/50 -mt-1 tracking-wider uppercase">
                100% Free • Zero Subscriptions
              </span>
            </div>
          </a>

          {/* Interactive Multi-line Drawer Trigger */}
          {onOpenSidebarDrawer && (
            <button
              onClick={handleDrawerOpen}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 dark:bg-white/10 dark:hover:bg-white/15 text-purple-700 dark:text-cyan-300 border border-purple-500/25 dark:border-white/15 text-xs font-black uppercase tracking-wider transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-xs cursor-pointer backdrop-blur-md"
              title="Open Sidebar Directory of All 35 Tools"
              id="btn-browse-tools-drawer"
            >
              <Menu className="w-4 h-4 text-purple-600 dark:text-cyan-400" />
              <span className="hidden xs:inline sm:inline">Browse Tools</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] bg-purple-500/20 text-purple-700 dark:text-cyan-200 hidden md:inline">
                35
              </span>
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
          <button 
            onClick={() => {
              playClick();
              onNavigateToSection('home');
            }}
            className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            id="nav-link-home"
          >
            Home
          </button>
          
          <button 
            onClick={() => {
              playClick();
              onNavigateToSection('tools-section');
            }}
            className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-link-tools"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            All Engines (35)
          </button>
          
          <button 
            onClick={() => {
              playClick();
              onOpenAbout();
            }}
            className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-link-about"
          >
            <Info className="w-4 h-4 text-purple-400" />
            About Us
          </button>
          
          <button 
            onClick={() => {
              playClick();
              onOpenPrivacy();
            }}
            className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-white/80 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-link-privacy"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            Privacy Policy
          </button>
        </nav>

        {/* Right Side: Currency Selector, Audio Toggle & Theme Toggle Switch */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Universal Currency Selector */}
          <div className="hidden lg:block">
            <CurrencySelectorBar variant="compact" />
          </div>

          {/* Toggleable Subtle Audio Feedback */}
          <SoundToggleButton id="header-sound-toggle-btn" />

          {/* 3-Way Frosted Theme Switch Button (Light -> Dark -> Reading Mode) */}
          <button
            onClick={handleThemeChange}
            className="relative p-2.5 sm:px-3.5 sm:py-2 rounded-2xl bg-white/70 dark:bg-white/10 reading:bg-[#f4ecd8] border border-slate-300 dark:border-white/20 text-slate-800 dark:text-white reading:text-[#5b4636] hover:border-purple-400 dark:hover:border-white/40 shadow-xs backdrop-blur-md transition-all flex items-center gap-2 text-xs font-bold cursor-pointer"
            aria-label="Cycle theme mode (Light, Dark, Reading)"
            id="theme-toggle-button"
            title={`Current: ${theme === 'light' ? 'Light Mode' : theme === 'dark' ? 'Dark Mode' : 'Reading Mode'}. Click to cycle mode.`}
          >
            {theme === 'light' && (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            )}
            {theme === 'dark' && (
              <>
                <Moon className="w-4 h-4 text-purple-400" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
            {theme === 'reading' && (
              <>
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span className="hidden sm:inline">Reading Mode</span>
              </>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-white/80 hover:bg-slate-200/60 dark:hover:bg-white/10 cursor-pointer"
            aria-label="Toggle mobile menu"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-white/10 px-4 pt-3 pb-5 space-y-2 bg-white/95 dark:bg-[#02020a]/95 backdrop-blur-2xl">
          <button
            onClick={() => {
              playClick();
              onNavigateToSection('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-white/90 hover:bg-purple-50 dark:hover:bg-white/10 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => {
              playClick();
              onNavigateToSection('tools-section');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-white/90 hover:bg-purple-50 dark:hover:bg-white/10 flex items-center justify-between cursor-pointer"
          >
            <span>All Tools</span>
            <span className="text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold">50+</span>
          </button>
          <button
            onClick={() => {
              playClick();
              onOpenAbout();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-white/90 hover:bg-purple-50 dark:hover:bg-white/10 cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => {
              playClick();
              onOpenPrivacy();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm font-medium rounded-xl text-slate-700 dark:text-white/90 hover:bg-purple-50 dark:hover:bg-white/10 cursor-pointer"
          >
            Privacy Policy
          </button>
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Audio Feedback:</span>
            <SoundToggleButton id="mobile-sound-toggle-btn" />
          </div>
          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Global Currency:</span>
            <CurrencySelectorBar variant="compact" />
          </div>
        </div>
      )}
    </header>
  );
};
