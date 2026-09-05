/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeMode, ToolItem, MasterNodeId, ResearchDataResult } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { MASTER_NODES } from './data/masterNodes';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ToolGrid } from './components/ToolGrid';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ModularCategoryOverlay } from './components/ModularCategoryOverlay';
import { GlobalOperationsHub } from './components/GlobalOperationsHub';
import { InteractiveToolModal } from './components/InteractiveToolModal';
import { AboutModal } from './components/AboutModal';
import { PrivacyModal } from './components/PrivacyModal';
import { Sitemap } from './components/Sitemap';
import { Footer } from './components/Footer';
import { OnlineStatusBanner } from './components/OnlineStatusBanner';
import { ResearchAnswerModal } from './components/ResearchAnswerModal';
import { CurrencyProvider } from './context/CurrencyContext';
import { SoundProvider } from './context/SoundContext';
import { playSound } from './utils/audioFeedback';
import { initFluidRippleSystem } from './utils/fluidRipple';
import { executeResearchQuery } from './utils/researchEngine';
import { 
  injectDynamicSeoSchema, 
  removeDynamicSeoSchema, 
  syncQueryToUrl, 
  extractQueryFromUrl,
  unslugifyQuery 
} from './utils/schemaEngine';

export default function App() {
  // Theme State with LocalStorage Persistence (3-Way Cycle: light -> dark -> reading)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('quickfree_theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light' || saved === 'reading') return saved;
    return 'dark'; // Default to unified Cyberpunk-Dark theme
  });

  // Master Node State (The 8 Master Nodes: Tab 1 to Tab 8, default: 'finance_wealth')
  const [selectedMasterNode, setSelectedMasterNode] = useState<MasterNodeId>('finance_wealth');
  const [searchQuery, setSearchQuery] = useState('');
  const [isolatedToolId, setIsolatedToolId] = useState<string | null>(null);

  // Spotlight Search Overlay Trigger State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Modals & Drawer States
  // 1. Left Circle Action Overlay: Modular Grid Categories
  const [categoryOverlayOpen, setCategoryOverlayOpen] = useState(false);
  // 2. Right Circle Action Drawer: Global Operations Hub
  const [operationsHubOpen, setOperationsHubOpen] = useState(false);
  // Legacy or auxiliary sidebar drawer
  const [sidebarDrawerOpen, setSidebarDrawerOpen] = useState(false);

  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [sitemapOpen, setSitemapOpen] = useState(false);

  // Dual Intelligence Research Engine State
  const [activeResearch, setActiveResearch] = useState<ResearchDataResult | null>(null);
  const [researchModalOpen, setResearchModalOpen] = useState(false);

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

  // Execute research query asynchronously, inject Schema.org JSON-LD, and sync URL
  const handleExecuteResearchQuery = useCallback(async (query: string, updateUrl = true) => {
    try {
      playSound('click');
      const result = await executeResearchQuery(query, TOOLS_DATA);
      setActiveResearch(result);
      setResearchModalOpen(true);
      injectDynamicSeoSchema(result);
      if (updateUrl) {
        syncQueryToUrl(result.slug);
      }
    } catch (err) {
      console.error('Research query execution error:', err);
    }
  }, []);

  const handleCloseResearchModal = () => {
    playSound('click');
    setResearchModalOpen(false);
    syncQueryToUrl('');
    removeDynamicSeoSchema();
  };

  // Reset isolation to show all tools normally in active tab
  const handleResetIsolation = () => {
    playSound('click');
    setIsolatedToolId(null);
  };

  const handleSelectMasterNode = (nodeId: MasterNodeId) => {
    playSound('click');
    setSelectedMasterNode(nodeId);
    setIsolatedToolId(null);
    setSearchQuery('');
  };

  // Global Keyboard Command Center Shortcuts Listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check if user has shortcuts enabled
      const enabled = localStorage.getItem('quickfree_shortcuts_enabled') !== 'false';
      if (!enabled) return;

      // Don't trigger if user is typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ) {
        return;
      }

      // Spotlight: Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
        return;
      }

      // G: Modular Grid Categories
      if (e.key === 'g' || e.key === 'G') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setCategoryOverlayOpen(prev => !prev);
          return;
        }
      }

      // S or O: Global Operations Hub
      if (e.key === 's' || e.key === 'S' || e.key === 'o' || e.key === 'O') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          setOperationsHubOpen(prev => !prev);
          return;
        }
      }

      // T: Cycle Display Theme
      if (e.key === 't' || e.key === 'T') {
        if (!e.metaKey && !e.ctrlKey && !e.altKey) {
          e.preventDefault();
          toggleTheme();
          return;
        }
      }

      // Escape: Close active overlays
      if (e.key === 'Escape') {
        setCategoryOverlayOpen(false);
        setOperationsHubOpen(false);
        setSidebarDrawerOpen(false);
        setIsSpotlightOpen(false);
        setAboutOpen(false);
        setPrivacyOpen(false);
        setSitemapOpen(false);
        setResearchModalOpen(false);
        removeDynamicSeoSchema();
        if (activeTool) {
          setActiveTool(null);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeTool]);

  // Deep-linking URL Route Listener: Supports both tool deep links (?tool=...) and research queries (?q=...)
  useEffect(() => {
    const parseIncomingUrl = () => {
      // 1. Check for Research Query in URL (e.g., ?q=what-is-sip-compounding)
      const researchQuerySlug = extractQueryFromUrl();
      if (researchQuerySlug) {
        const rawQuery = unslugifyQuery(researchQuerySlug);
        handleExecuteResearchQuery(rawQuery, false);
        return;
      }

      // 2. Check for Category Query in URL (e.g., ?category=finance_wealth or ?cat=finance_wealth)
      const urlParams = new URLSearchParams(window.location.search);
      const categoryParam = (urlParams.get('category') || urlParams.get('cat'))?.toLowerCase();
      if (categoryParam) {
        const matchingNode = MASTER_NODES.find(n => n.id.toLowerCase() === categoryParam);
        if (matchingNode) {
          setSelectedMasterNode(matchingNode.id);
          setIsolatedToolId(null);
          return;
        }
      }

      // 3. Check URL Query Parameter (e.g., ?tool=sip or ?t=mortgage)
      const queryParamTool = urlParams.get('tool') || urlParams.get('t');

      // 4. Check URL Hash (e.g., #fire-estimator, #tool-sip-visualizer, #sip, #tool-json)
      const rawHash = window.location.hash.replace(/^#/, '').trim();

      const candidate = (queryParamTool || rawHash).toLowerCase();

      // Handle sitemap deep links directly
      if (candidate === 'sitemap' || candidate === 'sitemap-xml' || candidate === 'sitemap.xml') {
        setIsolatedToolId(null);
        setSitemapOpen(true);
        return;
      }

      // If no tool identifier is in the URL, strictly keep modal closed
      if (!candidate || candidate === 'home' || candidate === 'tools' || candidate === 'categorynav') {
        setIsolatedToolId(null);
        return;
      }

      const cleanCandidate = candidate.replace(/^tool-/, '');

      // Locate matching tool among all 100 high-precision engines
      const matched = TOOLS_DATA.find(t => {
        const idLower = t.id.toLowerCase();
        const idMatch = idLower === candidate || idLower === cleanCandidate;
        const nameSlug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const slugMatch = nameSlug === candidate || nameSlug === cleanCandidate || nameSlug.includes(cleanCandidate) || cleanCandidate.includes(nameSlug);
        const tagMatch = t.tags.some(tag => {
          const tagLower = tag.toLowerCase();
          return tagLower === candidate || tagLower === cleanCandidate || cleanCandidate.includes(tagLower) || tagLower.includes(cleanCandidate);
        });
        
        return idMatch || slugMatch || tagMatch;
      });

      if (matched) {
        // Automatically select the master node where that tool belongs
        if (matched.masterNode) {
          setSelectedMasterNode(matched.masterNode);
        }
        // Isolate the searched tool card quietly with ZERO screen movement
        setIsolatedToolId(matched.id);

        // Force top scroll & clean history state safely (prevent iframe sandbox security exceptions)
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState("", document.title, window.location.pathname + window.location.search);
          }
        } catch {
          // Ignore sandboxed iframe security restrictions
        }
      } else {
        setIsolatedToolId(null);
        window.scrollTo(0, 0);
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    };

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    parseIncomingUrl();
  }, [handleExecuteResearchQuery]);

  // Listen to browser Back/Forward popstate events for dynamic URL query slugs
  useEffect(() => {
    const handlePopState = () => {
      const q = extractQueryFromUrl();
      if (q) {
        handleExecuteResearchQuery(unslugifyQuery(q), false);
      } else {
        setResearchModalOpen(false);
        removeDynamicSeoSchema();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [handleExecuteResearchQuery]);

  // Tap Drop & Fluid Ripple System (Micro-Interactions)
  useEffect(() => {
    const cleanupRipple = initFluidRippleSystem();
    return cleanupRipple;
  }, []);

  // Synchronize theme mode with document root, body class & attributes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'reading');
    document.body.classList.remove('dark', 'reading');

    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#09090b';
      document.body.style.color = '#f0f6fc';
    } else if (theme === 'reading') {
      root.classList.add('reading');
      document.body.classList.add('reading');
      root.setAttribute('data-theme', 'reading');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#fbf0d9';
      document.body.style.color = '#432818';
    } else {
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
    localStorage.setItem('quickfree_theme', theme);
  }, [theme]);

  // 3-Way Mode Switching (Light -> Dark -> Reading -> Light)
  const toggleTheme = () => {
    playSound('click');
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'reading';
      return 'light';
    });
  };

  const handleSelectTrendingTag = (query: string) => {
    setSearchQuery(query);
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
        <div className="min-h-screen pb-24 sm:pb-28 bg-slate-50 dark:bg-[#09090b] reading:bg-[#fbf0d9] text-slate-900 dark:text-[#f0f6fc] reading:text-[#432818] relative selection:bg-[#00f0ff]/30 selection:text-white transition-colors duration-300 overflow-x-hidden font-sans">
        
        {/* Real-time Connectivity Status */}
        <OnlineStatusBanner />

        {/* Cyberpunk Dynamic Ambient Glow Spheres (#00f0ff cyan & #bd00ff purple) */}
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {/* Top-Left Cyan Glow Orb */}
          <div className="absolute top-[-10%] left-[-10%] w-[550px] h-[550px] bg-[#00f0ff]/20 dark:bg-[#00f0ff]/15 rounded-full blur-[140px]" />
          {/* Mid-Right Purple Glow Orb */}
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#bd00ff]/20 dark:bg-[#bd00ff]/15 rounded-full blur-[150px]" />
          {/* Bottom-Left Magenta Accent Orb */}
          <div className="absolute bottom-[10%] left-[5%] w-[450px] h-[450px] bg-[#ff007f]/15 dark:bg-[#ff007f]/10 rounded-full blur-[130px]" />
          {/* Subtle Grid Overlay Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
        </div>

        {/* 2. Floating Backdrop-Blur Navigation Bar (Top Sticky) */}
        <Header 
          theme={theme}
          onToggleTheme={toggleTheme}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onNavigateToSection={handleNavigateToSection}
          onOpenCategoriesOverlay={() => setCategoryOverlayOpen(true)}
          onOpenOperationsHub={() => setOperationsHubOpen(true)}
          onOpenSpotlight={() => setIsSpotlightOpen(true)}
        />

        {/* Main Content Area */}
        <main className="relative z-10">
          
          {/* Apple Spotlight-Style Global Search Bar (Hero Section) */}
          <Hero 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectTrendingTag={handleSelectTrendingTag}
            totalToolsCount={TOOLS_DATA.length}
            tools={TOOLS_DATA}
            onLaunchTool={handleLaunchTool}
            onSelectMasterNode={handleSelectMasterNode}
            isSpotlightOpenExternal={isSpotlightOpen}
            onCloseSpotlightExternal={() => setIsSpotlightOpen(false)}
            onExecuteResearchQuery={handleExecuteResearchQuery}
          />

          {/* Responsive Segmented Category Tabs (8 Master Nodes) & Interactive Glass-Card Grid */}
          <ToolGrid 
            tools={TOOLS_DATA}
            selectedMasterNode={selectedMasterNode}
            onSelectMasterNode={handleSelectMasterNode}
            onLaunchTool={handleLaunchTool}
            searchQuery={searchQuery}
            isolatedToolId={isolatedToolId}
            onResetIsolation={handleResetIsolation}
            onClearSearch={() => setSearchQuery('')}
          />

        </main>

        {/* Clean Frosted Glass Footer Section */}
        <Footer 
          onOpenAbout={() => setAboutOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
          onOpenSitemap={() => setSitemapOpen(true)}
          onScrollToTop={handleScrollToTop}
        />

        {/* 1. Left Circle Action: Modular Grid Categories Filter Overlay */}
        <ModularCategoryOverlay 
          isOpen={categoryOverlayOpen}
          onClose={() => setCategoryOverlayOpen(false)}
          selectedMasterNode={selectedMasterNode}
          onSelectMasterNode={handleSelectMasterNode}
        />

        {/* 2. Right Circle Action: The Global Operations Hub Sliding Glass Drawer */}
        <GlobalOperationsHub 
          isOpen={operationsHubOpen}
          onClose={() => setOperationsHubOpen(false)}
          tools={TOOLS_DATA}
          onLaunchTool={handleLaunchTool}
          theme={theme}
          onToggleTheme={toggleTheme}
          onSetTheme={(newTheme) => setTheme(newTheme)}
          onOpenAbout={() => setAboutOpen(true)}
          onOpenPrivacy={() => setPrivacyOpen(true)}
        />

        {/* Slide-out Navigation Drawer Menu (The 8 Master Nodes Directory) */}
        <SidebarDrawer 
          isOpen={sidebarDrawerOpen}
          onClose={() => setSidebarDrawerOpen(false)}
          tools={TOOLS_DATA}
          onSelectTool={handleLaunchTool}
          selectedMasterNode={selectedMasterNode}
          onSelectMasterNode={handleSelectMasterNode}
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

        {/* Dual Intelligence Research Answer Modal & Schema.org Rich Snippet Engine */}
        <ResearchAnswerModal 
          isOpen={researchModalOpen}
          onClose={handleCloseResearchModal}
          researchData={activeResearch}
          onLaunchTool={handleLaunchTool}
          allTools={TOOLS_DATA}
        />

        </div>
      </SoundProvider>
    </CurrencyProvider>
  );
}
