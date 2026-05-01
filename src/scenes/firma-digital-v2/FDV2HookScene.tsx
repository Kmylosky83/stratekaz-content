// scenes/firma-digital-v2/FDV2HookScene.tsx
// Improved Hook scene — preserves the proven 7s narrative beats but applies
// the new toolkit: KineticText (instead of static typewriter), GlitchFlash
// at the strikethrough moment, BurstRays climactic reveal of the sello card.

import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { PenTool, ShieldCheck } from "lucide-react";
import { KineticText } from "../../components/text/KineticText";
import { SplitText } from "../../components/text/SplitText";
import { WordHighlight } from "../../components/WordHighlight";
import { BurstRays } from "../../shapes/BurstRays";
import { GlowPulse } from "../../effects/GlowPulse";
import { FD, FD_FONTS } from "../firma-digital/fd-constants";

export const FDV2HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // PenTool icon spring (preserved)
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 60, stiffness: 280, mass: 0.6 },
  });
  const iconOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Strikethrough animation (preserved timing, with glitch flash on top)
  const strikeProgress = interpolate(frame, [100, 130], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Sello card spring (preserved)
  const sealSpring = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 65, stiffness: 220, mass: 0.6 },
  });
  const sealOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // Content fade-out
  const contentFadeOut = interpolate(frame, [175, 195], [1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 50px 80px",
      }}
    >
      {/* ✨ NEW: BurstRays climactic moment when sello card appears (frame ~120) */}
      <BurstRays
        startFrame={118}
        durationInFrames={45}
        rayCount={14}
        primaryColor={FD.primary}
        amberColor="#FFB300"
        amberEvery={3}
        burstDistance={550}
        raySize={12}
        centerX={540}
        centerY={770}
      />

      {/* PenTool card — absolute positioned (preserved layout) */}
      <div
        style={{
          position: "absolute",
          top: 470 - 70,
          left: "50%",
          transform: `translateX(-50%) scale(${0.4 + iconScale * 0.6})`,
          opacity: iconOpacity,
          width: 140,
          height: 140,
          borderRadius: 32,
          background: "white",
          border: `1.5px solid ${FD.primary}33`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: `0 0 32px ${FD.primary}18`,
          zIndex: 10,
        }}
      >
        <PenTool size={80} color={FD.primary} strokeWidth={1.5} />
      </div>

      {/* Text content — absolute, below PenTool card */}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          opacity: contentFadeOut,
          zIndex: 20,
        }}
      >
        {/* ✨ NEW: KineticText "Firma Digital" — bouncy spring instead of typewriter */}
        <div
          style={{
            textAlign: "center",
            fontSize: 72,
            fontWeight: 800,
            color: "#1A1A2E",
            fontFamily: FD_FONTS.heading,
          }}
        >
          <KineticText startFrame={15} spring="bouncy">
            Firma
          </KineticText>{" "}
          <KineticText
            startFrame={30}
            spring="pop"
            style={{ color: FD.primary }}
          >
            Digital
          </KineticText>
        </div>

        {/* "StrateKaz" — WordHighlight (preserved, it works) */}
        <div style={{ textAlign: "center" }}>
          <WordHighlight
            before=""
            highlight="StrateKaz"
            highlightColor={FD.primary}
            textColor="#ffffff"
            fontSize={52}
            fontWeight={800}
            fontFamily={FD_FONTS.heading}
            delay={45}
          />
        </div>

        {/* ✨ NEW: SplitText "Firmar no es un checkbox" with inline glitch impact at strike */}
        {/* Inline filter/shake during strike window — does NOT use AbsoluteFill,
            so the text flows horizontally as expected. */}
        {(() => {
          const inStrikeWindow = frame >= 100 && frame < 112;
          const r = inStrikeWindow
            ? ((frame * 9301 + 49297) % 233280) / 233280
            : 0;
          const decay = inStrikeWindow
            ? 1 - (frame - 100) / 12
            : 0;
          const dx = (r - 0.5) * 8 * decay;
          const dy = (r - 0.5) * 6 * decay;
          const filter = inStrikeWindow
            ? `brightness(${1 + 0.3 * decay}) hue-rotate(${(r - 0.5) * 30 * decay}deg)`
            : "none";

          return (
            <div
              style={{
                textAlign: "center",
                marginTop: 16,
                transform: `translate(${dx}px, ${dy}px)`,
                filter,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 500,
                  color: "#999999",
                  fontFamily: FD_FONTS.body,
                  position: "relative",
                  display: "inline-block",
                }}
              >
                <SplitText
                  startFrame={70}
                  stagger={2}
                  fromY={20}
                  spring="smooth"
                >
                  Firmar no es un checkbox
                </SplitText>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: `${strikeProgress * 100}%`,
                    height: 3,
                    background: "#FF1744",
                    borderRadius: 2,
                    boxShadow:
                      strikeProgress > 0
                        ? "0 0 12px #FF1744, 0 0 4px #FF1744"
                        : "none",
                    transformOrigin: "left center",
                  }}
                />
              </span>
            </div>
          );
        })()}

        {/* Sello card "Es un sello criptográfico" — spring entrance + glow halo */}
        <div style={{ position: "relative", marginTop: 8 }}>
          {/* ✨ NEW: GlowPulse halo behind the card */}
          {sealOpacity > 0.1 && (
            <div
              style={{
                position: "absolute",
                inset: -30,
                opacity: sealOpacity,
              }}
            >
              <GlowPulse
                color={FD.primary}
                size={500}
                period={45}
                minOpacity={0.3}
                maxOpacity={0.6}
                blur={30}
              />
            </div>
          )}

          <div
            style={{
              position: "relative",
              opacity: sealOpacity,
              transform: `scale(${0.7 + sealSpring * 0.3})`,
              padding: "20px 44px",
              background: "#FFFFFF",
              border: `1.5px solid ${FD.primary}33`,
              borderRadius: 24,
              display: "flex",
              alignItems: "center",
              gap: 14,
              boxShadow: `0 0 32px ${FD.primary}30, 0 8px 28px rgba(0,0,0,0.08)`,
            }}
          >
            <ShieldCheck
              size={44}
              color={FD.primary}
              strokeWidth={2}
            />
            <span
              style={{
                fontSize: 42,
                fontWeight: 700,
                color: FD.primary,
                fontFamily: FD_FONTS.heading,
              }}
            >
              Es un sello criptográfico
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
