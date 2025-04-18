// main.js - Entry point for the application

import { dom, cacheDOMElements } from './dom.js';
import { storage } from './storage.js';
import { ui } from './ui.js';
import { audio } from './audio.js';
import { events } from './events.js';
// state is imported by other modules where needed

// Make sure allFlashcards is loaded from flashcards.js globally before this runs
/* global allFlashcards */

/**
 * Registers the service worker.
 */
function registerServiceWorker() {
    // Check if service workers are supported by the browser
    if ('serviceWorker' in navigator) {
        // Register sw.js file located at the root of the site
        navigator.serviceWorker.register('/sw.js') // Path relative to origin
            .then((registration) => {
                // Registration was successful
                console.log('[Main] Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                // Registration failed
                console.error('[Main] Service Worker registration failed:', error);
            });
    } else {
        // Service workers are not supported
        console.log('[Main] Service Worker not supported by this browser.');
    }
}


/**
 * Initializes the application.
 */
function init() {
    console.log("[Init] Initializing App...");
    // Ensure essential data is loaded first
    if (typeof allFlashcards === 'undefined' || allFlashcards.length === 0) {
         console.error("Flashcard data is not loaded or empty. Aborting initialization.");
         const loader = document.getElementById('loading-indicator'); // Direct access before cache
         if(loader) loader.innerHTML = "<p>Error: Flashcard data missing.</p>";
         return;
    }
     // Ensure all cards have IDs and difficulty (moved from global scope)
     allFlashcards.forEach((card, index) => {
        if (!card.id) {
            console.warn(`Card at index ${index} missing ID. Assigning temporary ID.`);
            card.id = `card-${index}-${Date.now()}`;
        }
        if (!card.difficulty) card.difficulty = 'medium';
    });


    if (!cacheDOMElements()) { // Cache DOM elements and check for critical failures
         console.error("Failed to cache essential DOM elements. Aborting initialization.");
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
    // Tone.js often requires user interaction to start the AudioContext
    audio.init();
     // Add interaction listeners again just in case context needs resuming later
     // These ensure that if the context didn't start immediately, the first click/key press will try again.
     const initAudioOnInteraction = () => {
         audio.init();
         document.removeEventListener('click', initAudioOnInteraction);
         document.removeEventListener('keydown', initAudioOnInteraction);
     };
     document.addEventListener('click', initAudioOnInteraction, { once: true });
     document.addEventListener('keydown', initAudioOnInteraction, { once: true });

    // Register the service worker for PWA functionality
    registerServiceWorker();

    console.log("[Init] Initialization Complete.");
}

// Wait for DOM content to load, then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOMContentLoaded has already fired
    init();
}

