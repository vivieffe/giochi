// Procedural Web Audio API synthesizer + Polyphonic Christmas Music Box Player
// Works 100% offline with zero external audio files or API keys required.

export type MusicTrackId = 'jingle_bells' | 'tu_scendi' | 'astro_ciel' | 'we_wish';

export interface MusicTrackMeta {
  id: MusicTrackId;
  title: string;
  tempoMs: number; // duration of one beat unit (eighth/quarter grid)
  melody: Array<[number, number]>; // [MIDI note (0 = rest), duration in units]
  bass: Array<[number, number]>;   // [MIDI note (0 = rest), duration in units]
}

function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

// MIDI helpers: C4=60, D4=62, E4=64, F4=65, G4=67, A4=69, B4=71, C5=72, D5=74, E5=76, F5=77, G5=79
export const CHRISTMAS_TRACKS: MusicTrackMeta[] = [
  {
    id: 'jingle_bells',
    title: 'Jingle Bells',
    tempoMs: 210,
    melody: [
      [64, 1], [64, 1], [64, 2],
      [64, 1], [64, 1], [64, 2],
      [64, 1], [67, 1], [60, 1.5], [62, 0.5], [64, 4],
      [65, 1], [65, 1], [65, 1.5], [65, 0.5],
      [65, 1], [64, 1], [64, 1], [64, 0.5], [64, 0.5],
      [64, 1], [62, 1], [62, 1], [64, 1], [62, 2], [67, 2],
      [64, 1], [64, 1], [64, 2],
      [64, 1], [64, 1], [64, 2],
      [64, 1], [67, 1], [60, 1.5], [62, 0.5], [64, 4],
      [65, 1], [65, 1], [65, 1.5], [65, 0.5],
      [65, 1], [64, 1], [64, 1], [64, 0.5], [64, 0.5],
      [67, 1], [67, 1], [65, 1], [62, 1], [60, 4],
    ],
    bass: [
      [48, 2], [55, 2], [48, 2], [55, 2],
      [48, 2], [55, 2], [48, 2], [52, 2],
      [53, 2], [53, 2], [48, 2], [48, 2],
      [50, 2], [50, 2], [55, 2], [55, 2],
      [48, 2], [55, 2], [48, 2], [55, 2],
      [48, 2], [55, 2], [48, 2], [52, 2],
      [53, 2], [53, 2], [48, 2], [48, 2],
      [55, 2], [55, 2], [48, 4],
    ],
  },
  {
    id: 'tu_scendi',
    title: 'Tu Scendi dalle Stelle',
    tempoMs: 260,
    melody: [
      [67, 1], [67, 1], [69, 1], [67, 2], [64, 1],
      [65, 1], [67, 1], [65, 1], [64, 2], [0, 1],
      [62, 1], [64, 1], [65, 1], [67, 2], [64, 1],
      [62, 3], [60, 3],
      [67, 1], [67, 1], [69, 1], [67, 2], [64, 1],
      [65, 1], [67, 1], [65, 1], [64, 2], [0, 1],
      [64, 1], [62, 1], [60, 1], [62, 2], [64, 1],
      [60, 3], [0, 3],
    ],
    bass: [
      [48, 3], [52, 3], [53, 3], [48, 3],
      [55, 3], [48, 3], [55, 3], [48, 3],
      [48, 3], [52, 3], [53, 3], [48, 3],
      [55, 3], [55, 3], [48, 6],
    ],
  },
  {
    id: 'astro_ciel',
    title: 'Astro del Ciel',
    tempoMs: 290,
    melody: [
      [67, 1.5], [69, 0.5], [67, 1], [64, 3],
      [67, 1.5], [69, 0.5], [67, 1], [64, 3],
      [74, 2], [74, 1], [71, 3],
      [72, 2], [72, 1], [67, 3],
      [69, 2], [69, 1], [72, 1.5], [71, 0.5], [69, 1],
      [67, 1.5], [69, 0.5], [67, 1], [64, 3],
      [74, 2], [74, 1], [77, 1.5], [74, 0.5], [71, 1],
      [72, 3], [76, 3],
      [72, 1.5], [67, 0.5], [64, 1], [67, 1.5], [65, 0.5], [62, 1],
      [60, 6],
    ],
    bass: [
      [48, 3], [48, 3], [48, 3], [48, 3],
      [55, 3], [55, 3], [48, 3], [48, 3],
      [53, 3], [53, 3], [48, 3], [48, 3],
      [55, 3], [55, 3], [48, 3], [48, 3],
      [48, 3], [55, 3], [48, 6],
    ],
  },
  {
    id: 'we_wish',
    title: 'Buon Natale (We Wish You)',
    tempoMs: 230,
    melody: [
      [62, 1], [67, 1], [67, 0.5], [69, 0.5], [67, 0.5], [66, 0.5],
      [64, 1], [64, 1], [64, 1],
      [69, 1], [69, 0.5], [71, 0.5], [69, 0.5], [67, 0.5],
      [66, 1], [62, 1], [62, 1],
      [71, 1], [71, 0.5], [72, 0.5], [71, 0.5], [69, 0.5],
      [67, 1], [64, 1], [62, 0.5], [62, 0.5],
      [64, 1], [69, 1], [66, 1],
      [67, 3],
    ],
    bass: [
      [50, 1], [55, 3], [52, 3], [57, 3],
      [50, 3], [55, 3], [52, 3], [50, 3],
      [55, 3],
    ],
  },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  public sfxMuted = false;
  public musicMuted = false;
  public currentTrackId: MusicTrackId = 'jingle_bells';

  private musicTimer: number | null = null;
  private isMusicPlaying = false;
  private melodyStep = 0;
  private bassStep = 0;
  private nextMelodyTime = 0;
  private nextBassTime = 0;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.12,
    delay = 0
  ) {
    if (this.sfxMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    this.scheduleNote(ctx, freq, now, duration, type, volume);
  }

  private scheduleNote(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    volume: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(0.05, duration));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.03);
  }

  // --- Background Christmas Music Box Sequencer ---
  startMusic() {
    if (this.musicMuted) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    if (this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    this.melodyStep = 0;
    this.bassStep = 0;
    const startAt = ctx.currentTime + 0.06;
    this.nextMelodyTime = startAt;
    this.nextBassTime = startAt;

    this.musicTimer = window.setInterval(() => {
      this.tickMusicScheduler();
    }, 80);
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      window.clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  setTrack(trackId: MusicTrackId) {
    this.currentTrackId = trackId;
    if (this.isMusicPlaying) {
      this.stopMusic();
      if (!this.musicMuted) {
        this.startMusic();
      }
    }
  }

  setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    if (muted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  private tickMusicScheduler() {
    if (!this.isMusicPlaying || this.musicMuted || !this.ctx) return;
    const track =
      CHRISTMAS_TRACKS.find((t) => t.id === this.currentTrackId) || CHRISTMAS_TRACKS[0];
    const beatSec = track.tempoMs / 1000;
    const lookahead = 0.25;

    // Prevent catch-up spike if browser throttled timers while tab was inactive
    if (this.nextMelodyTime < this.ctx.currentTime - 0.5) {
      this.nextMelodyTime = this.ctx.currentTime + 0.05;
    }
    if (this.nextBassTime < this.ctx.currentTime - 0.5) {
      this.nextBassTime = this.ctx.currentTime + 0.05;
    }

    while (this.nextMelodyTime < this.ctx.currentTime + lookahead) {
      const [midi, beats] = track.melody[this.melodyStep];
      const dur = beats * beatSec;
      if (midi > 0) {
        // Warm music-box chime (fundamental + subtle harmonic sparkle)
        const freq = midiToFreq(midi);
        this.scheduleNote(this.ctx, freq, this.nextMelodyTime, dur * 0.9, 'sine', 0.045);
        this.scheduleNote(this.ctx, freq * 2, this.nextMelodyTime, dur * 0.4, 'triangle', 0.012);
      }
      this.nextMelodyTime += dur;
      this.melodyStep = (this.melodyStep + 1) % track.melody.length;
    }

    while (this.nextBassTime < this.ctx.currentTime + lookahead) {
      const [midi, beats] = track.bass[this.bassStep];
      const dur = beats * beatSec;
      if (midi > 0) {
        const freq = midiToFreq(midi);
        this.scheduleNote(this.ctx, freq, this.nextBassTime, dur * 0.85, 'triangle', 0.025);
      }
      this.nextBassTime += dur;
      this.bassStep = (this.bassStep + 1) % track.bass.length;
    }
  }

  // --- Gameplay Sound Effects ---
  tap() {
    this.playTone(520, 0.08, 'triangle', 0.09);
  }

  note(index: number) {
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 987.77]; // C5..B5
    const freq = scale[index % scale.length];
    this.playTone(freq, 0.24, 'sine', 0.14);
  }

  hint() {
    this.playTone(659.25, 0.12, 'sine', 0.1, 0);
    this.playTone(880, 0.22, 'sine', 0.1, 0.09);
  }

  wrong() {
    this.playTone(220, 0.16, 'triangle', 0.1, 0);
    this.playTone(185, 0.22, 'triangle', 0.09, 0.11);
  }

  stepSuccess() {
    this.playTone(587.33, 0.12, 'sine', 0.11, 0);
    this.playTone(783.99, 0.2, 'sine', 0.12, 0.09);
  }

  rescued() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.24, 'sine', 0.13, idx * 0.085);
    });
  }

  victory() {
    const melody: Array<[number, number, number]> = [
      [659.25, 0.16, 0],
      [659.25, 0.16, 0.18],
      [659.25, 0.32, 0.36],
      [659.25, 0.16, 0.72],
      [659.25, 0.16, 0.9],
      [659.25, 0.32, 1.08],
      [659.25, 0.16, 1.44],
      [783.99, 0.16, 1.62],
      [523.25, 0.2, 1.8],
      [587.33, 0.16, 2.02],
      [659.25, 0.45, 2.2],
    ];
    melody.forEach(([freq, dur, delay]) => {
      this.playTone(freq, dur, 'triangle', 0.14, delay);
    });
  }
}

export const sound = new SoundEngine();
