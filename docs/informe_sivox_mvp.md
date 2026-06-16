# SIVOX — Especificación Técnica del MVP
## Comunicador con IA Predictiva y Barrido Universal

**Producto:** SIVOX  
**Empresa:** XCAIL Technologies SAS  
**Versión del documento:** 1.0  
**Fecha:** Junio 2026  
**Repositorio destino:** nuevo repo GitHub (ej. `xcail-technologies/sivox`)

---

## 1. Visión del Producto

SIVOX es un **comunicador de acceso alternativo y aumentativo (AAC)** implementado como Progressive Web App (PWA). Permite a personas con limitaciones motoras o del habla componer y expresar mensajes mediante un teclado virtual con sistema de barrido automático, predicción de texto por IA y síntesis de voz.

El diseño es **universal**: puede operarse con mouse, teclado estándar, switch físico (pulsador, pedal), sensor ocular, módulo Bluetooth (Arduino), o incluso señales electromagnéticas cerebrales no invasivas (BCI con vincha/anteojos). El software no cambia: cualquier dispositivo que simule la tecla `Enter` o `Espacio` es válido.

### Principios de diseño
- **Offline-first**: las funciones esenciales (teclado, barrido, voz del sistema) funcionan sin conexión
- **Accesibilidad universal**: el único input necesario es un único botón (one-switch)
- **Escalabilidad clínica**: múltiples voces, layouts y velocidades ajustables por profesional o usuario
- **Cloud-optional**: la IA predictiva y voces neurales de GCP se activan cuando hay internet

---

## 2. Arquitectura de la Interfaz (UI)

```
┌─────────────────────────────────────────────────────────────┐
│  [≡]  SIVOX                                    [⚙ Config]   │  ← Navbar
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Hola, ¿cómo estás? quiero _                        │  │  ← CAJA DE TEXTO
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  quiero  │  comer   │   agua   │  gracias │  ayuda   │  │  ← FILA 0: PREDICCIONES
│  ├──┬──┬──┬─┴─┬──┬──┬─┴─┬──┬──┬──┤  (5-10 palabras)
│  │Q │W │E │ R │T │Y │ U │I │O │P │  ← FILA 1
│  ├──┼──┼──┼───┼──┼──┼───┼──┼──┼──┤
│  │A │S │D │ F │G │H │ J │K │L │Ñ │  ← FILA 2
│  ├──┼──┼──┼───┼──┼──┼───┼──┼──┼──┤
│  │Z │X │C │ V │B │N │ M │⎵ │. │, │  ← FILA 3
│  ├──┼──┼──┼───┼──┼──┼───┼──┼──┼──┤
│  │⌫ │? │! │ ; │- │# │ ↑ │🔊│⬛│↵ │  ← FILA 4 (símbolos/acciones)
│  └──┴──┴──┴───┴──┴──┴───┴──┴──┴──┘
│                                                             │
│              ┌─────────────────────┐                        │
│              │   ●  SELECCIONAR    │                        │  ← BOTÓN CENTRAL
│              └─────────────────────┘                        │
│                  [Enter] / [Space]                          │
└─────────────────────────────────────────────────────────────┘
```

### 2.1. Caja de texto (Display)
- Muestra el texto compuesto en tiempo real
- Fuente grande y legible (mínimo 20px)
- Se puede limpiar con la celda `⬛` (borrar todo) o corrección letra a letra con `⌫`
- Al presionar `🔊` se reproduce el texto completo con TTS

### 2.2. Grid de celdas — 5 filas × 10 columnas

| Fila | Contenido | Descripción |
|------|-----------|-------------|
| **0** | Palabras predictivas | 5 a 10 sugerencias contextuales. Se actualizan en cada letra escrita |
| **1** | Q W E R T Y U I O P | Primera fila QWERTY (modo por defecto) |
| **2** | A S D F G H J K L Ñ | Segunda fila QWERTY |
| **3** | Z X C V B N M ⎵ . , | Tercera fila + espacio y puntuación básica |
| **4** | ⌫ ? ! ; - # ↑ 🔊 ⬛ ↵ | Símbolos, mayúsculas, borrar, hablar, borrar todo, confirmar |

