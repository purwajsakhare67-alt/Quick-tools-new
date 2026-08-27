import { TOOLS_DATA } from '../data/toolsData';
import { ToolItem } from '../types';

export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  name?: string;
  category?: string;
}

export interface SitemapGeneratorOptions {
  baseUrl?: string;
  tools?: ToolItem[];
  includeCategories?: boolean;
  defaultLastMod?: string;
  singlePageOnly?: boolean;
}

/**
 * Escapes special XML characters to prevent XML parsing syntax errors
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Formats a Date object or string into ISO 8601 YYYY-MM-DD format for sitemaps
 */
function formatLastModDate(dateInput?: string | Date): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return d.toISOString().split('T')[0];
}

/**
 * Generates an array of structured sitemap URL entries.
 * Standard Sitemaps XML protocol (sitemaps.org 0.9) requires indexable HTTP endpoints without fragment hash (#) identifiers.
 */
export function getSitemapUrlEntries(options?: SitemapGeneratorOptions): SitemapUrlEntry[] {
  const baseUrl = (options?.baseUrl || 'https://vercel.app').replace(/\/+$/, '');
  const lastmod = formatLastModDate(options?.defaultLastMod);

  // Single-Page App (SPA) root canonical entry
  return [
    {
      loc: baseUrl,
      lastmod,
      changefreq: 'daily',
      priority: '1.0',
      name: 'QuickFree Tools Single-Page Application'
    }
  ];
}

/**
 * Generates a valid, production-ready XML Sitemap string compliant with the sitemaps.org 0.9 schema
 */
export function generateDynamicSitemapXml(options?: SitemapGeneratorOptions): string {
  const entries = getSitemapUrlEntries(options);

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n' +
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n' +
    '        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  const xmlUrls = entries
    .map(entry => {
      const escapedLoc = escapeXml(entry.loc);
      const comment = entry.name ? `  <!-- ${escapeXml(entry.name)} -->\n` : '';
      return `${comment}  <url>\n` +
        `    <loc>${escapedLoc}</loc>\n` +
        `    <lastmod>${entry.lastmod}</lastmod>\n` +
        `    <changefreq>${entry.changefreq}</changefreq>\n` +
        `    <priority>${entry.priority}</priority>\n` +
        `  </url>`;
    })
    .join('\n');

  const xmlFooter = '\n</urlset>';

  return `${xmlHeader}${xmlUrls}${xmlFooter}`;
}

/**
 * Triggers a client-side dynamic file download of the generated sitemap.xml
 */
export function downloadSitemapXml(filename = 'sitemap.xml', options?: SitemapGeneratorOptions): void {
  const xmlContent = generateDynamicSitemapXml(options);
  const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
