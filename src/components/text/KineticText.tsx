// components/text/KineticText.tsx
// Single-line text with playful spring entrance and optional bobble after.

import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import type { CSSProperties } from "react";
import { SPRING, type SpringPreset } from "../../motion/springs";

type Props = {
  children: string;
  /** Frame at which the text starts to appear. */
  startFrame?: number;
  /** Spring preset for entrance physics. */
  spring?: SpringPreset;
  /** Style overrides. */
  style?: CSSProperties;
  /** Subtle bobble animation after entrance (px amplitude). */
  bobble?: number;
};

export const KineticText: React.FC<Props> = ({
  children,
  startFrame = 0,
  spring: springPreset = "bouncy",
  style,
  bobble = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: SPRING[springPreset],
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle bobble that ramps in after the entrance has settled.
  const bobbleY =
    bobble > 0
      ? Math.sin((frame - startFrame) * 0.1) *
        bobble *
        Math.min(1, Math.max(0, (frame - startFrame - 30) / 15))
      : 0;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `scale(${enter}) translateY(${bobbleY}px)`,
        ...style,
      }}
    >
      {children}
    </span>
  );
};
