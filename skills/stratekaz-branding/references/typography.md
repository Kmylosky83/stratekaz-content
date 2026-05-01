# Tipografía — Sistema StrateKaz

## Familias

Definidas en `src/constants.ts`:

```ts
FONTS.heading = "'Montserrat', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
FONTS.body    = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
```

**Importa siempre desde `constants.ts`. Nunca declares fuentes nuevas inline.**

## Carga de fuentes en Remotion

Antes de usar Montserrat o Inter, asegúrate de cargarlas con `@remotion/google-fonts`:

```tsx
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const { fontFamily: montserrat } = loadMontserrat("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
});
const { fontFamily: inter } = loadInter("normal", {
  weights: ["300", "400", "500", "600", "700"],
});
```

Si no usas la API de Google Fonts de Remotion, las fuentes deben estar en `public/fonts/` y cargarse con `staticFile()`.

## Sistema escalar (1080×1920)

Estos tamaños están calibrados para video vertical mobile-first:

| Rol | Tamaño (px) | Familia | Peso | Tracking | Line height |
|---|---|---|---|---|---|
| Hero / Cover | 128 | Montserrat | 800 / 900 | -2% | 1.0 |
| Title primario | 96 | Montserrat | 800 | -1% | 1.05 |
| Title secundario | 72 | Montserrat | 700 | 0 | 1.1 |
| Subtitle | 56 | Montserrat | 600 | 0 | 1.15 |
| Body grande | 44 | Inter | 500 | 0 | 1.3 |
| Body normal | 36 | Inter | 400 | 0 | 1.4 |
| Caption | 28 | Inter | 500 | +5% | 1.3 |
| Label / Tag | 24 | Inter | 600 | +10% (UPPERCASE) | 1.0 |
| Footnote | 20 | Inter | 400 | 0 | 1.4 |

Para Feed (1080×1350) reduce todos los valores en ~15% (multiplicar por 0.85).

## Reglas de jerarquía

### Regla 1: Tres niveles máximos por escena
Una escena debe tener máximo **3 niveles tipográficos visibles simultáneamente** (ej: hero + body + label). Más niveles = ruido visual.

### Regla 2: Saltos de tamaño grandes
Entre niveles consecutivos debe haber un salto **mínimo de 1.5x** en tamaño. Ej: 96 → 56 (1.7x ✅), no 96 → 80 (1.2x ❌).

### Regla 3: Peso heavy = Montserrat
Cualquier texto con peso ≥700 usa Montserrat. Inter no tiene la misma personalidad en pesos heavy.

### Regla 4: Body siempre Inter
Cualquier texto descriptivo, párrafos, captions, labels — siempre Inter. Montserrat es solo para títulos y hero.

### Regla 5: Tracking en labels
Los labels en uppercase deben tener `letter-spacing: 0.1em` mínimo. Sin tracking, el uppercase se ve apretado y barato.

## Técnicas tipográficas premium

### Highlight de palabra clave
En títulos de varias palabras, una palabra puede ser el "hero word" en `BRAND.primary`:

```tsx
<h1 style={{ color: BRAND.white }}>
  Sistemas que <span style={{ color: BRAND.primary }}>piensan</span>
</h1>
```

**Regla:** Solo UNA palabra hero por título. Si todo es magenta, nada es magenta.

### Tags / chips para normas
Para identificar normas (ISO, leyes, decretos):

```tsx
<span style={{
  fontSize: 24,
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: BRAND.iso9001,
  border: `2px solid ${BRAND.iso9001}`,
  borderRadius: 4,
  padding: "8px 16px",
  fontFamily: FONTS.body,
}}>
  ISO 9001
</span>
```

### Texto monoespaciado para datos
Para porcentajes, fechas, números grandes — considera tabular nums:

```tsx
fontVariantNumeric: "tabular-nums"
```

Esto evita que los números "salten" durante una animación de conteo.

## Animación tipográfica — Patrones de marca

### Pattern A: Letter stagger con blur reverso (signature StrateKaz)
Cada letra entra individualmente con spring + blur que va de 20px → 0px:

```tsx
const letters = "StrateKaz".split("");

letters.map((letter, i) => {
  const progress = spring({
    frame: frame - (i * 3),  // stagger 3 frames por letra
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const blur = interpolate(progress, [0, 1], [20, 0]);
  const translateY = interpolate(progress, [0, 1], [40, 0]);
  return (
    <span style={{
      display: "inline-block",
      filter: `blur(${blur}px)`,
      transform: `translateY(${translateY}px)`,
      opacity: progress,
    }}>
      {letter}
    </span>
  );
});
```

### Pattern B: Materialize (escala + opacity)
Para taglines, frases cortas:

```tsx
const scale = spring({ frame: frame - delay, fps, config: { damping: 200 } });
const opacity = interpolate(progress, [0, 0.5, 1], [0, 0, 1]);
```

### Pattern C: Typewriter (ya implementado)
Para texto que simula código o data — usa el componente `TypewriterText` ya existente en `src/components/`.

## Anti-patrones tipográficos

❌ Usar Inter o Roboto solo (sin Montserrat) — pierde personalidad
❌ Mezclar más de 2 familias tipográficas — siempre solo Montserrat + Inter
❌ Pesos light (300) en títulos — falta de autoridad
❌ Italics — no son parte del sistema StrateKaz
❌ All caps en cuerpo de texto — usa solo en labels cortos
❌ Texto centrado en bloques largos — alinea a izquierda excepto en hero
❌ Line-height < 1.2 en body — ilegible
❌ Tracking 0 en uppercase — apretado, barato
❌ Animación letra-por-letra demasiado rápida (<2 frames stagger) — ilegible
