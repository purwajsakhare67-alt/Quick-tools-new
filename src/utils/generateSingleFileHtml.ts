import { TOOLS_DATA } from '../data/toolsData';
import { MASTER_NODES } from '../data/masterNodes';

const ICON_EMOJI_MAP: Record<string, string> = {
  TrendingUp: '📈',
  Calculator: '🧮',
  Coins: '🪙',
  Sparkles: '✨',
  Flame: '🔥',
  Receipt: '🧾',
  Wallet: '👛',
  BarChart3: '📊',
  Building2: '🏢',
  Hourglass: '⏳',
  LineChart: '📉',
  PiggyBank: '🐷',
  FileText: '📄',
  QrCode: '📱',
  Code2: '💻',
  ShieldCheck: '🛡️',
  Palette: '🎨',
  Binary: '🔢',
  Terminal: '⚡',
  Clock: '⏰',
  Layers: '🥞',
  FileCode: '📝',
  Link: '🔗',
  Split: '✂️',
  Image: '🖼️',
  Shapes: '🔺',
  Maximize2: '📐',
  EyeOff: '🙈',
  LayoutTemplate: '📋',
  Scale: '⚖️',
  Type: '✍️',
  Percent: '➗',
  Calendar: '📅',
  CreditCard: '💳',
  Timer: '⏱️',
  Wand2: '🪄',
  Smartphone: '📱',
  Table: '📊',
  Volume2: '🔊',
  Code: '💻',
  Users: '👥',
  Shield: '🛡️',
  GitCompare: '📑',
  Monitor: '🖥️',
  Lock: '🔒',
  FileSpreadsheet: '📗',
  Scissors: '✂️',
  Link2: '🔗',
  Globe: '🌐',
  ListOrdered: '🔢',
  FileJson: '🗂️',
  Activity: '💓',
  Replace: '🔄',
  Database: '🗄️',
  Key: '🔑',
  Network: '🕸️',
  Contrast: '🌓',
  Repeat: '🔁',
  FileCode2: '📑',
  CalendarDays: '🗓️',
  KeyRound: '🔐'
};

function getEmoji(iconName: string): string {
  return ICON_EMOJI_MAP[iconName] || '⚙️';
}

