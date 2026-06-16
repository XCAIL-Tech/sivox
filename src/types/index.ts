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

export interface GridCell {
  id: string;
  label: string;
  type: "letter" | "space" | "backspace" | "clear" | "speak" | "enter" | "caps" | "numbers" | "punctuation" | "prediction";
  value?: string;
  action?: string;
}
