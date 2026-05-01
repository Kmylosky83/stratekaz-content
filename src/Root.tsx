import "./index.css";
import { Composition, Folder } from "remotion";
import { StrateKazSGI } from "./scenes/sgi/StrateKazSGI";
import { FirmaDigitalVideo } from "./scenes/firma-digital/FirmaDigitalVideo";
import { GestorDocumentalVideo } from "./scenes/gestor-documental/GestorDocumentalVideo";
import { StrateKazIntro } from "./scenes/intro-stratekaz/StrateKazIntro";
import type { StrateKazIntroProps } from "./scenes/intro-stratekaz/StrateKazIntro";
import {
  IS_DURATIONS,
  IS_DIMENSIONS,
} from "./scenes/intro-stratekaz/is-constants";
import { Showcase, SHOWCASE_DURATION } from "./scenes/showcase/Showcase";
import { Stage3D } from "./scenes/showcase/Stage3D";
import { VIDEO } from "./constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Folder name="00-Showcase">
        <Composition
          id="Showcase-Stories"
          component={Showcase}
          durationInFrames={SHOWCASE_DURATION}
          fps={30}
          width={1080}
          height={1920}
        />
        <Composition
          id="Stage3D-Standalone"
          component={Stage3D}
          durationInFrames={300}
          fps={30}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="01-Intro-Marca">
        <Composition
          id="StrateKazIntro-Stories-Dark"
          component={StrateKazIntro}
          durationInFrames={IS_DURATIONS.total}
          fps={30}
          width={IS_DIMENSIONS.stories.width}
          height={IS_DIMENSIONS.stories.height}
          defaultProps={
            {
              theme: "dark",
              format: "stories",
              withMusic: true,
            } satisfies StrateKazIntroProps
          }
        />
        <Composition
          id="StrateKazIntro-Stories-Light"
          component={StrateKazIntro}
          durationInFrames={IS_DURATIONS.total}
          fps={30}
          width={IS_DIMENSIONS.stories.width}
          height={IS_DIMENSIONS.stories.height}
          defaultProps={
            {
              theme: "light",
              format: "stories",
              withMusic: true,
            } satisfies StrateKazIntroProps
          }
        />
        <Composition
          id="StrateKazIntro-Feed-Dark"
          component={StrateKazIntro}
          durationInFrames={IS_DURATIONS.total}
          fps={30}
          width={IS_DIMENSIONS.feed.width}
          height={IS_DIMENSIONS.feed.height}
          defaultProps={
            {
              theme: "dark",
              format: "feed",
              withMusic: true,
            } satisfies StrateKazIntroProps
          }
        />
        <Composition
          id="StrateKazIntro-Feed-Light"
          component={StrateKazIntro}
          durationInFrames={IS_DURATIONS.total}
          fps={30}
          width={IS_DIMENSIONS.feed.width}
          height={IS_DIMENSIONS.feed.height}
          defaultProps={
            {
              theme: "light",
              format: "feed",
              withMusic: true,
            } satisfies StrateKazIntroProps
          }
        />
      </Folder>

      <Folder name="02-StrateKaz-SGI">
        <Composition
          id="StrateKazSGI"
          component={StrateKazSGI}
          durationInFrames={VIDEO.durationFrames}
          fps={VIDEO.fps}
          width={1080}
          height={1920}
        />
      </Folder>

      <Folder name="03-Firma-Digital">
        <Composition
          id="FirmaDigital-Feed"
          component={FirmaDigitalVideo}
          durationInFrames={1800}
          fps={30}
          width={1080}
          height={1350}
        />
      </Folder>

      <Folder name="04-Gestor-Documental">
        <Composition
          id="GestorDocumental-Feed"
          component={GestorDocumentalVideo}
          durationInFrames={1800}
          fps={30}
          width={1080}
          height={1350}
        />
      </Folder>
    </>
  );
};
