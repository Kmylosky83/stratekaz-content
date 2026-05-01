// scenes/coldbrew/CBStep4Scene.tsx
// Step 4 — Serve. Glass with ice cubes appearing, pour stream drawn with
// evolvePath, liquid fills the glass.

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { KineticText } from "../../components/text/KineticText";
import { CB, CB_FONTS } from "./coldbrew-tokens";

const GLASS_W = 360;
const GLASS_H = 520;
const GLASS_X = (1080 - GLASS_W) / 2;
const GLASS_TOP_Y = 720;

const POUR_PATH = `M 540 280 C 540 380, 620 480, 600 620 C 590 700, 560 720, 540 740`;

export const CBStep4Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ice cubes appear staggered (frames 20, 40, 60)
  const iceSpring = (i: number) =>
    spring({
      frame: Math.max(0, frame - (20 + i * 18)),
      fps,
      config: { damping: 12, stiffness: 100, mass: 0.5 },
    });

  // Pour path drawing animation (frames 80-150)
  const pourProgress = interpolate(frame, [80, 150], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    pourProgress,
    POUR_PATH,
  );

  // Liquid fills glass after pour reaches it (frames 130-260)
  const liquidLevel = interpolate(frame, [130, 260], [0, 0.78], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const liquidH = liquidLevel * (GLASS_H - 40);

  return (
    <AbsoluteFill style={{ background: CB.cream, padding: "120px 80px 80px" }}>
      {/* Top: STEP 04 badge */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: CB.amberDeep,
          fontFamily: CB_FONTS.body,
          letterSpacing: "8px",
          marginBottom: 20,
        }}
      >
        STEP 04
      </div>

      {/* Big title */}
      <div
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: CB.espresso,
          fontFamily: CB_FONTS.display,
          letterSpacing: "-2px",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        <KineticText startFrame={5} spring="smooth">
          Serve
        </KineticText>
      </div>

      {/* Pour path — drawn as SVG with evolvePath */}
      <svg
        width="100%"
        height="100%"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
        }}
        viewBox="0 0 1080 1920"
      >
        <path
          d={POUR_PATH}
          stroke={CB.espresso}
          fill="none"
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          opacity={pourProgress > 0 && liquidLevel < 0.7 ? 0.85 : 0}
        />
      </svg>

      {/* Glass */}
      <div
        style={{
          position: "absolute",
          left: GLASS_X,
          top: GLASS_TOP_Y,
          width: GLASS_W,
          height: GLASS_H,
          background: "rgba(45, 24, 16, 0.03)",
          border: `4px solid ${CB.espresso}`,
          borderRadius: "8px 8px 60px 60px",
          overflow: "hidden",
        }}
      >
        {/* Liquid (cold brew) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: liquidH,
            background: `linear-gradient(180deg, ${CB.espressoMid} 0%, ${CB.espresso} 100%)`,
          }}
        />

        {/* Ice cubes — appear staggered, then float in liquid as it rises */}
        {[0, 1, 2].map((i) => {
          const enter = iceSpring(i);
          if (enter < 0.01) return null;

          // Initial floating position (top of glass), drift down as liquid rises
          const baseY = 30 + i * 70;
          const floatY = baseY + Math.sin(frame * 0.05 + i) * 4;
          const xOffset = (i - 1) * 60 + 30;
          const rotation = 8 + i * 15 + Math.sin(frame * 0.03 + i) * 3;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: floatY,
                left: xOffset,
                width: 80,
                height: 80,
                background: CB.iceBlue,
                border: `4px solid ${CB.iceDeep}`,
                borderRadius: 10,
                transform: `rotate(${rotation}deg) scale(${enter})`,
                opacity: 0.75 * enter,
                zIndex: 3,
                boxShadow: "inset 0 0 20px rgba(255,255,255,0.5)",
              }}
            />
          );
        })}
      </div>

      {/* Glass base shadow */}
      <div
        style={{
          position: "absolute",
          left: GLASS_X - 20,
          top: GLASS_TOP_Y + GLASS_H + 4,
          width: GLASS_W + 40,
          height: 14,
          borderRadius: "50%",
          background: CB.shadowMedium,
          filter: "blur(8px)",
        }}
      />

      {/* Bottom caption */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 0,
          right: 0,
          fontSize: 26,
          color: CB.espressoLight,
          fontFamily: CB_FONTS.mono,
          letterSpacing: "4px",
          textAlign: "center",
          opacity: interpolate(frame, [240, 280], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
        }}
      >
        filter · pour · serve
      </div>
    </AbsoluteFill>
  );
};
