// scenes/showcase/ContinuousStory3D.tsx
// 20-second continuous 3D narrative — Prezi-style flow through 4 stations.
//
// Technique: instead of animating the camera (complex with R3F + Remotion's
// deterministic frame model), we keep the camera fixed at [0, 0, 8] and animate
// the entire WORLD GROUP'S position. When the world translates, different
// "stations" placed at different world coordinates come into the camera's view.
// Mathematically equivalent to camera movement — much simpler in practice.
//
// Frame budget (600 frames = 20s @ 30fps):
//   0-100   Hold:  Station 1 — Hero (big STRATEKAZ logo)
//   100-160 Trans: 1→2 (60f cubic ease in-out)
//   160-260 Hold:  Station 2 — Phones (3 mockups in formation)
//   260-320 Trans: 2→3
//   320-420 Hold:  Station 3 — Stats (big % + 3D bars)
//   420-480 Trans: 3→4
//   480-600 Hold:  Station 4 — CTA (longer for impact)

import {
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { Text } from "@react-three/drei";
import { Phone3D } from "./Phone3D";
import { BRAND } from "../../brand/tokens";

export const STORY_DURATION = 600;

// ─── World flow helper ──────────────────────────────────────────────────────

const STATIONS: Array<[number, number, number]> = [
  [0, 0, 0], // 1: Hero
  [6, 0, -2], // 2: Phones
  [12, 2, -4], // 3: Stats
  [16, -1, -2], // 4: CTA
];

type Segment =
  | { type: "hold"; station: number; duration: number }
  | { type: "trans"; from: number; to: number; duration: number };

const SEGMENTS: Segment[] = [
  { type: "hold", station: 0, duration: 100 },
  { type: "trans", from: 0, to: 1, duration: 60 },
  { type: "hold", station: 1, duration: 100 },
  { type: "trans", from: 1, to: 2, duration: 60 },
  { type: "hold", station: 2, duration: 100 },
  { type: "trans", from: 2, to: 3, duration: 60 },
  { type: "hold", station: 3, duration: 120 },
];

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const computeWorldOffset = (frame: number): [number, number, number] => {
  let elapsed = frame;
  for (const seg of SEGMENTS) {
    if (elapsed < seg.duration) {
      if (seg.type === "hold") {
        const s = STATIONS[seg.station];
        return [-s[0], -s[1], -s[2]];
      }
      const t = elapsed / seg.duration;
      const eased = easeInOutCubic(t);
      const from = STATIONS[seg.from];
      const to = STATIONS[seg.to];
      return [
        -(from[0] + (to[0] - from[0]) * eased),
        -(from[1] + (to[1] - from[1]) * eased),
        -(from[2] + (to[2] - from[2]) * eased),
      ];
    }
    elapsed -= seg.duration;
  }
  // After all segments, stay at last station
  const last = STATIONS[STATIONS.length - 1];
  return [-last[0], -last[1], -last[2]];
};

// ─── Station 1: Hero ────────────────────────────────────────────────────────

const StationHero: React.FC = () => {
  const frame = useCurrentFrame();
  const ringRot = frame * 0.005;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.05;

  return (
    <group position={STATIONS[0]}>
      {/* Glow ring behind */}
      <mesh rotation={[0, 0, ringRot]} scale={pulse}>
        <ringGeometry args={[1.8, 2.3, 64]} />
        <meshBasicMaterial
          color={BRAND.primary}
          transparent
          opacity={0.35}
        />
      </mesh>
      <mesh rotation={[0, 0, -ringRot * 0.7]} scale={pulse * 1.1}>
        <ringGeometry args={[2.5, 2.6, 64]} />
        <meshBasicMaterial
          color={BRAND.primary}
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Big logo text */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={1.0}
        color={BRAND.white}
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        outlineColor={BRAND.primary}
        outlineWidth={0.015}
        outlineOpacity={0.8}
        letterSpacing={0.05}
      >
        STRATEKAZ
      </Text>

      {/* Tagline */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.18}
        color={BRAND.primary}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
      >
        SISTEMA DE GESTIÓN INTEGRAL
      </Text>

      {/* Italic slogan */}
      <Text
        position={[0, -0.95, 0]}
        fontSize={0.28}
        color={BRAND.amber}
        anchorX="center"
        anchorY="middle"
        fontStyle="italic"
        fontWeight={700}
      >
        Sin miedo al éxito
      </Text>
    </group>
  );
};

// ─── Station 2: Phones in formation ─────────────────────────────────────────

const StationPhones: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle floating per phone
  const float = (offset: number) => Math.sin(frame * 0.04 + offset) * 0.06;

  return (
    <group position={STATIONS[1]}>
      {/* Left phone — tilted right */}
      <Phone3D
        position={[-1.7, float(0), 0]}
        rotation={[0, 0.45, -0.05]}
        scale={0.85}
        screen={{
          title: "Calidad",
          body: "ISO 9001\nAuditorías\nProcesos",
          accent: BRAND.iso9001,
        }}
      />

      {/* Center phone — front, slightly larger */}
      <Phone3D
        position={[0, float(1.2) + 0.1, 0.5]}
        rotation={[0, 0, 0]}
        scale={0.95}
        screen={{
          title: "Seguridad",
          body: "ISO 45001\nRiesgos\nIncidentes",
          accent: BRAND.iso45001,
        }}
      />

      {/* Right phone — tilted left */}
      <Phone3D
        position={[1.7, float(2.4), 0]}
        rotation={[0, -0.45, 0.05]}
        scale={0.85}
        screen={{
          title: "Ambiente",
          body: "ISO 14001\nAspectos\nImpactos",
          accent: BRAND.iso14001,
        }}
      />
    </group>
  );
};

