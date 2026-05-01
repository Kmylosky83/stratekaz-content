// shapes/BurstRays.tsx
// Radial burst of luminous rays from center — generic version (not coupled to
// any specific scene's constants). Use for impactful reveal moments.
//
// Each ray has: a trailing gradient line, a halo glow, and a core dot.
// Every Nth ray is amber instead of primary for visual rhythm.

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";

type Props = {
  /** Frame at which the burst starts. */
  startFrame: number;
  /** Duration of the burst expansion in frames. */
  durationInFrames?: number;
  /** Number of rays around the circle. */
  rayCount?: number;
  /** Primary color for most rays. */
  primaryColor?: string;
  /** Highlight every Nth ray with the amber color (1 = all amber, 12 = none). */
  amberEvery?: number;
  /** Color used for the highlighted rays. */
  amberColor?: string;
  /** Distance the rays travel from center (px). */
  burstDistance?: number;
  /** Size of the ray core (px). */
  raySize?: number;
  /** Optional override for center point (defaults to canvas center). */
  centerX?: number;
  centerY?: number;
};

export const BurstRays: React.FC<Props> = ({
  startFrame,
  durationInFrames = 30,
  rayCount = 12,
  primaryColor = "#ec268f",
  amberEvery = 3,
  amberColor = "#f59e0b",
  burstDistance = 600,
  raySize = 14,
  centerX,
  centerY,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  if (frame < startFrame) return null;

  const cx = centerX ?? width / 2;
  const cy = centerY ?? height / 2;

  const burstProgress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: rayCount }).map((_, i) => {
        const angle = (i * 360) / rayCount;
        const angleRad = (angle * Math.PI) / 180;
        const isAmber = i % amberEvery === 0;
        const color = isAmber ? amberColor : primaryColor;

        const distance = burstProgress * burstDistance;
        const coreX = cx + Math.cos(angleRad) * distance;
        const coreY = cy + Math.sin(angleRad) * distance;

        const opacity = interpolate(
          burstProgress,
          [0, 0.15, 0.7, 1],
          [0, 1, 0.6, 0],
        );
        const coreSize = interpolate(
          burstProgress,
          [0, 0.2, 1],
          [0, raySize * 1.4, raySize * 0.8],
        );
        const trailOpacity = opacity * 0.6;

        return (
          <div key={i}>
            {/* Trail line — gradient fading from transparent at center to opaque at core */}
            <svg
              width={width}
              height={height}
              style={{
                position: "absolute",
                inset: 0,
                opacity: trailOpacity,
              }}
            >
              <defs>
                <linearGradient
                  id={`burst-trail-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={coreX}
                  y2={coreY}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor={color} stopOpacity="0" />
                  <stop offset="70%" stopColor={color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={color} stopOpacity="1" />
                </linearGradient>
              </defs>
              <line
                x1={cx}
                y1={cy}
                x2={coreX}
                y2={coreY}
                stroke={`url(#burst-trail-${i})`}
                strokeWidth={3}
                strokeLinecap="round"
                style={{ filter: "blur(2px)" }}
              />
            </svg>

            {/* Halo glow */}
            <div
              style={{
                position: "absolute",
                left: coreX,
                top: coreY,
                width: coreSize * 4,
                height: coreSize * 4,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
                opacity: opacity * 0.7,
                filter: "blur(12px)",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Core dot */}
            <div
              style={{
                position: "absolute",
                left: coreX,
                top: coreY,
                width: coreSize,
                height: coreSize,
                borderRadius: "50%",
                background: color,
                opacity,
                filter: "blur(1px)",
                transform: "translate(-50%, -50%)",
                boxShadow: `0 0 16px ${color}`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
