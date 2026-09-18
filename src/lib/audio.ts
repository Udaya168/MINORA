/**
 * Web Audio Synthesizer helpers for MINORA Admin Portal audio alerts
 */

export const triggerOrderAlertSound = (enabled = true) => {
  if (!enabled) return;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const t = ctx.currentTime;

    const playTone = (freq: number, offset: number) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + offset);
        gain.gain.setValueAtTime(0.2, t + offset);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + offset + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + offset);
        osc.stop(t + offset + 0.35);
      } catch (e) {}
    };

    // ding (587.33Hz) -> pause -> ding (880Hz) -> pause -> ding (1174.66Hz)
    playTone(587.33, 0);       // D5
    playTone(880, 0.25);       // A5
    playTone(1174.66, 0.5);    // D6

    setTimeout(() => {
      try {
        ctx.close();
      } catch (e) {}
    }, 1200);
  } catch (err) {
    console.warn("[AUDIO] Alert sound notice:", err);
  }
};

export const playOrderAcceptedSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const t = ctx.currentTime;

    // Ascending major chime chord: C5 (523.25Hz), E5 (659.25Hz), G5 (783.99Hz)
    const tones = [523.25, 659.25, 783.99];
    tones.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + idx * 0.1);
        gain.gain.setValueAtTime(0.18, t + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.1);
        osc.stop(t + idx * 0.1 + 0.4);
      } catch (e) {}
    });

    setTimeout(() => {
      try {
        ctx.close();
      } catch (e) {}
    }, 1000);
  } catch (err) {
    console.warn("[AUDIO] Accepted sound error:", err);
  }
};

export const playOrderRejectedSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    const t = ctx.currentTime;

    // Soft low descending double tone: G4 (392Hz), D4 (293.66Hz)
    const tones = [392.00, 293.66];
    tones.forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t + idx * 0.15);
        gain.gain.setValueAtTime(0.2, t + idx * 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.15 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t + idx * 0.15);
        osc.stop(t + idx * 0.15 + 0.35);
      } catch (e) {}
    });

    setTimeout(() => {
      try {
        ctx.close();
      } catch (e) {}
    }, 1000);
  } catch (err) {
    console.warn("[AUDIO] Rejected sound error:", err);
  }
};
