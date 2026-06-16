# SIVOX

**Comunicador AAC con IA Predictiva y Barrido Universal**  
Producto de [XCAIL Technologies SAS](https://xcail.com) — Buenos Aires, Argentina

---

## ¿Qué es SIVOX?

SIVOX es una **Progressive Web App (PWA)** de comunicación aumentativa y alternativa (AAC) diseñada para personas con discapacidad motora que no pueden hablar o tienen dificultades para comunicarse.

Permite componer y expresar mensajes mediante:
- **Teclado virtual con barrido automático** en dos niveles (fila → celda)
- **Predicción de texto por IA** — offline con diccionario local, online con Gemini API
- **Síntesis de voz** — offline con Web Speech API, fase 2 con voces neurales de GCP
- **Input universal one-switch** — cualquier dispositivo que emule `Enter` o `Space`

---

## Principios de diseño

| Principio | Descripción |
|-----------|-------------|
| **Offline-first** | Las funciones esenciales funcionan sin conexión |
| **One-switch** | El único input necesario es un único botón |
| **Cloud-optional** | IA y voces neurales se activan cuando hay internet |
| **Escalabilidad clínica** | Configuración de voces, layouts y velocidades por profesional o usuario |

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | React 18 + Vite 5 + TypeScript 5 |
| Estilos | Tailwind CSS 3 + shadcn/ui |
| Estado | Zustand |
| Data fetching | React Query |
| PWA / Offline | Workbox 7 + vite-plugin-pwa |
| Backend | Firebase Auth + Firestore + Analytics |
| IA (fase 2) | Gemini API + GCP Cloud Text-to-Speech Neural |
| Deploy | Firebase Hosting |

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Deploy en Firebase Hosting
npm run build && npx firebase deploy
```

---

## Estructura del proyecto

```
sivox/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── icons/                  # Íconos adaptivos (48–512px)
│   └── data/
│       └── diccionario_es.json # Corpus offline ~10k palabras (español)
│
├── src/
│   ├── components/
│   │   ├── TextDisplay.tsx     # Caja de texto superior
│   │   ├── Grid.tsx            # Grid 5×10
│   │   ├── GridCell.tsx        # Celda individual con estados de barrido
│   │   ├── PredictionRow.tsx   # Fila 0: palabras predictivas
│   │   ├── SelectButton.tsx    # Botón central de selección
│   │   └── Sidebar.tsx         # Panel de configuración
│   │
│   ├── hooks/
│   │   ├── useScanner.ts       # Motor de barrido (state machine)
│   │   ├── useTTS.ts           # Web Speech API → GCP TTS
│   │   ├── usePrediction.ts    # Predicción offline/online
│   │   ├── useKeyboard.ts      # Listener Enter/Space/click
│   │   └── useSettings.ts      # Preferencias del usuario
│   │
│   ├── store/
│   │   └── useSivoxStore.ts    # Estado global Zustand
│   │
│   └── lib/
│       ├── prediction.ts       # Motor de predicción offline
│       ├── tts.ts              # Abstracción TTS (web → GCP)
│       └── layouts.ts          # QWERTY / Alfabético
│
└── docs/                       # Especificaciones técnicas
```

---

## Compatibilidad con dispositivos de acceso

SIVOX no requiere drivers especiales. Funciona con cualquier dispositivo que genere un evento `Enter` o `Space`:

| Dispositivo | Método |
|------------|--------|
| Mouse / trackpad | Click en botón central |
| Teclado estándar | `Enter` o `Espacio` |
| Pulsador / pedal USB | Emula tecla Enter/Space |
| Switch Bluetooth (Arduino + HC-05) | BLE HID → Enter/Space |
| Eye-tracking (Tobii, EyeTech) | Dwell-click |
| BCI no invasivo (Muse, OpenBCI) | Middleware → Enter |
| Pantalla táctil | Tap en botón central |

---

## Fases de desarrollo

- [x] **Fase 0** — Setup: repo, Vite + React + TS, Firebase, deploy inicial
- [ ] **Fase 1** — Core MVP: motor de barrido, teclado QWERTY, TTS básico
- [ ] **Fase 2** — Predicción offline + panel de configuración
- [ ] **Fase 3** — PWA completa + modo avión verificado
- [ ] **Fase 4** — Firebase Auth + Firestore
- [ ] **Fase 5** — Gemini API (predicción contextual) + GCP Neural TTS
- [ ] **Fase 6** — Web Bluetooth API + eye-tracking dwell + BCI

---

## Paleta visual

| Elemento | Color |
|---------|-------|
| Fondo (dark) | `#000020` |
| Celda inactiva | `hsl(220 76% 16%)` |
| Barrido fila activa | `#00BFFF` 30% |
| Barrido celda activa | `#00BFFF` 80% |
| Botón selección | `#5F33FF → #00BFFF` |
| Celdas de acción | `#fca311` 15% |

---

## Documentación

- [Especificación técnica del MVP](docs/informe_sivox_mvp.md)
- [Contexto de postulación GCP](docs/informe_postulacion_gcp.md)

---

## Empresa

**XCAIL Technologies SAS** — Startup de IA aplicada a neurodesarrollo y accesibilidad.  
Web: [xcail.com](https://xcail.com) | Contacto: contacto@xcail.com  
Buenos Aires, Argentina

Otros productos: [AsisTEA](https://asistea.app) — Plataforma IA para familias y personas neurodivergentes.
