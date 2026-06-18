# SIVOX — Comunicador AAC con IA Predictiva

**SIVOX** es un comunicador de comunicación aumentativa y alternativa (CAA/AAC) desarrollado por **XCAIL Technologies SAS**. Permite a personas con discapacidad motora componer y verbalizar mensajes mediante barrido automático por filas y celdas, con predicción de palabras en tiempo real.

> **URL actual:** `https://sivox.web.app` · **URL futura:** `https://sivox.app`

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Vite 6 + React 18 + TypeScript (strict) |
| Estado global | Zustand 5 |
| Estilos | Tailwind CSS 3 |
| PWA / Offline | vite-plugin-pwa + Workbox 7 |
| Routing | React Router v6 |
| Backend | Firebase Auth + Firestore + Hosting |
| IA (Fase 6) | Gemini `gemini-2.5-flash-lite` |
| TTS | Web Speech API → Google Cloud TTS Neural2 (Fase 7) |
| Deploy | Firebase Hosting (`sivox.web.app`) |

---

## Comandos

```bash
npm run dev       # Dev server → http://localhost:5173
npm run build     # TypeScript check + Vite build → dist/
npm run preview   # Preview del build → http://localhost:4173
npm run lint      # ESLint

# Deploy
npm run build && npx firebase deploy --only hosting
```

---

## Arquitectura

```
sivox/
├── src/
│   ├── components/
│   │   ├── layout/       # NavBar (landing), Footer
│   │   └── ...           # TextDisplay, Grid, GridCell, SelectButton, Sidebar
│   ├── hooks/            # useScanner, usePrediction, useTTS, useAuth
│   ├── pages/            # RootPage, LandingPage, LoginPage, RegisterPage
│   ├── store/            # useSivoxStore (Zustand)
│   ├── lib/              # prediction.ts, tts.ts, layouts.ts, firebase.ts, sos.ts
│   ├── config/           # defaults.ts
│   └── types/            # index.ts
└── public/
    ├── icons/            # SVG + PNG icons para PWA
    └── data/
        └── diccionario_es.json   # Corpus offline de predicción
```

---

## Motor de barrido

Input único: `Enter` / `Space` / click en `SelectButton`.

```
idle → row → cell → (selección) → row → ...
```

| Estado | Descripción |
|--------|-------------|
| `idle` | En reposo |
| `row` | Barrido de filas (resalta fila activa con `▸`) |
| `cell` | Barrido de celdas dentro de la fila activa |

**Fila 0** → predicciones / frases rápidas / modo números (dinámica)  
**Filas 1–3** → letras (QWERTY o ABC)  
**Fila 4** → funciones (espacio, voz, borrar, SOS)

---

## Rutas

| URL | Contenido |
|-----|-----------|
| `/` | Comunicador (si autenticado) · Landing (si no autenticado) |
| `/login` | Iniciar sesión |
| `/registro` | Crear cuenta |

---

## Roadmap de Fases

### ✅ Fase 0 — Comunicador Core

- [x] Teclado QWERTY y ABC con barrido automático
- [x] Motor de barrido: state machine `idle → row → cell`
- [x] Celda indicadora `▸` por fila (buffer visual de inicio de fila)
- [x] Barrido infinito (`autoPauseAfter: 0`)
- [x] Fila 0 dinámica: predicciones / frases rápidas / números
- [x] Predicción offline con diccionario en español
- [x] Palabras frecuentes por defecto al iniciar
- [x] Frases rápidas predefinidas (9 frases)
- [x] Modo SOS: sirena Web Audio API + overlay de confirmación 2 pasos
- [x] TTS con Web Speech API (offline, voz del sistema)
- [x] Auto-limpieza de texto al hablar y al cancelar SOS
- [x] Salto directo a modo celda al activar 123 o FRASES
- [x] Selector de velocidad de barrido (5 presets)
- [x] Diseño dark (`#000020`) con acento sivox-500 (`#00BFFF`)

---

### ⏳ Fase 1 — PWA (Instalable)

