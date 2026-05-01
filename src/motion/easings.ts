// motion/easings.ts
// Curated easing curves for high-quality motion.

import { Easing } from "remotion";

export { Easing };

export const EASE = {
  /** Material smooth — most general use */
  smooth: Easing.bezier(0.4, 0.0, 0.2, 1),

  /** Accelerate — leaving the screen */
  swiftIn: Easing.bezier(0.55, 0.085, 0.68, 0.53),

  /** Decelerate — entering the screen */
  swiftOut: Easing.bezier(0.25, 0.46, 0.45, 0.94),

  /** Overshoot — playful pop */
  bounce: Easing.bezier(0.68, -0.55, 0.265, 1.55),

  /** Snap — instant settle */
  snappy: Easing.bezier(0.0, 0.0, 0.2, 1),

  /** Cinematic — slow & deliberate */
  cinematic: Easing.bezier(0.83, 0, 0.17, 1),

  /** Expo decelerate — premium feel */
  expoOut: Easing.bezier(0.16, 1, 0.3, 1),

  /** Expo accelerate — leaving fast */
  expoIn: Easing.bezier(0.7, 0, 0.84, 0),

  /** Linear — constant velocity */
  linear: Easing.linear,
} as const;
