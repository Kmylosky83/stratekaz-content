// scenes/coldbrew/CBStep3Scene.tsx
// Step 3 — Wait. Big circular progress arc sweeping 360° while CountUp goes 0→12h.
// Background subtly shifts cream → cooler → cream to imply day/night/day.

import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from "remotion";
import { KineticText } from "../../components/text/KineticText";
import { CountUp } from "../../components/text/CountUp";
import { CB, CB_FONTS } from "./coldbrew-tokens";

const RING_R = 200;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const CENTER_X = 540;
const CENTER_Y = 1100;

export const CBStep3Scene: React.FC = () => {
  const frame = useCurrentFrame();

  // Progress 0→1 over 12 hours condensed into ~9 seconds
  const progress = interpolate(frame, [40, 280], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Background ambient shift — implies day passing (cream → blue tint → cream)
  const bgTint = interpolate(
    frame,
    [40, 160, 280],
    [0, 1, 0],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );
  const bg = `rgb(
    ${245 - bgTint * 25},
    ${230 - bgTint * 20},
    ${211 + bgTint * 12}
  )`;

  // Hour markers around the ring
  const hourMarks = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const x1 = CENTER_X + Math.cos(angle) * (RING_R - 20);
    const y1 = CENTER_Y + Math.sin(angle) * (RING_R - 20);
    const x2 = CENTER_X + Math.cos(angle) * (RING_R - 5);
    const y2 = CENTER_Y + Math.sin(angle) * (RING_R - 5);
    return { x1, y1, x2, y2, isMain: i % 3 === 0 };
  });

  // Sun/moon icon position on the arc
  const indicatorAngle = progress * Math.PI * 2 - Math.PI / 2;
  const indicatorX = CENTER_X + Math.cos(indicatorAngle) * RING_R;
  const indicatorY = CENTER_Y + Math.sin(indicatorAngle) * RING_R;

  return (
    <AbsoluteFill style={{ background: bg, padding: "120px 80px 80px" }}>
      {/* Top: STEP 03 badge */}
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
        STEP 03
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
        }}
      >
        <KineticText startFrame={5} spring="smooth">
          Wait
        </KineticText>
      </div>

      {/* Center stage — circular timer */}
      <svg
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        viewBox="0 0 1080 1920"
      >
        {/* Hour markers */}
        {hourMarks.map((m, i) => (
          <line
            key={i}
            x1={m.x1}
            y1={m.y1}
            x2={m.x2}
            y2={m.y2}
            stroke={CB.espresso}
            strokeWidth={m.isMain ? 4 : 2}
            opacity={m.isMain ? 0.6 : 0.25}
          />
        ))}

        {/* Background ring (full circle, faint) */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RING_R}
          fill="none"
          stroke={CB.espresso}
          strokeWidth={6}
          opacity={0.08}
        />

        {/* Progress arc */}
        <circle
          cx={CENTER_X}
          cy={CENTER_Y}
          r={RING_R}
          fill="none"
          stroke={CB.espresso}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={RING_CIRCUMFERENCE}
          strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
          transform={`rotate(-90 ${CENTER_X} ${CENTER_Y})`}
        />

        {/* Indicator dot at the leading edge of the arc */}
        {progress > 0.005 && (
          <>
            <circle
              cx={indicatorX}
              cy={indicatorY}
              r={20}
              fill={CB.amberDeep}
              opacity={0.3}
            />
            <circle
              cx={indicatorX}
              cy={indicatorY}
              r={12}
              fill={CB.amberDeep}
            />
          </>
        )}
      </svg>

      {/* Center text — CountUp + label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: CENTER_Y - 90,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 900,
            color: CB.espresso,
            fontFamily: CB_FONTS.display,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <CountUp
            to={12}
            startFrame={40}
            durationInFrames={240}
            suffix="h"
          />
        </div>
        <div
          style={{
            fontSize: 28,
            color: CB.espressoMid,
            fontFamily: CB_FONTS.body,
            letterSpacing: "5px",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          refrigerated
        </div>
      </div>

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
          opacity: interpolate(frame, [180, 220], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          }),
        }}
      >
        patience = flavor
      </div>
    </AbsoluteFill>
  );
};
