// ISActThreeScene.tsx — v2
// Cambios v2:
// - Wordmark "StrateKaz" ahora hace MORPHING EXIT en frames 120-130
//   (scale down + fade out) preparando la transición al logo PNG
// - El heartbeat YA NO se aplica al wordmark (ahora se aplica al logo)
// - Todo lo demás (entrada de StrateK + az) se mantiene igual

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { FONTS } from "../../constants";
import {
  IS_TIMING,
  IS_TYPOGRAPHY,
  themeTokens,
  IS_COPY,
  type IntroTheme,
  type IntroFormat,
} from "./is-constants";

type Props = {
  theme: IntroTheme;
  format: IntroFormat;
};

const STAGGER_FRAMES = 3;

export const ISActThreeScene: React.FC<Props> = ({ theme, format }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tokens = themeTokens(theme);
  const typo = IS_TYPOGRAPHY[format];

  const strateKLetters = IS_COPY.brandFirst.split("");

  // ============================================================
  // MORPHING EXIT — el wordmark se transforma al logo (v2)
  // Frames 120-130: scale 1 → 0.55, opacity 1 → 0, slight blur out
  // ============================================================
  const morphProgress = interpolate(
    frame,
    [IS_TIMING.morphStart, IS_TIMING.morphMidpoint],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const morphScale = interpolate(morphProgress, [0, 1], [1, 0.55]);
  const morphOpacity = interpolate(morphProgress, [0, 1], [1, 0]);
  const morphBlur = interpolate(morphProgress, [0, 1], [0, 8]);

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily: FONTS.heading,
          fontWeight: 900,
          fontSize: typo.logoSize,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          transform: `scale(${morphScale})`,
          opacity: morphOpacity,
          filter: `blur(${morphBlur}px)`,
        }}
      >
        {/* "StrateK" — letter stagger con blur reverso */}
        {strateKLetters.map((letter, i) => {
          const letterFrame = frame - IS_TIMING.strateKStart - i * STAGGER_FRAMES;
          const progress = spring({
            frame: letterFrame,
            fps,
            config: { damping: 12, stiffness: 100 },
          });
          const blur = interpolate(progress, [0, 1], [20, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const translateY = interpolate(progress, [0, 1], [40, 0]);
          const opacity = interpolate(progress, [0, 1], [0, 1]);

          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                color: tokens.textHero,
                filter: `blur(${blur}px)`,
                transform: `translateY(${translateY}px)`,
                opacity,
                whiteSpace: "pre",
              }}
            >
              {letter}
            </span>
          );
        })}

        {/* "az" — entra desde la derecha con bounce magenta */}
        {(() => {
          const azProgress = spring({
            frame: frame - IS_TIMING.azStart,
            fps,
            config: { damping: 8, stiffness: 100 },
          });
          const translateX = interpolate(azProgress, [0, 1], [80, 0]);
          const scale = interpolate(azProgress, [0, 1], [0.6, 1]);
          const opacity = interpolate(azProgress, [0, 1], [0, 1]);
          const blur = interpolate(azProgress, [0, 1], [16, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <span
              style={{
                display: "inline-block",
                color: tokens.primary,
                transform: `translateX(${translateX}px) scale(${scale})`,
                transformOrigin: "left center",
                opacity,
                filter: `blur(${blur}px)`,
              }}
            >
              {IS_COPY.brandLast}
            </span>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};
