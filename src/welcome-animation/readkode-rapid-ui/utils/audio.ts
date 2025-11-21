
let audioCtx: AudioContext | null = null;

// Initialize audio context (must be triggered by user interaction)
export const initAudio = () => {
    if (typeof window === 'undefined') return null;
    
    if (!audioCtx) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
    
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume().catch(e => console.error("Audio resume failed", e));
    }
    
    return audioCtx;
};

// Sound 1: "The Click"
// A minimalist, premium UI tick. Crisp, short, and organic (like a woodblock or glass tap).
export const playTypeSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sine wave with a quick pitch drop creates a "bubble" or "woodblock" pop
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.04);

    // Very short, clean envelope
    gain.gain.setValueAtTime(0.15, t); // Low volume for subtlety
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
};

// Sound 2: "The Breath" (Swell)
// A very transparent, airy rise. Not dramatic, just a "presence" appearing.
export const playSwellSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Two gentle sine waves creating a harmonious interval (Perfect 5th)
    const freqs = [440, 659.25]; // A4, E5
    
    freqs.forEach(f => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = f;
        
        // Slow attack, slow release
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.05, t + 0.8); // Very quiet peak
        gain.gain.linearRampToValueAtTime(0, t + 1.5);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 1.6);
    });
};

// Sound 3: "The Brand Chime" (Finish)
// A clean, optimistic open chord. Simple, pure, and welcoming.
export const playFinishSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    const t = ctx.currentTime;

    // C Major Triad in Open Voicing (C4, G4, E5) for a modern, airy feel
    const notes = [261.63, 392.00, 659.25]; 
    
    notes.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine'; // Sine is the cleanest waveform
        osc.frequency.value = f;
        
        // Gentle instant attack, nice ringing tail
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.05); // Soft pop attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5); // Long smooth decay
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.0);
    });
};
