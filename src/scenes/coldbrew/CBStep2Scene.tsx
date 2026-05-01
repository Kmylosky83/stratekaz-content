// scenes/coldbrew/CBStep2Scene.tsx
// Step 2 — Combine. A jar shape with espresso liquid rising bottom-up,
// ratio "1 : 8" displayed prominently, weights animated.

import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { KineticText } from "../../components/text/KineticText";
import { CountUp } from "../../components/text/CountUp";
import { CB, CB_FONTS } from "./coldbrew-tokens";

const JAR_W = 380;
const JAR_H = 480;
const JAR_NECK_W = 220;
const JAR_NECK_H = 60;

export const CBStep2Scene: React.FC = () => {
  const frame = useCurrentFrame();

  // Liquid level rises 0→90% over frames 30-180
  const liquidLevel = interpolate(frame, [30, 180], [0, 0.88], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const liquidH = liquidLevel * (JAR_H - 40);

  // Wave at the top of the liquid
  const waveOffset = Math.sin(frame * 0.12) * 4;

  // Ratio number entrance
  const ratioOpacity = interpolate(frame, [80, 120], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: CB.cream, padding: "120px 80px" }}>
      {/* Top: STEP 02 badge */}
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
        STEP 02
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
          marginBottom: 40,
        }}
      >
        <KineticText startFrame={5} spring="smooth">
          Combine
        </KineticText>
      </div>

      {/* Center stage — jar + ratio */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          gap: 40,
        }}
      >
        {/* Jar visualization */}
        <div
          style={{
            width: JAR_W,
            height: JAR_H + JAR_NECK_H,
            position: "relative",
          }}
        >
          {/* Jar body */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: JAR_W,
              height: JAR_H,
              background: "rgba(45, 24, 16, 0.04)",
              border: `4px solid ${CB.espresso}`,
              borderRadius: "20px 20px 32px 32px",
              overflow: "hidden",
            }}
          >
            {/* Liquid */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: liquidH,
                background: `linear-gradient(180deg, ${CB.espressoMid} 0%, ${CB.espresso} 100%)`,
                borderRadius: liquidLevel > 0.85 ? "0 0 28px 28px" : 0,
              }}
            />
            {/* Wavy top of liquid */}
            {liquidLevel > 0.05 && (
              <svg
                width="100%"
                height={20}
                style={{
                  position: "absolute",
                  bottom: liquidH - 10,
                  left: 0,
                }}
                viewBox="0 0 100 20"
                preserveAspectRatio="none"
              >
                <path
                  d={`M 0 ${10 + waveOffset} Q 25 ${5 - waveOffset}, 50 ${10 + waveOffset} T 100 ${10 + waveOffset} L 100 20 L 0 20 Z`}
                  fill={CB.espressoMid}
                />
              </svg>
            )}
            {/* Volume marker lines */}
            {[0.25, 0.5, 0.75].map((mark) => (
              <div
                key={mark}
                style={{
                  position: "absolute",
                  bottom: mark * (JAR_H - 40) + 20,
                  right: 16,
                  width: 24,
                  height: 2,
                  background: CB.espressoLight,
                  opacity: 0.4,
                }}
              />
            ))}
          </div>

          {/* Jar neck */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: (JAR_W - JAR_NECK_W) / 2,
              width: JAR_NECK_W,
              height: JAR_NECK_H,
              background: CB.cream,
              border: `4px solid ${CB.espresso}`,
              borderBottom: "none",
              borderRadius: "16px 16px 0 0",
            }}
          />
          {/* Jar lid */}
          <div
            style={{
              position: "absolute",
              top: -14,
              left: (JAR_W - JAR_NECK_W) / 2 - 8,
              width: JAR_NECK_W + 16,
              height: 22,
              background: CB.espresso,
              borderRadius: 6,
            }}
          />
        </div>

        {/* Ratio + weights */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 24,
            opacity: ratioOpacity,
          }}
        >
          {/* Big "1 : 8" */}
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: CB.espresso,
              fontFamily: CB_FONTS.display,
              lineHeight: 1,
              letterSpacing: "-4px",
            }}
          >
            <span>1</span>
            <span style={{ color: CB.amberDeep, margin: "0 16px" }}>:</span>
            <span>8</span>
          </div>

          {/* Weight breakdown */}
          <div
            style={{
              fontSize: 32,
              fontFamily: CB_FONTS.mono,
              color: CB.espressoMid,
              lineHeight: 1.5,
            }}
          >
            <div>
              <CountUp
                to={60}
                startFrame={130}
                durationInFrames={50}
                suffix="g coffee"
              />
            </div>
            <div style={{ color: CB.iceDeep }}>
              <CountUp
                to={480}
                startFrame={150}
                durationInFrames={60}
                suffix="ml water"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom caption */}
      <div
        style={{
          fontSize: 26,
          color: CB.espressoMid,
          fontFamily: CB_FONTS.body,
          letterSpacing: "4px",
          textTransform: "uppercase",
          textAlign: "center",
          marginTop: 40,
          opacity: interpolate(frame, [200, 230], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
        }}
      >
        ratio matters
      </div>
    </AbsoluteFill>
  );
};
