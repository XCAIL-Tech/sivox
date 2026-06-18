import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ThemeId } from "@/lib/landingThemes";

interface LandingThemeStore {
  themeId: ThemeId;
  isDark: boolean;
  setThemeId: (id: ThemeId) => void;
  toggleDark: () => void;
}

export const useLandingThemeStore = create<LandingThemeStore>()(
  persist(
    (set, get) => ({
      themeId: "E",
      isDark: false,
      setThemeId: (id) => set({ themeId: id }),
      toggleDark: () => {
        const next = !get().isDark;
        set({ isDark: next, themeId: next ? "B" : "E" });
      },
    }),
    { name: "sivox-theme-v2" }
  )
);
