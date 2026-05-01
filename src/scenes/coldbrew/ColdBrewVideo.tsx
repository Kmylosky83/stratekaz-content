// scenes/coldbrew/ColdBrewVideo.tsx
// Tutorial video orchestrator — 60s, 1080x1920 stories format.
// Showcases the full toolkit in a cohesive minimalist tutorial style.
//
// Structure:
//   Title (6s)  → Step 1 Grind (12s) → Step 2 Combine (12s) →
//   Step 3 Wait (12s) → Step 4 Serve (12s) → End "Enjoy." (6s)
//
// Each scene runs as its own Series.Sequence with NO transitions —
// clean cuts on a consistent cream background give that minimalist
// tutorial card-flip feel.

import { AbsoluteFill, Series } from "remotion";
import { FilmGrain } from "../../effects/FilmGrain";
import { CBTitleScene } from "./CBTitleScene";
import { CBStep1Scene } from "./CBStep1Scene";
import { CBStep2Scene } from "./CBStep2Scene";
import { CBStep3Scene } from "./CBStep3Scene";
import { CBStep4Scene } from "./CBStep4Scene";
import { CBEndScene } from "./CBEndScene";
import {
  CB_TIMINGS,
  CB_TOTAL_DURATION,
} from "./coldbrew-tokens";

export const COLDBREW_DURATION = CB_TOTAL_DURATION;

export const ColdBrewVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <Series>
        <Series.Sequence durationInFrames={CB_TIMINGS.title}>
          <CBTitleScene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CB_TIMINGS.step1}>
          <CBStep1Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CB_TIMINGS.step2}>
          <CBStep2Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CB_TIMINGS.step3}>
          <CBStep3Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CB_TIMINGS.step4}>
          <CBStep4Scene />
        </Series.Sequence>
        <Series.Sequence durationInFrames={CB_TIMINGS.end}>
          <CBEndScene />
        </Series.Sequence>
      </Series>

      {/* Subtle film grain across the whole tutorial — warm tactile feel */}
      <FilmGrain intensity={0.04} speed={0.3} seed={42} />
    </AbsoluteFill>
  );
};
