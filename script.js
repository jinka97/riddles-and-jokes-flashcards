document.addEventListener('DOMContentLoaded', () => {

    // --- Data ---
    if (typeof allFlashcards === 'undefined' || allFlashcards.length === 0) {
        console.error("Error: Flashcard data (allFlashcards) not found or empty.");
        const loader = document.getElementById('loading-indicator');
        if(loader) loader.innerHTML = "<p>Error loading flashcard data!</p>";
        return;
    }
    // Ensure all cards have a unique ID - vital for fav/diff tracking
    allFlashcards.forEach((card, index) => {
        if (!card.id) {
            console.warn(`Card at index ${index} missing ID. Assigning temporary ID.`);
            card.id = `card-${index}-${Date.now()}`; // Simple unique ID generation
        }
         // Ensure difficulty exists, default to 'medium' if missing
        if (!card.difficulty) {
            card.difficulty = 'medium';
        }
    });


    // --- State Variables ---
    let currentCardIndex = 0;
    let shuffledDeck = [];
    let score = { correct: 0, incorrect: 0 };
    let isSubscribed = false;
    let selectedCategory = "";
    let selectedDifficulty = "all"; // Default difficulty
    let categoryCardCounts = {};
    let isMuted = false;
    let sfxMuted = false; // Separate mute for SFX
    let currentTheme = 'light';
    // Favorite & Difficult Tracking (using Sets for efficient add/delete/check)
    let favoriteCardIds = new Set();
    let difficultCardIds = new Set();
    // Timed Mode State
    let isTimedMode = false;
    let timerId = null;
    let timeRemaining = 60; // Default timer duration (seconds)
    const TIMER_DURATION = 60; // Configurable timer duration

    // --- DOM Element References ---
    const loadingIndicator = document.getElementById('loading-indicator');
    const mainContent = document.getElementById('main-content');
    const categorySelect = document.getElementById('category-select');
    const difficultySelect = document.getElementById('difficulty-select'); // New difficulty dropdown
    const categoryInfoDiv = document.getElementById('category-info');
    const themeToggleButton = document.getElementById('theme-toggle-button');
    const subscribeButton = document.getElementById('subscribe-button');
    const setupArea = document.getElementById('setup-area');
    const gameArea = document.getElementById('game-area');
    const timerDisplay = document.getElementById('timer-display'); // Timer display element
    const startTimerButton = document.getElementById('start-timer-button'); // Start timer button
    const scoreDisplay = document.getElementById('score-display');
    const flashcard = document.getElementById('flashcard');
    const questionText = document.getElementById('question-text');
    const answerText = document.getElementById('answer-text');
    const feedbackIcon = document.getElementById('feedback-icon'); // Icon on front
    const feedbackIconBack = document.getElementById('feedback-icon-back'); // Icon on back
    const guideMessageArea = document.getElementById('guide-message-area');
    const guideAvatar = document.getElementById('guide-avatar');
    const guideTextDisplay = document.getElementById('guide-text-display');
    const progressDisplay = document.getElementById('progress-display');
    const cardActionsDiv = document.querySelector('.card-actions'); // Container for fav/diff buttons
    const favoriteButton = document.getElementById('favorite-button'); // Favorite button
    const difficultButton = document.getElementById('difficult-button'); // Difficult button
    const scoreButtonsContainer = document.getElementById('score-buttons');
    const correctButton = document.getElementById('correct-button');
    const incorrectButton = document.getElementById('incorrect-button');
    const prevCardButton = document.getElementById('prev-card-button');
    const nextCardButton = document.getElementById('next-card-button');
    const shuffleButton = document.getElementById('shuffle-button');
    const resetProgressButton = document.getElementById('reset-progress-button');
    const backToSetupButton = document.getElementById('back-to-setup-button');
    const muteButton = document.getElementById('mute-button');
    const sfxMuteButton = document.getElementById('sfx-mute-button'); // SFX Mute button
    const endMessage = document.getElementById('end-message');
    const backgroundMusic = document.getElementById('background-music');
    const bodyElement = document.body;

    // --- Asset Paths ---
    const boltAvatarSrc = 'assets/bolt.png';
    const chattyAvatarSrc = 'assets/chatty.png';
    const defaultAvatarSrc = 'https://placehold.co/30x30/CCCCCC/444?text=?';

    // --- Tone.js Sound Effects Setup ---
    let synth, correctSound, incorrectSound, flipSound, clickSound;
    // Initialize sounds after user interaction potentially (or on load)
    function initSounds() {
        if (typeof Tone !== 'undefined' && !synth) {
             try {
                synth = new Tone.Synth().toDestination();
                correctSound = () => { if (!sfxMuted && synth) synth.triggerAttackRelease("C5", "8n", Tone.now()); };
                incorrectSound = () => { if (!sfxMuted && synth) synth.triggerAttackRelease("C4", "8n", Tone.now()); }; // Lower pitch
                flipSound = () => { if (!sfxMuted && synth) synth.triggerAttackRelease("E4", "16n", Tone.now() + 0.01); }; // Quick flip sound
                clickSound = () => { if (!sfxMuted && synth) synth.triggerAttackRelease("C4", "16n", Tone.now() + 0.01); }; // Button click sound
                console.log("Tone.js sounds initialized.");
             } catch (error) {
                  console.error("Could not initialize Tone.js sounds:", error);
                  // Disable SFX features if Tone.js fails
                  correctSound = incorrectSound = flipSound = clickSound = () => {};
                  sfxMuteButton.disabled = true;
                  sfxMuteButton.textContent = "SFX N/A";
             }
        } else if (!synth) {
             // Tone.js not loaded
             console.warn("Tone.js not loaded. Sound effects disabled.");
             correctSound = incorrectSound = flipSound = clickSound = () => {};
             sfxMuteButton.disabled = true;
             sfxMuteButton.textContent = "SFX N/A";
        }
    }
    // Attempt to initialize sounds immediately, might need user interaction context later if blocked
    initSounds();


    // --- Core Functions ---

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

    function applyTheme(theme) { /* ... (no changes) ... */
        bodyElement.classList.remove('dark-theme');
        if (theme === 'dark') {
            bodyElement.classList.add('dark-theme');
        }
        currentTheme = theme;
        localStorage.setItem('flashcardTheme', theme);
    }

    function toggleTheme() { /* ... (no changes) ... */
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        clickSound(); // Play click sound
    }

    /**
     * Loads preferences including score, subscription, mutes, theme, favorites, difficults.
     */
    function loadPreferences() {
        // Score
        const savedScore = localStorage.getItem('riddleScore');
        score = savedScore ? JSON.parse(savedScore) : { correct: 0, incorrect: 0 };
        // Subscription
        const savedSubscription = localStorage.getItem('riddleSubscription');
        isSubscribed = savedSubscription === 'true';
        if (isSubscribed) {
            subscribeButton.textContent = 'Premium Unlocked!';
            subscribeButton.disabled = true;
        }
        // Mutes
        const savedMute = localStorage.getItem('riddleMuted');
        isMuted = savedMute === 'true';
        backgroundMusic.muted = isMuted;
        muteButton.textContent = isMuted ? 'Unmute Music' : 'Mute Music';
        muteButton.classList.toggle('muted', isMuted);

        const savedSfxMute = localStorage.getItem('riddleSfxMuted');
        sfxMuted = savedSfxMute === 'true';
        sfxMuteButton.textContent = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
        sfxMuteButton.classList.toggle('muted', sfxMuted);

        // Theme
        const savedTheme = localStorage.getItem('flashcardTheme') || 'light';
        applyTheme(savedTheme);

         // Favorites & Difficults
        const savedFavorites = localStorage.getItem('favoriteCardIds');
        favoriteCardIds = savedFavorites ? new Set(JSON.parse(savedFavorites)) : new Set();
        const savedDifficults = localStorage.getItem('difficultCardIds');
        difficultCardIds = savedDifficults ? new Set(JSON.parse(savedDifficults)) : new Set();

        updateScoreDisplay();
    }

    /**
     * Populates category dropdown, adds "All (Free)", calculates counts.
     */
    function populateCategories() {
        const categories = [...new Set(allFlashcards.map(item => item.category))];
        categorySelect.innerHTML = '<option value="">-- Select --</option>'; // Shortened placeholder
        categoryCardCounts = {};
        let allFreeCount = 0;

        // Add "All (Free)" option
        allFlashcards.forEach(item => { if (!item.premium) allFreeCount++; });
        categoryCardCounts['all'] = allFreeCount;
        const allOption = document.createElement('option');
        allOption.value = "all";
        allOption.textContent = `All (Free) (${allFreeCount} cards)`;
        if (allFreeCount === 0) allOption.disabled = true;
        categorySelect.appendChild(allOption);

        // Add specific category options
        categories.forEach(category => { /* ... (no changes to loop logic) ... */
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
            categoryCardCounts[category] = count; // Store count for specific category

            option.textContent = `${category} (${count} cards)`;
            if (isPremiumCategory) {
                option.textContent += ' (Premium)';
                option.classList.add('premium-category');
                if (!isSubscribed) {
                    option.disabled = true;
                }
            }
            categorySelect.appendChild(option);
        });
    }

    /**
     * Handles category OR difficulty selection change. Starts game if untimed mode.
     */
    function handleSelectionChange() {
        selectedCategory = categorySelect.value;
        selectedDifficulty = difficultySelect.value;

        // Calculate and display count for current selection
        let currentSelectionCount = 0;
        if (selectedCategory) {
             currentSelectionCount = countCardsForSelection(selectedCategory, selectedDifficulty);
             categoryInfoDiv.textContent = `Matching cards: ${currentSelectionCount}`;
        } else {
            categoryInfoDiv.textContent = ""; // Clear if no category selected
        }


        // If NOT in timed mode, and a valid category is selected, start untimed game
        // (Timed mode started separately by its button)
        if (!isTimedMode && selectedCategory && currentSelectionCount > 0) {
            startGame(false); // Start untimed game
        } else if (!selectedCategory) {
             // If user selects "-- Select --", hide game area
            gameArea.classList.add('hidden');
            setupArea.classList.remove('hidden');
            stopTimer(); // Ensure timer stops if running
        }
    }

    /**
     * Helper to count cards matching current category and difficulty filters.
     */
     function countCardsForSelection(category, difficulty) {
         return allFlashcards.filter(item => {
             const categoryMatch = (category === 'all') ? !item.premium : (item.category === category && (!item.premium || isSubscribed));
             const difficultyMatch = (difficulty === 'all') || (item.difficulty === difficulty);
             return categoryMatch && difficultyMatch;
         }).length;
     }

    function updateScoreDisplay() {
        scoreDisplay.textContent = `Score: ${score.correct}`;
    }

    /**
     * Filters deck based on selections, shuffles, starts UI for timed or untimed mode.
     * @param {boolean} timed - Indicates if this is a timed game start.
     */
    function startGame(timed = false) {
        isTimedMode = timed; // Set mode state
        stopTimer(); // Stop any existing timer

        // Filter deck based on category AND difficulty
        shuffledDeck = allFlashcards.filter(item => {
            const categoryMatch = (selectedCategory === 'all') ? !item.premium : (item.category === selectedCategory && (!item.premium || isSubscribed));
            const difficultyMatch = (selectedDifficulty === 'all') || (item.difficulty === selectedDifficulty);
            return categoryMatch && difficultyMatch;
        });

        if (shuffledDeck.length === 0) {
             alert('No cards available for this selection.');
             goBackToSetup();
             return;
        }

        console.log(`Starting game. Category: ${selectedCategory}, Difficulty: ${selectedDifficulty}, Timed: ${isTimedMode}, Deck size: ${shuffledDeck.length}`);
        shuffleArray(shuffledDeck);
        currentCardIndex = 0;
        // Reset score only if starting a new timed game, otherwise keep cumulative
        if (isTimedMode) {
            score = { correct: 0, incorrect: 0 };
            updateScoreDisplay();
        }

        // Reset UI
        endMessage.classList.add('hidden');
        setupArea.classList.add('hidden');
        gameArea.classList.remove('hidden');
        timerDisplay.classList.add('hidden'); // Hide timer initially

        // Show/Hide relevant elements
        guideMessageArea.classList.remove('hidden');
        flashcard.parentElement.classList.remove('hidden');
        progressDisplay.classList.remove('hidden');
        scoreDisplay.classList.remove('hidden');
        scoreButtonsContainer.classList.remove('hidden');
        cardActionsDiv.classList.remove('hidden'); // Show fav/diff buttons
        // Show bottom controls
        shuffleButton.classList.remove('hidden');
        resetProgressButton.classList.remove('hidden');
        backToSetupButton.classList.remove('hidden');
        muteButton.classList.remove('hidden');
        sfxMuteButton.classList.remove('hidden');
        prevCardButton.classList.remove('hidden');
        nextCardButton.classList.remove('hidden');


        displayCard(); // Display the first card

        // Start timer if timed mode
        if (isTimedMode) {
            startTimer();
        }

        // Play music if not muted
        if (!isMuted && backgroundMusic.paused) {
           backgroundMusic.play().catch(e => console.warn("Audio autoplay prevented:", e));
        }
    }

    /**
     * Displays the current card, guide, progress, fav/diff status, and sets button states.
     */
    function displayCard() {
        console.log(`Displaying card at index: ${currentCardIndex}`);
        flashcard.classList.remove('correct-answer', 'incorrect-answer', 'is-flipped', 'animate-in');
        void flashcard.offsetWidth; // Trigger reflow for animation restart
        flashcard.classList.add('animate-in'); // Add animation class
        currentCardHasBeenFlipped = false;
        feedbackIcon.textContent = ''; // Clear feedback icons
        feedbackIconBack.textContent = '';

        if (currentCardIndex < shuffledDeck.length && currentCardIndex >= 0) {
            const cardData = shuffledDeck[currentCardIndex];
            const cardId = cardData.id; // Get unique ID

            questionText.textContent = cardData.question;
            answerText.textContent = cardData.answer;
            flashcard.setAttribute('aria-label', `Flashcard front showing question: ${cardData.question}. Press space or enter to flip.`);


            // Update Guide Message
            guideTextDisplay.textContent = cardData.guide || '';
            if (cardData.guide?.toLowerCase().startsWith('bolt:')) guideAvatar.src = boltAvatarSrc;
            else if (cardData.guide?.toLowerCase().startsWith('chatty:')) guideAvatar.src = chattyAvatarSrc;
            else guideAvatar.src = defaultAvatarSrc;

            // Update Progress Display
            progressDisplay.textContent = `Card ${currentCardIndex + 1} of ${shuffledDeck.length}`;

            // Update Favorite/Difficult Button State
            favoriteButton.classList.toggle('active', favoriteCardIds.has(cardId));
            favoriteButton.setAttribute('aria-pressed', favoriteCardIds.has(cardId));
            difficultButton.classList.toggle('active', difficultCardIds.has(cardId));
            difficultButton.setAttribute('aria-pressed', difficultCardIds.has(cardId));

            // Button States for new card
            correctButton.disabled = true;
            incorrectButton.disabled = true;
            prevCardButton.disabled = currentCardIndex === 0;
            nextCardButton.disabled = currentCardIndex >= shuffledDeck.length - 1;

        } else {
            console.error("Index out of bounds in displayCard:", currentCardIndex);
            showEndMessage();
        }
    }

    /**
     * Shows end message, potentially including timed results.
     */
    function showEndMessage() {
        stopTimer(); // Ensure timer is stopped
        console.log("showEndMessage called.");
        guideMessageArea.classList.add('hidden');
        flashcard.parentElement.classList.add('hidden');
        progressDisplay.classList.add('hidden');
        scoreDisplay.classList.add('hidden');
        scoreButtonsContainer.classList.add('hidden');
        cardActionsDiv.classList.add('hidden'); // Hide fav/diff buttons
        prevCardButton.classList.add('hidden');
        nextCardButton.classList.add('hidden');

        let message = `Deck finished! Final Score: ${score.correct}.`;
        if (isTimedMode) {
            message = `Time's up! Final Score: ${score.correct}.`;
        }
        message += " Choose another category/difficulty or shuffle again!";

        endMessage.textContent = message;
        endMessage.classList.remove('hidden');
        // Ensure relevant bottom controls are visible
        shuffleButton.classList.remove('hidden');
        resetProgressButton.classList.remove('hidden');
        backToSetupButton.classList.remove('hidden');
        muteButton.classList.remove('hidden');
        sfxMuteButton.classList.remove('hidden');
        // Reset timed mode flag
        isTimedMode = false;
    }

    /**
     * Toggles card flip, plays sound, enables scoring on first flip.
     */
    function flipCard() {
        flashcard.classList.toggle('is-flipped');
        flipSound(); // Play flip sound
        if (flashcard.classList.contains('is-flipped')) {
            flashcard.setAttribute('aria-label', `Flashcard back showing answer: ${answerText.textContent}.`);
            // Enable scoring buttons only the first time flipped to answer side
            if (!currentCardHasBeenFlipped) {
                 console.log("First flip detected, enabling score buttons.");
                 correctButton.disabled = false;
                 incorrectButton.disabled = false;
                 currentCardHasBeenFlipped = true;
            }
        } else {
             flashcard.setAttribute('aria-label', `Flashcard front showing question: ${questionText.textContent}. Press space or enter to flip.`);
        }
    }

    /**
     * Records score, plays sound, shows feedback icon, disables score buttons.
     */
    function recordScore(isCorrect) {
        if (correctButton.disabled) return;
        console.log(`recordScore called. isCorrect: ${isCorrect}`);

        // Clear previous feedback icon immediately
        feedbackIcon.textContent = '';
        feedbackIconBack.textContent = '';

        if (isCorrect) {
            score.correct++;
            flashcard.classList.add('correct-answer');
            flashcard.classList.remove('incorrect-answer');
            feedbackIcon.textContent = '✔'; // Show checkmark
            feedbackIconBack.textContent = '✔';
            correctSound(); // Play correct sound
        } else {
            score.incorrect++;
            flashcard.classList.add('incorrect-answer');
            flashcard.classList.remove('correct-answer');
            feedbackIcon.textContent = '❌'; // Show X mark
            feedbackIconBack.textContent = '❌';
            incorrectSound(); // Play incorrect sound
        }
        localStorage.setItem('riddleScore', JSON.stringify(score));
        updateScoreDisplay();

        correctButton.disabled = true;
        incorrectButton.disabled = true;
        // Next button state is handled by displayCard and remains unchanged here
    }

    /**
     * Moves to the next card or shows end message.
     */
    function nextCard() {
        console.log(`nextCard called. Current index: ${currentCardIndex}`);
        if (currentCardIndex < shuffledDeck.length - 1) {
            currentCardIndex++;
            displayCard();
        } else {
             console.log("Attempted next on last card. Showing end message.");
             showEndMessage();
        }
    }

    /**
     * Moves to the previous card.
     */
    function previousCard() {
        console.log(`previousCard called. Current index: ${currentCardIndex}`);
        if (currentCardIndex > 0) {
            currentCardIndex--;
            displayCard();
        }
    }

    /**
     * Resets score, returns to first card of current deck (reshuffled).
     */
    function resetProgress() {
        if (shuffledDeck.length === 0) return;
        if (confirm("Reset score and return to the first card of this selection?")) {
            score = { correct: 0, incorrect: 0 };
            localStorage.setItem('riddleScore', JSON.stringify(score));
            updateScoreDisplay();
            currentCardIndex = 0;
            shuffleArray(shuffledDeck);
            console.log("Progress reset. Reshuffled current deck.");
            stopTimer(); // Stop timer if running
            isTimedMode = false; // Exit timed mode
            displayCard();
            // Ensure game UI elements are visible
             guideMessageArea.classList.remove('hidden');
             flashcard.parentElement.classList.remove('hidden');
             progressDisplay.classList.remove('hidden');
             scoreDisplay.classList.remove('hidden');
             scoreButtonsContainer.classList.remove('hidden');
             cardActionsDiv.classList.remove('hidden');
             prevCardButton.classList.remove('hidden');
             nextCardButton.classList.remove('hidden');
             endMessage.classList.add('hidden');
             shuffleButton.classList.remove('hidden');
             resetProgressButton.classList.remove('hidden');
             backToSetupButton.classList.remove('hidden');
             muteButton.classList.remove('hidden');
             sfxMuteButton.classList.remove('hidden');
             timerDisplay.classList.add('hidden'); // Hide timer display
        }
    }

    /**
     * Toggles background music mute state.
     */
     function toggleMute() {
         clickSound(); // Play click sound
         isMuted = !isMuted;
         backgroundMusic.muted = isMuted;
         muteButton.textContent = isMuted ? 'Unmute Music' : 'Mute Music';
         muteButton.classList.toggle('muted', isMuted);
         localStorage.setItem('riddleMuted', isMuted.toString());
         if (!isMuted && backgroundMusic.paused && !gameArea.classList.contains('hidden')) {
            backgroundMusic.play().catch(e => console.warn("Audio autoplay prevented:", e));
         } else if (isMuted) {
             backgroundMusic.pause();
         }
     }
    /**
     * Toggles sound effects mute state.
     */
     function toggleSfxMute() {
         sfxMuted = !sfxMuted;
         sfxMuteButton.textContent = sfxMuted ? 'Unmute SFX' : 'Mute SFX';
         sfxMuteButton.classList.toggle('muted', sfxMuted);
         localStorage.setItem('riddleSfxMuted', sfxMuted.toString());
         clickSound(); // Play click sound even if muted before toggle
     }

    /**
     * Handles demo subscription unlock.
     */
    function handleSubscription() {
        clickSound();
        isSubscribed = true;
        localStorage.setItem('riddleSubscription', 'true');
        subscribeButton.textContent = 'Premium Unlocked!';
        subscribeButton.disabled = true;
        alert('Premium content unlocked! Premium categories and cards are now available.');
        populateCategories(); // Update dropdown
        handleSelectionChange(); // Update info/state
    }

    /**
     * Returns view to setup screen.
     */
    function goBackToSetup() {
        clickSound();
        stopTimer(); // Stop timer if running
        isTimedMode = false;
        gameArea.classList.add('hidden');
        endMessage.classList.add('hidden');
        setupArea.classList.remove('hidden');
        categorySelect.value = "";
        difficultySelect.value = "all"; // Reset difficulty
        categoryInfoDiv.textContent = "";
        selectedCategory = "";
        shuffledDeck = []; // Clear the deck
        // if (!isMuted) backgroundMusic.pause();
    }

    /**
     * Toggles the favorite status for the current card.
     */
    function toggleFavorite() {
        clickSound();
        if (shuffledDeck.length === 0 || currentCardIndex >= shuffledDeck.length) return;
        const cardId = shuffledDeck[currentCardIndex].id;
        if (favoriteCardIds.has(cardId)) {
            favoriteCardIds.delete(cardId);
        } else {
            favoriteCardIds.add(cardId);
        }
        localStorage.setItem('favoriteCardIds', JSON.stringify([...favoriteCardIds])); // Save updated set
        // Update button appearance
        favoriteButton.classList.toggle('active', favoriteCardIds.has(cardId));
        favoriteButton.setAttribute('aria-pressed', favoriteCardIds.has(cardId));
    }

    /**
     * Toggles the difficult status for the current card.
     */
    function toggleDifficult() {
        clickSound();
        if (shuffledDeck.length === 0 || currentCardIndex >= shuffledDeck.length) return;
        const cardId = shuffledDeck[currentCardIndex].id;
        if (difficultCardIds.has(cardId)) {
            difficultCardIds.delete(cardId);
        } else {
            difficultCardIds.add(cardId);
        }
        localStorage.setItem('difficultCardIds', JSON.stringify([...difficultCardIds])); // Save updated set
        // Update button appearance
        difficultButton.classList.toggle('active', difficultCardIds.has(cardId));
        difficultButton.setAttribute('aria-pressed', difficultCardIds.has(cardId));
    }

    // --- Timed Mode Functions ---
    function startTimer() {
        stopTimer(); // Clear any existing timer first
        timeRemaining = TIMER_DURATION;
        timerDisplay.classList.remove('hidden');
        updateTimerDisplay(); // Show initial time

        timerId = setInterval(() => {
            timeRemaining--;
            updateTimerDisplay();
            if (timeRemaining <= 0) {
                console.log("Timer finished.");
                stopTimer();
                showEndMessage(); // End game when time runs out
            }
        }, 1000); // Update every second
    }

    function stopTimer() {
        if (timerId) {
            clearInterval(timerId);
            timerId = null;
            console.log("Timer stopped.");
        }
         timerDisplay.classList.add('hidden'); // Hide timer display when stopped/not active
    }

    function updateTimerDisplay() {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.querySelector('span').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    // --- Keyboard Navigation ---
    function handleKeyPress(event) {
        // Ensure game area is visible and focus is not on input/select
        if (gameArea.classList.contains('hidden') || ['SELECT', 'INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
            return;
        }

        switch (event.key) {
            case ' ': // Space bar
            case 'Enter':
                if (document.activeElement === flashcard) {
                    event.preventDefault(); // Prevent page scroll on space
                    flipCard();
                }
                // Allow Enter/Space to trigger focused buttons implicitly (browser default)
                break;
            case 'ArrowLeft':
                if (!prevCardButton.disabled) {
                    event.preventDefault();
                    previousCard();
                    clickSound();
                }
                break;
            case 'ArrowRight':
                 if (!nextCardButton.disabled) {
                    event.preventDefault();
                    nextCard();
                    clickSound();
                }
                break;
            case 'c': // Mark Correct (if enabled)
                 if (!correctButton.disabled) {
                     recordScore(true);
                 }
                 break;
            case 'i': // Mark Incorrect (if enabled)
                 if (!incorrectButton.disabled) {
                     recordScore(false);
                 }
                 break;
             case 'f': // Toggle Favorite
                 toggleFavorite();
                 break;
             case 'd': // Toggle Difficult
                 toggleDifficult();
                 break;
        }
    }


    // --- Event Listeners Setup ---
    themeToggleButton.addEventListener('click', toggleTheme);
    categorySelect.addEventListener('change', handleSelectionChange);
    difficultySelect.addEventListener('change', handleSelectionChange); // Also trigger on difficulty change
    startTimerButton.addEventListener('click', () => { // Start timed game
         clickSound();
         if (selectedCategory && countCardsForSelection(selectedCategory, selectedDifficulty) > 0) {
             startGame(true); // Pass true for timed mode
         } else {
             alert("Please select a valid category and difficulty first!");
         }
     });
    flashcard.addEventListener('click', flipCard);
    correctButton.addEventListener('click', () => recordScore(true));
    incorrectButton.addEventListener('click', () => recordScore(false));
    nextCardButton.addEventListener('click', () => { clickSound(); nextCard(); });
    prevCardButton.addEventListener('click', () => { clickSound(); previousCard(); });
    shuffleButton.addEventListener('click', () => {
        clickSound();
        if (selectedCategory && shuffledDeck.length > 0) {
            console.log(`Reshuffling selection: ${selectedCategory}, Difficulty: ${selectedDifficulty}`);
            startGame(isTimedMode); // Restart with same mode (timed/untimed)
        } else {
            alert("Please select a category and difficulty first to shuffle.");
        }
    });
    resetProgressButton.addEventListener('click', () => { clickSound(); resetProgress(); });
    muteButton.addEventListener('click', toggleMute);
    sfxMuteButton.addEventListener('click', toggleSfxMute); // Listener for SFX mute
    subscribeButton.addEventListener('click', handleSubscription);
    backToSetupButton.addEventListener('click', goBackToSetup);
    favoriteButton.addEventListener('click', toggleFavorite); // Listener for favorite
    difficultButton.addEventListener('click', toggleDifficult); // Listener for difficult
    document.addEventListener('keydown', handleKeyPress); // Keyboard navigation


    // --- Initialisation ---
    function initializeApp() {
        loadPreferences();
        populateCategories();
        handleSelectionChange(); // Sets initial state

        loadingIndicator.classList.add('hidden');
        mainContent.classList.remove('hidden');
        // Attempt to initialize sounds again after potential user interaction context
        document.addEventListener('click', initSounds, { once: true });
    }

    initializeApp();

}); // End DOMContentLoaded listener

