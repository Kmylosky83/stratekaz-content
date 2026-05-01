// motion/timing.ts
// Frame & duration presets for animations (assumes 30fps default).

export const FPS = 30;

/**
 * Common durations expressed in frames at 30fps.
 * (1 frame ≈ 33ms, 30 frames = 1s)
 */
export const DURATION = {
  instant: 5, // ~167ms — tap, snap
  quick: 10, // ~333ms — fast UI
  short: 15, // ~500ms — standard fade
  medium: 30, // 1s    — comfortable reveal
  long: 60, // 2s    — held emphasis
  extraLong: 120, // 4s    — atmospheric
} as const;

/**
 * Named timings for common animation kinds.
 */
export const TIMING = {
  fadeIn: 15,
  fadeOut: 15,
  slideIn: 20,
  scaleIn: 25,
  springIn: 30,
  textReveal: 25,
  cardReveal: 18,
  burstReveal: 30,
  cameraMove: 40,
} as const;

/**
 * Stagger gaps for sequenced reveals (e.g., list items).
 */
export const STAGGER = {
  fast: 4, // 133ms between items
  normal: 8, // 267ms
  slow: 15, // 500ms
  cinematic: 25, // 833ms — dramatic pause
} as const;

export const secondsToFrames = (seconds: number, fps = FPS) =>
  Math.round(seconds * fps);

export const framesToSeconds = (frames: number, fps = FPS) => frames / fps;
