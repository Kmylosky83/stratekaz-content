# Do & Don't — Checklist de validación pre-render

Antes de renderizar cualquier video StrateKaz, **revisa esta lista completa**. Si encuentras un ❌, corrige antes de seguir.

## ✅ Pre-render checklist

### Color
- [ ] Todos los colores se importan desde `BRAND` en `constants.ts`
- [ ] No hay hex hardcodeados (excepto rgba calculados)
- [ ] Magenta `#ec268f` ocupa máximo 15% del frame en cualquier momento
- [ ] No hay gradientes morado→rosa
- [ ] El fondo dark mode usa radial gradient, no sólido plano
- [ ] Si hay normas ISO en pantalla, cada una tiene su color semántico correcto
- [ ] Contraste texto/fondo mínimo 4.5:1

### Tipografía
- [ ] Solo Montserrat y/o Inter (importadas desde `FONTS` constant)
- [ ] Las fuentes están cargadas con `@remotion/google-fonts` o `staticFile()`
- [ ] Máximo 3 niveles tipográficos visibles simultáneamente
- [ ] Saltos de tamaño entre niveles ≥1.5x
- [ ] Pesos heavy (≥700) usan Montserrat
- [ ] Body usa Inter
- [ ] Labels uppercase tienen `letter-spacing ≥0.1em`
- [ ] Title case en hero (no ALL CAPS, no Title Case)

### Motion
- [ ] Todas las animaciones usan `useCurrentFrame()` + `interpolate()` o `spring()`
- [ ] No hay CSS transitions ni CSS animations
- [ ] No hay clases de animación de Tailwind (`animate-pulse`, etc.)
- [ ] Duraciones expresadas como `seconds * fps`, no en frames mágicos
- [ ] Ningún elemento dura menos de 18 frames en pantalla
- [ ] Ningún elemento entra con fade plano (siempre con carácter)
- [ ] Stagger entre letras ≥3 frames
- [ ] Springs tienen config explícita (no usar default sin pensar)
- [ ] No hay `Math.random()` en componentes (seeds deterministas)
- [ ] No hay loops infinitos de pulse/breathe (solo en cierre)

### Composición
- [ ] Texto crítico respeta `SAFE.top`, `SAFE.bottom`, `SAFE.sides`
- [ ] Hero element posicionado en zona áurea (~38% desde arriba)
- [ ] Máximo 5 elementos visibles simultáneamente
- [ ] Espacio negativo ≥40% del frame
- [ ] Alineación intencional (no todo centrado por default)
- [ ] Z-index conceptual respetado (fondo → glow → contenido → overlay)

### Audio (si aplica)
- [ ] Música arranca con fade-in (15 frames mínimo)
- [ ] Música termina con fade-out (30 frames mínimo)
- [ ] Volumen máximo 0.6
- [ ] Música no compite con narración o efectos importantes

### Copy
- [ ] Hero: máximo 5 palabras
- [ ] Sin frases de la banlist consultora
- [ ] Verbos en imperativo o presente activo
- [ ] Una sola idea por escena
- [ ] Normas referenciadas con año (ISO 9001:2015, Decreto 1072 de 2015)
- [ ] Sin emojis ni hashtags
- [ ] Sin signos de exclamación (excepto hooks específicos)
- [ ] Magenta highlight en máximo 1 palabra clave por título

### Estructura
- [ ] Composición registrada en `Root.tsx`
- [ ] Constantes del video en archivo `*-constants.ts` propio
- [ ] Background del video heredado o adaptado del componente reutilizable
- [ ] Transiciones entre escenas con `TransitionSeries` + fade ≥15 frames
- [ ] Duración total razonable (intros 5-10s, explainers 30-90s)

### Performance / Render
- [ ] Las imágenes se cargan con `<Img src={staticFile(...)}/>`
- [ ] No se usa `<img>` HTML nativo
- [ ] No se usa `background-image` CSS
- [ ] El logo PNG correcto según el tema (logo-light en dark mode, logo-dark en light mode)
- [ ] Dimensiones de composición correctas (1080×1920 o 1080×1350)
- [ ] FPS = 30 (consistente con el sistema)

## 🚫 Anti-patrones absolutos (rechazo automático)

Si Claude Code encuentra cualquiera de estos en código existente o nuevo, **debe corregirlos sin preguntar**:

1. `style={{ animation: "..." }}` → CSS animation prohibido
2. `transition: "all 0.3s"` → CSS transition prohibido
3. `className="animate-pulse"` → Tailwind animation prohibido
4. `<img src="..."/>` → debe ser `<Img>` de Remotion
5. `Math.random()` dentro de componentes → no determinista
6. Hex hardcodeado en lugar de `BRAND.[token]` → inconsistencia
7. Fuente que no sea Montserrat o Inter → fuera de marca
8. Texto en `SAFE.top` o `SAFE.bottom` → se corta en stories
9. Más de 1 palabra magenta en un título → pierde foco
10. Gradiente lineal `#8b5cf6 → #ec268f` → cliché AI

## 🎯 Patrones premium (señales de calidad)

Si tu código tiene estos elementos, vas por buen camino:

✅ Letter stagger con blur reverso en títulos hero
✅ SVG path drawing animado para líneas/subrayados
✅ Glow magenta con `filter: blur(60-80px)` detrás del hero element
✅ Particle network sutil (12-20 partículas, opacity ≤0.15)
✅ Heartbeat pulse final en intros (1 → 1.02 → 1)
✅ Springs con configs específicas según contexto (smooth/snappy/bouncy)
✅ Easing custom Bezier en interpolaciones cinematográficas
✅ Asimetría intencional en composición
✅ Tags ISO con border + color semántico
✅ Tipografía con jerarquía clara y saltos generosos

## Workflow de validación

Cuando termines un componente o escena nueva:

1. **Lee** el componente completo
2. **Pasa** este checklist mentalmente
3. **Identifica** anti-patrones y corrígelos
4. **Confirma** los patrones premium presentes
5. **Renderiza** y revisa visualmente

Si quieres que el director de orquesta (Claude del chat web) revise un componente, comparte el código y este checklist. Él dará feedback estructurado.
