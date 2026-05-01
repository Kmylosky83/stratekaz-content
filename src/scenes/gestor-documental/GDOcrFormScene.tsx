import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { ScanLine, Type, ListFilter, Calendar, PenTool } from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { GD, GD_FONTS } from './gd-constants';

const FORM_FIELDS = [
  { label: 'Nombre del documento', Icon: Type, direction: 'left' as const },
  { label: 'Tipo: Procedimiento', Icon: ListFilter, direction: 'right' as const },
  { label: 'Fecha vigencia', Icon: Calendar, direction: 'left' as const },
  { label: 'Firma responsable', Icon: PenTool, direction: 'right' as const },
];

const PILLS = [
  { text: '16 tipos de campo', color: GD.cyan },
  { text: 'Fórmulas calculadas', color: GD.primary },
  { text: 'Validación automática', color: GD.green },
];

export const GDOcrFormScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ScanLine icon appears from center
  const scanIconSpring = spring({ frame, fps, config: { damping: 12, stiffness: 80, mass: 0.6 } });

  // Icon moves to top-left, PDF appears
  const iconMoveProgress = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const iconSmooth = iconMoveProgress * iconMoveProgress * (3 - 2 * iconMoveProgress);

  // OCR scan line effect
  const scanLineY = interpolate(frame, [35, 85], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scanVisible = frame >= 30 && frame < 100;

  // Text appears behind scan line
  const textReveal = interpolate(frame, [35, 85], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Toast
  const toastVisible = frame >= 85 && frame < 125;

  // Title OCR Inteligente
  const ocrTitleVisible = frame >= 100;

  // PDF fades → Form appears
  const pdfToForm = interpolate(frame, [120, 145], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Form fields stagger
  const formStart = 150;

  // Title erase → rewrite
  const eraseStart = 200;
  const titleText = 'OCR Inteligente';
  const eraseElapsed = Math.max(0, frame - eraseStart);
  const eraseCount = Math.min(titleText.length, Math.floor(eraseElapsed * 0.8));
  const titleErased = titleText.length - eraseCount;
  const newTitleStart = 230;
  const newTitleVisible = frame >= newTitleStart;

  // Pills
  const pillsStart = 260;

  // Exit
  const exitEraseStart = 380;
  const exitText = 'Construye cualquier formulario';
  const exitEraseElapsed = Math.max(0, frame - exitEraseStart);
  const exitEraseCount = Math.min(exitText.length, Math.floor(exitEraseElapsed * 0.8));
  const exitTitleErased = exitText.length - exitEraseCount;
  const exitNewTitleStart = 400;
  const exitNewTitleVisible = frame >= exitNewTitleStart;

  const contentFade = interpolate(frame, [380, 400], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill>
      {/* ScanLine icon — starts center, moves to top-left */}
      <div
        style={{
          position: 'absolute',
          top: interpolate(iconSmooth, [0, 1], [470 - 40, 100]),
          left: interpolate(iconSmooth, [0, 1], [540 - 40, 80]),
          transform: `scale(${scanIconSpring * interpolate(iconSmooth, [0, 1], [1, 0.6])})`,
          opacity: scanIconSpring * contentFade,
          zIndex: 20,
        }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: GD.bgSurface, border: `1.5px solid ${GD.cyan}40`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          boxShadow: GD.cyanNeonGlow,
        }}>
          <ScanLine size={44} color={GD.cyan} strokeWidth={1.8} />
        </div>
      </div>

      {/* PDF Document / Form — centered */}
      <div
        style={{
          position: 'absolute',
          top: 250,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 900,
          opacity: frame >= 20 ? 1 : 0,
        }}
      >
        {/* PDF with OCR scan */}
        {pdfToForm < 0.95 && (
          <div
            style={{
              opacity: 1 - pdfToForm,
              padding: 30,
              background: GD.bgCard,
              border: `1.5px solid ${GD.border}`,
              borderRadius: 20,
              position: 'relative',
              overflow: 'hidden',
              minHeight: 400,
            }}
          >
            {/* Simulated scanned text — reveals as scan passes */}
            <div style={{ opacity: textReveal * 0.6 }}>
              {['Procedimiento de Control de Documentos', '', 'Objetivo: Establecer los lineamientos...', 'Alcance: Aplica a todos los procesos...', '', 'Responsable: Director de Calidad', 'Revisión: Anual', '', 'Este procedimiento define las actividades...'].map((line, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: 28,
                    fontWeight: i === 0 ? 700 : 400,
                    color: i === 0 ? GD.textWhite : GD.textMuted,
                    fontFamily: GD_FONTS.body,
                    marginBottom: 12,
                    opacity: interpolate(textReveal, [i * 0.1, i * 0.1 + 0.15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
                  }}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>

            {/* Scan line — cyan horizontal */}
            {scanVisible && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${scanLineY}%`,
                  height: 3,
                  background: GD.cyan,
                  boxShadow: `0 0 20px ${GD.cyan}, 0 0 40px ${GD.cyanGlow}`,
                  zIndex: 5,
                }}
              />
            )}
          </div>
        )}

        {/* Form Builder */}
        {pdfToForm > 0.05 && (
          <div
            style={{
              opacity: pdfToForm,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {FORM_FIELDS.map((field, i) => {
              const delay = formStart + i * 18;
              const fSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 100, mass: 0.5 } });
              const IconComp = field.Icon;
              const slideX = field.direction === 'left' ? -60 : 60;

              if (fSpring < 0.01) return null;
              return (
                <div
                  key={i}
                  style={{
                    opacity: fSpring,
                    transform: `translateX(${(1 - fSpring) * slideX}px)`,
                    padding: '24px 28px',
                    background: GD.bgSurface,
                    border: `1.5px solid ${GD.border}`,
                    borderRadius: 18,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 18,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                  }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: GD.primary + '15', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    <IconComp size={28} color={GD.primary} strokeWidth={2} />
                  </div>
                  <span style={{ fontSize: 32, fontWeight: 600, color: GD.textWhite, fontFamily: GD_FONTS.body }}>
                    {field.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast "Texto extraido" */}
      {toastVisible && (
        <div
          style={{
            position: 'absolute',
            top: 180,
            right: 60,
            padding: '16px 32px',
            background: GD.green + '18',
            border: `1.5px solid ${GD.green}40`,
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            boxShadow: GD.greenNeonGlow,
            opacity: spring({ frame: Math.max(0, frame - 85), fps, config: { damping: 14, stiffness: 100 } }),
          }}
        >
          <span style={{ fontSize: 28, fontWeight: 700, color: GD.green, fontFamily: GD_FONTS.heading }}>
            Texto extraído — 98% confianza
          </span>
        </div>
      )}

      {/* Title — OCR Inteligente → Construye cualquier formulario */}
      {ocrTitleVisible && frame < eraseStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <TypewriterText text="OCR" startFrame={105} charsPerFrame={0.5} fontSize={52} fontWeight={800} color={GD.textWhite} fontFamily={GD_FONTS.heading} showCursor={frame >= 105 && frame < 118} cursorColor={GD.primary} />
          {frame >= 116 && (
            <span style={{ marginLeft: 12 }}>
              <WordHighlight before="" highlight="Inteligente" highlightColor={GD.primary} textColor="#ffffff" fontSize={52} fontWeight={800} fontFamily={GD_FONTS.heading} delay={118} />
            </span>
          )}
        </div>
      )}

      {/* Title erasing */}
      {frame >= eraseStart && titleErased > 0 && frame < newTitleStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontSize: 52, fontWeight: 800, color: GD.textWhite, fontFamily: GD_FONTS.heading }}>{titleText.slice(0, titleErased)}</span>
          <span style={{ fontSize: 52, fontWeight: 300, color: GD.primary, marginLeft: 2, opacity: frame % 20 < 10 ? 1 : 0.3 }}>|</span>
        </div>
      )}
      {titleErased <= 0 && frame < newTitleStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontSize: 52, fontWeight: 300, color: GD.primary, opacity: frame % 20 < 10 ? 1 : 0.3 }}>|</span>
        </div>
      )}

      {/* New title: "Construye cualquier formulario" */}
      {newTitleVisible && frame < exitEraseStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <div>
            <TypewriterText text="Construye cualquier" startFrame={newTitleStart} charsPerFrame={0.5} fontSize={48} fontWeight={800} color={GD.textWhite} fontFamily={GD_FONTS.heading} showCursor={frame >= newTitleStart && frame < newTitleStart + 22} cursorColor={GD.primary} />
          </div>
          {frame >= newTitleStart + 20 && (
            <div style={{ marginTop: 4 }}>
              <WordHighlight before="" highlight="formulario" highlightColor={GD.primary} textColor="#ffffff" fontSize={52} fontWeight={900} fontFamily={GD_FONTS.heading} delay={newTitleStart + 22} />
            </div>
          )}
        </div>
      )}

      {/* Pills footer */}
      <div style={{ position: 'absolute', bottom: 140, left: 50, right: 50, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', opacity: contentFade }}>
        {PILLS.map((pill, i) => {
          const delay = pillsStart + i * 15;
          const pSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 14, stiffness: 100 } });
          if (pSpring < 0.01) return null;
          return (
            <div key={i} style={{ opacity: pSpring, transform: `scale(${pSpring})`, padding: '14px 28px', background: pill.color + '12', border: `1.5px solid ${pill.color}30`, borderRadius: 40, boxShadow: `0 0 ${8 + Math.sin(frame * 0.1 + i) * 6}px ${pill.color}20` }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: pill.color, fontFamily: GD_FONTS.heading }}>{pill.text}</span>
            </div>
          );
        })}
      </div>

      {/* Exit title: "Trazabilidad total" for E4 */}
      {frame >= exitEraseStart && exitTitleErased > 0 && frame < exitNewTitleStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontSize: 52, fontWeight: 800, color: GD.textWhite, fontFamily: GD_FONTS.heading }}>{exitText.slice(0, exitTitleErased)}</span>
          <span style={{ fontSize: 52, fontWeight: 300, color: GD.primary, marginLeft: 2, opacity: frame % 20 < 10 ? 1 : 0.3 }}>|</span>
        </div>
      )}
      {exitNewTitleVisible && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <div>
            <TypewriterText text="Trazabilidad" startFrame={exitNewTitleStart} charsPerFrame={0.5} fontSize={52} fontWeight={800} color={GD.textWhite} fontFamily={GD_FONTS.heading} showCursor={frame >= exitNewTitleStart && frame < exitNewTitleStart + 14} cursorColor={GD.primary} />
          </div>
          {frame >= exitNewTitleStart + 12 && (
            <div style={{ marginTop: 4 }}>
              <WordHighlight before="" highlight="total" highlightColor={GD.primary} textColor="#ffffff" fontSize={56} fontWeight={900} fontFamily={GD_FONTS.heading} delay={exitNewTitleStart + 14} />
            </div>
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
