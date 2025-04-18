// audio.js - Manages Tone.js sound effects and background music mute

import { state } from './state.js';
import { config } from './config.js';
import { dom } from './dom.js'; // Needed for backgroundMusic element
import { ui } from './ui.js'; // Needed to update SFX button UI

// Declare synth variable in module scope
let synth = null;

export const audio = {
    init: () => {
        // Prevent multiple initializations or if Tone is undefined
        if (state.soundsReady || typeof Tone === 'undefined') return;

        console.log("[Audio] Attempting to initialize Tone.js...");
        try {
            // Resume audio context if needed (often required after page load)
            Tone.start(); // Request audio context start

            synth = new Tone.PolySynth(Tone.Synth, {
                 oscillator: { type: "sine" },
                 envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.2 }
            }).toDestination();

            // Check context state after attempting start/resume
            if (Tone.context.state === 'running') {
                 state.soundsReady = true;
                 console.log("[Audio] Tone.js sounds initialized successfully.");
                 ui.updateSfxButton(); // Update button state
            } else {
                 // Context might still be suspended, wait for interaction
                 console.warn("[Audio] Tone.js context suspended. Waiting for user interaction.");
                 // Add listeners again specifically for resuming context
                 const resumeAudio = async () => {
                    if (Tone.context.state !== 'running') {
                        await Tone.context.resume();
                        if (Tone.context.state === 'running') {
                             state.soundsReady = true;
                             console.log("[Audio] Tone.js context resumed on interaction.");
                             ui.updateSfxButton();
                             // Remove listeners after success
                             document.removeEventListener('click', resumeAudio);
                             document.removeEventListener('keydown', resumeAudio);
                        } else {
                             console.error("[Audio] Failed to resume audio context.");
                             state.soundsReady = false;
                             ui.updateSfxButton(true); // Pass error=true
                        }
                    }
                 };
                 document.addEventListener('click', resumeAudio, { once: true });
                 document.addEventListener('keydown', resumeAudio, { once: true });
            }

        } catch (error) {
            console.error("[Audio] Could not initialize Tone.js sounds:", error);
            state.soundsReady = false;
            ui.updateSfxButton(true); // Pass error=true
        }
    },
    playSound: (soundType) => {
        if (!state.sfxMuted && synth && state.soundsReady && Tone.context.state === 'running') {
            const note = config.SOUND_NOTES[soundType];
            const duration = config.SOUND_DURATIONS[soundType];
            if (note && duration) {
                try {
                     synth.triggerAttackRelease(note, duration, Tone.now());
                } catch(e) {
                     console.error("[Audio] Tone.js playback error:", e);
                }
            }
        } else if (!state.soundsReady) {
             console.warn("[Audio] Sounds not ready, cannot play:", soundType);
        } else if (Tone.context.state !== 'running') {
             console.warn("[Audio] Audio context not running, cannot play:", soundType);
             // Attempt to resume context on next interaction
             document.addEventListener('click', audio.init, { once: true });
             document.addEventListener('keydown', audio.init, { once: true });
        }
    },
    toggleMusicMute: () => {
        audio.playSound('click');
        state.isMuted = !state.isMuted;
        if(dom.backgroundMusic) dom.backgroundMusic.muted = state.isMuted;
        storage.saveMute(); // Use storage module
        ui.updateMusicMuteButton(); // Use ui module
        // Handle playback state
        if (!state.isMuted && dom.backgroundMusic && dom.backgroundMusic.paused && dom.gameArea && !dom.gameArea.classList.contains('hidden')) {
           dom.backgroundMusic.play().catch(e => console.warn("Audio autoplay prevented:", e));
        } else if (state.isMuted && dom.backgroundMusic) {
            dom.backgroundMusic.pause();
        }
    },
    toggleSfxMute: () => {
        state.sfxMuted = !state.sfxMuted;
        storage.saveSfxMute(); // Use storage module
        ui.updateSfxButton(); // Use ui module
        audio.playSound('click'); // Play click sound even if muted before toggle
    }
};

