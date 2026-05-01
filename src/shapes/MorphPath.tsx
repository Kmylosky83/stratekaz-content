// shapes/MorphPath.tsx
// Animated SVG path morphing between two paths using @remotion/paths.
//
// Both paths must have compatible structures (same number of points/curves)
// for clean interpolation. Use simple geometric paths or matched commands.

import { useCurrentFrame, interpolate } from "remotion";
import { interpolatePath } from "@remotion/paths";
import { EASE } from "../motion/easings";

type Props = {
  /** Starting SVG path d-string. */
  pathFrom: string;
  /** Ending SVG path d-string. */
  pathTo: string;
  /** Frame at which the morph starts. */
  startFrame?: number;
  /** Duration of the morph. */
  durationInFrames?: number;
  /** Stroke color. */
  stroke?: string;
  /** Fill color (use "none" for stroke-only). */
  fill?: string;
  /** Stroke width. */
  strokeWidth?: number;
  /** ViewBox for the SVG. */
  viewBox?: string;
  /** Width of the SVG (CSS or px). */
  width?: number | string;
  /** Height of the SVG (CSS or px). */
  height?: number | string;
};

export const MorphPath: React.FC<Props> = ({
  pathFrom,
  pathTo,
  startFrame = 0,
  durationInFrames = 30,
  stroke = "#ffffff",
  fill = "none",
  strokeWidth = 3,
  viewBox = "0 0 100 100",
  width = "100%",
  height = "100%",
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.smooth,
    },
  );

  const d = interpolatePath(progress, pathFrom, pathTo);

  return (
    <svg viewBox={viewBox} width={width} height={height}>
      <path d={d} stroke={stroke} fill={fill} strokeWidth={strokeWidth} />
    </svg>
  );
};
