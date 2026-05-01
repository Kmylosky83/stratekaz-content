# StrateKaz Branding Skill — Instalación y uso

Skill completa para que Claude Code aplique el lenguaje visual y de motion de StrateKaz en todos los videos del proyecto `stratekaz-content`.

## Estructura

```
stratekaz-branding/
├── SKILL.md                           ← Punto de entrada (dispatcher)
├── README.md                          ← Este archivo
├── references/
│   ├── colors.md                      ← Paleta + reglas de uso
│   ├── typography.md                  ← Sistema Montserrat + Inter
│   ├── motion-language.md             ← Gramática de movimiento
│   ├── composition-rules.md           ← Safe zones, layouts, espaciado
│   ├── voice-and-tone.md              ← Voz de marca y copy
│   ├── do-and-dont.md                 ← Checklist pre-render
│   └── theme-decision.md              ← Cuándo dark vs light
└── examples/
    ├── intro-bumper.md                ← Patrón de intros de marca
    ├── service-explainer.md           ← Patrón de videos FD/GD
    └── data-reveal.md                 ← Patrón de normas y datos
```

## Instalación

### Opción A: Manual (recomendada para entender el flujo)

1. Copia toda la carpeta `stratekaz-branding/` dentro de `stratekaz-content/skills/`
2. La estructura final debe ser:
   ```
   stratekaz-content/
   └── skills/
       ├── remotion-best-practices/    ← Ya existente
       └── stratekaz-branding/         ← Recién copiada
   ```
3. (Opcional) Actualiza `skills-lock.json` si tu proyecto lo requiere
4. Reinicia Claude Code en la terminal:
   ```bash
   exit
   claude
   ```

### Opción B: Pidiéndoselo a Claude Code

En Claude Code, ejecuta:

```
Quiero crear una nueva skill llamada stratekaz-branding en la carpeta skills/. Te voy a pasar 11 archivos de markdown y necesito que crees la estructura de carpetas y los archivos exactamente como te los doy. La estructura debe ser:

skills/stratekaz-branding/
├── SKILL.md
├── README.md
├── references/
│   ├── colors.md
│   ├── typography.md
│   ├── motion-language.md
│   ├── composition-rules.md
│   ├── voice-and-tone.md
│   ├── do-and-dont.md
│   └── theme-decision.md
└── examples/
    ├── intro-bumper.md
    ├── service-explainer.md
    └── data-reveal.md

Voy a pasarte cada archivo uno por uno. Empezamos con SKILL.md.
```

Luego le pasas los archivos uno por uno copiando su contenido.

## Activación

Una vez instalada, la skill se activa **automáticamente** cuando Claude Code lea el `SKILL.md` y vea su `description`. Para forzar la activación al inicio de una sesión:

```
Lee skills/stratekaz-branding/SKILL.md y aplica sus reglas a partir de ahora en todo el proyecto.
```

## Uso típico

### Crear un intro de marca
```
Quiero crear el intro de marca StrateKaz que diseñamos. Carga la skill stratekaz-branding y sigue el patrón en examples/intro-bumper.md.
```

### Crear un nuevo video de servicio
```
Quiero crear un video explicando el servicio SG-SST. Sigue el patrón en skills/stratekaz-branding/examples/service-explainer.md y aplica las reglas de marca.
```

### Validar un componente existente
```
Lee skills/stratekaz-branding/references/do-and-dont.md y revisa src/scenes/firma-digital/FDHookScene.tsx. Dime qué anti-patrones tiene y propón correcciones.
```

### Cambiar el tema de un video
```
Lee skills/stratekaz-branding/references/theme-decision.md. Quiero convertir el video gestor-documental de light a dark mode. Sigue las reglas para hacerlo correctamente.
```

## Filosofía de la skill

Esta skill no es decorativa: es un **sistema de validación y aceleración**.

- **Validación:** Cada archivo tiene anti-patrones explícitos. Claude Code los detecta y corrige.
- **Aceleración:** Cada archivo tiene patrones premium ya codificados. Claude Code los reutiliza en lugar de inventar.
- **Coherencia:** Garantiza que TODOS los videos del proyecto se sienten parte del mismo sistema visual.

## Versión

v1.0 — Creada conjuntamente con el director de orquesta (Claude del chat web) para el proyecto `stratekaz-content` de StrateKaz · Consultoría 4.0.
