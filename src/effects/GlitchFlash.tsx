// effects/GlitchFlash.tsx
// Brief glitch flash for impact moments — applies frame jitter, hue rotation,
// brightness flash, and contrast pump that decay over the duration.

import type { ReactNode } from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

type Props = {
  children: ReactNode;
  /** Frame at which the glitch starts. */
  startFrame: number;
  /** Glitch duration in frames. */
  durationInFrames?: number;
  /** Intensity multiplier 0..2. */
  intensity?: number;
};

export const GlitchFlash: React.FC<Props> = ({
  children,
  startFrame,
  durationInFrames = 8,
  intensity = 1,
}) => {
  const frame = useCurrentFrame();
  const elapsed = frame - startFrame;
  const isActive = elapsed >= 0 && elapsed < durationInFrames;

  if (!isActive) {
    return <AbsoluteFill>{children}</AbsoluteFill>;
  }

  const decay = interpolate(elapsed, [0, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pseudo-random per frame (LCG).
  const r1 = ((frame * 9301 + 49297) % 233280) / 233280;
  const r2 = ((frame * 1664525 + 1013904223) >>> 0) / 4294967296;

  const dx = (r1 - 0.5) * 16 * intensity * decay;
  const dy = (r2 - 0.5) * 16 * intensity * decay;
  const brightness = 1 + Math.abs(r1 - 0.5) * 0.5 * decay;
  const hueRotate = (r1 - 0.5) * 60 * decay;
  const contrast = 1 + 0.3 * decay;

  return (
    <AbsoluteFill
      style={{
        transform: `translate(${dx}px, ${dy}px)`,
        filter: `brightness(${brightness}) hue-rotate(${hueRotate}deg) contrast(${contrast})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
