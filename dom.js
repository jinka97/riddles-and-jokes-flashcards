// dom.js - Caches and provides access to DOM elements

export const dom = {}; // Object to hold cached elements

export function cacheDOMElements() {
    console.log("[Cache DOM] Starting...");
    // Helper function to get element and log error if not found
    const getElement = (id) => {
        const element = document.getElementById(id);
        // if (!element) console.warn(`[Cache DOM] Element with ID "${id}" not found.`);
        return element;
    };
     const querySelector = (selector) => {
        const element = document.querySelector(selector);
        // if (!element) console.warn(`[Cache DOM] Element with selector "${selector}" not found.`);
        return element;
    };


    dom.loadingIndicator = getElement('loading-indicator');
    dom.mainContent = getElement('main-content');
    dom.categorySelect = getElement('category-select');
    dom.difficultySelect = getElement('difficulty-select');
    dom.categoryInfoDiv = getElement('category-info');
    dom.themeToggleButton = getElement('theme-toggle-button');
    dom.subscribeButton = getElement('subscribe-button');
    dom.setupArea = getElement('setup-area');
    dom.gameArea = getElement('game-area');
    dom.timerDisplay = getElement('timer-display');
    dom.timerValueSpan = dom.timerDisplay ? dom.timerDisplay.querySelector('span') : null;
    dom.startTimerButton = getElement('start-timer-button');
    dom.scoreDisplay = getElement('score-display');
    dom.flashcard = getElement('flashcard');
    dom.questionText = getElement('question-text');
    dom.answerText = getElement('answer-text');
    dom.feedbackIcon = getElement('feedback-icon');
    dom.feedbackIconBack = getElement('feedback-icon-back');
    dom.guideMessageArea = getElement('guide-message-area');
    dom.guideAvatar = getElement('guide-avatar');
    dom.guideTextDisplay = getElement('guide-text-display');
    dom.progressDisplay = getElement('progress-display');
    dom.cardActionsDiv = querySelector('.card-actions');
    dom.favoriteButton = getElement('favorite-button');
    dom.difficultButton = getElement('difficult-button');
    dom.scoreButtonsContainer = getElement('score-buttons');
    dom.correctButton = getElement('correct-button');
    dom.incorrectButton = getElement('incorrect-button');
    dom.prevCardButton = getElement('prev-card-button');
    dom.nextCardButton = getElement('next-card-button');
    dom.shuffleButton = getElement('shuffle-button');
    dom.resetProgressButton = getElement('reset-progress-button');
    dom.backToSetupButton = getElement('back-to-setup-button');
    dom.muteButton = getElement('mute-button');
    dom.sfxMuteButton = getElement('sfx-mute-button');
    dom.endMessage = getElement('end-message');
    dom.backgroundMusic = getElement('background-music');
    dom.bodyElement = document.body;
    console.log("[Cache DOM] Finished.");

    // Check for null essential elements
    if (!dom.categorySelect || !dom.flashcard || !dom.mainContent) {
         console.error("Essential DOM elements not found! Check HTML IDs.");
         if(dom.loadingIndicator) dom.loadingIndicator.innerHTML = "<p>Error: UI elements missing. Cannot start.</p>";
         return false; // Indicate failure
    }
    return true; // Indicate success
}

