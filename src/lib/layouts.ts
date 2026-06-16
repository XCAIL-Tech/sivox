import type { GridCell, KeyboardLayout } from "@/types";

// ─── Fila de acciones rápidas ────────────────────────────────────────────────
// Siempre es la Row 1 (después de predicciones).
// Las funciones más críticas van en los primeros puestos para minimizar
// el tiempo de barrido necesario para alcanzarlas.
export const ACTIONS_ROW: GridCell[] = [
  { id: "key-backspace",    label: "⌫",  type: "backspace" },
  { id: "key-clear",        label: "⬛",  type: "clear" },
  { id: "key-dot",          label: ".",   type: "punctuation", value: "." },
  { id: "key-comma",        label: ",",   type: "punctuation", value: "," },
  { id: "key-question",     label: "?",   type: "punctuation", value: "?" },
  { id: "key-exclamation",  label: "!",   type: "punctuation", value: "!" },
  { id: "key-caps",         label: "↑",   type: "caps" },
  { id: "key-numbers",      label: "#",   type: "numbers" },
  { id: "key-semicolon",    label: ";",   type: "punctuation", value: ";" },
  { id: "key-dash",         label: "-",   type: "punctuation", value: "-" },
];

// ─── Filas de letras QWERTY ──────────────────────────────────────────────────
const QWERTY_LETTER_ROWS: GridCell[][] = [
  ["Q","W","E","R","T","Y","U","I","O","P"].map((l): GridCell => ({
    id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
  })),
  ["A","S","D","F","G","H","J","K","L","Ñ"].map((l): GridCell => ({
    id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
  })),
  // Última fila: letras + puntuación específica del español
  (["Z","X","C","V","B","N","M"].map((l): GridCell => ({
    id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
  })) as GridCell[]).concat([
    { id: "key-invquestion", label: "¿", type: "punctuation", value: "¿" },
    { id: "key-invexcl",     label: "¡", type: "punctuation", value: "¡" },
    { id: "key-at",          label: "@", type: "punctuation", value: "@" },
  ]),
];

// ─── Filas de letras Alfabético ──────────────────────────────────────────────
const ALPHA_LETTER_ROWS: GridCell[][] = [
  ["A","B","C","D","E","F","G","H","I","J"].map((l): GridCell => ({
    id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
  })),
  ["K","L","M","N","Ñ","O","P","Q","R","S"].map((l): GridCell => ({
    id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
  })),
  (["T","U","V","W","X","Y","Z"].map((l): GridCell => ({
    id: `key-${l}`, label: l, type: "letter", value: l.toLowerCase(),
  })) as GridCell[]).concat([
    { id: "key-invquestion", label: "¿", type: "punctuation", value: "¿" },
    { id: "key-invexcl",     label: "¡", type: "punctuation", value: "¡" },
    { id: "key-at",          label: "@", type: "punctuation", value: "@" },
  ]),
];

// ─── Constructor de filas completo ───────────────────────────────────────────
// Única fuente de verdad para Grid.tsx y useScanner (via App.tsx).
// Row 0: 8 predicciones + ⎵ ESPACIO + 🔊 HABLAR (siempre accesibles en fila 1)
// Row 1: Acciones (⌫ ⬛ . , ? ! ↑ # ; -)
// Rows 2-4: Letras
export function buildAllRows(
  predictions: string[],
  layout: KeyboardLayout
): GridCell[][] {
  const predRow: GridCell[] = [
    ...Array.from({ length: 8 }, (_, i): GridCell => {
      const word = predictions[i];
      return word
        ? { id: `pred-${i}`, label: word, type: "prediction", value: word }
        : { id: `pred-empty-${i}`, label: "", type: "prediction" };
    }),
    { id: "pred-space", label: "⎵", type: "space", value: " " },
    { id: "pred-speak", label: "🔊", type: "speak" },
  ];

  const letterRows = layout === "qwerty" ? QWERTY_LETTER_ROWS : ALPHA_LETTER_ROWS;

  return [predRow, ACTIONS_ROW, ...letterRows];
}
