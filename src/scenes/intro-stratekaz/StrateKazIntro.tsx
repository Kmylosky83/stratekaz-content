// StrateKazIntro.tsx — v3
// Cambios v3:
// - Agregado ISBurstRays (rayos explotando desde el logo en el peak del heartbeat)
// - Capa de burst rays va POR ENCIMA del logo (zIndex implícito por orden)

import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

import { ISBackground } from "./ISBackground";
import { ISActOneTwoScene } from "./ISActOneTwoScene";
import { ISActThreeScene } from "./ISActThreeScene";
import { ISActFourFiveScene } from "./ISActFourFiveScene";
import { ISBurstRays } from "./ISBurstRays";
import { IS_TIMING, type IntroTheme, type IntroFormat } from "./is-constants";

// Cargar fuentes (idempotente)
loadMontserrat("normal", { weights: ["400", "500", "600", "700", "800", "900"] });
loadInter("normal", { weights: ["300", "400", "500", "600", "700"] });

export type StrateKazIntroProps = {
  theme: IntroTheme;
  format: IntroFormat;
  withMusic?: boolean;
};

export const StrateKazIntro: React.FC<StrateKazIntroProps> = ({
  theme,
  format,
  withMusic = true,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const audioVolume = (f: number) => {
    const fadeIn = interpolate(
      f,
      [IS_TIMING.act2Start, IS_TIMING.act2Start + IS_TIMING.musicFadeInFrames],
      [0, IS_TIMING.musicVolume],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    const fadeOut = interpolate(
      f,
      [durationInFrames - IS_TIMING.musicFadeOutFrames, durationInFrames],
      [IS_TIMING.musicVolume, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
    );
    return Math.min(fadeIn, fadeOut);
  };

  return (
    <AbsoluteFill>
      {/* Capa 0: Fondo + particles + glow */}
      <ISBackground theme={theme} format={format} />

      {/* Capa 1: Trazo SVG (Actos 1+2) */}
      <ISActOneTwoScene theme={theme} />

      {/* Capa 2: Tipografía StrateK + az (Acto 3) */}
      <ISActThreeScene theme={theme} format={format} />

      {/* Capa 3: Tagline + logo PNG + heartbeat (Actos 4+5) */}
      <ISActFourFiveScene theme={theme} format={format} />

      {/* Capa 4: Burst rays (rayos de marca explotando desde el logo) — v3 */}
      <ISBurstRays theme={theme} />

      {/* Audio */}
      {withMusic && (
        <Audio src={staticFile("music.mp3")} volume={audioVolume(frame)} />
      )}
    </AbsoluteFill>
  );
};
