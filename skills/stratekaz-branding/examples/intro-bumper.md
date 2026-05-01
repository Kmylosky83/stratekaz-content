# Pattern: Intro / Bumper de marca

Pattern para crear intros y bumpers de marca StrateKaz (3-7 segundos).

## Cuándo usar este pattern

- Apertura standalone de marca (post de presentación)
- Bumper insertable al inicio de cualquier video del proyecto
- Closer de marca al final de un video largo

## Estructura narrativa (5 actos en 5 segundos)

```
0.0s ──┬── Acto 1: Caos digital (particles convergen)
       │   Frames 0-18 — Particles magenta+amber convergen al centro
0.6s ──┤
       │── Acto 2: El trazo (línea SVG dibujada)
       │   Frames 18-42 — Línea vertical magenta se traza top→bottom
1.4s ──┤
       │── Acto 3: Construcción tipográfica (StrateK + az)
       │   Frames 36-84 — "StrateK" letter stagger blanco
       │                   "az" entra desde derecha con bounce magenta
       │                   Glow magenta detrás del "az"
2.8s ──┤
       │── Acto 4: Tagline reveal
       │   Frames 84-120 — "Consultoría 4.0" materializa
       │                    Línea horizontal magenta debajo (path drawing)
4.0s ──┤
       │── Acto 5: Firma final + heartbeat
       │   Frames 120-150 — Logo PNG fade-in arriba
       │                     Heartbeat pulse del conjunto
5.0s ──┴── FIN
```

## Especificaciones técnicas

| Parámetro | Valor |
|---|---|
| Duración | 150 frames (5s a 30fps) |
| FPS | 30 |
| Dimensiones default | 1080×1920 (Stories) |
| Variantes | + 1080×1350 (Feed) |
| Música | `public/music.mp3` con fade-in 15f y fade-out 30f |
| Volumen | 0.5 |
| Tema default | Dark |

## Composición en Root.tsx

Registra 4 variantes:

```tsx
<Composition
  id="StrateKazIntro-Stories-Dark"
  component={StrateKazIntro}
  durationInFrames={150}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{ theme: "dark" } satisfies StrateKazIntroProps}
/>
<Composition
  id="StrateKazIntro-Stories-Light"
  component={StrateKazIntro}
  durationInFrames={150}
  fps={30}
  width={1080}
  height={1920}
  defaultProps={{ theme: "light" } satisfies StrateKazIntroProps}
/>
<Composition
  id="StrateKazIntro-Feed-Dark"
  component={StrateKazIntro}
  durationInFrames={150}
  fps={30}
  width={1080}
  height={1350}
  defaultProps={{ theme: "dark" } satisfies StrateKazIntroProps}
/>
<Composition
  id="StrateKazIntro-Feed-Light"
  component={StrateKazIntro}
  durationInFrames={150}
  fps={30}
  width={1080}
  height={1350}
  defaultProps={{ theme: "light" } satisfies StrateKazIntroProps}
/>
```

## Estructura de archivos

```
src/scenes/intro-stratekaz/
├── is-constants.ts                # Timing y tokens del intro
├── StrateKazIntro.tsx             # Composición principal (orquestador)
├── ISBackground.tsx               # Fondo theme-aware con particles
├── ISActOneTwoScene.tsx           # Actos 1+2: caos + trazo (frames 0-42)
├── ISActThreeScene.tsx            # Acto 3: tipografía (frames 36-84)
└── ISActFourFiveScene.tsx         # Actos 4+5: tagline + firma (frames 84-150)
```

**Nota:** Combiné Actos 1+2 y 4+5 en componentes únicos por eficiencia y porque comparten estado visual.

## Decisiones de diseño clave

### Por qué particles convergen en lugar de aparecer
Las particles que convergen comunican "data caótica organizándose en sistema" — exactamente la tesis de StrateKaz como consultora.

### Por qué el trazo es vertical
La verticalidad sugiere "axis", "columna vertebral", "estructura". Una línea horizontal sería más editorial; vertical es arquitectónica.

### Por qué "az" tiene bounce y "StrateK" no
Diferencia visual = jerarquía narrativa. "StrateK" es base sólida (damping 12). "az" es la firma/cierre (damping 8 bouncy). Se siente como dos partes de una identidad, no una palabra plana.

### Por qué glow detrás del "az" y no del nombre completo
Foco visual. El "az" magenta es el punto de marca. Glow detrás de todo = ruido. Glow detrás del punto crítico = jerarquía.

### Por qué heartbeat al final
El cierre debe sentirse "vivo", no solo terminar. El pulse 1 → 1.02 → 1 le da respiración a la marca, como una firma manuscrita que pulsa antes de fijarse.

## Variaciones futuras

Una vez tengas el intro v1.0 funcionando, considera estas variantes:

- **3 segundos (90 frames):** Bumper compacto para insertarlo al inicio de FD/GD
- **7 segundos (210 frames):** Versión expandida con tagline más largo
- **Versión sin música:** Para insertar en videos que ya tienen audio propio
- **Versión con voz over:** Si tienes una voz de marca grabada

## Anti-patrones específicos del intro

❌ Logo PNG aparece al inicio en lugar del final → spoileas el reveal
❌ Tagline antes de la tipografía → orden narrativo incorrecto
❌ Particles siguen activas durante el tagline → distrae
❌ Música arranca en frame 0 → no acompaña el trazo (debería arrancar con el trazo)
❌ Heartbeat loops infinitos en lugar de 1 sola pulsación → cansa
❌ "StrateKaz" todo magenta → pierde el contraste de marca
