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
    if ('serviceWorker' in navigator) {
        // Use relative path for registration - more robust for GitHub Pages subdirectories
        navigator.serviceWorker.register('sw.js') // CHANGED FROM '/sw.js'
            .then((registration) => {
                console.log('[Main] Service Worker registered successfully with scope:', registration.scope);
                // Optional: Listen for updates
                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    // New content is available; please refresh.
                                    console.log('[Main] New content is available and will be used when all tabs for this page are closed.');
                                    // Optionally, prompt the user to refresh
                                } else {
                                    // Content is cached for offline use.
                                    console.log('[Main] Content is cached for offline use.');
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
    audio.init();
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
    init();
}