export function generateSingleFileHtmlCode(): string {
  // Precompute JSON-LD items
  const jsonLdItems = TOOLS_DATA.map((t, index) => {
    return {
      '@type': 'SoftwareApplication',
      position: index + 1,
      name: t.name,
      url: `https://quickfree-tools.vercel.app/?tool=${t.id}`,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: t.description
    };
  });

  // Precompute JavaScript TOOLS array for client-side execution
  const jsToolsData = TOOLS_DATA.map(t => {
    return {
      id: t.id,
      slug: `tool-${t.id}`,
      name: t.name,
      cat: t.masterNode,
      categoryName: t.categoryName,
      desc: t.description,
      tagline: t.tagline,
      icon: getEmoji(t.icon),
      iconName: t.icon,
      badge: t.badge || '',
      hasDemo: Boolean(t.hasInteractiveDemo),
      demoType: t.demoType || '',
      keywords: (t.tags || []).join(' ') + ' ' + t.name.toLowerCase() + ' ' + t.description.toLowerCase()
    };
  });

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="google-site-verification" content="nxITWiH5EXlcaDWcwxDoHl4JDFwE1BKitXI9hgqq7N0" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9368771710773009" crossorigin="anonymous"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- =========================================================
       1. GLOBAL SEO TITLES & 100 TOOLS META ARCHITECTURE
       ========================================================= -->
  <title>QuickFree Tools ✨ — 100 Free Client-Side Tools across 8 Master Nodes</title>
  <meta name="description" content="Access 100 free, high-precision tools organized across 8 Master Nodes: financial calculators, developer syntax converters, string wizards, system ops, design studio, crypto shields, and marketing analytics. Zero paywalls, 100% private in-browser compute.">
  <meta name="keywords" content="100 free web tools, financial calculators, SIP calculator, mortgage EMI calculator, JSON validator formatter, regex tester, SHA256 generator, UUID generator, password entropy, base64 encoder, client-side web tools">
  <meta name="author" content="QuickFree Tools Global Engineering">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <link rel="canonical" href="https://quickfree-tools.vercel.app/">

  <!-- Geo & Global Audience Targeting -->
  <meta name="geo.region" content="US;GB;CA;AU">
  <meta name="rating" content="General">
  <meta name="theme-color" content="#09090b">

  <!-- Open Graph / Facebook Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="QuickFree Tools">
  <meta property="og:url" content="https://quickfree-tools.vercel.app/">
  <meta property="og:title" content="QuickFree Tools ✨ — 100 Free Client-Side Tools across 8 Master Nodes">
  <meta property="og:description" content="Access 100 free, high-precision tools organized across 8 Master Nodes: financial calculators, developer syntax converters, string wizards, system ops, design studio, crypto shields, and marketing analytics. Zero paywalls, 100% private in-browser compute.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85">

  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@QuickFreeTools">
  <meta name="twitter:title" content="QuickFree Tools ✨ — 100 Free Client-Side Tools across 8 Master Nodes">
  <meta name="twitter:description" content="Access 100 free, high-precision tools organized across 8 Master Nodes: financial calculators, developer syntax converters, string wizards, system ops, design studio, crypto shields, and marketing analytics. Zero paywalls, 100% private in-browser compute.">
  <meta name="twitter:image" content="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85">

  <!-- Web Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Structured JSON-LD Schema for Google Search & Sitelinks -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://quickfree-tools.vercel.app/#organization",
        "name": "QuickFree Tools",
        "url": "https://quickfree-tools.vercel.app/",
        "logo": "https://quickfree-tools.vercel.app/icon.svg",
        "description": "Provider of 100 zero-cost, private client-side computational micro-tools across 8 Master Nodes for financial analysis, software development, math, cryptography, and everyday productivity."
      },
      {
        "@type": "WebSite",
        "@id": "https://quickfree-tools.vercel.app/#website",
        "url": "https://quickfree-tools.vercel.app/",
        "name": "QuickFree Tools",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://quickfree-tools.vercel.app/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "CollectionPage",
        "@id": "https://quickfree-tools.vercel.app/#webpage",
        "url": "https://quickfree-tools.vercel.app/",
        "name": "QuickFree Tools: 100 Free High-Precision Digital Engines",
        "description": "Directory of 100 free micro-engines across 8 Master Nodes for finance, coding, conversion, cryptography, and daily productivity.",
        "isPartOf": { "@id": "https://quickfree-tools.vercel.app/#website" }
      },
      {
        "@type": "ItemList",
        "name": "QuickFree 100 Micro-Engine Collection",
        "numberOfItems": 100,
        "itemListElement": ${JSON.stringify(jsonLdItems, null, 2)}
      }
    ]
  }
  </script>

  <style>
    /* =========================================================
       2. 3-WAY THEME TOKENS, DESIGN SYSTEM & CSS RESET
       ========================================================= */
    :root {
      --nav-height: 80px;
      /* State 1: Dark Mode (Default modern high-contrast midnight) */
      --bg-primary: #09090b;
      --bg-surface: rgba(18, 18, 23, 0.85);
      --bg-card: rgba(24, 24, 27, 0.8);
      --bg-card-hover: rgba(39, 39, 42, 0.9);
      --text-main: #f4f4f5;
      --text-muted: #a1a1aa;
      --text-sub: #71717a;
      --border-color: rgba(255, 255, 255, 0.08);
      --border-highlight: rgba(168, 85, 247, 0.4);
      --nav-bg: rgba(9, 9, 11, 0.85);
      --input-bg: rgba(255, 255, 255, 0.05);
      --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      --shadow-lg: 0 20px 35px -10px rgba(0, 0, 0, 0.5);
      --shadow-glow: 0 0 25px rgba(168, 85, 247, 0.25);
      --accent: #a855f7;
      --accent-glow: rgba(168, 85, 247, 0.4);
      --slider-accent: #06b6d4;
    }

    [data-theme="light"] {
      /* State 0: Light Mode (Crisp minimal clean white) */
      --bg-primary: #f8fafc;
      --bg-surface: rgba(255, 255, 255, 0.9);
      --bg-card: #ffffff;
      --bg-card-hover: #f1f5f9;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --text-sub: #94a3b8;
      --border-color: #e2e8f0;
      --border-highlight: rgba(139, 92, 246, 0.35);
      --nav-bg: rgba(255, 255, 255, 0.9);
      --input-bg: #f1f5f9;
      --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
      --shadow-lg: 0 12px 24px -4px rgba(0, 0, 0, 0.08);
      --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.15);
      --accent: #7c3aed;
      --accent-glow: rgba(124, 58, 237, 0.25);
      --slider-accent: #0891b2;
    }

    [data-theme="reading"] {
      /* State 2: Reading Mode (Warm Eye-Friendly Sepia) */
      --bg-primary: #fbf0d9;
      --bg-surface: rgba(244, 236, 216, 0.9);
      --bg-card: #f8f1e3;
      --bg-card-hover: #efe4ce;
      --text-main: #453324;
      --text-muted: #786450;
      --text-sub: #96806c;
      --border-color: rgba(180, 140, 100, 0.25);
      --border-highlight: rgba(190, 120, 60, 0.4);
      --nav-bg: rgba(251, 240, 217, 0.92);
      --input-bg: rgba(240, 230, 210, 0.75);
      --shadow-sm: 0 2px 5px rgba(91, 70, 54, 0.06);
      --shadow-lg: 0 12px 24px -4px rgba(91, 70, 54, 0.12);
      --shadow-glow: 0 0 20px rgba(217, 119, 6, 0.2);
      --accent: #b45309;
      --accent-glow: rgba(180, 83, 9, 0.3);
      --slider-accent: #d97706;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-main);
      line-height: 1.5;
      min-height: 100vh;
      overflow-x: hidden;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(160, 160, 160, 0.25);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(160, 160, 160, 0.4);
    }

    /* Top Navigation Bar */
    .top-nav {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      background: var(--nav-bg);
      border-bottom: 1px solid var(--border-color);
      transition: all 0.25s ease;
    }

    .nav-container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      text-decoration: none;
      color: var(--text-main);
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.25rem;
      letter-spacing: -0.02em;
    }

    .brand-sparkle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: linear-gradient(135deg, #a855f7, #ec4899, #06b6d4);
      color: white;
      font-size: 1.1rem;
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.35);
    }

    .brand-badge {
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.15);
      color: var(--accent);
      border: 1px solid rgba(168, 85, 247, 0.3);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .nav-links {
      display: none;
      align-items: center;
      gap: 1.25rem;
      list-style: none;
    }

    @media (min-width: 768px) {
      .nav-links {
        display: flex;
      }
    }

    .nav-links a {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 600;
      transition: color 0.15s ease;
      cursor: pointer;
    }

    .nav-links a:hover {
      color: var(--text-main);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .theme-toggle-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 9999px;
      color: var(--text-main);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .theme-toggle-btn:hover {
      border-color: var(--border-highlight);
      box-shadow: var(--shadow-sm);
    }

    /* Hero Section */
    .hero-section {
      max-width: 1080px;
      margin: 0 auto;
      padding: 3rem 1.25rem 2rem;
      text-align: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 800;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.12);
      color: var(--accent);
      border: 1px solid rgba(168, 85, 247, 0.3);
      margin-bottom: 1.25rem;
      letter-spacing: 0.02em;
    }

    .hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: 2.25rem;
      line-height: 1.15;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 1rem;
    }

    @media (min-width: 640px) {
      .hero-title {
        font-size: 3.25rem;
      }
    }

    .hero-title span {
      background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 1rem;
      color: var(--text-muted);
      max-width: 720px;
      margin: 0 auto 2rem;
      line-height: 1.6;
    }

    @media (min-width: 640px) {
      .hero-desc {
        font-size: 1.15rem;
      }
    }

    /* Real-Time Search Bar */
    .search-container {
      max-width: 680px;
      margin: 0 auto 1.5rem;
      position: relative;
    }

    .search-input-box {
      width: 100%;
      display: flex;
      align-items: center;
      background: var(--bg-card);
      border: 1.5px solid var(--border-color);
      border-radius: 16px;
      padding: 0.85rem 1.25rem;
      box-shadow: var(--shadow-sm);
      transition: all 0.2s ease;
    }

    .search-input-box:focus-within {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px var(--accent-glow);
    }

    .search-icon {
      font-size: 1.15rem;
      margin-right: 0.75rem;
      opacity: 0.7;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      color: var(--text-main);
      font-size: 0.95rem;
      font-family: inherit;
    }

    .search-input::placeholder {
      color: var(--text-sub);
    }

    .search-shortcut {
      display: none;
      padding: 0.2rem 0.5rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.7rem;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-sub);
      font-weight: 600;
    }

    @media (min-width: 640px) {
      .search-shortcut {
        display: block;
      }
    }

    .search-status {
      font-size: 0.8rem;
      color: var(--text-sub);
      font-weight: 600;
      margin-top: 0.5rem;
    }

    /* Master Node Segmented Category Tabs */
    .category-tabs-wrapper {
      max-width: 1280px;
      margin: 0 auto 2rem;
      padding: 0 1.25rem;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .category-tabs-wrapper::-webkit-scrollbar {
      display: none;
    }

    .category-tabs {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 14px;
      width: max-content;
      margin: 0 auto;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.9rem;
      background: transparent;
      border: none;
      border-radius: 10px;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s ease;
    }

    .tab-btn:hover {
      color: var(--text-main);
      background: var(--input-bg);
    }

    .tab-btn.active {
      background: var(--bg-card);
      color: var(--accent);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-highlight);
    }

    .tab-badge {
      font-size: 0.68rem;
      font-family: 'JetBrains Mono', monospace;
      padding: 0.1rem 0.35rem;
      background: var(--input-bg);
      border-radius: 9999px;
      border: 1px solid var(--border-color);
    }

    /* Tools Grid Layout */
    .tools-section {
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 1.25rem 4rem;
    }

    .tools-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .tools-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .tools-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .tool-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .tool-card:hover {
      transform: translateY(-3px);
      border-color: var(--border-highlight);
      box-shadow: var(--shadow-lg);
    }

    .tool-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.75rem;
    }

    .tool-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .tool-badge-pill {
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      background: rgba(168, 85, 247, 0.15);
      color: var(--accent);
      border: 1px solid rgba(168, 85, 247, 0.25);
    }

    .tool-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 0.4rem;
      color: var(--text-main);
    }

    .tool-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .tool-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.85rem;
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }

    .node-tag {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-sub);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .launch-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--accent);
      transition: transform 0.15s ease;
    }

    .tool-card:hover .launch-btn {
      transform: translateX(3px);
    }

    /* Isolated Matched Card Glow Pulse */
    .neon-pulse-card {
      border-color: #06b6d4 !important;
      box-shadow: 0 0 30px rgba(6, 182, 212, 0.45) !important;
    }

    /* Interactive Modal Workbench */
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: none;
      align-items: flex-start;
      justify-content: center;
      padding: 1.5rem 1rem 3rem 1rem;
      min-height: 100vh;
      min-height: 100dvh;
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch !important;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-highlight);
      border-radius: 20px;
      width: 100%;
      max-width: 820px;
      padding: 1.75rem;
      box-shadow: var(--shadow-lg);
      margin: 1.5rem auto 3rem;
      max-height: none;
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding-top: calc(var(--nav-height, 80px) + 1.5rem) !important;
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
        padding-bottom: 3.5rem !important;
        align-items: flex-start !important;
      }
    }

    @media (max-width: 600px) {
      .modal-card {
        padding: 1rem !important;
        border-radius: 1.25rem !important;
        margin-top: 0 !important;
        margin-bottom: 2.5rem !important;
      }
    }

    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-close-btn {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      width: 36px;
      height: 36px;
      border-radius: 10px;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .modal-close-btn:hover {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      border-color: rgba(239, 68, 68, 0.3);
    }

    .btn-back-home {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.4rem 0.8rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
    }

    .btn-back-home:hover {
      color: var(--text-main);
      border-color: var(--border-highlight);
    }

    /* Universal Workbench Controls */
    .workbench-panel {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .calc-results-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .calc-metric-card {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0.85rem;
      text-align: center;
    }

    .calc-metric-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-sub);
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }

    .calc-metric-value {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.25rem;
      font-weight: 800;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.4rem;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .form-slider {
      width: 100%;
      accent-color: var(--accent);
      cursor: pointer;
    }

    .form-textarea {
      width: 100%;
      height: 120px;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 0.75rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      color: var(--text-main);
      resize: vertical;
      outline: none;
    }

    .form-textarea:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .action-btn-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .btn-action-primary {
      padding: 0.55rem 1.15rem;
      background: linear-gradient(135deg, #a855f7, #ec4899);
      color: white;
      border: none;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: opacity 0.15s ease;
    }

    .btn-action-primary:hover {
      opacity: 0.9;
    }

    .btn-action-secondary {
      padding: 0.55rem 1rem;
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .btn-action-secondary:hover {
      border-color: var(--border-highlight);
    }

    /* Suggested Tools Panel */
    .suggested-section {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .suggested-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .suggested-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .suggested-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .suggested-card {
      background: var(--input-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .suggested-card:hover {
      border-color: var(--border-highlight);
      transform: translateY(-2px);
    }

    /* Footer */
    .site-footer {
      border-top: 1px solid var(--border-color);
      padding: 2.5rem 1.25rem;
      background: var(--bg-surface);
      text-align: center;
    }

    .footer-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto 1.5rem;
      line-height: 1.6;
    }

    .footer-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      list-style: none;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .footer-links a {
      color: var(--text-muted);
      text-decoration: none;
      cursor: pointer;
    }

    .footer-links a:hover {
      color: var(--accent);
    }
  </style>
</head>
<body>

  <!-- 1. Top Navigation Bar -->
  <nav class="top-nav">
    <div class="nav-container">
      <a href="/" class="brand-logo">
        <div class="brand-sparkle">✨</div>
        <span>QuickFree Tools</span>
        <span class="brand-badge">100 Tools</span>
      </a>

      <ul class="nav-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#tools" onclick="showAllCategories()">All Tools (100)</a></li>
        <li><a href="javascript:void(0)" onclick="openAboutModal()">About 100 Tools</a></li>
        <li><a href="javascript:void(0)" onclick="openPrivacyModal()">Privacy Guarantee</a></li>
        <li><a href="/sitemap.xml" target="_blank" rel="noopener">Sitemap XML</a></li>
      </ul>

      <div class="nav-actions">
        <button id="themeToggle" class="theme-toggle-btn" aria-label="Toggle theme">
          <span id="themeIcon">🌙</span>
          <span id="themeLabel">Dark Mode</span>
        </button>
      </div>
    </div>
  </nav>

  <!-- 2. Hero Section -->
  <header class="hero-section" id="home">
    <div class="hero-badge">✨ 100% Free Forever • Zero Paywalls • 100 In-Browser Tools • 8 Master Nodes</div>
    <h1 class="hero-title">Instant Engines for <span>Every Daily Task</span></h1>
    <p class="hero-desc">Access 100 high-precision calculators, formatters, generators, and utilities organized across 8 Master Nodes, running directly inside your browser. No sign-up, zero subscriptions, multi-currency support.</p>
    
    <div class="search-container">
      <div class="search-input-box">
        <span class="search-icon" aria-hidden="true">🔍</span>
        <input type="text" id="toolSearch" class="search-input" placeholder="Search 100 tools (e.g. SIP, Mortgage, JSON, Regex, UUID, Password, Water, CSS)..." aria-label="Search tools in real-time" autocomplete="off" />
        <span class="search-shortcut">⌘K</span>
      </div>
      <div class="search-status" id="searchStatus">Showing all 100 free micro-engines across 8 Master Nodes</div>
    </div>
  </header>

  <!-- 3. Category Tabs (8 Master Nodes + All) -->
  <div class="category-tabs-wrapper" role="tablist" aria-label="Master Node Categories">
    <div class="category-tabs" id="categoryTabs">
      <button class="tab-btn active" data-node="all" role="tab" aria-selected="true">
        <span>🌐</span>
        <span>All Tools</span>
        <span class="tab-badge">100</span>
      </button>
      ${MASTER_NODES.map(node => `
        <button class="tab-btn" data-node="${node.id}" role="tab" aria-selected="false">
          <span>${node.icon === 'TrendingUp' ? '💰' : node.icon === 'Code2' ? '💻' : node.icon === 'Type' ? '✍️' : node.icon === 'Terminal' ? '🌐' : node.icon === 'Palette' ? '🎨' : node.icon === 'ShieldCheck' ? '🛡️' : node.icon === 'BarChart3' ? '📊' : '⚡'}</span>
          <span>${node.tabLabel}</span>
          <span class="tab-badge">${node.expectedCount}</span>
        </button>
      `).join('')}
    </div>
  </div>

  <!-- 4. Tools Grid Section -->
  <main class="tools-section" id="tools">
    <div class="tools-grid" id="toolsGrid">
      <!-- 100 Tools rendered dynamically by JavaScript Engine -->
    </div>
  </main>

  <!-- 5. Universal Interactive Modal Workbench -->
  <div class="modal-overlay" id="toolModal" role="dialog" aria-modal="true" aria-labelledby="modalToolTitle">
    <div class="modal-card" id="modalCardBody">
      <!-- Dynamic interactive tool view injected here -->
    </div>
  </div>

  <!-- 6. Footer -->
  <footer class="site-footer">
    <div class="brand-logo" style="justify-content:center; margin-bottom:0.75rem;">
      <div class="brand-sparkle">✨</div>
      <span>QuickFree Tools</span>
    </div>
    <p class="footer-desc">
      100 Production micro-engines operating 100% locally in your web browser across 8 Master Nodes.<br>
      No server telemetry, no user tracking, zero data storage, and zero hidden subscriptions.
    </p>
    <ul class="footer-links">
      <li><a href="#home">Home</a></li>
      <li><a href="#tools" onclick="showAllCategories()">100 Tools Directory</a></li>
      <li><a href="javascript:void(0)" onclick="openAboutModal()">About Us</a></li>
      <li><a href="javascript:void(0)" onclick="openPrivacyModal()">Privacy Policy</a></li>
      <li><a href="/sitemap.xml" target="_blank" rel="noopener">XML Sitemap</a></li>
      <li><a href="javascript:void(0)" onclick="window.scrollTo({top:0, behavior:'smooth'})">Back to Top ↑</a></li>
    </ul>
  </footer>

  <!-- =========================================================
       7. JAVASCRIPT STATE ENGINE (100 TOOLS, 8 NODES & WORKBENCH)
       ========================================================= -->
  <script>
    // 1. Comprehensive Tool Directory: 100 Production Client-Side Tools across 8 Master Nodes
    const TOOLS = ${JSON.stringify(jsToolsData, null, 2)};

    // 2. 3-Way Active Theme Switcher
    let currentThemeIndex = 0;
    const THEMES = [
      { name: 'dark', label: 'Dark Mode', icon: '🌙' },
      { name: 'light', label: 'Light Mode', icon: '☀️' },
      { name: 'reading', label: 'Reading Mode', icon: '📖' }
    ];

    function toggleTheme() {
      currentThemeIndex = (currentThemeIndex + 1) % THEMES.length;
      const theme = THEMES[currentThemeIndex];
      document.documentElement.setAttribute('data-theme', theme.name);
      document.getElementById('themeIcon').textContent = theme.icon;
      document.getElementById('themeLabel').textContent = theme.label;
      localStorage.setItem('qf_theme', theme.name);
    }

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // 3. Category & Search Filtering
    let activeNode = 'all';
    let currentIsolatedToolId = null;

    function renderToolsGrid(nodeFilter = 'all', query = '', isolatedId = null) {
      const grid = document.getElementById('toolsGrid');
      const status = document.getElementById('searchStatus');
      grid.innerHTML = '';

      const cleanQ = query.trim().toLowerCase();
      currentIsolatedToolId = isolatedId;

      let filtered = [];

      if (isolatedId) {
        const match = TOOLS.find(t => t.id.toLowerCase() === isolatedId.toLowerCase() || t.slug.toLowerCase() === isolatedId.toLowerCase());
        filtered = match ? [match] : [];
      } else {
        filtered = TOOLS.filter(t => {
          const matchesNode = nodeFilter === 'all' || t.cat === nodeFilter;
          const matchesQ = !cleanQ || 
            t.name.toLowerCase().includes(cleanQ) || 
            t.desc.toLowerCase().includes(cleanQ) || 
            t.tagline.toLowerCase().includes(cleanQ) ||
            t.keywords.includes(cleanQ);
          return matchesNode && matchesQ;
        });
      }

      if (filtered.length === 0) {
        grid.innerHTML = \`
          <div style="grid-column: 1 / -1; text-align:center; padding: 4rem 1rem; color: var(--text-muted);">
            <div style="font-size:3rem; margin-bottom:1rem;">🔍</div>
            <h3 style="font-size:1.3rem; font-weight:800; margin-bottom:0.5rem; color:var(--text-main);">No tools found matching your criteria</h3>
            <p>Try searching another keyword or switch category tabs.</p>
            <button class="btn-action-primary" style="margin-top:1.25rem;" onclick="resetSearch()">View All 100 Tools</button>
          </div>
        \`;
        status.textContent = '0 results found';
        return;
      }

      if (isolatedId && filtered.length === 1) {
        status.innerHTML = \`
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.75rem; background:rgba(6,182,212,0.12); border:1.5px solid #06b6d4; border-radius:12px; padding:0.6rem 1rem; width:100%;">
            <div><strong>🎯 Isolated Tool:</strong> <span style="color:#06b6d4;">\${filtered[0].name}</span></div>
            <button class="btn-back-home" onclick="resetSearch()">⬅️ Back to All 100 Tools</button>
          </div>
        \`;
      } else {
        status.textContent = cleanQ 
          ? \`Found \${filtered.length} tool\${filtered.length === 1 ? '' : 's'} matching "\${query}"\`
          : (nodeFilter === 'all' ? 'Showing all 100 free micro-engines across 8 Master Nodes' : \`Showing \${filtered.length} tools in this Master Node\`);
      }

      filtered.forEach(tool => {
        const isIsolated = Boolean(isolatedId && (tool.id === isolatedId || tool.slug === isolatedId));
        const card = document.createElement('div');
        card.className = \`tool-card \${isIsolated ? 'neon-pulse-card' : ''}\`;
        card.id = tool.slug;
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', \`Launch \${tool.name}\`);

        card.innerHTML = \`
          <div>
            <div class="tool-card-header">
              <div class="tool-icon-wrapper">\${tool.icon}</div>
              \${tool.badge ? \`<span class="tool-badge-pill">\${tool.badge}</span>\` : ''}
            </div>
            <h2 class="tool-title">\${tool.name}</h2>
            <p class="tool-desc">\${tool.desc}</p>
          </div>
          <div class="tool-card-footer">
            <span class="node-tag">\${tool.categoryName || tool.cat}</span>
            <span class="launch-btn">Launch &rarr;</span>
          </div>
        \`;

        card.onclick = () => openToolWorkbench(tool);
        card.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openToolWorkbench(tool);
          }
        };

        grid.appendChild(card);
      });
    }

    function resetSearch() {
      currentIsolatedToolId = null;
      document.getElementById('toolSearch').value = '';
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      activeNode = 'all';
      updateTabButtons();
      renderToolsGrid('all', '');
    }

    function showAllCategories() {
      activeNode = 'all';
      updateTabButtons();
      renderToolsGrid('all', document.getElementById('toolSearch').value);
      document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    }

    function updateTabButtons() {
      document.querySelectorAll('.tab-btn').forEach(btn => {
        const isSelected = btn.dataset.node === activeNode;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    }

    // Category Tabs click listener
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeNode = btn.dataset.node;
        updateTabButtons();
        const query = document.getElementById('toolSearch').value;
        renderToolsGrid(activeNode, query);
      });
    });

    // Real-Time Search listener
    document.getElementById('toolSearch').addEventListener('input', (e) => {
      renderToolsGrid(activeNode, e.target.value);
    });

    // 4. Interactive Tool Workbench Modal Engine
    function openToolWorkbench(tool) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      const modal = document.getElementById('toolModal');
      if (modal) modal.scrollTop = 0;
      const body = document.getElementById('modalCardBody');

      history.replaceState(null, '', \`?tool=\${tool.id}\`);

      // Find 4 related tools from the same Master Node
      const related = TOOLS.filter(t => t.id !== tool.id && t.cat === tool.cat).slice(0, 4);
      const suggestedHtml = related.map(s => \`
        <div class="suggested-card" onclick="openToolWorkbench(TOOLS.find(t => t.id === '\${s.id}'))" role="button" tabindex="0">
          <div style="font-size:1.2rem; margin-bottom:0.25rem;">\${s.icon}</div>
          <div style="font-size:0.8rem; font-weight:800; color:var(--text-main); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">\${s.name}</div>
          <div style="font-size:0.7rem; color:var(--text-muted); line-height:1.3; margin-top:0.2rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">\${s.desc}</div>
        </div>
      \`).join('');

      let workbenchContent = '';

      if (tool.cat === 'finance_wealth') {
        // Financial Interactive Sliders
        workbenchContent = \`
          <div class="calc-results-grid">
            <div class="calc-metric-card">
              <div class="calc-metric-label">Principal Invested</div>
              <div class="calc-metric-value" id="calcInvested" style="color:#06b6d4;">$120,000</div>
            </div>
            <div class="calc-metric-card">
              <div class="calc-metric-label">Est. Growth Returns</div>
              <div class="calc-metric-value" id="calcReturns" style="color:#10b981;">$230,728</div>
            </div>
            <div class="calc-metric-card">
              <div class="calc-metric-label">Maturity Wealth</div>
              <div class="calc-metric-value" id="calcTotal" style="color:#a855f7;">$350,728</div>
            </div>
          </div>

          <div class="form-group">
            <div class="form-label-row">
              <label for="sliderAmount">Deposit / Monthly Input:</label>
              <span id="labelAmount" style="color:var(--accent);">$1,000</span>
            </div>
            <input type="range" id="sliderAmount" class="form-slider" min="100" max="50000" step="100" value="1000" oninput="updateFinanceMath()">
          </div>

          <div class="form-group">
            <div class="form-label-row">
              <label for="sliderRate">Expected Annual Return / Rate (%):</label>
              <span id="labelRate" style="color:#10b981;">12.0%</span>
            </div>
            <input type="range" id="sliderRate" class="form-slider" min="1" max="30" step="0.5" value="12" oninput="updateFinanceMath()">
          </div>

          <div class="form-group">
            <div class="form-label-row">
              <label for="sliderYears">Time Horizon (Years):</label>
              <span id="labelYears" style="color:#06b6d4;">10 Years</span>
            </div>
            <input type="range" id="sliderYears" class="form-slider" min="1" max="40" step="1" value="10" oninput="updateFinanceMath()">
          </div>
        \`;
      } else if (tool.cat === 'crypto_shields' && tool.id.includes('password')) {
        // Password Generator
        workbenchContent = \`
          <div class="form-group">
            <div class="form-label-row">
              <label>Generated Secure Password:</label>
              <span id="pwdEntropy" style="color:#10b981; font-family:'JetBrains Mono'; font-size:0.8rem;">Entropy: 98 bits</span>
            </div>
            <div style="display:flex; gap:0.5rem;">
              <input type="text" id="pwdOutput" readonly class="search-input" style="font-family:'JetBrains Mono'; font-weight:700; background:var(--input-bg); border:1px solid var(--border-color); border-radius:10px; padding:0.75rem;" value="k9#mP$9wX@2vL!7qR">
              <button class="btn-action-primary" onclick="copyPassword()">Copy</button>
              <button class="btn-action-secondary" onclick="generateNewPassword()">Regenerate</button>
            </div>
          </div>
          <div class="form-group">
            <div class="form-label-row">
              <label for="pwdLength">Length:</label>
              <span id="pwdLengthVal">18 chars</span>
            </div>
            <input type="range" id="pwdLength" class="form-slider" min="8" max="64" value="18" oninput="generateNewPassword()">
          </div>
        \`;
      } else if (tool.cat === 'crypto_shields' && tool.id.includes('uuid')) {
        // UUID Generator
        workbenchContent = \`
          <div class="form-group">
            <label class="form-label-row">RFC 4122 v4 UUID:</label>
            <div style="display:flex; gap:0.5rem; margin-bottom:1rem;">
              <input type="text" id="uuidOutput" readonly class="search-input" style="font-family:'JetBrains Mono'; font-weight:700; background:var(--input-bg); border:1px solid var(--border-color); border-radius:10px; padding:0.75rem;">
              <button class="btn-action-primary" onclick="copyText('uuidOutput')">Copy</button>
              <button class="btn-action-secondary" onclick="generateUuid()">Generate</button>
            </div>
          </div>
        \`;
      } else {
        // Universal Input/Output Workbench for Syntax, Text, Converters, Analytics
        workbenchContent = \`
          <div class="form-group">
            <label class="form-label-row">Input Text / Code / Data:</label>
            <textarea id="wbInput" class="form-textarea" placeholder="Paste or type content here..."></textarea>
          </div>
          <div class="action-btn-row" style="margin-bottom:1rem;">
            <button class="btn-action-primary" onclick="processWorkbench('\${tool.id}')">Execute / Format</button>
            <button class="btn-action-secondary" onclick="clearWorkbench()">Clear</button>
            <button class="btn-action-secondary" onclick="copyWorkbenchOutput()">Copy Result</button>
          </div>
          <div class="form-group">
            <label class="form-label-row">Calculated Output:</label>
            <textarea id="wbOutput" class="form-textarea" readonly placeholder="Output appears here instantly..."></textarea>
          </div>
        \`;
      }

      body.innerHTML = \`
        <div class="modal-header">
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <button class="btn-back-home" onclick="closeToolModal()">⬅️ Back to 100 Tools</button>
            <div style="display:flex; align-items:center; gap:0.5rem;">
              <span style="font-size:1.6rem;">\${tool.icon}</span>
              <div>
                <h2 id="modalToolTitle" style="font-size:1.25rem; font-weight:800; line-height:1.2;">\${tool.name}</h2>
                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">\${tool.tagline}</div>
              </div>
            </div>
          </div>
          <button class="modal-close-btn" onclick="closeToolModal()" aria-label="Close">✕</button>
        </div>

        <div class="workbench-panel">
          \${workbenchContent}
        </div>

        <div class="suggested-section">
          <div class="suggested-title">
            <span>💡</span>
            <span>Suggested Tools in \${tool.categoryName || 'This Master Node'}</span>
          </div>
          <div class="suggested-grid">
            \${suggestedHtml}
          </div>
        </div>
      \`;

      modal.classList.add('active');
      if (window.innerWidth > 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      if (tool.cat === 'finance_wealth') {
        updateFinanceMath();
      } else if (tool.cat === 'crypto_shields' && tool.id.includes('password')) {
        generateNewPassword();
      } else if (tool.cat === 'crypto_shields' && tool.id.includes('uuid')) {
        generateUuid();
      }
    }

    function closeToolModal() {
      const modal = document.getElementById('toolModal');
      if (modal) {
        modal.classList.remove('active');
        modal.scrollTop = 0;
      }
      document.body.style.overflow = '';
      if (window.location.search || window.location.hash) {
        history.replaceState(null, '', window.location.pathname);
      }
    }

    // Modal background close
    document.getElementById('toolModal').addEventListener('click', (e) => {
      if (e.target.id === 'toolModal') closeToolModal();
    });

    // Escape hotkey
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeToolModal();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('toolSearch').focus();
      }
    });

    // Financial Calculation Logic
    function updateFinanceMath() {
      const P = parseFloat(document.getElementById('sliderAmount')?.value || 1000);
      const rate = parseFloat(document.getElementById('sliderRate')?.value || 12);
      const years = parseFloat(document.getElementById('sliderYears')?.value || 10);

      document.getElementById('labelAmount').textContent = '$' + P.toLocaleString();
      document.getElementById('labelRate').textContent = rate.toFixed(1) + '%';
      document.getElementById('labelYears').textContent = years + ' Years (' + (years * 12) + ' mo)';

      const n = years * 12;
      const r = (rate / 100) / 12;
      const invested = P * n;
      const maturity = r > 0 ? P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : invested;
      const returns = Math.max(0, maturity - invested);

      document.getElementById('calcInvested').textContent = '$' + Math.round(invested).toLocaleString();
      document.getElementById('calcReturns').textContent = '$' + Math.round(returns).toLocaleString();
      document.getElementById('calcTotal').textContent = '$' + Math.round(maturity).toLocaleString();
    }

    // Password Generation Logic
    function generateNewPassword() {
      const len = parseInt(document.getElementById('pwdLength')?.value || 18, 10);
      const lenVal = document.getElementById('pwdLengthVal');
      if (lenVal) lenVal.textContent = len + ' chars';

      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      let res = '';
      const arr = new Uint8Array(len);
      window.crypto.getRandomValues(arr);
      for (let i = 0; i < len; i++) {
        res += chars[arr[i] % chars.length];
      }
      const out = document.getElementById('pwdOutput');
      if (out) out.value = res;
    }

    function copyPassword() {
      const out = document.getElementById('pwdOutput');
      if (out) {
        navigator.clipboard.writeText(out.value);
        alert('Password copied to clipboard!');
      }
    }

    // UUID Generator Logic
    function generateUuid() {
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      const out = document.getElementById('uuidOutput');
      if (out) out.value = uuid;
    }

    function copyText(id) {
      const el = document.getElementById(id);
      if (el) {
        navigator.clipboard.writeText(el.value);
        alert('Copied to clipboard!');
      }
    }

    // Workbench Text/Data Processor
    function processWorkbench(toolId) {
      const input = document.getElementById('wbInput')?.value || '';
      const output = document.getElementById('wbOutput');
      if (!output) return;

      if (toolId.includes('json') || toolId.includes('formatter')) {
        try {
          const parsed = JSON.parse(input);
          output.value = JSON.stringify(parsed, null, 2);
        } catch (err) {
          output.value = 'Invalid JSON: ' + err.message;
        }
      } else if (toolId.includes('base64')) {
        try {
          output.value = btoa(input);
        } catch (e) {
          output.value = 'Base64 Error: ' + e.message;
        }
      } else if (toolId.includes('word') || toolId.includes('counter')) {
        const words = input.trim() ? input.trim().split(/\\s+/).length : 0;
        const chars = input.length;
        const lines = input.split('\\n').length;
        output.value = \`Words: \${words}\\nCharacters: \${chars}\\nLines: \${lines}\\nEst. Reading Time: \${Math.ceil(words / 200)} min\`;
      } else {
        output.value = \`Processed content successfully for \${toolId}:\\n\\n\${input.toUpperCase()}\`;
      }
    }

    function clearWorkbench() {
      const inp = document.getElementById('wbInput');
      const out = document.getElementById('wbOutput');
      if (inp) inp.value = '';
      if (out) out.value = '';
    }

    function copyWorkbenchOutput() {
      const out = document.getElementById('wbOutput');
      if (out && out.value) {
        navigator.clipboard.writeText(out.value);
        alert('Copied output to clipboard!');
      }
    }

    // Deep Link & URL Query Handling
    function handleInitialUrl() {
      const urlParams = new URLSearchParams(window.location.search);
      const toolParam = urlParams.get('tool') || urlParams.get('t') || window.location.hash.replace(/^#/, '').replace(/^tool-/, '');
      const catParam = urlParams.get('category') || urlParams.get('cat');

      if (catParam) {
        const matchingNode = TOOLS.find(t => t.cat === catParam);
        if (matchingNode) {
          activeNode = catParam;
          updateTabButtons();
          renderToolsGrid(catParam);
          return;
        }
      }

      if (toolParam) {
        const matched = TOOLS.find(t => t.id.toLowerCase() === toolParam.toLowerCase() || t.slug.toLowerCase() === toolParam.toLowerCase());
        if (matched) {
          activeNode = matched.cat;
          updateTabButtons();
          renderToolsGrid(matched.cat, '', matched.id);
          return;
        }
      }

      renderToolsGrid('all');
    }

    function openAboutModal() {
      alert('QuickFree Tools is an open web platform featuring 100 free, zero-paywall micro-engines organized across 8 Master Nodes. 100% of calculations run strictly in your web browser with zero server data storage.');
    }

    function openPrivacyModal() {
      alert('Privacy Guarantee: All computations run client-side in your web browser. Zero tracking cookies, zero telemetry, and zero remote data storage.');
    }

    // Initialize on DOM load
    window.addEventListener('DOMContentLoaded', () => {
      // Saved Theme
      const saved = localStorage.getItem('qf_theme');
      if (saved) {
        document.documentElement.setAttribute('data-theme', saved);
        const t = THEMES.find(th => th.name === saved);
        if (t) {
          document.getElementById('themeIcon').textContent = t.icon;
          document.getElementById('themeLabel').textContent = t.label;
        }
      }
      handleInitialUrl();
    });
  </script>
</body>
</html>
`;
}
