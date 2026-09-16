export type SoundCue = 'flap' | 'score' | 'crash';
export interface AudioState {
  muted: boolean;
  available: boolean;
  ready: boolean;
  played: Record<SoundCue, number>;
}
const cues = {
  flap: { from: 660, to: 980, duration: 0.07, type: 'triangle' },
  score: { from: 1046, to: 1568, duration: 0.16, type: 'sine' },
  crash: { from: 180, to: 45, duration: 0.22, type: 'sawtooth' },
} as const;

export function createAudio(factory: () => AudioContext | null = () =>
  typeof window.AudioContext === 'function' ? new window.AudioContext() : null) {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let muted = false;
  let available = true;
  let disposed = false;
  const played = { flap: 0, score: 0, crash: 0 };
  const voices = new Map<OscillatorNode, GainNode>();

  function silence() {
    for (const [oscillator, envelope] of voices) {
      try { oscillator.stop(); } catch { /* The short cue may already have ended. */ }
      try { oscillator.disconnect(); envelope.disconnect(); } catch { /* Audio teardown is best effort. */ }
    }
    voices.clear();
  }
  function close() {
    const current = context;
    context = null;
    master = null;
    try { if (current) void current.close().catch(() => {}); } catch { /* Already closed or unavailable. */ }
  }
  function fail() {
    available = false;
    silence();
    close();
  }
  return {
    async unlock() {
      if (disposed || !available || muted) return;
      try {
        if (!context) {
          context = factory();
          if (!context) { fail(); return; }
          master = context.createGain();
          master.gain.value = 0.14;
          master.connect(context.destination);
        }
        if (context.state === 'suspended') await context.resume();
      } catch { fail(); }
    },
    play(cue: SoundCue) {
      if (disposed || !available || muted || !context || !master || context.state !== 'running') return;
      let oscillator: OscillatorNode | undefined;
      let envelope: GainNode | undefined;
      try {
        const sound = cues[cue];
        const now = context.currentTime;
        oscillator = context.createOscillator();
        envelope = context.createGain();
        oscillator.type = sound.type;
        oscillator.frequency.setValueAtTime(sound.from, now);
        oscillator.frequency.exponentialRampToValueAtTime(sound.to, now + sound.duration);
        envelope.gain.setValueAtTime(0.6, now);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + sound.duration);
        oscillator.connect(envelope);
        envelope.connect(master);
        voices.set(oscillator, envelope);
        const active = oscillator;
        const gain = envelope;
        oscillator.onended = () => {
          voices.delete(active);
          try { active.disconnect(); gain.disconnect(); } catch { /* Optional browser resource cleanup. */ }
        };
        oscillator.start(now);
        oscillator.stop(now + sound.duration);
        played[cue]++;
      } catch {
        try { oscillator?.disconnect(); envelope?.disconnect(); } catch { /* Failed partial initialization. */ }
        fail();
      }
    },
    setMuted(value: boolean) {
      muted = value;
      if (muted) silence();
      try { if (master) master.gain.value = muted ? 0 : 0.14; } catch { fail(); }
    },
    silence,
    getState(): AudioState {
      return { muted, available, ready: available && context?.state === 'running', played: { ...played } };
    },
    dispose() { disposed = true; silence(); close(); },
  };
}
