// scenes/coldbrew/CBTitleScene.tsx
// Title card — minimalist cream background, big display type, single bean icon.

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { KineticText } from "../../components/text/KineticText";
import { SplitText } from "../../components/text/SplitText";
import { CB, CB_FONTS } from "./coldbrew-tokens";

export const CBTitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Coffee bean grows in
  const beanSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 90, mass: 0.8 },
  });

  const beanRotate = interpolate(frame, [0, 180], [-8, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: CB.cream,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Coffee bean illustration — custom SVG */}
      <div
        style={{
          marginBottom: 80,
          opacity: beanSpring,
          transform: `scale(${beanSpring}) rotate(${beanRotate}deg)`,
        }}
      >
        <svg width={200} height={280} viewBox="0 0 200 280">
          {/* Bean outline */}
          <path
            d="M 100 20
               C 150 20, 180 80, 175 140
               C 170 200, 140 260, 100 260
               C 60 260, 30 200, 25 140
               C 20 80, 50 20, 100 20 Z"
            fill={CB.espresso}
          />
          {/* Bean center crease — stylized signature line */}
          <path
            d="M 100 35
               C 110 80, 110 200, 100 245"
            fill="none"
            stroke={CB.cream}
            strokeWidth={5}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Big title — kinetic */}
      <div
        style={{
          fontSize: 130,
          fontWeight: 900,
          color: CB.espresso,
          fontFamily: CB_FONTS.display,
          letterSpacing: "-3px",
          lineHeight: 1,
          marginBottom: 24,
        }}
      >
        <KineticText startFrame={20} spring="bouncy">
          COLD
        </KineticText>{" "}
        <KineticText
          startFrame={45}
          spring="pop"
          style={{ color: CB.amberDeep }}
        >
          BREW
        </KineticText>
      </div>

      {/* Divider */}
      <div
        style={{
          width: interpolate(frame, [70, 100], [0, 120], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
          height: 3,
          background: CB.espresso,
          marginBottom: 32,
        }}
      />

      {/* Subtitle — split */}
      <div
        style={{
          fontSize: 38,
          fontWeight: 500,
          color: CB.espressoMid,
          fontFamily: CB_FONTS.body,
          letterSpacing: "8px",
          textTransform: "uppercase",
        }}
      >
        <SplitText startFrame={95} stagger={3} fromY={20} spring="smooth">
          4-step method
        </SplitText>
      </div>

      {/* Tiny footer credit */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontSize: 22,
          color: CB.espressoLight,
          fontFamily: CB_FONTS.mono,
          letterSpacing: "4px",
          opacity: interpolate(frame, [140, 170], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
        }}
      >
        a tutorial in 60 seconds
      </div>
    </AbsoluteFill>
  );
};
