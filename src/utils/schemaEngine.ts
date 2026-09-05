/**
 * QuickFree Tools - Dynamic Programmatic SEO & Schema.org Rich Snippet Engine
 * 
 * Injects and synchronizes Schema.org FAQPage and TechArticle JSON-LD structures
 * dynamically into the document head when a research query is submitted or loaded.
 * Ensures Google Search bots can index high-value 40-50 word Featured Snippets
 * directly under the primary SERP link with zero server-side round trips.
 */

import { ResearchDataResult } from '../types';

export const SCHEMA_SCRIPT_ID = 'seo-rich-snippet-schema';

/**
 * Converts any natural language query into a clean, canonical URL slug.
 */
export function slugifyQuery(query: string): string {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

/**
 * Formats a slug back into a human-readable title/query.
 */
export function unslugifyQuery(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .trim();
}

/**
 * Generates valid Schema.org FAQPage structured data JSON-LD.
 * Specifically crafted for Google Featured Snippets and SERP Answer Boxes.
 */
export function generateFaqSchema(query: string, snippetAnswer: string): object {
  return {
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": query,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": snippetAnswer
        }
      }
    ]
  };
}

/**
 * Generates valid Schema.org TechArticle structured data JSON-LD.
 */
export function generateTechArticleSchema(
  query: string,
  title: string,
  snippetAnswer: string,
  category: string,
  bulletPoints: string[],
  slug: string
): object {
  const canonicalUrl = `https://quickfreetools.com/?q=${slug}`;
  const nowIso = new Date().toISOString();

  return {
    "@type": "TechArticle",
    "headline": title,
    "name": query,
    "description": snippetAnswer,
    "articleBody": `${snippetAnswer} Key Core Principles: ${bulletPoints.join(' • ')}`,
    "inLanguage": "en-US",
    "genre": "Technical Reference & Computational Research",
    "about": {
      "@type": "Thing",
      "name": category
    },
    "author": {
      "@type": "Organization",
      "name": "QuickFree Tools Research & Client-Compute Engine",
      "url": "https://quickfreetools.com/"
    },
    "publisher": {
      "@type": "Organization",
      "name": "QuickFree Tools",
      "url": "https://quickfreetools.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://quickfreetools.com/icon.svg",
        "width": 512,
        "height": 512
      }
    },
    "datePublished": "2026-01-01T00:00:00Z",
    "dateModified": nowIso,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    }
  };
}

/**
 * Injects or updates Schema.org JSON-LD directly into document.head
 * along with title and meta description tag updates for Googlebot crawlability.
 */
export function injectDynamicSeoSchema(research: ResearchDataResult): void {
  if (typeof document === 'undefined') return;

  try {
    // 1. Unified JSON-LD Schema graph combining FAQPage and TechArticle
    const graphPayload = {
      "@context": "https://schema.org",
      "@graph": [
        research.schemaFaqJson,
        research.schemaTechArticleJson
      ]
    };

    let scriptEl = document.getElementById(SCHEMA_SCRIPT_ID) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = SCHEMA_SCRIPT_ID;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(graphPayload, null, 2);

    // 2. Synchronize Document Title & Meta Description for Rich Snippet verification
    const originalTitle = document.title;
    document.title = `${research.title} — QuickFree Tools Research Engine`;

    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) {
      metaDesc.setAttribute('content', research.snippetAnswer);
    }

    let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) {
      ogTitle.setAttribute('content', `${research.title} | Direct Answer`);
    }

    let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) {
      ogDesc.setAttribute('content', research.snippetAnswer);
    }

    // 3. Update canonical link tag dynamically
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const targetUrl = `https://quickfreetools.com/?q=${research.slug}`;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = targetUrl;
  } catch (err) {
    console.warn('Schema injection non-blocking warning:', err);
  }
}

/**
 * Cleans up dynamic research schema and restores default document metadata.
 */
export function removeDynamicSeoSchema(): void {
  if (typeof document === 'undefined') return;

  const scriptEl = document.getElementById(SCHEMA_SCRIPT_ID);
  if (scriptEl && scriptEl.parentNode) {
    scriptEl.parentNode.removeChild(scriptEl);
  }

  document.title = 'QuickFree Tools ✨ — 100 Free Client-Side Tools across 8 Master Nodes';
  
  const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (metaDesc) {
    metaDesc.setAttribute(
      'content',
      'Access 100 free, high-precision tools organized across 8 Master Nodes: financial calculators, developer syntax converters, string wizards, system ops, design studio, crypto shields, and marketing analytics. Zero paywalls, 100% private in-browser compute.'
    );
  }
}

/**
 * Synchronize browser state using window.history.pushState with a clean URL slug
 * (e.g., /?q=target-query-slug) without triggering a page reload.
 */
export function syncQueryToUrl(slug: string, replace = false): void {
  if (typeof window === 'undefined') return;

  try {
    const url = new URL(window.location.href);
    if (slug) {
      url.searchParams.set('q', slug);
      // Remove any legacy anchor
      url.hash = '';
    } else {
      url.searchParams.delete('q');
    }

    const stateUrl = url.pathname + url.search;
    if (replace) {
      window.history.replaceState({ querySlug: slug }, '', stateUrl);
    } else {
      window.history.pushState({ querySlug: slug }, '', stateUrl);
    }
  } catch {
    // Graceful fallback for iframe sandbox limitations
  }
}

/**
 * Extracts any research query parameter from the active window location.
 */
export function extractQueryFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || urlParams.get('query') || urlParams.get('search');
    if (q && q.trim()) {
      return q.trim();
    }
  } catch {
    // Ignore sandbox errors
  }
  return null;
}
