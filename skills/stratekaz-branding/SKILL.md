---
name: stratekaz-branding
description: Lenguaje visual y de marca para todos los videos StrateKaz creados con Remotion. Aplica SIEMPRE que se vaya a crear, modificar o renderizar un video del proyecto stratekaz-content. Cubre paleta cromática (magenta #ec268f como protagonista), sistema tipográfico (Montserrat + Inter), gramática de movimiento (spring stagger, blur reverso, SVG path drawing, heartbeat pulse), reglas de composición y safe zones, voz y tono de copys, y anti-patrones a evitar. Híbrido inteligente: dark mode cinematográfico para impacto y autoridad; light mode técnico para claridad y didáctica. La skill define cuándo usar cada modo según el tipo de contenido. Se diferencia explícitamente de las consultoras locales colombianas que usan fade-ins planos, stock photos y plantillas genéricas.
metadata:
  tags: stratekaz, branding, video, remotion, motion-design, identidad-visual
---

# StrateKaz Branding — Lenguaje Visual de Marca

Esta skill define el lenguaje visual y de motion de StrateKaz para videos creados con Remotion. **Léela siempre antes de tocar cualquier archivo de `src/scenes/` o `src/components/` del proyecto `stratekaz-content`.**

## Filosofía de marca (1 frase)

> StrateKaz es la consultora colombiana técnica que combina autoridad cinematográfica (dark, dramático) con claridad didáctica (light, transparente), rompiendo con la estética plana de las consultoras tradicionales mediante motion intencional, tipografía premium y sistemas visuales coherentes.

## Cuándo cargar cada referencia

Carga los archivos bajo demanda según la tarea. **No leas todo de golpe** — eficiencia ante todo.

| Tarea | Archivos a leer (en orden) |
|---|---|
| Crear un video desde cero | `references/colors.md` → `references/typography.md` → `references/motion-language.md` → `references/composition-rules.md` |
| Modificar colores en un video existente | `references/colors.md` |
| Diseñar una nueva escena con texto | `references/typography.md` + `references/motion-language.md` |
| Crear un intro/bumper de marca | `examples/intro-bumper.md` (carga este DESPUÉS de leer las references) |
| Crear un video explicativo de servicio (SG-SST, ISO, PESV, etc.) | `examples/service-explainer.md` |
| Mostrar datos normativos (ISOs, decretos, leyes) | `examples/data-reveal.md` |
| Escribir taglines, títulos o copy en pantalla | `references/voice-and-tone.md` |
| Validar antes de renderizar | `references/do-and-dont.md` (checklist obligatorio) |
| Decidir si usar dark o light mode | `references/theme-decision.md` |

## Reglas inmutables (aplican SIEMPRE)

Estas reglas son **no negociables**. Cualquier código que las viole debe rechazarse.

### Tipografía
- ✅ **SIEMPRE** usar `FONTS.heading` (Montserrat) o `FONTS.body` (Inter) desde `src/constants.ts`
- ❌ **NUNCA** introducir una fuente nueva sin actualizar `constants.ts` primero
- ❌ **NUNCA** usar Arial, Roboto, sans-serif genérico, Times New Roman, Comic Sans

### Color
- ✅ **SIEMPRE** importar colores desde `BRAND` en `src/constants.ts`
- ❌ **NUNCA** hardcodear valores hex en componentes (excepto para overlays semitransparentes calculados)
- ✅ Magenta `#ec268f` es el protagonista único. Máximo **15% del frame** en cualquier momento
- ❌ **NUNCA** usar gradientes morado→rosa (cliché AI/Canva)

### Motion
- ✅ **SIEMPRE** usar `useCurrentFrame()` + `interpolate()` o `spring()` para animaciones
- ❌ **NUNCA** usar CSS transitions, CSS animations, ni clases de animación de Tailwind
- ✅ Toda entrada de elemento debe tener carácter (spring stagger, blur reverso, path drawing). **Nunca un fade plano genérico**.
- ✅ Ningún elemento debe estar en pantalla menos de 18 frames (0.6s a 30fps)

### Composición
- ✅ **SIEMPRE** respetar `SAFE` zones (`top: 150`, `bottom: 170`, `sides: 60`) en formato 1080×1920
- ✅ Para Feed (1080×1350) ajustar safe zones proporcionalmente
- ❌ **NUNCA** colocar texto crítico en los primeros/últimos 150px verticales

### Audio
- ✅ Cuando se use música, aplicar fade-in (primeros 15 frames) y fade-out (últimos 30 frames)
- ✅ Volumen máximo 0.6 (música nunca compite con el contenido visual)

## Anti-patrones críticos (rechazar siempre)

Si Claude Code detecta cualquiera de estos en código existente o propuesto, debe corregirlos antes de continuar:

1. **Fade-in plano genérico** sin spring, blur o stagger → reemplazar por entrada con carácter
2. **Múltiples colores fuertes compitiendo** (más de 2 colores saturados >50% del frame) → priorizar uno
3. **Tipografía sin jerarquía clara** (todo el mismo tamaño/peso) → aplicar sistema escalar
4. **Cuts duros entre escenas** → usar `TransitionSeries` con fade de 15 frames mínimo
5. **Texto sobre fondo sin contraste suficiente** → ratio mínimo 4.5:1 (AA)
6. **Particle networks excesivos** (>20 partículas o opacidad >0.2) → mantener sutileza
7. **Animaciones que duran menos de 12 frames** (no se perciben) → mínimo 18 frames

## Estructura recomendada para nuevos videos

Siguiendo el patrón ya establecido en `src/scenes/firma-digital/` y `src/scenes/gestor-documental/`:

```
src/scenes/[nombre-video]/
├── [prefijo]-constants.ts          # Constantes del video específico
├── [Nombre]Video.tsx               # Composición principal con TransitionSeries
├── [Prefijo]Background.tsx         # Fondo adaptado al tema del video
└── [Prefijo][Escena]Scene.tsx      # Una por escena del storyboard
```

## Decisiones que requieren consulta

Antes de tomar estas decisiones, **pregunta al usuario**:

- Cambiar el color primary de la marca
- Introducir una fuente nueva
- Crear una composición con dimensiones distintas a 1080×1920 o 1080×1350
- Usar música distinta a `public/music.mp3`
- Crear un video con duración mayor a 90 segundos

## Versión

Skill v1.0 — Creada conjuntamente con el director de orquesta para el proyecto `stratekaz-content`.
