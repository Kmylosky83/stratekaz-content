// effects/LightLeaks.tsx
// Cinematic light leak overlay — wraps @remotion/light-leaks with brand-friendly
// blend modes and opacity controls.
//
// Best layered ON TOP of the background using `mixBlendMode: "screen"`.

import type { CSSProperties } from "react";
import { LightLeak } from "@remotion/light-leaks";

type Props = {
  durationInFrames?: number;
  seed?: number;
  /** Hue shift in degrees (0..360) — useful to tint towards brand colors. */
  hueShift?: number;
  /** CSS mix-blend-mode — "screen" is most cinematic over dark backgrounds. */
  blendMode?: CSSProperties["mixBlendMode"];
  /** 0..1 overall intensity. */
  opacity?: number;
};

export const LightLeaks: React.FC<Props> = ({
  durationInFrames,
  seed,
  hueShift,
  blendMode = "screen",
  opacity = 0.6,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        mixBlendMode: blendMode,
        opacity,
        pointerEvents: "none",
      }}
    >
      <LightLeak
        durationInFrames={durationInFrames}
        seed={seed}
        hueShift={hueShift}
      />
    </div>
  );
};
