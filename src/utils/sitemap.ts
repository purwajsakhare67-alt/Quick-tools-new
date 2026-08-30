export interface SitemapUrlEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
  title: string;
  category?: string;
}

export function generateSitemapEntries(baseUrl = 'https://vercel.app'): SitemapUrlEntry[] {
  const today = new Date().toISOString().split('T')[0];

  // Official Single-Page Application (SPA) Canonical URL
  // In accordance with Google Sitemaps XML Protocol 0.9, fragment hashes (#) are omitted.
  return [
    {
      loc: baseUrl.replace(/\/+$/, ''),
      lastmod: today,
      changefreq: 'daily',
      priority: '1.0',
      title: 'QuickFree Tools - 35+ High-Precision Free Online Utilities & Financial Engines',
      category: 'SPA Homepage'
    }
  ];
}

export function generateXmlSitemap(baseUrl = 'https://vercel.app'): string {
  const entries = generateSitemapEntries(baseUrl);

  const xmlUrls = entries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlUrls}
</urlset>`;
}

