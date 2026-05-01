import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import {
  Building2,
  Target,
  ClipboardCheck,
  Cog,
  Users,
  BarChart3,
} from 'lucide-react';
import { BRAND, FONTS, SAFE } from '../../constants';

const PILARES = [
  { name: 'Fundación', desc: 'Identidad, estructura y contexto organizacional', color: BRAND.fundacion, Icon: Building2 },
  { name: 'Planeación', desc: 'Objetivos, proyectos y encuestas estratégicas', color: BRAND.planeacion, Icon: Target },
  { name: 'Sistema de Gestión', desc: 'Cumplimiento legal, documental y normativo', color: BRAND.sgi, Icon: ClipboardCheck },
  { name: 'Operaciones', desc: 'HSEQ, supply chain, producción y logística', color: BRAND.operaciones, Icon: Cog },
  { name: 'Organización', desc: 'Talento humano, nómina y administración', color: BRAND.organizacion, Icon: Users },
  { name: 'Inteligencia', desc: 'KPIs, dashboards y revisión por la dirección', color: BRAND.inteligencia, Icon: BarChart3 },
];

export const PilaresScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 14, stiffness: 80, mass: 0.8 } });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const subtitleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const hubScale = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 10, stiffness: 60, mass: 0.8 } });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: `${SAFE.top}px ${SAFE.sides}px ${SAFE.bottom}px`,
      }}
    >
      {/* Title */}
      <div style={{ opacity: titleOpacity, transform: `scale(${titleSpring})`, textAlign: 'center', marginTop: 40 }}>
        <span style={{ fontSize: 48, fontWeight: 700, color: BRAND.white, fontFamily: FONTS.heading }}>
          Una plataforma.{'\n'}
          <span style={{ color: BRAND.primary }}>Todo integrado.</span>
        </span>
      </div>

      <div style={{ opacity: subtitleOpacity, marginTop: 16, marginBottom: 40 }}>
        <span style={{ fontSize: 26, fontWeight: 400, color: BRAND.textMuted, fontFamily: FONTS.body }}>
          6 capas que cubren tu operación completa
        </span>
      </div>

      {/* Center hub */}
      <div style={{ position: 'relative', width: 900, height: 1200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {/* Central circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) scale(${hubScale})`,
            width: 160, height: 160, borderRadius: '50%',
            background: `radial-gradient(circle, ${BRAND.primary}30, ${BRAND.primary}08)`,
            border: `2px solid ${BRAND.primary}50`,
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700, color: BRAND.primary, fontFamily: FONTS.heading, textAlign: 'center', letterSpacing: '1px' }}>
            Strate{'\n'}Kaz
          </span>
        </div>

        {/* Pilar cards */}
        {PILARES.map((pilar, i) => {
          const delay = 40 + i * 40;
          const cardSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 100, mass: 0.6 } });
          const cardOpacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

          const col = i % 2;
          const row = Math.floor(i / 2);
          const xOffset = col === 0 ? -220 : 220;
          const yOffset = (row - 1) * 320;

          const lineProgress = interpolate(frame, [delay + 5, delay + 20], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

          const PilarIcon = pilar.Icon;

          return (
            <div key={i}>
              {/* Connection line */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: Math.abs(xOffset) - 80,
                  height: 2,
                  background: `${pilar.color}60`,
                  transform: `translate(${col === 0 ? -Math.abs(xOffset) + 80 : 80}px, ${yOffset}px) scaleX(${lineProgress})`,
                  transformOrigin: col === 0 ? 'right' : 'left',
                  opacity: cardOpacity,
                }}
              />

              {/* Card */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: `translate(${xOffset - 170}px, ${yOffset - 120}px) scale(${cardSpring})`,
                  opacity: cardOpacity,
                  width: 340,
                  padding: '28px 24px',
                  background: `${pilar.color}08`,
                  border: `1.5px solid ${pilar.color}40`,
                  borderRadius: 20,
                  display: 'flex', flexDirection: 'column', gap: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: `${pilar.color}15`,
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                    }}
                  >
                    <PilarIcon size={24} color={pilar.color} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 28, fontWeight: 700, color: pilar.color, fontFamily: FONTS.heading }}>
                    {pilar.name}
                  </span>
                </div>

                <span style={{ fontSize: 22, fontWeight: 400, color: BRAND.textMuted, fontFamily: FONTS.body, lineHeight: 1.4 }}>
                  {pilar.desc}
                </span>

                <div style={{ width: '100%', height: 3, borderRadius: 2, background: `linear-gradient(90deg, ${pilar.color}, transparent)`, marginTop: 4 }} />
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
