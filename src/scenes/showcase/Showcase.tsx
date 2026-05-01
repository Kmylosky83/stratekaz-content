// scenes/showcase/Showcase.tsx
// 72-second comprehensive showcase composition demonstrating the FULL toolkit:
// - 15 new building blocks (motion/effects/shapes/text)
// - 8 pre-existing reusable components
// - Capabilities from @remotion/shapes and @remotion/paths still un-used in scenes
//
// Structure: 8 sections × 9 seconds. Each section runs as its own Series.Sequence,
// so frame counters reset locally — timings are simple to read inside each.

import {
  AbsoluteFill,
  Series,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { Triangle, Star, Heart, Polygon, Circle } from "@remotion/shapes";
import { evolvePath } from "@remotion/paths";

// New library
import { LightLeaks } from "../../effects/LightLeaks";
import { NoiseOverlay } from "../../effects/NoiseOverlay";
import { FilmGrain } from "../../effects/FilmGrain";
import { CameraShake } from "../../effects/CameraShake";
import { GlitchFlash } from "../../effects/GlitchFlash";
import { GlowPulse } from "../../effects/GlowPulse";
import { LiquidBlob } from "../../shapes/LiquidBlob";
import { MorphPath } from "../../shapes/MorphPath";
import { BurstRays } from "../../shapes/BurstRays";
import { KineticText } from "../../components/text/KineticText";
import { SplitText } from "../../components/text/SplitText";
import { CountUp } from "../../components/text/CountUp";

// Existing reusable components
import { GlassBg } from "../../components/GlassBg";
import { ParticleNetwork } from "../../components/ParticleNetwork";
import { TypewriterText } from "../../components/TypewriterText";
import { WordHighlight } from "../../components/WordHighlight";
import { CursorClick } from "../../components/CursorClick";
import { Toast } from "../../components/Toast";

import { BRAND, FONTS } from "../../brand/tokens";

const SEC = 30 * 9; // 270 frames = 9 seconds @ 30fps
const TOTAL_SECTIONS = 8;
export const SHOWCASE_DURATION = SEC * TOTAL_SECTIONS; // 2160 frames = 72s

// ─── shared bits ────────────────────────────────────────────────────────────

const DarkBackground: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at center, ${BRAND.bgSurface} 0%, ${BRAND.bgDeep} 100%)`,
    }}
  />
);

const SectionTitle: React.FC<{
  title: string;
  subtitle: string;
  align?: "top" | "center" | "bottom";
}> = ({ title, subtitle, align = "bottom" }) => {
  const alignStyle: React.CSSProperties =
    align === "top"
      ? { top: 200 }
      : align === "center"
      ? { top: "50%", transform: "translateY(-50%)" }
      : { bottom: 200 };

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        color: BRAND.white,
        zIndex: 100,
        ...alignStyle,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontSize: 72,
          fontWeight: 900,
          lineHeight: 1.1,
          textShadow: `0 4px 30px rgba(0,0,0,0.6)`,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 22,
          color: BRAND.textMuted,
          marginTop: 18,
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

// ─── Section 1 — Cinematic Light ────────────────────────────────────────────
const SectionLight: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <AbsoluteFill style={{ opacity: 0.4 }}>
      <LiquidBlob
        cx={540}
        cy={960}
        radius={500}
        points={14}
        wobble={120}
        speed={0.05}
        fill={BRAND.primary}
      />
    </AbsoluteFill>
    <GlowPulse color={BRAND.primary} size={900} period={50} maxOpacity={0.7} />
    <LightLeaks hueShift={300} opacity={0.55} />
    <SectionTitle
      title="Cinematic Light"
      subtitle="LightLeaks · GlowPulse · LiquidBlob"
      align="bottom"
    />
  </AbsoluteFill>
);

// ─── Section 2 — Organic Texture ────────────────────────────────────────────
const SectionTexture: React.FC = () => (
  <AbsoluteFill>
    <GlassBg variant="dark" accentColor={BRAND.primary} />
    <NoiseOverlay seed={2} density={45} opacity={0.18} color={BRAND.primary} />
    <FilmGrain intensity={0.15} speed={0.4} />
    <SectionTitle
      title="Organic Texture"
      subtitle="GlassBg · NoiseOverlay · FilmGrain"
      align="center"
    />
  </AbsoluteFill>
);

// ─── Section 3 — Motion & Glitch ────────────────────────────────────────────
const SectionMotion: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    <CameraShake amplitude={5} speed={0.25} rotationAmplitude={0.3}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <GlitchFlash startFrame={120} durationInFrames={14} intensity={1.4}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: FONTS.heading,
                fontSize: 110,
                fontWeight: 900,
                color: BRAND.white,
                lineHeight: 1.1,
              }}
            >
              <KineticText startFrame={5} spring="bouncy">
                MOVE
              </KineticText>
              <br />
              <KineticText
                startFrame={25}
                spring="pop"
                style={{ color: BRAND.primary }}
              >
                & GLITCH
              </KineticText>
            </div>
          </div>
        </GlitchFlash>
      </AbsoluteFill>
    </CameraShake>
    <SectionTitle
      title=""
      subtitle="CameraShake · GlitchFlash · KineticText"
      align="bottom"
    />
  </AbsoluteFill>
);

// ─── Section 4 — Shape Library ──────────────────────────────────────────────
const SectionShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const shapes = [
    { name: "Triangle", color: BRAND.primary, x: 180, y: 600 },
    { name: "Star", color: BRAND.amber, x: 540, y: 600 },
    { name: "Heart", color: BRAND.danger, x: 900, y: 600 },
    { name: "Polygon", color: BRAND.iso9001, x: 360, y: 1100 },
    { name: "Circle", color: BRAND.iso14001, x: 720, y: 1100 },
  ];

  return (
    <AbsoluteFill>
      <DarkBackground />
      {shapes.map((s, i) => {
        const enter = spring({
          frame: Math.max(0, frame - 10 - i * 12),
          fps,
          config: { damping: 12, stiffness: 100, mass: 0.6 },
        });
        const opacity = interpolate(
          frame,
          [10 + i * 12, 25 + i * 12],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={s.name}
            style={{
              position: "absolute",
              left: s.x - 90,
              top: s.y - 90,
              width: 180,
              height: 180,
              opacity,
              transform: `scale(${enter}) rotate(${(1 - enter) * 90}deg)`,
              filter: `drop-shadow(0 0 30px ${s.color}80)`,
            }}
          >
            {s.name === "Triangle" && (
              <Triangle length={170} direction="up" fill={s.color} />
            )}
            {s.name === "Star" && (
              <Star
                innerRadius={45}
                outerRadius={90}
                points={5}
                fill={s.color}
              />
            )}
            {s.name === "Heart" && <Heart height={180} fill={s.color} />}
            {s.name === "Polygon" && (
              <Polygon points={6} radius={90} fill={s.color} />
            )}
            {s.name === "Circle" && <Circle radius={90} fill={s.color} />}
          </div>
        );
      })}
      <SectionTitle
        title="Shape Library"
        subtitle="@remotion/shapes — 9 primitives"
        align="top"
      />
    </AbsoluteFill>
  );
};

// ─── Section 5 — Path Drawing & Morph ───────────────────────────────────────
const SectionPaths: React.FC = () => {
  const frame = useCurrentFrame();

  // SVG paths designed with same structure for clean morphing.
  const blobA =
    "M 50 5 C 80 5 95 30 95 50 C 95 70 80 95 50 95 C 20 95 5 70 5 50 C 5 30 20 5 50 5 Z";
  const blobB =
    "M 50 5 C 70 15 95 35 85 60 C 75 85 35 95 25 75 C 15 55 5 30 30 15 C 35 12 50 5 50 5 Z";

  // A check-mark path for evolvePath drawing demo.
  const checkPath = "M 15 50 L 40 75 L 85 25";
  const checkProgress = interpolate(frame, [10, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    checkProgress,
    checkPath,
  );

  return (
    <AbsoluteFill>
      <DarkBackground />

      {/* Left half: drawing animation */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 540,
          width: 460,
          height: 460,
          background: `radial-gradient(circle, ${BRAND.iso14001}15 0%, transparent 70%)`,
          borderRadius: 30,
          padding: 40,
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path
            d={checkPath}
            stroke={BRAND.iso14001}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            style={{ filter: `drop-shadow(0 0 12px ${BRAND.iso14001})` }}
          />
        </svg>
        <div
          style={{
            textAlign: "center",
            color: BRAND.textMuted,
            fontSize: 18,
            fontFamily: FONTS.body,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: -10,
          }}
        >
          evolvePath
        </div>
      </div>

      {/* Right half: morphing blob */}
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 540,
          width: 460,
          height: 460,
          background: `radial-gradient(circle, ${BRAND.primary}15 0%, transparent 70%)`,
          borderRadius: 30,
          padding: 40,
        }}
      >
        <MorphPath
          pathFrom={blobA}
          pathTo={blobB}
          startFrame={20}
          durationInFrames={120}
          stroke={BRAND.primary}
          fill={`${BRAND.primary}30`}
          strokeWidth={2}
          viewBox="0 0 100 100"
        />
        <div
          style={{
            textAlign: "center",
            color: BRAND.textMuted,
            fontSize: 18,
            fontFamily: FONTS.body,
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginTop: -10,
          }}
        >
          MorphPath
        </div>
      </div>

      <SectionTitle
        title="Path Animation"
        subtitle="@remotion/paths · evolvePath · MorphPath"
        align="top"
      />
    </AbsoluteFill>
  );
};

// ─── Section 6 — Particles & Burst ──────────────────────────────────────────
const SectionParticles: React.FC = () => (
  <AbsoluteFill>
    <DarkBackground />
    {/* ParticleNetwork is hardcoded for 1080x1350. Translate down to recenter
        for stories format (1920 tall — center is at 960 vs. PN center 675). */}
    <AbsoluteFill style={{ transform: "translateY(285px)" }}>
      <ParticleNetwork
        count={50}
        primaryColor={BRAND.primary}
        secondaryColor={BRAND.amber}
        burstFrame={20}
      />
    </AbsoluteFill>
    <BurstRays
      startFrame={150}
      durationInFrames={60}
      rayCount={12}
      primaryColor={BRAND.primary}
      amberColor={BRAND.amber}
      burstDistance={700}
      raySize={18}
    />
    <SectionTitle
      title="Particles & Burst"
      subtitle="ParticleNetwork · BurstRays"
      align="bottom"
    />
  </AbsoluteFill>
);

// ─── Section 7 — Typography ─────────────────────────────────────────────────
const SectionTypography: React.FC = () => {
  return (
    <AbsoluteFill>
      <DarkBackground />
      <NoiseOverlay seed={5} density={35} opacity={0.08} />

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 280,
          display: "flex",
          flexDirection: "column",
          gap: 60,
        }}
      >
        {/* TypewriterText */}
        <div>
          <div
            style={{
              fontSize: 14,
              color: BRAND.primary,
              fontFamily: FONTS.body,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            TypewriterText
          </div>
          <TypewriterText
            text="Tu plataforma de gestión integral."
            startFrame={5}
            charsPerFrame={0.6}
            fontSize={42}
            fontWeight={500}
            color={BRAND.white}
            fontFamily={FONTS.body}
            cursorColor={BRAND.primary}
          />
        </div>

        {/* WordHighlight */}
        <div>
          <div
            style={{
              fontSize: 14,
              color: BRAND.primary,
              fontFamily: FONTS.body,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            WordHighlight
          </div>
          <WordHighlight
            before="Sin "
            highlight="miedo"
            after=" al éxito"
            highlightColor={`${BRAND.amber}40`}
            textColor={BRAND.white}
            fontSize={56}
            fontFamily={FONTS.heading}
            delay={70}
          />
        </div>

        {/* SplitText */}
        <div>
          <div
            style={{
              fontSize: 14,
              color: BRAND.primary,
              fontFamily: FONTS.body,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            SplitText
          </div>
          <div
            style={{
              fontSize: 50,
              fontFamily: FONTS.heading,
              color: BRAND.white,
              fontWeight: 700,
            }}
          >
            <SplitText startFrame={140} stagger={3} fromY={30} spring="smooth">
              Una plataforma. Todo integrado.
            </SplitText>
          </div>
        </div>

        {/* KineticText */}
        <div>
          <div
            style={{
              fontSize: 14,
              color: BRAND.primary,
              fontFamily: FONTS.body,
              letterSpacing: "3px",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            KineticText
          </div>
          <div
            style={{
              fontSize: 90,
              fontFamily: FONTS.heading,
              fontWeight: 900,
              color: BRAND.amber,
            }}
          >
            <KineticText startFrame={210} spring="bouncy" bobble={4}>
              ¡Espectacular!
            </KineticText>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Section 8 — UI Demo & Data Viz ─────────────────────────────────────────
const SectionUiDataViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Browser frame entrance
  const browserSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80 },
  });

  // Bar chart data viz appears after the toast settles (~frame 150)
  const dataVizOpacity = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <DarkBackground />

      {/* Mock browser frame */}
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 380,
          height: 700,
          opacity: browserSpring,
          transform: `scale(${0.92 + browserSpring * 0.08})`,
          background: BRAND.bgCard,
          borderRadius: 20,
          overflow: "hidden",
          border: `1px solid rgba(255,255,255,0.1)`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* Browser bar */}
        <div
          style={{
            height: 50,
            background: BRAND.bgElevated,
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#ef4444",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#f59e0b",
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <div
            style={{
              marginLeft: 20,
              padding: "6px 24px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.06)",
              fontSize: 18,
              color: BRAND.textSubtle,
              fontFamily: FONTS.body,
            }}
          >
            app.stratekaz.com
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 50, color: BRAND.white }}>
          <div
            style={{
              fontSize: 36,
              fontFamily: FONTS.heading,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Nuevo proyecto
          </div>
          <div
            style={{
              fontSize: 20,
              color: BRAND.textMuted,
              fontFamily: FONTS.body,
              marginBottom: 40,
            }}
          >
            Crea tu sistema de gestión en segundos.
          </div>

          {/* Submit button (target of CursorClick) */}
          <div
            style={{
              display: "inline-block",
              padding: "20px 50px",
              background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
              borderRadius: 14,
              fontSize: 28,
              fontWeight: 700,
              fontFamily: FONTS.heading,
              color: BRAND.white,
              boxShadow: `0 8px 30px ${BRAND.primary}40`,
            }}
          >
            Crear ahora
          </div>

          {/* Data viz appears after toast */}
          <div style={{ marginTop: 50, opacity: dataVizOpacity }}>
            <div
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: BRAND.primary,
                fontFamily: FONTS.heading,
                lineHeight: 1,
              }}
            >
              <CountUp
                to={94}
                startFrame={170}
                durationInFrames={50}
                suffix="%"
              />
            </div>
            <div
              style={{
                fontSize: 22,
                color: BRAND.textMuted,
                fontFamily: FONTS.body,
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Cumplimiento total
            </div>

            {/* Bar chart */}
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-end",
                marginTop: 30,
                height: 80,
              }}
            >
              {[60, 85, 70, 95, 75, 90].map((val, i) => {
                const barHeight = interpolate(
                  frame,
                  [200 + i * 5, 230 + i * 5],
                  [0, val],
                  { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                );
                return (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${barHeight}%`,
                      background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                      borderRadius: "6px 6px 0 0",
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CursorClick moves to button — button is roughly at right=60+padding+button (centered-ish) */}
      <CursorClick
        fromX={900}
        fromY={1700}
        toX={300}
        toY={950}
        startFrame={70}
        clickFrame={130}
        rippleColor={BRAND.primary}
      />

      {/* Toast appears on click */}
      <Toast
        title="¡Proyecto creado!"
        subtitle="Tu SGI está listo"
        variant="success"
        position="top-center"
        enterFrame={140}
        exitFrame={260}
      />

      <SectionTitle
        title="UI Demo & Data Viz"
        subtitle="CursorClick · Toast · CountUp"
        align="top"
      />
    </AbsoluteFill>
  );
};

// ─── Composition ────────────────────────────────────────────────────────────

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
        <SectionPaths />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionParticles />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionTypography />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SEC}>
        <SectionUiDataViz />
      </Series.Sequence>
    </Series>
  );
};
