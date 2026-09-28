// Zero-dependency procedural Web Audio API Synthesizer
// Completely 0 KB network payload — synthesized on-the-fly in browser memory.

class ProceduralSoundEngine {
  private ctx: AudioContext | null = null;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private isDronePlaying = false;
  private isMuted = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isDronePlaying) {
      this.stopDrone();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Crisp mechanical tactile switch click
  public playClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore audio glitches
    }
  }

  // Ultra-subtle telemetry hover blip
  public playHover() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.025);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore
    }
  }

  // Resonant warp sweep for modal opens / warp transitions
  public playWarp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.16);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 0.16);
      filter.Q.value = 4;

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  // Two-tone chime on copy / success
  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // Note 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, now + 0.08); // A5
      gain2.gain.setValueAtTime(0.04, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.24);
    } catch {
      // Ignore
    }
  }

  // Ambient Celestial Sub-Drone
  public startDrone() {
    if (this.isMuted || this.isDronePlaying) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      this.droneGain = ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.linearRampToValueAtTime(0.025, now + 2.5); // Smooth 2.5s fade-in

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 140;

      // Dual detuned oscillators create a subtle celestial beating frequency
      this.droneOsc1 = ctx.createOscillator();
      this.droneOsc2 = ctx.createOscillator();

      this.droneOsc1.type = "sine";
      this.droneOsc1.frequency.setValueAtTime(55, now); // A1 note

      this.droneOsc2.type = "sine";
      this.droneOsc2.frequency.setValueAtTime(55.35, now); // 0.35 Hz binaural slow pulse

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDronePlaying = true;
    } catch {
      // Ignore
    }
  }

  public stopDrone() {
    if (!this.isDronePlaying || !this.droneGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.2); // Smooth fade-out
      setTimeout(() => {
        if (this.droneOsc1) {
          try { this.droneOsc1.stop(); } catch {}
          this.droneOsc1.disconnect();
          this.droneOsc1 = null;
        }
        if (this.droneOsc2) {
          try { this.droneOsc2.stop(); } catch {}
          this.droneOsc2.disconnect();
          this.droneOsc2 = null;
        }
        this.isDronePlaying = false;
      }, 1300);
    } catch {
      this.isDronePlaying = false;
    }
  }

  public toggleDrone() {
    if (this.isDronePlaying) {
      this.stopDrone();
    } else {
      this.startDrone();
    }
  }

  public getIsDronePlaying(): boolean {
    return this.isDronePlaying;
  }
}

export const soundEngine = new ProceduralSoundEngine();
