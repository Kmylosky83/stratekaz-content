import { useCurrentFrame, interpolate } from 'remotion';

interface TypewriterTextProps {
  text: string;
  startFrame?: number;
  charsPerFrame?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  fontFamily?: string;
  showCursor?: boolean;
  cursorColor?: string;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  startFrame = 0,
  charsPerFrame = 0.5,
  fontSize = 36,
  fontWeight = 600,
  color = '#0f172a',
  fontFamily = "'Inter', sans-serif",
  showCursor = true,
  cursorColor,
}) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const charCount = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const typedText = text.slice(0, charCount);
  const isDone = charCount >= text.length;

  // Blinking cursor
  const cursorOpacity = isDone
    ? interpolate(frame % 20, [0, 10, 20], [1, 0, 1], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <span
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily,
        lineHeight: 1.3,
      }}
    >
      {typedText}
      {showCursor && (
        <span
          style={{
            opacity: cursorOpacity,
            color: cursorColor ?? color,
            fontWeight: 300,
            marginLeft: 2,
          }}
        >
          |
        </span>
      )}
    </span>
  );
};
