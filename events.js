// events.js - Sets up event listeners and defines handlers

import { state } from './state.js';
import { dom } from './dom.js';
import { ui } from './ui.js';
import { audio } from './audio.js';
// Import specific functions needed from game.js
import {
    flipCard,
    recordScore,
    nextCard,
    previousCard,
    shuffleCurrentDeck,
    resetProgress,
    handleSubscription,
    goBackToSetup,
    toggleFavorite,
    toggleDifficult,
    startGame,
    filterDeck // Import filterDeck to calculate counts based on all filters
 } from './game.js';

// Helper function - now uses imported filterDeck
function countCardsForSelection() {
    // Uses current state directly, filterDeck applies all filters
    return filterDeck().length;
}


export const events = {
    // This function now updates state AND recalculates counts/starts game
    handleSelectionChange: () => {
        // Update state from UI elements
        state.selectedCategory = dom.categorySelect.value;
        state.selectedDifficulty = dom.difficultySelect.value;
        // Update filter states (ensure elements exist)
        const favCheckbox = document.getElementById('filter-favorites');
        const diffCheckbox = document.getElementById('filter-difficult');
        state.filterFavorites = favCheckbox ? favCheckbox.checked : false;
        state.filterDifficult = diffCheckbox ? diffCheckbox.checked : false;

        // If one filter is checked, uncheck the other (mutually exclusive)
        if (state.filterFavorites && event?.target?.id === 'filter-favorites') {
             if (diffCheckbox) diffCheckbox.checked = false;
             state.filterDifficult = false;
        } else if (state.filterDifficult && event?.target?.id === 'filter-difficult') {
             if (favCheckbox) favCheckbox.checked = false;
             state.filterFavorites = false;
        }

        // Calculate count based on ALL current filters
        const count = countCardsForSelection(); // Uses current state

        // Update UI
        if (state.selectedCategory) {
             dom.categoryInfoDiv.textContent = `Matching cards: ${count}`;
             dom.startTimerButton.disabled = count === 0;
        } else {
            dom.categoryInfoDiv.textContent = "";
            dom.startTimerButton.disabled = true;
        }

        // Auto-start untimed game if not in timed mode and valid selection
        // Only start if the change wasn't just toggling a filter checkbox
        // without a category selected, or if a category IS selected.
        const triggerElement = event?.target; // Get the element that triggered the change
        const shouldStartGame = !state.isTimedMode && state.selectedCategory && count > 0 &&
                                 (triggerElement === dom.categorySelect || triggerElement === dom.difficultySelect); // Start only on select change

        if (shouldStartGame) {
            startGame(false);
        } else if (!state.selectedCategory) {
            goBackToSetup(); // Go back if placeholder category selected
        } else if (state.selectedCategory && count === 0) {
             // If filters result in 0 cards, show message but don't go back automatically
             alert("No cards match the current category, difficulty, and filter selection.");
             // Optionally hide game area if it was visible
             // ui.toggleElementVisibility(dom.gameArea, false);
             // ui.toggleElementVisibility(dom.setupArea, true);
        }
    },
    handleKeyPress: (event) => { /* ... (no changes) ... */
        if (dom.gameArea.classList.contains('hidden') || ['SELECT', 'INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            return;
        }
         if (document.activeElement.tagName === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
             audio.playSound('click');
             return;
         }

        switch (event.key) {
            case ' ': case 'Enter':
                if (document.activeElement === dom.flashcard) { event.preventDefault(); flipCard(); }
                break;
            case 'ArrowLeft':
                if (!dom.prevCardButton.disabled) { event.preventDefault(); audio.playSound('click'); previousCard(); }
                break;
            case 'ArrowRight':
                 if (!dom.nextCardButton.disabled) { event.preventDefault(); audio.playSound('click'); nextCard(); }
                break;
            case 'c': if (!dom.correctButton.disabled) recordScore(true); break;
            case 'i': if (!dom.incorrectButton.disabled) recordScore(false); break;
             case 'f': toggleFavorite(); break;
             case 'd': toggleDifficult(); break;
             case 's': if (!dom.shuffleButton.disabled) { audio.playSound('click'); shuffleCurrentDeck(); } break;
             case 'r': if (!dom.resetProgressButton.disabled) resetProgress(); break;
             case 'm': audio.toggleMusicMute(); break;
             case 'x': audio.toggleSfxMute(); break;
        }
    },
    setupEventListeners: () => {
        console.log("[Events] Setting up listeners...");
        dom.themeToggleButton?.addEventListener('click', ui.toggleTheme);
        dom.categorySelect?.addEventListener('change', events.handleSelectionChange);
        dom.difficultySelect?.addEventListener('change', events.handleSelectionChange);
        // Timer duration select doesn't trigger game start, just updates state potentially
        const timerDurationSelect = document.getElementById('timer-duration-select');
        timerDurationSelect?.addEventListener('change', (e) => {
             state.selectedTimerDuration = parseInt(e.target.value, 10) || 60;
             console.log(`[Events] Timer duration set to: ${state.selectedTimerDuration}`);
        });
        dom.startTimerButton?.addEventListener('click', () => {
             audio.playSound('click');
             // Recalculate count just before starting timer
             const currentCount = countCardsForSelection();
             if (state.selectedCategory && currentCount > 0) {
                 startGame(true); // Pass true for timed mode
             } else {
                 alert("Please select a valid category and difficulty with matching cards first!");
             }
         });

        // Filter Checkbox Listeners
        const favCheckbox = document.getElementById('filter-favorites');
        const diffCheckbox = document.getElementById('filter-difficult');
        favCheckbox?.addEventListener('change', events.handleSelectionChange);
        diffCheckbox?.addEventListener('change', events.handleSelectionChange);


        dom.flashcard?.addEventListener('click', () => {
             console.log("[Events] Flashcard click listener fired!");
             flipCard();
        });
        dom.correctButton?.addEventListener('click', () => recordScore(true));
        dom.incorrectButton?.addEventListener('click', () => recordScore(false));
        dom.nextCardButton?.addEventListener('click', () => { audio.playSound('click'); nextCard(); });
        dom.prevCardButton?.addEventListener('click', () => { audio.playSound('click'); previousCard(); });
        dom.shuffleButton?.addEventListener('click', () => { audio.playSound('click'); shuffleCurrentDeck(); });
        dom.resetProgressButton?.addEventListener('click', resetProgress);
        dom.muteButton?.addEventListener('click', audio.toggleMusicMute);
        dom.sfxMuteButton?.addEventListener('click', audio.toggleSfxMute);
        const openModalButton = document.getElementById('open-subscribe-modal-button');
        openModalButton?.addEventListener('click', () => {
            audio.playSound('click');
            ui.openSubscriptionModal();
        });
        dom.confirmSubButton?.addEventListener('click', () => {
             handleSubscription();
             ui.closeSubscriptionModal();
        });
        dom.closeModalButton?.addEventListener('click', () => {
             audio.playSound('click');
             ui.closeSubscriptionModal();
        });
        dom.modalOverlay?.addEventListener('click', (event) => {
             if (event.target === dom.modalOverlay) {
                  audio.playSound('click');
                  ui.closeSubscriptionModal();
             }
        });
        dom.backToSetupButton?.addEventListener('click', goBackToSetup);
        dom.favoriteButton?.addEventListener('click', toggleFavorite);
        dom.difficultButton?.addEventListener('click', toggleDifficult);
        document.addEventListener('keydown', events.handleKeyPress);
        console.log("[Events] Listeners set up.");
    }
};

