import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScanState, SivoxSettings } from "@/types";
import { DEFAULT_SETTINGS } from "@/config/defaults";
import { speakText } from "@/lib/tts";

interface SivoxState {
  composedText: string;
  scanState: ScanState;
  isScanning: boolean;
  isCapsLock: boolean;
  settings: SivoxSettings;
  predictions: string[];
  wordHistory: Record<string, number>;

  appendChar: (char: string) => void;
  deleteLastChar: () => void;
  clearText: () => void;
  speak: () => void;
  selectPrediction: (word: string) => void;
  toggleCaps: () => void;
  setScanState: (state: ScanState) => void;
  setScanning: (scanning: boolean) => void;
  stopScanning: () => void;
  setPredictions: (words: string[]) => void;
  updateSettings: (partial: Partial<SivoxSettings>) => void;
  recordWordUsage: (word: string) => void;
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

      appendChar: (char) => {
        const { isCapsLock } = get();
        const finalChar = isCapsLock ? char.toUpperCase() : char;
        set((s) => ({ composedText: s.composedText + finalChar }));
        if (navigator.vibrate) navigator.vibrate([20]);
      },

      deleteLastChar: () => {
        set((s) => ({
          composedText: s.composedText.slice(0, -1),
        }));
        if (navigator.vibrate) navigator.vibrate([15]);
      },

      clearText: () => {
        set({ composedText: "" });
        if (navigator.vibrate) navigator.vibrate([30, 10, 30]);
      },

      speak: () => {
        const { composedText, settings } = get();
        speakText(composedText, settings);
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
