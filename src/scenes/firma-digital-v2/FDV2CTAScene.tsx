// scenes/firma-digital-v2/FDV2CTAScene.tsx
// Improved CTA scene — keeps the proven copy + 3 badges, but escalates the
// climax: GlowPulse breathing instead of static glow, BurstRays radiating
// from the CTA button when the URL types in, and SplitText char-by-char
// for the bottom subtitle (more dynamic than letterSpacing animation).

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { ShieldCheck, CheckCircle2, Lock, Globe } from "lucide-react";
import { TypewriterText } from "../../components/TypewriterText";
import { WordHighlight } from "../../components/WordHighlight";
import { SplitText } from "../../components/text/SplitText";
import { GlowPulse } from "../../effects/GlowPulse";
import { BurstRays } from "../../shapes/BurstRays";
import { FD, FD_FONTS } from "../firma-digital/fd-constants";

const BADGES = [
  { label: "Integrada", Icon: Lock },
  { label: "Segura", Icon: ShieldCheck },
  { label: "Legal", Icon: CheckCircle2 },
];

export const FDV2CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // CTA button spring
  const ctaSpring = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.7 },
  });

  // Pulse on the button (preserved)
  const ctaPulse = interpolate(
    frame,
    [148, 176, 204],
    [1, 1.05, 1],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" },
  );

  // Subtitle entrance (now with SplitText, simpler logic)
  const subtitleVisible = frame >= 175;

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 50px 80px",
      }}
    >
      {/* ✨ NEW: GlowPulse breathing (replaces static radial glow) */}
      <GlowPulse
        color={FD.primary}
        size={650}
        period={50}
        minOpacity={0.18}
        maxOpacity={0.45}
        blur={40}
      />

      {/* ✨ NEW: BurstRays climax — radiate when URL types in */}
      <BurstRays
        startFrame={145}
        durationInFrames={50}
        rayCount={16}
        primaryColor={FD.primary}
        amberColor="#FFB300"
        amberEvery={4}
        burstDistance={750}
        raySize={14}
        centerX={540}
        centerY={760}
      />

      {/* Tagline — preserved typewriter + highlight pattern (works) */}
      <div style={{ textAlign: "center", marginBottom: 36, zIndex: 10 }}>
        {/* "Cuando una firma vale" */}
        {frame >= 18 && (
          <div style={{ marginBottom: 8 }}>
            <TypewriterText
              text="Cuando una firma vale"
              startFrame={18}
              charsPerFrame={0.6}
              fontSize={48}
              fontWeight={800}
              color="#1A1A2E"
              fontFamily={FD_FONTS.heading}
              showCursor={frame >= 18 && frame < 55}
            />
          </div>
        )}
        {/* "millones" — WordHighlight magenta */}
        {frame >= 53 && (
          <div style={{ marginBottom: 8 }}>
            <WordHighlight
              before=""
              highlight="millones"
              highlightColor={FD.primary}
              textColor="#ffffff"
              fontSize={72}
              fontWeight={900}
              fontFamily={FD_FONTS.heading}
              delay={55}
            />
          </div>
        )}
        {/* "tienes que estar seguro." */}
        {frame >= 70 && (
          <div>
            <TypewriterText
              text="tienes que estar seguro."
              startFrame={72}
              charsPerFrame={0.5}
              fontSize={48}
              fontWeight={800}
              color="#1A1A2E"
              fontFamily={FD_FONTS.heading}
              showCursor={frame >= 72 && frame < 120}
            />
          </div>
        )}
      </div>

      {/* Badge row (preserved) */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 44,
          zIndex: 10,
        }}
      >
        {BADGES.map((badge, i) => {
          const delay = 85 + i * 10;
          const badgeSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 12, stiffness: 120, mass: 0.5 },
          });
          const BadgeIcon = badge.Icon;

          return (
            <div
              key={i}
              style={{
                opacity: badgeSpring,
                transform: `scale(${badgeSpring})`,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 28px",
                background: `${FD.success}08`,
                border: `1.5px solid ${FD.success}30`,
                borderRadius: 14,
                boxShadow: `0 4px 16px ${FD.success}10`,
              }}
            >
              <BadgeIcon size={32} color={FD.success} strokeWidth={2.5} />
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: FD.success,
                  fontFamily: FD_FONTS.heading,
                }}
              >
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA button — preserved spring + pulse, now atop the BurstRays */}
      <div
        style={{
          transform: `scale(${ctaSpring * ctaPulse})`,
          opacity: ctaSpring,
          padding: "24px 60px",
          background: FD.primary,
          borderRadius: 18,
          boxShadow: `0 8px 40px ${FD.primary}50, 0 0 24px ${FD.primary}30`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          zIndex: 20,
        }}
      >
        <Globe size={36} color="white" strokeWidth={2} />
        <TypewriterText
          text="stratekaz.com"
          startFrame={150}
          charsPerFrame={0.8}
          fontSize={40}
          fontWeight={800}
          color="white"
          fontFamily={FD_FONTS.heading}
          showCursor={frame >= 150 && frame < 185}
        />
      </div>

      {/* ✨ NEW: SplitText subtitle (instead of letterSpacing animation) */}
      <div
        style={{
          marginTop: 24,
          fontSize: 28,
          color: FD.textMuted,
          fontFamily: FD_FONTS.body,
          letterSpacing: "6px",
          textTransform: "uppercase",
          zIndex: 10,
        }}
      >
        {subtitleVisible && (
          <SplitText
            startFrame={175}
            stagger={2}
            fromY={15}
            spring="smooth"
          >
            Firma Digital Integrada
          </SplitText>
        )}
      </div>
    </AbsoluteFill>
  );
};
