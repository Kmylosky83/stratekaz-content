# Theme Decision — Cuándo usar Dark vs Light

StrateKaz es un híbrido inteligente. La skill decide qué tema usar según el contenido.

## Árbol de decisión

```
¿Qué tipo de video estás creando?

├── Intro / Bumper de marca
│   └── DARK (cinematográfico, autoridad)
│
├── Storytelling emocional / Caso de éxito narrativo
│   └── DARK (drama, profundidad)
│
├── Demo de producto / Funcionalidad
│   └── LIGHT (claridad, mostrar UI)
│
├── Explicación didáctica de norma/ley
│   ├── ¿Es una norma de alto impacto/riesgo (SST, accidentes)?
│   │   └── DARK con amber accents (autoridad, urgencia)
│   └── ¿Es una norma de proceso/calidad/ambiental?
│       └── LIGHT (didáctica, clara)
│
├── Datos numéricos prominentes / Stats
│   └── DARK (los números brillan, magenta + amber resaltan)
│
├── Testimonio / Caso de cliente
│   └── LIGHT (frescura, confianza, humano)
│
├── Comparativa / Antes vs Después
│   └── LIGHT con dark accents (contraste claro)
│
├── Anuncio de servicio nuevo
│   └── DARK (impacto, lanzamiento)
│
└── Tutorial / Paso a paso técnico
    └── LIGHT (fácil de seguir, no fatiga visual)
```

## Reglas de coherencia

### Regla 1: Un tema por video
**No mezcles** dark y light dentro del mismo video. Es una decisión por composición, no por escena.

### Regla 2: Logos según tema
- Dark mode → `logo-light.png` (logo en blanco/claro)
- Light mode → `logo-dark.png` (logo en negro/oscuro)
- `logo.svg` → versátil, puede usarse en ambos pero respetando contraste

### Regla 3: Música según tema
- Dark mode: música más densa, atmosférica, volumen 0.5-0.6
- Light mode: música más ligera, energética, volumen 0.4-0.5

### Regla 4: Particle networks
- Dark mode: particles magenta + amber sobre fondo oscuro, opacity 0.12
- Light mode: particles magenta light sobre fondo blanco, opacity 0.08 (más sutiles)

## Implementación técnica

Cuando un componente debe ser theme-aware, recibe un prop `theme`:

```tsx
type Theme = "dark" | "light";

type SceneProps = {
  theme: Theme;
};

const scene = ({ theme }: SceneProps) => {
  const bg = theme === "dark" ? BRAND.bgDeep : BRAND.white;
  const text = theme === "dark" ? BRAND.white : BRAND.bgCard;
  const muted = theme === "dark" ? BRAND.textMuted : "rgba(10, 10, 10, 0.7)";
  // ...
};
```

Para evitar duplicar código, considera crear un helper:

```tsx
// src/lib/theme.ts
export const themeTokens = (theme: "dark" | "light") => ({
  bg: theme === "dark" ? BRAND.bgDeep : BRAND.white,
  bgSurface: theme === "dark" ? BRAND.bgSurface : "#f9fafb",
  text: theme === "dark" ? BRAND.white : BRAND.bgCard,
  textMuted: theme === "dark"
    ? BRAND.textMuted
    : "rgba(10, 10, 10, 0.7)",
  textSubtle: theme === "dark"
    ? BRAND.textSubtle
    : "rgba(10, 10, 10, 0.5)",
  // primary/amber se mantienen iguales en ambos
  primary: BRAND.primary,
  amber: BRAND.amber,
});
```

## Decisión por defecto

**Si no estás seguro: usa DARK.** El dark mode es la firma cinematográfica de StrateKaz y nos diferencia de las consultoras que abusan del light por default.

## Casos especiales

### Video con varias variantes
Cuando un mismo concepto debe existir en ambos temas (ej: intro de marca), genera **2 composiciones registradas en Root**:
- `[Nombre]-Stories-Dark`
- `[Nombre]-Stories-Light`
- (opcional) `[Nombre]-Feed-Dark`
- (opcional) `[Nombre]-Feed-Light`

Esto le da al equipo de marketing flexibilidad para elegir según el contexto del post.

### Light mode no es "dark mode invertido"
No basta con cambiar `bg: dark → light` y `text: white → black`. Hay que ajustar:
- Particle opacity (más sutil en light)
- Glow intensity (menor en light, el blur magenta se ve diferente sobre blanco)
- Sombras (más pronunciadas en light, sutiles en dark)
- Contraste de colores ISO (mantener legibilidad)

Trata cada tema como un diseño completo, no como la negación del otro.
