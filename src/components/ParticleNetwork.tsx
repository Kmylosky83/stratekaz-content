import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

interface ParticleNetworkProps {
  count?: number;
  primaryColor?: string;
  secondaryColor?: string;
  burstFrame?: number;
  opacity?: number;
  /** Global frame when particles converge to center (vortex) */
  convergeFrame?: number;
  /** Duration of convergence in frames */
  convergeDuration?: number;
  /** Global frame when particles orbit center (E4→E5 transition) */
  orbitFrame?: number;
}

// Seeded pseudo-random for deterministic Remotion rendering
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// ─── Pattern generators ───
// Each returns {x, y} for particle index i out of total n

const CX = 540;
const CY = 675; // center of 1350 (Feed format)

function patternScatter(i: number, n: number): { x: number; y: number } {
  const angle = seededRandom(i * 7 + 1) * Math.PI * 2;
  const dist = 200 + seededRandom(i * 7 + 2) * 700;
  return { x: CX + Math.cos(angle) * dist, y: CY + Math.sin(angle) * dist };
}

function patternRings(i: number, n: number): { x: number; y: number } {
  const rings = 4;
  const ring = Math.floor((i / n) * rings);
  const indexInRing = i - Math.floor((ring / rings) * n);
  const countInRing = Math.floor(((ring + 1) / rings) * n) - Math.floor((ring / rings) * n);
  const angle = (indexInRing / countInRing) * Math.PI * 2;
  const radius = 150 + ring * 180;
  return { x: CX + Math.cos(angle) * radius, y: CY + Math.sin(angle) * radius };
}

function patternWave(i: number, n: number): { x: number; y: number } {
  const cols = 10;
  const row = Math.floor(i / cols);
  const col = i % cols;
  const x = 80 + col * 100;
  const waveOffset = Math.sin(col * 0.6 + row * 0.3) * 80;
  const y = 300 + row * 110 + waveOffset;
  return { x, y };
}

function patternSpiral(i: number, n: number): { x: number; y: number } {
  const t = i / n;
  const angle = t * Math.PI * 6;
  const radius = 60 + t * 600;
  return { x: CX + Math.cos(angle) * radius, y: CY + Math.sin(angle) * radius };
}

function patternDiamond(i: number, n: number): { x: number; y: number } {
  const side = Math.ceil(Math.sqrt(n));
  const row = Math.floor(i / side);
  const col = i % side;
  const normalRow = row / side - 0.5;
  const normalCol = col / side - 0.5;
  // Rotate 45 degrees
  const rx = normalCol * 0.7 - normalRow * 0.7;
  const ry = normalCol * 0.7 + normalRow * 0.7;
  return { x: CX + rx * 900, y: CY + ry * 900 };
}

function patternHex(i: number, n: number): { x: number; y: number } {
  const cols = 8;
  const row = Math.floor(i / cols);
  const col = i % cols;
  const offsetX = row % 2 === 0 ? 0 : 60;
  const x = 100 + col * 120 + offsetX;
  const y = 250 + row * 105;
  return { x, y };
}

// Pattern schedule: [startFrame, pattern]
const PATTERNS = [
  patternScatter,   // 0: initial burst scatter
  patternRings,     // 1: concentric rings
  patternWave,      // 2: wave grid
  patternSpiral,    // 3: spiral
  patternDiamond,   // 4: diamond
  patternHex,       // 5: hex grid
];

// Transition schedule — relative to burstFrame
const PATTERN_SCHEDULE = [
  { start: 0, pattern: 0 },      // burst → scatter
  { start: 250, pattern: 1 },    // → rings
  { start: 500, pattern: 2 },    // → wave
  { start: 750, pattern: 3 },    // → spiral
  { start: 1000, pattern: 4 },   // → diamond
  { start: 1150, pattern: 5 },   // → hex
];

const TRANSITION_FRAMES = 60; // smooth morph between patterns

