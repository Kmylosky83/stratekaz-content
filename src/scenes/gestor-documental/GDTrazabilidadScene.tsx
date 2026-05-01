import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { ShieldCheck, Hash, QrCode, Stamp, Eye, Check } from 'lucide-react';
import { TypewriterText } from '../../components/TypewriterText';
import { WordHighlight } from '../../components/WordHighlight';
import { CursorClick } from '../../components/CursorClick';
import { GD, GD_FONTS } from './gd-constants';

const VERSIONS = [
  { version: 'v1.0', label: 'Creación', color: GD.green },
  { version: 'v1.1', label: 'Revisión menor', color: GD.cyan },
  { version: 'v2.0', label: 'Revisión mayor', color: GD.primary },
  { version: 'v2.1', label: 'Corrección', color: GD.amber },
  { version: 'v3.0', label: 'Actualización', color: GD.green, current: true },
];

export const GDTrazabilidadScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title "Trazabilidad total" already written by E3
  // Subtitle
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // Version timeline
  const versionStart = 45;
  const versionStagger = 18;

  // Cursor click on v3.0 → sealing panel
  const clickFrame = 130;
  const panelVisible = frame >= clickFrame + 10;

  // Sealing panel items
  const hashStart = 165;
  const certStart = 185;
  const qrStart = 195;
  const watermarkStart = 210;

  // Panel fades → Lectura verificada
  const panelFade = interpolate(frame, [225, 245], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const lecturaVisible = frame >= 240;

  // Progress bar
  const progressFill = interpolate(frame, [250, 285], [0, 90], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const checkBounce = spring({ frame: Math.max(0, frame - 288), fps, config: { damping: 10, stiffness: 120, mass: 0.5 } });

  // Footer
  const footerVisible = frame >= 290;

  // Exit
  const exitEraseStart = 325;
  const contentFade = interpolate(frame, [320, 345], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const exitNewTitleStart = 340;
  const exitNewTitleVisible = frame >= exitNewTitleStart;

  return (
    <AbsoluteFill>
      {/* Title — "Trazabilidad total" from E3 */}
      <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center', opacity: frame < exitEraseStart ? 1 : contentFade }}>
        <span style={{ fontSize: 52, fontWeight: 800, color: GD.textWhite, fontFamily: GD_FONTS.heading }}>Trazabilidad</span>
        <br />
        <WordHighlight before="" highlight="total" highlightColor={GD.primary} textColor="#ffffff" fontSize={56} fontWeight={900} fontFamily={GD_FONTS.heading} delay={0} />
      </div>

      {/* Subtitle */}
      <div style={{ position: 'absolute', top: 205, left: 0, right: 0, textAlign: 'center', opacity: subtitleOpacity * contentFade }}>
        <span style={{ fontSize: 32, color: GD.textMuted, fontFamily: GD_FONTS.body }}>
          Cada cambio registrado. Cada versión sellada.
        </span>
      </div>

      {/* Version Timeline */}
      <div style={{ position: 'absolute', top: 280, left: 80, right: 80, opacity: contentFade }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 24, top: 20, bottom: 20, width: 3, background: `linear-gradient(180deg, ${GD.primary}60, ${GD.border})`, borderRadius: 2 }} />

        {VERSIONS.map((ver, i) => {
          const delay = versionStart + i * versionStagger;
          const vSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 100, mass: 0.5 } });
          const slideX = i % 2 === 0 ? -50 : 50;

          if (vSpring < 0.01) return null;
          return (
            <div key={i} style={{ opacity: vSpring, transform: `translateX(${(1 - vSpring) * slideX}px)`, display: 'flex', alignItems: 'center', gap: 18, padding: '12px 0', marginLeft: 50 }}>
              {/* Dot */}
              <div style={{
                position: 'absolute', left: 12, width: 28, height: 28, borderRadius: '50%',
                background: ver.color + '25', border: `3px solid ${ver.color}`,
                boxShadow: ver.current ? `0 0 12px ${ver.color}` : 'none',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
              }}>
                {ver.current && <div style={{ width: 10, height: 10, borderRadius: '50%', background: ver.color }} />}
              </div>
              {/* Card */}
              <div style={{ padding: '14px 24px', background: GD.bgSurface, border: `1.5px solid ${ver.color}25`, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 14, flex: 1, boxShadow: ver.current ? `0 0 15px ${ver.color}20` : 'none' }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: ver.color, fontFamily: 'monospace' }}>{ver.version}</span>
                <span style={{ fontSize: 28, fontWeight: 600, color: GD.textWhite, fontFamily: GD_FONTS.body }}>{ver.label}</span>
                {ver.current && <span style={{ fontSize: 22, fontWeight: 700, color: ver.color, fontFamily: GD_FONTS.heading, marginLeft: 'auto' }}>ACTUAL</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cursor click on v3.0 */}
      <CursorClick fromX={800} fromY={300} toX={600} toY={640} startFrame={110} clickFrame={clickFrame} showRipple rippleColor={GD.primary} />

      {/* Sealing Panel */}
      {panelVisible && (
        <div style={{ position: 'absolute', top: 300, left: 100, right: 100, padding: 30, background: GD.bgCard, border: `1.5px solid ${GD.green}30`, borderRadius: 24, boxShadow: GD.greenNeonGlow, opacity: panelFade, display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Hash */}
          {frame >= hashStart && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: spring({ frame: Math.max(0, frame - hashStart), fps, config: { damping: 14, stiffness: 100 } }) }}>
              <Hash size={32} color={GD.cyan} strokeWidth={2} />
              <TypewriterText text="SHA-256: 3f4a9c2b..." startFrame={hashStart} charsPerFrame={1.0} fontSize={28} fontWeight={700} color={GD.cyan} fontFamily="'JetBrains Mono', monospace" showCursor={frame >= hashStart && frame < hashStart + 25} />
            </div>
          )}
          {/* Certificate */}
          {frame >= certStart && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: spring({ frame: Math.max(0, frame - certStart), fps, config: { damping: 14, stiffness: 100 } }) }}>
              <ShieldCheck size={32} color={GD.green} strokeWidth={2} />
              <span style={{ fontSize: 28, fontWeight: 700, color: GD.green, fontFamily: GD_FONTS.heading }}>Certificado X.509</span>
            </div>
          )}
          {/* QR */}
          {frame >= qrStart && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: spring({ frame: Math.max(0, frame - qrStart), fps, config: { damping: 14, stiffness: 100 } }) }}>
              <QrCode size={32} color={GD.textWhite} strokeWidth={2} />
              <span style={{ fontSize: 28, fontWeight: 600, color: GD.textMuted, fontFamily: GD_FONTS.body }}>QR de verificación</span>
            </div>
          )}
          {/* Watermark */}
          {frame >= watermarkStart && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, opacity: spring({ frame: Math.max(0, frame - watermarkStart), fps, config: { damping: 14, stiffness: 100 } }) }}>
              <Stamp size={32} color={GD.primary} strokeWidth={2} />
              <span style={{ fontSize: 28, fontWeight: 600, color: GD.primary, fontFamily: GD_FONTS.heading }}>DOCUMENTO CONTROLADO</span>
            </div>
          )}
        </div>
      )}

      {/* Lectura Verificada Card */}
      {lecturaVisible && (
        <div style={{ position: 'absolute', top: 350, left: 80, right: 80, padding: 30, background: GD.bgSurface, border: `1.5px solid ${GD.violet}30`, borderRadius: 24, boxShadow: GD.violetGlow, opacity: contentFade }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <Eye size={36} color={GD.violet} strokeWidth={2} />
            <span style={{ fontSize: 36, fontWeight: 800, color: GD.textWhite, fontFamily: GD_FONTS.heading }}>Lectura Verificada</span>
          </div>
          {/* Progress bar */}
          <div style={{ height: 14, background: GD.border, borderRadius: 7, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: '100%', width: `${progressFill}%`, background: `linear-gradient(90deg, ${GD.violet}, ${GD.green})`, borderRadius: 7 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 26, color: GD.textMuted, fontFamily: GD_FONTS.body }}>Scroll tracking + IP + dispositivo</span>
            <span style={{ fontSize: 26, fontWeight: 700, color: GD.green, fontFamily: 'monospace' }}>{Math.round(progressFill)}%</span>
          </div>
          {/* Check accepted */}
          {checkBounce > 0.01 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, transform: `scale(${checkBounce})` }}>
              <Check size={28} color={GD.green} strokeWidth={3} />
              <span style={{ fontSize: 28, fontWeight: 700, color: GD.green, fontFamily: GD_FONTS.heading }}>Aceptado por el colaborador</span>
            </div>
          )}
        </div>
      )}

      {/* Footer: Irrepudiable + Auditable + ISO 7.3 */}
      {footerVisible && (
        <div style={{ position: 'absolute', bottom: 120, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, opacity: contentFade }}>
          {['Irrepudiable', 'Auditable', 'ISO 7.3'].map((text, i) => (
            <div key={i} style={{ opacity: spring({ frame: Math.max(0, frame - (295 + i * 15)), fps, config: { damping: 14, stiffness: 100 } }) }}>
              <WordHighlight before="" highlight={text} highlightColor={GD.primary} textColor="#ffffff" fontSize={36} fontWeight={800} fontFamily={GD_FONTS.heading} delay={298 + i * 15} />
            </div>
          ))}
        </div>
      )}

      {/* Exit: title erases → "stratekaz.com" for E5 */}
      {exitNewTitleVisible && (
        <div style={{ position: 'absolute', top: 80, left: 0, right: 0, textAlign: 'center' }}>
          <TypewriterText text="stratekaz.com" startFrame={exitNewTitleStart} charsPerFrame={0.6} fontSize={52} fontWeight={800} color={GD.primary} fontFamily={GD_FONTS.heading} showCursor={frame >= exitNewTitleStart && frame < exitNewTitleStart + 30} cursorColor={GD.primary} />
        </div>
      )}
    </AbsoluteFill>
  );
};
