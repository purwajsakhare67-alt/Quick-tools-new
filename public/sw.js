/**
 * QuickFree Tools - Progressive Web App Service Worker
 * Configuration: Online-Only Access Strategy
 * 
 * This service worker enables local PWA installability across Chromium, Edge,
 * Android, and iOS while strictly enforcing online-only operation without
 * offline asset or data caching.
 */

const SW_VERSION = 'quickfree-online-v1.0.0';

// Service Worker Installation
self.addEventListener('install', (event) => {
  // Activate immediately without waiting for existing clients to close
  self.skipWaiting();
});

// Service Worker Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Clean up and purge any existing caches to ensure zero offline asset retention
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );

      // Take control of all open client tabs immediately
      await self.clients.claim();
    })()
  );
});

// Network-Only Fetch Strategy with Informative Online-Only Fallback
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET requests; pass all others directly
  if (request.method !== 'GET') {
    return;
  }

  // Handle HTML document navigation requests
  const isNavigation = request.mode === 'navigate' || 
    (request.headers.get('accept') && request.headers.get('accept').includes('text/html'));

  event.respondWith(
    (async () => {
      try {
        // Direct network fetch with zero offline caching
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch (error) {
        // If the user has lost connectivity and requested a page navigation
        if (isNavigation) {
          return new Response(
            generateOnlineOnlyFallbackHtml(),
            {
              status: 503,
              statusText: 'Service Unavailable - Online Connection Required',
              headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-store, no-cache, must-revalidate'
              }
            }
          );
        }

        // For non-navigation assets when offline, return service unavailable
        return new Response('Internet connection required. QuickFree Tools operates exclusively online.', {
          status: 503,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

// Message listener for manual client sync or skip-waiting commands
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Returns a high-contrast, informative fallback page displayed exclusively
 * when an installed PWA user launches the app without active internet connectivity.
 */
function generateOnlineOnlyFallbackHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickFree Tools — Online Connection Required</title>
  <style>
    :root {
      color-scheme: dark;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: #090d16;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      text-align: center;
    }
    .card {
      max-width: 480px;
      width: 100%;
      background: rgba(30, 41, 59, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(16px);
    }
    .icon-box {
      width: 64px;
      height: 64px;
      margin: 0 auto 1.5rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, #06b6d4, #8b5cf6, #ec4899);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px -5px rgba(139, 92, 246, 0.4);
    }
    .icon-box svg {
      width: 32px;
      height: 32px;
      fill: none;
      stroke: #ffffff;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    h1 {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.3);
      margin-bottom: 1rem;
    }
    p {
      font-size: 0.95rem;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 2rem;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.875rem 1.5rem;
      border-radius: 0.75rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: #ffffff;
      background: linear-gradient(135deg, #8b5cf6, #3b82f6);
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
    }
    .btn:active {
      transform: translateY(0);
    }
    .auto-indicator {
      margin-top: 1.25rem;
      font-size: 0.8rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-box">
      <svg viewBox="0 0 24 24">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.56 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
    </div>
    <span class="badge">Online Only Mode</span>
    <h1>Active Internet Connection Required</h1>
    <p>
      QuickFree Tools is configured for real-time online access only. Offline caching is disabled to guarantee you always compute with the latest data, algorithms, and currencies.
    </p>
    <button class="btn" onclick="window.location.reload()">
      Retry Connection
    </button>
    <div class="auto-indicator">
      Automatically reconnecting as soon as connection is detected...
    </div>
  </div>

  <script>
    // Automatically reload as soon as network connectivity is restored
    window.addEventListener('online', () => {
      window.location.reload();
    });
  </script>
</body>
</html>`;
}
