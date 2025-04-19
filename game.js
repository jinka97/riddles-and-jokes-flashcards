// game.js - Core game logic functions

import { state } from './state.js';
import { dom } from './dom.js';
import { ui } from './ui.js';
import { audio } from './audio.js';
import { storage } from './storage.js';
import { config } from './config.js';

// Make sure allFlashcards is accessible
/* global allFlashcards, events */

// --- Helper Functions ---
function shuffleArray(array) { /* ... (no changes) ... */
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Function to check if a card matches current filters
function cardMatchesFilters(item) {
    if (!item || !item.id) return false; // Basic check

    // Category Filter
    const categoryMatch = (state.selectedCategory === 'all')
        ? !item.premium // 'All' means all non-premium
        : (item.category === state.selectedCategory && (!item.premium || state.isSubscribed));
    if (!categoryMatch) return false;

    // Difficulty Filter
    const difficultyMatch = (state.selectedDifficulty === 'all') || (item.difficulty === state.selectedDifficulty);
    if (!difficultyMatch) return false;

    // Favorite Filter (only applies if checkbox is checked)
    if (state.filterFavorites && !state.favoriteCardIds.has(item.id)) {
        return false;
    }

    // Difficult Filter (only applies if checkbox is checked)
    if (state.filterDifficult && !state.difficultCardIds.has(item.id)) {
        return false;
    }

    return true; // Card passes all active filters
}

// --- Exported Functions ---

export function filterDeck() {
    console.log(`[Game] Filtering deck. Category: ${state.selectedCategory}, Difficulty: ${state.selectedDifficulty}, FavOnly: ${state.filterFavorites}, DiffOnly: ${state.filterDifficult}`);
    if (typeof allFlashcards === 'undefined') {
        console.error("allFlashcards not defined in filterDeck");
        return [];
    }
    // Use the helper function to filter
    return allFlashcards.filter(cardMatchesFilters);
}

export function startGame(timed = false) {
    state.isTimedMode = timed;
    stopTimer();

    state.shuffledDeck = filterDeck();

    if (state.shuffledDeck.length === 0) {
         alert('No cards available for this selection/filter.');
         goBackToSetup();
         return;
    }

    console.log(`[Game] Starting. Timed: ${state.isTimedMode}, Deck size: ${state.shuffledDeck.length}`);
    shuffleArray(state.shuffledDeck);
    state.currentCardIndex = 0;

    if (state.isTimedMode) {
        state.score = { correct: 0, incorrect: 0 }; // Reset score ONLY for timed game
        ui.updateScoreDisplay(); // Update display for timed game start
    }
    // For untimed mode, score persists across decks until reset manually

    // Reset UI for game start
    ui.toggleElementVisibility(dom.endMessage, false);
    ui.toggleElementVisibility(dom.setupArea, false);
    ui.toggleElementVisibility(dom.gameArea, true);
    ui.toggleElementVisibility(dom.timerDisplay, state.isTimedMode);

    // Ensure all necessary game elements are visible
    ui.toggleElementVisibility(dom.guideMessageArea, true);
    ui.toggleElementVisibility(dom.flashcard.parentElement, true);
    ui.toggleElementVisibility(dom.progressDisplay, true);
    ui.toggleElementVisibility(dom.scoreDisplay, true); // Always show score display
    ui.toggleElementVisibility(dom.scoreButtonsContainer, true);
    ui.toggleElementVisibility(dom.cardActionsDiv, true);
    ui.toggleElementVisibility(dom.shuffleButton, true);
    ui.toggleElementVisibility(dom.resetProgressButton, true);
    ui.toggleElementVisibility(dom.backToSetupButton, true);
    ui.toggleElementVisibility(dom.muteButton, true);
    ui.toggleElementVisibility(dom.sfxMuteButton, true);
    ui.toggleElementVisibility(dom.prevCardButton, true);
    ui.toggleElementVisibility(dom.nextCardButton, true);

    ui.updateCardDisplay(); // Display the first card

    if (state.isTimedMode) startTimer();

    if (!state.isMuted && dom.backgroundMusic && dom.backgroundMusic.paused) {
       dom.backgroundMusic.play().catch(e => console.warn("Audio autoplay prevented:", e));
    }
}

export function nextCard() { /* ... (no changes) ... */
    console.log(`[Game] nextCard called. Index: ${state.currentCardIndex}`);
    if (state.currentCardIndex < state.shuffledDeck.length - 1) {
        state.currentCardIndex++;
        ui.updateCardDisplay();
    } else {
         console.log("[Game] Reached end of deck.");
         ui.showEndMessage();
    }
}

export function previousCard() { /* ... (no changes) ... */
    console.log(`[Game] previousCard called. Index: ${state.currentCardIndex}`);
    if (state.currentCardIndex > 0) {
        state.currentCardIndex--;
        ui.updateCardDisplay();
    }
}

export function recordScore(isCorrect) {
    if (!dom.correctButton || dom.correctButton.disabled) return;
    console.log(`[Game] recordScore called. Correct: ${isCorrect}`);

    ui.showFeedbackIcon(isCorrect ? 'correct' : 'incorrect');
    audio.playSound(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) state.score.correct++; else state.score.incorrect++;
    storage.saveScore(); // Save score regardless of mode
    ui.updateScoreDisplay(); // Update display immediately

    dom.flashcard?.classList.toggle('correct-answer', isCorrect);
    dom.flashcard?.classList.toggle('incorrect-answer', !isCorrect);

    dom.correctButton.disabled = true;
    dom.incorrectButton.disabled = true;
}

export function flipCard() { /* ... (no changes in core logic, only added log) ... */
    if (!dom.flashcard) return;
    console.log(`[Game] flipCard called. Card Index: ${state.currentCardIndex}. Current classList: ${dom.flashcard.className}`);
    dom.flashcard.classList.toggle('is-flipped');
    // audio.playSound('flip'); // Temporarily disabled for debug - RE-ENABLE IF FLIPPING WORKS
    console.log(`[Game] flipCard AFTER toggle. Card Index: ${state.currentCardIndex}. New classList: ${dom.flashcard.className}`);

    if (state.shuffledDeck.length === 0 || state.currentCardIndex >= state.shuffledDeck.length) return;
    const cardData = state.shuffledDeck[state.currentCardIndex];
    if (!cardData) return;

    if (dom.flashcard.classList.contains('is-flipped')) {
        dom.flashcard.setAttribute('aria-label', `Flashcard back showing answer: ${cardData.answer}.`);
        if (!state.currentCardHasBeenFlipped) {
            console.log("[Game] First flip on this card, enabling score buttons.");
            if(dom.correctButton) dom.correctButton.disabled = false;
            if(dom.incorrectButton) dom.incorrectButton.disabled = false;
            state.currentCardHasBeenFlipped = true;
        }
    } else {
         dom.flashcard.setAttribute('aria-label', `Flashcard front showing question: ${cardData.question}. Press space or enter to flip.`);
         ui.showFeedbackIcon('');
    }
}


export function startTimer() {
    stopTimer();
    // Use selected duration from state, default to config if somehow invalid
    state.timeRemaining = parseInt(state.selectedTimerDuration, 10) || config.TIMER_DURATION;
    ui.toggleElementVisibility(dom.timerDisplay, true);
    ui.updateTimerDisplay(); // Show initial time
    console.log(`[Game] Timer started for ${state.timeRemaining} seconds.`);

    state.timerId = setInterval(() => {
        state.timeRemaining--;
        ui.updateTimerDisplay();
        if (state.timeRemaining <= 0) {
            console.log("[Game] Timer finished.");
            stopTimer();
            ui.showEndMessage(); // End game when time runs out
        }
    }, 1000);
}

export function stopTimer() { /* ... (no changes) ... */
    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
        console.log("[Game] Timer stopped.");
    }
     ui.toggleElementVisibility(dom.timerDisplay, false);
}

