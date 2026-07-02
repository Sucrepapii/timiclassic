self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // Clear all caches
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      // Unregister this service worker
      return self.registration.unregister();
    })
  );
  // Tell the active service worker to take control of the page immediately
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass through all requests to network
});
