// effects/CameraShake.tsx
// Wraps children with an animated translate+rotate to simulate camera shake.
// Drives motion via @remotion/noise so it's smooth, deterministic, and
// natural-looking (no random jitter that feels mechanical).

import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

type Props = {
  children: ReactNode;
  /** Seed for the noise field. */
  seed?: number;
  /** Max pixel offset (intensity). */
  amplitude?: number;
  /** Animation speed (higher = faster shake). */
  speed?: number;
  /** Duration of shake in frames at full strength (0 = always on). */
  durationInFrames?: number;
  /** Frame at which the shake starts. */
  startFrame?: number;
  /** Max rotation in degrees. */
  rotationAmplitude?: number;
};

export const CameraShake: React.FC<Props> = ({
  children,
  seed = 1,
  amplitude = 8,
  speed = 0.2,
  durationInFrames = 0,
  startFrame = 0,
  rotationAmplitude = 0.5,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;

  // Envelope: full strength during duration, fade out after.
  let envelope = 1;
  if (elapsed < 0) envelope = 0;
  else if (durationInFrames > 0 && elapsed > durationInFrames) {
    envelope = Math.max(0, 1 - (elapsed - durationInFrames) / 10);
  }

  const t = elapsed * speed;
  const dx = noise2D(seed, t, 0) * amplitude * envelope;
  const dy = noise2D(seed + 50, 0, t) * amplitude * envelope;
  const rotZ = noise2D(seed + 100, t, t) * rotationAmplitude * envelope;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${dx}px, ${dy}px) rotate(${rotZ}deg)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
