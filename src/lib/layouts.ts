import type { GridCell } from "@/types";

export const QWERTY_ROWS: GridCell[][] = [
  // Fila 1
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((l): GridCell => ({
    id: `key-${l}`,
    label: l,
    type: "letter",
    value: l.toLowerCase(),
  })),
  // Fila 2
  ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"].map((l): GridCell => ({
    id: `key-${l}`,
    label: l,
    type: "letter",
    value: l.toLowerCase(),
  })),
  // Fila 3
  (["Z", "X", "C", "V", "B", "N", "M"].map((l): GridCell => ({
    id: `key-${l}`,
    label: l,
    type: "letter",
    value: l.toLowerCase(),
  })) as GridCell[]).concat([
    { id: "key-space", label: "⎵", type: "space", value: " " },
    { id: "key-dot", label: ".", type: "punctuation", value: "." },
    { id: "key-comma", label: ",", type: "punctuation", value: "," },
  ]),
  // Fila 4 — acciones
  [
    { id: "key-backspace", label: "⌫", type: "backspace" },
    { id: "key-question", label: "?", type: "punctuation", value: "?" },
    { id: "key-exclamation", label: "!", type: "punctuation", value: "!" },
    { id: "key-semicolon", label: ";", type: "punctuation", value: ";" },
    { id: "key-dash", label: "-", type: "punctuation", value: "-" },
    { id: "key-numbers", label: "#", type: "numbers" },
    { id: "key-caps", label: "↑", type: "caps" },
    { id: "key-speak", label: "🔊", type: "speak" },
    { id: "key-clear", label: "⬛", type: "clear" },
    { id: "key-enter", label: "↵", type: "enter", value: "\n" },
  ],
];

export const ALPHABETICAL_ROWS: GridCell[][] = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((l) => ({
    id: `key-${l}`,
    label: l,
    type: "letter" as const,
    value: l.toLowerCase(),
  })),
  ["K", "L", "M", "N", "Ñ", "O", "P", "Q", "R", "S"].map((l) => ({
    id: `key-${l}`,
    label: l,
    type: "letter" as const,
    value: l.toLowerCase(),
  })),
  (["T", "U", "V", "W", "X", "Y", "Z"].map((l): GridCell => ({
    id: `key-${l}`,
    label: l,
    type: "letter",
    value: l.toLowerCase(),
  })) as GridCell[]).concat([
    { id: "key-space", label: "⎵", type: "space", value: " " },
    { id: "key-dot", label: ".", type: "punctuation", value: "." },
    { id: "key-comma", label: ",", type: "punctuation", value: "," },
  ]),
  [
    { id: "key-backspace", label: "⌫", type: "backspace" },
    { id: "key-question", label: "?", type: "punctuation", value: "?" },
    { id: "key-exclamation", label: "!", type: "punctuation", value: "!" },
    { id: "key-semicolon", label: ";", type: "punctuation", value: ";" },
    { id: "key-dash", label: "-", type: "punctuation", value: "-" },
    { id: "key-numbers", label: "#", type: "numbers" },
    { id: "key-caps", label: "↑", type: "caps" },
    { id: "key-speak", label: "🔊", type: "speak" },
    { id: "key-clear", label: "⬛", type: "clear" },
    { id: "key-enter", label: "↵", type: "enter", value: "\n" },
  ],
];
