// effects/Tilt3D.tsx
// CSS 3D perspective wrapper — tilts a child element in 3D space with an
// entrance animation that springs in from far away (translateZ) while
// rotating to the final tilt angle.
//
// Optional `floatAmplitude` adds a continuous subtle hover after entrance.
// Stack multiple Tilt3D elements to build a "floating screens" stage like
// Remotion's promo videos.
//
// Implementation note: uses standard CSS perspective + preserve-3d, so it
// renders deterministically in Remotion's headless Chrome — no Three.js
// or WebGL needed.

import type { ReactNode, CSSProperties } from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";

type Props = {
  children: ReactNode;

  /** Final rotation X in degrees (positive tilts top edge back). */
  rotateX?: number;
  /** Final rotation Y in degrees (positive rotates right edge back). */
  rotateY?: number;
  /** Final rotation Z in degrees (in-plane). */
  rotateZ?: number;
  /** Final Z translation in px (positive = closer). */
  translateZ?: number;

  /** Frame at which entrance animation starts. */
  startFrame?: number;
  /** Duration of entrance animation. */
  durationInFrames?: number;

  /** Initial rotateY before entrance (default -90 = swing in from edge). */
  fromRotateY?: number;
  /** Initial translateZ before entrance (negative = fly in from far). */
  fromTranslateZ?: number;

  /** Continuous gentle floating amplitude in degrees after entrance (0 = none). */
  floatAmplitude?: number;

  /** Style for the absolutely-positioned container (use for left/top/width/height). */
  containerStyle?: CSSProperties;

  /** Perspective for the parent (px). Higher = milder 3D effect. */
  perspective?: number;
};

export const Tilt3D: React.FC<Props> = ({
  children,
  rotateX = 0,
  rotateY = -15,
  rotateZ = 0,
  translateZ = 0,
  startFrame = 0,
  durationInFrames = 35,
  fromRotateY = -90,
  fromTranslateZ = -1200,
  floatAmplitude = 0,
  containerStyle,
  perspective = 1800,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring entrance progress 0→1
  const enter = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
    durationInFrames,
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Interpolate rotation/translation from entrance values to final values
  const rx = rotateX * enter;
  const ry = fromRotateY + (rotateY - fromRotateY) * enter;
  const rz = rotateZ * enter;
  const tz = fromTranslateZ + (translateZ - fromTranslateZ) * enter;

  // Subtle ambient float once settled
  const floatY =
    floatAmplitude > 0
      ? Math.sin((frame - startFrame) * 0.04) * floatAmplitude
      : 0;
  const floatX =
    floatAmplitude > 0
      ? Math.cos((frame - startFrame) * 0.03) * floatAmplitude * 0.7
      : 0;

  return (
    <div
      style={{
        position: "absolute",
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
        opacity,
        ...containerStyle,
      }}
    >
      <div
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${rx + floatX}deg) rotateY(${ry + floatY}deg) rotateZ(${rz}deg) translateZ(${tz}px)`,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
