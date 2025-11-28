// Service Worker for Caching and Offline Access
const CACHE_NAME = 'routine-optimizer-v1';
const urlsToCache = [
    'index.html',
    'manifest.json'
];

self.addEventListener('install', (event) => {
    // Pre-cache the core files when the service worker is installed
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching App Shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Service Worker: Failed to cache files:', error);
            })
    );
});

self.addEventListener('fetch', (event) => {
    // Intercept network requests and serve from cache if available
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                // No cache hit - fetch from network
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event) => {
    // Clean up old caches
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});