// scenes/firma-digital-v2/FirmaDigitalV2.tsx
// Improved orchestrator for the FirmaDigital video.
//
// Changes vs. the original FirmaDigitalVideo.tsx:
// - ✨ Music turned ON (was commented out)
// - ✨ Replaced 4 fade transitions with LightLeak Overlays (hard cut + leak
//      mask = ElevenLabs / Apple keynote feel)
// - ✨ Added global FilmGrain at low intensity (premium texture)
// - ♻️ Hook and CTA scenes are V2 (KineticText, BurstRays, GlowPulse, etc.)
// - ♻️ Canvas, Security, Workflow scenes preserved from the original
//
// Duration math: 210 + 530 + 465 + 395 + 260 = 1860 frames = 62s
// (Overlays don't shorten the timeline, unlike the original's transitions)

import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";

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

export const FD_V2_DURATION = 1860; // 62s @ 30fps

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

      {/* Sequenced scenes with LightLeak overlays at each cut */}
      <TransitionSeries>
        {/* Scene 1: Hook v2 (0–7s) */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <FDV2HookScene />
        </TransitionSeries.Sequence>

        {/* ✨ Cinematic light leak masking the cut */}
        <TransitionSeries.Overlay durationInFrames={28}>
          <LightLeak hueShift={300} seed={1} />
        </TransitionSeries.Overlay>

        {/* Scene 2: Canvas (preserved, 7–24.7s) */}
        <TransitionSeries.Sequence durationInFrames={530}>
          <FDCanvasScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Overlay durationInFrames={28}>
          <LightLeak hueShift={240} seed={2} />
        </TransitionSeries.Overlay>

        {/* Scene 3: Security (preserved, 24.7–40.2s) */}
        <TransitionSeries.Sequence durationInFrames={465}>
          <FDSecurityScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Overlay durationInFrames={28}>
          <LightLeak hueShift={320} seed={3} />
        </TransitionSeries.Overlay>

        {/* Scene 4: Workflow (preserved, 40.2–53.4s) */}
        <TransitionSeries.Sequence durationInFrames={395}>
          <FDWorkflowScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Overlay durationInFrames={28}>
          <LightLeak hueShift={280} seed={4} />
        </TransitionSeries.Overlay>

        {/* Scene 5: CTA v2 (53.4–62s) */}
        <TransitionSeries.Sequence durationInFrames={260}>
          <FDV2CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>

      {/* ✨ Global film grain — sits ON TOP of everything for premium texture */}
      <FilmGrain intensity={0.06} speed={0.4} seed={11} />
    </AbsoluteFill>
  );
};
