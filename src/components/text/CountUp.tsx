// components/text/CountUp.tsx
// Animated number counter — interpolates from `from` to `to` with expo-out easing.
// Uses tabular-nums so digits don't jump around.

import { useCurrentFrame, interpolate } from "remotion";
import type { CSSProperties } from "react";
import { EASE } from "../../motion/easings";

type Props = {
  /** Target value to count up to. */
  to: number;
  /** Starting value (default 0). */
  from?: number;
  /** Frame at which counting starts. */
  startFrame?: number;
  /** Duration of the count animation. */
  durationInFrames?: number;
  /** Decimals to display. */
  decimals?: number;
  /** Prefix string (e.g., "$"). */
  prefix?: string;
  /** Suffix string (e.g., "%", "+"). */
  suffix?: string;
  /** Whether to format with thousands separator (es-CO locale). */
  thousands?: boolean;
  /** Style overrides. */
  style?: CSSProperties;
};

export const CountUp: React.FC<Props> = ({
  to,
  from = 0,
  startFrame = 0,
  durationInFrames = 60,
  decimals = 0,
  prefix = "",
  suffix = "",
  thousands = false,
  style,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: EASE.expoOut,
    },
  );

  const rounded = Number(value.toFixed(decimals));
  const formatted = thousands
    ? rounded.toLocaleString("es-CO", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : rounded.toFixed(decimals);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
