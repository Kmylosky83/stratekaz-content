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

export const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo entrance with bounce
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 80, mass: 0.7 },
  });

  const logoOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Glow pulse behind logo
  const glowOpacity = interpolate(
    frame,
    [20, 40, 60, 80],
    [0.2, 0.5, 0.3, 0.5],
    { extrapolateRight: 'clamp' }
  );

  // Decorative line
  const lineWidth = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: { damping: 18, stiffness: 60, mass: 0.5 },
  });

  // Tagline
  const taglineOpacity = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  const taglineY = interpolate(frame, [40, 60], [30, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Slogan
  const sloganOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Colombiana badge
  const badgeSpring = spring({
    frame: Math.max(0, frame - 95),
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.5 },
  });

  // TransitionSeries handles fade-out

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.sides}px ${SAFE.bottom}px`,
        opacity: 1,
      }}
    >
      {/* Glow behind logo */}
      <div
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.primary}30 0%, transparent 70%)`,
          opacity: glowOpacity,
        }}
      />

      {/* Logo image */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoScale})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <Img
          src={staticFile('logo-light.png')}
          style={{
            width: 500,
            objectFit: 'contain',
          }}
        />

        {/* Decorative line */}
        <div
          style={{
            width: `${lineWidth * 400}px`,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${BRAND.primary}, transparent)`,
            borderRadius: 2,
            marginTop: 10,
          }}
        />
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          marginTop: 40,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: BRAND.textMuted,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            fontFamily: FONTS.body,
          }}
        >
          Sistema de Gestión Integral
        </span>
      </div>

      {/* Slogan */}
      <div
        style={{
          opacity: sloganOpacity,
          marginTop: 30,
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: BRAND.amber,
            fontFamily: FONTS.heading,
            fontStyle: 'italic',
          }}
        >
          Sin Miedo al Éxito!
        </span>
      </div>

      {/* Badge colombiana */}
      <div
        style={{
          marginTop: 50,
          opacity: badgeSpring,
          transform: `scale(${badgeSpring})`,
          padding: '14px 40px',
          border: `1.5px solid ${BRAND.primary}60`,
          borderRadius: 40,
          background: `${BRAND.primary}10`,
        }}
      >
        <span
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: BRAND.primaryLight,
            letterSpacing: '3px',
            textTransform: 'uppercase',
            fontFamily: FONTS.body,
          }}
        >
          Hecho en Colombia 🇨🇴
        </span>
      </div>
    </AbsoluteFill>
  );
};
