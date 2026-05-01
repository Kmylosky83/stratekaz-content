// brand/tokens.ts
// Single source of truth para tokens de marca StrateKaz.
//
// NOTA: Este archivo re-exporta los tokens desde ../constants para que
// (1) el código existente siga funcionando con `from '../../constants'`
// (2) el código nuevo pueda usar el path semántico `from '../../brand/tokens'`
//
// La intención a futuro es que constants.ts quede como re-export inverso
// y todo el código nuevo importe desde brand/.

export {
  BRAND,
  FONTS,
  SAFE,
  VIDEO,
  SCENES,
} from "../constants";
