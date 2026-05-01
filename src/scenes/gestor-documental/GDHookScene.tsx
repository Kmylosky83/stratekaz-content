import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { FileSearch, CheckCircle2, FileText } from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { GD, GD_FONTS } from './gd-constants';

export const GDHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card FileSearch — snappy spring
  const iconScale = spring({ frame, fps, config: { damping: 60, stiffness: 280, mass: 0.6 } });
  const iconOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  // Neon glow pulse on card
  const cardGlow = 0.2 + Math.sin(frame * 0.1) * 0.15;

  // "Sabes donde estan tus documentos" entrance
  const questionFade = interpolate(frame, [75, 105], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const questionY = interpolate(frame, [75, 105], [30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Strikethrough
  const strikeProgress = interpolate(frame, [110, 140], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // "Todo en un solo lugar" card
  const sealSpring = spring({ frame: Math.max(0, frame - 145), fps, config: { damping: 65, stiffness: 220, mass: 0.6 } });
  const sealOpacity = interpolate(frame, [145, 165], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Exit: content fades, FileText icon stays
  const contentFadeOut = interpolate(frame, [175, 195], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill>
      {/* Card FileSearch — absolute centered at 470 (matches E2 start) */}
      <div
        style={{
          position: 'absolute',
          top: 470 - 70,
          left: '50%',
          transform: `translateX(-50%) scale(${0.4 + iconScale * 0.6})`,
          opacity: iconOpacity,
          width: 140,
          height: 140,
          borderRadius: 32,
          background: GD.bgSurface,
          border: `1.5px solid ${GD.primary}40`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: `0 0 ${30 + cardGlow * 30}px ${GD.primaryGlow}`,
          zIndex: 10,
        }}
      >
        {/* Show FileSearch initially, morph to FileText at exit */}
        {frame < 175 ? (
          <FileSearch size={80} color={GD.primary} strokeWidth={1.5} />
        ) : (
          <FileText size={80} color={GD.primary} strokeWidth={1.5} />
        )}
      </div>

      {/* Text content — below icon */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          opacity: contentFadeOut,
        }}
      >
        {/* "Gestion" TypewriterText */}
        <div style={{ textAlign: 'center' }}>
          <TypewriterText
            text="Gestion"
            startFrame={15}
            charsPerFrame={0.7}
            fontSize={72}
            fontWeight={800}
            color={GD.textWhite}
            fontFamily={GD_FONTS.heading}
            showCursor={frame >= 15 && frame < 50}
            cursorColor={GD.primary}
          />
        </div>

        {/* "Documental" WordHighlight */}
        {frame >= 48 && (
          <div style={{ textAlign: 'center' }}>
            <WordHighlight
              before=""
              highlight="Documental"
              highlightColor={GD.primary}
              textColor="#ffffff"
              fontSize={56}
              fontWeight={800}
              fontFamily={GD_FONTS.heading}
              delay={50}
            />
          </div>
        )}

        {/* "Sabes donde estan tus documentos?" */}
        <div
          style={{
            opacity: questionFade,
            transform: `translateY(${questionY}px)`,
            textAlign: 'center',
            marginTop: 20,
          }}
        >
          <span style={{ fontSize: 42, fontWeight: 600, color: GD.textMuted, fontFamily: GD_FONTS.body }}>
            ¿Sabes dónde están
          </span>
          <br />
          <span style={{ fontSize: 42, fontWeight: 600, color: GD.textWhite, fontFamily: GD_FONTS.body }}>
            tus documentos?
          </span>
        </div>

        {/* Strikethrough "Carpetas, emails, escritorios..." */}
        <div
          style={{
            opacity: interpolate(frame, [105, 115], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
            textAlign: 'center',
            marginTop: 8,
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: 500,
              color: GD.textSubtle,
              fontFamily: GD_FONTS.body,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            Carpetas, emails, escritorios...
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: `${strikeProgress * 100}%`,
                height: 3,
                background: '#FF1744',
                borderRadius: 2,
                boxShadow: strikeProgress > 0 ? '0 0 12px #FF1744' : 'none',
                transformOrigin: 'left center',
              }}
            />
          </span>
        </div>

        {/* Card "Todo en un solo lugar" */}
        <div
          style={{
            opacity: sealOpacity,
            transform: `scale(${0.7 + sealSpring * 0.3})`,
            padding: '24px 48px',
            background: GD.bgSurface,
            border: `1.5px solid ${GD.primary}40`,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            boxShadow: GD.neonGlow,
            marginTop: 12,
          }}
        >
          <CheckCircle2 size={44} color={GD.green} strokeWidth={2} />
          <span style={{ fontSize: 38, fontWeight: 700, color: GD.textWhite, fontFamily: GD_FONTS.heading }}>
            Todo en un solo lugar
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
