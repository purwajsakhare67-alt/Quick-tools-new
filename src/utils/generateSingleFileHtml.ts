export function generateSingleFileHtmlCode(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="google-site-verification" content="nxITWiH5EXlcaDWcwxDoHl4JDFwE1BKitXI9hgqq7N0" />
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9368771710773009" crossorigin="anonymous"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickFree Tools ✨ — Premium Financial, Developer & Productivity Engines (100% Free)</title>
  <meta name="description" content="Access 35 handcrafted financial calculators, developer utilities, and everyday productivity tools. 100% free forever. No sign-up, zero paywalls, private in-browser compute.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  
  <style>
    /* =========================================================
       1. 3-WAY THEME TOKENS, DESIGN SYSTEM & CSS RESET
       ========================================================= */
    :root {
      /* State 0: Light Mode (Clean Pure White) */
      --bg-primary: #ffffff;
      --bg-surface: rgba(255, 255, 255, 0.85);
      --bg-card: rgba(255, 255, 255, 0.95);
      --text-main: #1a1a1a;
      --text-muted: #64748b;
      --text-sub: #475569;
      --border-color: #e2e8f0;
      --border-highlight: rgba(139, 92, 246, 0.35);
      --glass-blur: blur(18px);
      --nav-bg: rgba(255, 255, 255, 0.88);
      --shadow-sm: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 20px 35px -10px rgba(99, 102, 241, 0.12);
      --shadow-glow: 0 0 25px rgba(217, 70, 239, 0.25);
      
      /* Vibrant Gradients */
      --grad-neon-1: linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #06b6d4 100%);
      --grad-financial: linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%);
      --grad-tech: linear-gradient(135deg, #2563eb 0%, #4f46e5 50%, #9333ea 100%);
      --grad-prod: linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #f59e0b 100%);
      --grad-card-hover: linear-gradient(135deg, rgba(139, 92, 246, 0.06), rgba(217, 70, 239, 0.06));
      --ad-bg: rgba(241, 245, 249, 0.75);
      --ad-border: #94a3b8;
    }

    [data-theme="dark"] {
      /* State 1: Dark Mode (Deep Midnight Slate / Black) */
      --bg-primary: #0d1117;
      --bg-surface: rgba(22, 27, 34, 0.85);
      --bg-card: rgba(22, 27, 34, 0.92);
      --text-main: #f0f6fc;
      --text-muted: #94a3b8;
      --text-sub: #cbd5e1;
      --border-color: rgba(255, 255, 255, 0.09);
      --border-highlight: rgba(168, 85, 247, 0.4);
      --nav-bg: rgba(13, 17, 23, 0.88);
      --shadow-sm: 0 4px 10px rgba(0, 0, 0, 0.4);
      --shadow-lg: 0 20px 40px -10px rgba(0, 0, 0, 0.7);
      --shadow-glow: 0 0 30px rgba(168, 85, 247, 0.35);
      --ad-bg: rgba(22, 27, 34, 0.6);
      --ad-border: #475569;
    }

    [data-theme="reading"] {
      /* State 2: Reading Mode (Warm Eye-Friendly Sepia / Cream) */
      --bg-primary: #fbf0d9;
      --bg-surface: rgba(244, 236, 216, 0.88);
      --bg-card: rgba(248, 241, 227, 0.95);
      --text-main: #5b4636;
      --text-muted: #846d5b;
      --text-sub: #6c5443;
      --border-color: rgba(180, 140, 100, 0.25);
      --border-highlight: rgba(190, 120, 60, 0.45);
      --nav-bg: rgba(248, 241, 227, 0.92);
      --shadow-sm: 0 4px 10px rgba(91, 70, 54, 0.08);
      --shadow-lg: 0 20px 35px -10px rgba(91, 70, 54, 0.15);
      --shadow-glow: 0 0 25px rgba(217, 119, 6, 0.25);
      --ad-bg: rgba(240, 230, 210, 0.75);
      --ad-border: #c4b5a0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      /* Global Fluid Transition for all 3 themes */
      transition: background 0.4s ease, background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg-primary);
      color: var(--text-main);
      line-height: 1.6;
      min-height: 100vh;
      position: relative;
      overflow-x: hidden;
      padding-bottom: 75px;
    }

    h1, h2, h3, h4, .font-heading {
      font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    /* Ambient Background Glow Spheres */
    .ambient-sphere-1 {
      position: fixed;
      top: -150px;
      left: 10%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.18) 0%, rgba(217, 70, 239, 0.06) 50%, transparent 70%);
      filter: blur(80px);
      z-index: -1;
      pointer-events: none;
      border-radius: 50%;
    }

    .ambient-sphere-2 {
      position: fixed;
      top: 40%;
      right: 10%;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(99, 102, 241, 0.05) 50%, transparent 70%);
      filter: blur(80px);
      z-index: -1;
      pointer-events: none;
      border-radius: 50%;
    }

    /* =========================================================
       2. STICKY NAVIGATION BAR & 3-WAY THEME TOGGLE
       ========================================================= */
    header.nav-header {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 100;
      background: var(--nav-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }

    .nav-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Browse Tools Button (Sidebar Trigger) */
    .btn-browse-drawer {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.55rem 1.05rem;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(168, 85, 247, 0.15));
      border: 1.5px solid rgba(168, 85, 247, 0.35);
      color: var(--text-main);
      font-weight: 800;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }

    .btn-browse-drawer:hover {
      background: var(--grad-neon-1);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 4px 15px rgba(168, 85, 247, 0.35);
      transform: translateY(-1px);
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .logo-text {
      font-size: 1.4rem;
      font-weight: 900;
      letter-spacing: -0.02em;
      background: var(--grad-neon-1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-flex;
      align-items: center;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      list-style: none;
    }

    .nav-links a {
      text-decoration: none;
      color: var(--text-muted);
      font-weight: 600;
      font-size: 0.9rem;
      position: relative;
      padding: 0.25rem 0;
    }

    .nav-links a:hover {
      color: var(--text-main);
    }

    /* 3-State Mechanical Cycle Theme Button */
    .theme-toggle-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      cursor: pointer;
      padding: 0.55rem 1.05rem;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      font-weight: 800;
      font-size: 0.85rem;
      box-shadow: var(--shadow-sm);
      user-select: none;
    }

    .theme-toggle-btn:hover {
      border-color: var(--border-highlight);
      box-shadow: var(--shadow-glow);
      transform: scale(1.02);
    }

    /* =========================================================
       3. SLIDE-OUT NAVIGATION DRAWER (THE SIDE BAR)
       ========================================================= */
    .drawer-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 999;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .drawer-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .drawer-panel {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      max-width: 420px;
      background: var(--bg-card);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border-right: 1px solid var(--border-color);
      box-shadow: 10px 0 40px rgba(0, 0, 0, 0.5);
      z-index: 1000;
      transform: translateX(-100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .drawer-overlay.active .drawer-panel {
      transform: translateX(0);
    }

    .drawer-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-surface);
    }

    .drawer-title {
      font-size: 1.2rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .drawer-close-btn {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      cursor: pointer;
    }

    .drawer-close-btn:hover {
      color: #ef4444;
      border-color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }

    .drawer-search-box {
      padding: 1rem 1.5rem 0.5rem 1.5rem;
    }

    .drawer-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-size: 0.9rem;
      outline: none;
    }

    .drawer-input:focus {
      border-color: #8b5cf6;
      box-shadow: 0 0 10px rgba(139, 92, 246, 0.2);
    }

    .drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.5rem 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .drawer-category-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .drawer-category-header {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 0.25rem 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .drawer-tool-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.75rem;
      border-radius: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      text-decoration: none;
      cursor: pointer;
      font-size: 0.88rem;
      font-weight: 600;
    }

    .drawer-tool-item:hover {
      background: var(--bg-primary);
      border-color: #8b5cf6;
      color: #8b5cf6;
      transform: translateX(4px);
    }

    .drawer-tool-icon {
      font-size: 1.1rem;
    }

    /* =========================================================
       5. HERO SECTION
       ========================================================= */
    .main-wrapper {
      max-width: 1240px;
      margin: 0 auto;
      padding: 0 1.5rem;
    }

    .hero-section {
      text-align: center;
      padding: 4rem 1rem 2.5rem 1rem;
      position: relative;
    }

    .hero-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      border-radius: 9999px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      font-size: 0.82rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.8rem);
      font-weight: 900;
      line-height: 1.15;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
    }

    .hero-title .gradient-text {
      background: var(--grad-neon-1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 2vw, 1.2rem);
      color: var(--text-muted);
      max-width: 740px;
      margin: 0 auto 2.2rem auto;
      line-height: 1.6;
    }

    /* Search Bar */
    .search-wrapper {
      max-width: 660px;
      margin: 0 auto 1.25rem auto;
      position: relative;
    }

    .search-box {
      width: 100%;
      padding: 1.05rem 1.4rem 1.05rem 3.4rem;
      border-radius: 18px;
      background: var(--bg-card);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1.5px solid var(--border-color);
      color: var(--text-main);
      font-size: 1rem;
      font-family: inherit;
      outline: none;
      box-shadow: var(--shadow-lg);
    }

    .search-box:focus {
      border-color: #8b5cf6;
      box-shadow: var(--shadow-glow);
    }

    .search-icon {
      position: absolute;
      left: 1.2rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      pointer-events: none;
      font-size: 1.2rem;
    }

    .search-tags {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .tag-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-sub);
      padding: 0.25rem 0.65rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .tag-btn:hover {
      border-color: #8b5cf6;
      color: #8b5cf6;
    }

    /* =========================================================
       6. TOP CATEGORY PILL TABS BAR (HORIZONTAL SCROLLING)
       ========================================================= */
    .category-tabs-container {
      margin: 2.5rem 0 2rem 0;
    }

    .tabs-header-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .category-tabs-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.6rem;
      border-radius: 24px;
      background: var(--bg-card);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
      overflow-x: auto;
      scrollbar-width: none;
    }

    .category-tabs-bar::-webkit-scrollbar {
      display: none;
    }

    .cat-pill-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.85rem 1.45rem;
      border-radius: 18px;
      border: 1px solid transparent;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: 800;
      white-space: nowrap;
      color: var(--text-muted);
      background: var(--bg-surface);
      border-color: var(--border-color);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .cat-pill-btn:hover {
      color: var(--text-main);
      transform: translateY(-1px);
      border-color: var(--border-highlight);
    }

    /* Active Pill with Glowing Accent */
    .cat-pill-btn.active.financial {
      background: var(--grad-financial);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
      transform: scale(1.02);
    }

    .cat-pill-btn.active.tech_utilities {
      background: var(--grad-tech);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 8px 25px rgba(79, 70, 229, 0.35);
      transform: scale(1.02);
    }

    .cat-pill-btn.active.productivity {
      background: var(--grad-prod);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 8px 25px rgba(236, 72, 153, 0.35);
      transform: scale(1.02);
    }

    .cat-pill-count {
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.08);
      color: inherit;
    }

    .cat-pill-btn.active .cat-pill-count {
      background: rgba(0, 0, 0, 0.25);
      color: #ffffff;
    }

    /* Reset / All tools button */
    .btn-show-all {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      padding: 0.4rem 0.9rem;
      border-radius: 12px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-show-all:hover {
      color: var(--text-main);
      border-color: var(--border-highlight);
    }

    /* =========================================================
       8. THE 35 TOOLS GRID & FADE ANIMATION
       ========================================================= */
    .tools-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
      margin-bottom: 4rem;
    }

    .tool-card {
      background: var(--bg-card);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), 
                  box-shadow 0.3s ease, 
                  border-color 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .tool-card:hover {
      transform: translateY(-6px);
      border-color: rgba(6, 182, 212, 0.5);
      box-shadow: var(--shadow-glow), 0 20px 30px -10px rgba(0, 0, 0, 0.15);
      background: var(--grad-card-hover);
    }

    .tool-card-top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .tool-icon-box {
      width: 52px;
      height: 52px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #ffffff;
      box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.2);
    }

    .tool-badge {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      background: rgba(139, 92, 246, 0.15);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    .tool-category-tag {
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
      display: block;
    }

    .tool-title {
      font-size: 1.25rem;
      font-weight: 800;
      margin-bottom: 0.4rem;
      color: var(--text-main);
      letter-spacing: -0.01em;
    }

    .tool-tagline {
      font-size: 0.8rem;
      font-weight: 700;
      color: #06b6d4;
      margin-bottom: 0.6rem;
    }

    .tool-description {
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 1.5rem;
      flex-grow: 1;
    }

    .tool-action-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 14px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-weight: 800;
      font-size: 0.88rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tool-card:hover .tool-action-btn {
      background: var(--grad-neon-1);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 4px 15px rgba(217, 70, 239, 0.3);
    }

    /* =========================================================
       9. INTERACTIVE TOOL MODAL (COMPOUND INTEREST / ENGINE)
       ========================================================= */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      overflow-y: auto;
    }

    .modal-overlay.active {
      display: flex;
    }

    .modal-container {
      position: relative;
      width: 100%;
      max-width: 860px;
      margin: auto;
      background: var(--bg-card);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      border: 1px solid var(--border-color);
      border-radius: 28px;
      padding: 2rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      color: var(--text-main);
    }

    .modal-header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .btn-back-tools {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 1rem;
      border-radius: 12px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-size: 0.85rem;
      font-weight: 800;
      cursor: pointer;
    }

    .btn-back-tools:hover {
      background: var(--grad-neon-1);
      color: #ffffff;
      border-color: transparent;
    }

    .modal-close-btn {
      background: transparent;
      border: none;
      font-size: 1.6rem;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
    }

    .modal-close-btn:hover {
      color: #ef4444;
    }

    /* Result Cards */
    .calc-results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .calc-card {
      padding: 1.25rem;
      border-radius: 20px;
      background: rgba(139, 92, 246, 0.06);
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .calc-card.invested {
      background: rgba(6, 182, 212, 0.08);
      border-color: rgba(6, 182, 212, 0.3);
    }

    .calc-card.interest {
      background: rgba(168, 85, 247, 0.08);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .calc-card.total {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.15));
      border-color: rgba(236, 72, 153, 0.4);
    }

    .calc-card-label {
      font-size: 0.75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }

    .calc-card-val {
      font-size: 1.75rem;
      font-weight: 900;
      font-family: 'Outfit', sans-serif;
      letter-spacing: -0.02em;
    }

    .calc-card-sub {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* Form Controls */
    .calc-controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
      padding: 1.5rem;
      border-radius: 22px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    @media (max-width: 640px) {
      .calc-controls-grid {
        grid-template-columns: 1fr;
      }
    }

    .ctrl-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .ctrl-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .ctrl-input-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 0.25rem 0.6rem;
      border-radius: 8px;
      font-family: monospace;
      font-weight: 700;
    }

    .ctrl-input-badge input {
      background: transparent;
      border: none;
      color: var(--text-main);
      font-family: inherit;
      font-weight: bold;
      width: 80px;
      text-align: right;
      outline: none;
    }

    .ctrl-slider {
      width: 100%;
      accent-color: #a855f7;
      cursor: pointer;
    }

    .ctrl-range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .select-dropdown {
      width: 100%;
      padding: 0.65rem 0.9rem;
      border-radius: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      font-weight: 600;
      font-size: 0.85rem;
      outline: none;
      cursor: pointer;
    }

    .chart-container-box {
      padding: 1.25rem;
      border-radius: 20px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      margin-bottom: 1.5rem;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      font-size: 0.9rem;
      font-weight: 700;
    }

    .chart-wrapper {
      position: relative;
      height: 240px;
      width: 100%;
    }

    /* Suggested Tools Mini-Grid Section */
    .suggested-tools-section {
      margin-top: 1.75rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .suggested-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .suggested-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.85rem;
    }

    .suggested-mini-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 0.9rem;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .suggested-mini-card:hover {
      transform: translateY(-3px) scale(1.02);
      border-color: #8b5cf6;
      box-shadow: 0 8px 20px rgba(139, 92, 246, 0.2);
      background: var(--bg-card);
    }

    .mini-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .mini-icon {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: #fff;
    }

    .mini-badge {
      font-size: 0.65rem;
      font-weight: 800;
      text-transform: uppercase;
      padding: 0.15rem 0.45rem;
      border-radius: 9999px;
      background: rgba(139, 92, 246, 0.12);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.25);
    }

    .mini-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: var(--text-main);
      margin-bottom: 0.25rem;
      line-height: 1.2;
    }

    .mini-desc {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-bottom: 0.6rem;
      line-height: 1.35;
    }

    .mini-launch {
      font-size: 0.75rem;
      font-weight: 800;
      color: #8b5cf6;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    /* =========================================================
       10. FOOTER
       ========================================================= */
    footer.site-footer {
      border-top: 1px solid var(--border-color);
      background: var(--nav-bg);
      backdrop-filter: var(--glass-blur);
      -webkit-backdrop-filter: var(--glass-blur);
      padding: 3rem 1.5rem;
      margin-top: 4rem;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .footer-links {
      display: flex;
      gap: 1.5rem;
      list-style: none;
    }

    .footer-links a {
      text-decoration: none;
      color: var(--text-muted);
      font-size: 0.9rem;
      font-weight: 600;
    }

    .footer-links a:hover {
      color: var(--text-main);
    }
  </style>
</head>
<body>

  <!-- Ambient Glow Spheres -->
  <div class="ambient-sphere-1"></div>
  <div class="ambient-sphere-2"></div>

  <!-- 2. Sticky Glassmorphism Header Bar -->
  <header class="nav-header">
    <div class="nav-container">
      <div class="nav-left">
        <!-- Browse Tools Trigger Button (Slides out Sidebar Drawer) -->
        <button id="drawerOpenBtn" class="btn-browse-drawer" aria-label="Open Sidebar Directory">
          <span>☰</span>
          <span>Browse Tools</span>
        </button>

        <a href="#home" class="logo-area">
          <span class="logo-text">QuickFree Tools ✨</span>
        </a>
      </div>

      <nav>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#tools">All Tools (50+)</a></li>
          <li><a href="javascript:void(0)" onclick="alert('QuickFree Tools: Handcrafted collection of 35+ free utilities operating 100% locally in your browser.')">About Us</a></li>
          <li><a href="javascript:void(0)" onclick="alert('Privacy Guarantee: All computations run client-side in your browser. Zero tracking or telemetry.')">Privacy Policy</a></li>
        </ul>
      </nav>

      <!-- 3-Way Mechanical Cycle Theme Button (Light -> Dark -> Reading) -->
      <button id="themeToggleBtn" class="theme-toggle-btn" aria-label="Toggle Theme Cycle" title="Click to cycle theme (Light -> Dark -> Reading)">
        <span id="themeIcon">☀️</span>
        <span id="themeLabel">Light Mode</span>
      </button>
    </div>
  </header>

  <!-- 3. Slide-out Navigation Drawer Menu (The Side Bar) -->
  <div id="drawerOverlay" class="drawer-overlay" onclick="closeDrawer()">
    <div class="drawer-panel" onclick="event.stopPropagation()">
      <div class="drawer-header">
        <div class="drawer-title">
          <span>📂</span>
          <span>Tools Directory (35)</span>
        </div>
        <button class="drawer-close-btn" onclick="closeDrawer()" aria-label="Close Drawer">✕</button>
      </div>

      <div class="drawer-search-box">
        <input 
          type="text" 
          id="drawerSearchInput" 
          class="drawer-input" 
          placeholder="Filter 35 tools..."
          autocomplete="off"
        >
      </div>

      <div class="drawer-content" id="drawerContent">
        <!-- Financial Group -->
        <div class="drawer-category-group">
          <div class="drawer-category-header">
            <span>💰 Financial Engines</span>
            <span>12 tools</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('sip-visualizer', 'financial')">
            <span class="drawer-tool-icon">📈</span>
            <span>SIP Investment Visualizer</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('loan-emi-breakout', 'financial')">
            <span class="drawer-tool-icon">🧮</span>
            <span>Advanced Loan EMI Breakout</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('crypto-profit-loss', 'financial')">
            <span class="drawer-tool-icon">🪙</span>
            <span>Crypto Profit & ROI Matrix</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('compound-interest-planner', 'financial')">
            <span class="drawer-tool-icon">💎</span>
            <span>Compound Interest Multiplier</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('fire-retirement-age', 'financial')">
            <span class="drawer-tool-icon">🔥</span>
            <span>F.I.R.E. Retirement Estimator</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('gst-vat-calculator', 'financial')">
            <span class="drawer-tool-icon">🧾</span>
            <span>GST & VAT Splitter</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('inflation-purchasing-power', 'financial')">
            <span class="drawer-tool-icon">📉</span>
            <span>Inflation & Purchasing Power</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('stock-cagr-matrix', 'financial')">
            <span class="drawer-tool-icon">📊</span>
            <span>CAGR Returns Matrix</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('fd-rd-returns', 'financial')">
            <span class="drawer-tool-icon">🏛️</span>
            <span>Fixed Deposit (FD) / RD Returns</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('freelance-hourly-rate', 'financial')">
            <span class="drawer-tool-icon">💼</span>
            <span>Freelance Hourly Rate Planner</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('dividend-income-planner', 'financial')">
            <span class="drawer-tool-icon">💸</span>
            <span>Dividend Cash Flow Model</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('salary-takehome-calculator', 'financial')">
            <span class="drawer-tool-icon">💵</span>
            <span>Salary Take-Home & CTC Splitter</span>
          </div>
        </div>

        <!-- Tech Utilities Group -->
        <div class="drawer-category-group">
          <div class="drawer-category-header">
            <span>💻 Developer & Tech Utilities</span>
            <span>12 tools</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('smart-pdf-compressor', 'tech_utilities')">
            <span class="drawer-tool-icon">📄</span>
            <span>Smart PDF Compressor</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('qr-code-studio', 'tech_utilities')">
            <span class="drawer-tool-icon">📱</span>
            <span>QR Code Studio Pro</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('json-to-typescript', 'tech_utilities')">
            <span class="drawer-tool-icon">⚡</span>
            <span>JSON to TypeScript</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('color-palette-studio', 'tech_utilities')">
            <span class="drawer-tool-icon">🎨</span>
            <span>Color Palette & Gradient Studio</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('regex-live-tester', 'tech_utilities')">
            <span class="drawer-tool-icon">🔍</span>
            <span>Regex Interactive Tester</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('base64-encoder-decoder', 'tech_utilities')">
            <span class="drawer-tool-icon">🔐</span>
            <span>Base64 String & Image Converter</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('markdown-preview-editor', 'tech_utilities')">
            <span class="drawer-tool-icon">📝</span>
            <span>Markdown Live Editor</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('css-box-shadow-generator', 'tech_utilities')">
            <span class="drawer-tool-icon">✨</span>
            <span>CSS Box Shadow & Glow</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('hash-generator', 'tech_utilities')">
            <span class="drawer-tool-icon">🔒</span>
            <span>Cryptographic Hash Generator</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('jwt-decoder', 'tech_utilities')">
            <span class="drawer-tool-icon">🛡️</span>
            <span>JWT Token Inspector</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('lorem-ipsum-generator', 'tech_utilities')">
            <span class="drawer-tool-icon">📜</span>
            <span>Lorem Ipsum Generator</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('svg-path-visualizer', 'tech_utilities')">
            <span class="drawer-tool-icon">📐</span>
            <span>SVG Path & Curve Visualizer</span>
          </div>
        </div>

        <!-- Productivity Group -->
        <div class="drawer-category-group">
          <div class="drawer-category-header">
            <span>⚡ Everyday Productivity</span>
            <span>11 tools</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('pomodoro-focus-engine', 'productivity')">
            <span class="drawer-tool-icon">⏱️</span>
            <span>Pomodoro Focus Matrix</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('unit-converter-pro', 'productivity')">
            <span class="drawer-tool-icon">🔄</span>
            <span>Universal Unit Converter</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('timestamp-epoch-converter', 'productivity')">
            <span class="drawer-tool-icon">⏰</span>
            <span>Unix Timestamp Converter</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('percentage-difference-calc', 'productivity')">
            <span class="drawer-tool-icon">🎯</span>
            <span>Percentage Difference Engine</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('world-clock-converter', 'productivity')">
            <span class="drawer-tool-icon">🌍</span>
            <span>World Timezone Matrix</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('ai-prompt-enhancer', 'productivity')">
            <span class="drawer-tool-icon">🤖</span>
            <span>AI Prompt Studio</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('ai-code-explainer', 'productivity')">
            <span class="drawer-tool-icon">💡</span>
            <span>Code Explainer & Formatter</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('word-counter-analyzer', 'productivity')">
            <span class="drawer-tool-icon">📊</span>
            <span>Word & Character Analyzer</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('password-strength-generator', 'productivity')">
            <span class="drawer-tool-icon">🔑</span>
            <span>Password Entropy Generator</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('aspect-ratio-calc', 'productivity')">
            <span class="drawer-tool-icon">🖥️</span>
            <span>Aspect Ratio & Resolution Matrix</span>
          </div>
          <div class="drawer-tool-item" onclick="launchToolFromDrawer('daily-water-macro-calc', 'productivity')">
            <span class="drawer-tool-icon">💧</span>
            <span>Macro & Hydration Planner</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Main Container -->
  <main class="main-wrapper" id="home">
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-pill">
        <span class="badge-dot"></span>
        <span>35 Operational Engines • 100% Free & In-Browser Private</span>
      </div>

      <h1 class="hero-title">
        Financial, Tech & Everyday Tools.<br>
        <span class="gradient-text">Zero Paywalls. 100% Free.</span>
      </h1>

      <p class="hero-subtitle">
        Say goodbye to subscription traps and forced registrations. Experience instant, high-end utilities crafted with pristine glassmorphism and uncompromised privacy.
      </p>

      <!-- Interactive Search Bar -->
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          id="toolSearchInput" 
          class="search-box" 
          placeholder="Search 35 engines (e.g., SIP, EMI, PDF, QR, Pomodoro)..." 
          autocomplete="off"
        >
      </div>

      <div class="search-tags">
        <span>Trending:</span>
        <button class="tag-btn" onclick="filterByQuery('SIP')">📈 SIP Visualizer</button>
        <button class="tag-btn" onclick="filterByQuery('EMI')">🧮 Loan EMI</button>
        <button class="tag-btn" onclick="filterByQuery('PDF')">📄 PDF Compressor</button>
        <button class="tag-btn" onclick="filterByQuery('QR')">📱 QR Studio</button>
        <button class="tag-btn" onclick="filterByQuery('Pomodoro')">⏱️ Pomodoro</button>
      </div>
    </section>

    <!-- Top Category Pill Tabs Navigation Bar -->
    <section class="category-tabs-container" id="tools">
      <div class="tabs-header-row">
        <div>
          <div style="color:#06b6d4; font-weight:800; font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:4px;">
            Dynamic Category Filter
          </div>
          <h2 style="font-size:1.8rem; font-weight:900; letter-spacing:-0.02em;">Select Your Engine</h2>
        </div>

        <div style="display:flex; align-items:center; gap:0.5rem;">
          <button class="btn-show-all" onclick="showAllCategories()">Show All 35 Tools</button>
          <span style="font-size:0.75rem; font-weight:800; padding:0.35rem 0.75rem; border-radius:10px; background:rgba(168,85,247,0.12); color:#a855f7;">
            <span id="activeCountLabel">12</span> of 35 Active
          </span>
        </div>
      </div>

      <!-- 3 Vibrant Colorful Pill-Shaped Option Buttons -->
      <div class="category-tabs-bar">
        <!-- 1. Financial Engines (Default Active) -->
        <button 
          id="tab-financial" 
          class="cat-pill-btn active financial" 
          onclick="selectCategory('financial')"
        >
          <span style="font-size:1.2rem;">💰</span>
          <span>Financial Engines</span>
          <span class="cat-pill-count">12</span>
        </button>

        <!-- 2. Developer & Tech Utilities -->
        <button 
          id="tab-tech_utilities" 
          class="cat-pill-btn" 
          onclick="selectCategory('tech_utilities')"
        >
          <span style="font-size:1.2rem;">💻</span>
          <span>Developer & Tech Utilities</span>
          <span class="cat-pill-count">12</span>
        </button>

        <!-- 3. Everyday Productivity -->
        <button 
          id="tab-productivity" 
          class="cat-pill-btn" 
          onclick="selectCategory('productivity')"
        >
          <span style="font-size:1.2rem;">⚡</span>
          <span>Everyday Productivity</span>
          <span class="cat-pill-count">11</span>
        </button>
      </div>
    </section>

    <!-- 35 Tools Master Grid Cards -->
    <div class="tools-grid" id="toolsGrid">
      
      <!-- ================= FINANCIAL ENGINES (12) ================= -->
      
      <!-- Tool 1: SIP Visualizer -->
      <article class="tool-card" data-category="financial" data-id="sip-visualizer" data-keywords="sip investment visualizer mutual fund wealth compounding" onclick="openCompoundInterestTool()">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #10b981, #06b6d4);">📈</div>
            <span class="tool-badge">Interactive Demo</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">SIP Investment Visualizer</h3>
          <p class="tool-tagline">Dynamic compounding curves & inflation modeling</p>
          <p class="tool-description">Simulate monthly mutual fund SIP investments, returns multipliers, and target wealth accumulation with live sliders.</p>
        </div>
        <button class="tool-action-btn">Launch Visualizer &rarr;</button>
      </article>

      <!-- Tool 2: Loan EMI Breakout -->
      <article class="tool-card" data-category="financial" data-id="loan-emi-breakout" data-keywords="loan emi breakout mortgage amortization interest principal" onclick="alert('Launching Advanced Loan EMI Breakout...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">🧮</div>
            <span class="tool-badge">Popular</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Advanced Loan EMI Breakout</h3>
          <p class="tool-tagline">Full amortization schedule & principal vs interest</p>
          <p class="tool-description">Calculate monthly home, car, or personal loan EMIs with total payable interest and yearly balance breakdown.</p>
        </div>
        <button class="tool-action-btn">Calculate EMI &rarr;</button>
      </article>

      <!-- Tool 3: Crypto Profit & ROI -->
      <article class="tool-card" data-category="financial" data-id="crypto-profit-loss" data-keywords="crypto profit roi bitcoin ethereum dca trading" onclick="alert('Launching Crypto Profit & ROI Matrix...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">🪙</div>
            <span class="tool-badge">Crypto</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Crypto Profit & ROI Matrix</h3>
          <p class="tool-tagline">Net ROI, exchange fee offsets & tax liability</p>
          <p class="tool-description">Evaluate buy/sell positions, DCA average prices, leverage payouts, and net profit percentages instantly.</p>
        </div>
        <button class="tool-action-btn">Calculate ROI &rarr;</button>
      </article>

      <!-- Tool 4: Compound Interest Multiplier -->
      <article class="tool-card" data-category="financial" data-id="compound-interest-planner" data-keywords="compound interest multiplier wealth growth future value savings" onclick="openCompoundInterestTool()">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #a855f7, #ec4899);">💎</div>
            <span class="tool-badge" style="background: rgba(236,72,153,0.15); color: #ec4899; border-color: rgba(236,72,153,0.3);">100% Live Demo</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Compound Interest Multiplier</h3>
          <p class="tool-tagline">Mapped across 1 to 50 years with ₹ Indian Rupee outputs</p>
          <p class="tool-description">Forecast exponential asset growth with daily, monthly, and annual compounding schedules, live ₹ calculations & Chart.js graph.</p>
        </div>
        <button class="tool-action-btn" onclick="event.stopPropagation(); openCompoundInterestTool();">Model Growth &rarr;</button>
      </article>

      <!-- Tool 5: FIRE Retirement Age -->
      <article class="tool-card" data-category="financial" data-id="fire-retirement-age" data-keywords="fire retirement financial freedom corpus" onclick="alert('Launching F.I.R.E. Retirement Estimator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #f43f5e, #fb923c);">🔥</div>
            <span class="tool-badge">Wealth</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">F.I.R.E. Retirement Estimator</h3>
          <p class="tool-tagline">Financial Independence & Early Retirement corpus</p>
          <p class="tool-description">Find your exact retirement age target and corpus requirement based on the 4% safe withdrawal rule and inflation.</p>
        </div>
        <button class="tool-action-btn">Calculate FIRE &rarr;</button>
      </article>

      <!-- Tool 6: GST & VAT Splitter -->
      <article class="tool-card" data-category="financial" data-id="gst-vat-calculator" data-keywords="gst vat splitter tax invoice billing" onclick="alert('Launching GST & VAT Splitter...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #0ea5e9, #6366f1);">🧾</div>
            <span class="tool-badge">Instant</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">GST & VAT Splitter</h3>
          <p class="tool-tagline">Inclusive and exclusive tax breakdowns</p>
          <p class="tool-description">Determine pre-tax base cost, CGST/SGST/IGST tax slabs (5%, 12%, 18%, 28%), and total invoice valuation.</p>
        </div>
        <button class="tool-action-btn">Split Tax &rarr;</button>
      </article>

      <!-- Tool 7: Inflation & Purchasing Power -->
      <article class="tool-card" data-category="financial" data-id="inflation-purchasing-power" data-keywords="inflation purchasing power rupee decay" onclick="alert('Launching Inflation & Purchasing Power Calculator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #e11d48, #be123c);">📉</div>
            <span class="tool-badge">Economics</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Inflation & Purchasing Power</h3>
          <p class="tool-tagline">Track historical currency erosion over decades</p>
          <p class="tool-description">See how much ₹1,00,000 today will buy in 10, 20, or 30 years at custom compounding CPI inflation rates.</p>
        </div>
        <button class="tool-action-btn">Analyze Inflation &rarr;</button>
      </article>

      <!-- Tool 8: CAGR Returns Matrix -->
      <article class="tool-card" data-category="financial" data-id="stock-cagr-matrix" data-keywords="cagr returns matrix compound annual growth" onclick="alert('Launching CAGR Returns Matrix...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #059669, #10b981);">📊</div>
            <span class="tool-badge">Investing</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">CAGR Returns Matrix</h3>
          <p class="tool-tagline">True annualized compounding percentage</p>
          <p class="tool-description">Calculate compound annual growth rate across equities, mutual funds, real estate, and venture investments.</p>
        </div>
        <button class="tool-action-btn">Calculate CAGR &rarr;</button>
      </article>

      <!-- Tool 9: Fixed Deposit (FD) / RD Returns -->
      <article class="tool-card" data-category="financial" data-id="fd-rd-returns" data-keywords="fd rd fixed deposit recurring returns bank" onclick="alert('Launching FD/RD Returns Calculator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #d97706, #f59e0b);">🏛️</div>
            <span class="tool-badge">Banking</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Fixed Deposit (FD) / RD Returns</h3>
          <p class="tool-tagline">Quarterly compounding & senior citizen interest</p>
          <p class="tool-description">Accurate bank maturity calculation with interest payout schedules and TDS estimation for fixed deposits.</p>
        </div>
        <button class="tool-action-btn">Compute Returns &rarr;</button>
      </article>

      <!-- Tool 10: Freelance Hourly Rate Planner -->
      <article class="tool-card" data-category="financial" data-id="freelance-hourly-rate" data-keywords="freelance hourly rate planner consulting pricing" onclick="alert('Launching Freelance Rate Planner...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #8b5cf6, #c084fc);">💼</div>
            <span class="tool-badge">Career</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Freelance Hourly Rate Planner</h3>
          <p class="tool-tagline">Factor overheads, billable hours & profit targets</p>
          <p class="tool-description">Compute your minimum hourly rate to hit net revenue goals while accounting for taxes, vacations, and expenses.</p>
        </div>
        <button class="tool-action-btn">Plan Rate &rarr;</button>
      </article>

      <!-- Tool 11: Dividend Cash Flow Model -->
      <article class="tool-card" data-category="financial" data-id="dividend-income-planner" data-keywords="dividend yield cash flow reinvestment drip" onclick="alert('Launching Dividend Income Planner...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #10b981, #047857);">💸</div>
            <span class="tool-badge">Passive</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Dividend Cash Flow Model</h3>
          <p class="tool-tagline">DRIP reinvestment & monthly passive yield</p>
          <p class="tool-description">Simulate long-term dividend payouts, dividend growth rate, and passive cash-flow generation from high-yield stocks.</p>
        </div>
        <button class="tool-action-btn">Model Dividends &rarr;</button>
      </article>

      <!-- Tool 12: Salary Take-Home & CTC Splitter -->
      <article class="tool-card" data-category="financial" data-id="salary-takehome-calculator" data-keywords="salary ctc in-hand take home tax epf hra" onclick="alert('Launching Salary Take-Home Calculator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #0284c7, #0369a1);">💵</div>
            <span class="tool-badge">Salary</span>
          </div>
          <span class="tool-category-tag">Financial Engines</span>
          <h3 class="tool-title">Salary Take-Home & CTC Splitter</h3>
          <p class="tool-tagline">In-hand salary after PF, standard deduction & tax</p>
          <p class="tool-description">Break down total Cost to Company (CTC) into basic pay, HRA, special allowance, PF deduction, and net monthly deposit.</p>
        </div>
        <button class="tool-action-btn">Split Salary &rarr;</button>
      </article>


      <!-- ================= TECH & DEVELOPER UTILITIES (12) ================= -->

      <!-- Tool 13: Smart PDF Compressor -->
      <article class="tool-card" data-category="tech_utilities" data-id="smart-pdf-compressor" data-keywords="pdf compressor shrink optimize document in-browser" onclick="alert('Launching Smart PDF Compressor...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #ef4444, #dc2626);">📄</div>
            <span class="tool-badge">Essential</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Smart PDF Compressor</h3>
          <p class="tool-tagline">100% private local PDF compression in your browser</p>
          <p class="tool-description">Compress oversized PDF documents with lossless or high-ratio image resizes without uploading files to third-party servers.</p>
        </div>
        <button class="tool-action-btn">Compress PDF &rarr;</button>
      </article>

      <!-- Tool 14: QR Code Studio Pro -->
      <article class="tool-card" data-category="tech_utilities" data-id="qr-code-studio" data-keywords="qr code generator scanner high-res svg png" onclick="alert('Launching QR Code Studio Pro...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #06b6d4, #0284c7);">📱</div>
            <span class="tool-badge">High Utility</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">QR Code Studio Pro</h3>
          <p class="tool-tagline">Custom colors, logos & SVG vector downloads</p>
          <p class="tool-description">Create clean, scannable QR codes for URLs, WiFi networks, vCards, UPI payments, and plain text with custom margins.</p>
        </div>
        <button class="tool-action-btn">Create QR Code &rarr;</button>
      </article>

      <!-- Tool 15: JSON to TypeScript -->
      <article class="tool-card" data-category="tech_utilities" data-id="json-to-typescript" data-keywords="json typescript interface type generator converter" onclick="alert('Launching JSON to TypeScript Converter...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #3b82f6, #1d4ed8);">⚡</div>
            <span class="tool-badge">Dev Tool</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">JSON to TypeScript Interfaces</h3>
          <p class="tool-tagline">Instantly parse complex JSON into strictly typed types</p>
          <p class="tool-description">Paste any API JSON response payload to generate clean TypeScript interfaces with nested object definitions and optional properties.</p>
        </div>
        <button class="tool-action-btn">Generate Interfaces &rarr;</button>
      </article>

      <!-- Tool 16: Color Palette & Gradient Studio -->
      <article class="tool-card" data-category="tech_utilities" data-id="color-palette-studio" data-keywords="color palette generator gradient studio contrast hex rgb" onclick="alert('Launching Color Palette Studio...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #ec4899, #8b5cf6);">🎨</div>
            <span class="tool-badge">Design</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Color Palette & Gradient Studio</h3>
          <p class="tool-tagline">Harmonies, CSS gradients & WCAG contrast checks</p>
          <p class="tool-description">Explore monochromatic, complementary, and triad palettes with instant CSS export and accessibility contrast ratio validation.</p>
        </div>
        <button class="tool-action-btn">Explore Palettes &rarr;</button>
      </article>

      <!-- Tool 17: Regex Interactive Tester -->
      <article class="tool-card" data-category="tech_utilities" data-id="regex-live-tester" data-keywords="regex regular expression tester live match groups" onclick="alert('Launching Regex Interactive Tester...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #10b981, #059669);">🔍</div>
            <span class="tool-badge">Interactive</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Regex Interactive Tester</h3>
          <p class="tool-tagline">Real-time matching, group capture & flag debugging</p>
          <p class="tool-description">Test and debug regular expressions with real-time highlighted match groups, replacement previews, and regex explanation guides.</p>
        </div>
        <button class="tool-action-btn">Test Regex &rarr;</button>
      </article>

      <!-- Tool 18: Base64 String & Image Converter -->
      <article class="tool-card" data-category="tech_utilities" data-id="base64-encoder-decoder" data-keywords="base64 encode decode image string binary" onclick="alert('Launching Base64 Converter...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #6366f1, #4338ca);">🔐</div>
            <span class="tool-badge">Utility</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Base64 String & Image Converter</h3>
          <p class="tool-tagline">Bidirectional text and image Data URI conversion</p>
          <p class="tool-description">Quickly encode and decode strings, files, and images to Base64 format with instant preview and copy buttons.</p>
        </div>
        <button class="tool-action-btn">Convert Base64 &rarr;</button>
      </article>

      <!-- Tool 19: Markdown Live Editor -->
      <article class="tool-card" data-category="tech_utilities" data-id="markdown-preview-editor" data-keywords="markdown live editor preview html export" onclick="alert('Launching Markdown Editor...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #0ea5e9, #0284c7);">📝</div>
            <span class="tool-badge">Writing</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Markdown Live Editor</h3>
          <p class="tool-tagline">Side-by-side editing with formatted HTML export</p>
          <p class="tool-description">Write and render GitHub-flavored Markdown with code highlighting, table formatting, and single-click HTML export.</p>
        </div>
        <button class="tool-action-btn">Open Editor &rarr;</button>
      </article>

      <!-- Tool 20: CSS Box Shadow & Glow -->
      <article class="tool-card" data-category="tech_utilities" data-id="css-box-shadow-generator" data-keywords="css box shadow glow generator visual frosted" onclick="alert('Launching CSS Box Shadow Studio...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #d946ef, #a855f7);">✨</div>
            <span class="tool-badge">CSS</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">CSS Box Shadow & Glow</h3>
          <p class="tool-tagline">Visual multi-layer shadows, spread & neon glows</p>
          <p class="tool-description">Design smooth multi-layer elevation shadows and neon ambient glows visually with instant CSS code generation.</p>
        </div>
        <button class="tool-action-btn">Generate Shadows &rarr;</button>
      </article>

      <!-- Tool 21: Cryptographic Hash Generator -->
      <article class="tool-card" data-category="tech_utilities" data-id="hash-generator" data-keywords="hash md5 sha256 sha512 checksum crypto" onclick="alert('Launching Cryptographic Hash Generator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #14b8a6, #0f766e);">🔒</div>
            <span class="tool-badge">Security</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Cryptographic Hash Generator</h3>
          <p class="tool-tagline">MD5, SHA-1, SHA-256, and SHA-512 checksums</p>
          <p class="tool-description">Compute secure cryptographic digests for text strings and verify file integrity using browser-native Web Crypto APIs.</p>
        </div>
        <button class="tool-action-btn">Generate Hashes &rarr;</button>
      </article>

      <!-- Tool 22: JWT Token Inspector -->
      <article class="tool-card" data-category="tech_utilities" data-id="jwt-decoder" data-keywords="jwt json web token decode header payload verify" onclick="alert('Launching JWT Inspector...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #f97316, #ea580c);">🛡️</div>
            <span class="tool-badge">Security</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">JWT Token Inspector</h3>
          <p class="tool-tagline">Decode Header, Payload & inspect expiry timestamps</p>
          <p class="tool-description">Safely inspect JSON Web Tokens locally in your browser. Verify claims, expiry dates (exp), and issue timestamps (iat).</p>
        </div>
        <button class="tool-action-btn">Inspect Token &rarr;</button>
      </article>

      <!-- Tool 23: Lorem Ipsum Generator -->
      <article class="tool-card" data-category="tech_utilities" data-id="lorem-ipsum-generator" data-keywords="lorem ipsum placeholder text dummy copy" onclick="alert('Launching Lorem Ipsum Generator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #84cc16, #65a30d);">📜</div>
            <span class="tool-badge">Content</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">Lorem Ipsum Generator</h3>
          <p class="tool-tagline">Paragraph, sentence, and word placeholder generator</p>
          <p class="tool-description">Generate standard Latin or tech-themed placeholder copy formatted as plain text, HTML paragraphs, or lists.</p>
        </div>
        <button class="tool-action-btn">Generate Text &rarr;</button>
      </article>

      <!-- Tool 24: SVG Path & Curve Visualizer -->
      <article class="tool-card" data-category="tech_utilities" data-id="svg-path-visualizer" data-keywords="svg path visualizer bezier curve vector" onclick="alert('Launching SVG Path Visualizer...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #ec4899, #be185d);">📐</div>
            <span class="tool-badge">Vector</span>
          </div>
          <span class="tool-category-tag">Tech & Developer Utilities</span>
          <h3 class="tool-title">SVG Path & Curve Visualizer</h3>
          <p class="tool-tagline">Interactive Bézier nodes, arc geometry & viewBox scaling</p>
          <p class="tool-description">Visualize and fine-tune SVG path strings (&apos;d=&quot;...&quot;&apos;) with live draggable control points and responsive viewBox preview.</p>
        </div>
        <button class="tool-action-btn">Visualize SVG &rarr;</button>
      </article>


      <!-- ================= EVERYDAY PRODUCTIVITY (11) ================= -->

      <!-- Tool 25: Pomodoro Focus Matrix -->
      <article class="tool-card" data-category="productivity" data-id="pomodoro-focus-engine" data-keywords="pomodoro timer focus work break audio interval" onclick="alert('Launching Pomodoro Focus Matrix...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #ef4444, #f97316);">⏱️</div>
            <span class="tool-badge">Focus</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Pomodoro Focus Matrix</h3>
          <p class="tool-tagline">25/5 intervals, streak tracker & ambient white noise</p>
          <p class="tool-description">Master your deep work sessions with customizable focus rounds, break timers, and browser tab progress notifications.</p>
        </div>
        <button class="tool-action-btn">Start Focus &rarr;</button>
      </article>

      <!-- Tool 26: Universal Unit Converter -->
      <article class="tool-card" data-category="productivity" data-id="unit-converter-pro" data-keywords="unit converter length mass speed temperature digital" onclick="alert('Launching Universal Unit Converter...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #06b6d4, #3b82f6);">🔄</div>
            <span class="tool-badge">Multi-Unit</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Universal Unit Converter</h3>
          <p class="tool-tagline">Length, mass, area, temperature, speed & data storage</p>
          <p class="tool-description">Instant conversion across metric and imperial systems with precision rounding and multi-unit simultaneous breakdown.</p>
        </div>
        <button class="tool-action-btn">Convert Units &rarr;</button>
      </article>

      <!-- Tool 27: Unix Timestamp Converter -->
      <article class="tool-card" data-category="productivity" data-id="timestamp-epoch-converter" data-keywords="timestamp unix epoch date time timezone converter" onclick="alert('Launching Unix Timestamp Converter...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #8b5cf6, #6366f1);">⏰</div>
            <span class="tool-badge">Time</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Unix Timestamp Converter</h3>
          <p class="tool-tagline">Epoch seconds & milliseconds to human-readable dates</p>
          <p class="tool-description">Convert between Unix epoch timestamps and human dates across UTC, local timezone, and ISO 8601 formatting.</p>
        </div>
        <button class="tool-action-btn">Convert Time &rarr;</button>
      </article>

      <!-- Tool 28: Percentage Difference Engine -->
      <article class="tool-card" data-category="productivity" data-id="percentage-difference-calc" data-keywords="percentage difference increase decrease ratio math" onclick="alert('Launching Percentage Difference Engine...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #10b981, #14b8a6);">🎯</div>
            <span class="tool-badge">Math</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Percentage Difference Engine</h3>
          <p class="tool-tagline">% Increase, % Decrease & Proportion Solver</p>
          <p class="tool-description">Calculate percentage change between two values, find percent of a number, and compute markdown discounts effortlessly.</p>
        </div>
        <button class="tool-action-btn">Compute % &rarr;</button>
      </article>

      <!-- Tool 29: World Timezone Matrix -->
      <article class="tool-card" data-category="productivity" data-id="world-clock-converter" data-keywords="world clock timezone meeting planner utc gmt ist est" onclick="alert('Launching World Timezone Matrix...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #0284c7, #2563eb);">🌍</div>
            <span class="tool-badge">Global</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">World Timezone Matrix</h3>
          <p class="tool-tagline">Global meeting overlap planner & UTC offsets</p>
          <p class="tool-description">Coordinate across multiple time zones simultaneously (EST, PST, GMT, IST, JST) to schedule remote meetings effortlessly.</p>
        </div>
        <button class="tool-action-btn">Plan Meetings &rarr;</button>
      </article>

      <!-- Tool 30: AI Prompt Studio -->
      <article class="tool-card" data-category="productivity" data-id="ai-prompt-enhancer" data-keywords="ai prompt enhancer gpt claude gemini system prompt" onclick="alert('Launching AI Prompt Studio...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #d946ef, #9333ea);">🤖</div>
            <span class="tool-badge">AI Tool</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">AI Prompt Studio</h3>
          <p class="tool-tagline">Upgrade raw instructions into rich system prompts</p>
          <p class="tool-description">Format, optimize, and structure prompts for Gemini, GPT, and Claude models with role personas, rules, and guardrails.</p>
        </div>
        <button class="tool-action-btn">Enhance Prompt &rarr;</button>
      </article>

      <!-- Tool 31: Code Explainer & Formatter -->
      <article class="tool-card" data-category="productivity" data-id="ai-code-explainer" data-keywords="code explainer formatter beautify js py html" onclick="alert('Launching Code Explainer & Formatter...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #f59e0b, #d97706);">💡</div>
            <span class="tool-badge">Coding</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Code Explainer & Formatter</h3>
          <p class="tool-tagline">Format and analyze JavaScript, Python & HTML snippets</p>
          <p class="tool-description">Beautify minified code snippets, check syntax errors, and inspect complexity metrics client-side with syntax highlighting.</p>
        </div>
        <button class="tool-action-btn">Format Code &rarr;</button>
      </article>

      <!-- Tool 32: Word & Character Analyzer -->
      <article class="tool-card" data-category="productivity" data-id="word-counter-analyzer" data-keywords="word counter character reading time readability density" onclick="alert('Launching Word Counter & Analyzer...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #64748b, #475569);">📊</div>
            <span class="tool-badge">Writing</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Word & Character Analyzer</h3>
          <p class="tool-tagline">Reading time, keyword density & syllable counts</p>
          <p class="tool-description">Real-time word, character (with and without spaces), sentence, and paragraph counts with speaking and reading time metrics.</p>
        </div>
        <button class="tool-action-btn">Analyze Text &rarr;</button>
      </article>

      <!-- Tool 33: Password Entropy Generator -->
      <article class="tool-card" data-category="productivity" data-id="password-strength-generator" data-keywords="password generator entropy strength secure keys" onclick="alert('Launching Password Entropy Generator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #10b981, #047857);">🔑</div>
            <span class="tool-badge">Security</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Password Entropy Generator</h3>
          <p class="tool-tagline">Cryptographically random passwords & crack-time math</p>
          <p class="tool-description">Generate uncrackable passwords using Web Crypto RNG with custom length, symbols, numbers, and entropy bits scoring.</p>
        </div>
        <button class="tool-action-btn">Generate Password &rarr;</button>
      </article>

      <!-- Tool 34: Aspect Ratio & Resolution Matrix -->
      <article class="tool-card" data-category="productivity" data-id="aspect-ratio-calc" data-keywords="aspect ratio calculator resolution 16:9 4:3 21:9 4k" onclick="alert('Launching Aspect Ratio Calculator...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #ec4899, #f43f5e);">🖥️</div>
            <span class="tool-badge">Video</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Aspect Ratio & Resolution Matrix</h3>
          <p class="tool-tagline">16:9, 4:3, 21:9 & custom pixel scaling</p>
          <p class="tool-description">Calculate missing width or height dimensions while maintaining exact aspect ratios for video, photography, and UI design.</p>
        </div>
        <button class="tool-action-btn">Calculate Ratio &rarr;</button>
      </article>

      <!-- Tool 35: Macro & Hydration Planner -->
      <article class="tool-card" data-category="productivity" data-id="daily-water-macro-calc" data-keywords="macro hydration water intake calories bmr tdee health" onclick="alert('Launching Macro & Hydration Planner...')">
        <div>
          <div class="tool-card-top">
            <div class="tool-icon-box" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">💧</div>
            <span class="tool-badge">Health</span>
          </div>
          <span class="tool-category-tag">Everyday Productivity</span>
          <h3 class="tool-title">Macro & Hydration Planner</h3>
          <p class="tool-tagline">Daily water target & TDEE macro split</p>
          <p class="tool-description">Calculate your optimal daily water intake, BMR, TDEE, and macronutrient breakdown (protein, carbs, fats) for health goals.</p>
        </div>
        <button class="tool-action-btn">Calculate Macros &rarr;</button>
      </article>

    </div>
  </main>

  <!-- 9. Interactive Compound Interest / SIP Multiplier Modal -->
  <div id="calcModalOverlay" class="modal-overlay" onclick="closeModal()">
    <div class="modal-container" onclick="event.stopPropagation()">
      <div class="modal-header">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <button class="btn-back-tools" onclick="closeModal()">
            <span>&larr;</span>
            <span>Back to 35 Tools</span>
          </button>
          <h2 style="font-size:1.3rem; font-weight:900;">Compound Interest & SIP Multiplier</h2>
        </div>
        <button class="modal-close-btn" onclick="closeModal()" aria-label="Close Modal">✕</button>
      </div>

      <!-- Live Calculation Cards -->
      <div class="calc-results-grid">
        <div class="calc-card invested">
          <div class="calc-card-label">Principal / Invested</div>
          <div class="calc-card-val" id="resInvested">₹1,20,000</div>
          <div class="calc-card-sub">Initial + Additions</div>
        </div>

        <div class="calc-card interest">
          <div class="calc-card-label">Total Interest Growth</div>
          <div class="calc-card-val" id="resInterest">₹1,12,486</div>
          <div class="calc-card-sub" id="resMulti">1.94x Return</div>
        </div>

        <div class="calc-card total">
          <div class="calc-card-label">Future Maturity Value</div>
          <div class="calc-card-val" id="resTotal" style="color:#ec4899;">₹2,32,486</div>
          <div class="calc-card-sub">Net Accumulated Wealth</div>
        </div>
      </div>

      <!-- Live Interactive Sliders & Controls -->
      <div class="calc-controls-grid">
        <!-- Initial Principal -->
        <div class="ctrl-group">
          <div class="ctrl-header">
            <span>Initial Principal Deposit</span>
            <span class="ctrl-input-badge">₹ <input type="number" id="numPrincipal" value="50000" min="1000" max="10000000" step="5000"></span>
          </div>
          <input type="range" id="rangePrincipal" class="ctrl-slider" min="1000" max="1000000" step="5000" value="50000">
          <div class="ctrl-range-labels">
            <span>₹1,000</span>
            <span>₹10,00,000</span>
          </div>
        </div>

        <!-- Monthly SIP Contribution -->
        <div class="ctrl-group">
          <div class="ctrl-header">
            <span>Monthly Contribution (SIP)</span>
            <span class="ctrl-input-badge">₹ <input type="number" id="numMonthly" value="5000" min="0" max="500000" step="500"></span>
          </div>
          <input type="range" id="rangeMonthly" class="ctrl-slider" min="0" max="100000" step="500" value="5000">
          <div class="ctrl-range-labels">
            <span>₹0</span>
            <span>₹1,00,000</span>
          </div>
        </div>

        <!-- Annual Expected Return Rate -->
        <div class="ctrl-group">
          <div class="ctrl-header">
            <span>Expected Annual Return Rate</span>
            <span class="ctrl-input-badge"><input type="number" id="numRate" value="12" min="1" max="40" step="0.5"> %</span>
          </div>
          <input type="range" id="rangeRate" class="ctrl-slider" min="1" max="30" step="0.5" value="12">
          <div class="ctrl-range-labels">
            <span>1% (Conservative)</span>
            <span>30% (Aggressive)</span>
          </div>
        </div>

        <!-- Time Horizon (Years) -->
        <div class="ctrl-group">
          <div class="ctrl-header">
            <span>Investment Horizon</span>
            <span class="ctrl-input-badge"><input type="number" id="numYears" value="10" min="1" max="40"> Years</span>
          </div>
          <input type="range" id="rangeYears" class="ctrl-slider" min="1" max="40" step="1" value="10">
          <div class="ctrl-range-labels">
            <span>1 Year</span>
            <span>40 Years</span>
          </div>
        </div>
      </div>

      <!-- Compounding Frequency Select -->
      <div style="margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap;">
        <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">Compounding Frequency:</span>
        <select id="compoundFreq" class="select-dropdown" style="max-width:240px;">
          <option value="12" selected>Monthly (Standard SIP)</option>
          <option value="4">Quarterly (Bank FD Style)</option>
          <option value="1">Annually (Standard CAGR)</option>
          <option value="365">Daily (Crypto/DeFi Yield)</option>
        </select>
      </div>

      <!-- Chart.js Graph Container -->
      <div class="chart-container-box">
        <div class="chart-header">
          <span>Exponential Wealth Compounding Trajectory</span>
          <span style="font-size:0.75rem; color:var(--text-muted);" id="chartYearLabel">Over 10 Years</span>
        </div>
        <div class="chart-wrapper">
          <canvas id="growthChartCanvas"></canvas>
        </div>
      </div>

      <!-- 💡 Suggested Tools You Might Need Panel -->
      <div class="suggested-tools-section">
        <div class="suggested-header">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.3rem;">💡</span>
            <div>
              <div style="font-weight:800; font-size:0.95rem; color:var(--text-main);">Suggested Tools You Might Need</div>
              <div style="font-size:0.72rem; color:var(--text-muted);">Related high-precision engines from our financial & developer suite</div>
            </div>
          </div>
          <span style="font-size:0.7rem; font-weight:700; color:#8b5cf6; background:rgba(139,92,246,0.12); padding:0.25rem 0.65rem; border-radius:9999px;">1-Click Switch</span>
        </div>

        <div class="suggested-grid" id="suggestedToolsRow">
          <!-- Suggested tool 1 -->
          <div class="suggested-mini-card" onclick="launchSuggested('loan-emi-breakout', 'financial')">
            <div class="mini-card-top">
              <span class="mini-icon" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);">🧮</span>
              <span class="mini-badge">Popular</span>
            </div>
            <div class="mini-title">Loan EMI Breakout</div>
            <div class="mini-desc">Principal vs Interest split schedule</div>
            <div class="mini-launch">Launch &rarr;</div>
          </div>

          <!-- Suggested tool 2 -->
          <div class="suggested-mini-card" onclick="launchSuggested('fire-retirement-age', 'financial')">
            <div class="mini-card-top">
              <span class="mini-icon" style="background:linear-gradient(135deg,#f43f5e,#fb923c);">🔥</span>
              <span class="mini-badge">Wealth</span>
            </div>
            <div class="mini-title">F.I.R.E. Retirement</div>
            <div class="mini-desc">Financial independence milestone</div>
            <div class="mini-launch">Launch &rarr;</div>
          </div>

          <!-- Suggested tool 3 -->
          <div class="suggested-mini-card" onclick="launchSuggested('gst-vat-calculator', 'financial')">
            <div class="mini-card-top">
              <span class="mini-icon" style="background:linear-gradient(135deg,#0ea5e9,#6366f1);">🧾</span>
              <span class="mini-badge">Tax</span>
            </div>
            <div class="mini-title">GST & VAT Splitter</div>
            <div class="mini-desc">Instant forward & reverse slabs</div>
            <div class="mini-launch">Launch &rarr;</div>
          </div>

          <!-- Suggested tool 4 -->
          <div class="suggested-mini-card" onclick="launchSuggested('stock-cagr-matrix', 'financial')">
            <div class="mini-card-top">
              <span class="mini-icon" style="background:linear-gradient(135deg,#059669,#10b981);">📊</span>
              <span class="mini-badge">Returns</span>
            </div>
            <div class="mini-title">CAGR Growth Matrix</div>
            <div class="mini-desc">True annualized compound rate</div>
            <div class="mini-launch">Launch &rarr;</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 10. Site Footer -->
  <footer class="site-footer">
    <div class="footer-container">
      <div>
        <div style="font-weight:900; font-size:1.15rem; margin-bottom:0.25rem;">QuickFree Tools ✨</div>
        <p style="font-size:0.8rem; color:var(--text-muted);">
          35 Production micro-engines operating 100% locally in your web browser.<br>
          No server telemetry, no user tracking, and zero hidden subscriptions.
        </p>
      </div>

      <ul class="footer-links">
        <li><a href="#home">Home</a></li>
        <li><a href="#tools">Engines</a></li>
        <li><a href="javascript:void(0)" onclick="openCompoundInterestTool()">Live Calculator</a></li>
        <li><a href="javascript:void(0)" onclick="window.scrollTo({top:0, behavior:'smooth'})">Back to Top ↑</a></li>
      </ul>
    </div>
  </footer>

  <!-- =========================================================
       11. JAVASCRIPT STATE ENGINE (3-WAY THEME, DRAWER, CALCULATOR)
       ========================================================= -->
  <script>
    // -------------------------------------------------------------
    // A. 3-STATE MECHANICAL CYCLE THEME LOGIC
    // -------------------------------------------------------------
    // State 0 = Light Mode (☀️), State 1 = Dark Mode (🌙), State 2 = Reading Mode (📖)
    const THEME_STATES = [
      { id: 'light', name: 'Light Mode', icon: '☀️', dataAttr: '' },
      { id: 'dark', name: 'Dark Mode', icon: '🌙', dataAttr: 'dark' },
      { id: 'reading', name: 'Reading Mode', icon: '📖', dataAttr: 'reading' }
    ];

    let currentThemeIndex = 0;

    // Load persisted theme
    const savedTheme = localStorage.getItem('quickfree_theme');
    if (savedTheme === 'dark') {
      currentThemeIndex = 1;
    } else if (savedTheme === 'reading') {
      currentThemeIndex = 2;
    } else if (savedTheme === 'light') {
      currentThemeIndex = 0;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      currentThemeIndex = 1;
    }

    function applyTheme(index) {
      currentThemeIndex = index % THEME_STATES.length;
      const active = THEME_STATES[currentThemeIndex];

      if (active.dataAttr) {
        document.documentElement.setAttribute('data-theme', active.dataAttr);
        document.documentElement.className = active.dataAttr;
        document.body.className = active.dataAttr;
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.className = '';
        document.body.className = '';
      }

      document.getElementById('themeIcon').textContent = active.icon;
      document.getElementById('themeLabel').textContent = active.name;
      document.getElementById('themeToggleBtn').title = 'Active: ' + active.name + '. Click to cycle theme.';
      localStorage.setItem('quickfree_theme', active.id);

      // Re-render chart colors if active
      if (growthChart) {
        updateChartTheme();
      }
    }

    // Initialize theme on load
    applyTheme(currentThemeIndex);

    // Button event listener for 3-state mechanical cycle
    document.getElementById('themeToggleBtn').addEventListener('click', () => {
      applyTheme(currentThemeIndex + 1);
    });

    // -------------------------------------------------------------
    // B. SLIDE-OUT NAVIGATION DRAWER LOGIC
    // -------------------------------------------------------------
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerOpenBtn = document.getElementById('drawerOpenBtn');
    const drawerSearchInput = document.getElementById('drawerSearchInput');

    function openDrawer() {
      drawerOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => drawerSearchInput.focus(), 150);
    }

    function closeDrawer() {
      drawerOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    drawerOpenBtn.addEventListener('click', openDrawer);

    // Escape key listener for modal and drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
        closeModal();
      }
    });

    // Drawer Search Filter
    drawerSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.drawer-tool-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });

    function launchToolFromDrawer(toolId, category) {
      closeDrawer();
      selectCategory(category);
      if (toolId === 'compound-interest-planner' || toolId === 'sip-visualizer') {
        openCompoundInterestTool();
      } else {
        const card = document.querySelector(\`[data-id="\${toolId}"]\`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.borderColor = '#8b5cf6';
          card.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.4)';
          setTimeout(() => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
          }, 1500);
        }
      }
    }

    // -------------------------------------------------------------
    // C. TOP CATEGORY PILL TABS BAR FILTERING (3 BUTTONS)
    // -------------------------------------------------------------
    let currentCategory = 'financial';

    const catCounts = {
      financial: 12,
      tech_utilities: 12,
      productivity: 11
    };

    function selectCategory(category) {
      currentCategory = category;

      // Update Pill Buttons
      document.querySelectorAll('.cat-pill-btn').forEach(btn => {
        btn.classList.remove('active', 'financial', 'tech_utilities', 'productivity');
      });

      const activeBtn = document.getElementById('tab-' + category);
      if (activeBtn) {
        activeBtn.classList.add('active', category);
      }

      document.getElementById('activeCountLabel').textContent = catCounts[category] || '12';

      // Clear search and filter cards
      document.getElementById('toolSearchInput').value = '';
      filterCards();
    }

    function showAllCategories() {
      currentCategory = 'all';
      document.querySelectorAll('.cat-pill-btn').forEach(btn => {
        btn.classList.remove('active', 'financial', 'tech_utilities', 'productivity');
      });
      document.getElementById('activeCountLabel').textContent = '35';
      filterCards();
    }

    // -------------------------------------------------------------
    // D. LIVE SEARCH ENGINE & FILTER DISPATCHER
    // -------------------------------------------------------------
    const toolSearchInput = document.getElementById('toolSearchInput');

    toolSearchInput.addEventListener('input', () => {
      filterCards();
    });

    function filterByQuery(query) {
      toolSearchInput.value = query;
      filterCards();
      document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
    }

    function filterCards() {
      const q = toolSearchInput.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.tool-card');
      let visibleCount = 0;

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const keywords = (card.getAttribute('data-keywords') || '') + ' ' + card.textContent.toLowerCase();

        const matchesCat = (currentCategory === 'all') || (cat === currentCategory);
        const matchesQuery = !q || keywords.includes(q);

        if (matchesCat && matchesQuery) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      document.getElementById('activeCountLabel').textContent = visibleCount;
    }

    // Default initialization to financial engines
    selectCategory('financial');

    // -------------------------------------------------------------
    // E. INTERACTIVE COMPOUND INTEREST & SIP CALCULATOR
    // -------------------------------------------------------------
    const modalOverlay = document.getElementById('calcModalOverlay');
    let growthChart = null;

    function openCompoundInterestTool(slug = 'compound-interest-planner') {
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Sync URL hash for SEO deep linking
      if (window.location.hash !== '#' + slug) {
        history.replaceState(null, '', '#' + slug);
      }
      initOrRecalcChart();
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
      // Safely clear URL hash when returning to home view
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }

    function launchSuggested(toolId, category) {
      if (toolId === 'compound-interest-planner' || toolId === 'sip-visualizer') {
        openCompoundInterestTool(toolId);
      } else {
        closeModal();
        selectCategory(category);
        const card = document.querySelector(\`[data-id="\${toolId}"]\`);
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.borderColor = '#8b5cf6';
          card.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.4)';
          setTimeout(() => {
            card.style.borderColor = '';
            card.style.boxShadow = '';
          }, 1500);
        }
      }
      const modalCont = document.querySelector('.modal-container');
      if (modalCont) modalCont.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Deep-linking URL Hash Listener: Direct access from Google Search (Passive Highlighting & Isolation)
    function handleInitialHash() {
      const hash = window.location.hash.replace(/^#/, '').toLowerCase();
      if (!hash) return;

      const cleanSlug = hash.replace(/^tool-/, '');
      const card = document.querySelector(\`[data-id="\${cleanSlug}"]\`) || 
                   document.querySelector(\`[data-id="\${hash}"]\`) ||
                   document.getElementById(cleanSlug) ||
                   document.getElementById(hash);
      if (card) {
        const cat = card.getAttribute('data-category');
        if (cat) selectCategory(cat);
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        history.replaceState("", document.title, window.location.pathname + window.location.search);
        card.style.borderColor = '#06b6d4';
        card.style.boxShadow = '0 0 35px rgba(6, 182, 212, 0.7)';
      }
    }

    // Global keyboard shortcut: Ctrl+K / Cmd+K to open search bar
    window.addEventListener('keydown', (e) => {
      const isCmdOrCtrlK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if (isCmdOrCtrlK) {
        e.preventDefault();
        closeModal();
        closeDrawer();
        const searchInput = document.getElementById('toolSearchInput');
        if (searchInput) {
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          searchInput.focus();
          searchInput.select();
        }
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.location.hash) {
        history.replaceState("", document.title, window.location.pathname + window.location.search);
      }
      handleInitialHash();
    });
    window.addEventListener('load', () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    window.addEventListener('hashchange', handleInitialHash);

    // Control Elements
    const numPrincipal = document.getElementById('numPrincipal');
    const rangePrincipal = document.getElementById('rangePrincipal');
    const numMonthly = document.getElementById('numMonthly');
    const rangeMonthly = document.getElementById('rangeMonthly');
    const numRate = document.getElementById('numRate');
    const rangeRate = document.getElementById('rangeRate');
    const numYears = document.getElementById('numYears');
    const rangeYears = document.getElementById('rangeYears');
    const compoundFreq = document.getElementById('compoundFreq');

    function syncAndCalc(input1, input2) {
      input1.addEventListener('input', () => {
        input2.value = input1.value;
        initOrRecalcChart();
      });
      input2.addEventListener('input', () => {
        input1.value = input2.value;
        initOrRecalcChart();
      });
    }

    syncAndCalc(numPrincipal, rangePrincipal);
    syncAndCalc(numMonthly, rangeMonthly);
    syncAndCalc(numRate, rangeRate);
    syncAndCalc(numYears, rangeYears);
    compoundFreq.addEventListener('change', initOrRecalcChart);

    function formatINR(val) {
      return '₹' + Math.round(val).toLocaleString('en-IN');
    }

    function initOrRecalcChart() {
      const P = parseFloat(numPrincipal.value) || 0;
      const PMT = parseFloat(numMonthly.value) || 0;
      const annualRate = (parseFloat(numRate.value) || 0) / 100;
      const years = parseInt(numYears.value) || 10;
      const n = parseInt(compoundFreq.value) || 12;

      document.getElementById('chartYearLabel').textContent = 'Over ' + years + ' Years (' + (annualRate * 100).toFixed(1) + '% Return)';

      const labels = [];
      const investedData = [];
      const totalData = [];

      let runningTotal = P;
      let totalInvested = P;

      labels.push('Year 0');
      investedData.push(P);
      totalData.push(P);

      for (let yr = 1; yr <= years; yr++) {
        for (let m = 1; m <= 12; m++) {
          runningTotal = runningTotal * (1 + annualRate / n) + PMT;
          totalInvested += PMT;
        }
        labels.push('Year ' + yr);
        investedData.push(Math.round(totalInvested));
        totalData.push(Math.round(runningTotal));
      }

      const totalInterest = Math.max(0, runningTotal - totalInvested);
      const multi = totalInvested > 0 ? (runningTotal / totalInvested).toFixed(2) : '1.00';

      document.getElementById('resInvested').textContent = formatINR(totalInvested);
      document.getElementById('resInterest').textContent = formatINR(totalInterest);
      document.getElementById('resTotal').textContent = formatINR(runningTotal);
      document.getElementById('resMulti').textContent = multi + 'x Return Multiplier';

      renderChartJs(labels, investedData, totalData);
    }

    function getChartThemeColors() {
      const theme = document.documentElement.getAttribute('data-theme');
      if (theme === 'dark') {
        return {
          textColor: '#94a3b8',
          gridColor: 'rgba(255, 255, 255, 0.08)'
        };
      } else if (theme === 'reading') {
        return {
          textColor: '#846d5b',
          gridColor: 'rgba(180, 140, 100, 0.15)'
        };
      } else {
        return {
          textColor: '#64748b',
          gridColor: 'rgba(0, 0, 0, 0.06)'
        };
      }
    }

    function updateChartTheme() {
      if (!growthChart) return;
      const colors = getChartThemeColors();
      growthChart.options.scales.x.ticks.color = colors.textColor;
      growthChart.options.scales.x.grid.color = colors.gridColor;
      growthChart.options.scales.y.ticks.color = colors.textColor;
      growthChart.options.scales.y.grid.color = colors.gridColor;
      growthChart.options.plugins.legend.labels.color = colors.textColor;
      growthChart.update();
    }

    function renderChartJs(labels, investedData, totalData) {
      const ctx = document.getElementById('growthChartCanvas');
      if (!ctx) return;

      const colors = getChartThemeColors();

      if (growthChart) {
        growthChart.data.labels = labels;
        growthChart.data.datasets[0].data = investedData;
        growthChart.data.datasets[1].data = totalData;
        updateChartTheme();
        return;
      }

      growthChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Invested Principal',
              data: investedData,
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              borderWidth: 2.5,
              fill: true,
              tension: 0.35,
              pointRadius: 2
            },
            {
              label: 'Total Accumulated Wealth',
              data: totalData,
              borderColor: '#d946ef',
              backgroundColor: 'rgba(217, 70, 239, 0.15)',
              borderWidth: 3,
              fill: true,
              tension: 0.35,
              pointRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false
          },
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: colors.textColor,
                font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 },
                usePointStyle: true,
                pointStyle: 'circle'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + formatINR(context.parsed.y);
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: colors.gridColor },
              ticks: { color: colors.textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
            },
            y: {
              grid: { color: colors.gridColor },
              ticks: {
                color: colors.textColor,
                font: { family: 'Plus Jakarta Sans', size: 10 },
                callback: function(val) {
                  if (val >= 10000000) return '₹' + (val / 10000000).toFixed(1) + ' Cr';
                  if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + ' L';
                  if (val >= 1000) return '₹' + (val / 1000).toFixed(0) + ' k';
                  return '₹' + val;
                }
              }
            }
          }
        }
      });
    }
  </script>
</body>
</html>`;
}
