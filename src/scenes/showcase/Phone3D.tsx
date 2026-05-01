// scenes/showcase/Phone3D.tsx
// Reusable 3D phone mockup — used inside <ThreeCanvas> contexts.
//
// Composed of:
// - Body: rounded boxGeometry with metallic dark material
// - Screen: emissive plane that glows in the chosen accent color
// - Notch: small bar at top
// - Big title text + optional body text + accent bar at bottom
//
// All animation is intentionally driven by the parent (via position/rotation/scale).

import { Text } from "@react-three/drei";
import { BRAND } from "../../brand/tokens";

const PHONE_W = 1.4;
const PHONE_H = 2.8;
const PHONE_D = 0.15;
const SCREEN_INSET = 0.06;

type ScreenContent = {
  title: string;
  body?: string;
  accent?: string;
};

type Props = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  screen: ScreenContent;
};

export const Phone3D: React.FC<Props> = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  screen,
}) => {
  const accent = screen.accent ?? BRAND.primary;
  const screenW = PHONE_W - SCREEN_INSET * 2;
  const screenH = PHONE_H - SCREEN_INSET * 2;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Phone body — dark metallic */}
      <mesh>
        <boxGeometry args={[PHONE_W, PHONE_H, PHONE_D]} />
        <meshStandardMaterial
          color="#1a1a1a"
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Screen — emissive plane */}
      <mesh position={[0, 0, PHONE_D / 2 + 0.01]}>
        <boxGeometry args={[screenW, screenH, 0.01]} />
        <meshStandardMaterial
          color="#000000"
          emissive={accent}
          emissiveIntensity={0.35}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* Notch / status bar at top */}
      <mesh position={[0, PHONE_H / 2 - 0.15, PHONE_D / 2 + 0.02]}>
        <boxGeometry args={[0.45, 0.09, 0.005]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* Title text */}
      <Text
        position={[0, 0.5, PHONE_D / 2 + 0.025]}
        fontSize={0.2}
        color={accent}
        anchorX="center"
        anchorY="middle"
        fontWeight={900}
        maxWidth={screenW - 0.2}
        textAlign="center"
      >
        {screen.title}
      </Text>

      {/* Body text (optional) */}
      {screen.body && (
        <Text
          position={[0, -0.05, PHONE_D / 2 + 0.025]}
          fontSize={0.11}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={screenW - 0.3}
          lineHeight={1.4}
          textAlign="center"
          fillOpacity={0.85}
        >
          {screen.body}
        </Text>
      )}

      {/* Glowing accent bar at bottom */}
      <mesh position={[0, -PHONE_H / 2 + 0.4, PHONE_D / 2 + 0.025]}>
        <boxGeometry args={[PHONE_W * 0.6, 0.08, 0.005]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Home indicator pill */}
      <mesh position={[0, -PHONE_H / 2 + 0.15, PHONE_D / 2 + 0.025]}>
        <boxGeometry args={[0.5, 0.04, 0.005]} />
        <meshBasicMaterial color="#666666" />
      </mesh>
    </group>
  );
};
