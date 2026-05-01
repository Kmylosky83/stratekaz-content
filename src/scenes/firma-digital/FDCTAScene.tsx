import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { ShieldCheck, CheckCircle2, Lock, Globe } from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { FD, FD_FONTS } from './fd-constants';

const BADGES = [
  { label: 'Integrada', Icon: Lock },
  { label: 'Segura', Icon: ShieldCheck },
  { label: 'Legal', Icon: CheckCircle2 },
];

export const FDCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tagline lines staggered
  // Text writes itself starting frame 18

  // CTA button
  const ctaSpring = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.7 },
  });

  const ctaPulse = interpolate(frame, [148, 176, 204], [1, 1.05, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Subtitle letter-spacing animation
  const letterSpacing = interpolate(frame, [170, 190], [0, 6], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const subtitleOpacity = interpolate(frame, [170, 185], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Glow
  const glowOpacity = interpolate(frame, [0, 30], [0, 0.6], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Content stays visible until the end
  const contentFadeOut = 1;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 50px 80px',
      }}
    >
      {/* Soft radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${FD.primary}18 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Tagline — TypewriterText + WordHighlight, writes itself */}
      <div style={{ textAlign: 'center', marginBottom: 36, opacity: contentFadeOut }}>
        {/* "Cuando una firma vale" — types in */}
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
        {/* "tienes que estar seguro." — types in */}
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

      {/* Badge row */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 44, opacity: contentFadeOut }}>
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
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 28px',
                background: `${FD.success}08`,
                border: `1.5px solid ${FD.success}30`,
                borderRadius: 14,
                boxShadow: `0 4px 16px ${FD.success}10`,
              }}
            >
              <BadgeIcon size={32} color={FD.success} strokeWidth={2.5} />
              <span style={{ fontSize: 32, fontWeight: 700, color: FD.success, fontFamily: FD_FONTS.heading }}>
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA button with TypewriterText for URL */}
      <div
        style={{
          transform: `scale(${ctaSpring * ctaPulse})`,
          opacity: ctaSpring * contentFadeOut,
          padding: '24px 60px',
          background: FD.primary,
          borderRadius: 18,
          boxShadow: `0 8px 40px ${FD.primary}35`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
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

      {/* Subtitle — animated letter-spacing */}
      <div
        style={{
          marginTop: 24,
          opacity: subtitleOpacity * contentFadeOut,
        }}
      >
        <span
          style={{
            fontSize: 28,
            color: FD.textMuted,
            fontFamily: FD_FONTS.body,
            letterSpacing: `${letterSpacing}px`,
            textTransform: 'uppercase',
          }}
        >
          Firma Digital Integrada
        </span>
      </div>

    </AbsoluteFill>
  );
};
