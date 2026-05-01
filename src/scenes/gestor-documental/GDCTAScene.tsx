import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from 'remotion';
import { ScanLine, ShieldCheck, GitBranch, Globe } from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { GD, GD_FONTS } from './gd-constants';

const BADGES = [
  { label: 'OCR', Icon: ScanLine, color: GD.cyan },
  { label: 'Sellado', Icon: ShieldCheck, color: GD.green },
  { label: 'Trazabilidad', Icon: GitBranch, color: GD.violet },
];

export const GDCTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoSpring = spring({ frame: Math.max(0, frame - 15), fps, config: { damping: 12, stiffness: 80, mass: 0.7 } });

  // CTA button
  const ctaSpring = spring({ frame: Math.max(0, frame - 160), fps, config: { damping: 10, stiffness: 80, mass: 0.7 } });
  const ctaPulse = 1 + Math.sin(frame * 0.15) * 0.03;

  // Subtitle
  const subtitleOpacity = interpolate(frame, [200, 220], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const letterSpacing = interpolate(frame, [200, 230], [0, 6], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Glow
  const glowOpacity = interpolate(frame, [0, 30], [0, 0.5], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const glowPulse = 0.3 + Math.sin(frame * 0.08) * 0.2;

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 50px 80px',
      }}
    >
      {/* Background glow — pulsing magenta */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${GD.primary}${Math.round(glowPulse * 25).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Logo light — 420px */}
      <div style={{ transform: `scale(${logoSpring})`, marginBottom: 36 }}>
        <Img src={staticFile('logo-light.png')} style={{ width: 420, objectFit: 'contain' }} />
      </div>

      {/* "Gestión Documental" TypewriterText */}
      {frame >= 50 && (
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <TypewriterText
            text="Gestión Documental"
            startFrame={55}
            charsPerFrame={0.5}
            fontSize={48}
            fontWeight={800}
            color={GD.textWhite}
            fontFamily={GD_FONTS.heading}
            showCursor={frame >= 55 && frame < 95}
            cursorColor={GD.primary}
          />
        </div>
      )}

      {/* "Inteligente" WordHighlight */}
      {frame >= 93 && (
        <div style={{ marginBottom: 36 }}>
          <WordHighlight
            before=""
            highlight="Inteligente"
            highlightColor={GD.primary}
            textColor="#ffffff"
            fontSize={56}
            fontWeight={900}
            fontFamily={GD_FONTS.heading}
            delay={95}
          />
        </div>
      )}

      {/* 3 Badges pill */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 40 }}>
        {BADGES.map((badge, i) => {
          const delay = 120 + i * 12;
          const bSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 120, mass: 0.5 } });
          const BadgeIcon = badge.Icon;
          if (bSpring < 0.01) return null;
          return (
            <div
              key={i}
              style={{
                opacity: bSpring,
                transform: `scale(${bSpring})`,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '14px 28px',
                background: badge.color + '12',
                border: `1.5px solid ${badge.color}40`,
                borderRadius: 40,
                boxShadow: `0 0 ${10 + Math.sin(frame * 0.1 + i) * 8}px ${badge.color}20`,
              }}
            >
              <BadgeIcon size={28} color={badge.color} strokeWidth={2} />
              <span style={{ fontSize: 30, fontWeight: 700, color: badge.color, fontFamily: GD_FONTS.heading }}>{badge.label}</span>
            </div>
          );
        })}
      </div>

      {/* CTA button — magenta neon */}
      <div
        style={{
          transform: `scale(${ctaSpring * ctaPulse})`,
          opacity: ctaSpring,
          padding: '24px 60px',
          background: GD.primary,
          borderRadius: 18,
          boxShadow: `0 0 ${25 + Math.sin(frame * 0.12) * 15}px ${GD.primaryGlow}`,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Globe size={32} color="white" strokeWidth={2} />
        <TypewriterText
          text="stratekaz.com"
          startFrame={165}
          charsPerFrame={0.7}
          fontSize={40}
          fontWeight={800}
          color="#FFFFFF"
          fontFamily={GD_FONTS.heading}
          showCursor={frame >= 165 && frame < 200}
        />
      </div>

      {/* Subtitle */}
      <div style={{ marginTop: 24, opacity: subtitleOpacity }}>
        <span
          style={{
            fontSize: 28,
            color: GD.textMuted,
            fontFamily: GD_FONTS.body,
            letterSpacing: `${letterSpacing}px`,
            textTransform: 'uppercase',
          }}
        >
          Gestión Documental Integrada
        </span>
      </div>
    </AbsoluteFill>
  );
};
