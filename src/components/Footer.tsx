import React from 'react';
import { Sparkles, Heart, Shield, Info, ArrowUp, Globe } from 'lucide-react';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenPrivacy: () => void;
  onOpenSitemap?: () => void;
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenPrivacy,
  onOpenSitemap,
  onScrollToTop
}) => {
  return (
    <footer className="relative border-t border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#02020a]/70 backdrop-blur-xl mt-20 transition-colors">
      
      {/* Top subtle neon line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400/50 via-purple-500/50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 p-[1.5px] flex items-center justify-center text-white">
                <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500">
                QuickFree Tools ✨
              </span>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-white/60 max-w-md leading-relaxed">
              The internet&apos;s most refined collection of free micro-utilities, financial models, and developer tools. Zero paywalls, zero accounts, and 100% private in-browser computation.
            </p>

            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>All 35+ Micro-Engines Operational • 0ms Server Latency</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation & Legal
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-white/60">
              <li>
                <a href="#home" className="hover:text-purple-600 dark:hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#tools-section" className="hover:text-purple-600 dark:hover:text-white transition-colors">
                  All Tools (35+)
                </a>
              </li>
              <li>
                <button 
                  onClick={onOpenAbout}
                  className="hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPrivacy}
                  className="hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSitemap}
                  className="hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-left font-medium"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Tools Sitemap & Index</span>
                </button>
              </li>
              <li>
                <a 
                  href="/sitemap.xml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-purple-600 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs text-slate-500 dark:text-white/40"
                >
                  <span>Raw sitemap.xml (Google)</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar with copyright and back to top */}
        <div className="pt-8 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-white/40">
          <p>
            © 2026 QuickFree Tools. Built with modern web standards and ultra-fast client-side execution.
          </p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for everyone
            </span>
            <button 
              onClick={onScrollToTop}
              className="p-2 rounded-xl bg-slate-200/70 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-700 dark:text-white transition-colors flex items-center gap-1 cursor-pointer font-bold"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
