// brand/fonts.ts
// Carga centralizada de Google Fonts para StrateKaz.
//
// Uso:
//   import { loadBrandFonts } from "../brand/fonts";
//   const { montserrat, inter } = loadBrandFonts();
//   // usar montserrat.fontFamily, inter.fontFamily en estilos
//
// Esto reemplaza la carga ad-hoc dentro de scenes individuales.

import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export type LoadedFont = {
  fontFamily: string;
  waitUntilDone: () => Promise<void>;
};

/**
 * Carga las fuentes de marca StrateKaz (Montserrat + Inter).
 * Devuelve los handles para `fontFamily` y `waitUntilDone`.
 *
 * Llamar a este helper a nivel de módulo (top-level) en cualquier scene
 * que use tipografía de marca. Remotion deduplica las cargas internamente.
 */
export const loadBrandFonts = (): {
  montserrat: LoadedFont;
  inter: LoadedFont;
} => {
  const montserrat = loadMontserrat();
  const inter = loadInter();
  return {
    montserrat: {
      fontFamily: montserrat.fontFamily,
      waitUntilDone: montserrat.waitUntilDone,
    },
    inter: {
      fontFamily: inter.fontFamily,
      waitUntilDone: inter.waitUntilDone,
    },
  };
};
