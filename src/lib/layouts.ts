import type { GridCell, KeyboardLayout, Row0Mode } from "@/types";
import { QUICK_PHRASES } from "@/config/defaults";

// ─── Fila 0: predicciones | frases rápidas | números ─────────────────────────
function buildRow0(predictions: string[], mode: Row0Mode): GridCell[] {
  if (mode === "frases") {
    return [
      { id: "key-back", label: "← VOLVER", type: "back" },
      ...QUICK_PHRASES.map((frase, i): GridCell => ({
        id: `frase-${i}`,
        label: frase,
        type: "frase",
        value: frase,
      })),
    ]; // 10 celdas: ← + 9 frases
  }

  if (mode === "numeros") {
    return [
      { id: "key-back", label: "← VOLVER", type: "back" },
      ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n): GridCell => ({
        id: `num-${n}`,
        label: String(n),
        type: "number",
        value: String(n),
      })),
    ]; // 11 celdas: ← + 1-9 + 0
  }

  // Modo normal: predicciones — label en MAYÚSCULAS para legibilidad AAC
  const predCells: GridCell[] = Array.from({ length: 8 }, (_, i): GridCell => {
    const word = predictions[i];
    return word
      ? { id: `pred-${i}`, label: word.toUpperCase(), type: "prediction", value: word }
      : { id: `pred-empty-${i}`, label: "", type: "empty" };
  });

  return [
    ...predCells,
    { id: "key-frases", label: "⚡ FRASES", type: "frases" },
    { id: "key-numeros", label: "123", type: "numeros" },
  ]; // 10 celdas: pred0-pred7 primero, meta-botones al final
}

// ─── Filas de letras QWERTY ───────────────────────────────────────────────────
// Row 1: ⎵ + Q-O
// Row 2: 🔊 + A-L
// Row 3: ⌫ + Z-Ñ + P  (todas las letras restantes)
// Row 4: ⬛ + . + , + ? + 🆘 SOS(span=6)  → total 10 columnas CSS
const QWERTY_ROWS: GridCell[][] = [
  [
    { id: "key-space", label: "⎵", type: "space", value: " " },
    ...["Q", "W", "E", "R", "T", "Y", "U", "I", "O"].map((l): GridCell => ({
      id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
    })),
  ],
  [
    { id: "key-speak", label: "🔊", type: "speak" },
    ...["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((l): GridCell => ({
      id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
    })),
  ],
  [
    { id: "key-backspace", label: "⌫", type: "backspace" },
    ...["Z", "X", "C", "V", "B", "N", "M", "Ñ", "P"].map((l): GridCell => ({
      id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
    })),
  ],
  [
    { id: "key-clear", label: "⬛", type: "clear" },
    { id: "key-dot", label: ".", type: "punctuation", value: "." },
    { id: "key-comma", label: ",", type: "punctuation", value: "," },
    { id: "key-question", label: "?", type: "punctuation", value: "?" },
    { id: "key-sos", label: "🆘 SOS", type: "sos", span: 6 },
  ],
];

// ─── Filas de letras Alfabético ───────────────────────────────────────────────
// Row 1: ⎵ + A-I
// Row 2: 🔊 + J-Q
// Row 3: ⌫ + R-Z
// Row 4: ⬛ + . + , + ? + 🆘 SOS + 5 vacías
const ALPHA_ROWS: GridCell[][] = [
  [
    { id: "key-space", label: "⎵", type: "space", value: " " },
    ...["A", "B", "C", "D", "E", "F", "G", "H", "I"].map((l): GridCell => ({
      id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
    })),
  ],
  [
    { id: "key-speak", label: "🔊", type: "speak" },
    ...["J", "K", "L", "M", "N", "Ñ", "O", "P", "Q"].map((l): GridCell => ({
      id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
    })),
  ],
  [
    { id: "key-backspace", label: "⌫", type: "backspace" },
    ...["R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((l): GridCell => ({
      id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
    })),
  ],
  [
    { id: "key-clear", label: "⬛", type: "clear" },
    { id: "key-dot", label: ".", type: "punctuation", value: "." },
    { id: "key-comma", label: ",", type: "punctuation", value: "," },
    { id: "key-question", label: "?", type: "punctuation", value: "?" },
    { id: "key-sos", label: "🆘 SOS", type: "sos", span: 6 },
  ],
];

// ─── Constructor principal ────────────────────────────────────────────────────
// Única fuente de verdad para Grid.tsx y useScanner (vía App.tsx).
// Cada fila comienza con una celda indicadora (▸) — buffer visual antes de la 1ª celda real.
export function buildAllRows(
  predictions: string[],
  layout: KeyboardLayout,
  row0Mode: Row0Mode = "predictions"
): GridCell[][] {
  const row0 = buildRow0(predictions, row0Mode);
  const letterRows = layout === "qwerty" ? QWERTY_ROWS : ALPHA_ROWS;

  return [row0, ...letterRows].map((row, i) => [
    { id: `indicator-r${i}`, label: "▸", type: "indicator" as const },
    ...row,
  ]);
}

// ─── Filas para modo SOS ──────────────────────────────────────────────────────
// El scanner usa estas filas en lugar del teclado normal.
// Cada opción ocupa una fila entera para máxima legibilidad.
export function buildSosRows(confirming: boolean): GridCell[][] {
  if (confirming) {
    return [
      [{ id: "sos-no", label: "↩ NO, CONTINUAR ALERTA", type: "sos-confirm-continue" }],
      [{ id: "sos-yes", label: "✅ SÍ, CANCELAR ALERTA", type: "sos-confirm-cancel" }],
    ];
  }
  return [
    [{ id: "sos-continue", label: "🔔 CONTINUAR ALERTA", type: "sos-continue" }],
    [{ id: "sos-cancel", label: "⛔ CANCELAR ALERTA", type: "sos-cancel-init" }],
  ];
}
