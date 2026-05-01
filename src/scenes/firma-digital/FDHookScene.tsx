import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { PenTool, ShieldCheck } from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { FD, FD_FONTS } from './fd-constants';

export const FDHookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card PenTool — snappy spring with overshoot
  const iconScale = spring({
    frame,
    fps,
    config: { damping: 60, stiffness: 280, mass: 0.6 },
  });
  const iconOpacity = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: 'clamp' });

  // "Firmar no es un checkbox" entrance
  const textFadeIn = interpolate(frame, [70, 100], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const textSlideY = interpolate(frame, [70, 100], [30, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Strikethrough with glow
  const strikeProgress = interpolate(frame, [100, 130], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Card ShieldCheck — easeOutBack spring
  const sealSpring = spring({
    frame: Math.max(0, frame - 120),
    fps,
    config: { damping: 65, stiffness: 220, mass: 0.6 },
  });
  const sealOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // === END: Content fades out, PenTool stays in place (frame 175–195) ===
  const contentFadeOut = interpolate(frame, [175, 195], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '60px 50px 80px',
      }}
    >
      {/* Card PenTool — absolute position, matches E2 canvas center (y:470) */}
      <div
        style={{
          position: 'absolute',
          top: 470 - 70, // cardCenterY - half of 140
          left: '50%',
          transform: `translateX(-50%) scale(${0.4 + iconScale * 0.6})`,
          opacity: iconOpacity,
          width: 140,
          height: 140,
          borderRadius: 32,
          background: 'white',
          border: `1.5px solid ${FD.primary}33`,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: `0 0 32px ${FD.primary}18`,
          zIndex: 10,
        }}
      >
        <PenTool size={80} color={FD.primary} strokeWidth={1.5} />
      </div>

      {/* Text content — absolute, below PenTool card */}
      <div
        style={{
          position: 'absolute',
          top: 560,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: contentFadeOut,
        }}
      >
        {/* "Firma Digital" — TypewriterText 72px */}
        <div style={{ textAlign: 'center' }}>
          <TypewriterText
            text="Firma Digital"
            startFrame={15}
            charsPerFrame={0.7}
            fontSize={72}
            fontWeight={800}
            color="#1A1A2E"
            fontFamily={FD_FONTS.heading}
            showCursor={frame >= 15 && frame < 55}
          />
        </div>

        {/* "StrateKaz" — white text on magenta highlight */}
        <div style={{ textAlign: 'center' }}>
          <WordHighlight
            before=""
            highlight="StrateKaz"
            highlightColor={FD.primary}
            textColor="#ffffff"
            fontSize={52}
            fontWeight={800}
            fontFamily={FD_FONTS.heading}
            delay={45}
          />
        </div>

        {/* "Firmar no es un checkbox" — slide up */}
        <div
          style={{
            opacity: textFadeIn,
            transform: `translateY(${textSlideY}px)`,
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          <span
            style={{
              fontSize: 48,
              fontWeight: 500,
              color: '#999999',
              fontFamily: FD_FONTS.body,
              position: 'relative',
              display: 'inline-block',
            }}
          >
            Firmar no es un checkbox
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: `${strikeProgress * 100}%`,
                height: 3,
                background: '#FF1744',
                borderRadius: 2,
                boxShadow: strikeProgress > 0 ? '0 0 8px #FF1744' : 'none',
                transformOrigin: 'left center',
              }}
            />
          </span>
        </div>

        {/* Card "Es un sello criptográfico" — easeOutBack */}
        <div
          style={{
            opacity: sealOpacity,
            transform: `scale(${0.7 + sealSpring * 0.3})`,
            padding: '20px 44px',
            background: '#FFFFFF',
            border: `1.5px solid ${FD.primary}33`,
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            boxShadow: `0 0 32px ${FD.primary}18`,
            marginTop: 8,
          }}
        >
          <ShieldCheck size={44} color={FD.primary} strokeWidth={2} />
          <span
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: FD.primary,
              fontFamily: FD_FONTS.heading,
            }}
          >
            Es un sello criptográfico
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
