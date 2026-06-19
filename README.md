# SIVOX — Plataforma Universal de Accesibilidad e Inteligencia Artificial

**SIVOX** es una plataforma de accesibilidad impulsada por inteligencia artificial que permite a personas con discapacidad motora, neuromuscular o dificultades severas de comunicación interactuar con tecnología digital utilizando cualquier método de acceso disponible.

Desarrollado por **XCAIL Technologies SAS** — Buenos Aires, Argentina.

> **Producción:** `https://sivox-app.web.app`

---

## Visión

SIVOX no es un comunicador AAC convencional. Es la base de una plataforma universal de acceso humano-computadora donde distintos dispositivos, sensores y métodos de interacción convergen en un único sistema de comunicación, control y autonomía personal.

La visión de largo plazo es que cualquier persona, independientemente de su nivel de movilidad o capacidad de comunicación, pueda operar tecnología y expresarse con autonomía — usando desde un pulsador físico hasta su mirada o una interfaz cerebro-computadora.

---

## Métodos de acceso compatibles

| Método | Estado |
|--------|--------|
| Teclado / Enter / Espacio | Disponible |
| Pulsador físico (HID) | Disponible |
| Click de pantalla táctil | Disponible |
| Pulsador Bluetooth | En desarrollo |
| Detección de parpadeo por webcam (SIVOX Blink) | Planificado — MVP |
| Seguimiento ocular (eye tracking) | Planificado — Fase posterior |
| Interfaz cerebro-computadora (BCI) | Largo plazo |

---

## Alcance clínico

SIVOX está diseñado para atender múltiples poblaciones con necesidades de acceso alternativo:

- Parálisis cerebral
- ELA (Esclerosis Lateral Amiotrófica)
- ACV (Accidente Cerebrovascular) con afasia o paresia
- Lesión medular
- Enfermedades neuromusculares progresivas
- Trastornos severos del habla
- Movilidad reducida permanente o temporal
- Rehabilitación motora post-quirúrgica

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Vite 6 + React 18 + TypeScript (strict) |
| Estado global | Zustand 5 |
| Estilos | Tailwind CSS 3 |
| PWA / Offline | vite-plugin-pwa + Workbox 7 |
| Routing | React Router v6 |
| Auth | Firebase Authentication |
| Base de datos | Cloud Firestore |
| Hosting | Firebase Hosting |
| IA — Predicción contextual | Gemini `gemini-2.5-flash-lite` (Fase 6) |
| TTS | Web Speech API → Google Cloud TTS Neural2 (Fase 7) |
| Visión por computadora | MediaPipe / TensorFlow Lite (SIVOX Blink) |

---

## Comandos de desarrollo

```bash
npm run dev       # Dev server → http://localhost:5173
npm run build     # TypeScript check + Vite build → dist/
npm run preview   # Preview del build → http://localhost:4173
npm run lint      # ESLint

# Deploy
npm run build && npx firebase deploy --only hosting
```

---

## Arquitectura del proyecto

```
sivox/
├── src/
│   ├── components/
│   │   ├── layout/       # NavBar, Footer, Sidebar
│   │   └── onboarding/   # StepLegal, StepProfile, StepConfig, CountrySelect, ArLocationSelect
│   ├── hooks/            # useScanner, usePrediction, useTTS, useAuth
│   ├── pages/            # RootPage, LandingPage, LoginPage, OnboardingPage
│   ├── store/            # useSivoxStore (Zustand — estado global)
│   ├── lib/              # prediction.ts, tts.ts, layouts.ts, firebase.ts, auth.ts, location.ts
│   ├── config/           # defaults.ts (velocidades, presets, frases)
│   └── types/            # index.ts, onboarding.ts
└── public/
    ├── icons/            # SVG + PNG icons para PWA
    └── data/
        └── diccionario_es.json   # Corpus offline de predicción (~50k palabras)
```

---

## Motor de barrido

Input único soportado: `Enter` / `Space` / click en botón de selección.

```
idle → row → cell → (selección ejecutada) → row → ...
```

| Estado | Descripción |
|--------|-------------|
| `idle` | En reposo |
| `row` | Barrido entre filas — resalta fila activa |
| `cell` | Barrido entre celdas dentro de la fila activa |

**Fila 0** — predicciones / frases rápidas / modo numérico (dinámica)
**Filas 1–3** — letras (QWERTY o ABC según configuración)
**Fila 4** — funciones (espacio, hablar, borrar, SOS)

---

## Rutas de la aplicación

| URL | Contenido |
|-----|-----------|
| `/` | Comunicador (autenticado + perfil completo) · Landing (no autenticado) |
| `/login` | Iniciar sesión / Crear cuenta |
| `/onboarding` | Configuración inicial de perfil (3 pasos: TyC, Perfil, Configuración) |

---

## Plataforma SIVOX — Módulos de software

### SIVOX AAC *(disponible)*

Comunicador aumentativo y alternativo con barrido automático, predicción offline e IA contextual.

