// ISBurstRays.tsx — v3
// Sistema de "burst rays" — rayos de marca que explotan radialmente desde el logo
// Sincronizan con el peak del heartbeat (frame 156)
//
// Cada rayo:
// - Sale desde el centro exacto en una de 12 direcciones
// - Tiene un núcleo brillante + trail luminoso detrás
// - Hace scale-up + fade-out mientras se aleja
// - Color magenta principal, amber cada 3 rayos

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import {
  IS_TIMING,
  IS_BURST_CONFIG,
  themeTokens,
  type IntroTheme,
} from "./is-constants";

type Props = {
  theme: IntroTheme;
};

export const ISBurstRays: React.FC<Props> = ({ theme }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const tokens = themeTokens(theme);

  const centerX = width / 2;
  const centerY = height / 2;

  // No renderizar nada antes de que arranque el burst
  if (frame < IS_TIMING.burstStart) return null;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: IS_BURST_CONFIG.rayCount }).map((_, i) => {
        // 12 direcciones equiespaciadas (como reloj)
        const angle = (i * 360) / IS_BURST_CONFIG.rayCount;
        const angleRad = (angle * Math.PI) / 180;

        // Color: cada N rayos uno es amber, el resto magenta
        const isAmber = i % IS_BURST_CONFIG.raysAlternateAmber === 0;
        const color = isAmber ? tokens.amber : tokens.primary;

        // Progreso del rayo (0 al inicio del burst, 1 al peak)
        const burstProgress = interpolate(
          frame,
          [IS_TIMING.burstStart, IS_TIMING.burstStart + IS_BURST_CONFIG.burstDurationFrames],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.cubic),
          }
        );

        // Distancia recorrida desde el centro
        const distance = burstProgress * IS_BURST_CONFIG.burstDistance;

        // Posición actual del núcleo del rayo
        const coreX = centerX + Math.cos(angleRad) * distance;
        const coreY = centerY + Math.sin(angleRad) * distance;

        // Opacidad: fade out conforme se aleja
        const opacity = interpolate(
          burstProgress,
          [0, 0.15, 0.7, 1],
          [0, 1, 0.6, 0]
        );

        // Tamaño del núcleo: crece y luego se mantiene
        const coreSize = interpolate(burstProgress, [0, 0.2, 1], [
          0,
          IS_BURST_CONFIG.raySize * 1.4,
          IS_BURST_CONFIG.raySize * 0.8,
        ]);

        // Trail: línea desde el centro hasta el núcleo, fade del trail
        const trailOpacity = opacity * 0.6;

        // Fade-out global cuando el video llega a fadeOutStart
        const globalFade = interpolate(
          frame,
          [IS_TIMING.fadeOutStart, IS_TIMING.act5End],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        );

        return (
          <div key={i}>
            {/* Trail (línea luminosa detrás del rayo) */}
            <svg
              width={width}
              height={height}
              style={{
                position: "absolute",
                inset: 0,
                opacity: trailOpacity * globalFade,
              }}
            >
              <defs>
                <linearGradient
                  id={`ray-trail-${i}`}
                  x1={centerX}
                  y1={centerY}
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
                x1={centerX}
                y1={centerY}
                x2={coreX}
                y2={coreY}
                stroke={`url(#ray-trail-${i})`}
                strokeWidth={3}
                strokeLinecap="round"
                style={{
                  filter: `blur(2px)`,
                }}
              />
            </svg>

            {/* Halo del núcleo (glow blur) */}
            <div
              style={{
                position: "absolute",
                left: coreX,
                top: coreY,
                width: coreSize * 4,
                height: coreSize * 4,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
                opacity: opacity * 0.7 * globalFade,
                filter: "blur(12px)",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Núcleo brillante del rayo */}
            <div
              style={{
                position: "absolute",
                left: coreX,
                top: coreY,
                width: coreSize,
                height: coreSize,
                borderRadius: "50%",
                background: color,
                opacity: opacity * globalFade,
                filter: `blur(1px)`,
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
