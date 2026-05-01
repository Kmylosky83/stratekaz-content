// motion/interpolators.ts
// High-level animation helpers — abstract repetitive interpolate() patterns.

import {
  interpolate,
  spring as remotionSpring,
  type SpringConfig,
} from "remotion";
import { EASE } from "./easings";
import { SPRING, type SpringPreset } from "./springs";

const clamp = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

/** Fade in 0→1 between [startFrame, startFrame+duration]. */
export const fadeIn = (frame: number, startFrame = 0, duration = 15) =>
  interpolate(frame, [startFrame, startFrame + duration], [0, 1], clamp);

/** Fade out 1→0 between [startFrame, startFrame+duration]. */
export const fadeOut = (frame: number, startFrame: number, duration = 15) =>
  interpolate(frame, [startFrame, startFrame + duration], [1, 0], clamp);

/** Slide in horizontally — returns translateX (negative=from-left). */
export const slideInX = (
  frame: number,
  startFrame = 0,
  duration = 20,
  fromOffset = -100,
) =>
  interpolate(frame, [startFrame, startFrame + duration], [fromOffset, 0], {
    ...clamp,
    easing: EASE.expoOut,
  });

/** Slide in vertically — returns translateY (negative=from-top). */
export const slideInY = (
  frame: number,
  startFrame = 0,
  duration = 20,
  fromOffset = -50,
) =>
  interpolate(frame, [startFrame, startFrame + duration], [fromOffset, 0], {
    ...clamp,
    easing: EASE.expoOut,
  });

/** Scale in 0→1 with spring physics. */
export const scaleIn = (
  frame: number,
  fps: number,
  startFrame = 0,
  preset: SpringPreset = "smooth",
) =>
  remotionSpring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: SPRING[preset] as SpringConfig,
  });

/** Sinusoidal pulse oscillating min↔max with a given period. */
export const pulse = (frame: number, period = 30, min = 0.8, max = 1) => {
  const phase = (frame % period) / period;
  const sine = Math.sin(phase * Math.PI * 2);
  return min + ((sine + 1) / 2) * (max - min);
};

/** Returns the start frame for the i-th item in a stagger sequence. */
export const staggered = (i: number, startFrame: number, gap: number) =>
  startFrame + i * gap;

/** Reveal-then-hold-then-fade pattern (returns opacity 0→1→1→0). */
export const revealHoldFade = (
  frame: number,
  startFrame: number,
  revealDuration: number,
  holdDuration: number,
  fadeDuration: number,
) => {
  const fadeStart = startFrame + revealDuration + holdDuration;
  const fadeEnd = fadeStart + fadeDuration;
  return interpolate(
    frame,
    [startFrame, startFrame + revealDuration, fadeStart, fadeEnd],
    [0, 1, 1, 0],
    clamp,
  );
};
