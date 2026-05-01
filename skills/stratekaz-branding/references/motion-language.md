# Motion Language — La firma de movimiento StrateKaz

## Filosofía

> El movimiento en StrateKaz **no es decoración, es lenguaje**. Cada animación debe comunicar algo: jerarquía, causalidad, emoción, transición. Un fade-in plano dice "no me importó". Un spring stagger dice "esto fue diseñado".

## Reglas inmutables

1. **TODA animación se conduce con `useCurrentFrame()`** — nunca CSS animations, nunca Tailwind animations, nunca librerías de animación CSS-based.
2. **Animaciones en segundos, multiplicadas por `fps`** — así el código es portátil entre 30fps y 60fps.
3. **Mínimo 18 frames (0.6s a 30fps) por elemento en pantalla** — menos no se percibe.
4. **Ningún elemento entra con fade plano** — siempre con carácter (spring, blur, path drawing, scale).

## Patrones de marca StrateKaz

### Pattern 1: Spring stagger letter-by-letter
**Cuándo:** Títulos hero, palabra clave de marca, reveals dramáticos.

```tsx
const letters = text.split("");

return letters.map((letter, i) => {
  const letterFrame = frame - (i * STAGGER_FRAMES); // STAGGER_FRAMES = 3
  const progress = spring({
    frame: letterFrame,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const blur = interpolate(progress, [0, 1], [20, 0], { extrapolateLeft: "clamp" });
  const translateY = interpolate(progress, [0, 1], [40, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <span key={i} style={{
      display: "inline-block",
      filter: `blur(${blur}px)`,
      transform: `translateY(${translateY}px)`,
      opacity,
      whiteSpace: "pre",  // preservar espacios
    }}>
      {letter}
    </span>
  );
});
```

**Variante "az" (signature de marca):** Las últimas letras (`az` en `StrateKaz`) entran con `damping: 8` (más bouncy) y desde escala 0.6, mientras el resto del nombre usa `damping: 12`.

### Pattern 2: SVG path drawing
**Cuándo:** Líneas de marca, subrayados, conectores entre elementos, reveals lineales.

```tsx
const pathLength = 1000; // en unidades de path
const drawProgress = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
  easing: Easing.inOut(Easing.cubic),
});

return (
  <svg width="100%" height="4">
    <line
      x1="0" y1="2" x2="100%" y2="2"
      stroke={BRAND.primary}
      strokeWidth="4"
      strokeDasharray={pathLength}
      strokeDashoffset={pathLength * (1 - drawProgress)}
      strokeLinecap="round"
    />
  </svg>
);
```

**Variante con flecha:** Termina el path con un triángulo que aparece cuando `drawProgress > 0.95`.

### Pattern 3: Heartbeat pulse (signature de cierre)
**Cuándo:** Final de un intro, cierre de una escena clave, último frame del logo.

```tsx
const heartbeat = spring({
  frame: frame - PULSE_DELAY,
  fps,
  durationInFrames: 30,
  config: { damping: 8, stiffness: 200 },
});
const scale = 1 + (heartbeat * 0.02 - heartbeat * heartbeat * 0.01);
// Sutil: sube a 1.02 y vuelve a 1
```

**Regla:** El pulse final SIEMPRE se aplica al cierre del intro de marca. Es la "respiración" de StrateKaz.

### Pattern 4: Magenta glow halo
**Cuándo:** Detrás de elementos críticos (logo, palabra clave, CTAs).

```tsx
const glowOpacity = interpolate(frame, [GLOW_START, GLOW_PEAK, GLOW_END], [0, 0.6, 0.4]);
// Capa absoluta detrás del elemento principal
<div style={{
  position: "absolute",
  inset: 0,
  background: `radial-gradient(circle, ${BRAND.primary} 0%, transparent 60%)`,
  filter: "blur(80px)",
  opacity: glowOpacity,
  zIndex: -1,
}} />
```

### Pattern 5: Particle convergence
**Cuándo:** Inicio de un intro, simulación de "sistema despertando", caos a orden.

```tsx
// 12-20 partículas con posiciones iniciales aleatorias (deterministas con seed)
// Convergen al centro mediante interpolate del frame 0 al frame 30
const targetX = CENTER_X;
const startX = particleSeed.x; // posición inicial random
const x = interpolate(frame, [0, 30], [startX, targetX], {
  easing: Easing.inOut(Easing.cubic),
  extrapolateRight: "clamp",
});
```

**Importante:** usar seeds deterministas (no `Math.random()` directo) para que el render sea reproducible.

### Pattern 6: Fade-out con scale (cierre de escena)
**Cuándo:** Última frase de una escena antes del cut/transition.

```tsx
const exitProgress = interpolate(
  frame,
  [SCENE_END - 20, SCENE_END],
  [0, 1],
  { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
);
const scale = 1 - (exitProgress * 0.05); // sutil: solo 5% de escala
const opacity = 1 - exitProgress;
```

## Configuraciones de spring por contexto

```tsx
// Smooth, sin bounce — para reveals técnicos, datos, UI
const smooth = { damping: 200 };

// Snappy con leve bounce — para tags, chips, elementos secundarios
const snappy = { damping: 20, stiffness: 200 };

// Bouncy — para signature elements (la "az" del logo, CTAs hero)
const bouncy = { damping: 8, stiffness: 100 };

// Heavy — para elementos grandes que entran con peso
const heavy = { damping: 15, stiffness: 80, mass: 2 };
```

## Easings preferidos

```tsx
import { Easing } from "remotion";

// Para reveals progresivos lineales (path drawing, contadores)
easing: Easing.inOut(Easing.cubic)

// Para entradas suaves
easing: Easing.out(Easing.quad)

// Para salidas anticipadas
easing: Easing.in(Easing.quad)

// Para movimientos cinematográficos custom
easing: Easing.bezier(0.16, 1, 0.3, 1) // "swift-out" elegante
```

## Transiciones entre escenas

**Estándar:** `TransitionSeries` con `fade` de 15 frames (0.5s).

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={210}>
    <SceneOne />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  <TransitionSeries.Sequence durationInFrames={530}>
    <SceneTwo />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

**Para intros/bumpers cortos (<10s):** El intro completo puede ser una sola escena sin transitions internas. Las transitions son para videos largos con cambios de tema.

## Anti-patrones de motion

❌ **Fade-in plano sin escala/blur/translate** — sin carácter, parece template
❌ **CSS transitions o animations** — Remotion no las renderiza correctamente
❌ **`Math.random()` dentro de componentes animados** — render no determinista
❌ **Animaciones >60 frames sin payoff visual** — aburrido, alargado
❌ **Stagger demasiado rápido (<2 frames entre elementos)** — caótico, ilegible
❌ **Múltiples animaciones simultáneas competidoras** — el ojo no sabe dónde mirar
❌ **Sin easing (linear) en interpolate de duración >15 frames** — robótico
❌ **Pulse/breathe loops infinitos** — distrae del contenido. Usa pulse solo en cierres.
❌ **Bounce excesivo (`damping < 6`)** — caricaturesco, poco serio
