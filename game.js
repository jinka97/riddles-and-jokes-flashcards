// game.js - Core game logic functions

import { state } from './state.js';
import { dom } from './dom.js';
import { ui } from './ui.js';
import { audio } from './audio.js';
import { storage } from './storage.js';
import { config } from './config.js';

// Make sure allFlashcards is accessible (it's loaded globally before modules)
/* global allFlashcards, events */ // Added events to global hint for handleSubscription fallback

// Private helper function (not exported)
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

// Helper function needed locally or imported if moved
function countCardsForSelection(category, difficulty) { /* ... (no changes) ... */
     /* global allFlashcards */ // Use global data
     // Ensure allFlashcards is available
     if (typeof allFlashcards === 'undefined') return 0;
     return allFlashcards.filter(item => {
         const categoryMatch = (category === 'all') ? !item.premium : (item.category === category && (!item.premium || state.isSubscribed));
         const difficultyMatch = (difficulty === 'all') || (item.difficulty === state.selectedDifficulty); // Use state for current difficulty
         // Ensure item.id exists before counting
         return categoryMatch && difficultyMatch && item.id;
     }).length;
}


export function filterDeck() { /* ... (no changes) ... */
    console.log(`[Game] Filtering deck. Category: ${state.selectedCategory}, Difficulty: ${state.selectedDifficulty}`);
     // Ensure allFlashcards is available
     if (typeof allFlashcards === 'undefined') {
          console.error("allFlashcards not defined in filterDeck");
          return [];
     }
    return allFlashcards.filter(item => {
        const categoryMatch = (state.selectedCategory === 'all') ? !item.premium : (item.category === state.selectedCategory && (!item.premium || state.isSubscribed));
        const difficultyMatch = (state.selectedDifficulty === 'all') || (item.difficulty === state.selectedDifficulty);
        return categoryMatch && difficultyMatch && item.id; // Ensure card has ID
    });
}