#### Celdas especiales (fila 4)
| Celda | Acción |
|-------|--------|
| `⌫` | Borrar última letra |
| `?`, `!`, `;`, `-` | Signos de puntuación |
| `#` | Abrir panel de números (0-9) |
| `↑` | Toggle mayúsculas/minúsculas |
| `🔊` | Reproducir texto con TTS |
| `⬛` | Borrar todo el texto |
| `↵` | Salto de línea / separador de frase |

#### Layout alternativo: Alfabético
- A B C D E F G H I J  
- K L M N Ñ O P Q R S  
- T U V W X Y Z ⎵ . ,  
- ⌫ ? ! ; - # ↑ 🔊 ⬛ ↵

Configurable desde el panel lateral. La preferencia se guarda en Firestore (o localStorage offline).

### 2.3. Botón de selección central
- Ocupa el 60% del ancho inferior
- Diseño prominente, táctil, con feedback visual y háptico (vibration API)
- Triggers equivalentes: `click`, `Enter`, `Espacio`, `touch`
- Compatible con cualquier dispositivo externo que emule esas teclas

---

## 3. Sistema de Barrido (Scanning Engine)

### 3.1. Flujo de barrido en dos niveles

```
NIVEL 1 — Barrido de filas
  → Fila 0 (predicciones) se ilumina
  → Fila 1 se ilumina
  → Fila 2 se ilumina
  → Fila 3 se ilumina
  → Fila 4 se ilumina
  → vuelve a Fila 0 (loop)

  [SELECCIÓN] → entra en barrido de celdas de esa fila

NIVEL 2 — Barrido de celdas (dentro de la fila seleccionada)
  → Celda 0 se ilumina
  → Celda 1 se ilumina
  → ... hasta celda 9
  → vuelve a Celda 0 (loop)

  [SELECCIÓN] → inserta el carácter o ejecuta la acción
               → vuelve a NIVEL 1 automáticamente
```

### 3.2. Velocidades configurables (independientes)

| Parámetro | Default | Rango configurable |
|-----------|---------|-------------------|
| Velocidad barrido de filas | 1500 ms | 500 ms – 4000 ms |
| Velocidad barrido de celdas | 800 ms | 200 ms – 3000 ms |
| Pausa al entrar a fila | 200 ms | 0 ms – 1000 ms |

### 3.3. Retroalimentación visual
- Fila activa: borde/fondo resaltado (color de acento SIVOX)
- Celda activa: fondo más brillante + efecto de escala leve (`scale-105`)
- Al seleccionar: flash rápido de confirmación

### 3.4. Estados del motor
```typescript
type ScanState =
  | { level: "row"; activeRow: number }
  | { level: "cell"; activeRow: number; activeCell: number }
  | { level: "idle" };
```

El motor se pausa automáticamente si el usuario no interactúa durante N segundos (configurable: auto-pause), y se reanuda con cualquier acción.

---

## 4. IA Predictiva

### MVP (Offline-first)
- **Motor:** diccionario local de frecuencias en español (`.json` embebido en el bundle)
- Las predicciones se filtran por prefijo de la palabra actual en curso
- Se ordenan por frecuencia de uso general + historial del usuario (guardado en localStorage/Firestore)
- **Corpus base:** lista de las 10.000 palabras más frecuentes del español (fuente abierta: CREA/RAE u OpenSubtitles)
- **Respuesta:** instantánea, sin latencia, sin red

### Siguiente versión (Online)
- **Motor:** Gemini API (`gemini-flash` por costo) con prompt de contexto
- Input: últimas N palabras del texto compuesto
- Output: 5 palabras candidatas rankeadas
- Fallback automático al motor local si no hay conexión

### Aprendizaje personal
- Las palabras que el usuario selecciona frecuentemente suben en ranking
- Guardado en Firestore (sincronización multi-dispositivo) con fallback a localStorage

---

## 5. Síntesis de Voz (TTS)

### MVP — Web Speech API (offline, incluida en el browser)
```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = "es-AR"; // o "es-ES", configurable
utterance.rate = 0.9;
utterance.pitch = 1.0;
window.speechSynthesis.speak(utterance);
```
- **Ventaja:** funciona 100% offline, usa las voces del sistema operativo
- **Sin costo**, disponible en Chrome, Edge, Safari, Firefox
- **Voces disponibles:** dependen del OS (Windows, Android, iOS tienen voces de calidad aceptable)
- Sonido robótico en algunos sistemas — aceptable para MVP

