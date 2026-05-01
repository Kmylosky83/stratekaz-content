// scenes/firma-digital-v2/FirmaDigitalV2.tsx
// Improved orchestrator for the FirmaDigital video.
//
// Changes vs. the original FirmaDigitalVideo.tsx:
// - ✨ Music turned ON (was commented out)
// - ✨ Added global FilmGrain at low intensity (premium texture)
// - ♻️ Hook and CTA scenes are V2 (KineticText, BurstRays, GlowPulse, etc.)
// - ♻️ Canvas, Security, Workflow scenes preserved from the original
// - ♻️ Transitions: fade() at each cut (same as v1 — clean & invisible)
//
// REVERTED: tried LightLeak Overlays for cinematic cuts but they were too
// aggressive (full-screen yellow-green destellos broke the brand atmosphere).
// Keeping the proven simple fades.
//
// Duration math: 210 + 530 + 465 + 395 + 260 = 1860 frames - 4×15 (fade
// overlap) = 1800 frames = 60s (matches original)

import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

// New shared assets
import { BackgroundMusic } from "../../components/BackgroundMusic";
import { FilmGrain } from "../../effects/FilmGrain";

// Background preserved
import { FDBackground } from "../firma-digital/FDBackground";

// Original scenes preserved
import { FDCanvasScene } from "../firma-digital/FDCanvasScene";
import { FDSecurityScene } from "../firma-digital/FDSecurityScene";
import { FDWorkflowScene } from "../firma-digital/FDWorkflowScene";

// V2 scenes
import { FDV2HookScene } from "./FDV2HookScene";
import { FDV2CTAScene } from "./FDV2CTAScene";

export const FD_V2_DURATION = 1800; // 60s @ 30fps (with fade overlap)

const fadeTransition = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
);

export const FirmaDigitalV2: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Background — particles network (preserved) */}
      <FDBackground />

      {/* ✨ Background music — was commented out in v1 */}
      <BackgroundMusic
        volume={0.22}
        fadeInSeconds={1.5}
        fadeOutSeconds={3}
      />

      {/* Sequenced scenes with simple fade transitions */}
      <TransitionSeries>
        {/* Scene 1: Hook v2 (0–7s) */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <FDV2HookScene />
        </TransitionSeries.Sequence>

        {fadeTransition}

        {/* Scene 2: Canvas (preserved, 7–24.7s) */}
        <TransitionSeries.Sequence durationInFrames={530}>
          <FDCanvasScene />
        </TransitionSeries.Sequence>

        {fadeTransition}

        {/* Scene 3: Security (preserved, 24.7–40.2s) */}
        <TransitionSeries.Sequence durationInFrames={465}>
          <FDSecurityScene />
        </TransitionSeries.Sequence>

        {fadeTransition}

        {/* Scene 4: Workflow (preserved, 40.2–53.4s) */}
        <TransitionSeries.Sequence durationInFrames={395}>
          <FDWorkflowScene />
        </TransitionSeries.Sequence>

        {fadeTransition}

        {/* Scene 5: CTA v2 (53.4–60s) */}
        <TransitionSeries.Sequence durationInFrames={260}>
          <FDV2CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ✨ Global film grain — subtle premium texture */}
      <FilmGrain intensity={0.06} speed={0.4} seed={11} />
    </AbsoluteFill>
  );
};