export function startGame(timed = false) { /* ... (no changes) ... */
    state.isTimedMode = timed;
    stopTimer(); // Use exported function

    state.shuffledDeck = filterDeck(); // Use exported function

    if (state.shuffledDeck.length === 0) {
         alert('No cards available for this selection.');
         goBackToSetup(); // Use exported function
         return;
    }

    console.log(`[Game] Starting. Timed: ${state.isTimedMode}, Deck size: ${state.shuffledDeck.length}`);
    shuffleArray(state.shuffledDeck); // Use private helper
    state.currentCardIndex = 0;

    if (state.isTimedMode) {
        state.score = { correct: 0, incorrect: 0 };
        ui.updateScoreDisplay();
    }

    // Reset UI for game start
    ui.toggleElementVisibility(dom.endMessage, false);
    ui.toggleElementVisibility(dom.setupArea, false);
    ui.toggleElementVisibility(dom.gameArea, true);
    ui.toggleElementVisibility(dom.timerDisplay, state.isTimedMode);

    // Ensure all necessary game elements are visible
    ui.toggleElementVisibility(dom.guideMessageArea, true);
    ui.toggleElementVisibility(dom.flashcard.parentElement, true);
    ui.toggleElementVisibility(dom.progressDisplay, true);
    ui.toggleElementVisibility(dom.scoreDisplay, true);
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

    if (state.isTimedMode) startTimer(); // Use exported function

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

export function recordScore(isCorrect) { /* ... (no changes) ... */
    if (!dom.correctButton || dom.correctButton.disabled) return; // Check element exists and is enabled
    console.log(`[Game] recordScore called. Correct: ${isCorrect}`);

    ui.showFeedbackIcon(isCorrect ? 'correct' : 'incorrect');
    audio.playSound(isCorrect ? 'correct' : 'incorrect');

    if (isCorrect) state.score.correct++; else state.score.incorrect++;
    storage.saveScore();
    ui.updateScoreDisplay();
    dom.flashcard?.classList.toggle('correct-answer', isCorrect); // Use optional chaining
    dom.flashcard?.classList.toggle('incorrect-answer', !isCorrect);

    dom.correctButton.disabled = true;
    dom.incorrectButton.disabled = true;
}

export function flipCard() {
    if (!dom.flashcard) return;
    console.log(`[Game] flipCard called. Card Index: ${state.currentCardIndex}. Current classList: ${dom.flashcard.className}`);
    dom.flashcard.classList.toggle('is-flipped');
    // audio.playSound('flip'); // *** TEMPORARILY DISABLED FOR DEBUGGING ***
    console.log(`[Game] flipCard AFTER toggle. Card Index: ${state.currentCardIndex}. New classList: ${dom.flashcard.className}`); // *** ADDED LOG ***

    // Ensure deck and index are valid before accessing cardData
    if (state.shuffledDeck.length === 0 || state.currentCardIndex >= state.shuffledDeck.length) return;
    const cardData = state.shuffledDeck[state.currentCardIndex];
    if (!cardData) return;

    if (dom.flashcard.classList.contains('is-flipped')) {
        dom.flashcard.setAttribute('aria-label', `Flashcard back showing answer: ${cardData.answer}.`);
        if (!state.currentCardHasBeenFlipped) {
            console.log("[Game] First flip on this card, enabling score buttons."); // Clarified log
            if(dom.correctButton) dom.correctButton.disabled = false;
            if(dom.incorrectButton) dom.incorrectButton.disabled = false;
            state.currentCardHasBeenFlipped = true;
        }
    } else {
         dom.flashcard.setAttribute('aria-label', `Flashcard front showing question: ${cardData.question}. Press space or enter to flip.`);
         ui.showFeedbackIcon('');
    }
}

export function startTimer() { /* ... (no changes) ... */
    stopTimer();
    state.timeRemaining = config.TIMER_DURATION;
    ui.toggleElementVisibility(dom.timerDisplay, true);
    ui.updateTimerDisplay();
    console.log("[Game] Timer started.");
    state.timerId = setInterval(() => {
        state.timeRemaining--;
        ui.updateTimerDisplay();
        if (state.timeRemaining <= 0) {
            console.log("[Game] Timer finished.");
            stopTimer();
            ui.showEndMessage(); // Ensure ui is accessible or imported correctly
        }
    }, 1000);
}

export function stopTimer() { /* ... (no changes) ... */
    if (state.timerId) {
        clearInterval(state.timerId);
        state.timerId = null;
        console.log("[Game] Timer stopped.");
    }
     ui.toggleElementVisibility(dom.timerDisplay, false); // Ensure ui is accessible
}

export function resetProgress() { /* ... (no changes) ... */
    if (state.shuffledDeck.length === 0) return;
    if (confirm("Reset score and reshuffle this selection from the beginning?")) {
        audio.playSound('click');
        state.score = { correct: 0, incorrect: 0 };
        storage.saveScore();
        ui.updateScoreDisplay();
        state.currentCardIndex = 0;
        shuffleArray(state.shuffledDeck); // Reshuffle
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
    ui.resetUI();
    // if (!state.isMuted && dom.backgroundMusic) dom.backgroundMusic.pause();
}

export function toggleFavorite() { /* ... (no changes) ... */
    audio.playSound('click');
    if (state.shuffledDeck.length === 0 || state.currentCardIndex >= state.shuffledDeck.length) return;
    const cardId = state.shuffledDeck[state.currentCardIndex]?.id; // Optional chaining
    if (!cardId) return;
    if (state.favoriteCardIds.has(cardId)) state.favoriteCardIds.delete(cardId);
    else state.favoriteCardIds.add(cardId);
    storage.saveFavorites();
    ui.updateFavDiffButtons(cardId);
}

export function toggleDifficult() { /* ... (no changes) ... */
    audio.playSound('click');
    if (state.shuffledDeck.length === 0 || state.currentCardIndex >= state.shuffledDeck.length) return;
    const cardId = state.shuffledDeck[state.currentCardIndex]?.id; // Optional chaining
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
         console.warn("Could not call events.handleSelectionChange from game module. Manually updating UI.");
         // Manually replicate needed UI update as fallback
         const count = countCardsForSelection(state.selectedCategory, state.selectedDifficulty);
         if (state.selectedCategory && dom.categoryInfoDiv) {
              dom.categoryInfoDiv.textContent = `Matching cards: ${count}`;
              if(dom.startTimerButton) dom.startTimerButton.disabled = count === 0;
         }
    }
}

