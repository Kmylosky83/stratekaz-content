import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { FolderOpen, RefreshCw, ClipboardList, AlertTriangle } from 'lucide-react';
import { BRAND, FONTS, SAFE } from '../../constants';

const PAIN_POINTS = [
  { text: 'Carpetas de Excel', Icon: FolderOpen },
  { text: 'Procesos manuales', Icon: RefreshCw },
  { text: 'Auditorías a ciegas', Icon: ClipboardList },
  { text: 'Riesgos sin control', Icon: AlertTriangle },
];

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const questionOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const painPointsStart = 30;

  const exitOpacity = interpolate(frame, [110, 125], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // TransitionSeries handles fade-out

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.sides}px ${SAFE.bottom}px`,
      }}
    >
      {/* Main hook question */}
      <div
        style={{
          opacity: questionOpacity,
          transform: `scale(${questionScale})`,
          textAlign: 'center',
          marginBottom: 80,
        }}
      >
        <span
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: BRAND.white,
            lineHeight: 1.3,
            fontFamily: FONTS.heading,
          }}
        >
          ¿Tu empresa gestiona{'\n'}
          <span style={{ color: BRAND.primary }}>calidad, seguridad{'\n'}y ambiente</span>
          {'\n'}así?
        </span>
      </div>

      {/* Pain points */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          width: '100%',
          maxWidth: 800,
        }}
      >
        {PAIN_POINTS.map((point, i) => {
          const delay = painPointsStart + i * 15;
          const pointSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 15, stiffness: 120, mass: 0.6 },
          });

          const pointOpacity = interpolate(
            frame,
            [delay, delay + 10],
            [0, 1],
            { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
          );

          const PointIcon = point.Icon;

          return (
            <div
              key={i}
              style={{
                opacity: pointOpacity,
                transform: `translateX(${(1 - pointSpring) * -80}px)`,
                padding: '20px 32px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 16,
                fontSize: 36,
                fontWeight: 500,
                color: BRAND.white,
                fontFamily: FONTS.body,
                display: 'flex',
                alignItems: 'center',
                gap: 18,
              }}
            >
              <PointIcon size={28} color={BRAND.primary} strokeWidth={2} />
              {point.text}
            </div>
          );
        })}
      </div>

      {/* ¿Te suena? */}
      <div style={{ marginTop: 60, opacity: exitOpacity }}>
        <span
          style={{
            fontSize: 40,
            fontWeight: 600,
            color: BRAND.amber,
            fontFamily: FONTS.heading,
            letterSpacing: '2px',
          }}
        >
          ¿Te suena?
        </span>
      </div>
    </AbsoluteFill>
  );
};
