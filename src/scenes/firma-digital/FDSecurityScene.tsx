import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import {
  ShieldCheck,
  Fingerprint,
  PenTool,
  Hash,
  Clock,
  BadgeCheck,
  Smartphone,
  Check,
} from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { FD, FD_FONTS } from './fd-constants';

const NODES = [
  { name: 'Identidad', color: '#3b82f6', Icon: Fingerprint },
  { name: 'Trazo', color: '#22c55e', Icon: PenTool },
  { name: 'SHA-256', color: '#06b6d4', Icon: Hash },
  { name: 'Tiempo', color: '#f59e0b', Icon: Clock },
  { name: 'Cargo', color: '#8b5cf6', Icon: BadgeCheck },
  { name: '2FA', color: '#ec4899', Icon: Smartphone },
  { name: 'Sellado', color: '#ef4444', Icon: ShieldCheck },
];

const CX = 540;
const CY = 675;
const OR = 280;

function easeOutBack(t: number): number {
  const c = 1.70158;
  return t >= 1 ? 1 : t <= 0 ? 0 : 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
}

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

export const FDSecurityScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // === SHIELD — full scale immediately, particles created it ===
  const shieldScale = 1.0 + easeOutBack(clamp01(frame / 8)) * 0.08; // slight overshoot 1→1.08→1
  const checkOpacity = clamp01((frame - 8) / 10);
  const shieldGlow = 0.15 + Math.sin(frame * 0.08) * 0.1;

  // === ORBIT RING (20–50) ===
  const orbitProgress = clamp01((frame - 20) / 30);

  // === NODES (40+, stagger 15f) ===
  const nodeStartBase = 40;
  const nodeStagger = 15;
  const lastNodeDone = nodeStartBase + 7 * nodeStagger + 15;

  // === TITLE bicolor (165+) ===
  const titleVisible = frame >= 160;

  // === FOOTER "Irrepudiable · Auditable" — after title, stays for reading ===
  const footerVisible = frame >= 210;
  const footerFade = interpolate(frame, [385, 400], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // === EXIT — nodes disappear one by one (frame 350+) ===
  const nodeExitStart = 350;
  const nodeExitStagger = 8;

  const shieldExitStart = nodeExitStart + 7 * nodeExitStagger + 5;
  const shieldFade = interpolate(frame, [shieldExitStart, shieldExitStart + 15], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });

  // Title erases faster (frame 390+)
  const titleEraseStart = 390;
  const titleText = '7 capas de seguridad';
  const eraseElapsed = Math.max(0, frame - titleEraseStart);
  const eraseCount = Math.min(titleText.length, Math.floor(eraseElapsed * 1.2));
  const titleErased = titleText.length - eraseCount;

  // E4 title writes earlier to have time for both lines (frame 415+)
  const newTitleStart = 415;
  const newTitleVisible = frame >= newTitleStart;

  return (
    <AbsoluteFill>
      {/* === SVG orbital ring + lines === */}
      <svg
        width={1080}
        height={1350}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        <circle
          cx={CX} cy={CY} r={OR}
          fill="none"
          stroke={FD.primary}
          strokeWidth={1.5}
          strokeDasharray={`${2 * Math.PI * OR * orbitProgress} ${2 * Math.PI * OR}`}
          opacity={0.12 * shieldFade}
          transform={`rotate(-90 ${CX} ${CY})`}
        />
        <circle
          cx={CX} cy={CY} r={OR + 40}
          fill="none"
          stroke={FD.primary}
          strokeWidth={1}
          strokeDasharray="3 18"
          opacity={0.05 * orbitProgress * shieldFade}
        />

        {NODES.map((node, i) => {
          const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
          const nodeFrame = nodeStartBase + i * nodeStagger;
          const lineP = clamp01((frame - nodeFrame) / 15);
          const exitFrame = nodeExitStart + (6 - i) * nodeExitStagger;
          const exitP = clamp01((frame - exitFrame) / 12);
          const lineOp = lineP * (1 - exitP);

          const nx = CX + Math.cos(angle) * OR;
          const ny = CY + Math.sin(angle) * OR;
          const sx = CX + Math.cos(angle) * 70;
          const sy = CY + Math.sin(angle) * 70;

          return (
            <line
              key={`l-${i}`}
              x1={sx} y1={sy}
              x2={sx + (nx - sx) * lineP}
              y2={sy + (ny - sy) * lineP}
              stroke={node.color}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              opacity={0.2 * lineOp}
            />
          );
        })}
      </svg>

      {/* === SHIELD === */}
      <div
        style={{
          position: 'absolute',
          top: CY - 70, left: CX - 70,
          width: 140, height: 140,
          borderRadius: 36,
          background: 'linear-gradient(135deg, #F8F0FF, #F0E8FF)',
          border: `2.5px solid ${FD.primary}40`,
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          transform: `scale(${shieldScale})`,
          boxShadow: `0 0 ${30 + shieldGlow * 40}px ${FD.primary}30`,
          opacity: shieldFade,
          zIndex: 10,
        }}
      >
        <ShieldCheck size={60} color={FD.primary} strokeWidth={1.5} />
        {checkOpacity > 0.1 && (
          <div style={{
            position: 'absolute', bottom: -8, right: -8,
            width: 36, height: 36, borderRadius: '50%',
            background: '#00C853',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            opacity: checkOpacity,
            boxShadow: '0 2px 12px #00C85340',
          }}>
            <Check size={24} color="white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* === NODES 90×90, labels always below === */}
      {NODES.map((node, i) => {
        const angle = (i / NODES.length) * Math.PI * 2 - Math.PI / 2;
        const nodeFrame = nodeStartBase + i * nodeStagger;
        const nodeSpring = spring({
          frame: Math.max(0, frame - nodeFrame),
          fps,
          config: { damping: 12, stiffness: 80, mass: 0.6 },
        });

        const exitFrame = nodeExitStart + (6 - i) * nodeExitStagger;
        const exitP = clamp01((frame - exitFrame) / 12);
        const nodeOp = nodeSpring * (1 - exitP);
        if (nodeOp < 0.01) return null;

        const nx = CX + Math.cos(angle) * OR;
        const ny = CY + Math.sin(angle) * OR;
        const IconComp = node.Icon;

        const allVisible = frame > lastNodeDone;
        const pulse = allVisible ? 1 + Math.sin(frame * 0.06 + i * 1.2) * 0.05 : 1;

        const hlStart = lastNodeDone + 5 + i * 10;
        const hl = interpolate(frame, [hlStart, hlStart + 8, hlStart + 20], [0, 1, 0.2], {
          extrapolateRight: 'clamp', extrapolateLeft: 'clamp',
        });

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: nx - 45, top: ny - 45,
              width: 90, height: 90,
              transform: `scale(${nodeSpring * pulse * (1 - exitP * 0.3)})`,
              opacity: nodeOp,
              zIndex: 5,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}
          >
            <div style={{
              width: 90, height: 90, borderRadius: 26,
              background: 'white',
              border: `2.5px solid ${node.color}50`,
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              boxShadow: `0 0 ${14 + hl * 30}px ${node.color}${Math.round(15 + hl * 45).toString(16).padStart(2, '0')}`,
            }}>
              <IconComp size={56} color={node.color} strokeWidth={1.6} />
            </div>
            <span style={{
              marginTop: 8,
              fontSize: 28, fontWeight: 700,
              color: node.color,
              fontFamily: FD_FONTS.heading,
              whiteSpace: 'nowrap', textAlign: 'center',
              opacity: nodeSpring,
            }}>
              {node.name}
            </span>
          </div>
        );
      })}

      {/* === TITLE bicolor two lines — "7 capas de" dark + "seguridad" rosa === */}
      {titleVisible && frame < titleEraseStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <div>
            <TypewriterText
              text="7 capas de"
              startFrame={165}
              charsPerFrame={0.6}
              fontSize={52}
              fontWeight={800}
              color="#1A1A2E"
              fontFamily={FD_FONTS.heading}
              showCursor={frame >= 165 && frame < 188}
            />
          </div>
          {frame >= 186 && (
            <div style={{ marginTop: 4 }}>
              <WordHighlight
                before=""
                highlight="seguridad"
                highlightColor={FD.primary}
                textColor="#ffffff"
                fontSize={56}
                fontWeight={900}
                fontFamily={FD_FONTS.heading}
                delay={188}
              />
            </div>
          )}
        </div>
      )}

      {/* === TITLE ERASING — bicolor, erases from end === */}
      {frame >= titleEraseStart && titleErased > 0 && frame < newTitleStart && (() => {
        const remaining = titleText.slice(0, titleErased);
        const darkPart = remaining.length <= 11 ? remaining : remaining.slice(0, 11); // "7 capas de " = 11 chars
        const rosaPart = remaining.length > 11 ? remaining.slice(11) : '';
        return (
          <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
            <div>
              <span style={{ fontSize: 52, fontWeight: 800, color: '#1A1A2E', fontFamily: FD_FONTS.heading }}>
                {darkPart}
              </span>
            </div>
            {rosaPart && (
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 56, fontWeight: 900, color: FD.primary, fontFamily: FD_FONTS.heading }}>
                  {rosaPart}
                </span>
              </div>
            )}
            <span style={{ fontSize: 52, fontWeight: 300, color: FD.primary, marginLeft: 2, opacity: frame % 20 < 10 ? 1 : 0.3 }}>
              |
            </span>
          </div>
        );
      })()}
      {/* Blinking cursor waiting between erase and new title */}
      {titleErased <= 0 && frame < newTitleStart && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <span style={{ fontSize: 52, fontWeight: 300, color: FD.primary, opacity: frame % 20 < 10 ? 1 : 0.3 }}>
            |
          </span>
        </div>
      )}

      {/* === NEW TITLE — bicolor two lines "Flujos de" + "aprobación" === */}
      {newTitleVisible && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <div>
            <TypewriterText
              text="Flujos de"
              startFrame={newTitleStart}
              charsPerFrame={0.8}
              fontSize={52}
              fontWeight={800}
              color="#1A1A2E"
              fontFamily={FD_FONTS.heading}
              showCursor={frame >= newTitleStart && frame < newTitleStart + 15}
            />
          </div>
          {frame >= newTitleStart + 14 && (
            <div style={{ marginTop: 4 }}>
              <WordHighlight
                before=""
                highlight="aprobación"
                highlightColor={FD.primary}
                textColor="#ffffff"
                fontSize={56}
                fontWeight={900}
                fontFamily={FD_FONTS.heading}
                delay={newTitleStart + 16}
              />
            </div>
          )}
        </div>
      )}

      {/* === FOOTER — two columns, WordHighlight like StrateKaz === */}
      {footerVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: 160,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            gap: 24,
            opacity: footerFade,
          }}
        >
          {/* "Irrepudiable" — first */}
          <div style={{ opacity: spring({ frame: Math.max(0, frame - 210), fps, config: { damping: 14, stiffness: 100 } }) }}>
            <WordHighlight
              before=""
              highlight="Irrepudiable"
              highlightColor={FD.primary}
              textColor="#ffffff"
              fontSize={44}
              fontWeight={800}
              fontFamily={FD_FONTS.heading}
              delay={213}
            />
          </div>
          {/* "Auditable" — second, slight delay */}
          <div style={{ opacity: spring({ frame: Math.max(0, frame - 230), fps, config: { damping: 14, stiffness: 100 } }) }}>
            <WordHighlight
              before=""
              highlight="Auditable"
              highlightColor={FD.primary}
              textColor="#ffffff"
              fontSize={44}
              fontWeight={800}
              fontFamily={FD_FONTS.heading}
              delay={233}
            />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
