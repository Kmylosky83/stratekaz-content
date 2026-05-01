# Color — Sistema cromático StrateKaz

## Fuente única de verdad

Todos los colores viven en `src/constants.ts` bajo el export `BRAND`. **Importa siempre desde ahí**:

```tsx
import { BRAND } from "../constants"; // o ../../constants según ubicación
```

Nunca hardcodear hex en componentes excepto para overlays semitransparentes calculados (ej: `rgba(0,0,0,0.4)` para un scrim).

## Paleta completa con reglas de uso

### Magenta — El protagonista único

| Token | Hex | Cuándo usar |
|---|---|---|
| `BRAND.primary` | `#ec268f` | Acentos críticos, CTAs, palabra clave del título, línea de marca, "az" del logo |
| `BRAND.primaryHover` | `#db2777` | Estados hover, gradientes sutiles del primary |
| `BRAND.primaryDark` | `#be185d` | Sombras del magenta, profundidad en glows |
| `BRAND.primaryLight` | `#f9a8d4` | Magenta suave para particles light mode, highlights sutiles |
| `BRAND.primarySubtle` | `#fdf2f8` | Fondos magenta extra-suaves (light mode), apenas perceptible |

**Regla del 15%:** El magenta primary nunca debe ocupar más del 15% del área del frame en un momento dado. Si necesitas más presencia magenta, usa `primaryLight` o `primarySubtle`.

**Magenta en glow:** Para auras y halos detrás de elementos clave usa `BRAND.primary` con `filter: blur(60px)` y opacity 0.4-0.6.

### Backgrounds — La autoridad

| Token | Hex | Cuándo usar |
|---|---|---|
| `BRAND.bgDeep` | `#030712` | Fondo más profundo del dark mode (no es negro absoluto, mantiene un azul mínimo) |
| `BRAND.bgCard` | `#0a0a0a` | Cards/superficies sobre el fondo |
| `BRAND.bgSurface` | `#111827` | Capa media, elemento radial gradient base |
| `BRAND.bgElevated` | `#1f2937` | Elementos elevados, cards prominentes |

**Regla:** En dark mode usa siempre `radial-gradient` de `bgSurface` a `bgDeep`, nunca un sólido plano. Esto da la "atmósfera cinematográfica".

### Texto

| Token | Valor | Uso |
|---|---|---|
| `BRAND.white` | `#ffffff` | Títulos hero, texto crítico sobre dark |
| `BRAND.textMuted` | `rgba(255,255,255,0.7)` | Body text sobre dark, sutilmente atenuado |
| `BRAND.textSubtle` | `rgba(255,255,255,0.5)` | Captions, labels, metadata |

**En light mode** invertir: usar negros con la misma escala de opacidad. No existen tokens explícitos para text-dark — usar `BRAND.bgCard` como negro elegante o calcular con opacity.

### Acento Amber

| Token | Hex | Cuándo usar |
|---|---|---|
| `BRAND.amber` | `#f59e0b` | Highlights de datos importantes, números clave, contraste con magenta |
| `BRAND.amberLight` | `#fcd34d` | Versión suave para fondos amber |

**Regla:** El amber es el **segundo color de marca**. Úsalo como contrapeso del magenta cuando necesites llamar la atención sobre datos (números, porcentajes, fechas). Nunca uses amber y magenta saturados en el mismo elemento — alterna.

### Colores ISO (uso restringido)

Estos colores tienen un significado semántico fijo. **NO los uses para nada que no sea identificar la norma correspondiente**:

| Token | Hex | Norma |
|---|---|---|
| `BRAND.iso9001` | `#3b82f6` | Calidad |
| `BRAND.iso14001` | `#22c55e` | Ambiental |
| `BRAND.iso45001` | `#ef4444` | SST |
| `BRAND.iso27001` | `#8b5cf6` | InfoSec |

Cuando aparezca una ISO en pantalla, su tag/badge usa el color correspondiente. Esto crea un código visual que el espectador aprende y reconoce.

### Status (uso semántico)

| Token | Hex | Uso |
|---|---|---|
| `BRAND.success` | `#22c55e` | Confirmaciones, completado |
| `BRAND.warning` | `#f59e0b` | Alertas, atención |
| `BRAND.danger` | `#ef4444` | Errores, riesgos críticos |
| `BRAND.info` | `#3b82f6` | Información neutral |

## Decisión Dark vs Light

| Contenido | Tema recomendado | Razón |
|---|---|---|
| Intro/bumper de marca | Dark | Impacto cinematográfico |
| Storytelling emocional | Dark | Drama, autoridad |
| Demos de producto/funcionalidad | Light | Claridad técnica |
| Explicación de normas/leyes | Light | Didáctica, transparencia |
| Datos numéricos prominentes | Dark con amber accent | Los números brillan |
| Testimonios o casos de éxito | Light | Frescura, confianza |

Cuando hay duda, default a **dark mode**.

## Anti-patrones cromáticos

❌ Gradientes morado→rosa (`#8b5cf6` → `#ec268f`) — cliché Canva/AI, lo usan TODAS las consultoras
❌ Negro absoluto `#000000` como fondo — pierde profundidad, usa `BRAND.bgDeep`
❌ Magenta saturado en >25% del frame — abruma, satura
❌ Más de 3 colores saturados simultáneamente — caos visual
❌ Amber + colores ISO juntos sin jerarquía — semánticamente confuso
❌ Texto blanco puro sobre magenta `#ec268f` — contraste insuficiente, usa amber o rosa más claro

## Patrones premium

✅ Magenta como punto único de fuga visual sobre dark mode
✅ Amber acentos en datos numéricos
✅ Gradientes radiales sutiles bgSurface→bgDeep para profundidad
✅ Glows magenta con `filter: blur(60px)` detrás de elementos clave
✅ Light mode con negro elegante (`#0a0a0a`) sobre blanco puro, magenta como único acento
