# Pattern: Data Reveal (normas, leyes, datos numéricos)

Pattern para revelar datos normativos y números clave de forma cinematográfica.

## Cuándo usar este pattern

- Mostrar una norma ISO con sus cláusulas
- Citar un decreto o resolución colombiana
- Datos estadísticos del sector (% de empresas, multas, sanciones)
- Comparativas pre/post reforma
- Conteo de items (estándares, artículos, requisitos)

## Pattern A: Norma ISO con cláusulas

### Estructura visual

```
[Tag uppercase con border]   ← color semántico de la ISO
ISO 9001:2015

[Título principal]
Cláusula por cláusula

[Lista de items con tag + descripción]
4.1 Contexto de la organización
4.2 Partes interesadas
4.3 Alcance del SGC
...
```

### Implementación

```tsx
// Tag de la norma
<div style={{
  display: "inline-block",
  border: `2px solid ${BRAND.iso9001}`,
  borderRadius: 4,
  padding: "8px 16px",
  fontSize: 24,
  fontWeight: 600,
  fontFamily: FONTS.body,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: BRAND.iso9001,
}}>
  ISO 9001:2015
</div>

// Cada cláusula entra con stagger
const clauses = [
  { num: "4.1", text: "Contexto de la organización" },
  { num: "4.2", text: "Partes interesadas" },
  // ...
];

clauses.map((c, i) => {
  const itemFrame = frame - START_FRAME - (i * 10);
  const progress = spring({
    frame: itemFrame,
    fps,
    config: { damping: 200 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateX = interpolate(progress, [0, 1], [-30, 0]);
  return (
    <div style={{
      opacity,
      transform: `translateX(${translateX}px)`,
      display: "flex",
      gap: 24,
      alignItems: "baseline",
      marginBottom: 16,
    }}>
      <span style={{
        fontFamily: FONTS.body,
        fontSize: 28,
        fontWeight: 700,
        color: BRAND.iso9001,
        fontVariantNumeric: "tabular-nums",
        minWidth: 80,
      }}>
        {c.num}
      </span>
      <span style={{
        fontFamily: FONTS.body,
        fontSize: 36,
        fontWeight: 500,
        color: BRAND.white,
      }}>
        {c.text}
      </span>
    </div>
  );
});
```

## Pattern B: Decreto/Resolución colombiana

### Estructura visual

```
[Eyebrow: tipo de norma]
DECRETO

[Número en grande]
1072

[Año]
de 2015

[Subtítulo: lo que regula]
Régimen Reglamentario del
Sector Trabajo · SG-SST
```

### Por qué funciona

- El **número grande** (1072) es el ancla mnemónica
- El **eyebrow** ("DECRETO") da contexto antes del número
- El **año** queda como dato secundario, no compite
- El **subtítulo** explica el alcance sin saturar

### Implementación

```tsx
<div style={{ textAlign: "center" }}>
  {/* Eyebrow */}
  <div style={{
    fontSize: 28,
    fontFamily: FONTS.body,
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: BRAND.primary,
    marginBottom: 16,
  }}>
    Decreto
  </div>

  {/* Número hero */}
  <div style={{
    fontSize: 240,
    fontFamily: FONTS.heading,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    color: BRAND.white,
    lineHeight: 0.9,
    fontVariantNumeric: "tabular-nums",
  }}>
    1072
  </div>

  {/* Año */}
  <div style={{
    fontSize: 36,
    fontFamily: FONTS.body,
    fontWeight: 400,
    color: BRAND.textMuted,
    marginTop: 16,
  }}>
    de 2015
  </div>

  {/* Subtítulo */}
  <div style={{
    fontSize: 32,
    fontFamily: FONTS.body,
    fontWeight: 500,
    color: BRAND.textMuted,
    marginTop: 48,
    lineHeight: 1.3,
  }}>
    Régimen Reglamentario del<br />
    Sector Trabajo · SG-SST
  </div>
</div>
```

### Animación recomendada

1. Eyebrow entra primero (frame 0-15) con fade + slight slide-up
2. Número hero entra (frame 10-40) con scale 0.8 → 1 + opacity 0 → 1
3. Año entra (frame 30-50) con fade simple
4. Subtítulo entra (frame 45-70) con materialize letter-by-letter

## Pattern C: Estadística impactante

### Estructura visual

```
[Número gigante con %]
97%

[Frase de contexto debajo]
de empresas fallan en el
numeral 7.5.3 de ISO 9001
```

### Implementación con conteo animado

```tsx
const targetValue = 97;
const countProgress = spring({
  frame: frame - START_FRAME,
  fps,
  durationInFrames: 30,
  config: { damping: 20 },
});
const currentValue = Math.round(countProgress * targetValue);

<div style={{
  fontSize: 320,
  fontFamily: FONTS.heading,
  fontWeight: 900,
  color: BRAND.primary,
  fontVariantNumeric: "tabular-nums",
  lineHeight: 0.9,
}}>
  {currentValue}%
</div>
```

**Detalle premium:** Cuando el contador llega al 97%, agregar un sutil heartbeat pulse al número.

## Pattern D: Comparativa antes/después (Reforma laboral)

### Layout horizontal split

```
┌──────────────┬──────────────┐
│   ANTES      │   DESPUÉS    │
│              │              │
│   75%        │   80%        │
│   (gris)     │   (magenta)  │
│              │              │
│   Recargo    │   Recargo    │
│   dominical  │   dominical  │
│   pre-reforma│   2025       │
└──────────────┴──────────────┘
```

### Implementación

- División vertical con línea SVG path-drawn entre ambos lados
- "Antes" en gris (`BRAND.textMuted`), "Después" en magenta
- Stagger: ANTES entra primero (frame 0-25), línea divisoria (25-40), DESPUÉS (40-65)

## Reglas de oro para data reveals

### Regla 1: Un dato por escena
No metas 5 estadísticas en 5 segundos. Cada dato merece su escena dedicada.

### Regla 2: Tabular nums siempre
```css
fontVariantNumeric: "tabular-nums"
```
Sin esto, los números "saltan" durante animaciones de conteo.

### Regla 3: Magenta o amber, nunca ambos
Cada dato hero usa UN solo color de acento. Magenta para datos de marca, amber para datos críticos/alertas.

### Regla 4: Contexto antes y después del número
- Eyebrow ANTES (qué tipo de dato es)
- Subtítulo DESPUÉS (qué significa)

Un número sin contexto es sólo un número.

### Regla 5: Citar la fuente
Si es posible, agregar al final con tipografía pequeña:
```
Fuente: Resolución 0312 de 2019
```

## Anti-patrones específicos de data reveals

❌ Múltiples números compitiendo en pantalla
❌ Números sin separadores de miles ("1000" en vez de "1.000")
❌ Porcentajes con decimales innecesarios ("97.34%")
❌ Inventar datos para impacto — pierde credibilidad si el espectador chequea
❌ Comparativas sin etiquetar cuál es cuál
❌ Animar números sin tabular nums (saltan)
❌ Color del dato no coordinado con la norma (ej: dato ISO 9001 en verde)
