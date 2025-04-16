const CACHE_NAME = 'bolt-chatty-flashcards-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/flashcards.js',
    '/privacy.html',
    '/manifest.json',
    '/assets/bolt.png',
    '/assets/chatty.png',
    '/assets/bolt-sound.mp3',
    '/assets/chatty-sound.mp3',
    '/assets/bolt-chatty.png',
    '/assets/favicon.png',
    '/assets/icon-192x192.png',
    '/assets/icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js',
    'https://fonts.googleapis.com/css2?family=Annie+Use+Your+Telescope&display=swap'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.error('Service Worker: Cache installation failed:', err);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached response if available, otherwise fetch from network
                return response || fetch(event.request).catch(() => {
                    // If fetch fails (e.g., offline), return a fallback for HTML pages
                    if (event.request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