### Fase 2 — Google Cloud Text-to-Speech (Neural)
- Voces WaveNet / Neural2 en español (variantes: es-US, es-ES, es-AR)
- Perfiles: mujer adulta, hombre adulto, voz infantil femenina, voz infantil masculina
- El profesional/terapeuta asigna la voz según identidad del paciente
- Costo: ~4 USD / 1 millón de caracteres (Neural2)
- Las voces se pueden **pre-cachear** en el Service Worker para uso offline posterior

### Configuración de voz
- Velocidad: 0.5x – 2x
- Tono: configurable
- Voz: selección de lista (filtrada por idioma y perfil)
- Preview en tiempo real desde el panel de configuración

---

## 6. Stack Tecnológico

### Frontend
| Tecnología | Uso | Justificación |
|-----------|-----|---------------|
| React 18 + Vite 5 | Framework | Ecosistema XCAIL, HMR rápido |
| TypeScript 5 | Tipado | Seguridad en el motor de barrido |
| Tailwind CSS 3 | Estilos | Consistencia con otros productos XCAIL |
| Workbox 7 | Service Worker / PWA | Offline-first, caché estratégico |
| Zustand | Estado global | Ligero, sin boilerplate, perfecto para el estado del scanner |
| React Query | Datos async | Cache de predicciones online/offline |

### Backend & Cloud
| Servicio | Uso |
|---------|-----|
| **Firebase Auth** | Login con Google (fase 2), anónimo para MVP |
| **Firestore** | Historial de frases, preferencias, ranking predictivo personalizado |
| **Firebase Analytics** | Métricas de uso (teclas más usadas, tiempo de sesión) |
| **Google Cloud TTS** | Voces neurales en fase 2 |
| **Vertex AI / Gemini API** | Predicción de texto contextual en fase 2 |
| **Firebase Hosting** | Deploy del PWA (CDN global, HTTPS automático) |

### PWA
| Capacidad | Implementación |
|-----------|---------------|
| Instalable en dispositivo | `manifest.json` + iconos adaptivos |
| Offline total de funciones base | Service Worker (Workbox) con cache de assets y diccionario |
| Actualización silenciosa | `workbox-window` con prompt de actualización |
| Pantalla completa en tablet | `display: standalone` en manifest |
| Acceso a vibración | `navigator.vibrate([50])` en cada selección |

---

## 7. Arquitectura del Proyecto (Estructura de Carpetas)

```
sivox/
├── public/
│   ├── manifest.json           # PWA manifest
│   ├── icons/                  # Iconos adaptivos (48, 72, 96, 144, 192, 512px)
│   ├── sw.js                   # Service Worker (generado por Workbox)
│   └── data/
│       └── diccionario_es.json # Corpus de predicción offline (~10k palabras)
│
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── App.css
│   │
│   ├── components/
│   │   ├── TextDisplay.tsx         # Caja de texto superior
│   │   ├── Grid.tsx                # Grid 5×10 (predicciones + letras)
│   │   ├── GridCell.tsx            # Celda individual con estados
│   │   ├── PredictionRow.tsx       # Fila 0: palabras predictivas
│   │   ├── SelectButton.tsx        # Botón central de selección
│   │   ├── Sidebar.tsx             # Panel de configuración lateral
│   │   └── ui/                     # Componentes shadcn/ui
│   │
│   ├── hooks/
│   │   ├── useScanner.ts           # Motor de barrido (el corazón del app)
│   │   ├── useTTS.ts               # Web Speech API + GCP TTS
│   │   ├── usePrediction.ts        # Lógica de predicción de palabras
│   │   ├── useKeyboard.ts          # Listener Enter/Space/click
│   │   └── useSettings.ts          # Preferencias del usuario
│   │
│   ├── store/
│   │   └── useSivoxStore.ts        # Estado global con Zustand
│   │       # - texto compuesto
│   │       # - scanState
│   │       # - configuración
│   │       # - predicciones actuales
│   │
│   ├── lib/
│   │   ├── firebase.ts             # Inicialización Firebase
│   │   ├── prediction.ts           # Motor de predicción offline
│   │   ├── tts.ts                  # Abstracción TTS (web → GCP)
│   │   ├── layouts.ts              # Definición de layouts QWERTY / Alfabético
│   │   └── symbols.ts              # Definición de celdas especiales
│   │
│   ├── config/
│   │   └── defaults.ts             # Velocidades, layout, voz por defecto
│   │
│   └── types/
│       └── index.ts                # Tipos compartidos
│
├── vite.config.ts                  # VitePWA plugin configurado
├── tailwind.config.js
├── tsconfig.json
├── firebase.json
├── .firebaserc
└── package.json
```

