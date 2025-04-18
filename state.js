// state.js - Manages the dynamic state of the application

import { config } from './config.js';

// Exporting 'let' allows modification from other modules.
// Be mindful that any module can technically change this state.
// For larger apps, consider exporting functions to modify state (like a reducer pattern).
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
    timeRemaining: config.TIMER_DURATION,
    currentCardHasBeenFlipped: false,
    soundsReady: false
};

// Optional: Export functions to modify specific parts of the state
// export function setCurrentCardIndex(index) { state.currentCardIndex = index; }
// export function setShuffledDeck(deck) { state.shuffledDeck = deck; }
// etc.

