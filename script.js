let flashcards = [...allFlashcards];
let currentCard = 0;
let isFlipped = false;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

const flashcard = document.getElementById("flashcard");
const cardQuestion = document.getElementById("card-question");
const cardAnswer = document.getElementById("card-answer");
const guideText = document.getElementById("guide-text");
const progressText = document.getElementById("progress-text");
const boltImage = document.getElementById("bolt-image");
const chattyImage = document.getElementById("chatty-image");
const boltSound = document.getElementById("bolt-sound");
const chattySound = document.getElementById("chatty-sound");

// Load the current card and update progress

// Reset classes when navigating or resetting
function loadCard() {
    if (flashcards.length === 0) {
        cardQuestion.textContent = "No cards in this category.";
        cardAnswer.textContent = "";
        guideText.textContent = "Choose another category!";
        progressText.textContent = "No cards available";
        boltImage.style.display = "none";
        chattyImage.style.display = "none";
        return;
    }

    const card = flashcards[currentCard];
    cardQuestion.textContent = card.question;
    cardAnswer.textContent = card.answer;
    guideText.textContent = card.guide;
    progressText.textContent = `Card ${currentCard + 1} of ${flashcards.length}`;

    // Toggle Bolt/Chatty images based on the guide
    if (card.guide.includes("Bolt")) {
        boltImage.style.display = "block";
        chattyImage.style.display = "none";
    } else {
        boltImage.style.display = "none";
        chattyImage.style.display = "block";
    }

    flashcard.classList.remove("flipped");
    isFlipped = false;

    // Reset score-tracker button styles
    const correctBtn = document.querySelector('.score-tracker button[aria-label="Mark answer as correct"]');
    const incorrectBtn = document.querySelector('.score-tracker button[aria-label="Mark answer as incorrect"]');
    correctBtn.classList.remove('correct');
    incorrectBtn.classList.remove('incorrect');

    // Check if this is the last card in the category to trigger confetti
    if (currentCard + 1 === flashcards.length) {
        triggerConfetti();
    }
}




// Flip the card on click or Enter key and play sound
flashcard.addEventListener("click", () => {
    flipCard();
});

flashcard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        flipCard();
    }
});

function flipCard() {
    flashcard.classList.toggle("flipped");
    isFlipped = !isFlipped;

    // Play sound based on the guide
    const card = flashcards[currentCard];
    try {
        if (card.guide.includes("Bolt")) {
            boltSound.play().catch(err => console.error("Error playing Bolt sound:", err));
        } else {
            chattySound.play().catch(err => console.error("Error playing Chatty sound:", err));
        }
    } catch (err) {
        console.error("Error playing sound:", err);
    }

    // Track card flip event with GA4
    gtag('event', 'card_flip', {
        'event_category': 'Flashcard Interaction',
        'event_label': card.category,
        'value': currentCard + 1
    });
}

// Navigate to the next card
function nextCard() {
    currentCard = (currentCard + 1) % flashcards.length;
    loadCard();
    savePreferences();
}

// Navigate to the previous card
function prevCard() {
    currentCard = (currentCard - 1 + flashcards.length) % flashcards.length;
    loadCard();
    savePreferences();
}

// Shuffle cards
function shuffleCards() {
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    currentCard = 0;
    score = 0; // Reset score on shuffle
    updateScoreDisplay();
    loadCard();
    savePreferences();
}

// Filter cards by category
function filterCards() {
    const category = document.getElementById("category").value;
    if (category === "all") {
        flashcards = [...allFlashcards];
    } else {
        flashcards = allFlashcards.filter(card => card.category === category);
    }
    currentCard = 0;
    score = 0; // Reset score on category change
    updateScoreDisplay();
    loadCard();
    savePreferences();
}

// Toggle dark mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    gtag('event', 'toggle_dark_mode', {
        'event_category': 'User Preference',
        'event_label': document.body.classList.contains("dark-mode") ? 'Dark Mode On' : 'Dark Mode Off'
    });
    savePreferences();
}