---

## 8. Estado Global (Zustand Store)

```typescript
interface SivoxState {
  // Texto
  composedText: string;
  
  // Motor de barrido
  scanState: ScanState;
  isScanning: boolean;
  
  // Configuración
  settings: {
    rowSpeed: number;        // ms entre filas
    cellSpeed: number;       // ms entre celdas
    layout: "qwerty" | "alphabetical" | "custom";
    ttsVoice: string;        // ID de voz
    ttsRate: number;
    ttsPitch: number;
    ttsEngine: "web" | "gcp";
    theme: "dark" | "light";
    language: "es" | "en";
    autoPauseAfter: number;  // segundos sin input para pausar
  };
  
  // Predicción
  predictions: string[];
  
  // Acciones
  appendChar: (char: string) => void;
  deleteLastChar: () => void;
  clearText: () => void;
  speak: () => void;
  selectPrediction: (word: string) => void;
  updateSettings: (partial: Partial<SivoxState["settings"]>) => void;
}
```

---

## 9. Hook `useScanner` — Motor de Barrido

```typescript
// src/hooks/useScanner.ts
// Responsabilidades:
// - Controlar el loop de barrido por filas
// - Al seleccionar fila, cambiar al barrido de celdas
// - Al seleccionar celda, ejecutar la acción correspondiente
// - Escuchar Enter / Space / click en el botón central
// - Pausar/reanudar en auto-pause
// - Respetar las velocidades configuradas en settings

// Eventos externos de input:
// - document.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") handleSelect() })
// - El SelectButton llama handleSelect() en onClick
// - Futuro: BLE/HID events desde hardware externo
```

El motor es un **state machine** de tres estados: `idle → row-scan → cell-scan → idle`.

---

## 10. Panel de Configuración (Sidebar)

Accesible desde el botón `⚙` en el navbar o una celda especial del grid.

### Secciones del panel
```
┌──────────────────────────┐
│ ⚙ CONFIGURACIÓN          │
├──────────────────────────┤
│ 🔊 Voz                   │
│   Motor: Web / GCP       │
│   Perfil: [▼ seleccionar]│
│   Velocidad: ──●─── 1.0x │
│   Tono:      ──●─── 1.0  │
│   [Preview de voz]       │
├──────────────────────────┤
│ ⏱ Velocidad de barrido   │
│   Filas:    ──●─── 1500ms│
│   Celdas:   ──●─── 800ms │
│   Pausa inicial: 200ms   │
├──────────────────────────┤
│ ⌨ Layout de teclado      │
│   ○ QWERTY               │
│   ○ Alfabético            │
├──────────────────────────┤
│ 🌐 Idioma                │
│   ○ Español  ○ English   │
├──────────────────────────┤
│ 👤 Sesión                 │
│   [Iniciar sesión Google]│
│   (o usuario anónimo)    │
│   [Cerrar sesión]        │
└──────────────────────────┘
```

---

## 11. PWA — Comportamiento Offline

### Estrategia de caché (Workbox)

| Recurso | Estrategia | Descripción |
|---------|-----------|-------------|
| Assets estáticos (JS, CSS, íconos) | `CacheFirst` | Instalados en install del SW |
| `diccionario_es.json` | `CacheFirst` | Pre-cacheado en install |
| Firestore (preferencias) | `NetworkFirst` con fallback local | localStorage como respaldo |
| GCP TTS audio | `CacheFirst` con expiración 7d | Cache de frases frecuentes |
| Gemini API | Sin caché | Solo online; fallback a diccionario local |

### Qué funciona OFFLINE
- ✅ Teclado virtual completo
- ✅ Sistema de barrido
- ✅ Síntesis de voz (voces del sistema operativo)
- ✅ Predicción básica (diccionario local)
- ✅ Composición y edición de texto
- ✅ Configuración guardada localmente

