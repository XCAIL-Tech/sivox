import { useEffect, useState } from "react";
import { X, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";
import { getUserProfile, type UserProfile } from "@/lib/userProfile";
import { useSivoxStore } from "@/store/useSivoxStore";
import { SPEED_PRESETS } from "@/config/defaults";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth();
  const { settings, updateSettings } = useSivoxStore(s => ({
    settings: s.settings,
    updateSettings: s.updateSettings,
  }));
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!open || !user) return;
    getUserProfile(user.uid).then(p => { if (p) setProfile(p); }).catch(() => {});
  }, [open, user]);

  const displayName = profile?.user_name ?? profile?.name ?? user?.displayName ?? "Usuario";
  const initials = displayName.charAt(0).toUpperCase();
  const email = user?.email ?? "";
  const country = profile?.country ?? "";

  const activePresetIdx = SPEED_PRESETS.findIndex(p => p.rowSpeed === settings.rowSpeed);

  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 max-w-[88vw] z-50 flex flex-col",
        "bg-card border-l border-border/50 shadow-2xl",
        "transition-transform duration-300 ease-out",
        open ? "translate-x-0" : "translate-x-full",
      )}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/30 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-sivox-500" />
            <span className="font-black text-sm tracking-widest text-foreground uppercase">Configuración</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">

          {/* Perfil */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/40 border border-border/30">
            <div className="w-12 h-12 rounded-2xl bg-sivox-500/20 border border-sivox-500/30 flex items-center justify-center shrink-0">
              <span className="text-sivox-400 font-black text-lg">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-foreground truncate">{displayName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {country && (
                  <img
                    src={`https://flagcdn.com/w20/${country.toLowerCase()}.png`}
                    alt={profile?.country_name ?? country}
                    className="w-4 rounded-sm opacity-80 shrink-0"
                    loading="lazy"
                  />
                )}
                <p className="text-[11px] text-muted-foreground font-medium truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Teclado */}
          <section className="space-y-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Distribución del teclado
            </p>
            <div className="flex gap-2">
              {(["qwerty", "alphabetical"] as const).map(l => (
                <button
                  key={l}
                  onClick={() => updateSettings({ layout: l })}
                  className={cn(
                    "flex-1 h-10 rounded-xl text-xs font-black border-2 transition-all",
                    settings.layout === l
                      ? "border-sivox-500 bg-sivox-500/10 text-sivox-400"
                      : "border-border/40 text-muted-foreground hover:border-border/70",
                  )}
                >
                  {l === "qwerty" ? "QWERTY" : "A → Z"}
                </button>
              ))}
            </div>
          </section>

          {/* Velocidad */}
          <section className="space-y-2.5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Velocidad del barrido
            </p>
            <div className="flex flex-col gap-1.5">
              {SPEED_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => updateSettings({ rowSpeed: preset.rowSpeed, cellSpeed: preset.cellSpeed })}
                  className={cn(
                    "w-full h-9 rounded-xl text-[11px] font-black border-2 transition-all text-left px-3 flex items-center justify-between",
                    activePresetIdx === idx
                      ? "border-sivox-500 bg-sivox-500/10 text-sivox-400"
                      : "border-border/40 text-muted-foreground hover:border-border/70",
                  )}
                >
                  <span>{preset.label}</span>
                  <span className={cn(
                    "text-[10px] font-bold",
                    activePresetIdx === idx ? "text-sivox-500/60" : "text-muted-foreground/40"
                  )}>
                    {preset.rowSpeed}ms
                  </span>
                </button>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="shrink-0 px-5 pb-6 pt-3 border-t border-border/30">
          <button
            onClick={signOut}
            className={cn(
              "w-full h-11 rounded-xl flex items-center justify-center gap-2",
              "border-2 border-border/40 text-sm font-black text-muted-foreground",
              "hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all",
            )}
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>

      </div>
    </>
  );
}
