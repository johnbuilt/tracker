self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        '/tracker/',
        '/tracker/index.html',
        '/tracker/style.css',
        '/tracker/script.js',
        '/tracker/manifest.json',
        '/tracker/icon-192x192.png',
        '/tracker/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
