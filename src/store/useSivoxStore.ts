import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScanState, SivoxSettings, Row0Mode } from "@/types";
import { DEFAULT_SETTINGS } from "@/config/defaults";
import { speakText } from "@/lib/tts";
import { startSiren, stopSiren } from "@/lib/sos";

interface SivoxState {
  composedText: string;
  scanState: ScanState;
  isScanning: boolean;
  isCapsLock: boolean;
  settings: SivoxSettings;
  predictions: string[];
  wordHistory: Record<string, number>;
  row0Mode: Row0Mode;
  isSos: boolean;
  sosConfirming: boolean;

  appendChar: (char: string) => void;
  deleteLastChar: () => void;
  clearText: () => void;
  speak: () => void;
  selectPrediction: (word: string) => void;
  applyFrase: (text: string) => void;
  toggleCaps: () => void;
  setScanState: (state: ScanState) => void;
  setScanning: (scanning: boolean) => void;
  stopScanning: () => void;
  setPredictions: (words: string[]) => void;
  updateSettings: (partial: Partial<SivoxSettings>) => void;
  recordWordUsage: (word: string) => void;
  setRow0Mode: (mode: Row0Mode) => void;
  activateSos: () => void;
  continueSos: () => void;
  initiateCancelSos: () => void;
  confirmCancelSos: () => void;
}

export const useSivoxStore = create<SivoxState>()(
  persist(
    (set, get) => ({
      composedText: "",
      scanState: { level: "idle" },
      isScanning: false,
      isCapsLock: false,
      settings: DEFAULT_SETTINGS,
      predictions: [],
      wordHistory: {},
      row0Mode: "predictions",
      isSos: false,
      sosConfirming: false,

      appendChar: (char) => {
        const { isCapsLock } = get();
        const finalChar = isCapsLock ? char.toUpperCase() : char;
        set((s) => ({ composedText: s.composedText + finalChar }));
        if (navigator.vibrate) navigator.vibrate([20]);
      },

      deleteLastChar: () => {
        set((s) => ({ composedText: s.composedText.slice(0, -1) }));
        if (navigator.vibrate) navigator.vibrate([15]);
      },

      clearText: () => {
        set({ composedText: "" });
        if (navigator.vibrate) navigator.vibrate([30, 10, 30]);
      },

      speak: () => {
        const { composedText, settings } = get();
        if (!composedText.trim()) return;
        speakText(composedText, settings);
        // Limpiar texto tras hablar — mensaje entregado
        setTimeout(() => set({ composedText: "" }), 150);
        if (navigator.vibrate) navigator.vibrate([20]);
      },

      selectPrediction: (word) => {
        const { composedText, recordWordUsage } = get();
        const words = composedText.split(" ");
        words[words.length - 1] = word;
        const newText = words.join(" ") + " ";
        set({ composedText: newText });
        recordWordUsage(word);
        if (navigator.vibrate) navigator.vibrate([20]);
      },

      applyFrase: (text) => {
        set({ composedText: text });
        if (navigator.vibrate) navigator.vibrate([20]);
      },

      toggleCaps: () => {
        set((s) => ({ isCapsLock: !s.isCapsLock }));
      },

      setScanState: (scanState) => set({ scanState }),

      setScanning: (isScanning) => set({ isScanning }),

      stopScanning: () => {
        set({ isScanning: false, scanState: { level: "idle" } });
        if (navigator.vibrate) navigator.vibrate([15, 10, 15]);
      },

      setPredictions: (predictions) => set({ predictions }),

      updateSettings: (partial) => {
        set((s) => ({ settings: { ...s.settings, ...partial } }));
      },

      recordWordUsage: (word) => {
        set((s) => ({
          wordHistory: {
            ...s.wordHistory,
            [word]: (s.wordHistory[word] ?? 0) + 1,
          },
        }));
      },

      setRow0Mode: (mode) => set({ row0Mode: mode }),

      activateSos: () => {
        set({ isSos: true, sosConfirming: false, composedText: "🆘 NECESITO AYUDA" });
        startSiren();
        if (navigator.vibrate) navigator.vibrate([300, 100, 300, 100, 300]);
      },

      continueSos: () => {
        set({ sosConfirming: false });
      },

      initiateCancelSos: () => {
        set({ sosConfirming: true });
      },

      confirmCancelSos: () => {
        stopSiren();
        set({ isSos: false, sosConfirming: false, composedText: "" });
        if (navigator.vibrate) navigator.vibrate([50]);
      },
    }),
    {
      name: "sivox-store",
      partialize: (s) => ({
        settings: s.settings,
        wordHistory: s.wordHistory,
      }),
    }
  )
);
