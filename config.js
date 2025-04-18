// config.js - Stores application constants

export const config = {
    TIMER_DURATION: 60, // seconds
    LOCALSTORAGE_KEYS: {
        score: 'riddleScore',
        subscription: 'riddleSubscription',
        mute: 'riddleMuted',
        sfxMute: 'riddleSfxMuted',
        theme: 'flashcardTheme',
        favorites: 'favoriteCardIds',
        difficults: 'difficultCardIds'
    },
    ASSET_PATHS: {
        bolt: 'assets/bolt.png',
        chatty: 'assets/chatty.png',
        defaultAvatar: 'https://placehold.co/30x30/CCCCCC/444?text=?',
        music: 'assets/background-music.mp3'
    },
    SOUND_NOTES: {
        correct: "C5",
        incorrect: "C4",
        flip: "E4",
        click: "C3"
    },
    SOUND_DURATIONS: {
        correct: "8n",
        incorrect: "8n",
        flip: "16n",
        click: "16n"
    }
};

