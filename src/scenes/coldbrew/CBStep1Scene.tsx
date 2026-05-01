// scenes/coldbrew/CBStep1Scene.tsx
// Step 1 — Grind. A bean appears, shakes (grinding), breaks into particles
// that scatter into a pile. CountUp 0→60g.

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { KineticText } from "../../components/text/KineticText";
import { CountUp } from "../../components/text/CountUp";
import { CB, CB_FONTS } from "./coldbrew-tokens";

const PARTICLE_COUNT = 24;

// Deterministic pseudo-random
const seedRand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const CBStep1Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: bean appears (0-40)
  const beanScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.7 },
  });

  // Phase 2: shake during grinding (60-110)
  const shakeActive = frame >= 60 && frame < 110;
  const shakeX = shakeActive ? Math.sin(frame * 1.2) * 8 : 0;
  const shakeRotate = shakeActive ? Math.sin(frame * 1.5) * 5 : 0;

  // Phase 3: bean fades out (110-130)
  const beanOpacity = interpolate(frame, [110, 130], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Phase 4: particles explode out (110+)
  const particleProgress = interpolate(frame, [110, 200], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  // Phase 5: particles settle into pile (200-260)
  const settleProgress = interpolate(frame, [200, 260], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ background: CB.cream, padding: "120px 80px" }}>
      {/* Top: STEP 01 badge */}
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
        STEP 01
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
          marginBottom: 60,
        }}
      >
        <KineticText startFrame={5} spring="smooth">
          Grind
        </KineticText>
      </div>

      {/* Center stage — bean and particles */}
      <div
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Whole bean — visible phase 1-3 */}
        {beanOpacity > 0.01 && (
          <div
            style={{
              opacity: beanOpacity,
              transform: `translate(${shakeX}px, 0) scale(${beanScale}) rotate(${shakeRotate}deg)`,
            }}
          >
            <svg width={240} height={320} viewBox="0 0 200 280">
              <path
                d="M 100 20 C 150 20, 180 80, 175 140 C 170 200, 140 260, 100 260 C 60 260, 30 200, 25 140 C 20 80, 50 20, 100 20 Z"
                fill={CB.espresso}
              />
              <path
                d="M 100 35 C 110 80, 110 200, 100 245"
                fill="none"
                stroke={CB.cream}
                strokeWidth={5}
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Particles — scatter from center then settle */}
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const angle = seedRand(i * 7 + 1) * Math.PI * 2;
          const explodeDist = 100 + seedRand(i * 7 + 2) * 200;

          // Explosion target
          const explodeX = Math.cos(angle) * explodeDist;
          const explodeY = Math.sin(angle) * explodeDist;

          // Settle target — pile at bottom (random spread)
          const pileX = (seedRand(i * 7 + 3) - 0.5) * 320;
          const pileY = 80 + seedRand(i * 7 + 4) * 60;

          // Position interpolation
          const px =
            explodeX +
            (pileX - explodeX) * settleProgress;
          const py =
            explodeY +
            (pileY - explodeY) * settleProgress;

          const size = 4 + seedRand(i * 7 + 5) * 6;
          const opacity = particleProgress;

          // Tumble rotation
          const rot = seedRand(i * 7 + 6) * 360 + frame * 2;

          return (
            <div
              key={i}
              style={{
                position: "absolute",
                width: size,
                height: size,
                background: CB.espresso,
                borderRadius: 2,
                transform: `translate(${px * particleProgress}px, ${py * particleProgress}px) rotate(${rot}deg)`,
                opacity,
              }}
            />
          );
        })}
      </div>

      {/* Bottom caption */}
      <div
        style={{
          textAlign: "center",
          marginTop: 60,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: CB.espresso,
            fontFamily: CB_FONTS.display,
            lineHeight: 1,
          }}
        >
          <CountUp
            to={60}
            startFrame={140}
            durationInFrames={70}
            suffix="g"
            style={{ fontVariantNumeric: "tabular-nums" }}
          />
        </div>
        <div
          style={{
            fontSize: 26,
            color: CB.espressoMid,
            fontFamily: CB_FONTS.body,
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginTop: 12,
            opacity: interpolate(frame, [140, 170], [0, 1], {
              extrapolateRight: "clamp",
              extrapolateLeft: "clamp",
            }),
          }}
        >
          coarse grind
        </div>
      </div>
    </AbsoluteFill>
  );
};
