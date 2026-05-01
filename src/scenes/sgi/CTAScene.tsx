import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from 'remotion';
import { BRAND, FONTS, SAFE } from '../../constants';

const STATS = [
  { label: 'Módulos', value: 14, suffix: '+' },
  { label: 'Normas ISO', value: 4, suffix: '' },
  { label: 'Apps', value: 84, suffix: '+' },
];

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance
  const logoSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.7 },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Stats counters
  const statsStart = 30;

  // CTA button
  const ctaSpring = spring({
    frame: Math.max(0, frame - 80),
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.7 },
  });

  // CTA pulse
  const ctaPulse = interpolate(
    frame,
    [120, 150, 180, 210, 240, 270],
    [1, 1.05, 1, 1.04, 1, 1.03],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  const ctaGlow = interpolate(
    frame,
    [120, 150, 180, 210, 240, 270],
    [0.3, 0.7, 0.3, 0.6, 0.3, 0.5],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // Slogan
  const sloganOpacity = interpolate(frame, [100, 120], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Bottom text
  const bottomOpacity = interpolate(frame, [140, 160], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.sides}px ${SAFE.bottom}px`,
      }}
    >
      {/* Big glow */}
      <div
        style={{
          position: 'absolute',
          width: 700,
          height: 700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.primary}20 0%, transparent 70%)`,
          opacity: ctaGlow,
        }}
      />

      {/* Logo */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoSpring})`,
          marginBottom: 50,
        }}
      >
        <Img
          src={staticFile('logo-light.png')}
          style={{ width: 420, objectFit: 'contain' }}
        />
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginBottom: 60,
        }}
      >
        {STATS.map((stat, i) => {
          const delay = statsStart + i * 15;
          const statSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.6 },
          });

          const countProgress = interpolate(
            frame,
            [delay, delay + 40],
            [0, 1],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          );

          const countValue = Math.round(stat.value * countProgress);

          return (
            <div
              key={i}
              style={{
                opacity: statSpring,
                transform: `translateY(${(1 - statSpring) * 30}px)`,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 800,
                  color: BRAND.primary,
                  fontFamily: FONTS.heading,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {countValue}{stat.suffix}
              </div>
              <div
                style={{
                  fontSize: 22,
                  color: BRAND.textMuted,
                  fontFamily: FONTS.body,
                  marginTop: 4,
                }}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA button */}
      <div
        style={{
          transform: `scale(${ctaSpring * ctaPulse})`,
          opacity: ctaSpring,
          position: 'relative',
          marginBottom: 40,
        }}
      >
        {/* Glow behind */}
        <div
          style={{
            position: 'absolute',
            inset: -30,
            borderRadius: 30,
            background: `radial-gradient(ellipse, ${BRAND.primary}40 0%, transparent 70%)`,
            filter: 'blur(25px)',
            opacity: ctaGlow,
          }}
        />

        <div
          style={{
            position: 'relative',
            padding: '28px 70px',
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
            borderRadius: 20,
            boxShadow: `0 8px 40px ${BRAND.primary}40`,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: BRAND.white,
              fontFamily: FONTS.heading,
              letterSpacing: '1px',
            }}
          >
            stratekaz.com
          </span>
        </div>
      </div>

      {/* Slogan */}
      <div
        style={{
          opacity: sloganOpacity,
          marginBottom: 20,
        }}
      >
        <span
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: BRAND.amber,
            fontFamily: FONTS.heading,
            fontStyle: 'italic',
          }}
        >
          Sin Miedo al Éxito!
        </span>
      </div>

      {/* Bottom tagline */}
      <div style={{ opacity: bottomOpacity }}>
        <span
          style={{
            fontSize: 22,
            color: BRAND.textSubtle,
            fontFamily: FONTS.body,
            letterSpacing: '6px',
            textTransform: 'uppercase',
          }}
        >
          Tu SGI en la nube
        </span>
      </div>

      {/* Colombia badge */}
      <div
        style={{
          position: 'absolute',
          bottom: SAFE.bottom + 20,
          opacity: bottomOpacity,
        }}
      >
        <span
          style={{
            fontSize: 20,
            color: BRAND.textSubtle,
            fontFamily: FONTS.body,
            letterSpacing: '2px',
          }}
        >
          Hecho en Colombia 🇨🇴
        </span>
      </div>
    </AbsoluteFill>
  );
};
