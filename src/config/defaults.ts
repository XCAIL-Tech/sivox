import type { SivoxSettings } from "@/types";

export const DEFAULT_SETTINGS: SivoxSettings = {
  rowSpeed: 1500,
  cellSpeed: 800,
  pauseOnEnterRow: 200,
  layout: "qwerty",
  ttsVoice: "",
  ttsRate: 0.9,
  ttsPitch: 1.0,
  ttsEngine: "web",
  theme: "dark",
  language: "es",
  autoPauseAfter: 30,
};

export const SCAN_SPEEDS = {
  row: { min: 500, max: 4000, default: 1500, step: 100 },
  cell: { min: 200, max: 3000, default: 800, step: 100 },
  pause: { min: 0, max: 1000, default: 200, step: 50 },
};
