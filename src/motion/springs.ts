// motion/springs.ts
// Tuned spring physics presets for `spring()` from Remotion.

import type { SpringConfig } from "remotion";

type Preset = Partial<SpringConfig>;

export const SPRING = {
  /** Fast & precise — UI snaps */
  snappy: { damping: 18, stiffness: 200, mass: 0.5 } satisfies Preset,

  /** Default smooth — most reveals */
  smooth: { damping: 14, stiffness: 100, mass: 0.7 } satisfies Preset,

  /** Soft, organic — ambient elements */
  gentle: { damping: 16, stiffness: 60, mass: 1.2 } satisfies Preset,

  /** Overshoots — playful entrances */
  bouncy: { damping: 8, stiffness: 100, mass: 0.6 } satisfies Preset,

  /** Heavy weighty reveals */
  heavy: { damping: 20, stiffness: 50, mass: 1.5 } satisfies Preset,

  /** Wobble — comedic, glitchy */
  wobble: { damping: 5, stiffness: 80, mass: 0.5 } satisfies Preset,

  /** Quick pop — toasts, badges */
  pop: { damping: 12, stiffness: 180, mass: 0.4 } satisfies Preset,
} as const;

export type SpringPreset = keyof typeof SPRING;
