// storage.js - Manages interactions with localStorage

import { state } from './state.js';
import { config } from './config.js';

export const storage = {
    saveItem: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch(e) {
            console.error("Error saving to localStorage:", e);
        }
    },
    getItem: (key, defaultValue = null) => {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue; // Return default if item doesn't exist
        try {
            return JSON.parse(item);
        } catch (e) {
            console.error(`Error parsing localStorage item "${key}":`, e);
            localStorage.removeItem(key); // Remove potentially corrupted item
            return defaultValue;
        }
    },
    loadPreferences: () => {
        console.log("[Storage] Loading preferences...");
        state.score = storage.getItem(config.LOCALSTORAGE_KEYS.score, { correct: 0, incorrect: 0 });
        state.isSubscribed = storage.getItem(config.LOCALSTORAGE_KEYS.subscription, false);
        state.isMuted = storage.getItem(config.LOCALSTORAGE_KEYS.mute, false);
        state.sfxMuted = storage.getItem(config.LOCALSTORAGE_KEYS.sfxMute, false);
        state.currentTheme = storage.getItem(config.LOCALSTORAGE_KEYS.theme, 'light');
        state.favoriteCardIds = new Set(storage.getItem(config.LOCALSTORAGE_KEYS.favorites, []));
        state.difficultCardIds = new Set(storage.getItem(config.LOCALSTORAGE_KEYS.difficults, []));
        console.log("[Storage] Preferences loaded.");
    },
    saveSet: (key, set) => storage.saveItem(key, [...set]), // Helper to save Sets
    saveBoolean: (key, value) => storage.saveItem(key, !!value), // Ensure boolean is saved
    saveScore: () => storage.saveItem(config.LOCALSTORAGE_KEYS.score, state.score),
    saveSubscription: () => storage.saveBoolean(config.LOCALSTORAGE_KEYS.subscription, state.isSubscribed),
    saveMute: () => storage.saveBoolean(config.LOCALSTORAGE_KEYS.mute, state.isMuted),
    saveSfxMute: () => storage.saveBoolean(config.LOCALSTORAGE_KEYS.sfxMute, state.sfxMuted),
    saveTheme: () => storage.saveItem(config.LOCALSTORAGE_KEYS.theme, state.currentTheme),
    saveFavorites: () => storage.saveSet(config.LOCALSTORAGE_KEYS.favorites, state.favoriteCardIds),
    saveDifficults: () => storage.saveSet(config.LOCALSTORAGE_KEYS.difficults, state.difficultCardIds)
};

