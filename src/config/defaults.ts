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

export const SPEED_PRESETS = [
  { label: "Muy lento", rowSpeed: 3000, cellSpeed: 2000 },
  { label: "Lento",     rowSpeed: 2000, cellSpeed: 1400 },
  { label: "Medio",     rowSpeed: 1500, cellSpeed: 800  },
  { label: "Rápido",    rowSpeed: 900,  cellSpeed: 500  },
  { label: "Muy rápido", rowSpeed: 500, cellSpeed: 300  },
] as const;

export type SpeedPresetIndex = 0 | 1 | 2 | 3 | 4;
