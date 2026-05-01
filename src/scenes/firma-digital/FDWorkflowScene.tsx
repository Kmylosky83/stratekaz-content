import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  staticFile,
} from 'remotion';
import {
  PenLine,
  Eye,
  CheckCircle2,
  BadgeCheck,
  Stamp,
  FileText,
  ClipboardList,
  Users,
  UserPlus,
} from 'lucide-react';
import { CursorClick } from '../../components/CursorClick';

import { WordHighlight } from '../../components/WordHighlight';
import { FD, FD_FONTS } from './fd-constants';

const WORKFLOW_STEPS = [
  { role: 'Elaboró', name: 'Asistente', Icon: PenLine },
  { role: 'Revisó', name: 'Coordinador', Icon: Eye },
  { role: 'Aprobó', name: 'Jefe de Área', Icon: CheckCircle2 },
  { role: 'Validó', name: 'Dir. Calidad', Icon: BadgeCheck },
  { role: 'Autorizó', name: 'Gerente', Icon: Stamp },
];

const DOC_TYPES = [
  { name: 'Políticas', Icon: FileText },
  { name: 'Procedimientos', Icon: ClipboardList },
  { name: 'Contratación', Icon: UserPlus },
  { name: 'Talento Humano', Icon: Users },
];

export const FDWorkflowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // All steps are signed EXCEPT Autorizó which gets signed after cursor click
  const clickFrame = 175;
  const lastSigned = frame > clickFrame + 5;

  // Toast appears after click
  const toastEnter = clickFrame + 8;

  // Badges appear after toast — need time to read
  const badgesStart = toastEnter + 25;

  // EXIT: content fades first, toast stays alone, then morphs to logo
  const exitStart = 295;
  const contentFade = interpolate(frame, [exitStart, exitStart + 20], [1, 0], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  // Toast stays alone pulsing, then morphs to logo
  const toastToLogo = interpolate(frame, [exitStart + 40, exitStart + 55], [0, 1], {
    extrapolateRight: 'clamp',
    extrapolateLeft: 'clamp',
  });
  const morphSmooth = toastToLogo * toastToLogo * (3 - 2 * toastToLogo);

  return (
    <AbsoluteFill>
      {/* Title — identical to E3's exit */}
      <div
        style={{
          position: 'absolute', top: 80, left: 0, right: 0,
          textAlign: 'center', zIndex: 5,
          opacity: contentFade,
        }}
      >
        <div>
          <span style={{ fontSize: 52, fontWeight: 800, color: '#1A1A2E', fontFamily: FD_FONTS.heading }}>
            Flujos de
          </span>
        </div>
        <div style={{ marginTop: 4 }}>
          <WordHighlight
            before=""
            highlight="aprobación"
            highlightColor={FD.primary}
            textColor="#ffffff"
            fontSize={56}
            fontWeight={900}
            fontFamily={FD_FONTS.heading}
            delay={0}
          />
        </div>
        <div style={{ marginTop: 10, opacity: subtitleOpacity }}>
          <span style={{ fontSize: 32, color: FD.textMuted, fontFamily: FD_FONTS.body }}>
            Sin papel. Sin demoras. Automáticos.
          </span>
        </div>
      </div>

      {/* Workflow steps — positioned below title */}
      <div
        style={{
          position: 'absolute',
          top: 300,
          left: 50,
          right: 50,
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
          opacity: contentFade,
        }}
      >
        {/* Vertical timeline line */}
        <div style={{ position: 'absolute', left: 34, top: 24, bottom: 24, width: 2.5, background: FD.border, borderRadius: 2 }} />

        {WORKFLOW_STEPS.map((step, i) => {
          const delay = 60 + i * 22;
          const stepSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 10, stiffness: 120, mass: 0.5 } });

          // All signed except last one (Autorizó) until click
          const isSigned = i < 4 || lastSigned;
          const isTarget = i === 4 && !lastSigned; // Autorizó waiting for click
          const StepIcon = step.Icon;

          // Bounce when last gets signed
          const signBounce = i === 4 && lastSigned
            ? spring({ frame: Math.max(0, frame - clickFrame - 5), fps, config: { damping: 10, stiffness: 150, mass: 0.5 } })
            : 1;

          return (
            <div
              key={i}
              style={{
                opacity: stepSpring,
                transform: `translateX(${(1 - stepSpring) * 50}px) scale(${0.9 + stepSpring * 0.1})`,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '10px 16px',
              }}
            >
              {/* Status dot — green check for signed, pulsing for target */}
              <div
                style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: isSigned ? FD.success : isTarget ? `${FD.primary}15` : 'white',
                  border: `2.5px solid ${isSigned ? FD.success : isTarget ? FD.primary : FD.border}`,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  flexShrink: 0, zIndex: 2,
                  boxShadow: isSigned ? `0 2px 8px ${FD.success}30` : isTarget ? `0 0 ${8 + Math.sin(frame * 0.18) * 6}px ${FD.primary}20` : 'none',
                  transform: `scale(${signBounce}${isTarget ? ` * ${1 + Math.sin(frame * 0.18) * 0.12}` : ''})`,
                }}
              >
                {isSigned
                  ? <CheckCircle2 size={22} color="white" strokeWidth={3} />
                  : <span style={{ fontSize: 18, fontWeight: 700, color: isTarget ? FD.primary : FD.textMuted }}>{i + 1}</span>
                }
              </div>

              {/* Card */}
              <div
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  background: isTarget ? `${FD.primary}05` : 'white',
                  border: `1.5px solid ${isSigned ? `${FD.success}25` : isTarget ? `${FD.primary}30` : FD.border}`,
                  borderRadius: 14,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  boxShadow: isTarget ? `0 4px 16px ${FD.primary}08` : '0 2px 8px rgba(0,0,0,0.03)',
                }}
              >
                <div>
                  <span style={{ fontSize: 32, fontWeight: 700, color: isTarget ? FD.primary : FD.textDark, fontFamily: FD_FONTS.heading }}>
                    {step.role}
                  </span>
                  <br />
                  <span style={{ fontSize: 24, color: FD.textMuted, fontFamily: FD_FONTS.body }}>{step.name}</span>
                </div>
                <StepIcon size={32} color={isSigned ? FD.success : isTarget ? FD.primary : FD.textSubtle} strokeWidth={1.8} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Cursor clicks on Autorizó (last step, ~y:650) */}
      <CursorClick
        fromX={800}
        fromY={300}
        toX={560}
        toY={700}
        startFrame={140}
        clickFrame={clickFrame}
        showRipple
        rippleColor={FD.primary}
      />

      {/* Toast → Logo morph: same element transforms */}
      {frame >= toastEnter && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, -50%) scale(${spring({ frame: Math.max(0, frame - toastEnter), fps, config: { damping: 12, stiffness: 100, mass: 0.6 } })})`,
            zIndex: 30,
          }}
        >
          {/* Toast content — fades out during morph */}
          <div
            style={{
              padding: '28px 60px',
              background: `rgba(0, 200, 83, ${1 - morphSmooth})`,
              borderRadius: interpolate(morphSmooth, [0, 1], [24, 0]),
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              boxShadow: frame >= exitStart
                ? `0 0 ${20 + Math.sin(frame * 0.2) * 15}px rgba(0, 200, 83, ${0.4 * (1 - morphSmooth)})`
                : `0 8px 40px #00C85340`,
              opacity: 1 - morphSmooth,
            }}
          >
            <CheckCircle2 size={36} color="white" strokeWidth={2.5} />
            <div>
              <span style={{ fontSize: 40, fontWeight: 800, color: 'white', fontFamily: FD_FONTS.heading }}>
                Firma registrada
              </span>
              <br />
              <span style={{ fontSize: 28, fontWeight: 500, color: 'rgba(255,255,255,0.85)', fontFamily: FD_FONTS.body }}>
                Documento aprobado exitosamente
              </span>
            </div>
          </div>

          {/* Logo — fades in as toast fades out */}
          {morphSmooth > 0.01 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: morphSmooth }}>
              <Img
                src={staticFile('logo-dark.png')}
                style={{ width: 420, objectFit: 'contain' }}
              />
            </div>
          )}
        </div>
      )}

      {/* Badges — 2 columns, positioned below workflow steps */}
      <div
        style={{
          position: 'absolute',
          top: 960,
          left: 50,
          right: 50,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 14,
          opacity: contentFade,
        }}
      >
        {DOC_TYPES.map((doc, i) => {
          const delay = badgesStart + i * 18;
          const docSpring = spring({ frame: Math.max(0, frame - delay), fps, config: { damping: 12, stiffness: 100, mass: 0.5 } });
          const DocIcon = doc.Icon;
          if (docSpring < 0.01) return null;
          return (
            <div
              key={i}
              style={{
                opacity: docSpring,
                transform: `scale(${0.85 + docSpring * 0.15})`,
                padding: '18px 24px',
                background: `${FD.primary}08`,
                border: `1.5px solid ${FD.primary}25`,
                borderRadius: 20,
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: `0 4px 16px ${FD.primary}10`,
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${FD.primary}15`, display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                <DocIcon size={36} color={FD.primary} strokeWidth={2} />
              </div>
              <span style={{ fontSize: 32, fontWeight: 700, color: FD.primary, fontFamily: FD_FONTS.heading }}>{doc.name}</span>
            </div>
          );
        })}
      </div>

    </AbsoluteFill>
  );
};
