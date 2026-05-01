// scenes/showcase/Showcase.tsx
// 30-second showcase composition demonstrating the effects/motion/shapes/text
// libraries — useful as a visual reference and as a smoke test for the kit.

import { AbsoluteFill, Series } from "remotion";
import { LightLeaks } from "../../effects/LightLeaks";
import { NoiseOverlay } from "../../effects/NoiseOverlay";
import { FilmGrain } from "../../effects/FilmGrain";
import { CameraShake } from "../../effects/CameraShake";
import { GlitchFlash } from "../../effects/GlitchFlash";
import { GlowPulse } from "../../effects/GlowPulse";
import { LiquidBlob } from "../../shapes/LiquidBlob";
import { KineticText } from "../../components/text/KineticText";
import { SplitText } from "../../components/text/SplitText";
import { CountUp } from "../../components/text/CountUp";
import { BRAND, FONTS } from "../../brand/tokens";

const SEC = 30 * 5; // 5 seconds per section at 30fps

const Background: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, ${BRAND.bgSurface} 0%, ${BRAND.bgDeep} 100%)`,
    }}
  />
);

const SectionTitle: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => (
  <div style={{ textAlign: "center", color: BRAND.white, zIndex: 10 }}>
    <div
      style={{
        fontFamily: FONTS.heading,
        fontSize: 96,
        fontWeight: 900,
        lineHeight: 1.1,
        textShadow: `0 4px 30px rgba(0,0,0,0.5)`,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: FONTS.body,
        fontSize: 24,
        color: BRAND.textMuted,
        marginTop: 24,
        letterSpacing: "4px",
        textTransform: "uppercase",
      }}
    >
      {subtitle}
    </div>
  </div>
);

// Section 1 — Cinematic light
const SectionLight: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Background />
    <GlowPulse color={BRAND.primary} size={900} period={50} maxOpacity={0.8} />
    <LightLeaks hueShift={300} opacity={0.5} />
    <SectionTitle title="Cinematic light" subtitle="LightLeaks + GlowPulse" />
  </AbsoluteFill>
);

// Section 2 — Organic texture
const SectionTexture: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Background />
    <NoiseOverlay seed={2} density={45} opacity={0.18} color={BRAND.primary} />
    <FilmGrain intensity={0.15} speed={0.4} />
    <SectionTitle title="Organic texture" subtitle="NoiseOverlay + FilmGrain" />
  </AbsoluteFill>
);

// Section 3 — Cinematic motion
const SectionMotion: React.FC = () => (
  <AbsoluteFill>
    <Background />
    <CameraShake amplitude={5} speed={0.25}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <GlitchFlash startFrame={60} durationInFrames={12} intensity={1.5}>
          <SectionTitle
            title="Cinematic motion"
            subtitle="CameraShake + GlitchFlash"
          />
        </GlitchFlash>
      </AbsoluteFill>
    </CameraShake>
  </AbsoluteFill>
);

// Section 4 — Liquid shapes
const SectionShapes: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Background />
    <AbsoluteFill style={{ opacity: 0.85 }}>
      <LiquidBlob
        cx={540}
        cy={1100}
        radius={420}
        points={14}
        wobble={140}
        speed={0.06}
        fill={BRAND.primary}
      />
    </AbsoluteFill>
    <SectionTitle title="Liquid shapes" subtitle="LiquidBlob (noise-driven)" />
  </AbsoluteFill>
);

// Section 5 — Kinetic typography
const SectionText: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Background />
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 120,
          fontWeight: 900,
          color: BRAND.white,
          lineHeight: 1.1,
        }}
      >
        <KineticText startFrame={5} spring="bouncy">
          Kinetic
        </KineticText>{" "}
        <KineticText startFrame={25} spring="pop" style={{ color: BRAND.primary }}>
          type!
        </KineticText>
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 40,
          color: BRAND.amber,
          marginTop: 40,
          fontWeight: 600,
        }}
      >
        <SplitText startFrame={60} stagger={3} fromY={30}>
          Char-by-char reveal
        </SplitText>
      </div>
    </div>
  </AbsoluteFill>
);

// Section 6 — Animated counter
const SectionCounter: React.FC = () => (
  <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
    <Background />
    <GlowPulse
      color={BRAND.primary}
      size={700}
      period={40}
      minOpacity={0.2}
      maxOpacity={0.4}
    />
    <div style={{ textAlign: "center", color: BRAND.white, zIndex: 10 }}>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 240,
          fontWeight: 900,
          color: BRAND.primary,
          lineHeight: 1,
          textShadow: `0 0 50px ${BRAND.primary}80`,
        }}
      >
        <CountUp to={94} startFrame={10} durationInFrames={70} suffix="%" />
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 32,
          color: BRAND.textMuted,
          marginTop: 24,
          letterSpacing: "4px",
          textTransform: "uppercase",
        }}
      >
        CountUp data viz
      </div>
    </div>
  </AbsoluteFill>
);

export const Showcase: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={SEC}>
        <SectionLight />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionTexture />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionMotion />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionShapes />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionText />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionCounter />
      </Series.Sequence>
    </Series>
  );
};

export const SHOWCASE_DURATION = SEC * 6; // 900 frames @ 30fps = 30s
