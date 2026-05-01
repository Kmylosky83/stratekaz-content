// scenes/coldbrew/CBEndScene.tsx
// Final card — minimalist "Enjoy." with subtle glow halo and burst rays.

import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { KineticText } from "../../components/text/KineticText";
import { GlowPulse } from "../../effects/GlowPulse";
import { BurstRays } from "../../shapes/BurstRays";
import { CB, CB_FONTS } from "./coldbrew-tokens";

export const CBEndScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: CB.cream,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* Subtle glow halo */}
      <GlowPulse
        color={CB.amberDeep}
        size={700}
        period={50}
        minOpacity={0.15}
        maxOpacity={0.3}
        blur={50}
      />

      {/* Subtle burst rays at the climax */}
      <BurstRays
        startFrame={20}
        durationInFrames={70}
        rayCount={10}
        primaryColor={CB.amberDeep}
        amberColor={CB.espresso}
        amberEvery={5}
        burstDistance={650}
        raySize={10}
        centerX={540}
        centerY={960}
      />

      {/* Main "Enjoy." */}
      <div
        style={{
          fontSize: 180,
          fontWeight: 900,
          color: CB.espresso,
          fontFamily: CB_FONTS.display,
          letterSpacing: "-4px",
          lineHeight: 1,
          zIndex: 10,
        }}
      >
        <KineticText startFrame={10} spring="bouncy">
          Enjoy.
        </KineticText>
      </div>

      {/* Divider */}
      <div
        style={{
          width: interpolate(frame, [40, 80], [0, 100], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
          height: 2,
          background: CB.espressoMid,
          marginTop: 28,
          marginBottom: 28,
          zIndex: 10,
        }}
      />

      {/* Tiny credit */}
      <div
        style={{
          fontSize: 22,
          color: CB.espressoLight,
          fontFamily: CB_FONTS.mono,
          letterSpacing: "5px",
          textTransform: "uppercase",
          opacity: interpolate(frame, [70, 110], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
          zIndex: 10,
        }}
      >
        made with remotion
      </div>
    </AbsoluteFill>
  );
};
