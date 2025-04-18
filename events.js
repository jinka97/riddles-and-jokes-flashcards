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
    handleSubscription, // Keep for now, though its own dependency is tricky
    goBackToSetup,
    toggleFavorite,
    toggleDifficult,
    startGame // Needed for the timer button
 } from './game.js';
 // Import countCardsForSelection if it's defined in game.js or elsewhere
 // For now, assume it's globally available or defined within handleSelectionChange if needed
 // Or import it if game.js exports it: import { countCardsForSelection } from './game.js';

// Helper function (if not imported) - recalculate here or import from game.js
// Duplicating this logic isn't ideal, better to export from game.js if possible
// But for now, let's keep it here to ensure events.js works standalone
function countCardsForSelection(category, difficulty) {
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


export const events = {
    handleSelectionChange: () => {
        state.selectedCategory = dom.categorySelect.value;
        state.selectedDifficulty = dom.difficultySelect.value;
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
            // Call imported function directly
            startGame(false);
        } else if (!state.selectedCategory) {
            // Call imported function directly
            goBackToSetup(); // Go back to setup if placeholder selected
        }
    },
    handleKeyPress: (event) => {
        if (dom.gameArea.classList.contains('hidden') || ['SELECT', 'INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            return;
        }
         if (document.activeElement.tagName === 'BUTTON' && (event.key === 'Enter' || event.key === ' ')) {
             audio.playSound('click');
             return; // Allow default button activation
         }

        switch (event.key) {
            case ' ': case 'Enter':
                // Call imported function directly
                if (document.activeElement === dom.flashcard) { event.preventDefault(); flipCard(); }
                break;
            case 'ArrowLeft':
                // Call imported function directly
                if (!dom.prevCardButton.disabled) { event.preventDefault(); audio.playSound('click'); previousCard(); }
                break;
            case 'ArrowRight':
                 // Call imported function directly
                 if (!dom.nextCardButton.disabled) { event.preventDefault(); audio.playSound('click'); nextCard(); }
                break;
            case 'c': if (!dom.correctButton.disabled) recordScore(true); break; // Call imported function
            case 'i': if (!dom.incorrectButton.disabled) recordScore(false); break; // Call imported function
             case 'f': toggleFavorite(); break; // Call imported function
             case 'd': toggleDifficult(); break; // Call imported function
             case 's': if (!dom.shuffleButton.disabled) { audio.playSound('click'); shuffleCurrentDeck(); } break; // Call imported function
             case 'r': if (!dom.resetProgressButton.disabled) resetProgress(); break; // Call imported function
             case 'm': audio.toggleMusicMute(); break; // Call function from imported audio object
             case 'x': audio.toggleSfxMute(); break; // Call function from imported audio object
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
                 // Call imported function directly
                 startGame(true);
             } else {
                 alert("Please select a valid category and difficulty first!");
             }
         });
        // Use imported functions directly
        dom.flashcard?.addEventListener('click', flipCard);
        dom.correctButton?.addEventListener('click', () => recordScore(true));
        dom.incorrectButton?.addEventListener('click', () => recordScore(false));
        dom.nextCardButton?.addEventListener('click', () => { audio.playSound('click'); nextCard(); });
        dom.prevCardButton?.addEventListener('click', () => { audio.playSound('click'); previousCard(); });
        dom.shuffleButton?.addEventListener('click', () => { audio.playSound('click'); shuffleCurrentDeck(); });
        dom.resetProgressButton?.addEventListener('click', resetProgress); // Sound played inside on confirm
        dom.muteButton?.addEventListener('click', audio.toggleMusicMute);
        dom.sfxMuteButton?.addEventListener('click', audio.toggleSfxMute);
        dom.subscribeButton?.addEventListener('click', handleSubscription); // Call imported function
        dom.backToSetupButton?.addEventListener('click', goBackToSetup); // Call imported function
        dom.favoriteButton?.addEventListener('click', toggleFavorite); // Call imported function
        dom.difficultButton?.addEventListener('click', toggleDifficult); // Call imported function
        document.addEventListener('keydown', events.handleKeyPress);
        console.log("[Events] Listeners set up.");
    }
};