- [x] `vite-plugin-pwa` + Workbox configurado
- [x] `manifest.json` generado: nombre, colores, orientación landscape
- [x] Caché offline: assets + diccionario (`/data/*`)
- [x] Meta tags PWA en `index.html` (Apple + Android)
- [x] React Router instalado y rutas configuradas
- [x] Routing raíz: `/` → comunicador (auth) o landing (no auth)
- [ ] Íconos PNG 192×192 y 512×512 exportados desde SVG
- [ ] Verificar Lighthouse PWA score ≥ 90
- [ ] Probar instalación en Android (Chrome) y iOS (Safari Add to Home Screen)

---

### ⏳ Fase 5 — Landing Page

- [x] Routing raíz inteligente: `/` → comunicador o landing según auth
- [x] Página landing: Hero + Features + Cómo funciona + CTA + Footer
- [x] NavBar con logo + "Iniciar sesión" + "Empezar gratis"
- [x] Rutas `/login` y `/registro` con páginas placeholder
- [ ] Animaciones de entrada (CSS o Framer Motion)
- [ ] Responsivo mobile verificado en dispositivos reales

---

### 🔒 Fase 2 — Autenticación

- [ ] Firebase Auth: email/contraseña
- [ ] Firebase Auth: Google OAuth
- [ ] Modo anónimo (acceso sin cuenta)
- [ ] Página de Login funcional (`/login`)
- [ ] Guard de rutas: redirigir a `/login` si no autenticado

---

### 📋 Fase 3 — Registro de usuarios

- [ ] Formulario: nombre, apellido, país, género
- [ ] Checkbox TyC + Política de privacidad
- [ ] Guardado en Firestore: `users/{uid}/profile`
- [ ] Flujo post-registro → redirigir al comunicador

---

### ⚙️ Fase 4 — Sidebar de Configuración

- [ ] Toggle mayúsculas/minúsculas
- [ ] Selector de layout: QWERTY / ABC
- [ ] Selector de voz TTS
- [ ] Ajuste de velocidad (presets + slider)
- [ ] Editor de frases rápidas: agregar, editar, eliminar
- [ ] Frases rápidas en múltiples filas (barrido por filas de frases)
- [ ] Toggle modo claro/oscuro

---

### 💾 Fase 4b — Persistencia en la nube

- [ ] Sincronizar settings del usuario con Firestore
- [ ] Sincronizar frases rápidas personalizadas
- [ ] Sincronizar historial de palabras frecuentes
- [ ] Datos anónimos de uso para analytics de políticas públicas

---

### 🤖 Fase 6 — IA Contextual (Gemini)

- [ ] Integración Gemini `gemini-2.5-flash-lite`
- [ ] Predicción contextual basada en texto compuesto
- [ ] Fallback automático a diccionario offline si no hay red

---

### 🔊 Fase 7 — TTS Neural (Google Cloud)

- [ ] Google Cloud TTS Neural2, región `southamerica-east1`
- [ ] Selector de voces premium en sidebar
- [ ] Fallback a Web Speech API offline

---

### 📱 Fase 8 — Google Play Store (TWA)

- [ ] Empaquetado con Bubblewrap (TWA)
- [ ] Assets de Play Store (capturas, descripción, íconos)
- [ ] Firma digital (DUNS disponible)
- [ ] Digital Asset Links para verificación TWA

---

## Variables de entorno

```bash
# Copiar .env.example → .env.local y completar:
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=sivox-app
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_GEMINI_API_KEY=          # Fase 6
```

---

## Paleta visual

| Token | Valor | Uso |
|-------|-------|-----|
| `#000020` | Background principal | Fondo de pantalla |
| `#00BFFF` | sivox-500 — acento | Títulos, scan-cell, CTAs |
| `#5F33FF` | xcail-purple | Gradiente botones |
| `#fca311` | xcail-action | SOS, alertas |
| `rgba(0,191,255,0.30)` | scan-row | Fila activa |
| `rgba(0,191,255,0.80)` | scan-cell | Celda activa |

---

## Sobre XCAIL Technologies

**XCAIL Technologies SAS** — Buenos Aires, Argentina.  
Tecnología accesible para comunidades con necesidades especiales.

Otros productos: [AsisTEA](https://asistea.app) — Plataforma IA para familias y personas neurodivergentes.
