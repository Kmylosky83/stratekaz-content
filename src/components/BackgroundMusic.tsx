import { useVideoConfig, interpolate, staticFile } from 'remotion';
import { Audio } from '@remotion/media';

interface BackgroundMusicProps {
  volume?: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
}

export const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  volume = 0.3,
  fadeInSeconds = 2,
  fadeOutSeconds = 3,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  const fadeInFrames = fadeInSeconds * fps;
  const fadeOutStart = durationInFrames - fadeOutSeconds * fps;

  return (
    <Audio
      src={staticFile('music.mp3')}
      volume={(f) => {
        // Fade in
        if (f < fadeInFrames) {
          return interpolate(f, [0, fadeInFrames], [0, volume], {
            extrapolateRight: 'clamp',
          });
        }
        // Fade out
        if (f > fadeOutStart) {
          return interpolate(f, [fadeOutStart, durationInFrames], [volume, 0], {
            extrapolateRight: 'clamp',
          });
        }
        return volume;
      }}
      loop
    />
  );
};
