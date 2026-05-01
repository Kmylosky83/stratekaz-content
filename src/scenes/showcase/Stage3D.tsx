// scenes/showcase/Stage3D.tsx
// REAL 3D using @remotion/three (ThreeCanvas + R3F + Three.js).
//
// Per Remotion 3D best practices:
// - All animation is driven by useCurrentFrame() (never useFrame from r3f)
// - ThreeCanvas wraps everything with proper width/height
// - Lighting uses standard Three.js primitives (ambient + directional + point lights)
// - Text rendered via @react-three/drei's <Text> (MSDF text, fast & sharp)
//
// Scene composition (portrait stories, camera at z=8, fov=50):
// - 4 floating "screens" tilted in 3D space, entering staggered from far back
// - Each screen has emissive glow border + content
// - 25 small particles drifting in 3D
// - 4 colored point lights (magenta, amber, green) animate the mood
// - Subtle camera orbit for life

import {
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Text } from "@react-three/drei";
import { BRAND } from "../../brand/tokens";

// ─── Card primitive ─────────────────────────────────────────────────────────

type CardProps = {
  position: [number, number, number];
  rotationY: number;
  startFrame: number;
  width: number;
  height: number;
  emissionColor: string;
  /** Big hero text centered (no label/body when present). */
  bigText?: string;
  /** Small uppercase label in the top-left. */
  label?: string;
  /** Body text below the label. */
  body?: string;
};

const Card: React.FC<CardProps> = ({
  position,
  rotationY,
  startFrame,
  width,
  height,
  emissionColor,
  bigText,
  label,
  body,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring 0→1
  const enter = spring({
    frame: Math.max(0, frame - startFrame),
    fps,
    config: { damping: 18, stiffness: 80, mass: 1 },
  });

  // Subtle floating after settled
  const t = (frame - startFrame) * 0.04;
  const floatY = enter > 0.5 ? Math.sin(t) * 0.08 : 0;
  const floatX = enter > 0.5 ? Math.cos(t * 0.7) * 0.04 : 0;

  // Z entrance: card flies in from far back (-8) to its target z
  const zFrom = -8;
  const z = zFrom + (position[2] - zFrom) * enter;

  // Y rotation entrance: from -1.5 rad to final rotationY
  const ryFrom = -1.5;
  const ry = ryFrom + (rotationY - ryFrom) * enter;

  return (
    <group
      position={[position[0] + floatX, position[1] + floatY, z]}
      rotation={[0, ry, 0]}
      scale={enter}
    >
      {/* Soft glow plane slightly behind the card body (basic material — not lit) */}
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[width + 0.15, height + 0.15, 0.02]} />
        <meshBasicMaterial
          color={emissionColor}
          transparent
          opacity={0.35 * enter}
        />
      </mesh>

      {/* Card body — emissive standard material reacts to scene lighting */}
      <mesh>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive={emissionColor}
          emissiveIntensity={0.4}
          metalness={0.5}
          roughness={0.35}
          transparent
          opacity={enter}
        />
      </mesh>

      {/* Big hero text (centered, large) */}
      {bigText && (
        <Text
          position={[0, 0, 0.04]}
          fontSize={1.0}
          color={BRAND.white}
          anchorX="center"
          anchorY="middle"
          fillOpacity={enter}
          fontWeight={900}
        >
          {bigText}
        </Text>
      )}

      {/* Small uppercase label (top-left) */}
      {label && !bigText && (
        <Text
          position={[-(width / 2) + 0.2, height / 2 - 0.18, 0.04]}
          fontSize={0.13}
          color={emissionColor}
          anchorX="left"
          anchorY="top"
          fillOpacity={enter}
          letterSpacing={0.15}
        >
          {label.toUpperCase()}
        </Text>
      )}

      {/* Body text (below label) */}
      {body && !bigText && (
        <Text
          position={[-(width / 2) + 0.2, height / 2 - 0.5, 0.04]}
          fontSize={0.22}
          color={BRAND.white}
          anchorX="left"
          anchorY="top"
          fillOpacity={enter}
          maxWidth={width - 0.4}
          lineHeight={1.3}
        >
          {body}
        </Text>
      )}
    </group>
  );
};

