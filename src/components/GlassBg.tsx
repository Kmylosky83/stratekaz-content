import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { ParticleNetwork } from './ParticleNetwork';

interface GlassBgProps {
  /** 'light' = white base, 'dark' = dark base */
  variant?: 'light' | 'dark';
  /** Primary accent color */
  accentColor?: string;
  /** Secondary accent color */
  secondaryColor?: string;
  /** Show particle network overlay */
  showParticles?: boolean;
  /** Number of particles */
  particleCount?: number;
  /** Frame when particles burst from center */
  burstFrame?: number;
  /** Global frame when particles converge to center */
  convergeFrame?: number;
  /** Duration of convergence */
  convergeDuration?: number;
  /** Global frame when particles orbit center */
  orbitFrame?: number;
}

export const GlassBg: React.FC<GlassBgProps> = ({
  variant = 'light',
  accentColor = '#ec268f',
  secondaryColor = '#3b82f6',
  showParticles = false,
  particleCount = 60,
  burstFrame = 55,
  convergeFrame,
  convergeDuration,
  orbitFrame,
}) => {
  const frame = useCurrentFrame();
  const isLight = variant === 'light';
  const bg = isLight ? '#fafbfc' : '#030712';

  // Flash/destello at burst moment
  const flashOpacity = showParticles
    ? interpolate(frame, [burstFrame - 2, burstFrame, burstFrame + 8, burstFrame + 20], [0, 0.7, 0.3, 0], {
        extrapolateRight: 'clamp',
        extrapolateLeft: 'clamp',
      })
    : 0;

  return (
    <AbsoluteFill style={{ background: bg, overflow: 'hidden' }}>
      {/* Noise texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
          opacity: isLight ? 0.5 : 0.3,
        }}
      />

      {/* Particle network — burst from center */}
      {showParticles && (
        <ParticleNetwork
          count={particleCount}
          primaryColor={accentColor}
          secondaryColor={isLight ? '#1a1a1a' : '#ffffff'}
          burstFrame={burstFrame}
          convergeFrame={convergeFrame}
          convergeDuration={convergeDuration}
          orbitFrame={orbitFrame}
          opacity={1}
        />
      )}

      {/* Flash/destello at burst moment */}
      {flashOpacity > 0.01 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${accentColor}40 0%, ${isLight ? 'white' : accentColor}20 40%, transparent 70%)`,
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, transparent 50%, ${bg}80 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