### Qué requiere conexión
- ☁️ Predicción con Gemini (mejora la calidad)
- ☁️ Voces neurales GCP TTS
- ☁️ Sincronización de historial entre dispositivos (Firestore)
- ☁️ Login con Google

---

## 12. Compatibilidad con Dispositivos de Acceso

El diseño **one-switch** hace que SIVOX sea compatible con cualquier hardware que emule `Enter` o `Espacio`:

| Dispositivo | Método de input | Implementación |
|------------|----------------|----------------|
| Mouse / trackpad | Click en botón central | `onClick` nativo |
| Teclado estándar | `Enter` o `Espacio` | `keydown` listener |
| Pulsador / pedal USB | Emula tecla Enter/Space | Mismo `keydown` listener |
| Switch Bluetooth (Arduino + HC-05/HM-10) | Emula tecla Enter/Space via BLE HID | Sin cambios en software |
| Switch Bluetooth (módulo comercial) | BLE HID → Enter/Space | Sin cambios en software |
| Eye-tracking (Tobii, EyeTech) | Dwell-click o switch por mirada | Dwell timer en SelectButton |
| BCI no invasivo (Muse, OpenBCI, NeuroSky) | Evento mapeable a keypress | Middleware externo → Enter |
| Pantalla táctil (tablet) | Tap en botón central | `onClick` / `touchstart` |

> **Principio de universalidad**: SIVOX no requiere drivers especiales ni SDK de hardware. Cualquier dispositivo que genere un evento de teclado (`Enter`/`Space`) o un click funciona sin modificación del software.

### Fase futura: BLE Web API
- Conectar directamente con Arduino/ESP32 vía `Web Bluetooth API`
- El dispositivo físico anuncia un servicio GATT custom
- SIVOX escucha el characteristic y mapea el evento a `handleSelect()`

---

## 13. Firebase — Estructura de Datos (Firestore)

```
/users/{uid}/
  profile:
    displayName: string
    email: string
    createdAt: timestamp
    
  settings:
    rowSpeed: number
    cellSpeed: number
    layout: "qwerty" | "alphabetical"
    ttsVoice: string
    ttsRate: number
    language: "es" | "en"
    
  wordHistory:
    /words/{word}:
      count: number
      lastUsed: timestamp
      
  phrases:
    /phrases/{id}:
      text: string
      createdAt: timestamp
      usageCount: number
```

---

## 14. Diseño Visual

### Principios
- Pantalla completa en tablet (sin scroll, todo visible de una vez)
- Modo oscuro por defecto (menor fatiga visual, mejor contraste para acceso)
- Modo claro disponible (para entornos con mucha luz)
- Celdas grandes con esquinas redondeadas, fáciles de distinguir
- Estado de barrido con color de acento fuerte (no solo borde: fondo completo)
- Fuente: `Outfit` (consistente con AsisTEA) o `Inter` — sans-serif, alta legibilidad

### Paleta
| Elemento | Color |
|---------|-------|
| Fondo (dark) | `#000020` |
| Celda inactiva | `hsl(220 76% 16%)` |
| Celda activa (barrido fila) | `#00BFFF` con opacidad 30% |
| Celda activa (barrido celda) | `#00BFFF` con opacidad 80% |
| Texto celdas | `#ffffff` |
| Celda especial (acciones) | `#fca311` con opacidad 15% |
| Botón selección | Gradiente `#5F33FF → #00BFFF` |
| Texto display | `#ffffff` / `20px+` / `font-bold` |

---

## 15. Fases de Desarrollo

### Fase 0 — Setup (Semana 1)
- [ ] Crear repo GitHub `xcail-technologies/sivox`
- [ ] Inicializar proyecto: `npm create vite@latest sivox -- --template react-ts`
- [ ] Instalar Tailwind, shadcn/ui, Zustand, React Query
- [ ] Configurar VitePWA plugin (Workbox)
- [ ] Crear proyecto en Firebase Console
- [ ] Conectar Firebase al proyecto
- [ ] Deploy inicial en Firebase Hosting (página en blanco)

