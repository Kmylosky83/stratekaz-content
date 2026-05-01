import { useCurrentFrame, useVideoConfig, spring } from 'remotion';

interface WordHighlightProps {
  before: string;
  highlight: string;
  after?: string;
  highlightColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: string;
  delay?: number;
}

export const WordHighlight: React.FC<WordHighlightProps> = ({
  before,
  highlight,
  after = '',
  highlightColor = '#ec268f20',
  textColor = '#0f172a',
  fontSize = 42,
  fontWeight = 700,
  fontFamily = "'Montserrat', sans-serif",
  delay = 20,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wipeProgress = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay,
    durationInFrames: 18,
  });

  return (
    <span style={{ fontSize, fontWeight, color: textColor, fontFamily, lineHeight: 1.4 }}>
      {before}
      <span style={{ position: 'relative', display: 'inline-block' }}>
        <span
          style={{
            position: 'absolute',
            left: -4,
            right: -4,
            top: '15%',
            height: '75%',
            transform: `scaleX(${Math.max(0, Math.min(1, wipeProgress))})`,
            transformOrigin: 'left center',
            backgroundColor: highlightColor,
            borderRadius: '0.2em',
            zIndex: 0,
          }}
        />
        <span style={{ position: 'relative', zIndex: 1 }}>{highlight}</span>
      </span>
      {after}
    </span>
  );
};
