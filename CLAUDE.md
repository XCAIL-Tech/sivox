# CLAUDE.md — SIVOX

Guía de desarrollo para Claude Code en este repositorio.

## Comandos

```bash
npm run dev       # Dev server en http://localhost:5173
npm run build     # TypeScript check + Vite build → dist/
npm run preview   # Preview del build en http://localhost:4173
npm run lint      # ESLint

# Deploy
npm run build && npx firebase deploy --only hosting
```

## Arquitectura

```
sivox/
├── src/
│   ├── components/       # UI: TextDisplay, Grid, GridCell, SelectButton, Sidebar
│   ├── hooks/            # useScanner (state machine), usePrediction, useTTS
│   ├── store/            # useSivoxStore (Zustand — estado global)
│   ├── lib/              # prediction.ts, tts.ts, layouts.ts, firebase.ts, utils.ts
│   ├── config/           # defaults.ts (velocidades, settings por defecto)
│   └── types/            # index.ts (ScanState, GridCell, SivoxSettings, etc.)
├── public/
│   └── data/
│       └── diccionario_es.json   # Corpus offline de predicción
```

## Convenciones críticas

- **Stack:** Vite 6 + React 18 + TypeScript (strict) + Tailwind 3 + Zustand 5
- **NO Next.js** — SIVOX es Vite puro (a diferencia de AsisTEA)
- **Path alias:** `@/` apunta a `src/` — usar siempre en imports
- **Offline-first:** toda funcionalidad core debe funcionar sin conexión
- **Input único:** el único input de selección es Enter / Space / click en SelectButton
- **Motor de barrido:** `useScanner` es una state machine con 3 estados: `idle → row → cell`
- **`"strict": true`** en tsconfig — usar `error: unknown` en catch blocks

## Estado del barrido (ScanState)

```typescript
type ScanState =
  | { level: "row"; activeRow: number }       // Barrido entre filas
  | { level: "cell"; activeRow: number; activeCell: number }  // Barrido en celda
  | { level: "idle" }                          // En reposo
```

Fila 0 = predicciones (dinámicas). Filas 1-4 = layout de teclado.

## Variables de entorno

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
VITE_GEMINI_API_KEY          # Fase 2 — predicción contextual
```

Copiar `.env.example` → `.env.local` y completar con valores del proyecto Firebase.

## Paleta visual

| Token | Valor |
|-------|-------|
| `--background` | `#000020` (dark) |
| `sivox-500` | `#00BFFF` — acento principal |
| `xcail-purple` | `#5F33FF` — gradiente botón |
| `xcail-action` | `#fca311` — celdas de acción |
| `--sivox-scan-row` | `rgba(0,191,255,0.30)` |
| `--sivox-scan-cell` | `rgba(0,191,255,0.80)` |

## IA y Cloud (Fase 2)

- **Predicción contextual:** Gemini `gemini-2.5-flash-lite` (más barato)
- **Gemini 1.5 y 2.0 están discontinuados — no usar**
- **TTS Neural:** Google Cloud Text-to-Speech Neural2, región `southamerica-east1`
- Fallback offline automático: si no hay red → diccionario local

## Firebase

- Proyecto Firebase: `sivox` (pendiente de crear en Firebase Console)
- Región recomendada: `southamerica-east1` (São Paulo) — mismo que AsisTEA
- Auth: anónimo en MVP, Google OAuth en fase 2
- Persistencia offline Firestore: `enableIndexedDbPersistence` ya configurado en `lib/firebase.ts`
