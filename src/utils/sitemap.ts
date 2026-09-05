import { TOOLS_DATA } from '../data/toolsData';
import { MASTER_NODES } from '../data/masterNodes';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  title: string;
  category?: string;
}

// Curated high-priority Programmatic SEO Research Queries
export const CURATED_RESEARCH_QUERIES = [
  { slug: 'what-is-sip-compounding', title: 'What is SIP & How Does Compounding Work?', priority: '0.7' },
  { slug: 'rule-of-72-doubling-formula', title: 'Rule of 72: Investment Doubling Time Calculation', priority: '0.7' },
  { slug: 'fire-number-4-percent-rule', title: 'FIRE 4% Safe Withdrawal Rate & Target Corpus', priority: '0.7' },
  { slug: 'cagr-vs-absolute-returns', title: 'CAGR vs Absolute Returns in Portfolio Growth', priority: '0.7' },
  { slug: 'emi-amortization-calculation', title: 'Equated Monthly Installment (EMI) Formula & Breakdown', priority: '0.7' },
  { slug: 'json-vs-yaml-syntax', title: 'JSON vs YAML: Structural Serialization Differences', priority: '0.7' },
  { slug: 'sha-256-vs-md5-cryptography', title: 'SHA-256 vs MD5: Cryptographic Collision Resistance', priority: '0.7' },
  { slug: 'uuid-v4-collision-probability', title: 'UUID v4: RFC 4122 Random Uniqueness & Entropy', priority: '0.7' },
  { slug: 'jwt-token-structure', title: 'JSON Web Token (JWT) Header, Payload & Signature Anatomy', priority: '0.7' },
  { slug: 'wcag-2-1-contrast-ratio-rules', title: 'WCAG 2.1 Color Contrast Ratios (AA & AAA Standards)', priority: '0.7' }
];

export function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateSitemapEntries(customBaseUrl?: string): SitemapUrlEntry[] {
  const origin = typeof window !== 'undefined' && window.location.origin && window.location.origin !== 'null'
    ? window.location.origin
    : 'https://quickfree-tools.vercel.app';
  const baseUrl = (customBaseUrl || origin).replace(/\/+$/, '');
  const today = '2026-09-05';

  const entries: SitemapUrlEntry[] = [];

  // 1. Root Canonical Homepage (Priority 1.0)
  entries.push({
    loc: `${baseUrl}/`,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0',
    title: 'QuickFree Tools - 100 Free Client-Side Tools across 8 Master Nodes',
    category: 'Root Hub'
  });

  // 2. The 8 Master Nodes / Category Hubs (Priority 0.9)
  MASTER_NODES.forEach(node => {
    entries.push({
      loc: `${baseUrl}/?category=${node.id}`,
      lastmod: today,
      changefreq: 'daily',
      priority: '0.9',
      title: `${node.name} (${node.badge}) - ${node.description}`,
      category: node.tabLabel
    });
  });

  // 3. All 100 Tools in TOOLS_DATA (Priority 0.8)
  TOOLS_DATA.forEach(tool => {
    const isFeatured = tool.badge === 'Popular' || tool.badge === 'New' || tool.hasInteractiveDemo;
    entries.push({
      loc: `${baseUrl}/?tool=${tool.id}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: isFeatured ? '0.8' : '0.7',
      title: `${tool.name}: ${tool.tagline}`,
      category: tool.categoryName || tool.category
    });
  });

  // 4. Programmatic SEO Research Queries (Priority 0.7)
  CURATED_RESEARCH_QUERIES.forEach(q => {
    entries.push({
      loc: `${baseUrl}/?q=${q.slug}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: q.priority,
      title: q.title,
      category: 'Research Data Engine'
    });
  });

  return entries;
}

export function generateXmlSitemap(customBaseUrl?: string): string {
  const entries = generateSitemapEntries(customBaseUrl);

  const xmlUrls = entries
    .map(entry => {
      const escapedLoc = escapeXml(entry.loc);
      return `  <url>\n` +
        `    <loc>${escapedLoc}</loc>\n` +
        `    <lastmod>${entry.lastmod}</lastmod>\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
    `        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n` +
    `        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n` +
    `        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n` +
    `  <!-- QuickFree Tools Official Sitemaps Protocol 0.9 Index (${entries.length} Crawlable Endpoints) -->\n` +
    `${xmlUrls}\n` +
    `</urlset>`;
}
