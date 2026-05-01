import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

// import { BackgroundMusic } from '../../components/BackgroundMusic';
import { FDBackground } from './FDBackground';
import { FDHookScene } from './FDHookScene';
import { FDCanvasScene } from './FDCanvasScene';
import { FDSecurityScene } from './FDSecurityScene';
import { FDWorkflowScene } from './FDWorkflowScene';
import { FDCTAScene } from './FDCTAScene';

// 60 seconds @ 30fps = 1800 frames
// Timing — E2/E3 extended for readability:
//   Scene 1 Hook:     210f (7s)
//   Scene 2 Canvas:   530f — E3 starts at 00:24.17
//   Scene 3 Security: 465f
//   Scene 4 Workflow:  395f — logo visible longer
//   Scene 5 CTA:      260f
// + 4 transitions × 15f = 60f overlap
// Total: 210+530+465+395+260 = 1860 + 60 overlap → 62s video

export const FirmaDigitalVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      <FDBackground />
      {/* <BackgroundMusic volume={0.2} fadeInSeconds={1.5} fadeOutSeconds={3} /> */}

      <TransitionSeries>
        {/* Scene 1: Hook (0–7s) */}
        <TransitionSeries.Sequence durationInFrames={210}>
          <FDHookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Canvas + firma + badges */}
        <TransitionSeries.Sequence durationInFrames={530}>
          <FDCanvasScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: 7 Security orbital (24.5–40s) */}
        <TransitionSeries.Sequence durationInFrames={465}>
          <FDSecurityScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 4: Workflow (40–52s) */}
        {/* Scene 4: Workflow */}
        <TransitionSeries.Sequence durationInFrames={395}>
          <FDWorkflowScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: CTA */}
        <TransitionSeries.Sequence durationInFrames={260}>
          <FDCTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
