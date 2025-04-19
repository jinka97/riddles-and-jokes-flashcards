// ui.js - Manages UI updates and interactions

import { state } from './state.js';
import { dom } from './dom.js';
import { config } from './config.js';
// Import game functions needed by UI
import { stopTimer } from './game.js';

// Make sure allFlashcards is accessible
/* global allFlashcards */

export const ui = {
    applyTheme: () => { /* ... (no changes) ... */
        if (!dom.bodyElement) return;
        dom.bodyElement.classList.remove('dark-theme');
        if (state.currentTheme === 'dark') {
            dom.bodyElement.classList.add('dark-theme');
        }
    },
    toggleTheme: () => { /* ... (no changes) ... */
        state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        ui.applyTheme();
        storage.saveTheme();
    },
    updateScoreDisplay: () => {
        // Display score dynamically during timed mode, otherwise just final score
        let scoreText = `Score: ${state.score.correct}`;
        // if (state.isTimedMode) { // Decided against showing incorrect during timed mode for simplicity
        //     scoreText += ` / ${state.score.correct + state.score.incorrect} attempted`;
        // }
        if(dom.scoreDisplay) dom.scoreDisplay.textContent = scoreText;
    },
    updateTimerDisplay: () => { /* ... (no changes) ... */
        if(dom.timerValueSpan) {
            const minutes = Math.floor(state.timeRemaining / 60);
            const seconds = state.timeRemaining % 60;
            dom.timerValueSpan.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    },
    updateProgressDisplay: () => { /* ... (no changes) ... */
        if(dom.progressDisplay && state.shuffledDeck.length > 0) {
             dom.progressDisplay.textContent = `Card ${state.currentCardIndex + 1} of ${state.shuffledDeck.length}`;
        } else if (dom.progressDisplay) {
             dom.progressDisplay.textContent = 'Card 0 of 0';
        }
    },
    updateMusicMuteButton: () => { /* ... (no changes) ... */
        if(dom.muteButton) {
            dom.muteButton.textContent = state.isMuted ? 'Unmute Music' : 'Mute Music';
            dom.muteButton.classList.toggle('muted', state.isMuted);
        }
    },
    updateSfxButton: (error = false) => { /* ... (no changes) ... */
         if(dom.sfxMuteButton) {
             if (error || !state.soundsReady) {
                  dom.sfxMuteButton.disabled = true;
                  dom.sfxMuteButton.textContent = "SFX N/A";
                  dom.sfxMuteButton.classList.remove('muted');
             } else {
                  dom.sfxMuteButton.disabled = false;
                  dom.sfxMuteButton.textContent = state.sfxMuted ? 'Unmute SFX' : 'Mute SFX';
                  dom.sfxMuteButton.classList.toggle('muted', state.sfxMuted);
             }
         }
    },
    updateFavDiffButtons: (cardId) => { /* ... (no changes) ... */
        if (dom.favoriteButton && dom.difficultButton && cardId) {
             const isFav = state.favoriteCardIds.has(cardId);
             const isDiff = state.difficultCardIds.has(cardId);
             dom.favoriteButton.classList.toggle('active', isFav);
             dom.favoriteButton.setAttribute('aria-pressed', isFav);
             dom.difficultButton.classList.toggle('active', isDiff);
             dom.difficultButton.setAttribute('aria-pressed', isDiff);
        }
    },
    updateCardDisplay: () => {
        // console.log(`[UI] updateCardDisplay START. Index: ${state.currentCardIndex}`);
        if (!dom.flashcard) { console.error("[UI] Flashcard element not found!"); return; }

        dom.flashcard.classList.remove('correct-answer', 'incorrect-answer', 'is-flipped', 'animate-in');
        void dom.flashcard.offsetWidth;
        dom.flashcard.classList.add('animate-in');
        state.currentCardHasBeenFlipped = false;
        ui.showFeedbackIcon('');

        if (state.currentCardIndex < state.shuffledDeck.length && state.currentCardIndex >= 0) {
            const cardData = state.shuffledDeck[state.currentCardIndex];
            const cardId = cardData?.id;
            if (!cardId) { console.error("[UI] Card data missing ID!", cardData); return; }
            // console.log(`[UI] Rendering Card ID: ${cardId}, Question: ${cardData.question.substring(0,20)}...`);

            // Update Text Content
            dom.questionText.textContent = cardData.question;
            dom.answerText.textContent = cardData.answer;
            dom.flashcard.setAttribute('aria-label', `Flashcard front showing question: ${cardData.question}. Press space or enter to flip.`);

            // Update Guide
            dom.guideTextDisplay.textContent = cardData.guide || '';
            if (cardData.guide?.toLowerCase().startsWith('bolt:')) dom.guideAvatar.src = config.ASSET_PATHS.bolt;
            else if (cardData.guide?.toLowerCase().startsWith('chatty:')) dom.guideAvatar.src = config.ASSET_PATHS.chatty;
            else dom.guideAvatar.src = config.ASSET_PATHS.defaultAvatar;

            // ** Update Difficulty Display **
            const difficultyElements = document.querySelectorAll('.difficulty-display'); // Get both front and back
            difficultyElements.forEach(el => {
                if (cardData.difficulty) {
                    el.textContent = cardData.difficulty;
                    el.className = 'difficulty-display'; // Reset classes
                    el.classList.add(`difficulty-${cardData.difficulty}`); // Add specific class
                    el.setAttribute('aria-label', `Difficulty: ${cardData.difficulty}`);
                    ui.toggleElementVisibility(el, true);
                } else {
                    ui.toggleElementVisibility(el, false); // Hide if no difficulty set
                }
            });

            // Update Progress & Buttons
            ui.updateProgressDisplay();
            ui.updateFavDiffButtons(cardId);

            dom.correctButton.disabled = true;
            dom.incorrectButton.disabled = true;
            dom.prevCardButton.disabled = state.currentCardIndex === 0;
            dom.nextCardButton.disabled = state.currentCardIndex >= state.shuffledDeck.length - 1;

            // Ensure visibility
            ui.toggleElementVisibility(dom.guideMessageArea, true);
            ui.toggleElementVisibility(dom.flashcard.parentElement, true);
            ui.toggleElementVisibility(dom.progressDisplay, true);
            ui.toggleElementVisibility(dom.scoreDisplay, true);
            ui.toggleElementVisibility(dom.scoreButtonsContainer, true);
            ui.toggleElementVisibility(dom.cardActionsDiv, true);
            ui.toggleElementVisibility(dom.prevCardButton, true);
            ui.toggleElementVisibility(dom.nextCardButton, true);
            // console.log(`[UI] updateCardDisplay END. Index: ${state.currentCardIndex}`);

        } else {
            console.error("[UI] Index out of bounds in updateCardDisplay:", state.currentCardIndex);
            ui.showEndMessage();
        }
    },
    showEndMessage: () => { /* ... (no changes other than stopTimer import) ... */
        stopTimer(); // Use imported function
        console.log("[UI] showEndMessage called.");
        ui.toggleElementVisibility(dom.guideMessageArea, false);
        ui.toggleElementVisibility(dom.flashcard.parentElement, false);
        ui.toggleElementVisibility(dom.progressDisplay, false);
        ui.toggleElementVisibility(dom.scoreDisplay, false);
        ui.toggleElementVisibility(dom.scoreButtonsContainer, false);
        ui.toggleElementVisibility(dom.cardActionsDiv, false);
        ui.toggleElementVisibility(dom.prevCardButton, false);
        ui.toggleElementVisibility(dom.nextCardButton, false);
        ui.toggleElementVisibility(dom.timerDisplay, false); // Ensure timer hidden

        let message = `Deck finished! Final Score: ${state.score.correct}.`;
        if (state.isTimedMode) {
            message = `Time's up! Final Score: ${state.score.correct}.`;
        }
        message += " Choose another category/difficulty or shuffle again!";

        dom.endMessage.textContent = message;
        ui.toggleElementVisibility(dom.endMessage, true);
        // Ensure relevant bottom controls are visible
        ui.toggleElementVisibility(dom.shuffleButton, true);
        ui.toggleElementVisibility(dom.resetProgressButton, true);
        ui.toggleElementVisibility(dom.backToSetupButton, true);
        ui.toggleElementVisibility(dom.muteButton, true);
        ui.toggleElementVisibility(dom.sfxMuteButton, true);

        state.isTimedMode = false; // Reset timed mode flag
    },
    populateCategories: () => { /* ... (no changes) ... */
        if (!dom.categorySelect || typeof allFlashcards === 'undefined') return;
        const categories = [...new Set(allFlashcards.map(item => item.category))];
        dom.categorySelect.innerHTML = '<option value="">-- Select --</option>';
        state.categoryCardCounts = {};
        let allFreeCount = 0;

        allFlashcards.forEach(item => { if (!item.premium) allFreeCount++; });
        state.categoryCardCounts['all'] = allFreeCount;
        const allOption = document.createElement('option');
        allOption.value = "all";
        allOption.textContent = `All (Free) (${allFreeCount} cards)`;
        if (allFreeCount === 0) allOption.disabled = true;
        dom.categorySelect.appendChild(allOption);

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            let count = 0;
            let isPremiumCategory = false;
            allFlashcards.forEach(item => {
                if (item.category === category) {
                    count++;
                    if (item.premium) isPremiumCategory = true;
                }
            });
            state.categoryCardCounts[category] = count;
            option.textContent = `${category} (${count} cards)`;
            if (isPremiumCategory) {
                option.textContent += ' (Premium)';
                option.classList.add('premium-category');
                if (!state.isSubscribed) option.disabled = true;
            }
            dom.categorySelect.appendChild(option);
        });
    },
    showFeedbackIcon: (type) => { /* ... (no changes) ... */
         const iconChar = type === 'correct' ? '✔' : type === 'incorrect' ? '❌' : '';
         if(dom.feedbackIcon) dom.feedbackIcon.textContent = iconChar;
         if(dom.feedbackIconBack) dom.feedbackIconBack.textContent = iconChar;
         dom.flashcard?.classList.toggle('show-feedback-correct', type === 'correct');
         dom.flashcard?.classList.toggle('show-feedback-incorrect', type === 'incorrect');
    },
    toggleElementVisibility: (element, show) => { /* ... (no changes) ... */
        if (element) {
            element.classList.toggle('hidden', !show);
        }
    },
    resetUI: () => {
        ui.toggleElementVisibility(dom.gameArea, false);
        ui.toggleElementVisibility(dom.endMessage, false);
        ui.toggleElementVisibility(dom.setupArea, true);
        if(dom.categorySelect) dom.categorySelect.value = "";
        if(dom.difficultySelect) dom.difficultySelect.value = "all";
        if(dom.categoryInfoDiv) dom.categoryInfoDiv.textContent = "";
        ui.toggleElementVisibility(dom.timerDisplay, false);
        // ** Reset filter checkboxes **
        const favCheckbox = document.getElementById('filter-favorites');
        const diffCheckbox = document.getElementById('filter-difficult');
        if (favCheckbox) favCheckbox.checked = false;
        if (diffCheckbox) diffCheckbox.checked = false;
    },
    updateSubscriptionUI: () => { /* ... (no changes) ... */
         const openSubButton = document.getElementById('open-subscribe-modal-button');
         const freemiumPrompt = document.getElementById('freemium-prompt');
         if (state.isSubscribed) {
            ui.toggleElementVisibility(freemiumPrompt, false);
        } else if (freemiumPrompt) {
             ui.toggleElementVisibility(freemiumPrompt, true);
             if(openSubButton) openSubButton.disabled = false;
        }
        ui.populateCategories();
    },
    openSubscriptionModal: () => { /* ... (no changes) ... */
        const modal = dom.modalOverlay;
        if (modal) {
            ui.toggleElementVisibility(modal, true);
            modal.querySelector('button')?.focus();
        }
    },
    closeSubscriptionModal: () => { /* ... (no changes) ... */
         const modal = dom.modalOverlay;
         if (modal) {
            ui.toggleElementVisibility(modal, false);
         }
    }
};

// Need to import storage for saveTheme
import { storage } from './storage.js';

