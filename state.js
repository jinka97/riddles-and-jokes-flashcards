// state.js - Manages the dynamic state of the application

import { config } from './config.js';

// Exporting 'let' allows modification from other modules.
export let state = {
    currentCardIndex: 0,
    shuffledDeck: [],
    score: { correct: 0, incorrect: 0 },
    isSubscribed: false,
    selectedCategory: "",
    selectedDifficulty: "all",
    categoryCardCounts: {},
    isMuted: false,
    sfxMuted: false,
    currentTheme: 'light',
    favoriteCardIds: new Set(),
    difficultCardIds: new Set(),
    isTimedMode: false,
    timerId: null,
    selectedTimerDuration: 60, // Store selected duration (default 60)
    timeRemaining: 60, // Current countdown value
    currentCardHasBeenFlipped: false,
    soundsReady: false,
    // New Filter States
    filterFavorites: false,
    filterDifficult: false
};

