// shapes/LiquidBlob.tsx
// Procedural liquid blob — vertices arranged radially are perturbed by noise,
// then connected with quadratic bezier curves through midpoints for smoothness.

import { useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

type Props = {
  /** Center x of the blob (in viewBox units). */
  cx?: number;
  /** Center y of the blob (in viewBox units). */
  cy?: number;
  /** Base radius. */
  radius?: number;
  /** Number of vertices around the blob (more = smoother). */
  points?: number;
  /** Wobble amplitude (px). */
  wobble?: number;
  /** Animation speed. */
  speed?: number;
  /** Fill color (CSS). */
  fill?: string;
  /** Optional stroke color. */
  stroke?: string;
  /** Stroke width. */
  strokeWidth?: number;
  /** Seed for the noise. */
  seed?: number;
  /** Width of the SVG canvas. */
  width?: number;
  /** Height of the SVG canvas. */
  height?: number;
};

export const LiquidBlob: React.FC<Props> = ({
  cx = 540,
  cy = 540,
  radius = 200,
  points = 12,
  wobble = 60,
  speed = 0.04,
  fill = "#ec268f",
  stroke,
  strokeWidth = 0,
  seed = 1,
  width = 1080,
  height = 1080,
}) => {
  const frame = useCurrentFrame();
  const t = frame * speed;

  // Generate vertex coordinates around a circle, perturbed by noise.
  const vertices = Array.from({ length: points }).map((_, i) => {
    const angle = (i / points) * Math.PI * 2;
    const r =
      radius +
      noise2D(seed, Math.cos(angle) * 2 + t, Math.sin(angle) * 2 + t) * wobble;
    return [cx + Math.cos(angle) * r, cy + Math.sin(angle) * r] as const;
  });

  // Build a smooth closed path: start at first midpoint, then Q-curves
  // through each vertex toward the next midpoint.
  let path = "";
  for (let i = 0; i < vertices.length; i++) {
    const v = vertices[i];
    const next = vertices[(i + 1) % vertices.length];
    const midX = (v[0] + next[0]) / 2;
    const midY = (v[1] + next[1]) / 2;
    if (i === 0) {
      path += `M ${midX.toFixed(2)} ${midY.toFixed(2)} `;
    } else {
      path += `Q ${v[0].toFixed(2)} ${v[1].toFixed(2)} ${midX.toFixed(2)} ${midY.toFixed(2)} `;
    }
  }
  // Close the path back to the start using the last vertex as control.
  const last = vertices[vertices.length - 1];
  const firstMid = [
    (vertices[0][0] + vertices[1][0]) / 2,
    (vertices[0][1] + vertices[1][1]) / 2,
  ];
  path += `Q ${last[0].toFixed(2)} ${last[1].toFixed(2)} ${firstMid[0].toFixed(2)} ${firstMid[1].toFixed(2)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d={path}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
