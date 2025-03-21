import { timeout } from "./utils";

export type Options = {
  bpm: number;
  timeSignature: { beatsPerMeassure: number; noteValuePerBeat: number };
};

export type Note = { pitch: Pitch; duration: Duration };

export class Duration {
  denominator: number;
  extensions: number;
  constructor(denominator = 4, extensions = 0) {
    this.denominator = denominator;
    this.extensions = extensions;
  }

  incrExtensions() {
    this.extensions += 1;
  }

  inBeats(options: Options) {
    return (
      // TODO: revisar esto
      (options.timeSignature["beatsPerMeassure"] / this.denominator) *
      this.extensionFactor()
    );
  }

  inSeconds(options: Options) {
    return (this.inBeats(options) * 60.0) / options.bpm;
  }

  inMiliseconds(options: Options) {
    return this.inSeconds(options) * 1000;
  }

  extensionFactor() {
    return 2 - 1.0 / 2 ** this.extensions;
  }
}

export class Pitch {
  tone: string;
  octave: number;

  constructor(tone: string, octave = 4) {
    this.tone = tone;
    this.octave = octave;
  }

  toString() {
    return `${this.tone.toUpperCase()}${this.octave}`;
  }
}

export type Playable =
  | { type: "NOTE"; value: Note }
  | { type: "CHORD"; value: Note[] };

class AudioPlayerError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "AudioPlayerError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

const defaultOptions = {
  bpm: 60,
  timeSignature: {
    beatsPerMeassure: 4,
    noteValuePerBeat: 4,
  },
} as const;

export type AudioPlayerOptions = Options & {
  afterPlayStep?: (note: Note | Note[], index: number) => void;
  beforePlayStep?: (note: Note | Note[], index: number) => void;
};

export class AudioPlayer {
  audioCtx: AudioContext;
  options: AudioPlayerOptions;

  constructor(options: AudioPlayerOptions = defaultOptions) {
    this.audioCtx = new window.AudioContext();
    this.options = options;
  }

  async playSequence(sequence: Playable[]) {
    let index = 0;
    for (const playable of sequence) {
      this.options.beforePlayStep?.(playable.value, index);
      // if necesary refactor this to use polymorphism
      if (playable.type == "NOTE") {
        this.playNote(playable.value);
        await timeout(playable.value.duration.inMiliseconds(this.options));
      } else if (playable.type == "CHORD") {
        const maxDuration = Math.max(
          ...playable.value.map((note) =>
            note.duration.inMiliseconds(this.options)
          )
        );
        this.playChord(playable.value);
        await timeout(maxDuration);
      } else {
        throw new AudioPlayerError("Unknown playable type");
      }

      this.options.afterPlayStep?.(playable.value, index);
      index++;
    }
  }

  playNote(note: Note) {
    this.playMultipleTones([this.transformNote(note)]);
  }

  playChord(notes: Note[]) {
    this.playMultipleTones(notes.map((note) => this.transformNote(note)));
  }

  transformNote(note: Note) {
    return {
      freqCode: note.pitch.toString(),
      seconds: note.duration.inSeconds(this.options),
    };
  }