// ─── Particle (small sphere drifting in 3D) ─────────────────────────────────

type ParticleProps = {
  basePosition: [number, number, number];
  seed: number;
};

const Particle: React.FC<ParticleProps> = ({ basePosition, seed }) => {
  const frame = useCurrentFrame();
  const t = frame * 0.02;
  const dx = Math.sin(t + seed) * 0.3;
  const dy = Math.cos(t * 0.7 + seed * 1.3) * 0.3;
  const dz = Math.sin(t * 0.5 + seed * 2.1) * 0.3;
  const color = seed % 3 === 0 ? BRAND.amber : BRAND.primary;

  return (
    <mesh
      position={[
        basePosition[0] + dx,
        basePosition[1] + dy,
        basePosition[2] + dz,
      ]}
    >
      <sphereGeometry args={[0.018, 10, 10]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

// ─── Stage3D main composition ───────────────────────────────────────────────

export const Stage3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  // Subtle camera orbit (NEVER use useFrame from r3f — derive from useCurrentFrame)
  const orbitT = frame * 0.008;
  const camX = Math.sin(orbitT) * 0.8;
  const camY = Math.cos(orbitT * 0.7) * 0.3;

  // Deterministic particle positions on a 3D shell
  const particles = Array.from({ length: 25 }).map((_, i) => {
    const a = i * 2.4; // pseudo-golden distribution
    const dist = 3 + (i % 5) * 0.8;
    const x = Math.sin(a) * dist;
    const y = Math.cos(a * 0.7) * (dist * 0.7);
    const z = -2 + (i % 4) * 0.8;
    return { x, y, z, seed: i };
  });

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [camX, camY, 8], fov: 50 }}
    >
      {/* Atmospheric fog — pulls back distant elements into the bg color */}
      <fog attach="fog" args={[BRAND.bgDeep, 9, 22]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} color="#ffffff" />
      <directionalLight position={[3, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight
        position={[-3, 0, 4]}
        intensity={3}
        color={BRAND.primary}
        distance={15}
      />
      <pointLight
        position={[3, -1, 4]}
        intensity={2}
        color={BRAND.amber}
        distance={15}
      />
      <pointLight
        position={[0, 2, 2]}
        intensity={1.5}
        color={BRAND.iso14001}
        distance={10}
      />

      {/* Particles */}
      {particles.map((p) => (
        <Particle
          key={p.seed}
          basePosition={[p.x, p.y, p.z]}
          seed={p.seed}
        />
      ))}

      {/* Center hero card with big "3D" text */}
      <Card
        position={[0, 0.5, -1]}
        rotationY={0}
        startFrame={20}
        width={3.2}
        height={2.0}
        emissionColor={BRAND.primary}
        bigText="3D"
      />

      {/* Top-left tilted card */}
      <Card
        position={[-1.55, 2.2, 0.5]}
        rotationY={0.4}
        startFrame={5}
        width={2.4}
        height={1.5}
        emissionColor={BRAND.iso14001}
        label="Effects"
        body="LightLeaks · NoiseOverlay · FilmGrain"
      />

      {/* Top-right tilted card */}
      <Card
        position={[1.55, 1.8, 0.4]}
        rotationY={-0.4}
        startFrame={35}
        width={2.4}
        height={1.5}
        emissionColor={BRAND.amber}
        label="Data Viz"
        body="94% cumplimiento total"
      />

      {/* Bottom card (slightly forward) */}
      <Card
        position={[0, -2.1, 0.6]}
        rotationY={0}
        startFrame={50}
        width={3.4}
        height={1.4}
        emissionColor={BRAND.primary}
        label="Quote"
        body='"Cambió cómo gestionamos calidad."'
      />
    </ThreeCanvas>
  );
};