export function resetProgress() { /* ... (no changes) ... */
    if (state.shuffledDeck.length === 0) return;
    if (confirm("Reset score and reshuffle this selection from the beginning?")) {
        audio.playSound('click');
        state.score = { correct: 0, incorrect: 0 };
        storage.saveScore();
        ui.updateScoreDisplay();
        state.currentCardIndex = 0;
        shuffleArray(state.shuffledDeck);
        console.log("[Game] Progress reset. Reshuffled current deck.");
        stopTimer();
        state.isTimedMode = false;
        ui.updateCardDisplay();
        // Ensure game UI elements are visible
         ui.toggleElementVisibility(dom.guideMessageArea, true);
         ui.toggleElementVisibility(dom.flashcard.parentElement, true);
         ui.toggleElementVisibility(dom.progressDisplay, true);
         ui.toggleElementVisibility(dom.scoreDisplay, true);
         ui.toggleElementVisibility(dom.scoreButtonsContainer, true);
         ui.toggleElementVisibility(dom.cardActionsDiv, true);
         ui.toggleElementVisibility(dom.prevCardButton, true);
         ui.toggleElementVisibility(dom.nextCardButton, true);
         ui.toggleElementVisibility(dom.endMessage, false);
         ui.toggleElementVisibility(dom.shuffleButton, true);
         ui.toggleElementVisibility(dom.resetProgressButton, true);
         ui.toggleElementVisibility(dom.backToSetupButton, true);
         ui.toggleElementVisibility(dom.muteButton, true);
         ui.toggleElementVisibility(dom.sfxMuteButton, true);
         ui.toggleElementVisibility(dom.timerDisplay, false);
    }
}