// Trigger confetti animation when completing a category
function triggerConfetti() {
    try {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        gtag('event', 'category_completed', {
            'event_category': 'Milestone',
            'event_label': document.getElementById("category").value
        });
    } catch (err) {
        console.error("Error triggering confetti:", err);
    }
}

// Load user preferences from localStorage on page load
function loadPreferences() {
    const savedCard = localStorage.getItem('currentCard');
    const savedCategory = localStorage.getItem('category');
    const savedDarkMode = localStorage.getItem('darkMode');

    if (savedCard) currentCard = parseInt(savedCard);
    if (savedCategory) {
        document.getElementById('category').value = savedCategory;
        filterCards(); // Apply the saved category filter
    }
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
    loadCard();
}

// Save user preferences to localStorage
function savePreferences() {
    localStorage.setItem('currentCard', currentCard);
    localStorage.setItem('category', document.getElementById('category').value);
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('score-text').textContent = `Score: ${score}`;
    localStorage.setItem('score', score);
}

function markCorrect() {
    if (isFlipped) { // Only allow scoring after flipping
        score += 1;
        updateScoreDisplay();
        gtag('event', 'answer_correct', {
            'event_category': 'Scoring',
            'event_label': flashcards[currentCard].category,
            'value': score
        });
        // Add visual feedback
        const correctBtn = document.querySelector('.score-tracker button[aria-label="Mark answer as correct"]');
        correctBtn.classList.add('correct');
        const incorrectBtn = document.querySelector('.score-tracker button[aria-label="Mark answer as incorrect"]');
        incorrectBtn.classList.remove('incorrect');
    }
}

function markIncorrect() {
    if (isFlipped) {
        score = Math.max(0, score - 1); // Prevent negative scores
        updateScoreDisplay();
        gtag('event', 'answer_incorrect', {
            'event_category': 'Scoring',
            'event_label': flashcards[currentCard].category,
            'value': score
        });
        // Add visual feedback
        const incorrectBtn = document.querySelector('.score-tracker button[aria-label="Mark answer as incorrect"]');
        incorrectBtn.classList.add('incorrect');
        const correctBtn = document.querySelector('.score-tracker button[aria-label="Mark answer as correct"]');
        correctBtn.classList.remove('correct');
    }
}





// Reset progress
function resetProgress() {
    currentCard = 0;
    score = 0;
    document.getElementById('category').value = 'all';
    filterCards();
    localStorage.clear();
    document.body.classList.remove('dark-mode');
    updateScoreDisplay();
    loadCard();
    gtag('event', 'reset_progress', {
        'event_category': 'User Action',
        'event_label': 'Progress Reset'
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        nextCard();
    } else if (e.key === 'ArrowLeft') {
        prevCard();
    }
});

// Loading spinner logic
function hideSpinner() {
    const loadingSpinner = document.getElementById('loading');
    // Ensure all critical assets are loaded
    Promise.all([
        new Promise(resolve => {
            if (boltSound.readyState >= 4) resolve();
            else boltSound.onloadeddata = resolve;
        }),
        new Promise(resolve => {
            if (chattySound.readyState >= 4) resolve();
            else chattySound.onloadeddata = resolve;
        }),
        new Promise(resolve => {
            const img1 = new Image();
            img1.src = boltImage.src;
            img1.onload = resolve;
            img1.onerror = resolve; // Resolve even if image fails to load
        }),
        new Promise(resolve => {
            const img2 = new Image();
            img2.src = chattyImage.src;
            img2.onload = resolve;
            img2.onerror = resolve;
        })
    ]).then(() => {
        loadingSpinner.style.display = 'none';
    }).catch(err => {
        console.error("Error loading assets:", err);
        loadingSpinner.style.display = 'none'; // Hide spinner even if there's an error
    });
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(err => {
            console.error('Service Worker registration failed:', err);
        });
}

// Initialize the app
window.addEventListener('load', () => {
    loadPreferences();
    updateScoreDisplay();
    hideSpinner();
});
