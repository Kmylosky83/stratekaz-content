import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { Clock, User, Globe, Monitor, Snowflake, Check, Hash, PenTool } from 'lucide-react';
import { Toast } from '../../components/Toast';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { FD, FD_FONTS } from './fd-constants';

// Signature path — 22 points for 960×220 canvas
const SIGNATURE_POINTS = [
  { x: 80, y: 85 }, { x: 130, y: 50 }, { x: 180, y: 36 },
  { x: 220, y: 56 }, { x: 200, y: 85 }, { x: 160, y: 100 },
  { x: 190, y: 125 }, { x: 250, y: 100 }, { x: 320, y: 74 },
  { x: 380, y: 64 }, { x: 430, y: 80 }, { x: 480, y: 68 },
  { x: 530, y: 52 }, { x: 580, y: 65 }, { x: 640, y: 75 },
  { x: 700, y: 62 }, { x: 750, y: 72 }, { x: 800, y: 65 },
  { x: 845, y: 75 }, { x: 880, y: 80 }, { x: 905, y: 74 },
  { x: 920, y: 78 },
];

const BADGES = [
  { icon: Hash, label: 'SHA-256', value: '3f4a9c2b8e1d6f0a...', color: '#00E5FF', dark: true },
  { icon: Clock, label: 'Timestamp', value: '2026-03-29 14:32 UTC', color: FD.primary, dark: false },
  { icon: User, label: 'Firmante', value: 'Gerente General', color: FD.primary, dark: false },
  { icon: Globe, label: 'Ubicación', value: 'IP: 190.xxx.xxx.xx', color: FD.primary, dark: false },
  { icon: Monitor, label: 'Dispositivo', value: 'Chrome 122 / Win 10', color: FD.primary, dark: false },
  { icon: Snowflake, label: 'Cargo congelado', value: 'Tu rol al momento de firmar', color: '#FFB300', dark: false },
];

const CANVAS_W = 960;
const CANVAS_H = 220;
// Canvas center stays at vertical midpoint during morph

