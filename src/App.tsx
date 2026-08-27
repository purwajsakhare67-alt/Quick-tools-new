/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { ThemeMode, ToolCategory, ToolItem } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { SidebarDrawer } from './components/SidebarDrawer';
import { InteractiveToolModal } from './components/InteractiveToolModal';
import { AboutModal } from './components/AboutModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Sitemap } from './components/Sitemap';
import { Footer } from './components/Footer';
import { CurrencyProvider } from './context/CurrencyContext';
import { SoundProvider } from './context/SoundContext';
import { playSound } from './utils/audioFeedback';

export default function App() {
  // Theme State with LocalStorage Persistence (3-Way Cycle: light -> dark -> reading)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('quickfree_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light' || saved === 'reading') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Search & Filter State (Default: 'financial' as requested)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('financial');
  const [isolatedToolId, setIsolatedToolId] = useState<string | null>(null);

  // Modals & Drawer State
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [sitemapOpen, setSitemapOpen] = useState(false);

  // Helper to open a tool with tactile sound feedback
  const handleLaunchTool = (tool: ToolItem) => {
    playSound('toolSelect');
    setActiveTool(tool);
  };

  // Helper to close active tool and reset URL & isolation
  const handleCloseTool = () => {
    playSound('click');
    setActiveTool(null);
    setIsolatedToolId(null);
  };

  // Reset isolation to show all tools normally
  const handleResetIsolation = () => {
    playSound('click');
    setIsolatedToolId(null);
  };

  const handleSelectCategory = (cat: ToolCategory) => {
    playSound('click');
    setSelectedCategory(cat);
    setIsolatedToolId(null);
  };

  // Deep-linking URL Route Listener: Runs only on initial mount to isolate matching tool quietly
  useEffect(() => {
    const parseIncomingUrl = () => {
      // 1. Check URL Query Parameter (e.g., ?tool=sip or ?t=mortgage)
      const urlParams = new URLSearchParams(window.location.search);
      const queryParamTool = urlParams.get('tool') || urlParams.get('t');

      // 2. Check URL Hash (e.g., #fire-estimator, #tool-sip-visualizer, #sip, #tool-json)
      const rawHash = window.location.hash.replace(/^#/, '').trim();

      const candidate = (queryParamTool || rawHash).toLowerCase();

      // Handle sitemap deep links directly
      if (candidate === 'sitemap' || candidate === 'sitemap-xml' || candidate === 'sitemap.xml') {
        setIsolatedToolId(null);
        setSitemapOpen(true);
        return;
      }

      // If no tool identifier is in the URL, strictly keep modal closed (never open intentionally on homepage)
      if (!candidate || candidate === 'home' || candidate === 'tools' || candidate === 'categorynav') {
        setIsolatedToolId(null);
        return;
      }

      const cleanCandidate = candidate.replace(/^tool-/, '');

      // Locate matching tool among all 35 high-precision engines
      const matched = TOOLS_DATA.find(t => {
        const idLower = t.id.toLowerCase();
        const idMatch = idLower === candidate || idLower === cleanCandidate;
        const nameSlug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slugMatch = nameSlug === candidate || nameSlug === cleanCandidate || nameSlug.includes(cleanCandidate) || cleanCandidate.includes(nameSlug);
        const tagMatch = t.tags.some(tag => {
          const tagLower = tag.toLowerCase();
          return tagLower === candidate || tagLower === cleanCandidate || cleanCandidate.includes(tagLower) || tagLower.includes(cleanCandidate);
        });
        
        // Additional intelligent aliases (e.g. fire-estimator -> fire-retirement-age)
        const aliasMatch = (cleanCandidate.includes('fire') && idLower.includes('fire')) ||
          (cleanCandidate.includes('sip') && idLower.includes('sip')) ||
          (cleanCandidate.includes('emi') && idLower.includes('emi')) ||
          (cleanCandidate.includes('crypto') && idLower.includes('crypto')) ||
          (cleanCandidate.includes('cagr') && idLower.includes('cagr')) ||
          (cleanCandidate.includes('inflation') && idLower.includes('inflation')) ||
          (cleanCandidate.includes('salary') && idLower.includes('salary')) ||
          (cleanCandidate.includes('json') && idLower.includes('json')) ||
          (cleanCandidate.includes('jwt') && idLower.includes('jwt')) ||
          (cleanCandidate.includes('regex') && idLower.includes('regex')) ||
          (cleanCandidate.includes('password') && idLower.includes('password')) ||
          (cleanCandidate.includes('qr') && idLower.includes('qr')) ||
          (cleanCandidate.includes('bmi') && idLower.includes('bmi')) ||
          (cleanCandidate.includes('pomodoro') && idLower.includes('pomodoro'));

        return idMatch || slugMatch || tagMatch || aliasMatch;
      });

      if (matched) {
        // Automatically select the category where that tool belongs
        setSelectedCategory(matched.category);
        // Isolate the searched tool card quietly with ZERO screen movement
        setIsolatedToolId(matched.id);

        // Force top scroll & clean history state to strip hash fragment and prevent automatic browser jumps
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        history.replaceState("", document.title, window.location.pathname + window.location.search);
      } else {
        setIsolatedToolId(null);
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Force top scroll upon initial execution
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Run once on initial page load (handles direct Google Search entries)
    parseIncomingUrl();
  }, []);

  // Sync theme with HTML root class, body & data-theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'reading');
    document.body.classList.remove('dark', 'reading');
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else if (theme === 'reading') {
      root.classList.add('reading');
      document.body.classList.add('reading');
      root.setAttribute('data-theme', 'reading');
    } else {
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem('quickfree_theme', theme);
  }, [theme]);

  // 3-Way Mechanical Toggle Loop (State 0: Light -> State 1: Dark -> State 2: Reading)
  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'reading';
      return 'light';
    });
  };

  // Global keyboard shortcut: Ctrl+K / Cmd+K to open & focus search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrlK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdOrCtrlK) {
        e.preventDefault();
        // Close any overlapping modals
        setActiveTool(null);
        setAboutOpen(false);
        setPrivacyOpen(false);
        setSidebarDrawerOpen(false);

        // Find and focus search bar
        setTimeout(() => {
          const searchInput = document.getElementById('hero-search-input') as HTMLInputElement | null;
          if (searchInput) {
            searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            searchInput.focus();
            searchInput.select();
          }
        }, 50);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Filter tools based on search query, category and direct isolation
  const filteredTools = useMemo(() => {
    // 1. If a tool was isolated via direct Google Search link and no user search is active
    if (isolatedToolId && !searchQuery.trim()) {
      const isolated = TOOLS_DATA.find(t => t.id === isolatedToolId);
      if (isolated) {
        return [isolated];
      }
    }

    return TOOLS_DATA.filter((tool) => {
      let matchesCategory = true;
      if (selectedCategory === 'financial') {
        matchesCategory = tool.category === 'financial';
      } else if (selectedCategory === 'tech_utilities') {
        matchesCategory = tool.category === 'tech_utilities';
      } else if (selectedCategory === 'productivity') {
        matchesCategory = tool.category === 'productivity_math' || tool.category === 'ai_media' || tool.category === 'productivity';
      } else if (selectedCategory === 'all') {
        matchesCategory = true;
      } else {
        matchesCategory = tool.category === selectedCategory;
      }

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.description.toLowerCase().includes(q);
      const taglineMatch = tool.tagline.toLowerCase().includes(q);
      const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));

      return nameMatch || descMatch || taglineMatch || tagMatch;
    });
  }, [searchQuery, selectedCategory, isolatedToolId]);

  const handleSelectTrendingTag = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory('all');
    const toolsSection = document.getElementById('tools-section');
    if (toolsSection) {
      toolsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CurrencyProvider>
      <SoundProvider>
        <div className="min-h-screen pb-24 sm:pb-28 bg-slate-100 dark:bg-[#02020a] reading:bg-[#fbf0d9] text-slate-900 dark:text-white reading:text-[#5b4636] relative selection:bg-purple-500/30 selection:text-white transition-colors duration-300 overflow-x-hidden font-sans">
        
        {/* Frosted Glass Dynamic Ambient Glow Spheres */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Top-Left Purple Glow Orb */}
          <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-purple-600/40 dark:bg-purple-600/35 rounded-full blur-[120px]"></div>
          {/* Bottom-Right Blue Glow Orb */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[550px] h-[550px] bg-blue-600/40 dark:bg-blue-600/30 rounded-full blur-[120px]"></div>
          {/* Mid-Right Pink Accent Orb */}
          <div className="absolute top-[30%] right-[20%] w-[350px] h-[350px] bg-pink-600/30 dark:bg-pink-600/25 rounded-full blur-[100px]"></div>
          {/* Mid-Left Cyan Ambient Accent */}
          <div className="absolute top-[60%] left-[10%] w-[400px] h-[400px] bg-cyan-500/20 dark:bg-cyan-500/15 rounded-full blur-[110px]"></div>
        </div>

        {/* Sticky Glassmorphic Navigation Bar */}
        <Header 
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onNavigateToSection={handleNavigateToSection}
          onOpenSidebarDrawer={() => setSidebarDrawerOpen(true)}
        />

        {/* Main Content Area */}
        <main className="relative z-10">
          
          {/* Hero Section */}
          <Hero 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectTrendingTag={handleSelectTrendingTag}
            totalToolsCount={TOOLS_DATA.length}
          />

          {/* Premium Frosted Glass Tool Display Grid with Top 3 Category Pill Tabs */}
          <ToolGrid 
            tools={filteredTools}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onLaunchTool={handleLaunchTool}
            searchQuery={searchQuery}
            isolatedToolId={isolatedToolId}
            onResetIsolation={handleResetIsolation}
          />

        </main>

        {/* Clean Frosted Glass Footer Section */}
        <Footer 
          onOpenAbout={() => setAboutOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenSitemap={() => setSitemapOpen(true)}
          onScrollToTop={handleScrollToTop}
        />

        {/* Slide-out Navigation Drawer Menu (The Side Bar Directory) */}
        <SidebarDrawer 
          isOpen={sidebarDrawerOpen}
          onClose={() => setSidebarDrawerOpen(false)}
          tools={TOOLS_DATA}
          onSelectTool={handleLaunchTool}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setSearchQuery('');
          }}
          currentCategory={selectedCategory}
        />

        {/* Interactive Micro-Tool Modal with Live Calculations, Tests & Suggested Tools */}
        <InteractiveToolModal 
          tool={activeTool}
          onClose={handleCloseTool}
          onSelectTool={handleLaunchTool}
        />

        {/* About Us Modal */}
        <AboutModal 
          isOpen={aboutOpen}
          onClose={() => setAboutOpen(false)}
        />

        {/* Privacy Policy Modal */}
        <PrivacyModal 
          isOpen={privacyOpen}
          onClose={() => setPrivacyOpen(false)}
        />

        {/* Google SEO XML Sitemap & Crawlable URL Directory Modal */}
        <Sitemap 
          isOpen={sitemapOpen}
          onClose={() => setSitemapOpen(false)}
          onSelectTool={handleLaunchTool}
        />

        </div>
      </SoundProvider>
    </CurrencyProvider>
  );
}
