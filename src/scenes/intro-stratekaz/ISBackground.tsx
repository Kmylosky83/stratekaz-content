// ISBackground.tsx — v3
// Cambios v3:
// - Particles de fondo se atenúan aún más durante el burst (frames 150-180)
//   para que los burst rays sean los protagonistas visuales del clímax

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { BRAND } from "../../constants";
import {
  IS_TIMING,
  IS_PARTICLE_SEEDS,
  IS_PARTICLE_MOTION,
  themeTokens,
  type IntroTheme,
  type IntroFormat,
} from "./is-constants";

type Props = {
  theme: IntroTheme;
  format: IntroFormat;
};

export const ISBackground: React.FC<Props> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = themeTokens(theme);

  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <AbsoluteFill>
      {/* Capa 1: Radial gradient base */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, ${tokens.bgGradientFrom} 0%, ${tokens.bgGradientTo} 80%)`,
        }}
      />

      {/* Capa 1.5: Atmospheric haze */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 30% 70%, ${tokens.primary}10 0%, transparent 50%), radial-gradient(circle at 70% 30%, ${tokens.amber}08 0%, transparent 45%)`,
          opacity: theme === "dark" ? 0.6 : 0.3,
          pointerEvents: "none",
        }}
      />

      {/* Capa 2: Grid sutil */}
      {(() => {
        const gridStroke = theme === "dark" ? BRAND.white : BRAND.bgDeep;
        return (
          <svg
            width={width}
            height={height}
            style={{ position: "absolute", inset: 0, opacity: tokens.gridOpacity }}
          >
            {Array.from({ length: Math.ceil(width / 100) }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * 100}
                y1={0}
                x2={i * 100}
                y2={height}
                stroke={gridStroke}
                strokeWidth={1}
              />
            ))}
            {Array.from({ length: Math.ceil(height / 100) }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * 100}
                x2={width}
                y2={i * 100}
                stroke={gridStroke}
                strokeWidth={1}
              />
            ))}
          </svg>
        );
      })()}

      {/* Capa 3: Particles convergentes + atenuación durante burst (v3) */}
      {IS_PARTICLE_SEEDS.map((p, i) => {
        const startX = p.x * width;
        const startY = p.y * height;

        const convergeProgress = interpolate(
          frame,
          [IS_TIMING.act1Start, IS_TIMING.act1End],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.inOut(Easing.cubic),
          }
        );

        // v3 — Curva de fade más sofisticada:
        // - Acto 2: visible (1.0)
        // - Acto 3-4: atenuado (0.3) — wordmark/tagline en foco
        // - Burst (frames 150-180): muy atenuado (0.1) — rays son protagonistas
        const fadeAfterConverge = interpolate(
          frame,
          [
            IS_TIMING.act2Start,
            IS_TIMING.act3Start + 12,
            IS_TIMING.heartbeatStart - 5,
            IS_TIMING.act5End,
          ],
          [1, 0.3, 0.3, 0.1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        const x = interpolate(convergeProgress, [0, 1], [startX, centerX]);
        const y = interpolate(convergeProgress, [0, 1], [startY, centerY]);

        const floatX =
          Math.sin((frame + i * 7) * IS_PARTICLE_MOTION.floatSpeedX) *
          IS_PARTICLE_MOTION.floatRangeMax *
          (1 - convergeProgress + 0.3);
        const floatY =
          Math.cos((frame + i * 11) * IS_PARTICLE_MOTION.floatSpeedY) *
          IS_PARTICLE_MOTION.floatRangeMax *
          (1 - convergeProgress + 0.3);

        const color = p.color === "amber" ? tokens.amber : tokens.primary;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x + floatX,
              top: y + floatY,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: color,
              opacity: tokens.particleOpacity * fadeAfterConverge * 5,
              filter: `blur(${1 + p.size * 0.2}px)`,
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}

      {/* Capa 4: Glow magenta central (atenuado durante burst para no competir) */}
      {(() => {
        const glowOpacity = interpolate(
          frame,
          [
            IS_TIMING.act3Start,
            IS_TIMING.azStart,
            IS_TIMING.act4End,
            IS_TIMING.heartbeatStart,
            IS_TIMING.act5End - 10,
          ],
          [
            0,
            tokens.glowOpacity,
            tokens.glowOpacity * 0.7,
            tokens.glowOpacity * 0.3, // atenuar durante burst
            0.2,
          ],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );
        return (
          <div
            style={{
              position: "absolute",
              left: centerX,
              top: centerY,
              width: 800,
              height: 800,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${tokens.primaryGlow} 0%, transparent 60%)`,
              filter: "blur(80px)",
              opacity: glowOpacity,
              pointerEvents: "none",
            }}
          />
        );
      })()}
    </AbsoluteFill>
  );
};
