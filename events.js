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
    handleSubscription, // Function that actually sets state.isSubscribed = true
    goBackToSetup,
    toggleFavorite,
    toggleDifficult,
    startGame // Needed for the timer button
 } from './game.js';

// Helper function - Duplicated here for now, consider exporting from game.js
function countCardsForSelection(category, difficulty) {
     /* global allFlashcards */
     if (typeof allFlashcards === 'undefined') return 0;
     return allFlashcards.filter(item => {
         const categoryMatch = (category === 'all') ? !item.premium : (item.category === category && (!item.premium || state.isSubscribed));
         // Use state.selectedDifficulty which is updated by handleSelectionChange
         const difficultyMatch = (difficulty === 'all') || (item.difficulty === state.selectedDifficulty);
         return categoryMatch && difficultyMatch && item.id;
     }).length;
}


export const events = {
    handleSelectionChange: () => {
        // Update state first
        state.selectedCategory = dom.categorySelect.value;
        state.selectedDifficulty = dom.difficultySelect.value;
        // Then calculate count based on updated state
        const count = countCardsForSelection(state.selectedCategory, state.selectedDifficulty);

        if (state.selectedCategory) {
             dom.categoryInfoDiv.textContent = `Matching cards: ${count}`;
             // Enable timed start button only if cards exist for selection
             dom.startTimerButton.disabled = count === 0;
        } else {
            dom.categoryInfoDiv.textContent = "";
            dom.startTimerButton.disabled = true; // Disable if no category selected
        }

        // Auto-start untimed game if not in timed mode and valid selection
        if (!state.isTimedMode && state.selectedCategory && count > 0) {
            startGame(false);
        } else if (!state.selectedCategory) {
            goBackToSetup(); // Go back to setup if placeholder selected
        }
    },
    handleKeyPress: (event) => {
        if (dom.gameArea.classList.contains('hidden') || ['SELECT', 'INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            return;
        }
         // Allow default button activation via Enter/Space if button is focused
         if (document.activeElement.tagName === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
             audio.playSound('click'); // Play sound on activation
             // Let the default action happen (triggering click)
             return;
         }

        // Handle non-button keyboard shortcuts
        switch (event.key) {
            case ' ': case 'Enter':
                // Only flip card if the card itself is focused
                if (document.activeElement === dom.flashcard) {
                    event.preventDefault(); // Prevent space scrolling page
                    flipCard();
                }
                break;
            case 'ArrowLeft':
                if (!dom.prevCardButton.disabled) {
                    event.preventDefault();
                    audio.playSound('click');
                    previousCard();
                }
                break;
            case 'ArrowRight':
                 if (!dom.nextCardButton.disabled) {
                    event.preventDefault();
                    audio.playSound('click');
                    nextCard();
                 }
                break;
            case 'c': if (!dom.correctButton.disabled) recordScore(true); break;
            case 'i': if (!dom.incorrectButton.disabled) recordScore(false); break;
             case 'f': toggleFavorite(); break;
             case 'd': toggleDifficult(); break;
             case 's': if (!dom.shuffleButton.disabled) { audio.playSound('click'); shuffleCurrentDeck(); } break;
             case 'r': if (!dom.resetProgressButton.disabled) resetProgress(); break; // Sound played inside on confirm
             case 'm': audio.toggleMusicMute(); break;
             case 'x': audio.toggleSfxMute(); break;
        }
    },
    setupEventListeners: () => {
        console.log("[Events] Setting up listeners...");
        dom.themeToggleButton?.addEventListener('click', ui.toggleTheme);
        dom.categorySelect?.addEventListener('change', events.handleSelectionChange);
        dom.difficultySelect?.addEventListener('change', events.handleSelectionChange);
        dom.startTimerButton?.addEventListener('click', () => {
             audio.playSound('click');
             if (state.selectedCategory && countCardsForSelection(state.selectedCategory, state.selectedDifficulty) > 0) {
                 startGame(true);
             } else {
                 alert("Please select a valid category and difficulty first!");
             }
         });
        // Add log inside listener callback for flashcard click
        dom.flashcard?.addEventListener('click', () => {
             console.log("[Events] Flashcard click listener fired!"); // *** Log to check listener ***
             flipCard(); // Call the imported function
        });
        dom.correctButton?.addEventListener('click', () => recordScore(true));
        dom.incorrectButton?.addEventListener('click', () => recordScore(false));
        dom.nextCardButton?.addEventListener('click', () => { audio.playSound('click'); nextCard(); });
        dom.prevCardButton?.addEventListener('click', () => { audio.playSound('click'); previousCard(); });
        dom.shuffleButton?.addEventListener('click', () => { audio.playSound('click'); shuffleCurrentDeck(); });
        dom.resetProgressButton?.addEventListener('click', resetProgress);
        dom.muteButton?.addEventListener('click', audio.toggleMusicMute);
        dom.sfxMuteButton?.addEventListener('click', audio.toggleSfxMute);
        // Use correct button ID from HTML
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

