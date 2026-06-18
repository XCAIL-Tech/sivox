import { Link } from "react-router-dom";
import { Mic2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { LANDING_THEMES } from "@/lib/landingThemes";
import { useLandingThemeStore } from "@/store/useLandingThemeStore";

export function NavBar() {
  const { themeId, isDark, toggleDark } = useLandingThemeStore();
  const theme = LANDING_THEMES[themeId];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full flex justify-center border-b",
        "backdrop-blur-[12px] backdrop-saturate-150",
        theme.navBg,
      )}
    >
      <div className="flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 select-none hover:opacity-80 transition-opacity">
          <div className={cn(
            "relative h-[44px] w-[44px] rounded-xl flex items-center justify-center",
            theme.iconBox,
          )}>
            <Mic2 className={cn("w-5 h-5", theme.iconColor)} />
          </div>
          <span className={cn("font-bold text-lg tracking-wide", theme.navLogo)}>SIVOX</span>
        </Link>

        {/* Acciones */}
        <nav className="flex items-center gap-2">

          {/* Toggle claro/oscuro */}
          <button
            onClick={toggleDark}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all border",
              theme.navBtnOutline,
            )}
            title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {isDark
              ? <Sun className="w-4 h-4" />
              : <Moon className="w-4 h-4" />
            }
          </button>

          <Link
            to="/login"
            className={cn(
              "hidden sm:flex items-center h-9 px-4 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 transition-all active:scale-95",
              theme.navBtnOutline,
            )}
          >
            Ingresar
          </Link>
          <Link
            to="/registro"
            className={cn(
              "flex items-center h-9 px-5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-md hover:scale-105 active:scale-95 transition-all duration-300",
              theme.navBtnPrimary,
            )}
          >
            Comenzar
          </Link>
        </nav>
      </div>
    </header>
  );
}
