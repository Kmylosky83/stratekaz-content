import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

import { GDBackground } from './GDBackground';
import { GDHookScene } from './GDHookScene';
import { GDCicloScene } from './GDCicloScene';
import { GDOcrFormScene } from './GDOcrFormScene';
import { GDTrazabilidadScene } from './GDTrazabilidadScene';
import { GDCTAScene } from './GDCTAScene';

// 60 seconds @ 30fps = 1800 frames
// Timing:
//   Scene 1 Hook:          210f (7s)
//   Scene 2 Ciclo:         480f (16s)
//   Scene 3 OCR+Forms:     420f (14s)
//   Scene 4 Trazabilidad:  360f (12s)
//   Scene 5 CTA:           330f (11s)
// + 4 transitions × 15f = 60f overlap
// Total: 210+480+420+360+330 = 1800 + 60 overlap = 1800 net

export const GestorDocumentalVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <GDBackground />

      <TransitionSeries>
        {/* Scene 1: Hook */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <GDHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Ciclo Documental */}
        <TransitionSeries.Sequence durationInFrames={480}>
          <GDCicloScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: OCR + FormBuilder */}
        <TransitionSeries.Sequence durationInFrames={420}>
          <GDOcrFormScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 4: Trazabilidad + Sellado */}
        <TransitionSeries.Sequence durationInFrames={360}>
          <GDTrazabilidadScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: CTA */}
        <TransitionSeries.Sequence durationInFrames={330}>
          <GDCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
