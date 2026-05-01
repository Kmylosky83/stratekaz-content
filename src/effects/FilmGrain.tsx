// effects/FilmGrain.tsx
// Animated film grain using SVG turbulence + @remotion/noise for jitter.
// Cheaper than NoiseOverlay because it leverages a single feTurbulence filter.

import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

type Props = {
  seed?: number;
  /** Animation jitter speed (units per frame). */
  speed?: number;
  /** Grain intensity 0..1 (controls overlay opacity). */
  intensity?: number;
  /** Tint color of the grain. */
  color?: string;
  /** Base frequency of the grain (higher = finer). */
  frequency?: number;
};

export const FilmGrain: React.FC<Props> = ({
  seed = 7,
  speed = 0.5,
  intensity = 0.08,
  color = "#ffffff",
  frequency = 0.9,
}) => {
  const frame = useCurrentFrame();

  // Animate grain by changing the seed every frame.
  const filterSeed = seed + Math.floor(frame * speed * 2);

  // Subtle position jitter using noise.
  const offsetX = noise2D(seed, frame * speed, 0) * 8;
  const offsetY = noise2D(seed + 100, 0, frame * speed) * 8;

  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: intensity,
        mixBlendMode: "overlay",
      }}
    >
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <filter id={`grain-${seed}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={frequency}
              numOctaves={2}
              seed={filterSeed}
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 0 1
                      0 0 0 1 0"
            />
          </filter>
        </defs>
        <rect
          x={offsetX - 20}
          y={offsetY - 20}
          width="120%"
          height="120%"
          fill={color}
          filter={`url(#grain-${seed})`}
        />
      </svg>
    </AbsoluteFill>
  );
};
