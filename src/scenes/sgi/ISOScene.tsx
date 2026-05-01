import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { BRAND, FONTS, SAFE } from '../../constants';

const ISO_STANDARDS = [
  {
    code: '9001',
    name: 'Calidad',
    desc: 'Procesos eficientes y mejora continua',
    color: BRAND.iso9001,
    icon: '✓',
  },
  {
    code: '14001',
    name: 'Ambiente',
    desc: 'Gestión ambiental y sostenibilidad',
    color: BRAND.iso14001,
    icon: '🌱',
  },
  {
    code: '45001',
    name: 'Seguridad',
    desc: 'Salud y seguridad en el trabajo',
    color: BRAND.iso45001,
    icon: '🛡️',
  },
  {
    code: '27001',
    name: 'InfoSec',
    desc: 'Seguridad de la información',
    color: BRAND.iso27001,
    icon: '🔐',
  },
];

export const ISOScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Central shield
  const shieldScale = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 12, stiffness: 80, mass: 0.7 },
  });

  // Shield pulse
  const shieldPulse = interpolate(
    frame,
    [60, 90, 120, 150],
    [1, 1.05, 1, 1.03],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

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
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: SAFE.top + 60,
          opacity: titleOpacity,
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 700,
            color: BRAND.white,
            fontFamily: FONTS.heading,
          }}
        >
          Cumplimiento{' '}
          <span style={{ color: BRAND.primary }}>normativo</span>
          {'\n'}de verdad
        </span>
        <div style={{ marginTop: 12 }}>
          <span
            style={{
              fontSize: 24,
              color: BRAND.textMuted,
              fontFamily: FONTS.body,
            }}
          >
            Más que un checklist — un sistema vivo
          </span>
        </div>
      </div>

      {/* Central shield */}
      <div
        style={{
          transform: `scale(${shieldScale * shieldPulse})`,
          width: 200,
          height: 220,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          marginTop: -80,
        }}
      >
        {/* Shield SVG shape */}
        <svg
          viewBox="0 0 200 220"
          width={200}
          height={220}
          style={{ position: 'absolute' }}
        >
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={BRAND.primary} stopOpacity={0.3} />
              <stop offset="100%" stopColor={BRAND.primary} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <path
            d="M100 10 L185 55 L185 130 Q185 190 100 210 Q15 190 15 130 L15 55 Z"
            fill="url(#shieldGrad)"
            stroke={BRAND.primary}
            strokeWidth={2}
            strokeOpacity={0.5}
          />
        </svg>
        <span style={{ fontSize: 64, zIndex: 1 }}>🏆</span>
      </div>

      {/* ISO cards */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          marginTop: 50,
          width: '100%',
          maxWidth: 900,
          padding: '0 20px',
        }}
      >
        {ISO_STANDARDS.map((iso, i) => {
          const delay = 30 + i * 30;
          const cardSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.6 },
          });

          const cardOpacity = interpolate(
            frame,
            [delay, delay + 15],
            [0, 1],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          );

          // Progress bar fill
          const barFill = interpolate(
            frame,
            [delay + 20, delay + 60],
            [0, 100],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          );

          return (
            <div
              key={i}
              style={{
                opacity: cardOpacity,
                transform: `translateX(${(1 - cardSpring) * (i % 2 === 0 ? -60 : 60)}px)`,
                padding: '24px 28px',
                background: `${iso.color}08`,
                border: `1.5px solid ${iso.color}35`,
                borderRadius: 18,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 32 }}>{iso.icon}</span>
                  <div>
                    <span
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: iso.color,
                        fontFamily: FONTS.heading,
                      }}
                    >
                      ISO {iso.code}
                    </span>
                    <span
                      style={{
                        fontSize: 22,
                        fontWeight: 500,
                        color: BRAND.textMuted,
                        fontFamily: FONTS.body,
                        marginLeft: 12,
                      }}
                    >
                      {iso.name}
                    </span>
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: 20,
                  color: BRAND.textSubtle,
                  fontFamily: FONTS.body,
                }}
              >
                {iso.desc}
              </span>

              {/* Progress bar */}
              <div
                style={{
                  width: '100%',
                  height: 6,
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${barFill}%`,
                    height: '100%',
                    background: iso.color,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
