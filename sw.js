// Offline support. App files load from the network when online (cached copy offline); Google Fonts are cached once.
// Bump VERSION whenever any app file changes, so phones pick up the new version.
const VERSION = "v9";
const CACHE = "shuffle-sweat-" + VERSION;
const APP_FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/styles.css",
  "js/store.js",
  "js/moves.js",
  "js/poses.js",
  "js/figure.js",
  "js/week.js",
  "js/programs.js",
  "js/workout.js",
  "js/menu.js",
  "js/app.js",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith("shuffle-sweat-") && k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== location.origin && !isFont) return;

  // App files: network first, so an update shows up on the next open; the cache is the offline fallback.
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req.url, { cache: "no-cache" })   // revalidate with GitHub instead of trusting the browser cache
        .then(res => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === "navigate" ? "index.html" : req, copy)); }
          return res;
        })
        .catch(() => caches.match(req.mode === "navigate" ? "index.html" : req, { ignoreSearch: true }))
    );
    return;
  }

  // Google Fonts: cache first, they never change.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === "opaque") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }))
  );
});
