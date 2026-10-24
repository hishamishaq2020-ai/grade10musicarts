/**
 * Web Audio API synthesizer for Music Education
 * Polyphonic musical notes, scales, triads, and Omani traditional instrument sounds
 */

class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Frequency mapping for standard notes (A4 = 440Hz)
  private noteFrequencies: Record<string, number> = {
    // Octave 2 (Bass clef lower)
    'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'Bb2': 116.54, 'B2': 123.47,
    // Octave 3 (Bass clef central)
    'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'Eb3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
    'G3': 196.00, 'Ab3': 207.65, 'A3': 220.00, 'Bb3': 233.08, 'B3': 246.94,
    // Octave 4 (Middle C and treble)
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'Eb4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
    'G4': 392.00, 'Ab4': 415.30, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
    // Octave 5
    'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00
  };

  public playNote(noteName: string, duration = 0.8, type: OscillatorType = 'triangle', gainLevel = 0.25) {
    this.initCtx();
    if (!this.ctx) return;

    const freq = this.noteFrequencies[noteName] || 440;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    // Warm envelope
    const now = this.ctx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(gainLevel, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  public playTriad(notes: string[], arpeggio = false, duration = 1.6) {
    this.initCtx();
    if (!this.ctx) return;

    if (arpeggio) {
      notes.forEach((note, index) => {
        setTimeout(() => {
          this.playNote(note, 0.9, 'triangle', 0.22);
        }, index * 260);
      });
    } else {
      // Harmonic playback together
      notes.forEach((note) => {
        this.playNote(note, duration, 'sine', 0.18);
      });
    }
  }

  public playScale(notes: string[], tempo = 300) {
    this.initCtx();
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note, 0.45, 'triangle', 0.25);
      }, index * tempo);
    });
  }

  // Omani Traditional Instrument Simulation
  public playRahmani() {
    this.initCtx();
    if (!this.ctx) return;

    // Deep resonant acoustic drum boom (DUM)
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.35);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  public playKasir() {
    this.initCtx();
    if (!this.ctx) return;

    // Sharp crisp crack/slap (TAK)
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playBarghoom() {
    this.initCtx();
    if (!this.ctx) return;

    // Deep ancient animal horn call (Oryx/Ibex horn)
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(148, now + 0.3);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.8);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.85);
  }
}

export const synth = new AudioSynthesizer();
