import { GlassBg } from '../../components/GlassBg';

export const FDBackground: React.FC = () => {
  return (
    <GlassBg
      variant="light"
      accentColor="#ec268f"
      secondaryColor="#3b82f6"
      showParticles
      particleCount={65}
      burstFrame={55}
      convergeFrame={705}
      convergeDuration={38}
      orbitFrame={1490}
    />
  );
};
