/* Deck Print service worker: works fully offline after the first visit */
const CACHE = 'deckprint-34ac4b62b4';
const FILES = ['./', 'fonts.css', 'fonts/alegreya-latin-400-normal.woff2', 'fonts/alegreya-latin-500-normal.woff2', 'fonts/alegreya-latin-700-normal.woff2', 'fonts/atkinson-hyperlegible-latin-400-normal.woff2', 'fonts/atkinson-hyperlegible-latin-700-normal.woff2', 'fonts/bebas-neue-latin-400-normal.woff2', 'fonts/bitter-latin-400-normal.woff2', 'fonts/bitter-latin-500-normal.woff2', 'fonts/bitter-latin-700-normal.woff2', 'fonts/bricolage-grotesque-latin-600-normal.woff2', 'fonts/bricolage-grotesque-latin-800-normal.woff2', 'fonts/fredoka-latin-400-normal.woff2', 'fonts/fredoka-latin-500-normal.woff2', 'fonts/fredoka-latin-700-normal.woff2', 'fonts/ibm-plex-mono-latin-400-normal.woff2', 'fonts/ibm-plex-mono-latin-600-normal.woff2', 'fonts/oswald-latin-400-normal.woff2', 'fonts/oswald-latin-500-normal.woff2', 'fonts/oswald-latin-700-normal.woff2', 'fonts/public-sans-latin-400-normal.woff2', 'fonts/public-sans-latin-600-normal.woff2', 'fonts/public-sans-latin-700-normal.woff2', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'index.html', 'manifest.webmanifest', 'privacy.html', 'vendor/jspdf.umd.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const nav = e.request.mode === 'navigate' || /(\/|index\.html)$/.test(new URL(e.request.url).pathname);
  if (nav) { e.respondWith(fetch(e.request, {cache: 'no-store'}).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./', cp)); return r; }).catch(() => caches.match('./'))); return; }
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(r => r || fetch(e.request).catch(() => caches.match('./'))));
});
