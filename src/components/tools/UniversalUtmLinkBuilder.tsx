import React, { useState, useMemo } from 'react';
import { 
  Link2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  Globe, 
  Layers, 
  Zap, 
  Sliders, 
  QrCode, 
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Hash
} from 'lucide-react';
import { playSound } from '../../utils/audioFeedback';

interface UtmLinkBuilderProps {
  onBackToGrid?: () => void;
}

interface UtmPreset {
  name: string;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
}

const UTM_PRESETS: UtmPreset[] = [
  {
    name: 'Google Ads (Search CPC)',
    source: 'google',
    medium: 'cpc',
    campaign: 'summer_promo_2026',
    term: 'best+saas+tools',
    content: 'ad_variant_headline_a'
  },
  {
    name: 'Meta / Facebook Carousel',
    source: 'facebook',
    medium: 'paid_social',
    campaign: 'retargeting_q3',
    content: 'carousel_slide_2'
  },
  {
    name: 'Weekly Email Newsletter',
    source: 'newsletter',
    medium: 'email',
    campaign: 'weekly_digest_issue_42',
    content: 'featured_article_btn'
  },
  {
    name: 'LinkedIn Sponsored Post',
    source: 'linkedin',
    medium: 'sponsored_content',
    campaign: 'enterprise_leadgen_2026',
    content: 'whitepaper_download'
  },
  {
    name: 'Twitter / X Organic Tweet',
    source: 'twitter',
    medium: 'social_organic',
    campaign: 'product_announcement'
  },
  {
    name: 'YouTube Description',
    source: 'youtube',
    medium: 'video_desc',
    campaign: 'tutorial_series',
    content: 'timestamp_link'
  }
];

