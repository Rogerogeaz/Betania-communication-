const CACHE_NAME = "betania-cache-v2";
const OFFLINE_URL = "/Betania-communication-/index.html";

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        OFFLINE_URL,
        "/Betania-communication-/manifest.json",
        "/Betania-communication-/icon-192.png",
        "/Betania-communication-/icon-512.png"
      ])
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(resp => resp || caches.match(OFFLINE_URL))
    )
  );
});
