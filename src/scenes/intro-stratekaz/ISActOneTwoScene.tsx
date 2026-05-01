// ISActOneTwoScene.tsx
// Actos 1+2 del intro StrateKaz (frames 0-42)
// - Acto 1 (0-18): caos digital — particles convergen (manejado en ISBackground)
// - Acto 2 (18-42): trazo vertical magenta dibujado con strokeDasharray

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { IS_TIMING, themeTokens, type IntroTheme } from "./is-constants";

type Props = {
  theme: IntroTheme;
};

export const ISActOneTwoScene: React.FC<Props> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = themeTokens(theme);

  const centerX = width / 2;

  // Trazo vertical: 200px arriba del centro hasta 200px abajo del centro
  const lineY1 = height / 2 - 200;
  const lineY2 = height / 2 + 200;
  const lineLength = lineY2 - lineY1;

  // Progreso del path drawing
  const drawProgress = interpolate(
    frame,
    [IS_TIMING.act2Start, IS_TIMING.act2End],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1), // swift-out elegante
    }
  );

  // El trazo se desvanece cuando empieza la tipografía (acto 3)
  const fadeOut = interpolate(
    frame,
    [IS_TIMING.act3Start + 10, IS_TIMING.azStart - 4],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // Glow detrás del trazo
  const glowOpacity = interpolate(
    frame,
    [IS_TIMING.act2Start, IS_TIMING.act2End, IS_TIMING.act3Start + 10],
    [0, 0.5, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* Glow blur magenta detrás de la línea */}
      <div
        style={{
          position: "absolute",
          left: centerX - 60,
          top: lineY1 - 40,
          width: 120,
          height: lineLength + 80,
          background: `radial-gradient(ellipse, ${tokens.primary} 0%, transparent 70%)`,
          filter: "blur(40px)",
          opacity: glowOpacity,
        }}
      />

      {/* SVG path drawing */}
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: fadeOut }}
      >
        <line
          x1={centerX}
          y1={lineY1}
          x2={centerX}
          y2={lineY2}
          stroke={tokens.primary}
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={lineLength}
          strokeDashoffset={lineLength * (1 - drawProgress)}
        />

        {/* Punto luminoso en la cabeza del trazo (efecto premium) */}
        {drawProgress > 0 && drawProgress < 1 && (
          <circle
            cx={centerX}
            cy={lineY1 + lineLength * drawProgress}
            r={8}
            fill={tokens.primary}
            opacity={0.9}
          >
            {/* Halo del punto */}
          </circle>
        )}
        {drawProgress > 0 && drawProgress < 1 && (
          <circle
            cx={centerX}
            cy={lineY1 + lineLength * drawProgress}
            r={20}
            fill={tokens.primary}
            opacity={0.3}
            filter="blur(8px)"
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
