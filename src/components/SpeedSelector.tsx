import { useSivoxStore } from "@/store/useSivoxStore";
import { SPEED_PRESETS } from "@/config/defaults";
import { cn } from "@/lib/utils";

export function SpeedSelector() {
  const { settings, updateSettings } = useSivoxStore();

  const activeIndex = SPEED_PRESETS.findIndex(
    (p) => p.rowSpeed === settings.rowSpeed && p.cellSpeed === settings.cellSpeed
  );

  const handleSelect = (index: number) => {
    const preset = SPEED_PRESETS[index];
    updateSettings({ rowSpeed: preset.rowSpeed, cellSpeed: preset.cellSpeed });
  };

  return (
    <div className="flex items-center gap-1.5 px-2">
      <span className="text-xs text-muted-foreground shrink-0 font-medium">
        Velocidad:
      </span>
      <div className="flex gap-1 flex-1">
        {SPEED_PRESETS.map((preset, i) => (
          <button
            key={i}
            onClick={() => handleSelect(i)}
            title={preset.label}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-100",
              "select-none focus:outline-none active:scale-95",
              activeIndex === i
                ? "bg-sivox-500 text-background shadow-sm shadow-sivox-500/40"
                : "bg-muted text-muted-foreground hover:bg-secondary"
            )}
            aria-pressed={activeIndex === i}
            aria-label={preset.label}
          >
            {i === 0 && "🐢"}
            {i === 1 && "🐌"}
            {i === 2 && "●"}
            {i === 3 && "▶"}
            {i === 4 && "⚡"}
          </button>
        ))}
      </div>
      <span className="text-xs text-muted-foreground shrink-0 min-w-[5rem] text-right">
        {SPEED_PRESETS[activeIndex]?.label ?? "Personalizado"}
      </span>
    </div>
  );
}
