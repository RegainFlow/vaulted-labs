export type SfxName =
  | "ui_select"
  | "ui_close"
  | "ui_locked"
  | "vault_open"
  | "vault_scan_start"
  | "vault_lock"
  | "vault_win_common"
  | "vault_win_uncommon"
  | "vault_win_rare"
  | "vault_win_legendary"
  | "bonus_round_enter"
  | "bonus_round_tick"
  | "bonus_round_win"
  | "battle_enter"
  | "battle_hit"
  | "battle_win"
  | "battle_loss"
  | "sell_item"
  | "cashout"
  | "ship_item"
  | "equip_item"
  | "free_spin_awarded"
  | "foundry_open"
  | "foundry_forge";

const AUDIO_MUTED_KEY = "vaultedlabs_audio_muted";
const AUDIO_CHANGE_EVENT = "vaultedlabs:audio-muted-changed";

type ToneShape = "sine" | "triangle" | "square" | "sawtooth";

interface ToneStep {
  frequency: number;
  endFrequency?: number;
  durationMs: number;
  gain: number;
  type?: ToneShape;
  delayMs?: number;
}

interface SoundRecipe {
  tones: ToneStep[];
}

const RECIPES: Record<SfxName, SoundRecipe> = {
  ui_select: {
    tones: [
      { frequency: 780, endFrequency: 1160, durationMs: 55, gain: 0.03, type: "square" },
      { frequency: 1180, endFrequency: 1560, durationMs: 70, gain: 0.022, type: "triangle", delayMs: 32 },
    ],
  },
  ui_close: {
    tones: [
      { frequency: 720, endFrequency: 520, durationMs: 72, gain: 0.026, type: "triangle" },
      { frequency: 480, endFrequency: 300, durationMs: 94, gain: 0.02, type: "square", delayMs: 26 },
    ],
  },
  ui_locked: {
    tones: [
      { frequency: 240, endFrequency: 150, durationMs: 92, gain: 0.042, type: "square" },
      { frequency: 190, endFrequency: 120, durationMs: 120, gain: 0.03, type: "sawtooth", delayMs: 38 },
    ],
  },
  vault_open: {
    tones: [
      { frequency: 110, endFrequency: 88, durationMs: 135, gain: 0.042, type: "square" },
      { frequency: 220, endFrequency: 520, durationMs: 180, gain: 0.03, type: "sawtooth", delayMs: 24 },
      { frequency: 880, endFrequency: 1240, durationMs: 130, gain: 0.014, type: "triangle", delayMs: 78 },
    ],
  },
  vault_scan_start: {
    tones: [
      { frequency: 126, endFrequency: 88, durationMs: 120, gain: 0.05, type: "square" },
      { frequency: 260, endFrequency: 1040, durationMs: 220, gain: 0.026, type: "sawtooth", delayMs: 18 },
      { frequency: 1480, endFrequency: 2080, durationMs: 82, gain: 0.018, type: "triangle", delayMs: 132 },
    ],
  },
  vault_lock: {
    tones: [
      { frequency: 96, endFrequency: 80, durationMs: 128, gain: 0.054, type: "square" },
      { frequency: 340, endFrequency: 210, durationMs: 118, gain: 0.028, type: "sawtooth", delayMs: 14 },
      { frequency: 1180, endFrequency: 1620, durationMs: 100, gain: 0.016, type: "triangle", delayMs: 48 },
    ],
  },
  vault_win_common: {
    tones: [
      { frequency: 420, endFrequency: 520, durationMs: 92, gain: 0.026, type: "square" },
      { frequency: 760, endFrequency: 980, durationMs: 110, gain: 0.018, type: "triangle", delayMs: 44 },
    ],
  },
  vault_win_uncommon: {
    tones: [
      { frequency: 360, endFrequency: 520, durationMs: 105, gain: 0.032, type: "square" },
      { frequency: 620, endFrequency: 920, durationMs: 132, gain: 0.024, type: "sawtooth", delayMs: 32 },
      { frequency: 1140, endFrequency: 1420, durationMs: 126, gain: 0.016, type: "triangle", delayMs: 92 },
    ],
  },
  vault_win_rare: {
    tones: [
      { frequency: 144, endFrequency: 110, durationMs: 128, gain: 0.04, type: "square" },
      { frequency: 420, endFrequency: 760, durationMs: 138, gain: 0.026, type: "sawtooth", delayMs: 18 },
      { frequency: 760, endFrequency: 1180, durationMs: 164, gain: 0.024, type: "square", delayMs: 72 },
      { frequency: 1320, endFrequency: 1820, durationMs: 192, gain: 0.014, type: "triangle", delayMs: 126 },
    ],
  },
  vault_win_legendary: {
    tones: [
      { frequency: 98, endFrequency: 82, durationMs: 150, gain: 0.056, type: "square" },
      { frequency: 220, endFrequency: 680, durationMs: 210, gain: 0.028, type: "sawtooth", delayMs: 18 },
      { frequency: 540, endFrequency: 1120, durationMs: 220, gain: 0.028, type: "square", delayMs: 64 },
      { frequency: 1180, endFrequency: 1960, durationMs: 260, gain: 0.02, type: "triangle", delayMs: 138 },
      { frequency: 1640, endFrequency: 2480, durationMs: 320, gain: 0.014, type: "triangle", delayMs: 232 },
    ],
  },
  bonus_round_enter: {
    tones: [
      { frequency: 132, endFrequency: 100, durationMs: 120, gain: 0.048, type: "square" },
      { frequency: 200, endFrequency: 920, durationMs: 220, gain: 0.026, type: "sawtooth", delayMs: 28 },
      { frequency: 920, endFrequency: 1520, durationMs: 180, gain: 0.018, type: "triangle", delayMs: 118 },
    ],
  },
  bonus_round_tick: {
    tones: [
      { frequency: 860, endFrequency: 640, durationMs: 62, gain: 0.03, type: "square" },
      { frequency: 1420, endFrequency: 1160, durationMs: 44, gain: 0.01, type: "triangle", delayMs: 8 },
    ],
  },
  bonus_round_win: {
    tones: [
      { frequency: 122, endFrequency: 96, durationMs: 130, gain: 0.045, type: "square" },
      { frequency: 380, endFrequency: 780, durationMs: 155, gain: 0.028, type: "sawtooth", delayMs: 24 },
      { frequency: 820, endFrequency: 1380, durationMs: 194, gain: 0.022, type: "square", delayMs: 86 },
      { frequency: 1440, endFrequency: 2080, durationMs: 230, gain: 0.016, type: "triangle", delayMs: 158 },
    ],
  },
  battle_enter: {
    tones: [
      { frequency: 96, endFrequency: 84, durationMs: 132, gain: 0.05, type: "square" },
      { frequency: 168, endFrequency: 280, durationMs: 146, gain: 0.028, type: "sawtooth", delayMs: 22 },
      { frequency: 620, endFrequency: 920, durationMs: 118, gain: 0.012, type: "triangle", delayMs: 104 },
    ],
  },
  battle_hit: {
    tones: [
      { frequency: 118, endFrequency: 92, durationMs: 72, gain: 0.046, type: "square" },
      { frequency: 420, endFrequency: 190, durationMs: 86, gain: 0.018, type: "sawtooth", delayMs: 6 },
    ],
  },
  battle_win: {
    tones: [
      { frequency: 220, endFrequency: 320, durationMs: 105, gain: 0.03, type: "square" },
      { frequency: 520, endFrequency: 880, durationMs: 140, gain: 0.024, type: "sawtooth", delayMs: 36 },
      { frequency: 920, endFrequency: 1420, durationMs: 188, gain: 0.018, type: "triangle", delayMs: 112 },
    ],
  },
  battle_loss: {
    tones: [
      { frequency: 260, endFrequency: 210, durationMs: 92, gain: 0.03, type: "square" },
      { frequency: 210, endFrequency: 150, durationMs: 124, gain: 0.026, type: "sawtooth", delayMs: 38 },
      { frequency: 170, endFrequency: 112, durationMs: 168, gain: 0.018, type: "triangle", delayMs: 98 },
    ],
  },
  sell_item: {
    tones: [
      { frequency: 520, endFrequency: 820, durationMs: 68, gain: 0.024, type: "square" },
      { frequency: 980, endFrequency: 1360, durationMs: 88, gain: 0.018, type: "triangle", delayMs: 34 },
    ],
  },
  cashout: {
    tones: [
      { frequency: 460, endFrequency: 720, durationMs: 84, gain: 0.026, type: "square" },
      { frequency: 940, endFrequency: 1380, durationMs: 98, gain: 0.02, type: "triangle", delayMs: 42 },
      { frequency: 1480, endFrequency: 2040, durationMs: 126, gain: 0.016, type: "triangle", delayMs: 88 },
    ],
  },
  ship_item: {
    tones: [
      { frequency: 320, endFrequency: 440, durationMs: 86, gain: 0.024, type: "square" },
      { frequency: 620, endFrequency: 980, durationMs: 108, gain: 0.018, type: "triangle", delayMs: 38 },
    ],
  },
  equip_item: {
    tones: [
      { frequency: 580, endFrequency: 860, durationMs: 72, gain: 0.024, type: "square" },
      { frequency: 1080, endFrequency: 1460, durationMs: 98, gain: 0.016, type: "triangle", delayMs: 36 },
    ],
  },
  free_spin_awarded: {
    tones: [
      { frequency: 620, endFrequency: 980, durationMs: 96, gain: 0.026, type: "square" },
      { frequency: 1040, endFrequency: 1460, durationMs: 110, gain: 0.022, type: "sawtooth", delayMs: 38 },
      { frequency: 1520, endFrequency: 2260, durationMs: 146, gain: 0.016, type: "triangle", delayMs: 96 },
    ],
  },
  foundry_open: {
    tones: [
      { frequency: 132, endFrequency: 110, durationMs: 96, gain: 0.038, type: "square" },
      { frequency: 240, endFrequency: 620, durationMs: 156, gain: 0.024, type: "sawtooth", delayMs: 24 },
    ],
  },
  foundry_forge: {
    tones: [
      { frequency: 108, endFrequency: 92, durationMs: 126, gain: 0.046, type: "square" },
      { frequency: 220, endFrequency: 740, durationMs: 190, gain: 0.026, type: "sawtooth", delayMs: 24 },
      { frequency: 760, endFrequency: 1240, durationMs: 170, gain: 0.018, type: "triangle", delayMs: 118 },
    ],
  },
};

