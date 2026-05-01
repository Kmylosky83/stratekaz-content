# Composition Rules — Reglas de composición espacial

## Formatos soportados

| Formato | Dimensiones | Uso | Plataforma |
|---|---|---|---|
| Stories | 1080×1920 (9:16) | Stories, Reels, TikTok | Instagram, Facebook, TikTok |
| Feed | 1080×1350 (4:5) | Feed posts | Instagram, LinkedIn |
| Square | 1080×1080 (1:1) | Solo si se solicita explícitamente | Twitter, LinkedIn |

**Default:** Stories (1080×1920). Feed se genera como variante.

## Safe zones (Stories 1080×1920)

Definidas en `SAFE` constant en `src/constants.ts`:

```ts
SAFE = {
  top: 150,       // 150px desde el borde superior
  bottom: 170,    // 170px desde el borde inferior
  sides: 60,      // 60px desde cada lado
}
```

**Estas zonas son territorio de UI de plataforma:**
- Top 150px: nombre de usuario, perfil, "X horas" en stories
- Bottom 170px: barra de "Enviar mensaje", botón compartir, descripción
- Sides 60px: gestos swipe, controles

**Texto crítico, logos, datos numéricos: NUNCA fuera del área segura.**

## Safe zones (Feed 1080×1350)

Para Feed las safe zones son menos agresivas porque no hay UI superpuesta:

```ts
SAFE_FEED = {
  top: 80,
  bottom: 80,
  sides: 60,
}
```

## Grid de composición — Regla de tercios + golden ratio

Divide el frame en 3 zonas verticales (aproximación al rule of thirds):

| Zona | Stories (1920h) | Feed (1350h) | Uso típico |
|---|---|---|---|
| Zona superior | 150 → 700 | 80 → 540 | Tag/categoría, eyebrow text |
| Zona central (la del impacto) | 700 → 1300 | 540 → 920 | Hero text, logo, dato principal |
| Zona inferior | 1300 → 1750 | 920 → 1270 | Subtitle, CTA, label de cierre |

**Golden ratio:** El elemento principal idealmente se posiciona en el "punto áureo": 38% desde arriba (zona central alta). Eso es ~730px en Stories, ~510px en Feed.

## Espaciado vertical entre elementos

Sistema de 8 puntos:

| Categoría | Espacio (px) |
|---|---|
| Micro (tag → título) | 16 |
| Pequeño (título → subtítulo) | 32 |
| Medio (subtítulo → body) | 48 |
| Grande (sección → sección) | 80 |
| Hero (separación de bloques principales) | 120 |

## Alineación

- **Hero / Cover:** Texto centrado horizontalmente, posición vertical en zona áurea
- **Body / Explicaciones:** Alineación a la izquierda con margen de `SAFE.sides + 20`
- **CTAs:** Centrados horizontalmente
- **Labels/Tags:** Junto al elemento que describen (no en bordes)
- **Datos numéricos grandes:** Centrados, posición áurea

**Regla:** Centrar TODO se ve aburrido y simétrico. Mezcla alineaciones para crear dinamismo visual.

## Layering (z-index conceptual)

De atrás hacia adelante:

1. **Fondo base** — Radial gradient o sólido (z: 0)
2. **Background pattern** — Grid sutil, particles, noise (z: 1)
3. **Glows / Halos** — Magenta blur detrás de elementos clave (z: 5)
4. **Decoración secundaria** — Líneas SVG, formas geométricas (z: 10)
5. **Contenido principal** — Texto, logos, datos (z: 20)
6. **Overlay UI** — Tags, chips, badges (z: 30)
7. **Cursor/Toast efectos** — Notificaciones, cursor animado (z: 50)

## Padding del frame

Aplica al `<AbsoluteFill>` raíz un padding interno usando las safe zones:

```tsx
<AbsoluteFill style={{
  paddingTop: SAFE.top,
  paddingBottom: SAFE.bottom,
  paddingLeft: SAFE.sides,
  paddingRight: SAFE.sides,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}}>
  {/* contenido */}
</AbsoluteFill>
```

Esto garantiza que ningún elemento se salga de la zona segura.

## Densidad visual

**Regla del 60-30-10:**
- 60% del frame: respiración, fondo, espacio negativo
- 30% del frame: contenido principal (texto, logo, hero element)
- 10% del frame: acentos (magenta, amber, glows)

Frames sobrecargados (>50% contenido) se sienten amateur. La premium se logra con espacio.

## Anti-patrones de composición

❌ Texto pegado a los bordes del frame (sin respetar SAFE zones)
❌ Más de 5 elementos visibles simultáneamente
❌ Centrar todo (hero, body, label) — predecible y plano
❌ Esquinas vacías + centro saturado — desbalance
❌ Texto sobre imagen/particle sin scrim de contraste
❌ Logos en formatos inconsistentes (a veces izquierda, a veces derecha sin razón)
❌ Cambiar el sistema de alineación entre escenas del mismo video
❌ Densidad >60% en una sola escena

## Patrones premium

✅ Espacio negativo generoso, especialmente arriba y abajo del hero
✅ Asimetría intencional (hero ligeramente fuera del centro absoluto)
✅ Repetición consistente de posiciones entre escenas (logo siempre arriba-derecha, etc.)
✅ Elementos decorativos sutiles que crean profundidad sin competir
✅ Jerarquía clara: el ojo sabe siempre dónde mirar primero
