import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Background } from '../../components/Background';
import { BackgroundMusic } from '../../components/BackgroundMusic';
import { HookScene } from './HookScene';
import { IntroScene } from './IntroScene';
import { PilaresScene } from './PilaresScene';
import { DemoScene } from './DemoScene';
import { ISOScene } from './ISOScene';
import { CTAScene } from './CTAScene';

// With TransitionSeries, transitions overlap scenes so total is shorter.
// We increase scene durations to compensate for the 15-frame overlaps.
// 6 scenes + 5 transitions (15f each) = total ~1800 frames (60s)

export const StrateKazSGI: React.FC = () => {
  return (
    <AbsoluteFill>
      <Background />
      <BackgroundMusic volume={0.25} fadeInSeconds={2} fadeOutSeconds={4} />

      <TransitionSeries>
        {/* Scene 1: Hook — ¿Tu empresa gestiona así? */}
        <TransitionSeries.Sequence durationInFrames={165}>
          <HookScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 2: Logo + Intro */}
        <TransitionSeries.Sequence durationInFrames={165}>
          <IntroScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-bottom' })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 3: Los 6 Pilares */}
        <TransitionSeries.Sequence durationInFrames={465}>
          <PilaresScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 4: Demo simulada */}
        <TransitionSeries.Sequence durationInFrames={465}>
          <DemoScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: 'from-right' })}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 5: Normas ISO */}
        <TransitionSeries.Sequence durationInFrames={315}>
          <ISOScene />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />

        {/* Scene 6: CTA final */}
        <TransitionSeries.Sequence durationInFrames={315}>
          <CTAScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