export const UniversalUtmLinkBuilder: React.FC<UtmLinkBuilderProps> = ({ onBackToGrid }) => {
  const [baseUrl, setBaseUrl] = useState<string>('https://example.com/pricing');
  const [source, setSource] = useState<string>('google');
  const [medium, setMedium] = useState<string>('cpc');
  const [campaign, setCampaign] = useState<string>('spring_launch_2026');
  const [term, setTerm] = useState<string>('developer+productivity');
  const [content, setContent] = useState<string>('cta_top_hero');

  // Formatting options
  const [autoLowercase, setAutoLowercase] = useState<boolean>(true);
  const [spaceDelimiter, setSpaceDelimiter] = useState<'_' | '-' | '+'>('_');
  const [showQrCode, setShowQrCode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Clean and sanitize parameter strings
  const sanitizeParam = (val: string): string => {
    let res = val.trim();
    if (autoLowercase) res = res.toLowerCase();
    res = res.replace(/\s+/g, spaceDelimiter);
    return res;
  };

  // Build the complete URL respecting existing query params and hashes
  const { generatedUrl, isValidUrl, errorNotice } = useMemo(() => {
    const rawUrl = baseUrl.trim();
    if (!rawUrl) {
      return { generatedUrl: '', isValidUrl: false, errorNotice: 'Base URL is required' };
    }

    try {
      // Ensure protocol exists
      let normalizedUrl = rawUrl;
      if (!/^https?:\/\//i.test(normalizedUrl)) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      const parsedUrl = new URL(normalizedUrl);

      // Cleaned params
      const s = sanitizeParam(source);
      const m = sanitizeParam(medium);
      const c = sanitizeParam(campaign);
      const t = sanitizeParam(term);
      const cnt = sanitizeParam(content);

      if (s) parsedUrl.searchParams.set('utm_source', s);
      if (m) parsedUrl.searchParams.set('utm_medium', m);
      if (c) parsedUrl.searchParams.set('utm_campaign', c);
      if (t) parsedUrl.searchParams.set('utm_term', t);
      if (cnt) parsedUrl.searchParams.set('utm_content', cnt);

      return {
        generatedUrl: parsedUrl.toString(),
        isValidUrl: true,
        errorNotice: null
      };
    } catch {
      // Fallback manual string joiner if URL parsing fails
      let separator = rawUrl.includes('?') ? '&' : '?';
      const parts: string[] = [];
      if (source) parts.push(`utm_source=${encodeURIComponent(sanitizeParam(source))}`);
      if (medium) parts.push(`utm_medium=${encodeURIComponent(sanitizeParam(medium))}`);
      if (campaign) parts.push(`utm_campaign=${encodeURIComponent(sanitizeParam(campaign))}`);
      if (term) parts.push(`utm_term=${encodeURIComponent(sanitizeParam(term))}`);
      if (content) parts.push(`utm_content=${encodeURIComponent(sanitizeParam(content))}`);

      const joined = rawUrl + (parts.length > 0 ? separator + parts.join('&') : '');
      return {
        generatedUrl: joined,
        isValidUrl: false,
        errorNotice: 'Check your Base URL format (e.g., https://example.com)'
      };
    }
  }, [baseUrl, source, medium, campaign, term, content, autoLowercase, spaceDelimiter]);

  const handleCopy = () => {
    if (!generatedUrl) return;
    playSound('calcChime');
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const applyPreset = (preset: UtmPreset) => {
    playSound('click');
    setSource(preset.source);
    setMedium(preset.medium);
    setCampaign(preset.campaign);
    setTerm(preset.term || '');
    setContent(preset.content || '');
  };

  // Generate Google Chart QR Code URL for zero-overhead in-browser display
  const qrCodeUrl = useMemo(() => {
    if (!generatedUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(generatedUrl)}`;
  }, [generatedUrl]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto" id="utm-builder-root">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
            <Link2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                UTM Link Builder & Attribute Formatter
              </h3>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                Google Analytics 4 Compliant
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Construct trackable campaign URLs with clean syntax joining, parameter sanitation, and instant clipboard copying.
            </p>
          </div>
        </div>

        {onBackToGrid && (
          <button
            onClick={onBackToGrid}
            className="self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-white/80 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 transition-all border border-slate-300 dark:border-white/10"
          >
            ← Back to Tools
          </button>
        )}
      </div>

      {/* Main Grid: Inputs (7 cols) & Live Output (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Base URL Field */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
            <label htmlFor="utm-base-url" className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>Base Website URL *</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Include https://</span>
            </label>
            <input
              id="utm-base-url"
              type="text"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://example.com/landing-page"
              className="w-full font-mono text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 font-semibold"
            />
          </div>

          {/* UTM Parameters Block */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
                Campaign Tracking Parameters
              </h4>
              <span className="text-[10px] text-slate-400">GA4 Standard</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Campaign Source */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Source (utm_source) *</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Platform</span>
                </label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g., google, newsletter, linkedin"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Campaign Medium */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Medium (utm_medium) *</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Channel</span>
                </label>
                <input
                  type="text"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="e.g., cpc, email, social, banner"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Campaign Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Campaign (utm_campaign) *</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">Goal</span>
                </label>
                <input
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g., spring_sale_2026"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Campaign Term */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Term (utm_term)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Keywords</span>
                </label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="e.g., paid+keyword, saas"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              {/* Campaign Content */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Content (utm_content)</span>
                  <span className="text-[10px] text-slate-400 font-mono">A/B Testing / Creative</span>
                </label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g., hero_banner_cta, blue_button"
                  className="w-full font-mono text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Smart Formatting Options */}
            <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoLowercase}
                  onChange={(e) => setAutoLowercase(e.target.checked)}
                  className="accent-emerald-500 rounded cursor-pointer"
                />
                <span className="text-slate-700 dark:text-slate-300 font-medium">
                  Auto-lowercase (recommended for clean analytics)
                </span>
              </label>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px]">Space separator:</span>
                {(['_', '-', '+'] as const).map(sep => (
                  <button
                    key={sep}
                    onClick={() => { playSound('click'); setSpaceDelimiter(sep); }}
                    className={`w-6 h-6 rounded-md font-mono text-xs font-bold border transition-all cursor-pointer ${
                      spaceDelimiter === sep
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10'
                    }`}
                  >
                    {sep}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Marketing Channel Presets
            </span>
            <div className="flex flex-wrap gap-1.5">
              {UTM_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white/70 border border-slate-200 dark:border-white/5 transition-all cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Generated Output Block (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Hero Tracking Link Box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>Generated Tracking URL</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                {generatedUrl.length} chars
              </span>
            </div>

            {/* Generated URL Display with Syntax Break */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 font-mono text-xs sm:text-sm text-slate-900 dark:text-white break-all leading-relaxed max-h-48 overflow-y-auto">
              {generatedUrl ? (
                <>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{baseUrl}</span>
                  {generatedUrl.includes('?') && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      {generatedUrl.slice(baseUrl.length)}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-slate-400 italic">Enter a Base URL to generate link</span>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCopy}
                disabled={!generatedUrl}
                className="w-full py-3 rounded-2xl text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                id="copy-utm-link-btn"
              >
                {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied Campaign URL!' : 'Copy Tracking Link to Clipboard'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={generatedUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-white/80 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Test Link</span>
                </a>

                <button
                  onClick={() => { playSound('click'); setShowQrCode(!showQrCode); }}
                  className="py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-white/80 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <QrCode className="w-3.5 h-3.5 text-teal-500" />
                  <span>{showQrCode ? 'Hide QR' : 'QR Code'}</span>
                </button>
              </div>
            </div>

            {/* Optional QR Code Card */}
            {showQrCode && generatedUrl && (
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-center space-y-2 animate-fadeIn">
                <img
                  src={qrCodeUrl}
                  alt="Campaign QR Code"
                  className="w-44 h-44 mx-auto rounded-xl border border-slate-200 dark:border-white/10 p-2 bg-white"
                  referrerPolicy="no-referrer"
                />
                <span className="text-[11px] text-slate-400 block font-mono">
                  Scan to preview campaign destination
                </span>
              </div>
            )}
          </div>

          {/* Parameter Inspector Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>GA4 Attribute Mapping</span>
            </h4>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/50">utm_source:</span>
                <strong className="text-emerald-600 dark:text-emerald-400">{sanitizeParam(source) || '—'}</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/50">utm_medium:</span>
                <strong className="text-teal-600 dark:text-teal-400">{sanitizeParam(medium) || '—'}</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <span className="text-slate-500 dark:text-white/50">utm_campaign:</span>
                <strong className="text-cyan-600 dark:text-cyan-400">{sanitizeParam(campaign) || '—'}</strong>
              </div>
              {term && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-500 dark:text-white/50">utm_term:</span>
                  <strong className="text-slate-800 dark:text-white">{sanitizeParam(term)}</strong>
                </div>
              )}
              {content && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  <span className="text-slate-500 dark:text-white/50">utm_content:</span>
                  <strong className="text-slate-800 dark:text-white">{sanitizeParam(content)}</strong>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
