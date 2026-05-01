import { useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface CursorClickProps {
  /** Start position */
  fromX: number;
  fromY: number;
  /** Target position */
  toX: number;
  toY: number;
  /** Frame when cursor starts moving */
  startFrame?: number;
  /** Frame when click happens */
  clickFrame?: number;
  /** Show ripple effect on click */
  showRipple?: boolean;
  rippleColor?: string;
}

export const CursorClick: React.FC<CursorClickProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  startFrame = 0,
  clickFrame = 20,
  showRipple = true,
  rippleColor = '#ec268f',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const elapsed = frame - startFrame;

  if (elapsed < 0) return null;

  // Smooth cursor movement with easing
  const moveProgress = interpolate(elapsed, [0, clickFrame - startFrame], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Ease out cubic for natural movement
  const eased = 1 - Math.pow(1 - moveProgress, 3);
  const x = fromX + (toX - fromX) * eased;
  const y = fromY + (toY - fromY) * eased;

  // Click scale (press down, release)
  const isClickPhase = elapsed >= clickFrame - startFrame;
  const clickScale = isClickPhase
    ? interpolate(
        elapsed - (clickFrame - startFrame),
        [0, 3, 8],
        [1, 0.75, 1],
        { extrapolateRight: 'clamp' }
      )
    : 1;

  // Ripple after click
  const rippleElapsed = elapsed - (clickFrame - startFrame);
  const rippleScale = isClickPhase
    ? spring({
        frame: Math.max(0, rippleElapsed),
        fps,
        config: { damping: 8, stiffness: 60, mass: 0.5 },
      })
    : 0;

  const rippleOpacity = isClickPhase
    ? interpolate(rippleElapsed, [0, 20], [0.6, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })
    : 0;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50 }}>
      {/* Ripple */}
      {showRipple && isClickPhase && (
        <div
          style={{
            position: 'absolute',
            left: toX - 30,
            top: toY - 30,
            width: 60,
            height: 60,
            borderRadius: '50%',
            border: `2px solid ${rippleColor}`,
            transform: `scale(${rippleScale * 2})`,
            opacity: rippleOpacity,
          }}
        />
      )}

      {/* Cursor arrow */}
      <div
        style={{
          position: 'absolute',
          left: x,
          top: y,
          transform: `scale(${clickScale})`,
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.25))',
        }}
      >
        <svg width="24" height="30" viewBox="0 0 24 30" fill="none">
          <path
            d="M2 2L2 22L7 17L12 28L15.5 26.5L10.5 15.5L19 15.5L2 2Z"
            fill="white"
            stroke="#1e293b"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