let audioContext: AudioContext | null = null;

function canUseAudio() {
  return typeof window !== "undefined";
}

function getAudioContext() {
  if (!canUseAudio()) return null;
  if (audioContext) return audioContext;

  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextCtor) return null;
  audioContext = new AudioContextCtor();
  return audioContext;
}

function scheduleTone(
  ctx: AudioContext,
  step: ToneStep,
  startAt: number
) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = step.type ?? "triangle";
  oscillator.frequency.setValueAtTime(step.frequency, startAt);
  if (typeof step.endFrequency === "number") {
    oscillator.frequency.exponentialRampToValueAtTime(
      Math.max(step.endFrequency, 1),
      startAt + step.durationMs / 1000
    );
  }

  const attackEnd = startAt + 0.008;
  const releaseStart = startAt + step.durationMs / 1000;

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(step.gain, attackEnd);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, releaseStart);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(releaseStart + 0.02);
}

function playSynth(recipe: SoundRecipe) {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  const start = ctx.currentTime + 0.005;
  for (const tone of recipe.tones) {
    scheduleTone(ctx, tone, start + (tone.delayMs ?? 0) / 1000);
  }
}

export function isAudioMuted() {
  if (!canUseAudio()) return true;

  try {
    return window.localStorage.getItem(AUDIO_MUTED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setAudioMuted(muted: boolean) {
  if (!canUseAudio()) return;

  try {
    window.localStorage.setItem(AUDIO_MUTED_KEY, String(muted));
  } catch {
    // Ignore storage failures.
  }

  window.dispatchEvent(
    new CustomEvent<boolean>(AUDIO_CHANGE_EVENT, { detail: muted })
  );
}

export function toggleAudioMuted() {
  const next = !isAudioMuted();
  setAudioMuted(next);
  return next;
}

export function subscribeAudioPreference(listener: (muted: boolean) => void) {
  if (!canUseAudio()) return () => undefined;

  const handleChange = (event: Event) => {
    const detail = (event as CustomEvent<boolean>).detail;
    listener(typeof detail === "boolean" ? detail : isAudioMuted());
  };

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUDIO_MUTED_KEY) {
      listener(event.newValue === "true");
    }
  };

  window.addEventListener(AUDIO_CHANGE_EVENT, handleChange as EventListener);
  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener(
      AUDIO_CHANGE_EVENT,
      handleChange as EventListener
    );
    window.removeEventListener("storage", handleStorage);
  };
}

export function playSfx(name: SfxName) {
  if (!canUseAudio() || isAudioMuted()) return;

  const recipe = RECIPES[name];
  if (!recipe) return;
  playSynth(recipe);
}