// ─── Station 3: Stats — animated 3D number + bars ───────────────────────────

const StationStats: React.FC = () => {
  const frame = useCurrentFrame();

  // Animate when this station is active (its hold starts at frame 320)
  const localStart = 320;
  const countT = Math.max(0, Math.min(1, (frame - localStart) / 50));
  const value = Math.round(94 * countT);

  return (
    <group position={STATIONS[2]}>
      {/* Big percentage */}
      <Text
        position={[0, 0.9, 0]}
        fontSize={1.5}
        color={BRAND.primary}
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        outlineColor={BRAND.white}
        outlineWidth={0.005}
      >
        {`${value}%`}
      </Text>

      {/* Label */}
      <Text
        position={[0, -0.05, 0]}
        fontSize={0.22}
        color={BRAND.white}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.4}
        fillOpacity={0.85}
      >
        CUMPLIMIENTO TOTAL
      </Text>

      {/* Animated 3D bars below */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const barDelay = i * 5;
        const barT = Math.max(
          0,
          Math.min(1, (frame - localStart - barDelay) / 30),
        );
        const heightVal = (0.4 + (i % 3) * 0.25 + (i / 7) * 0.3) * barT;
        return (
          <mesh
            key={i}
            position={[(i - 3) * 0.4, -0.9 - heightVal / 2, 0]}
          >
            <boxGeometry args={[0.28, heightVal + 0.001, 0.28]} />
            <meshStandardMaterial
              color={BRAND.amber}
              emissive={BRAND.amber}
              emissiveIntensity={0.7}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        );
      })}
    </group>
  );
};

// ─── Station 4: CTA card ────────────────────────────────────────────────────

const StationCTA: React.FC = () => {
  const frame = useCurrentFrame();

  const localStart = 480;
  const t = Math.max(0, Math.min(1, (frame - localStart) / 30));
  const pulseEmission = 0.6 + Math.sin(frame * 0.12) * 0.3;

  return (
    <group position={STATIONS[3]}>
      {/* Outer glow plane */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[4.2, 2.0, 0.02]} />
        <meshBasicMaterial
          color={BRAND.primary}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Card body */}
      <mesh>
        <boxGeometry args={[3.8, 1.6, 0.1]} />
        <meshStandardMaterial
          color="#0a0a0a"
          emissive={BRAND.primary}
          emissiveIntensity={pulseEmission}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* CTA URL */}
      <Text
        position={[0, 0.25, 0.06]}
        fontSize={0.55}
        color={BRAND.white}
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        fillOpacity={t}
      >
        stratekaz.com
      </Text>

      {/* Subline */}
      <Text
        position={[0, -0.45, 0.06]}
        fontSize={0.18}
        color={BRAND.amber}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.35}
        fontStyle="italic"
        fillOpacity={t}
      >
        EMPIEZA HOY
      </Text>
    </group>
  );
};

// ─── Particles connecting the world ─────────────────────────────────────────

const Particle: React.FC<{
  position: [number, number, number];
  seed: number;
}> = ({ position, seed }) => {
  const frame = useCurrentFrame();
  const t = frame * 0.025;
  const dx = Math.sin(t + seed) * 0.4;
  const dy = Math.cos(t * 0.7 + seed * 1.3) * 0.4;
  const dz = Math.sin(t * 0.5 + seed * 2.1) * 0.4;
  const color = seed % 3 === 0 ? BRAND.amber : BRAND.primary;

  return (
    <mesh
      position={[position[0] + dx, position[1] + dy, position[2] + dz]}
    >
      <sphereGeometry args={[0.025, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
};

const ParticleField: React.FC = () => {
  // Spread particles across the whole journey path
  const particles = Array.from({ length: 50 }).map((_, i) => {
    // Distribute along x axis (the path direction) with random spread
    const t = i / 50;
    const x = t * 18 - 1; // covers x range from -1 to 17 (full journey)
    const y = (Math.sin(i * 17.31) * 0.5 + 0.5) * 6 - 3; // -3 to 3
    const z = (Math.cos(i * 23.7) * 0.5 + 0.5) * 4 - 4; // -4 to 0
    return { x, y, z, seed: i };
  });

  return (
    <>
      {particles.map((p) => (
        <Particle
          key={p.seed}
          position={[p.x, p.y, p.z]}
          seed={p.seed}
        />
      ))}
    </>
  );
};

// ─── Main composition ───────────────────────────────────────────────────────

export const ContinuousStory3D: React.FC = () => {
  const { width, height } = useVideoConfig();
  const frame = useCurrentFrame();

  const worldOffset = computeWorldOffset(frame);

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      {/* Atmospheric fog — adds depth, blends distant parts into bg */}
      <fog attach="fog" args={[BRAND.bgDeep, 6, 18]} />

      {/* Lighting setup */}
      <ambientLight intensity={0.25} color="#ffffff" />
      <directionalLight position={[3, 5, 5]} intensity={0.4} color="#ffffff" />

      {/* Two pulsing point lights that move along the path with the camera flow,
          providing color accents at every station */}
      <pointLight
        position={[-worldOffset[0] - 2, 0, 4]}
        intensity={3}
        color={BRAND.primary}
        distance={12}
      />
      <pointLight
        position={[-worldOffset[0] + 2, -1, 3]}
        intensity={2}
        color={BRAND.amber}
        distance={10}
      />

      {/* World group — everything inside translates as a whole to flow between stations */}
      <group position={worldOffset}>
        <StationHero />
        <StationPhones />
        <StationStats />
        <StationCTA />
        <ParticleField />
      </group>
    </ThreeCanvas>
  );
};
