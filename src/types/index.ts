export type ScanLevel = "row" | "cell" | "idle";

export type ScanState =
  | { level: "row"; activeRow: number }
  | { level: "cell"; activeRow: number; activeCell: number }
  | { level: "idle" };

export type KeyboardLayout = "qwerty" | "alphabetical";

export type TTSEngine = "web" | "gcp";

export type AppTheme = "dark" | "light";

export type AppLanguage = "es" | "en";

export interface SivoxSettings {
  rowSpeed: number;
  cellSpeed: number;
  pauseOnEnterRow: number;
  layout: KeyboardLayout;
  ttsVoice: string;
  ttsRate: number;
  ttsPitch: number;
  ttsEngine: TTSEngine;
  theme: AppTheme;
  language: AppLanguage;
  autoPauseAfter: number;
}

export type Row0Mode = "predictions" | "frases" | "numeros";

export type GridCellType =
  | "letter" | "space" | "punctuation" | "prediction" | "speak"
  | "backspace" | "clear" | "caps" | "enter" | "empty"
  | "frases" | "numeros" | "back" | "number" | "frase"
  | "sos" | "sos-continue" | "sos-cancel-init" | "sos-confirm-cancel" | "sos-confirm-continue"
  | "indicator";

export interface GridCell {
  id: string;
  label: string;
  type: GridCellType;
  value?: string;
  span?: number; // columnas CSS que ocupa la celda (default: 1)
}
