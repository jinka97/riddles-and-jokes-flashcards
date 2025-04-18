// sw.js - Service Worker for PWA Caching

// IMPORTANT: Change this cache name whenever you update any of the cached files!
const CACHE_NAME = 'bolt-chatty-flashcards-v2'; // Incremented version

// List of files to cache immediately during installation
// Using relative paths (./) which should work better for GitHub Pages subdirectories
const FILES_TO_CACHE = [
  './', // Cache the root directory (often maps to index.html)
  './index.html',
  './styles.css',
  './manifest.json',
  './flashcards.js',
  // JS Modules
  './main.js',
  './config.js',
  './state.js',
  './dom.js',
  './storage.js',
  './audio.js',
  './ui.js',
  './game.js',
  './events.js',
  // Assets (Ensure these paths/filenames are EXACTLY correct, including case)
  './assets/bolt.png',
  './assets/chatty.png',
  './assets/background-music.mp3',
  './assets/icon-192x192.png', // Match manifest icon path
  './assets/icon-512x512.png', // Match manifest icon path
  // Removed external font URL for simpler caching initially
  // './https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap',
];

// Install event: Cache essential files
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Install Event');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching app shell');
        // Use addAll - if any request fails, the whole operation fails.
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => {
        console.log('[Service Worker] Skip waiting on install');
        return self.skipWaiting(); // Activate worker immediately
      })
      .catch((error) => {
        // Log the specific error during install
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activate Event');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    }).then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event: Serve cached content when offline (Cache-First Strategy)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests or requests for browser extensions
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request) // Check cache first
      .then((cachedResponse) => {
        // Return cached response if found
        if (cachedResponse) {
          // console.log('[Service Worker] Returning from Cache:', event.request.url);
          return cachedResponse;
        }

        // If not in cache, fetch from network
        // console.log('[Service Worker] Network request for:', event.request.url);
        return fetch(event.request).then(
          (networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 /*|| networkResponse.type !== 'basic'*/) {
               // Allow caching opaque responses for things like fonts if needed, but be aware of limitations
               // For now, just return non-basic/error responses directly without caching
               // console.log(`[Service Worker] Not caching non-basic/error response: ${event.request.url} Status: ${networkResponse?.status}`);
               return networkResponse;
            }

            // Clone the response
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // console.log('[Service Worker] Caching new resource:', event.request.url);
                cache.put(event.request, responseToCache); // Cache the fetched response
              });

            return networkResponse; // Return the network response
          }
        ).catch(error => {
             console.error('[Service Worker] Fetch failed:', error);
             // Optional: Return offline fallback page
             // return caches.match('./offline.html');
        });
      })
  );
});