export const FDCanvasScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === Phase 1: Card morph (0–40) ===
  const morphProgress = interpolate(frame, [5, 40], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const mp = morphProgress * morphProgress * (3 - 2 * morphProgress);

  const cardW = interpolate(mp, [0, 1], [140, CANVAS_W]);
  const cardH = interpolate(mp, [0, 1], [140, CANVAS_H]);
  const cardRadius = interpolate(mp, [0, 1], [32, 24]);
  const iconOpacity = interpolate(frame, [8, 28], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const canvasReady = interpolate(frame, [32, 48], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Glow while signing
  const glowIntensity = frame >= 55 && frame < 200
    ? 0.4 + Math.sin(frame * 0.1) * 0.3
    : frame >= 200 ? interpolate(frame, [200, 230], [0.7, 0], { extrapolateRight: 'clamp' }) : 0;

  // === Phase 2: Signing (55–195) ===
  const signProgress = interpolate(frame, [55, 195], [0, SIGNATURE_POINTS.length], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const visiblePoints = SIGNATURE_POINTS.slice(0, Math.floor(signProgress));
  let pathD = '';
  if (visiblePoints.length > 1) {
    pathD = `M ${visiblePoints[0].x} ${visiblePoints[0].y}`;
    for (let i = 1; i < visiblePoints.length; i++) {
      const prev = visiblePoints[i - 1];
      const curr = visiblePoints[i];
      const cpx = (prev.x + curr.x) / 2;
      const cpy = (prev.y + curr.y) / 2;
      pathD += ` Q ${prev.x + (curr.x - prev.x) * 0.4} ${prev.y + (curr.y - prev.y) * 0.15}, ${cpx} ${cpy}`;
    }
  }
  const currentPoint = visiblePoints.length > 0 ? visiblePoints[visiblePoints.length - 1] : SIGNATURE_POINTS[0];
  const penVisible = signProgress > 0.5 && signProgress < SIGNATURE_POINTS.length;
  const penRotation = interpolate(frame, [55, 100, 160, 195], [-12, 8, -5, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Check (frame 198)
  const checkSpring = spring({ frame: Math.max(0, frame - 198), fps, config: { damping: 50, stiffness: 350, mass: 0.5 } });

  // === Phase 3: Canvas shrinks slightly in place (210–240) ===
  const canvasShrink = interpolate(frame, [210, 240], [1, 0.85], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // === Phase 4: Title appears ABOVE canvas (250+) ===
  const titleVisible = frame >= 245;

  // === Phase 5: Badges appear BELOW canvas one by one (310+) ===
  const badgesStart = 310;

  // Canvas Y: card center stays at ~y:480 (matching E1 PenTool position after texts fade)
  // Expands from center so it doesn't jump
  const cardCenterY = 470;
  const canvasTop = cardCenterY - cardH / 2;

  // === Phase 6: Content gone well before scene ends — last 50f are just particles ===
  const contentFadeForVortex = interpolate(frame, [475, 495], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Canvas Y: stays centered always, just shrinks

  return (
    <AbsoluteFill>
      {/* Canvas — absolute, centered */}
      <div
        style={{
          position: 'absolute',
          top: canvasTop,
          left: '50%',
          transform: `translateX(-50%) scale(${frame < 210 ? 1 : canvasShrink})`,
          transformOrigin: 'center center',
          opacity: contentFadeForVortex,
        }}
      >
        <div
          style={{
            width: cardW,
            height: cardH,
            background: mp < 0.5 ? 'white' : '#FAFAFF',
            border: `${mp < 0.3 ? 1.5 : 2}px solid ${glowIntensity > 0.1 ? FD.primary : mp < 0.5 ? FD.primary + '33' : '#E8E8F0'}`,
            borderRadius: cardRadius,
            position: 'relative',
            overflow: 'visible',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: glowIntensity > 0.1
              ? `0 0 ${20 + glowIntensity * 40}px ${FD.primary}${Math.round(glowIntensity * 60).toString(16).padStart(2, '0')}, 0 12px 40px rgba(0,0,0,0.06)`
              : mp < 0.5 ? `0 0 32px ${FD.primary}18` : '0 12px 40px rgba(0,0,0,0.06)',
          }}
        >
          {/* PenTool icon */}
          {iconOpacity > 0.01 && (
            <div style={{ opacity: iconOpacity, position: 'absolute' }}>
              <PenTool size={56} color={FD.primary} strokeWidth={1.5} />
            </div>
          )}

          {/* Canvas internals */}
          {canvasReady > 0.01 && (
            <div style={{ opacity: canvasReady, position: 'absolute', inset: 0 }}>
              <div style={{ position: 'absolute', bottom: 44, left: 40, right: 40, height: 1.5, background: '#E8E8F0' }} />
              <div style={{ position: 'absolute', bottom: 14, right: 30, fontSize: 28, color: '#BBBBC8', fontFamily: FD_FONTS.body }}>Firme aquí</div>
              <svg width={CANVAS_W} height={CANVAS_H} style={{ position: 'absolute', top: 0, left: 0 }}>
                {pathD && <path d={pathD} fill="none" stroke="#1A1A2E" strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round" />}
              </svg>
              {penVisible && (
                <div style={{ position: 'absolute', left: (currentPoint?.x ?? 0) - 2, top: (currentPoint?.y ?? 0) - 38, transform: `rotate(${penRotation + 15}deg)`, fontSize: 36, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', zIndex: 10 }}>🖊️</div>
              )}
              {frame > 198 && (
                <div style={{ position: 'absolute', top: 12, right: 12, width: 46, height: 46, borderRadius: '50%', background: '#00C85322', border: '2px solid #00C853', display: 'flex', justifyContent: 'center', alignItems: 'center', transform: `scale(${checkSpring})`, zIndex: 20 }}>
                  <Check size={22} color="#00C853" strokeWidth={3} />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Toasts */}
      <Toast enterFrame={200} exitFrame={260} title="Firma capturada" subtitle="Generando hash SHA-256..." variant="loading" position="top-right" />
      <Toast enterFrame={235} exitFrame={305} title="Hash generado" subtitle="Documento verificado" variant="success" position="top-right" offsetY={88} />

      {/* Title — ABOVE canvas, two lines */}
      {titleVisible && (
        <div
          style={{
            position: 'absolute',
            top: canvasTop * canvasShrink - 130,
            left: 0,
            right: 0,
            textAlign: 'center',
            opacity: contentFadeForVortex,
          }}
        >
          <div style={{ marginBottom: 4 }}>
            <TypewriterText
              text="Un trazo,"
              startFrame={250}
              charsPerFrame={0.5}
              fontSize={52}
              fontWeight={800}
              color="#1A1A2E"
              fontFamily={FD_FONTS.heading}
              showCursor={frame >= 250 && frame < 285}
            />
          </div>
          {frame >= 283 && (
            <WordHighlight
              before=""
              highlight="solo tuyo."
              highlightColor={FD.primary}
              textColor="#ffffff"
              fontSize={56}
              fontWeight={900}
              fontFamily={FD_FONTS.heading}
              delay={285}
            />
          )}
        </div>
      )}

      {/* Badges — BELOW canvas, 2 columns, sequential */}
      <div
        style={{
          position: 'absolute',
          top: canvasTop + CANVAS_H * canvasShrink + 50,
          left: 50,
          right: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          opacity: contentFadeForVortex,
        }}
      >
        {/* SHA-256 protagonist — full width */}
        {frame >= badgesStart && (() => {
          const s = spring({ frame: Math.max(0, frame - badgesStart), fps, config: { damping: 15, stiffness: 100, mass: 0.5 } });
          return (
            <div
              style={{
                opacity: s,
                transform: `translateY(${(1 - s) * 25}px)`,
                padding: '20px 28px',
                background: '#0A1628',
                borderRadius: 20,
                border: '1.5px solid #00E5FF33',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: '0 4px 24px rgba(0,229,255,0.1)',
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#00E5FF18', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <Hash size={36} color="#00E5FF" strokeWidth={2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 28, color: '#00E5FF88', fontFamily: FD_FONTS.body, fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>SHA-256</div>
                <TypewriterText
                  text="3f4a9c2b8e1d6f0a..."
                  startFrame={badgesStart + 5}
                  charsPerFrame={1.0}
                  fontSize={36}
                  fontWeight={700}
                  color="#00E5FF"
                  fontFamily="'JetBrains Mono', monospace"
                  showCursor={frame >= badgesStart + 5 && frame < badgesStart + 30}
                />
              </div>
            </div>
          );
        })()}

        {/* 2-column grid for metadata + cargo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {BADGES.slice(1).map((badge, i) => {
            const delay = badgesStart + 25 + i * 18;
            const s = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 15, stiffness: 120, mass: 0.5 } });
            const IconComp = badge.icon;
            if (s < 0.01) return null;

            const isAccent = badge.icon === Snowflake;
            return (
              <div
                key={i}
                style={{
                  opacity: s,
                  transform: `translateY(${(1 - s) * 20}px)`,
                  padding: '16px 18px',
                  background: isAccent ? 'linear-gradient(135deg, #FFF8E1, #FFF3E0)' : 'white',
                  borderRadius: 18,
                  border: `1.5px solid ${isAccent ? '#FFB30044' : '#E8E8F0'}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${isAccent ? '#FFB300' : badge.color}12`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                  <IconComp size={32} color={isAccent ? '#E65100' : badge.color} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 24, color: '#9999BB', fontFamily: FD_FONTS.body, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{badge.label}</div>
                  <span style={{ fontSize: 32, color: isAccent ? '#E65100' : '#1A1A2E', fontFamily: FD_FONTS.body, fontWeight: 600 }}>{badge.value}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vortex is handled by global ParticleNetwork in FDBackground */}
    </AbsoluteFill>
  );
};
