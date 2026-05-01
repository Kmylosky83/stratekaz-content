import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { BRAND, FONTS, SAFE } from '../../constants';

// Simulated dashboard features
const FEATURES = [
  {
    title: 'Dashboard en Tiempo Real',
    items: ['KPIs gerenciales', 'Tendencias', 'Alertas activas'],
    color: BRAND.inteligencia,
    icon: '📊',
  },
  {
    title: 'Workflows Automatizados',
    items: ['Firma digital', 'Aprobaciones', 'Notificaciones'],
    color: BRAND.operaciones,
    icon: '🔄',
  },
  {
    title: 'Gestión Documental',
    items: ['Versionado', 'Plantillas ISO', 'Retención automática'],
    color: BRAND.sgi,
    icon: '📄',
  },
  {
    title: 'Gestión de Personas',
    items: ['Onboarding', 'Cargos', 'Formación'],
    color: BRAND.organizacion,
    icon: '👥',
  },
];

// Simulated KPI data
const KPIS = [
  { label: 'Cumplimiento', value: 94, suffix: '%', color: BRAND.success },
  { label: 'Riesgos', value: 12, suffix: '', color: BRAND.danger },
  { label: 'Acciones', value: 87, suffix: '%', color: BRAND.info },
  { label: 'Auditorías', value: 6, suffix: '/8', color: BRAND.inteligencia },
];

export const DemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title entrance
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [0, 15], [30, 0], {
    extrapolateRight: 'clamp',
  });

  // Browser window entrance
  const browserSpring = spring({
    frame: Math.max(0, frame - 15),
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  // KPI counter animation
  const kpiProgress = interpolate(frame, [40, 100], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Feature cards phase (after KPIs)
  const featureStart = 120;

  // TransitionSeries handles fade-out

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.sides}px ${SAFE.bottom}px`,
        opacity: 1,
      }}
    >
      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: 'center',
          marginTop: 20,
          marginBottom: 30,
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
          Todo en{' '}
          <span style={{ color: BRAND.primary }}>un solo lugar</span>
        </span>
      </div>

      {/* Simulated browser window */}
      <div
        style={{
          width: 940,
          opacity: browserSpring,
          transform: `scale(${0.9 + browserSpring * 0.1})`,
          borderRadius: 16,
          overflow: 'hidden',
          border: `1px solid rgba(255,255,255,0.1)`,
          background: BRAND.bgCard,
        }}
      >
        {/* Browser bar */}
        <div
          style={{
            height: 40,
            background: BRAND.bgElevated,
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: 8,
          }}
        >
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
          <div
            style={{
              marginLeft: 16,
              padding: '4px 20px',
              borderRadius: 6,
              background: 'rgba(255,255,255,0.06)',
              fontSize: 14,
              color: BRAND.textSubtle,
              fontFamily: FONTS.body,
            }}
          >
            app.stratekaz.com
          </div>
        </div>

        {/* Dashboard content */}
        <div style={{ padding: 24 }}>
          {/* Sidebar indicator */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 40,
              width: 4,
              height: '100%',
              background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.inteligencia}, ${BRAND.operaciones})`,
            }}
          />

          {/* KPI Row */}
          <div
            style={{
              display: 'flex',
              gap: 16,
              marginBottom: 24,
            }}
          >
            {KPIS.map((kpi, i) => {
              const kpiDelay = 40 + i * 10;
              const kpiSpring = spring({
                frame: Math.max(0, frame - kpiDelay),
                fps,
                config: { damping: 15, stiffness: 120, mass: 0.5 },
              });

              const countValue = Math.round(kpi.value * kpiProgress);

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: '18px 14px',
                    background: `${kpi.color}10`,
                    border: `1px solid ${kpi.color}30`,
                    borderRadius: 12,
                    textAlign: 'center',
                    opacity: kpiSpring,
                    transform: `translateY(${(1 - kpiSpring) * 20}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 32,
                      fontWeight: 800,
                      color: kpi.color,
                      fontFamily: FONTS.heading,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {countValue}{kpi.suffix}
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      color: BRAND.textSubtle,
                      fontFamily: FONTS.body,
                      marginTop: 4,
                    }}
                  >
                    {kpi.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Animated bar chart */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 12,
              height: 120,
              marginBottom: 24,
              padding: '0 10px',
            }}
          >
            {[75, 45, 90, 60, 85, 50, 95].map((val, i) => {
              const barDelay = 80 + i * 8;
              const barHeight = interpolate(
                frame,
                [barDelay, barDelay + 20],
                [0, val],
                { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
              );

              return (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: `${barHeight}%`,
                    borderRadius: '6px 6px 0 0',
                    background: `linear-gradient(180deg, ${BRAND.primary}, ${BRAND.primaryDark})`,
                    opacity: 0.7 + (val / 100) * 0.3,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Feature cards below browser */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          marginTop: 30,
          width: 940,
          justifyContent: 'center',
        }}
      >
        {FEATURES.map((feat, i) => {
          const delay = featureStart + i * 30;
          const featSpring = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.6 },
          });

          return (
            <div
              key={i}
              style={{
                width: 440,
                padding: '20px',
                background: `${feat.color}08`,
                border: `1px solid ${feat.color}25`,
                borderRadius: 14,
                opacity: featSpring,
                transform: `translateY(${(1 - featSpring) * 30}px)`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 28 }}>{feat.icon}</span>
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: feat.color,
                    fontFamily: FONTS.heading,
                  }}
                >
                  {feat.title}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {feat.items.map((item, j) => (
                  <span
                    key={j}
                    style={{
                      fontSize: 16,
                      color: BRAND.textMuted,
                      fontFamily: FONTS.body,
                      padding: '4px 12px',
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: 8,
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
