# Pattern: Service Explainer (videos como FD, GD, futuros servicios)

Pattern para videos que explican un servicio o módulo de StrateKaz (30-60 segundos).

## Cuándo usar este pattern

- Explicar un servicio de consultoría (SG-SST, ISO, PESV, SIG, etc.)
- Mostrar un módulo de producto (Firma Digital, Gestor Documental)
- Demo de funcionalidad nueva
- Casos de uso por industria

## Estructura narrativa estándar — 5 escenas

Modelo basado en los videos `firma-digital` y `gestor-documental` ya existentes:

```
1. HOOK (5-7s)        → Provocación, problema, dolor del cliente
2. CANVAS / DEMO      → Mostrar el "qué": la solución en pantalla (15-20s)
3. SECURITY / PILARES → Mostrar el "cómo": diferenciadores técnicos (12-16s)
4. WORKFLOW / CICLO   → Mostrar el "para qué": resultado/proceso (10-15s)
5. CTA (8-10s)        → Cierre con llamado a acción claro
```

**Total recomendado:** 50-70 segundos. Mobile = atención corta.

## Estructura de archivos

```
src/scenes/[nombre-servicio]/
├── [pre]-constants.ts             # Constantes específicas del video
├── [Nombre]Video.tsx              # Composición principal con TransitionSeries
├── [Pre]Background.tsx            # Fondo (light o dark según tema)
├── [Pre]HookScene.tsx             # Escena 1
├── [Pre][Demo]Scene.tsx           # Escena 2 (renombrar Demo según servicio)
├── [Pre][Pilares]Scene.tsx        # Escena 3
├── [Pre][Workflow]Scene.tsx       # Escena 4
└── [Pre]CTAScene.tsx              # Escena 5
```

**Convención de prefijos** (3 letras, en mayúsculas):
- FD = Firma Digital
- GD = Gestor Documental
- SST = Sistema Gestión SST
- SGI = Sistema Gestión Integrado
- PV = PESV
- RL = Reforma Laboral
- ISO9 = ISO 9001
- ISO14 = ISO 14001
- ISO45 = ISO 45001

## Decisión de tema según servicio

| Servicio | Tema recomendado | Razón |
|---|---|---|
| SG-SST | Dark con amber accents | Riesgo, urgencia, autoridad |
| ISO 9001 (Calidad) | Light | Didáctica, claridad |
| ISO 14001 (Ambiental) | Light con verde accent | Naturaleza, transparencia |
| ISO 45001 (SST) | Dark | Riesgo, gravedad |
| ISO 27001 (InfoSec) | Dark | Tech, ciberseguridad |
| PESV | Light | Educativo, prevención |
| SIG | Dark | Sistema integrado, autoridad |
| Firma Digital | Light (como ya existe) | Tech, claridad UI |
| Gestor Documental | Light (como ya existe) | UI, demo, claridad |
| Reforma Laboral | Dark | Cambio, urgencia |

## Hook — La escena más importante

El hook hace que el espectador no haga scroll. **Si el hook falla, el resto no importa.**

Estructuras de hook que funcionan:

### Hook 1: Dato impactante
```
"97% de empresas fallan
en el numeral 7.5.3"
```

### Hook 2: Pregunta provocadora
```
"¿Tu manual de calidad
sirve para algo?"
```

### Hook 3: Contradicción
```
"ISO 9001 NO es papelería.
Te explico."
```

### Hook 4: Tensión temporal
```
"60 días.
60 estándares mínimos."
```

### Hook 5: Antes/Después implícito
```
"Olvida el método anterior.
Esto es lo que sí funciona."
```

## Demo / Canvas — Mostrar, no contar

Si tu servicio es digital (producto), muestra **mockups de UI animados**:
- Cursor que clickea elementos
- Formularios que se llenan automáticamente
- Notificaciones tipo Toast (usa el componente `Toast` ya existente)
- Transiciones de pantalla a pantalla

Si tu servicio es consultoría, muestra **proceso visual**:
- Diagramas que se construyen
- Checklist de items que se van marcando
- Datos numéricos que cuentan ascendente
- Conexiones SVG entre conceptos

## Pilares / Security — 3 piezas, no 5

Los humanos retienen 3 ítems mejor que 5. Si tu servicio tiene "7 beneficios", **agrúpalos en 3 categorías**.

Layout sugerido para 3 pilares:
```
┌─────────────────────────────┐
│         Title (60px)         │
│                              │
│  ┌────┐  ┌────┐  ┌────┐    │
│  │ 01 │  │ 02 │  │ 03 │    │
│  │    │  │    │  │    │    │
│  └────┘  └────┘  └────┘    │
│                              │
│        Subtitle              │
└─────────────────────────────┘
```

Cada pilar entra con `spring stagger` (delay 8 frames entre cada uno).

## Workflow / Ciclo — Patrón visual

Patrones efectivos:
- **PHVA (Plan-Hace-Verifica-Actúa):** círculo con 4 cuadrantes que se iluminan secuencialmente
- **Timeline horizontal:** path drawing con hitos
- **Embudo (top-down):** 3-4 etapas con strokeDasharray animado
- **Ciclo infinito:** dos curvas SVG en loop sutil

## CTA — La acción única

Una sola acción. **No "agenda Y descarga Y sígueme"**.

Estructuras de CTA:

### CTA 1: Acción + tagline
```
"Agenda tu diagnóstico"
StrateKaz · Consultoría 4.0
```

### CTA 2: Pregunta abierta
```
"¿Empezamos?"
[handle / link]
```

### CTA 3: Recordatorio + acción
```
"Decreto 1072. 60 días.
Hablemos antes."
```

## Música y audio

- **Hook:** Música arranca o sube de volumen aquí (no antes)
- **Demo:** Sostenida, no compite con efectos UI
- **Pilares:** Pico de energía, máximo del beat
- **Workflow:** Sostenida o ligero descenso
- **CTA:** Resolución musical, fade-out 30f al final

Volumen recomendado: 0.4-0.5 (música nunca >0.6 en explainers).

## Transiciones entre escenas

Usa `TransitionSeries` con `fade` de 15 frames entre cada escena. Patrón ya implementado en `FirmaDigitalVideo.tsx`.

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={210}>
    <HookScene />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />
  {/* ... siguientes escenas */}
</TransitionSeries>
```

## Inserción del intro de marca

Si quieres que el video arranque con el bumper StrateKaz:

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={90}>
    <StrateKazIntroBumper compact />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition ... />
  <TransitionSeries.Sequence durationInFrames={210}>
    <HookScene />
  </TransitionSeries.Sequence>
  {/* ... */}
</TransitionSeries>
```

Versión `compact` del intro = 90 frames (3s) en lugar de 150.

## Anti-patrones específicos de explainers

❌ Hook genérico ("¿Sabías que...?", "En el mundo actual...")
❌ Demo que muestra TODO el producto en 5s → enfócate en 1 flow
❌ Pilares de 5+ items sin agrupar → memoria saturada
❌ Workflow lineal sin payoff visual al final
❌ CTA con 3 acciones simultáneas → parálisis
❌ Música que se pisa con narración o efectos
❌ Mezclar dark y light entre escenas del mismo video
❌ Cambiar tipografías o paleta entre escenas
