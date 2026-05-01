// effects/GlowPulse.tsx
// Pulsing radial glow halo — for emphasis behind logos, CTAs, focal elements.

import { useCurrentFrame } from "remotion";
import { pulse } from "../motion/interpolators";

type Props = {
  /** Color of the glow. */
  color?: string;
  /** Size of the glow in px. */
  size?: number;
  /** Pulse period in frames. */
  period?: number;
  /** Min opacity 0..1. */
  minOpacity?: number;
  /** Max opacity 0..1. */
  maxOpacity?: number;
  /** Blur radius in px. */
  blur?: number;
};

export const GlowPulse: React.FC<Props> = ({
  color = "#ec268f",
  size = 600,
  period = 60,
  minOpacity = 0.3,
  maxOpacity = 0.7,
  blur = 20,
}) => {
  const frame = useCurrentFrame();
  const opacity = pulse(frame, period, minOpacity, maxOpacity);

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: size,
        height: size,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        opacity,
        pointerEvents: "none",
        filter: `blur(${blur}px)`,
      }}
    />
  );
};