  codeToFrequency(note: string): number {
    /* prettier-ignore */
    const frequencies: Record<string, number> = {
      "C0": 16.35, "C#0": 17.32, "Db0": 17.32, "D0": 18.35, "D#0": 19.45, "Eb0": 19.45,
      "E0": 20.60, "F0": 21.83, "F#0": 23.12, "Gb0": 23.12, "G0": 24.50, "G#0": 25.96, "Ab0": 25.96,
      "A0": 27.50, "A#0": 29.14, "Bb0": 29.14, "B0": 30.87,
  
      "C1": 32.70, "C#1": 34.65, "Db1": 34.65, "D1": 36.71, "D#1": 38.89, "Eb1": 38.89,
      "E1": 41.20, "F1": 43.65, "F#1": 46.25, "Gb1": 46.25, "G1": 49.00, "G#1": 51.91, "Ab1": 51.91,
      "A1": 55.00, "A#1": 58.27, "Bb1": 58.27, "B1": 61.74,
  
      "C2": 65.41, "C#2": 69.30, "Db2": 69.30, "D2": 73.42, "D#2": 77.78, "Eb2": 77.78,
      "E2": 82.41, "F2": 87.31, "F#2": 92.50, "Gb2": 92.50, "G2": 98.00, "G#2": 103.83, "Ab2": 103.83,
      "A2": 110.00, "A#2": 116.54, "Bb2": 116.54, "B2": 123.47,
  
      "C3": 130.81, "C#3": 138.59, "Db3": 138.59, "D3": 146.83, "D#3": 155.56, "Eb3": 155.56,
      "E3": 164.81, "F3": 174.61, "F#3": 185.00, "Gb3": 185.00, "G3": 196.00, "G#3": 207.65, "Ab3": 207.65,
      "A3": 220.00, "A#3": 233.08, "Bb3": 233.08, "B3": 246.94,
  
      "C4": 261.63, "C#4": 277.18, "Db4": 277.18, "D4": 293.66, "D#4": 311.13, "Eb4": 311.13,
      "E4": 329.63, "F4": 349.23, "F#4": 369.99, "Gb4": 369.99, "G4": 392.00, "G#4": 415.30, "Ab4": 415.30,
      "A4": 440.00, "A#4": 466.16, "Bb4": 466.16, "B4": 493.88,
  
      "C5": 523.25, "C#5": 554.37, "Db5": 554.37, "D5": 587.33, "D#5": 622.25, "Eb5": 622.25,
      "E5": 659.26, "F5": 698.46, "F#5": 739.99, "Gb5": 739.99, "G5": 783.99, "G#5": 830.61, "Ab5": 830.61,
      "A5": 880.00, "A#5": 932.33, "Bb5": 932.33, "B5": 987.77,
  
      "C6": 1046.50, "C#6": 1108.73, "Db6": 1108.73, "D6": 1174.66, "D#6": 1244.51, "Eb6": 1244.51,
      "E6": 1318.51, "F6": 1396.91, "F#6": 1479.98, "Gb6": 1479.98, "G6": 1567.98, "G#6": 1661.22, "Ab6": 1661.22,
      "A6": 1760.00, "A#6": 1864.66, "Bb6": 1864.66, "B6": 1975.53,
  
      "C7": 2093.00, "C#7": 2217.46, "Db7": 2217.46, "D7": 2349.32, "D#7": 2489.02, "Eb7": 2489.02,
      "E7": 2637.02, "F7": 2793.83, "F#7": 2959.96, "Gb7": 2959.96, "G7": 3135.96, "G#7": 3322.44, "Ab7": 3322.44,
      "A7": 3520.00, "A#7": 3729.31, "Bb7": 3729.31, "B7": 3951.07,
  
      "C8": 4186.01, "C#8": 4434.92, "Db8": 4434.92, "D8": 4698.63, "D#8": 4978.03, "Eb8": 4978.03,
      "E8": 5274.04, "F8": 5587.65, "F#8": 5919.91, "Gb8": 5919.91, "G8": 6271.93, "G#8": 6644.88, "Ab8": 6644.88,
      "A8": 7040.00, "A#8": 7458.62, "Bb8": 7458.62, "B8": 7902.13
    };

    return frequencies[note] ?? 440.0; // Default to A4 if note is not found
  }

  playMultipleTones(notes: { freqCode: string; seconds: number }[]) {
    notes.forEach(({ freqCode, seconds }) => {
      const frequency = this.codeToFrequency(freqCode);
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      oscillator.start();
      gainNode.gain.setValueAtTime(1, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        this.audioCtx.currentTime + seconds
      );

      oscillator.stop(this.audioCtx.currentTime + seconds);
    });
  }
}
