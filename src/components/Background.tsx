import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { BRAND } from '../constants';

export const Background: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${BRAND.bgSurface} 0%, ${BRAND.bgDeep} 70%)`,
      }}
    >
      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => {
        const speed = 0.2 + i * 0.08;
        const size = 2 + (i % 4) * 1.5;
        const xPos = 8 + (i * 7.5) % 85;
        const yBase = 10 + (i * 13) % 80;
        const y = yBase + Math.sin(frame * speed * 0.04 + i * 1.2) * 6;
        const isPrimary = i % 3 === 0;

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${xPos}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: '50%',
              background: isPrimary ? BRAND.primary : BRAND.amber,
              opacity: 0.12 + Math.sin(frame * 0.025 + i * 0.8) * 0.08,
            }}
          />
        );
      })}

      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '100px 100px',
          opacity: 0.5,
        }}
      />

      {/* Top gradient glow */}
      <div
        style={{
          position: 'absolute',
          top: -200,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 600,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${BRAND.primary}15 0%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
