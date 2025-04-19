// main.js - Entry point for the application

import { dom, cacheDOMElements } from './dom.js';
import { storage } from './storage.js';
import { ui } from './ui.js';
import { audio } from './audio.js';
import { events } from './events.js';
import { config } from './config.js'; // *** Import config ***

// state is imported by other modules where needed

// Make sure allFlashcards is loaded from flashcards.js globally before this runs
/* global allFlashcards, gtag */ // Added gtag to global hint

/**
 * Registers the service worker.
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js') // Use relative path
            .then((registration) => {
                console.log('[Main] Service Worker registered successfully with scope:', registration.scope);
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('[Main] New content available; refresh required.');
                                } else {
                                    console.log('[Main] Content cached for offline use.');
                                }
                            }
                        };
                    }
                };
            })
            .catch((error) => {
                console.error('[Main] Service Worker registration failed:', error);
            });
        navigator.serviceWorker.onerror = (error) => {
             console.error('[Main] Service Worker error:', error);
        };
    } else {
        console.log('[Main] Service Worker not supported.');
    }
}


/**
 * Initializes the application.
 */
function init() {
    console.log("[Init] Initializing App...");
    // Ensure essential data is loaded first
    if (typeof allFlashcards === 'undefined' || allFlashcards.length === 0) {
         console.error("Flashcard data missing. Aborting.");
         const loader = document.getElementById('loading-indicator');
         if(loader) loader.innerHTML = "<p>Error: Flashcard data missing.</p>";
         return;
    }
     // Ensure all cards have IDs and difficulty
     allFlashcards.forEach((card, index) => {
        if (!card.id) card.id = `card-${index}-${Date.now()}`;
        if (!card.difficulty) card.difficulty = 'medium';
    });

    if (!cacheDOMElements()) { // Cache DOM elements and check for critical failures
         console.error("DOM caching failed. Aborting.");
         return;
    }

    storage.loadPreferences(); // Load saved state
    ui.applyTheme(); // Apply loaded theme
    ui.updateMusicMuteButton(); // Update mute button state
    ui.updateSfxButton(); // Update SFX mute button state (might show N/A initially)
    ui.updateSubscriptionUI(); // Update subscribe button & categories
    events.handleSelectionChange(); // Set initial UI based on dropdowns

    ui.toggleElementVisibility(dom.loadingIndicator, false); // Hide loading
    ui.toggleElementVisibility(dom.mainContent, true);    // Show content

    events.setupEventListeners(); // Setup event listeners AFTER elements are cached

    // Attempt to initialize sounds *after* main setup
    audio.init();
     const initAudioOnInteraction = () => { // Fallback for interaction start
         audio.init();
         document.removeEventListener('click', initAudioOnInteraction);
         document.removeEventListener('keydown', initAudioOnInteraction);
     };
     document.addEventListener('click', initAudioOnInteraction, { once: true });
     document.addEventListener('keydown', initAudioOnInteraction, { once: true });

    registerServiceWorker(); // Register SW

    // *** Configure Google Analytics using ID from config.js ***
    if (config.GA_MEASUREMENT_ID && config.GA_MEASUREMENT_ID !== 'YOUR_GA_MEASUREMENT_ID') {
         // Check if gtag function exists (loaded by the script in index.html)
         if (typeof gtag === 'function') {
             console.log(`[Init] Configuring GA with ID: ${config.GA_MEASUREMENT_ID}`);
             gtag('config', config.GA_MEASUREMENT_ID);
         } else {
              console.warn("[Init] gtag function not found. GA might not be loaded correctly.");
         }
    } else {
         console.warn("[Init] GA Measurement ID not configured in config.js or still placeholder.");
    }
    // *** End GA Configuration ***

    console.log("[Init] Initialization Complete.");
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

