// effects/NoiseOverlay.tsx
// Organic procedural noise overlay using @remotion/noise.
// Creates an SVG grid of cells whose alpha is driven by a noise field —
// good for "static texture" looks (film, dust, atmospheric grain).

import { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

type Props = {
  /** Seed for the noise field. */
  seed?: number;
  /** Number of cells per axis (density × density grid). */
  density?: number;
  /** Animation speed (units per frame). */
  speed?: number;
  /** Overall opacity 0..1. */
  opacity?: number;
  /** Color of the noise (hex/rgba). */
  color?: string;
};

export const NoiseOverlay: React.FC<Props> = ({
  seed = 1,
  density = 40,
  speed = 0.05,
  opacity = 0.15,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();

  // Pre-compute cell coordinates (memoized).
  const cells = useMemo(() => {
    const arr: { x: number; y: number; baseAlpha: number }[] = [];
    for (let y = 0; y < density; y++) {
      for (let x = 0; x < density; x++) {
        const baseAlpha = Math.abs(noise2D(seed, x * 0.3, y * 0.3));
        arr.push({ x, y, baseAlpha });
      }
    }
    return arr;
  }, [density, seed]);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity }}>
      <svg
        viewBox={`0 0 ${density} ${density}`}
        preserveAspectRatio="none"
        style={{ width: "100%", height: "100%" }}
      >
        {cells.map(({ x, y, baseAlpha }, i) => {
          const t = frame * speed;
          const a = Math.abs(noise2D(seed + 100, x * 0.5 + t, y * 0.5 + t));
          const alpha = Math.min(1, baseAlpha * a * 1.5);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={1}
              height={1}
              fill={color}
              opacity={alpha}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
