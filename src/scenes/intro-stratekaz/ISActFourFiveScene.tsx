// ISActFourFiveScene.tsx — v3
// Cambios v3:
// - Logo PNG: 380px stories / 300px feed (hero size)
// - Heartbeat FUERTE: 1 → 1.05 → 1 (antes 1.025)
// - Glow del logo intensifica durante heartbeat (sincronizado con burst rays)
// - Fade-out elegante al final (frames 165-180)
// - Tagline + línea horizontal vuelven al primer plano después del morphing

import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
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

const TAGLINE_STAGGER = 2;

export const ISActFourFiveScene: React.FC<Props> = ({ theme, format }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const tokens = themeTokens(theme);
  const typo = IS_TYPOGRAPHY[format];

  // ============================================================
  // LOGO PNG — entrada con scale-up + fade-in
  // ============================================================
  const logoEntryProgress = spring({
    frame: frame - IS_TIMING.logoStart,
    fps,
    durationInFrames: 20,
    config: { damping: 14, stiffness: 90 },
  });
  const logoEntryOpacity = interpolate(logoEntryProgress, [0, 1], [0, tokens.logoOpacity]);
  const logoEntryScale = interpolate(logoEntryProgress, [0, 1], [0.55, 1]);
  const logoBlur = interpolate(logoEntryProgress, [0, 1], [10, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ============================================================
  // HEARTBEAT FUERTE v3 — peak 1.05 (antes 1.025)
  // ============================================================
  const heartbeatProgress = spring({
    frame: frame - IS_TIMING.heartbeatStart,
    fps,
    durationInFrames: 30,
    config: { damping: 7, stiffness: 180 }, // un poco más bouncy
  });
  // Curva: 0 → 1 → 0 (sube y baja)
  const heartbeatCurve =
    heartbeatProgress * 2 - heartbeatProgress * heartbeatProgress * 2;
  // 1 → 1.05 → 1
  const heartbeatScale = 1 + heartbeatCurve * 0.05;

  // Combinación: scale entrada × heartbeat
  const finalLogoScale = logoEntryScale * heartbeatScale;

  // ============================================================
  // FADE-OUT global del logo (frames 165-180)
  // ============================================================
  const logoFadeOut = interpolate(
    frame,
    [IS_TIMING.fadeOutStart, IS_TIMING.act5End],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    }
  );
  const logoOpacity = logoEntryOpacity * logoFadeOut;

  // ============================================================
  // GLOW del logo — pulsa con el heartbeat
  // ============================================================
  // Base glow durante toda la fase del logo
  const baseGlowOpacity = interpolate(
    frame,
    [IS_TIMING.logoStart, IS_TIMING.logoFullyVisible, IS_TIMING.fadeOutStart, IS_TIMING.act5End],
    [0, 0.5, 0.5, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  // Boost glow durante el heartbeat (pulsa al unísono)
  const glowBoost = heartbeatCurve * 0.4;
  const logoGlowOpacity = Math.min(baseGlowOpacity + glowBoost, 0.95);

  // ============================================================
  // TAGLINE
  // ============================================================
  const taglineLetters = IS_COPY.tagline.split("");
  const taglineWidth = typo.taglineSize * 7;

  // Tagline se desvanece sutilmente durante morphing y vuelve
  const taglineMorphFade = interpolate(
    frame,
    [IS_TIMING.morphStart, IS_TIMING.morphMidpoint, IS_TIMING.logoFullyVisible],
    [1, 0.4, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );
  const taglineFinalFade = interpolate(
    frame,
    [IS_TIMING.fadeOutStart, IS_TIMING.act5End],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    }
  );

  // ============================================================
  // LÍNEA HORIZONTAL bajo tagline
  // ============================================================
  const linePathProgress = interpolate(
    frame,
    [IS_TIMING.taglineLineStart, IS_TIMING.taglineLineStart + 16],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    }
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {/* ============================================================
          LOGO PNG EN CENTRO — hero con heartbeat fuerte
          ============================================================ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: logoOpacity,
          transform: `scale(${finalLogoScale})`,
          filter: `blur(${logoBlur}px)`,
        }}
      >
        {/* Glow magenta detrás del logo (pulsa con heartbeat) */}
        <div
          style={{
            position: "absolute",
            width: typo.logoPngHeight * 2.8,
            height: typo.logoPngHeight * 2.8,
            background: `radial-gradient(circle, ${tokens.primary} 0%, transparent 60%)`,
            filter: "blur(70px)",
            opacity: logoGlowOpacity,
          }}
        />
        <Img
          src={staticFile(tokens.logoFile)}
          style={{
            height: typo.logoPngHeight,
            width: "auto",
            objectFit: "contain",
            position: "relative",
            zIndex: 2,
          }}
        />
      </div>

      {/* ============================================================
          TAGLINE + LÍNEA — debajo del logo
          ============================================================ */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: height / 2 + typo.logoPngHeight * 0.7,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 18,
          opacity: taglineMorphFade * taglineFinalFade,
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: FONTS.body,
            fontWeight: 500,
            fontSize: typo.taglineSize,
            letterSpacing: "0.08em",
            color: tokens.textMuted,
          }}
        >
          {taglineLetters.map((letter, i) => {
            const letterFrame =
              frame - IS_TIMING.taglineStart - i * TAGLINE_STAGGER;
            const progress = spring({
              frame: letterFrame,
              fps,
              config: { damping: 200 },
            });
            const opacity = interpolate(progress, [0, 0.5, 1], [0, 0, 1]);
            const scale = interpolate(progress, [0, 1], [0.85, 1]);

            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity,
                  transform: `scale(${scale})`,
                  whiteSpace: "pre",
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        <svg width={taglineWidth} height={2} style={{ display: "block" }}>
          <line
            x1={0}
            y1={1}
            x2={taglineWidth}
            y2={1}
            stroke={tokens.primary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray={taglineWidth}
            strokeDashoffset={taglineWidth * (1 - linePathProgress)}
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
