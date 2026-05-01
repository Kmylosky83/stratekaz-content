// scenes/coldbrew/coldbrew-tokens.ts
// Custom palette and timing tokens for the Cold Brew tutorial video.
// INTENTIONALLY decoupled from StrateKaz brand tokens — this video has
// its own warm minimalist identity (cream + espresso + ice blue).

import { FONTS } from "../../constants";

export const CB = {
  // Backgrounds — warm cream tones
  cream: "#F5E6D3",
  creamDeep: "#E8D5BC",
  creamSoft: "#FAF1E4",
  white: "#FFFFFF",

  // Coffee — espresso browns
  espresso: "#2D1810",
  espressoMid: "#4A2C1A",
  espressoLight: "#7A5340",

  // Accents
  amber: "#C8956D",
  amberDeep: "#A6764F",
  iceBlue: "#A4D4F0",
  iceDeep: "#7CBCE0",

  // Charcoal for body text
  charcoal: "#1C1B1F",
  charcoalSoft: "#3D3D42",

  // Step badge background
  stepBg: "#3E2723",
  stepText: "#F5E6D3",

  // Subtle shadow
  shadowSoft: "rgba(45, 24, 16, 0.08)",
  shadowMedium: "rgba(45, 24, 16, 0.15)",
} as const;

export const CB_FONTS = {
  display: FONTS.heading,
  body: FONTS.body,
  mono: "'JetBrains Mono', 'Fira Code', monospace",
} as const;

// Per-scene durations in frames (30fps)
export const CB_TIMINGS = {
  title: 180, // 6s
  step1: 360, // 12s — Grind
  step2: 360, // 12s — Combine
  step3: 360, // 12s — Wait
  step4: 360, // 12s — Serve
  end: 180, // 6s — Enjoy
} as const;

export const CB_TOTAL_DURATION =
  CB_TIMINGS.title +
  CB_TIMINGS.step1 +
  CB_TIMINGS.step2 +
  CB_TIMINGS.step3 +
  CB_TIMINGS.step4 +
  CB_TIMINGS.end; // 1800 frames = 60s
