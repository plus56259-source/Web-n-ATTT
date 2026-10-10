// Pure Web Audio API synthesized sound effects (No external audio files needed!)
class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio fallback silent
    }
  }

  playTing() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.85);
    } catch {
      // ignore
    }
  }

  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.3);
      });
    } catch {
      // ignore
    }
  }

  playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  }

  playCardFlip() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // ignore
    }
  }

  playReaction() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1300, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }

  playNudge() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      [880, 1174.66].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.22);
      });
    } catch {}
  }

  playGoalCelebration() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Arpeggio chime
      [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.16, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.52);
      });
    } catch {}
  }
}

export const sound = new SoundManager();

// Multi-track Ambient Mixer for Study With Me
export class StudyAmbientMixer {
  private ctx: AudioContext | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private rainGain: GainNode | null = null;
  private cafeSource: AudioBufferSourceNode | null = null;
  private cafeGain: GainNode | null = null;
  private fireSource: AudioBufferSourceNode | null = null;
  private fireGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private droneGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isRunning = false;

  public volumes = {
    rain: 0.4,
    cafe: 0.25,
    fire: 0.0,
    lofi: 0.35,
  };

  private getContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  start() {
    const ctx = this.getContext();
    if (!ctx || this.isRunning) return;
    this.isRunning = true;

    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    // 1. Rain Layer
    const rainBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const rainData = rainBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < rainBuffer.length; i++) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.025 * white) / 1.025;
      rainData[i] = lastOut * 3.2;
    }
    this.rainSource = ctx.createBufferSource();
    this.rainSource.buffer = rainBuffer;
    this.rainSource.loop = true;
    const rainFilter = ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 850;
    this.rainGain = ctx.createGain();
    this.rainGain.gain.setValueAtTime(this.volumes.rain * 0.3, ctx.currentTime);
    this.rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    this.rainSource.start();

    // 2. Cafe Murmur Layer (bandpass pink noise with subtle fluttering)
    const cafeBuffer = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate);
    const cafeData = cafeBuffer.getChannelData(0);
    let cLast = 0.0;
    for (let i = 0; i < cafeBuffer.length; i++) {
      const white = Math.random() * 2 - 1;
      cLast = (cLast + 0.05 * white) / 1.05;
      cafeData[i] = cLast * 2.0;
    }
    this.cafeSource = ctx.createBufferSource();
    this.cafeSource.buffer = cafeBuffer;
    this.cafeSource.loop = true;
    const cafeFilter = ctx.createBiquadFilter();
    cafeFilter.type = 'bandpass';
    cafeFilter.frequency.value = 950;
    cafeFilter.Q.value = 2.0;
    this.cafeGain = ctx.createGain();
    this.cafeGain.gain.setValueAtTime(this.volumes.cafe * 0.2, ctx.currentTime);
    this.cafeSource.connect(cafeFilter);
    cafeFilter.connect(this.cafeGain);
    this.cafeGain.connect(this.masterGain);
    this.cafeSource.start();

    // 3. Fireplace Crackle Layer
    const fireBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const fireData = fireBuffer.getChannelData(0);
    for (let i = 0; i < fireBuffer.length; i++) {
      const crackle = Math.random() < 0.003 ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 2 - 1) * 0.03;
      fireData[i] = crackle;
    }
    this.fireSource = ctx.createBufferSource();
    this.fireSource.buffer = fireBuffer;
    this.fireSource.loop = true;
    this.fireGain = ctx.createGain();
    this.fireGain.gain.setValueAtTime(this.volumes.fire * 0.25, ctx.currentTime);
    this.fireSource.connect(this.fireGain);
    this.fireGain.connect(this.masterGain);
    this.fireSource.start();

    // 4. Lofi Drone Chord (Fmaj7 / Am9 soothing chord progression)
    this.droneGain = ctx.createGain();
    this.droneGain.gain.setValueAtTime(this.volumes.lofi * 0.12, ctx.currentTime);
    this.droneGain.connect(this.masterGain);

    const lofiFreqs = [174.61, 220.0, 261.63, 329.63, 392.0];
    this.droneOscs = lofiFreqs.map(f => {
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      osc.connect(this.droneGain!);
      osc.start();
      return osc;
    });
  }

  setTrackVolume(track: 'rain' | 'cafe' | 'fire' | 'lofi', vol: number) {
    this.volumes[track] = vol;
    const ctx = this.ctx;
    if (!ctx) return;
    if (track === 'rain' && this.rainGain) {
      this.rainGain.gain.setValueAtTime(vol * 0.3, ctx.currentTime);
    } else if (track === 'cafe' && this.cafeGain) {
      this.cafeGain.gain.setValueAtTime(vol * 0.2, ctx.currentTime);
    } else if (track === 'fire' && this.fireGain) {
      this.fireGain.gain.setValueAtTime(vol * 0.25, ctx.currentTime);
    } else if (track === 'lofi' && this.droneGain) {
      this.droneGain.gain.setValueAtTime(vol * 0.12, ctx.currentTime);
    }
  }

  stop() {
    this.isRunning = false;
    try {
      this.rainSource?.stop();
      this.cafeSource?.stop();
      this.fireSource?.stop();
      this.droneOscs.forEach(o => {
        try { o.stop(); } catch {}
      });
      this.droneOscs = [];
      this.ctx?.close();
      this.ctx = null;
    } catch {}
  }

  get active(): boolean {
    return this.isRunning;
  }
}

export const studyMixer = new StudyAmbientMixer();

// Ambient Sound Synthesizer Node
export class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private rainNode: AudioNode | null = null;
  private noiseNode: AudioNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private isPlaying = false;

  start(type: 'rain' | 'noise' | 'lofi' | 'bell', volume: number = 0.5) {
    this.stop();
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
    this.isPlaying = true;

    if (type === 'rain' || type === 'noise') {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'rain') {
          // Pink-ish noise filter for soothing rain
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5;
        } else {
          // Soft white noise
          data[i] = white * 0.3;
        }
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = type === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.value = type === 'rain' ? 800 : 1200;

      noise.connect(filter);
      filter.connect(this.masterGain);
      noise.start();
      this.noiseNode = noise;
    } else if (type === 'lofi') {
      // Warm chord drone (F major 7)
      const freqs = [174.61, 220.0, 261.63, 329.63];
      this.droneOscs = freqs.map((f) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.value = f;
        g.gain.value = 0.08;
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start();
        return osc;
      });
    } else if (type === 'bell') {
      // Periodic serene chime
      const ring = () => {
        if (!this.isPlaying || !this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(528, this.ctx.currentTime); // 528Hz Solfeggio frequency
        g.gain.setValueAtTime(0.2, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.5);
        osc.connect(g);
        g.connect(this.masterGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 3.6);
      };
      ring();
      const interval = window.setInterval(() => {
        if (!this.isPlaying) {
          clearInterval(interval);
          return;
        }
        ring();
      }, 7000);
    }
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(vol * 0.15, this.ctx.currentTime);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.droneOscs.length > 0) {
      this.droneOscs.forEach((o) => {
        try { o.stop(); } catch {}
      });
      this.droneOscs = [];
    }
    if (this.noiseNode) {
      try { (this.noiseNode as AudioBufferSourceNode).stop(); } catch {}
      this.noiseNode = null;
    }
    if (this.ctx) {
      try { this.ctx.close(); } catch {}
      this.ctx = null;
    }
  }

  get active(): boolean {
    return this.isPlaying;
  }
}