Funciones core:
- Barrido automático fila → celda con velocidades configurables
- Teclado virtual QWERTY y ABC
- Predicción de texto offline (diccionario español, ~50k entradas)
- Predicción contextual mediante Gemini (Fase 6)
- Síntesis de voz (Web Speech API / Google Cloud TTS Neural2)
- Compatibilidad one-switch y multi-switch
- Modo SOS con sirena de emergencia
- Funcionamiento offline-first (PWA instalable)

---

### SIVOX Home *(planificado)*

Módulo de accesibilidad domótica que permite controlar elementos del entorno mediante barrido.

Funciones previstas:
- Control de iluminación, climatización, TV y multimedia
- Control de timbres, alarmas y apertura de puertas
- Solicitud de asistencia a cuidadores
- Integración con plataformas de domótica estándar (Home Assistant, Google Home)

---

### SIVOX Edu *(planificado)*

Módulo educativo para facilitar aprendizaje, alfabetización y entrenamiento cognitivo mediante interfaces accesibles.

Funciones previstas:
- Actividades adaptadas por nivel cognitivo y motor
- Aprendizaje por barrido
- Juegos educativos accesibles
- Panel de seguimiento de progreso para terapeutas y docentes
- Configuración por perfil clínico

---

## Ecosistema de hardware SIVOX

La estrategia de hardware se basa en construir una familia de dispositivos económicos, escalables e interoperables con la plataforma SIVOX.

### SIVOX Access Core

**Adaptador Universal de Accesibilidad**

Núcleo tecnológico de la línea de hardware. Convierte cualquier método de acceso físico en una acción HID compatible con computadoras, tablets y smartphones.

```
Switch físico / sensor
        ↓
 SIVOX Access Core
        ↓
PC / Tablet / Smartphone
```

Funciones previstas:
- Conexión USB HID y Bluetooth HID
- Entrada Jack 3.5 mm (estándar AT-switch)
- Configuración de tecla de acción (Enter / Space)
- Ajuste de sensibilidad y debounce
- Actualización de firmware OTA
- Compatibilidad multiplataforma (Windows, macOS, Android, iOS)

Hardware base del prototipo:
- ESP32 o RP2040
- MicroPython o firmware C dedicado

Justificación estratégica: es el primer hardware a validar porque es económico, fácil de fabricar, fácil de explicar y permite generar kits institucionales de forma escalable.

---

### SIVOX Switch

Familia de pulsadores físicos compatibles con SIVOX Access Core:

- Pulsador de mano
- Pulsador de pie
- Pulsador de mesa (gran superficie)
- Pulsador de mentón
- Adaptaciones personalizadas por terapeuta

Todos generan un evento estándar compatible con la plataforma SIVOX.

---

### SIVOX Blink *(prioritario para MVP)*

Sistema de acceso mediante detección de parpadeo por webcam. Elimina la necesidad de hardware adicional.

```
Webcam estándar
      ↓
Detección facial (MediaPipe / TensorFlow Lite)
      ↓
Detección de parpadeo voluntario
      ↓
Evento Enter → control de SIVOX
```

Ventajas:
- Costo cero para el usuario (solo requiere cámara integrada)
- Sin instalación de hardware
- Ideal para demostraciones institucionales
- Alto potencial de difusión y adopción

---

### SIVOX Eye *(largo plazo)*

Línea futura de seguimiento ocular de precisión para usuarios que requieren control mediante mirada. Evolución posterior a SIVOX Blink una vez validado el mercado.

---

## Estrategia de comercialización

### Kit SIVOX Básico — mercado institucional

Solución completa lista para usar:

| Componente | Descripción |
|-----------|-------------|
| SIVOX AAC | Acceso a la plataforma web/PWA |
| SIVOX Access Core | Adaptador USB/Bluetooth |
| SIVOX Switch | Pulsador de mano o pie |
| Documentación | Guía de configuración clínica |

### Mercados objetivo

**Argentina (mercado inicial)**
- Centros de rehabilitación motora
- Escuelas de educación especial
- Hospitales con unidades de neurología y neurorrehab
- Municipios con programas de inclusión
- Organizaciones de personas con discapacidad

**Latinoamérica (expansión)**
- Chile, Colombia, México, Uruguay, Brasil (mercado lusohablante adaptado)
- Programas de inclusión financiados por BID y BM
- ONGs y fundaciones del sector de discapacidad
- Sistemas de salud pública con cobertura de tecnología asistiva

---

## Roadmap de fases

### Fase 0 — Comunicador Core *(completada)*

- [x] Teclado QWERTY y ABC con barrido automático
- [x] Motor de barrido: state machine `idle → row → cell`
- [x] Fila 0 dinámica: predicciones / frases rápidas / números
- [x] Predicción offline con diccionario en español
- [x] Modo SOS con sirena Web Audio API + confirmación en 2 pasos
- [x] TTS con Web Speech API
- [x] Selector de velocidad de barrido (5 presets)
- [x] Diseño dark (`#000020`) con acento sivox-500 (`#00BFFF`)