export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
  count = 60,
  primaryColor = '#ec268f',
  secondaryColor = '#3b82f6',
  burstFrame = 55,
  opacity = 1,
  convergeFrame = 99999,
  convergeDuration = 50,
  orbitFrame = 99999,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Generate deterministic particle metadata
  const particleMeta = [];
  for (let i = 0; i < count; i++) {
    const isPrimary = seededRandom(i * 3) < 0.7;
    particleMeta.push({
      size: 1.5 + seededRandom(i * 7 + 8) * 2.5,
      color: isPrimary ? primaryColor : secondaryColor,
      phase: seededRandom(i * 7 + 3) * Math.PI * 2,
      freqX: 0.008 + seededRandom(i * 7 + 6) * 0.006,
      freqY: 0.008 + seededRandom(i * 7 + 7) * 0.006,
    });
  }

  // Before burst: nothing visible
  if (frame < burstFrame - 5) return null;

  const relFrame = frame - burstFrame;

  // Burst spring — initial explosion
  const burstSpring = spring({
    frame: Math.max(0, relFrame),
    fps,
    config: { damping: 28, stiffness: 40, mass: 1.2 },
  });

  // Particle opacity — fade in during burst
  const particleOpacity = interpolate(frame, [burstFrame, burstFrame + 15], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Find current and next pattern
  let currentPatternIdx = 0;
  for (let s = PATTERN_SCHEDULE.length - 1; s >= 0; s--) {
    if (relFrame >= PATTERN_SCHEDULE[s].start) {
      currentPatternIdx = s;
      break;
    }
  }

  const currentEntry = PATTERN_SCHEDULE[currentPatternIdx];
  const nextEntry = PATTERN_SCHEDULE[currentPatternIdx + 1];

  // Morphing progress between current and next pattern
  let morphT = 0;
  if (nextEntry && relFrame >= nextEntry.start - TRANSITION_FRAMES) {
    morphT = interpolate(
      relFrame,
      [nextEntry.start - TRANSITION_FRAMES, nextEntry.start],
      [0, 1],
      { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' },
    );
    // Ease in-out for smooth morph
    morphT = morphT * morphT * (3 - 2 * morphT);
  }

  const patternA = PATTERNS[currentEntry.pattern];
  const patternB = nextEntry ? PATTERNS[nextEntry.pattern] : patternA;

  // Compute positions
  const positions = particleMeta.map((meta, i) => {
    const posA = patternA(i, count);
    const posB = patternB(i, count);

    // Blend between patterns
    let targetX = posA.x + (posB.x - posA.x) * morphT;
    let targetY = posA.y + (posB.y - posA.y) * morphT;

    // For the initial burst, interpolate from center
    if (relFrame < 80) {
      targetX = CX + (targetX - CX) * burstSpring;
      targetY = CY + (targetY - CY) * burstSpring;
    }

    // Subtle floating
    const floatT = Math.max(0, relFrame - 20);
    const floatX = Math.sin(floatT * meta.freqX + meta.phase) * 12;
    const floatY = Math.cos(floatT * meta.freqY + meta.phase) * 12;

    let finalX = targetX + floatX;
    let finalY = targetY + floatY;
    let finalSize = meta.size;
    let finalOpacity = 0.35;

    // === Convergence: particles gather below then spiral to center ===
    const convRelFrame = frame - convergeFrame;
    if (convRelFrame > -10) {
      const gatherEnd = 15; // frames to gather below
      const spiralEnd = convergeDuration;

      if (convRelFrame < 0) {
        // Pre-convergence: start drifting down slightly
        const drift = (convRelFrame + 10) / 10; // 0→1
        finalY = finalY + drift * 100;
      } else if (convRelFrame < gatherEnd) {
        // Phase 1: move to bottom area (y:950–1150)
        const p = convRelFrame / gatherEnd;
        const eased = p * p * (3 - 2 * p);
        const gatherY = 850 + seededRandom(i * 11 + 1) * 200;
        const gatherX = 100 + seededRandom(i * 11 + 2) * 880;
        finalX = finalX + (gatherX - finalX) * eased;
        finalY = finalY + (gatherY - finalY) * eased;
        finalOpacity = 0.35 + eased * 0.3;
      } else if (convRelFrame < spiralEnd) {
        // Phase 2: spiral from bottom to center
        const p = (convRelFrame - gatherEnd) / (spiralEnd - gatherEnd);
        const eased = p * p;

        const gatherY = 850 + seededRandom(i * 11 + 1) * 200;
        const gatherX = 100 + seededRandom(i * 11 + 2) * 880;
        const spiralSpeed = 0.8 + seededRandom(i * 11 + 3) * 1.5;
        const spiralR = (1 - eased) * (40 + seededRandom(i * 11 + 4) * 60);
        const angle = eased * spiralSpeed * Math.PI * 5 + meta.phase;

        finalX = gatherX + (CX - gatherX) * eased + Math.cos(angle) * spiralR;
        finalY = gatherY + (CY - gatherY) * eased + Math.sin(angle) * spiralR;
        finalOpacity = 0.65 + eased * 0.35;
        finalSize = meta.size * (1 + eased * 0.5);
      } else {
        // Phase 3: at center briefly, then re-burst outward
        const reBurstProgress = Math.min(1, (convRelFrame - spiralEnd) / 20);
        const reEased = reBurstProgress * reBurstProgress * (3 - 2 * reBurstProgress);

        if (reEased < 0.01) {
          // Still at center
          finalX = CX + Math.cos(meta.phase) * 3;
          finalY = CY + Math.sin(meta.phase) * 3;
          finalOpacity = 1;
          finalSize = meta.size * 1.5;
        } else {
          // Re-explode then blend back to normal pattern positions
          const settleTime = Math.max(0, convRelFrame - spiralEnd - 20);
          const blendToPattern = Math.min(1, settleTime / 30); // 0→1 over 30 frames

          // Re-burst position
          const reAngle = seededRandom(i * 13 + 1) * Math.PI * 2;
          const reDist = 200 + seededRandom(i * 13 + 2) * 500;
          const burstX = CX + Math.cos(reAngle) * reDist;
          const burstY = CY + Math.sin(reAngle) * reDist;

          // Blend from burst position back to normal pattern target
          finalX = burstX + (targetX - burstX) * blendToPattern + Math.sin(floatT * meta.freqX + meta.phase) * 12;
          finalY = burstY + (targetY - burstY) * blendToPattern + Math.cos(floatT * meta.freqY + meta.phase) * 12;
          finalOpacity = 0.35;
          finalSize = meta.size;
        }
      }
    }

    // === Orbit phase: particles orbit the logo then scatter ===
    const orbRel = frame - orbitFrame;
    if (orbRel > -15) {
      const orbitGather = 15; // frames to gather into orbit
      const orbitDur = 35; // frames of orbiting
      const orbitScatter = 20; // frames to scatter back

      if (orbRel < 0) {
        // Pre-orbit: drift toward center
        const drift = (orbRel + 15) / 15;
        const orbitR = 120 + seededRandom(i * 17 + 1) * 80;
        finalX = finalX + (CX + Math.cos(meta.phase) * orbitR - finalX) * drift * 0.3;
        finalY = finalY + (CY + Math.sin(meta.phase) * orbitR - finalY) * drift * 0.3;
      } else if (orbRel < orbitGather) {
        // Gather into orbit ring
        const p = orbRel / orbitGather;
        const eased = p * p * (3 - 2 * p);
        const orbitR = 100 + seededRandom(i * 17 + 1) * 100;
        const angle = meta.phase + orbRel * 0.03;
        const orbX = CX + Math.cos(angle) * orbitR;
        const orbY = CY + Math.sin(angle) * orbitR;
        finalX = finalX + (orbX - finalX) * eased;
        finalY = finalY + (orbY - finalY) * eased;
        finalOpacity = 0.35 + eased * 0.3;
      } else if (orbRel < orbitGather + orbitDur) {
        // Orbiting around center
        const orbT = orbRel - orbitGather;
        const orbitR = 100 + seededRandom(i * 17 + 1) * 100;
        const speed = 0.04 + seededRandom(i * 17 + 2) * 0.03;
        const angle = meta.phase + (orbitGather + orbT) * speed;
        finalX = CX + Math.cos(angle) * orbitR;
        finalY = CY + Math.sin(angle) * orbitR;
        finalOpacity = 0.65;
        finalSize = meta.size * 1.2;
      } else if (orbRel < orbitGather + orbitDur + orbitScatter) {
        // Scatter outward
        const p = (orbRel - orbitGather - orbitDur) / orbitScatter;
        const eased = p * p * (3 - 2 * p);
        const orbitR = 100 + seededRandom(i * 17 + 1) * 100;
        const endAngle = meta.phase + (orbitGather + orbitDur) * (0.04 + seededRandom(i * 17 + 2) * 0.03);
        const orbX = CX + Math.cos(endAngle) * orbitR;
        const orbY = CY + Math.sin(endAngle) * orbitR;
        const scatterDist = 200 + seededRandom(i * 17 + 3) * 400;
        const scatterAngle = endAngle + seededRandom(i * 17 + 4) * 1.5 - 0.75;
        const scatterX = CX + Math.cos(scatterAngle) * scatterDist;
        const scatterY = CY + Math.sin(scatterAngle) * scatterDist;
        finalX = orbX + (scatterX - orbX) * eased;
        finalY = orbY + (scatterY - orbY) * eased;
        finalOpacity = 0.65 - eased * 0.3;
        finalSize = meta.size * (1.2 - eased * 0.2);
      }
    }

    return {
      x: Math.max(-10, Math.min(1090, finalX)),
      y: Math.max(-10, Math.min(1360, finalY)),
      size: finalSize,
      color: meta.color,
      opacity: finalOpacity,
    };
  });

  return (
    <AbsoluteFill style={{ opacity: opacity * particleOpacity, pointerEvents: 'none' }}>
      <svg width={1080} height={1350} style={{ position: 'absolute', top: 0, left: 0 }}>
        {positions.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={p.color}
            opacity={p.opacity}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};
