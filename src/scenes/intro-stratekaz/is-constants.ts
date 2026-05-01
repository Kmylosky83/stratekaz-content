// Intro StrateKaz — Constants v3
// Cambios v3:
// - Duración: 180 frames (6s) — antes 150
// - Logo PNG: 380px stories / 300px feed (presencia hero)
// - Heartbeat fuerte: 1 → 1.05 → 1 (antes 1 → 1.025 → 1)
// - NUEVO: Sistema de burst rays (rayos de marca explotando desde el logo)
// - Acto 5 expandido: morphing + crecimiento + heartbeat + burst + fade-out

import { BRAND } from "../../constants";

// ============================================================
// TIMING — 6 actos en 180 frames (6s a 30fps)
// ============================================================

export const IS_TIMING = {
  // Acto 1: Caos digital
  act1Start: 0,
  act1End: 18,

  // Acto 2: Trazo SVG vertical
  act2Start: 18,
  act2End: 42,

  // Acto 3: Construcción tipográfica
  act3Start: 36,
  strateKStart: 36,
  azStart: 60,
  act3End: 84,

  // Acto 4: Tagline + línea horizontal
  act4Start: 84,
  taglineStart: 84,
  taglineLineStart: 100,
  act4End: 120,

  // Acto 5A: MORPHING wordmark → logo (frames 120-135)
  morphStart: 120,
  morphMidpoint: 130,
  logoStart: 125,
  logoFullyVisible: 145,

  // Acto 5B: Logo crece y se establece (frames 135-150)
  logoSettle: 150,

  // Acto 5C: HEARTBEAT FUERTE + BURST RAYS (frames 150-165)
  heartbeatStart: 150,
  heartbeatPeak: 156, // climax — burst rays se disparan aquí
  burstStart: 152, // los rayos empiezan justo antes del peak
  burstPeak: 165,

  // Acto 5D: Fade-out elegante (frames 165-180)
  fadeOutStart: 165,
  act5End: 180,

  // Audio
  musicFadeInFrames: 15,
  musicFadeOutFrames: 35, // antes 30 — fade más suave para 6s
  musicVolume: 0.5,
} as const;

export const IS_DURATIONS = {
  total: 180, // 6 segundos
} as const;

// ============================================================
// DIMENSIONES POR FORMATO
// ============================================================

export const IS_DIMENSIONS = {
  stories: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 },
} as const;

export const IS_SAFE = {
  stories: { top: 150, bottom: 170, sides: 60 },
  feed: { top: 80, bottom: 80, sides: 60 },
} as const;

// ============================================================
// TIPOGRAFÍA — v3: logo grande hero
// ============================================================

export const IS_TYPOGRAPHY = {
  stories: {
    logoSize: 180,
    taglineSize: 44,
    logoPngHeight: 380, // v3 — antes 280, ahora hero size
  },
  feed: {
    logoSize: 152,
    taglineSize: 38,
    logoPngHeight: 300, // v3 — proporcional para feed
  },
} as const;

// ============================================================
// THEME TOKENS
// ============================================================

export type IntroTheme = "dark" | "light";
export type IntroFormat = "stories" | "feed";

export const themeTokens = (theme: IntroTheme) => ({
  bg: theme === "dark" ? BRAND.bgDeep : BRAND.white,
  bgSurface: theme === "dark" ? BRAND.bgSurface : "#f9fafb",
  bgGradientFrom: theme === "dark" ? BRAND.bgSurface : "#ffffff",
  bgGradientTo: theme === "dark" ? BRAND.bgDeep : "#f3f4f6",

  textHero: theme === "dark" ? BRAND.white : BRAND.bgCard,
  textMuted: theme === "dark" ? BRAND.textMuted : "rgba(10, 10, 10, 0.7)",
  textSubtle: theme === "dark" ? BRAND.textSubtle : "rgba(10, 10, 10, 0.5)",

  primary: BRAND.primary,
  primaryGlow: BRAND.primary,
  amber: BRAND.amber,

  particleOpacity: theme === "dark" ? 0.16 : 0.09,
  gridOpacity: theme === "dark" ? 0.04 : 0.025,
  glowOpacity: theme === "dark" ? 0.6 : 0.4,

  logoFile: theme === "dark" ? "logo-light.png" : "logo-dark.png",
  logoOpacity: theme === "dark" ? 0.95 : 1.0,
});

// ============================================================
// PARTICLES BACKGROUND — 24 partículas
// ============================================================

export const IS_PARTICLE_SEEDS = [
  { x: 0.12, y: 0.18, size: 5, color: "primary" },
  { x: 0.85, y: 0.22, size: 4, color: "amber" },
  { x: 0.34, y: 0.31, size: 6, color: "primary" },
  { x: 0.71, y: 0.45, size: 5, color: "primary" },
  { x: 0.18, y: 0.58, size: 4, color: "amber" },
  { x: 0.92, y: 0.64, size: 6, color: "primary" },
  { x: 0.27, y: 0.72, size: 5, color: "primary" },
  { x: 0.62, y: 0.81, size: 4, color: "amber" },
  { x: 0.45, y: 0.12, size: 5, color: "primary" },
  { x: 0.78, y: 0.89, size: 5, color: "primary" },
  { x: 0.08, y: 0.41, size: 4, color: "amber" },
  { x: 0.55, y: 0.65, size: 6, color: "primary" },
  { x: 0.23, y: 0.94, size: 4, color: "primary" },
  { x: 0.89, y: 0.36, size: 5, color: "amber" },
  { x: 0.41, y: 0.49, size: 6, color: "primary" },
  { x: 0.66, y: 0.18, size: 4, color: "primary" },
  { x: 0.15, y: 0.78, size: 5, color: "amber" },
  { x: 0.37, y: 0.06, size: 4, color: "primary" },
  { x: 0.58, y: 0.34, size: 6, color: "primary" },
  { x: 0.74, y: 0.53, size: 4, color: "amber" },
  { x: 0.04, y: 0.62, size: 5, color: "primary" },
  { x: 0.96, y: 0.81, size: 4, color: "primary" },
  { x: 0.49, y: 0.91, size: 5, color: "amber" },
  { x: 0.31, y: 0.52, size: 5, color: "primary" },
] as const;

export const IS_PARTICLE_MOTION = {
  floatSpeedX: 0.012,
  floatSpeedY: 0.010,
  floatRangeMax: 18,
} as const;

// ============================================================
// BURST RAYS — Sistema NUEVO v3
// 12 rayos que explotan radialmente desde el logo en el peak del heartbeat
// ============================================================

export const IS_BURST_CONFIG = {
  rayCount: 12, // 12 direcciones (como reloj)
  raysAlternateAmber: 3, // cada 3 rayos uno es amber, el resto magenta
  burstDistance: 600, // px que viaja cada rayo desde el centro
  burstDurationFrames: 28, // ~0.93s para llegar al destino
  raySize: 8, // tamaño base del rayo (núcleo brillante)
  rayTrailLength: 80, // longitud del trail luminoso detrás del rayo
} as const;

// ============================================================
// COPY
// ============================================================

export const IS_COPY = {
  brandFirst: "StrateK",
  brandLast: "az",
  tagline: "Consultoría 4.0",
} as const;