### Fase 1 — PWA Instalable *(completada parcialmente)*

- [x] `vite-plugin-pwa` + Workbox configurado
- [x] `manifest.json` con nombre, colores, orientación landscape
- [x] Caché offline de assets y diccionario
- [ ] Íconos PNG 192×192 y 512×512 exportados desde SVG
- [ ] Lighthouse PWA score ≥ 90
- [ ] Instalación verificada en Android (Chrome) e iOS (Safari)

### Fase 2 — Autenticación y Onboarding *(completada)*

- [x] Firebase Auth: email/contraseña y Google OAuth
- [x] Onboarding 3 pasos: TyC + Perfil/Ubicación + Configuración
- [x] Perfil en Firestore: nombre, edad, género, ubicación (4 niveles AR / 3 otros países)
- [x] Guard de rutas: redirigir a `/onboarding` si perfil incompleto
- [x] Geolocalización Argentina: georef.ar API (provincias, municipios, localidades)

### Fase 3 — Sidebar de Configuración *(completada)*

- [x] Sidebar de ajustes: perfil, teclado, velocidad del barrido, cierre de sesión
- [ ] Editor de frases rápidas (agregar, editar, eliminar)
- [ ] Toggle modo claro/oscuro desde sidebar
- [ ] Selector de voz TTS con previsualización

### Fase 4 — Persistencia en la nube

- [ ] Sincronizar settings con Firestore
- [ ] Sincronizar frases rápidas personalizadas
- [ ] Sincronizar historial de palabras frecuentes
- [ ] Reglas de seguridad Firestore para producción

### Fase 5 — Landing Page

- [x] Routing raíz inteligente: comunicador o landing según auth
- [x] Hero + Features + Cómo funciona + CTA + Footer
- [x] Temas: Aurora (oscuro) y Crepúsculo (claro)
- [ ] Animaciones de entrada
- [ ] Responsivo mobile verificado en dispositivos reales

### Fase 6 — IA Contextual (Gemini)

- [ ] Integración Gemini `gemini-2.5-flash-lite`
- [ ] Predicción contextual basada en texto compuesto
- [ ] Fallback automático a diccionario offline sin conexión

### Fase 7 — TTS Neural (Google Cloud)

- [ ] Google Cloud TTS Neural2, región `southamerica-east1`
- [ ] Selector de voces premium en sidebar
- [ ] Fallback a Web Speech API offline

### Fase 8 — SIVOX Blink (acceso por parpadeo)

- [ ] Detección facial con MediaPipe en navegador (WebAssembly)
- [ ] Detección de parpadeo voluntario vs. involuntario
- [ ] Configuración de sensibilidad y umbral
- [ ] Integración como método de acceso nativo en SIVOX AAC

### Fase 9 — Hardware SIVOX Access Core

- [ ] Diseño de firmware para ESP32 / RP2040
- [ ] Protocolo USB HID y Bluetooth HID
- [ ] Soporte entrada Jack 3.5 mm (estándar AT-switch)
- [ ] Configuración de sensibilidad via web
- [ ] Prototipo funcional para validación clínica

### Fase 10 — Google Play Store (TWA)

- [ ] Empaquetado con Bubblewrap (Trusted Web Activity)
- [ ] Assets de Play Store
- [ ] Digital Asset Links para verificación TWA
- [ ] Publicación en Play Store — categoría Accesibilidad

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
VITE_GEMINI_API_KEY=          # Requerido en Fase 6
```

---

## Paleta visual

| Token | Valor | Uso |
|-------|-------|-----|
| `#000020` | Background principal | Fondo de pantalla dark |
| `#00BFFF` | sivox-500 — acento | Títulos, scan-cell, CTAs |
| `#5F33FF` | xcail-purple | Gradiente botones XCAIL |
| `#fca311` | xcail-action | SOS, alertas, acciones críticas |
| `rgba(0,191,255,0.30)` | sivox-scan-row | Fila activa en barrido |
| `rgba(0,191,255,0.80)` | sivox-scan-cell | Celda activa en barrido |

---

## Posicionamiento de marca

**XCAIL Technologies SAS** desarrolla soluciones de inteligencia artificial, accesibilidad y neurodesarrollo para Latinoamérica.

Dentro del ecosistema de productos:

- **AsisTEA** — Plataforma de acompañamiento para personas neurodivergentes y sus familias. `asistea.app`
- **SIVOX** — Plataforma universal de accesibilidad, comunicación aumentativa y control asistido por IA.

La visión de largo plazo es consolidar a XCAIL como la empresa de referencia en tecnología asistiva e inclusión digital en el mundo hispanohablante, combinando software de clase mundial, inteligencia artificial y hardware accesible producido regionalmente.

---

*XCAIL Technologies SAS — Buenos Aires, Argentina — `tech@xcail.com`*
