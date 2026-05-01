// components/text/SplitText.tsx
// Text revealed character-by-character or word-by-word with a stagger.

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
  /** Split granularity. */
  by?: "char" | "word";
  /** Frame at which the first item starts. */
  startFrame?: number;
  /** Frames between consecutive items. */
  stagger?: number;
  /** Spring preset for each item entrance. */
  spring?: SpringPreset;
  /** Vertical offset (px) at start. */
  fromY?: number;
  /** Style for the whole text container. */
  style?: CSSProperties;
};

export const SplitText: React.FC<Props> = ({
  children,
  by = "char",
  startFrame = 0,
  stagger = 3,
  spring: springPreset = "smooth",
  fromY = 30,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const items =
    by === "word" ? children.split(" ") : Array.from(children);

  return (
    <span style={{ display: "inline-block", ...style }}>
      {items.map((item, i) => {
        const itemStart = startFrame + i * stagger;
        const enter = spring({
          frame: Math.max(0, frame - itemStart),
          fps,
          config: SPRING[springPreset],
        });
        const opacity = interpolate(
          frame,
          [itemStart, itemStart + 8],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${(1 - enter) * fromY}px)`,
              whiteSpace: "pre",
            }}
          >
            {item}
            {by === "word" && i < items.length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};
