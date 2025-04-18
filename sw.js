// sw.js - Service Worker for PWA Caching

// IMPORTANT: Change this cache name whenever you update any of the cached files!
const CACHE_NAME = 'bolt-chatty-flashcards-v1';

// List of files to cache immediately during installation
const FILES_TO_CACHE = [
  '/', // Cache the root (index.html)
  'index.html',
  'styles.css',
  'manifest.json',
  'flashcards.js',
  // JS Modules (Important for offline functionality)
  'main.js',
  'config.js',
  'state.js',
  'dom.js',
  'storage.js',
  'audio.js',
  'ui.js',
  'game.js',
  'events.js',
  // Assets (Update with your actual assets)
  'assets/bolt.png',
  'assets/chatty.png',
  'assets/background-music.mp3',
  'assets/icon-192x192.png', // Match manifest icon path
  'assets/icon-512x512.png', // Match manifest icon path
  // Potentially cache external resources if needed (e.g., Google Fonts CSS)
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap',
  // Note: Caching external resources like Tone.js CDN might be complex due to opaque responses.
  // It's often better to let them be fetched online or include them locally if offline is critical.
];

// Install event: Cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        self.skipWaiting(); // Activate worker immediately
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim(); // Take control of open clients immediately
});

// Fetch event: Serve cached content when offline (Cache-First Strategy)
self.addEventListener('fetch', (event) => {
  // console.log('[Service Worker] Fetch', event.request.url);
  // Skip requests that are not GET, or for browser extensions
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request) // Check cache first
      .then((response) => {
        if (response) {
          // console.log('[Service Worker] Returning from Cache:', event.request.url);
          return response; // Return cached response if found
        }
        // console.log('[Service Worker] Network request for:', event.request.url);
        // If not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
               // Don't cache invalid responses (like errors or opaque responses from CDNs without CORS)
               return networkResponse;
            }

            // Clone the response because it's a stream and can only be consumed once
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // console.log('[Service Worker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache); // Cache the fetched response
              });

            return networkResponse; // Return the network response
          })
          .catch((error) => {
            console.error('[Service Worker] Fetch failed; returning offline page instead.', error);
            // Optional: Return a specific offline fallback page if needed
            // return caches.match('offline.html');
            // Or just let the browser handle the fetch error
          });
      })
  );
});
