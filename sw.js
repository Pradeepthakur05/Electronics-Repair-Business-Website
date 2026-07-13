const CACHE_NAME = "sk-electronics-static-v1";
const ASSETS_TO_CACHE = [
  "./index.html",
  "./about.html",
  "./services.html",
  "./gallery.html",
  "./book.html",
  "./contact.html",
  "./privacy.html",
  "./terms.html",
  "./404.html",
  "./style.css",
  "./app.js",
  "./icon.png",
  "./icon-large.png",
  "./og-image.jpg"
];

// Install Event - Caching Assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Add assets using settled pattern to bypass missing assets gracefully
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn(`Failed to cache PWA asset: ${url}`, err);
          });
        })
      );
    })
  );
  self.skipWaiting();
});

// Activate Event - Clearing obsolete caches
self.addEventListener("activate", (e) => {
  e.waitUntil(
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

// Fetch Event - Stale While Revalidate
self.addEventListener("fetch", (e) => {
  // Only handle local HTTP/S requests
  if (e.request.url.startsWith(self.location.origin)) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Fetch update in background
          fetch(e.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, networkResponse);
              });
            }
          }).catch(() => {/* ignore offline error */});
          
          return cachedResponse;
        }
        return fetch(e.request);
      })
    );
  }
});
