export type ToolCategory = 
  | 'all'
  | 'financial'
  | 'tech_utilities'
  | 'ai_media'
  | 'productivity_math'
  | 'productivity';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  tagline: string;
  description: string;
  icon: string; // Lucide icon identifier
  badge?: 'Interactive Demo' | 'Popular' | 'New' | 'AI Powered' | 'Instant' | 'High Utility';
  gradient: string;
  accentColor: string;
  hasInteractiveDemo?: boolean;
  demoType?: 'sip' | 'emi' | 'compound' | 'gst' | 'fire' | 'cagr' | 'salary' | 'inflation' | 'caprate' | 'fdrd' | 'drip' | 'regex' | 'base64' | 'glassmorphism' | 'timestamp' | 'url' | 'markdown' | 'diff' | 'svg' | 'webp' | 'aspect' | 'exif' | 'social' | 'unit' | 'word' | 'percentage' | 'age' | 'split' | 'pomodoro' | 'pdf' | 'qr' | 'password' | 'color' | 'crypto' | 'json' | 'default';
  stats?: string;
  tags: string[];
}

export interface AdZoneConfig {
  showSkyscrapers: boolean;
  showMiddleBanner: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'reading';

export type GlobalCurrency = 'USD' | 'EUR' | 'GBP' | 'INR';