export function shuffleCurrentDeck() { /* ... (no changes) ... */
     if (state.selectedCategory && state.shuffledDeck.length > 0) {
        console.log(`[Game] Reshuffling selection: ${state.selectedCategory}, Difficulty: ${state.selectedDifficulty}`);
        startGame(state.isTimedMode); // Restart with same mode
    } else {
        alert("Please select a category and difficulty first to shuffle.");
    }
}

export function goBackToSetup() { /* ... (no changes) ... */
    audio.playSound('click');
    stopTimer();
    state.isTimedMode = false;
    state.selectedCategory = "";
    state.selectedDifficulty = "all";
    state.shuffledDeck = [];
    ui.resetUI(); // ui function now resets filters too
    // if (!state.isMuted && dom.backgroundMusic) dom.backgroundMusic.pause();
}

export function toggleFavorite() { /* ... (no changes) ... */
    audio.playSound('click');
    if (state.shuffledDeck.length === 0 || state.currentCardIndex >= state.shuffledDeck.length) return;
    const cardId = state.shuffledDeck[state.currentCardIndex]?.id;
    if (!cardId) return;
    if (state.favoriteCardIds.has(cardId)) state.favoriteCardIds.delete(cardId);
    else state.favoriteCardIds.add(cardId);
    storage.saveFavorites();
    ui.updateFavDiffButtons(cardId);
}

export function toggleDifficult() { /* ... (no changes) ... */
    audio.playSound('click');
    if (state.shuffledDeck.length === 0 || state.currentCardIndex >= state.shuffledDeck.length) return;
    const cardId = state.shuffledDeck[state.currentCardIndex]?.id;
     if (!cardId) return;
    if (state.difficultCardIds.has(cardId)) state.difficultCardIds.delete(cardId);
    else state.difficultCardIds.add(cardId);
    storage.saveDifficults();
    ui.updateFavDiffButtons(cardId);
}

 export function handleSubscription() { /* ... (no changes) ... */
    audio.playSound('click');
    state.isSubscribed = true;
    storage.saveSubscription();
    alert('Premium content unlocked! Premium categories and cards are now available.');
    ui.updateSubscriptionUI();
    // Attempt to call handleSelectionChange if events is available
    if (typeof events !== 'undefined' && events.handleSelectionChange) {
         events.handleSelectionChange();
    } else {
         console.warn("Could not call events.handleSelectionChange from game module.");
         // Fallback UI update
         const count = countCardsForSelection(state.selectedCategory, state.selectedDifficulty);
         if (state.selectedCategory && dom.categoryInfoDiv) {
              dom.categoryInfoDiv.textContent = `Matching cards: ${count}`;
              if(dom.startTimerButton) dom.startTimerButton.disabled = count === 0;
         }
    }
}

// Internal helper function reference for handleSubscription fallback
function countCardsForSelection(category, difficulty) {
     /* global allFlashcards */
     if (typeof allFlashcards === 'undefined') return 0;
     return allFlashcards.filter(item => {
         const categoryMatch = (category === 'all') ? !item.premium : (item.category === category && (!item.premium || state.isSubscribed));
         const difficultyMatch = (difficulty === 'all') || (item.difficulty === state.selectedDifficulty);
         return categoryMatch && difficultyMatch && item.id;
     }).length;
}

