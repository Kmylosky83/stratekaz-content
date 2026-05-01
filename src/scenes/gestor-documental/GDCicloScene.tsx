import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { FileText, ScanLine, FormInput, ShieldCheck, Eye } from 'lucide-react';
import { CursorClick } from '../../components/CursorClick';
import { Toast } from '../../components/Toast';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { GD, GD_FONTS } from './gd-constants';

const ESTADOS = [
  { label: 'BORRADOR', color: GD.amber, glowColor: GD.amberGlow, frame: 60 },
  { label: 'EN REVISIÓN', color: GD.cyan, glowColor: GD.cyanGlow, frame: 130 },
  { label: 'APROBADO', color: GD.green, glowColor: GD.greenGlow, frame: 190 },
  { label: 'PUBLICADO', color: GD.primary, glowColor: GD.primaryGlow, frame: 225 },
];

const FEATURES = [
  { name: 'OCR Inteligente', Icon: ScanLine, color: GD.cyan },
  { name: 'Formularios', Icon: FormInput, color: GD.primary },
  { name: 'Sellado X.509', Icon: ShieldCheck, color: GD.green },
  { name: 'Lectura Verificada', Icon: Eye, color: GD.violet },
];

export const GDCicloScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card morph from icon to document
  const morphProgress = interpolate(frame, [5, 40], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const mp = morphProgress * morphProgress * (3 - 2 * morphProgress);
  const cardW = interpolate(mp, [0, 1], [140, 900]);
  const cardH = interpolate(mp, [0, 1], [140, 500]);
  const cardRadius = interpolate(mp, [0, 1], [32, 20]);
  const iconOpacity = interpolate(frame, [8, 28], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const docReady = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Current estado
  const currentEstado = ESTADOS.reduce((acc, e) => (frame >= e.frame ? e : acc), ESTADOS[0]);
  const badgeSpring = spring({ frame: Math.max(0, frame - currentEstado.frame), fps, config: { damping: 12, stiffness: 120, mass: 0.5 } });

  // Document lines appear
  const linesVisible = docReady;

  // After PUBLICADO — document shrinks, title + features appear
  const shrinkPhase = frame >= 250;
  const docScale = shrinkPhase ? interpolate(frame, [250, 280], [1, 0.55], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : 1;
  const docY = shrinkPhase ? interpolate(frame, [250, 280], [0, -100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : 0;

  const titleVisible = frame >= 270;
  const featuresStart = 300;

  // Exit
  const contentFade = interpolate(frame, [450, 475], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Document position — centered
  const cardCenterY = 470;
  const canvasTop = cardCenterY - (cardH as number) / 2;

  return (
    <AbsoluteFill>
      {/* Document card — morphs from icon */}
      <div
        style={{
          position: 'absolute',
          top: canvasTop + docY,
          left: '50%',
          transform: `translateX(-50%) scale(${docScale})`,
          transformOrigin: 'top center',
          opacity: contentFade,
        }}
      >
        <div
          style={{
            width: cardW,
            height: cardH,
            background: mp < 0.5 ? GD.bgSurface : GD.bgCard,
            border: `1.5px solid ${mp < 0.5 ? GD.primary + '40' : GD.border}`,
            borderRadius: cardRadius,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: mp < 0.5 ? GD.neonGlow : `0 8px 40px rgba(0,0,0,0.4)`,
          }}
        >
          {/* FileText icon during morph */}
          {iconOpacity > 0.01 && (
            <div style={{ opacity: iconOpacity, position: 'absolute' }}>
              <FileText size={80} color={GD.primary} strokeWidth={1.5} />
            </div>
          )}

          {/* Document content lines */}
          {docReady > 0.01 && (
            <div style={{ opacity: linesVisible, position: 'absolute', inset: 30, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Header line */}
              <div style={{ width: '60%', height: 16, borderRadius: 8, background: GD.textSubtle, opacity: 0.3 }} />
              <div style={{ width: '40%', height: 12, borderRadius: 6, background: GD.textSubtle, opacity: 0.2 }} />
              <div style={{ height: 1, background: GD.border, marginTop: 8, marginBottom: 8 }} />
              {/* Body lines */}
              {[85, 75, 90, 60, 80, 70, 50, 85, 65].map((w, i) => (
                <div
                  key={i}
                  style={{
                    width: `${w}%`,
                    height: 10,
                    borderRadius: 5,
                    background: GD.textSubtle,
                    opacity: interpolate(frame, [45 + i * 3, 50 + i * 3], [0, 0.15], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  }}
                />
              ))}
            </div>
          )}

          {/* Estado badge */}
          {frame >= 60 && (
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                padding: '10px 28px',
                background: currentEstado.color + '18',
                border: `2px solid ${currentEstado.color}`,
                borderRadius: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: `0 0 ${15 + Math.sin(frame * 0.15) * 8}px ${currentEstado.glowColor}`,
                transform: `scale(${badgeSpring})`,
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 800, color: currentEstado.color, fontFamily: GD_FONTS.heading, letterSpacing: '2px' }}>
                {currentEstado.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Cursor clicks */}
      <CursorClick fromX={800} fromY={300} toX={700} toY={500} startFrame={80} clickFrame={100} showRipple rippleColor={GD.cyan} />
      <CursorClick fromX={800} fromY={300} toX={700} toY={500} startFrame={150} clickFrame={170} showRipple rippleColor={GD.green} />

      {/* Toasts */}
      <Toast enterFrame={105} exitFrame={145} title="Enviado a revisión" subtitle="Notificando revisores..." variant="loading" position="top-right" />
      <Toast enterFrame={175} exitFrame={215} title="Documento aprobado" variant="success" position="top-right" />

      {/* Title — after document shrinks */}
      {titleVisible && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center', opacity: contentFade }}>
          <div>
            <TypewriterText
              text="Del borrador a la publicación"
              startFrame={275}
              charsPerFrame={0.6}
              fontSize={44}
              fontWeight={800}
              color={GD.textWhite}
              fontFamily={GD_FONTS.heading}
              showCursor={frame >= 275 && frame < 310}
              cursorColor={GD.primary}
            />
          </div>
          {frame >= 308 && (
            <div style={{ marginTop: 6 }}>
              <WordHighlight
                before=""
                highlight="todo controlado"
                highlightColor={GD.primary}
                textColor="#ffffff"
                fontSize={48}
                fontWeight={900}
                fontFamily={GD_FONTS.heading}
                delay={310}
              />
            </div>
          )}
        </div>
      )}

      {/* 4 Feature cards — grid 2×2 */}
      <div
        style={{
          position: 'absolute',
          top: 780,
          left: 50,
          right: 50,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          opacity: contentFade,
        }}
      >
        {FEATURES.map((feat, i) => {
          const delay = featuresStart + i * 20;
          const fSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 100, mass: 0.5 } });
          const IconComp = feat.Icon;
          const highlight = interpolate(frame, [370 + i * 12, 378 + i * 12, 390 + i * 12], [0, 1, 0.3], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

          if (fSpring < 0.01) return null;
          return (
            <div
              key={i}
              style={{
                opacity: fSpring,
                transform: `scale(${0.85 + fSpring * 0.15})`,
                padding: '22px 24px',
                background: GD.bgSurface,
                border: `1.5px solid ${feat.color}30`,
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: `0 0 ${10 + highlight * 20}px ${feat.color}25`,
              }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: feat.color + '15', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <IconComp size={32} color={feat.color} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 30, fontWeight: 700, color: GD.textWhite, fontFamily: GD_FONTS.heading }}>
                {feat.name}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
