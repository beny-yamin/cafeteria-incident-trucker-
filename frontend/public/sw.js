const CACHE_NAME = 'cafeteria-tracker-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/favicon-64.png',
  '/logo-128.png',
  '/logo-256.png',
  '/logo-512.png',
  '/logo-mark.svg',
  '/logo.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('Pre-caching assets warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = event.request.url;

  // Only handle GET requests with http/https schemes; skip API requests and unsupported schemes (e.g. chrome-extension, moz-extension)
  if (
    event.request.method !== 'GET' ||
    !(requestUrl.startsWith('http://') || requestUrl.startsWith('https://')) ||
    requestUrl.includes('/api/')
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache static asset clones (only valid http/https responses)
        if (
          response &&
          response.status === 200 &&
          (requestUrl.includes('/assets/') || requestUrl.match(/\.(png|svg|ico|js|css)$/))
        ) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone))
            .catch((err) => {
              // Silently ignore cache storage errors on unsupported schemes/responses
              console.warn('Cache put skipped or unsupported:', err);
            });
        }
        return response;
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
