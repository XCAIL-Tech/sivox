import { useSivoxStore } from "@/store/useSivoxStore";
import { cn } from "@/lib/utils";

export function TextDisplay() {
  const { composedText, isCapsLock } = useSivoxStore();

  return (
    <div
      className={cn(
        "w-full rounded-xl border border-border bg-card px-4 py-3",
        "min-h-[72px] flex items-center gap-2"
      )}
      role="status"
      aria-live="polite"
      aria-label="Texto compuesto"
    >
      {isCapsLock && (
        <span className="text-xs font-semibold uppercase text-sivox-500 shrink-0">
          MAY
        </span>
      )}
      <p className="flex-1 text-xl font-bold leading-snug text-foreground break-words min-h-[28px]">
        {composedText}
        {composedText && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
