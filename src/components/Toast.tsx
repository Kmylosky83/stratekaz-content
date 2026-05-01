import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { Check, Loader2 } from 'lucide-react';

interface ToastProps {
  /** Frame when toast appears */
  enterFrame?: number;
  /** Frame when toast exits */
  exitFrame?: number;
  title: string;
  subtitle?: string;
  /** 'loading' shows spinner, 'success' shows check */
  variant?: 'loading' | 'success';
  /** Position */
  position?: 'top-right' | 'top-center' | 'bottom-center';
  /** Vertical offset in px — use to stack multiple toasts without collision */
  offsetY?: number;
}

export const Toast: React.FC<ToastProps> = ({
  enterFrame = 0,
  exitFrame = 60,
  title,
  subtitle,
  variant = 'success',
  position = 'top-right',
  offsetY = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame) return null;

  // Enter animation
  const enterSpring = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.5 },
  });

  // Exit animation
  const exitProgress = frame > exitFrame
    ? interpolate(frame, [exitFrame, exitFrame + 12], [0, 1], { extrapolateRight: 'clamp' })
    : 0;

  const opacity = enterSpring * (1 - exitProgress);
  if (opacity < 0.01) return null;

  // Spinner rotation
  const spinnerRotation = (frame - enterFrame) * 12;

  const isSuccess = variant === 'success';
  const accentColor = isSuccess ? '#22c55e' : '#3b82f6';

  // Slide direction
  const slideIn = (1 - enterSpring) * (position === 'bottom-center' ? 40 : -40);
  const slideOut = exitProgress * (position === 'bottom-center' ? 40 : -40);
  const translateY = slideIn + slideOut + offsetY;

  // Position anchoring
  const anchorStyle: React.CSSProperties =
    position === 'top-right'
      ? { top: 60, right: 60, justifyContent: 'flex-end', alignItems: 'flex-start' }
      : position === 'top-center'
      ? { top: 60, left: 0, right: 0, justifyContent: 'center', alignItems: 'flex-start' }
      : { bottom: 80, left: 0, right: 0, justifyContent: 'center', alignItems: 'flex-end' };

  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        zIndex: 1000,
        ...anchorStyle,
        display: 'flex',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)${position === 'top-right' ? ` translateX(${(1 - enterSpring) * 60 - exitProgress * 60}px)` : ''}`,
          padding: '16px 24px',
          background: 'white',
          border: `1.5px solid ${accentColor}30`,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow: `0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px ${accentColor}10`,
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: `${accentColor}12`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {isSuccess ? (
            <Check size={18} color={accentColor} strokeWidth={3} />
          ) : (
            <div style={{ transform: `rotate(${spinnerRotation}deg)` }}>
              <Loader2 size={18} color={accentColor} strokeWidth={2.5} />
            </div>
          )}
        </div>

        {/* Text */}
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', fontFamily: "'Montserrat', sans-serif" }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 22, color: '#64748b', fontFamily: "'Inter', sans-serif", marginTop: 4 }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