### Fase 1 — Core MVP (Semana 2-3)
- [ ] Implementar `useSivoxStore` (Zustand)
- [ ] Implementar layout QWERTY (celdas estáticas)
- [ ] Implementar `useScanner` (motor de barrido dos niveles)
- [ ] Implementar `SelectButton` con listeners Enter/Space/click
- [ ] Implementar `TextDisplay`
- [ ] Implementar acciones de celdas especiales (⌫, 🔊, ⬛)
- [ ] TTS básico con Web Speech API (`useTTS`)
- [ ] Feedback visual del barrido (highlight activo)

### Fase 2 — Predicción + Config (Semana 4)
- [ ] Integrar diccionario offline `diccionario_es.json`
- [ ] Implementar `usePrediction` (prefijo-matching + ranking)
- [ ] Renderizar fila 0 con palabras predictivas como celdas seleccionables
- [ ] Implementar `Sidebar` de configuración
- [ ] Velocidades de barrido ajustables (filas y celdas por separado)
- [ ] Toggle layout QWERTY / Alfabético
- [ ] Persistencia de settings en localStorage

### Fase 3 — PWA + Offline (Semana 5)
- [ ] Configurar `manifest.json` completo (íconos, `display: standalone`, colores)
- [ ] Configurar Workbox: cache de assets + diccionario
- [ ] Testar instalación en Android, iOS (Safari), Windows
- [ ] Testar modo avión (todas las funciones base)

### Fase 4 — Firebase + Auth (Semana 6-7)
- [ ] Inicializar Firestore
- [ ] Login anónimo automático (sin fricción para MVP)
- [ ] Sincronizar settings y historial de palabras en Firestore
- [ ] Login con Google (fase 2 del auth)
- [ ] Persistencia offline de Firestore (`enableIndexedDbPersistence`)

### Fase 5 — IA + Voces GCP (Semana 8+)
- [ ] Integrar Gemini API para predicción contextual
- [ ] Fallback automático offline → diccionario local
- [ ] Integrar Google Cloud TTS (Neural2, voces en español)
- [ ] Panel de selección de voz por perfil (mujer/hombre/niño/niña)
- [ ] Cache de frases TTS frecuentes en Service Worker

### Fase 6 — Hardware & BCI (Futuro)
- [ ] Web Bluetooth API: integración directa con Arduino/ESP32
- [ ] Dwell-click para eye-tracking sin switch físico
- [ ] SDK de BCI: integración con OpenBCI / Muse (via WebSocket middleware)
- [ ] Detección de parpadeo via WebRTC + MediaPipe Face Mesh (cámara)

---

## 16. Comandos de Inicio Rápido

```bash
# Crear repositorio
git init sivox
cd sivox

# Inicializar proyecto
npm create vite@latest . -- --template react-ts
npm install

# Dependencias core
npm install zustand @tanstack/react-query
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# shadcn/ui
npx shadcn-ui@latest init

# PWA
npm install -D vite-plugin-pwa workbox-window

# Firebase
npm install firebase
npm install -D firebase-tools

# Login en Firebase
npx firebase login
npx firebase init   # seleccionar: Hosting, Firestore, Analytics

# Correr en dev
npm run dev

# Build + deploy
npm run build
npx firebase deploy
```

---

## 17. Consideraciones de Accesibilidad Clínica

- El software **no reemplaza** la evaluación ni el criterio de logopedas, terapeutas o médicos
- Las configuraciones (voz, velocidad, layout) deben ser ajustables por el profesional tratante
- El historial de frases y palabras es propiedad del usuario/paciente y debe poder exportarse
- RGPD / protección de datos: los datos del paciente en Firestore deben cumplir políticas de privacidad; considerar región del datacenter (preferiblemente `southamerica-east1` — São Paulo)
- Las frases compuestas no se envían a terceros en modo offline

---

## 18. Métricas de Éxito del MVP

| Métrica | Objetivo |
|---------|---------|
| Componer una frase de 5 palabras | < 2 minutos con barrido default |
| Latencia de predicción offline | < 50 ms |
| Tamaño del bundle inicial | < 500 KB (sin diccionario) |
| Diccionario offline | < 300 KB (JSON comprimido) |
| Instalación PWA en Android | Funcional en Chrome 90+ |
| Funcionamiento offline completo | 100% de funciones core |
| Compatibilidad one-switch | Cualquier dispositivo Enter/Space |

---

*Documento generado por XCAIL Technologies — Junio 2026*  
*Revisión: Carlos Leiva (Founder & CEO)*
