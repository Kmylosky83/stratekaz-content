import { GlassBg } from '../../components/GlassBg';

export const GDBackground: React.FC = () => {
  return (
    <GlassBg
      variant="dark"
      accentColor="#ec268f"
      secondaryColor="#ffffff"
      showParticles
      particleCount={65}
      burstFrame={55}
    />
  );
};
